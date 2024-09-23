from rest_framework import serializers
from .models import Rating


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = "__all__"
        read_only_fields = ["driver", "created_at"]

    def validate(self, data):
        user = self.context["request"].user
        if not user.is_superuser and not user.groups.filter(name="Driver").exists():
            raise serializers.ValidationError("Only drivers can rate mechanics.")
        return data

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["driver"] = request.user
        return super().create(validated_data)
