from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import Permission

from .serializers import PermissionSerializer
from users.models import User
from users.serializers import UserRetrieveDestroySerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        login = request.data.get("login") or request.data.get("username")
        user = (
            User.objects.filter(email__iexact=login.lower()).first()
            or User.objects.filter(username__iexact=login.lower()).first()
        )
        request.data["username"] = user.username if user else login

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            response.data["user"] = UserRetrieveDestroySerializer(user).data

        return response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            refresh_token = response.data["refresh"]
            if refresh_token:
                token = RefreshToken(refresh_token)
                user = User.objects.get(id=token["user_id"])
                response.data["user"] = UserRetrieveDestroySerializer(user).data

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
