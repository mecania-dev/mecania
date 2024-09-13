from rest_framework import serializers
from django.contrib.auth.models import Group

from .models import User
from addresses.serializers import AddressSerializer
from vehicles.serializers import VehicleSerializer
from services.serializers import ServiceSerializer


class UserRetrieveDestroySerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()
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
            "addresses",
            "vehicles",
            "services",
        ]

    def get_groups(self, obj):
        return [group.name for group in obj.groups.all()]


class UserCreateUpdateSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=False)
    groups = serializers.SlugRelatedField(many=True, slug_field="name", queryset=Group.objects.all(), required=False)

    class Meta:
        model = User
        fields = "__all__"
        read_only_fields = ["id", "updated_at"]

    def validate(self, data):
        request = self.context.get("request")
        group_names = [group.name for group in data.get("groups", [])]
        errors = {}

        if request and request.method == "POST":
            password = data.get("password")
            confirm_password = data.get("confirm_password")

            if not password or not confirm_password:
                errors["password" if not password else "confirm_password"] = "This field is required."
            elif password != confirm_password:
                errors["password"] = "Password fields didn't match."

        if "Mechanic" in group_names and request and request.method != "PATCH":
            fiscal_identification = data.get("fiscal_identification")
            phone_number = data.get("phone_number")

            if not fiscal_identification:
                errors["fiscal_identification"] = "This field is required for mechanics."
            if not phone_number:
                errors["phone_number"] = "This field is required for mechanics."

        if errors:
            raise serializers.ValidationError(errors)

        return data

    def create(self, validated_data):
        if "confirm_password" in validated_data:
            validated_data.pop("confirm_password")

        return super().create(validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation.pop("password", None)
        return representation
