import time

from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from users.models import User


def set_cookies(response):
    if settings.DEBUG:
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
