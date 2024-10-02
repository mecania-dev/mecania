from django.urls import path
from .views import CitiesView

urlpatterns = [
    path("cities/", CitiesView.as_view(), name="cities"),
]
