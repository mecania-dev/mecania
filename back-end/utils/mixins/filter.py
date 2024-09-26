from utils.assertions import is_false


class FiltersMixin:
    not_allowed_filters = ["paginate"]

    def get_filter_params(self):
        query_params: dict = self.request.query_params
        no_pagination = is_false(query_params.get("paginate", "true"))

        if no_pagination:
            self.pagination_class = None

        """
        Get a dictionary of filterable params based on not allowed filters.
        """
        filter_params = {}

        for key, value in query_params.items():
            if key not in self.not_allowed_filters and value:
                filter_params[key] = value

        return filter_params

    def filter_queryset(self, queryset):
        """
        Filter the queryset dynamically based on the query parameters, excluding not allowed filters.
        """
        filter_params = self.get_filter_params()
        if filter_params:
            queryset = queryset.filter(**filter_params)
        return queryset

    def get_queryset(self):
        """
        Override get_queryset to automatically apply filters.
        """
        queryset = super().get_queryset()
        return self.filter_queryset(queryset)
