from django.db.models import Avg, FloatField, Func, Q, QuerySet
from utils.assertions import is_bool, is_true, is_false

DISALLOWED_FILTERS = ["paginate", "limit", "offset", "ordering"]


def as_bool_or_original(value):
    if isinstance(value, list):
        return [as_bool_or_original(v) for v in value]
    return is_true(value) if is_bool(value) else value


class Round(Func):
    function = "ROUND"


class DynamicQuerysetMixin:
    not_allowed_filters = []

    def filter_queryset(self, queryset: QuerySet):
        query_params: dict = self.request.query_params
        all_disallowed_filters = set(DISALLOWED_FILTERS).union(self.not_allowed_filters)
        filter_params = {
            key: as_bool_or_original(value.split(",") if "__" in key and "," in value else value)
            for key, value in query_params.items()
            if key not in all_disallowed_filters and not "__not" in key and not "__avg" in key and value
        }
        exclude_params = {
            key.replace("__not", ""): as_bool_or_original(
                value.split(",") if "__" in key.replace("__not", "") and "," in value else value
            )
            for key, value in query_params.items()
            if "__not" in key and value
        }
        average_params = {
            key: value.split(",") if "," in value else value
            for key, value in query_params.items()
            if "__avg" in key and value
        }

        # Filter queryset
        try:
            if filter_params:
                queryset = queryset.filter(**filter_params)
        except:
            pass
        # Exclude queryset
        try:
            if exclude_params:
                queryset = queryset.exclude(**exclude_params)
        except:
            pass
        # Average queryset
        try:
            for param, avg_value in average_params.items():
                field_name = param.replace("__avg", "")
                queryset = queryset.annotate(**{param: Round(Avg(field_name) * 2, output_field=FloatField()) / 2})

                if isinstance(avg_value, list) and len(avg_value) >= 2:
                    min_value = float(avg_value[0])
                    max_value = float(avg_value[1])
                    queryset = queryset.filter(Q(**{f"{param}__gte": min_value}) & Q(**{f"{param}__lte": max_value}))
                else:
                    queryset = queryset.filter(**{f"{param}__gte": float(avg_value)})
        except:
            pass

        return queryset

    def order_queryset(self, queryset: QuerySet):
        query_params: dict = self.request.query_params
        ordering = query_params.get("ordering", "")

        if ordering:
            queryset = queryset.order_by(*ordering.split(","))

        return queryset

    def get_queryset(self):
        query_params: dict = self.request.query_params
        no_pagination = is_false(query_params.get("paginate", "true"))

        if no_pagination:
            self.pagination_class = None

        queryset = super().get_queryset()
        queryset = self.filter_queryset(queryset)
        queryset = self.order_queryset(queryset)
        return queryset.distinct()


class UserQuerysetMixin:
    user_field = "user"
    allow_staff_view = False

    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        qs = super().get_queryset(*args, **kwargs)

        # Allow staff users to view all records if enabled
        if self.allow_staff_view and user.is_staff:
            return qs

        # Build the filter criteria
        if isinstance(self.user_field, list):
            # Use Q objects for filtering by multiple user fields
            from django.db.models import Q

            filter_query = Q()
            for field in self.user_field:
                filter_query |= Q(**{field: user})

            return qs.filter(filter_query)

        # If user_field is a single field, apply a direct filter
        return qs.filter(**{self.user_field: user})
