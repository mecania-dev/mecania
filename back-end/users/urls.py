from django.urls import path

from . import views
from addresses.views import UserAddressesView
from vehicles.views import UserVehiclesView
from services.views import UserServicesView

urlpatterns = [
    path("", views.UserListCreate.as_view(), name="get-post-user"),
    path("me/", views.LoggedUserView.as_view(), name="me"),
    path("mechanics/", views.MechanicsListView.as_view(), name="mechanics-list"),
    path("drivers/", views.DriversListView.as_view(), name="drivers-list"),
    path("<int:pk>/", views.UserRetrieveUpdateDestroy.as_view(), name="get-put-delete-user"),
    path("<int:user_id>/addresses/", UserAddressesView.as_view(), name="get-post-addresses"),
    path("<int:user_id>/addresses/<int:address_id>/", UserAddressesView.as_view(), name="put-delete-addresses"),
    path("<int:user_id>/vehicles/", UserVehiclesView.as_view(), name="get-post-vehicles"),
    path("<int:user_id>/vehicles/<int:vehicle_id>/", UserVehiclesView.as_view(), name="put-delete-vehicles"),
    path("<int:user_id>/services/", UserServicesView.as_view(), name="get-post-delete-services"),
    path("<int:user_id>/services/<int:service_id>/", UserServicesView.as_view(), name="delete-services"),
]
