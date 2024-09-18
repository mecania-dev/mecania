from rest_framework import serializers
from django.contrib.auth.models import Group, Permission

from .models import User
from .forms import UserForm
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
        form = UserForm(data=data, request=self.context.get("request"))

        if not form.is_valid():
            raise serializers.ValidationError(form.errors)

        return data

    def create(self, validated_data):
        if "confirm_password" in validated_data:
            validated_data.pop("confirm_password")

        return super().create(validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation.pop("password", None)
        return representation
