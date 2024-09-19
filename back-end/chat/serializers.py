from rest_framework import serializers
from .models import GroupMessage, Chat, Message


class GroupMessageSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    sender_id = serializers.IntegerField(source="sender.id", read_only=True)

    class Meta:
        model = GroupMessage
        fields = ["sender_id", "sender", "content", "sent_at"]

    def get_sender(self, obj):
        return obj.sender.username


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["sender_type", "sender", "content", "sent_at"]


class ChatListSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True)

    class Meta:
        model = Chat
        fields = ["id", "user", "vehicle", "title", "created_at", "updated_at", "messages"]


class ChatCreateSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, required=True)  # Ensures at least one message is provided

    class Meta:
        model = Chat
        fields = ["user", "vehicle", "messages"]

    def create(self, validated_data):
        messages_data = validated_data.pop("messages")
        chat = Chat.objects.create(**validated_data)
        for message_data in messages_data:
            Message.objects.create(chat=chat, **message_data)
        return chat
