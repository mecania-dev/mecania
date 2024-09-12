import time
from datetime import datetime
import pytz

from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)

from users.models import User
from users.serializers import UserRetrieveDestroySerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "login"

    def validate(self, attrs):
        login = attrs.get("login")
        user = User.objects.filter(email=login).first() or User.objects.filter(username=login).first()
        attrs["username"] = user.username if user else login
        self.username_field = "username"

        data = super().validate(attrs)

        access_token = AccessToken(data["access"])
        refresh_token = RefreshToken(data["refresh"])

        # Convert expiration time to UTC
        access_exp = datetime.fromtimestamp(access_token["exp"], pytz.utc)
        refresh_exp = datetime.fromtimestamp(refresh_token["exp"], pytz.utc)
        # Convert issued time to UTC
        access_iat = datetime.fromtimestamp(access_token["iat"], pytz.utc)
        refresh_iat = datetime.fromtimestamp(refresh_token["iat"], pytz.utc)

        data["access"] = {
            "token": data["access"],
            "expires": access_exp.isoformat(),
            "issued_at": access_iat.isoformat(),
            "expires_in": access_token["exp"] - int(time.time()),
        }

        data["refresh"] = {
            "token": data["refresh"],
            "expires": refresh_exp.isoformat(),
            "issued_at": refresh_iat.isoformat(),
            "expires_in": refresh_token["exp"] - int(time.time()),
        }

        data["user"] = UserRetrieveDestroySerializer(user).data

        self.username_field = "login"
        return data


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        access_token = AccessToken(data["access"])
        refresh_token = RefreshToken(data["refresh"])

        # Convert expiration time to UTC
        access_exp = datetime.fromtimestamp(access_token["exp"], pytz.utc)
        refresh_exp = datetime.fromtimestamp(refresh_token["exp"], pytz.utc)
        # Convert issued time to UTC
        access_iat = datetime.fromtimestamp(access_token["iat"], pytz.utc)
        refresh_iat = datetime.fromtimestamp(refresh_token["iat"], pytz.utc)

        data["access"] = {
            "token": data["access"],
            "expires": access_exp.isoformat(),
            "issued_at": access_iat.isoformat(),
            "expires_in": access_token["exp"] - int(time.time()),
        }

        data["refresh"] = {
            "token": data["refresh"],
            "expires": refresh_exp.isoformat(),
            "issued_at": refresh_iat.isoformat(),
            "expires_in": refresh_token["exp"] - int(time.time()),
        }

        return data
