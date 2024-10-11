import json
from channels.generic.websocket import WebsocketConsumer
from django.shortcuts import get_object_or_404
from asgiref.sync import async_to_sync

from .models import ChatGroup, GroupMessage, Issue, Recommendation
from .serializers import GroupMessageSerializer
from .chatgpt_utils import ask_gpt
from services.models import Service


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope["user"]
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.chat_group = get_object_or_404(ChatGroup, group_name=self.room_name)
        self.is_ai_chat = self.chat_group.members.filter(is_ai=True).exists()
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
            "message": {**serializer.data, "isAiGenerating": self.is_ai_chat},
        }
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(self.room_name, event)

        if self.is_ai_chat:
            ai_user = self.chat_group.members.filter(is_ai=True).first()
            gpt_response = ask_gpt(message=text_data_json["message"])

            if gpt_response["title"]:
                self.chat_group.title = gpt_response["title"]
                self.chat_group.save()

            message = GroupMessage.objects.create(
                chat_group=self.chat_group, sender=ai_user, content=gpt_response["content"]
            )
            serializer = GroupMessageSerializer(message)
            event = {
                "type": "chat_message",
                "message": {**serializer.data, "isAiGenerating": False},
            }

            if not gpt_response["is_question"]:
                for issue_data in gpt_response["issues"]:
                    issue = Issue.objects.create(
                        chat_group=self.chat_group,
                        description=issue_data["description"],
                        category=issue_data["category"],
                        status="open",
                    )

                    for recommendation in issue_data["recommendations"]:
                        service = get_object_or_404(Service, name=recommendation)
                        Recommendation.objects.create(issue=issue, service=service)
            # Send message to room group
            async_to_sync(self.channel_layer.group_send)(self.room_name, event)

    # Receive message from room group
    def chat_message(self, event):
        self.send(text_data=json.dumps(event["message"]))
