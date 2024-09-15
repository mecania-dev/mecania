from django.urls import path, include
from rest_framework_simplejwt.views import TokenVerifyView
from .views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    PermissionsView,
)

urlpatterns = [
    path("rest-framework/", include("rest_framework.urls")),
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("refresh/", CustomTokenRefreshView.as_view(), name="refresh"),
    path("verify/", TokenVerifyView.as_view(), name="verify"),
    path("permissions/", PermissionsView.as_view(), name="permissions"),
]
