from django.urls import path, include
from .views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    CustomTokenVerifyView,
    LogoutView,
    PermissionsView,
)

urlpatterns = [
    path("rest-framework/", include("rest_framework.urls")),
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("refresh/", CustomTokenRefreshView.as_view(), name="refresh"),
    path("verify/", CustomTokenVerifyView.as_view(), name="verify"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("permissions/", PermissionsView.as_view(), name="permissions"),
]
