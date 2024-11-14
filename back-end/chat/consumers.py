import json, asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from django.shortcuts import get_object_or_404
from channels.db import database_sync_to_async
from djangorestframework_camel_case.util import camelize

from .models import ChatGroup, GroupMessage, Issue, Recommendation
from .serializers import GroupMessageSerializer
from .chatgpt_utils import ask_gpt
from services.models import Service


class ChatConsumer(AsyncWebsocketConsumer):
    # Default methods
    async def connect(self):
        self.user = self.scope["user"]
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.chat_group = await database_sync_to_async(self.get_chat_group)()
        self.is_ai_chat = await database_sync_to_async(self.get_is_ai_chat)()

        # Join room group
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = await database_sync_to_async(self.create_message)(sender=self.user, content=text_data_json["message"])

        # Send user message to room group
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "chat_message",
                "message": {**message, "isAiGenerating": self.is_ai_chat},
            },
        )

        if self.is_ai_chat:
            asyncio.create_task(self.process_ai_response(text_data_json["message"]))

    # Async handlers
    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps(camelize(event["message"])))

    def get_existing_messages(self):
        # Get previous messages in the chat group as a list of role-content dicts
        return [
            {"role": "user" if msg.sender == self.user else "assistant", "content": msg.content}
            for msg in self.chat_group.group_messages.all()
        ]

    async def process_ai_response(self, user_message):
        ai_user = await database_sync_to_async(self.get_ai_user)()
        existing_messages = await database_sync_to_async(self.get_existing_messages)()
        gpt_response = await ask_gpt(message=(existing_messages if existing_messages else user_message))

        # Update chat group title if needed
        if gpt_response and gpt_response["title"]:
            await database_sync_to_async(self.set_chat_group_title)(gpt_response["title"])

        message = await database_sync_to_async(self.create_message)(
            sender=ai_user,
            content=gpt_response["content"] if gpt_response else "Algo deu errado, tente perguntar de outra forma.",
        )

        if gpt_response and not gpt_response["is_question"]:
            await database_sync_to_async(self.create_issues)(gpt_response["issues"])

        # Send AI message to room group
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "chat_message",
                "message": {**message, "isAiGenerating": False},
            },
        )

    # Database operations
    def get_chat_group(self):
        return get_object_or_404(ChatGroup, group_name=self.room_name)

    def get_is_ai_chat(self):
        return self.chat_group.members.filter(is_ai=True).exists()

    def get_ai_user(self):
        return self.chat_group.members.filter(is_ai=True).first()

    def create_message(self, sender, content):
        message = GroupMessage.objects.create(chat_group=self.chat_group, sender=sender, content=content)
        serializer = GroupMessageSerializer(message)
        return serializer.data

    def set_chat_group_title(self, title):
        if not self.chat_group.title:
            self.chat_group.title = title
            self.chat_group.save()

    def create_issues(self, issues):
        for issue_data in issues:
            issue = Issue.objects.create(
                chat_group=self.chat_group,
                description=issue_data["description"],
                category=issue_data["category"],
                status="open",
            )

            for recommendation in issue_data["recommendations"]:
                service = get_object_or_404(Service, name=recommendation)
                Recommendation.objects.create(issue=issue, service=service)
