import json
from channels.generic.websocket import WebsocketConsumer
from django.shortcuts import get_object_or_404
from asgiref.sync import async_to_sync

from .models import ChatGroup, GroupMessage
from .serializers import GroupMessageSerializer


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope["user"]
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.chat_group = get_object_or_404(ChatGroup, group_name=self.room_name)
        # Join room group
        async_to_sync(self.channel_layer.group_add)(self.room_name, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(self.room_name, self.channel_name)

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = GroupMessage.objects.create(
            chat_group=self.chat_group, sender=self.user, content=text_data_json["message"]
        )
        serializer = GroupMessageSerializer(message)
        event = {
            "type": "chat_message",
            "message": serializer.data,
        }
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(self.room_name, event)

    # Receive message from room group
    def chat_message(self, event):
        self.send(text_data=json.dumps(event["message"]))
