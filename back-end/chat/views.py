from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required

from .models import ChatGroup, GroupMessage
from .serializers import ChatGroupSerializer
from .forms import GroupMessageCreateForm
from users.models import User
from utils.mixins import UserQuerysetMixin, DynamicQuerysetMixin


class ChatGroupListCreateView(UserQuerysetMixin, DynamicQuerysetMixin, generics.ListCreateAPIView):
    queryset = ChatGroup.objects.all()
    serializer_class = ChatGroupSerializer
    permission_classes = [IsAuthenticated]
    user_field = "members"

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        members_data = [request.user.id]

        if "members" not in data:
            ai_user = User.objects.filter(is_ai=True).first()
            if not ai_user:
                return Response({"detail": "AI user not found."}, status=status.HTTP_400_BAD_REQUEST)

            members_data += [ai_user.pk]

        chat_group = ChatGroup.objects.create(
            title=data.get("title", "Chat Group"),
            vehicle_id=data.get("vehicle"),
            is_private=data.get("is_private", False),
        )
        members = User.objects.filter(id__in=members_data)
        chat_group.members.set(members)

        if "message" in request.data:
            GroupMessage.objects.create(chat_group=chat_group, sender=request.user, content=request.data["message"])

        serializer = self.get_serializer(chat_group)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ChatGroupRetrieveUpdateDestroyView(UserQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = ChatGroup.objects.all()
    serializer_class = ChatGroupSerializer
    permission_classes = [IsAuthenticated]
    user_field = "members"


@login_required
def room(request, room_name):
    chat_group = get_object_or_404(ChatGroup, group_name=room_name)
    group_messages = chat_group.group_messages.all()
    form = GroupMessageCreateForm()
    return render(request, "chat/room.html", {"room_name": room_name, "group_messages": group_messages, "form": form})


# class ChatListCreateDeleteView(
#     generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin
# ):
#     queryset = Chat.objects.all()

#     def get_serializer_class(self):
#         if self.request.method == "GET":
#             return ChatListSerializer
#         return ChatCreateSerializer

#     def get(self, request, *args, **kwargs):
#         return self.list(request, *args, **kwargs)

#     def post(self, request, *args, **kwargs):
#         user = request.data.get("user")
#         vehicle = request.data.get("vehicle")
#         messages_data = request.data.get("messages")

#         if not messages_data or not isinstance(messages_data, list):
#             return Response({"error": "At least one message is required."}, status=status.HTTP_400_BAD_REQUEST)

#         user_message = messages_data[0]["content"]

#         try:
#             gpt_response = ask_gpt(
#                 messages=[
#                     {
#                         "role": "system",
#                         "content": "You are a knowledgeable and helpful car diagnostic assistant. I will provide you with a description of a car issue, and you will provide a comprehensive and informative response. Your response should include the following elements:\n\n* **Title:** A concise and **short** title summarizing the issue (suitable for a chat title).\n* **Category:** One of the following categories: Controls, Harness, PTO, Maintenance, Rotation, Outrigger, Body, Electronics, Resale, Hydraulics, Boom, Test, Auger, Digger, Chassis, or Vague.\n* **Description:** A detailed explanation of the problem, including potential causes, symptoms, and recommended solutions. \n\nPlease ensure that your response is clear, informative, and tailored to the user's specific query.",
#                     },
#                     {"role": "user", "content": user_message},
#                 ]
#             )
#             print(gpt_response)
#             return Response(gpt_response, status=status.HTTP_201_CREATED)
#             ai_message_content = gpt_response["content"]
#             chat_title = gpt_response["title"]
#             issue_category = gpt_response["category"]
#             issue_description = gpt_response["description"]

#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#         try:
#             chat = Chat.objects.create(user_id=user, vehicle_id=vehicle, title=chat_title)

#             Message.objects.create(chat=chat, sender_type="User", sender=user, content=user_message)

#             Message.objects.create(chat=chat, sender_type="AI", content=ai_message_content)

#             Issue.objects.create(chat=chat, description=issue_description, category=issue_category, status="open")
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#         serializer = ChatListSerializer(chat)

#         return Response(serializer.data, status=status.HTTP_201_CREATED)

#     def delete(self, request, *args, **kwargs):
#         return self.destroy(request, *args, **kwargs)

#     def get_object(self):
#         pk = self.kwargs.get("pk")
#         return generics.get_object_or_404(Chat, pk=pk)
