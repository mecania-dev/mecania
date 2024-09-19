import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.shortcuts import get_object_or_404

from .models import ChatGroup, GroupMessage
from .serializers import GroupMessageSerializer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.chat_group = await self.get_chat_group()
        # Join room group
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = await self.create_message(text_data_json["message"])
        serialized_message = await self.serialize_message(message)
        # Send message to room group
        await self.channel_layer.group_send(self.room_name, {"type": "chat_message", "message": serialized_message})

    # Receive message from room group
    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event["message"]))

    @database_sync_to_async
    def get_chat_group(self) -> ChatGroup:
        return get_object_or_404(ChatGroup, group_name=self.room_name)

    @database_sync_to_async
    def create_message(self, content: str) -> GroupMessage:
        return GroupMessage.objects.create(chat_group=self.chat_group, sender=self.scope["user"], content=content)

    @database_sync_to_async
    def serialize_message(self, message: GroupMessage) -> dict:
        serializer = GroupMessageSerializer(message)
        return serializer.data
