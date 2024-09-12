from django.urls import path

from . import views

urlpatterns = [
    path("", views.ServiceListCreateView.as_view(), name="service-list-create"),
    path("<int:pk>/", views.ServiceRetrieveUpdateDestroyView.as_view(), name="service-retrieve-update-destroy"),
]
