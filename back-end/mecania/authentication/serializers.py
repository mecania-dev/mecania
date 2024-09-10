import time
from datetime import datetime
import pytz

from users.serializers import UserCreateUpdateSerializer
from users.models import User

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

class UserRegisterSerializer(UserCreateUpdateSerializer):
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        data = super().validate(data)

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        return super().create(validated_data)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'login'

    def validate(self, attrs):
        login = attrs.get("login")
        user = User.objects.filter(email=login).first() or User.objects.filter(username=login).first()
        attrs['username'] = user.username if user else login
        self.username_field = 'username'

        data = super().validate(attrs)

        access_token = AccessToken(data['access'])
        refresh_token = RefreshToken(data['refresh'])

        # Convert expiration time to UTC
        access_exp = datetime.fromtimestamp(access_token['exp'], pytz.utc)
        refresh_exp = datetime.fromtimestamp(refresh_token['exp'], pytz.utc)
        # Convert issued time to UTC
        access_iat = datetime.fromtimestamp(access_token['iat'], pytz.utc)
        refresh_iat = datetime.fromtimestamp(refresh_token['iat'], pytz.utc)

        data['access'] = {
            'token': data['access'],
            'expires': access_exp.isoformat(),
            'issued_at': access_iat.isoformat(),
            'expires_in': access_token['exp'] - int(time.time())
        }

        data['refresh'] = {
            'token': data['refresh'],
            'expires': refresh_exp.isoformat(),
            'issued_at': refresh_iat.isoformat(),
            'expires_in': refresh_token['exp'] - int(time.time())
        }

        self.username_field = 'login'
        return data

class MyTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        access_token = AccessToken(data['access'])
        refresh_token = RefreshToken(data['refresh'])

        # Convert expiration time to UTC
        access_exp = datetime.fromtimestamp(access_token['exp'], pytz.utc)
        refresh_exp = datetime.fromtimestamp(refresh_token['exp'], pytz.utc)
        # Convert issued time to UTC
        access_iat = datetime.fromtimestamp(access_token['iat'], pytz.utc)
        refresh_iat = datetime.fromtimestamp(refresh_token['iat'], pytz.utc)

        data['access'] = {
            'token': data['access'],
            'expires': access_exp.isoformat(),
            'issued_at': access_iat.isoformat(),
            'expires_in': access_token['exp'] - int(time.time())
        }

        data['refresh'] = {
            'token': data['refresh'],
            'expires': refresh_exp.isoformat(),
            'issued_at': refresh_iat.isoformat(),
            'expires_in': refresh_token['exp'] - int(time.time())
        }

        return data
