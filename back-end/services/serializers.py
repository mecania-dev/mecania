from rest_framework import serializers
from .models import Category, Service


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ServiceRetrieveDestroySerializer(serializers.ModelSerializer):
    vehicle_type_label = serializers.SerializerMethodField()
    category = CategorySerializer()

    class Meta:
        model = Service
        fields = "__all__"

    def get_vehicle_type_label(self, obj):
        return dict(Service.VEHICLE_TYPE_CHOICES).get(obj.vehicle_type, "")


class ServiceCreateUpdateSerializer(serializers.ModelSerializer):
    category = serializers.CharField()

    class Meta:
        model = Service
        fields = "__all__"

    def validate(self, data):
        category_data = data.get("category")

        if category_data:
            if category_data.isdigit():
                category = Category.objects.filter(id=category_data).first()
            else:
                category = Category.objects.filter(name=category_data).first()

            data["category"] = None if category is None else category

        return data
