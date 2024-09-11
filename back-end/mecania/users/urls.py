from django.urls import path

from . import views
from addresses.views import UserAddressesView
from vehicles.views import UserVehiclesView
from services.views import UserServicesView

urlpatterns = [
    path("", views.UserListCreate.as_view(), name="user-list-create"),
    path("<int:pk>/", views.UserRetrieveUpdateDestroy.as_view(), name="user-retrieve-update-destroy"),
    path('<int:user_id>/addresses/', UserAddressesView.as_view(), name='get-post-address'),
    path('<int:user_id>/addresses/<int:address_id>/', UserAddressesView.as_view(), name='put-delete-address'),
    path('<int:user_id>/vehicles/', UserVehiclesView.as_view(), name='get-post-vehicle'),
    path('<int:user_id>/vehicles/<int:vehicle_id>/', UserVehiclesView.as_view(), name='put-delete-vehicle'),
    path('<int:user_id>/services/', UserServicesView.as_view(), name='get-post-delete-services'),
    path('<int:user_id>/services/<int:service_id>/', UserServicesView.as_view(), name='delete-services'),
]
