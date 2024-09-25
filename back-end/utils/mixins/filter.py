from django.db.models import Field


class FiltersMixin:
    not_allowed_filters = []

    def get_filter_params(self):
        """
        Get a dictionary of filterable params based on not allowed filters.
        """
        filter_params = {}
        model_fields = [f.name for f in self.queryset.model._meta.get_fields() if isinstance(f, Field)]

        for key, value in self.request.query_params.items():
            if key not in self.not_allowed_filters and key in model_fields and value:
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
