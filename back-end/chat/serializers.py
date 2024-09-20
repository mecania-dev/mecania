from rest_framework import serializers

from .models import GroupMessage
from users.models import User


class SenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class GroupMessageSerializer(serializers.ModelSerializer):
    sender = SenderSerializer(read_only=True)

    class Meta:
        model = GroupMessage
        fields = ["sender", "content", "sent_at"]
