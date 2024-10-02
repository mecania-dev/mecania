from django.urls import path, include

from .views import keep_alive_view

urlpatterns = [
    path("keep-alive/", keep_alive_view, name="keep_alive"),
    path("auth/", include("authentication.urls")),
    path("users/", include("users.urls")),
    path("addresses/", include("addresses.urls")),
    path("services/", include("services.urls")),
    path("vehicles/", include("vehicles.urls")),
    path("chat/", include("chat.urls")),
    path("ratings/", include("ratings.urls")),
]
