from utils.assertions import is_bool, is_true, is_false

DISALLOWED_FILTERS = ["paginate", "limit", "offset", "ordering"]


def as_bool_or_original(value):
    if isinstance(value, list):
        return [as_bool_or_original(v) for v in value]
    return is_true(value) if is_bool(value) else value


class DynamicQuerysetMixin:
    not_allowed_filters = []

    def filter_queryset(self, queryset):
        query_params: dict = self.request.query_params
        all_disallowed_filters = set(DISALLOWED_FILTERS).union(self.not_allowed_filters)
        filter_params = {
            key: as_bool_or_original(value.split(",") if "__" in key and "," in value else value)
            for key, value in query_params.items()
            if key not in all_disallowed_filters and not "__not" in key and value
        }
        exclude_params = {
            key.replace("__not", ""): as_bool_or_original(
                value.split(",") if "__" in key.replace("__not", "") and "," in value else value
            )
            for key, value in query_params.items()
            if "__not" in key and value
        }

        if filter_params:
            queryset = queryset.filter(**filter_params)
        if exclude_params:
            queryset = queryset.exclude(**exclude_params)

        return queryset.distinct()

    def order_queryset(self, queryset):
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
        return queryset


class UserQuerysetMixin:
    user_field = "user"
    allow_staff_view = False

    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        lookup_data = {}
        lookup_data[self.user_field] = self.request.user
        qs = super().get_queryset(*args, **kwargs)

        if self.allow_staff_view and user.is_staff:
            return qs
        return qs.filter(**lookup_data)
