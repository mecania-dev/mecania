from django.urls import path

from .views import (
    ServiceListCreateView,
    ServiceRetrieveUpdateDestroyView,
    CategoryListCreateView,
    CategoryRetrieveUpdateDestroyView,
)

urlpatterns = [
    path("", ServiceListCreateView.as_view(), name="service-list-create"),
    path("<int:pk>/", ServiceRetrieveUpdateDestroyView.as_view(), name="service-retrieve-update-destroy"),
    path("categories/", CategoryListCreateView.as_view(), name="category-list-create"),
    path("categories/<int:pk>/", CategoryRetrieveUpdateDestroyView.as_view(), name="category-retrieve-update-destroy"),
]
