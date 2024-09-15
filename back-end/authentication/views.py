import time

from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from rest_framework.viewsets import ReadOnlyModelViewSet
from django.contrib.auth.models import Permission

from .serializers import PermissionSerializer
from users.models import User
from users.serializers import UserRetrieveDestroySerializer


def set_cookies(response):
    # Disabled it because it wasnt necessary anymore
    if True:
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        return

    access = response.data.get("access")
    refresh = response.data.get("refresh")

    access_token = AccessToken(access)
    refresh_token = RefreshToken(refresh)

    response.set_cookie(
        "access",
        access,
        max_age=access_token["exp"] - int(time.time()),
        path=settings.AUTH_COOKIE_PATH,
        secure=settings.AUTH_COOKIE_SECURE,
        httponly=settings.AUTH_COOKIE_HTTP_ONLY,
        samesite=settings.AUTH_COOKIE_SAMESITE,
    )
    response.set_cookie(
        "refresh",
        refresh,
        max_age=refresh_token["exp"] - int(time.time()),
        path=settings.AUTH_COOKIE_PATH,
        secure=settings.AUTH_COOKIE_SECURE,
        httponly=settings.AUTH_COOKIE_HTTP_ONLY,
        samesite=settings.AUTH_COOKIE_SAMESITE,
    )


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        login = request.data["login"]
        user = User.objects.filter(email=login).first() or User.objects.filter(username=login).first()
        request.data["username"] = user.username if user else login

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            response.data["user"] = UserRetrieveDestroySerializer(user).data
            set_cookies(response)

        return response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh")

        if refresh_token:
            request.data["refresh"] = refresh_token

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            set_cookies(response)

        return response


class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        access_token = request.COOKIES.get("access")

        if access_token:
            request.data["token"] = access_token

        return super().post(request, *args, **kwargs)


class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie("access")
        response.delete_cookie("refresh")

        return response


class PermissionsView(APIView):
    def get(self, request, *args, **kwargs):
        only_codenames = request.query_params.get("only_codenames", "false").lower() == "true"

        permissions = Permission.objects.all()

        if only_codenames:
            permission_codenames = permissions.values_list("codename", flat=True)
            return Response(permission_codenames)
        else:
            serializer = PermissionSerializer(permissions, many=True)
            return Response(serializer.data)
