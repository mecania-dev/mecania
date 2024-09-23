from rest_framework import serializers
from rest_framework.utils import model_meta
from django.db.models import Avg
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
    rating = serializers.SerializerMethodField()

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
            "rating",
            "last_login",
            "is_superuser",
            "is_staff",
            "is_active",
            "created_at",
            "updated_at",
            "groups",
            "permissions",
            "addresses",
            "vehicles",
            "services",
        ]

    def get_rating(self, obj):
        avg_rating = obj.received_ratings.aggregate(Avg("score"))["score__avg"]
        if avg_rating is not None:
            avg_rating = round(avg_rating * 2) / 2
            return avg_rating
        return None

    def get_groups(self, obj):
        return [group.name for group in obj.groups.all()]

    def get_permissions(self, obj):
        permissions = set()
        for group in obj.groups.all():
            group_permissions = Permission.objects.filter(group=group)
            permissions.update(group_permissions.values_list("codename", flat=True))
        return list(permissions)


class UserCreateUpdateSerializer(serializers.ModelSerializer):
    # password = serializers.CharField(write_only=True)  # Mark password as write-only
    confirm_password = serializers.CharField(write_only=True, required=False)
    groups = serializers.SlugRelatedField(many=True, slug_field="name", queryset=Group.objects.all(), required=False)

    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {
            "password": {"write_only": True},  # Prevent password from being included in the response
        }

    def validate(self, data):
        request = self.context.get("request")
        password = data.get("password")
        confirm_password = data.pop("confirm_password", None)
        errors = {}

        if password and confirm_password and password != confirm_password:
            errors["password"] = "Password fields didn't match."
            errors["confirm_password"] = "Password fields didn't match."

        if request:
            user: User = request.user
            fiscal_identification = data.get("fiscal_identification", getattr(user, "fiscal_identification", None))
            phone_number = data.get("phone_number", getattr(user, "phone_number", None))
            groups = data.get("groups", getattr(user, "groups", None))
            if isinstance(groups, list):
                groups = Group.objects.filter(name__in=[group.name for group in groups])

            if request.method == "POST":
                if not password:
                    errors["password"] = "This field is required."
                if not confirm_password:
                    errors["confirm_password"] = "This field is required."

            if groups.filter(name="Mechanic").exists():
                if not fiscal_identification:
                    errors["fiscal_identification"] = "This field is required for mechanics."
                if not phone_number:
                    errors["phone_number"] = "This field is required for mechanics."

        if errors:
            raise serializers.ValidationError(errors)

        return data

    def create(self, validated_data):
        info = model_meta.get_field_info(self.Meta.model)
        is_superuser: bool = validated_data.get("is_superuser")
        groups: list = validated_data.get("groups")

        # Set default group if user is not a superuser and no groups are provided
        if not is_superuser and not len(groups):
            default_group, _ = Group.objects.get_or_create(name="Driver")
            validated_data["groups"] = [default_group]

        # Remove many-to-many fields from validated_data
        many_to_many = {}
        for field_name, relation_info in info.relations.items():
            if relation_info.to_many and (field_name in validated_data):
                many_to_many[field_name] = validated_data.pop(field_name)

        # Create user
        user = User.objects.create_user(**validated_data)

        # Set many-to-many fields
        if many_to_many:
            for field_name, value in many_to_many.items():
                field = getattr(user, field_name)
                field.set(value)

        return user
