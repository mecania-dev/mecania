from django.urls import path

from .views import VehicleFuelChoicesView, VehicleTransmissionChoicesView

urlpatterns = [
    path("fuel-choices/", VehicleFuelChoicesView.as_view(), name="vehicle-fuel-choices"),
    path("transmission-choices/", VehicleTransmissionChoicesView.as_view(), name="vehicle-transmission-choices"),
]
