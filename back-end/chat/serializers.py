from rest_framework import serializers

from .models import ChatGroup, GroupMessage, Issue, Recommendation, RequestGroup, RequestGroupMessage
from users.models import User
from vehicles.serializers import VehicleSerializer


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "is_ai"]


class GroupMessageSerializer(serializers.ModelSerializer):
    sender = MemberSerializer(read_only=True)

    class Meta:
        model = GroupMessage
        fields = ["id", "sender", "content", "sent_at", "updated_at"]


class IssueRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = ["id", "service", "ai_suggested", "created_at"]


class GroupIssueSerializer(serializers.ModelSerializer):
    recommendations = IssueRecommendationSerializer(many=True, read_only=True)

    class Meta:
        model = Issue
        fields = [
            "id",
            "description",
            "category",
            "status",
            "solution",
            "is_resolved",
            "recommendations",
            "created_at",
            "updated_at",
        ]


class ChatGroupSerializer(serializers.ModelSerializer):
    members = MemberSerializer(many=True, read_only=True)
    vehicle = VehicleSerializer(read_only=True)
    messages = GroupMessageSerializer(many=True, read_only=True, source="group_messages")
    issues = GroupIssueSerializer(many=True, read_only=True, source="group_issues")

    class Meta:
        model = ChatGroup
        fields = [
            "id",
            "group_name",
            "title",
            "members",
            "vehicle",
            "messages",
            "issues",
            "is_private",
            "created_at",
            "updated_at",
        ]


class RequestGroupMessageSerializer(serializers.ModelSerializer):
    sender = MemberSerializer(read_only=True)

    class Meta:
        model = RequestGroupMessage
        fields = ["id", "sender", "content", "sent_at", "updated_at"]


class RequestGroupSerializer(serializers.ModelSerializer):
    driver = MemberSerializer(read_only=True)
    mechanic = MemberSerializer(read_only=True)
    messages = RequestGroupMessageSerializer(many=True, read_only=True, source="group_messages")

    class Meta:
        model = RequestGroup
        fields = [
            "id",
            "group_name",
            "chat_group",
            "title",
            "driver",
            "mechanic",
            "accepted",
            "driver_status",
            "mechanic_status",
            "created_at",
            "updated_at",
            "messages",
        ]


class RequestGroupUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestGroup
        fields = [
            "accepted",
            "driver_status",
            "mechanic_status",
        ]
