from django.urls import path

from . import views
from addresses.views import AddressCreateUpdateView
from vehicles.views import VehicleCreateUpdateView
from services.views import ServiceAddRemoveView

urlpatterns = [
    path("", views.UserListCreate.as_view(), name="user-list-create"),
    path("<int:pk>/", views.UserRetrieveUpdateDestroy.as_view(), name="user-retrieve-update-destroy"),
    path('<int:user_id>/addresses/', AddressCreateUpdateView.as_view(), name='add-address'),
    path('<int:user_id>/addresses/<int:address_id>/', AddressCreateUpdateView.as_view(), name='update-address'),
    path('<int:user_id>/vehicles/', VehicleCreateUpdateView.as_view(), name='add-vehicle'),
    path('<int:user_id>/vehicles/<int:vehicle_id>/', VehicleCreateUpdateView.as_view(), name='update-vehicle'),
    path('<int:user_id>/services/', ServiceAddRemoveView.as_view(), name='add-services'),
    path('<int:user_id>/services/<int:service_id>/', ServiceAddRemoveView.as_view(), name='remove-services'),
]
