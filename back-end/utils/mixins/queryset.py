from utils.assertions import is_false

DISALLOWED_FILTERS = ["paginate", "limit", "offset", "ordering"]


class DynamicQuerysetMixin:
    not_allowed_filters = []

    def filter_queryset(self, queryset):
        query_params: dict = self.request.query_params
        all_disallowed_filters = set(DISALLOWED_FILTERS).union(self.not_allowed_filters)
        filter_params = {
            key: value for key, value in query_params.items() if key not in all_disallowed_filters and value
        }

        if filter_params:
            queryset = queryset.filter(**filter_params)

        return queryset

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