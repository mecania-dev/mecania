from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.contrib.auth.models import Group, Permission

from .models import User
from addresses.serializers import AddressSerializer
from vehicles.serializers import VehicleSerializer
from services.serializers import ServiceSerializer


class UserRetrieveDestroySerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()
    addresses = AddressSerializer(many=True, read_only=True)
    vehicles = VehicleSerializer(many=True, read_only=True)
    services = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "fiscal_identification",
            "avatar_url",
            "last_login",
            "is_superuser",
            "is_staff",
            "is_active",
            "date_joined",
            "updated_at",
            "groups",
            "permissions",
            "addresses",
            "vehicles",
            "services",
        ]

    def get_groups(self, obj):
        return [group.name for group in obj.groups.all()]

    def get_permissions(self, obj):
        permissions = set()
        for group in obj.groups.all():
            group_permissions = Permission.objects.filter(group=group)
            permissions.update(group_permissions.values_list("codename", flat=True))
        return list(permissions)


class UserCreateUpdateSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=False)
    groups = serializers.SlugRelatedField(many=True, slug_field="name", queryset=Group.objects.all(), required=False)

    class Meta:
        model = User
        fields = "__all__"
        read_only_fields = ["id", "updated_at"]

    def validate(self, data):
        request = self.context.get("request")
        user: User = request.user
        password = data.get("password")
        confirm_password = data.get("confirm_password")
        errors = {}

        if password and confirm_password and password != confirm_password:
            errors["password"] = "Password fields didn't match."
            errors["confirm_password"] = "Password fields didn't match."

        if request:
            if request.method == "POST":
                if not password:
                    errors["password"] = "This field is required."
                if not confirm_password:
                    errors["confirm_password"] = "This field is required."

            if request.method != "PATCH" and user.groups.filter(name="Mechanic").exists():
                fiscal_identification = data.get("fiscal_identification")
                phone_number = data.get("phone_number")

                if not fiscal_identification:
                    errors["fiscal_identification"] = "This field is required for mechanics."
                if not phone_number:
                    errors["phone_number"] = "This field is required for mechanics."

        if errors:
            raise serializers.ValidationError(errors)

        return data

    def save(self, **kwargs):
        if "confirm_password" in self.validated_data:
            self.validated_data.pop("confirm_password")

        try:
            return super().save(**kwargs)
        except ValidationError as e:
            raise serializers.ValidationError(e.message_dict)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation.pop("password", None)
        return representation
