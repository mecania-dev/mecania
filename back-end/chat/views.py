from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required

from .models import ChatGroup, GroupMessage, Issue, Recommendation
from .serializers import ChatGroupSerializer
from .forms import GroupMessageCreateForm
from .chatgpt_utils import ask_gpt
from users.models import User
from services.models import Service
from utils.mixins import UserQuerysetMixin, DynamicQuerysetMixin


class ChatGroupListCreateView(UserQuerysetMixin, DynamicQuerysetMixin, generics.ListCreateAPIView):
    queryset = ChatGroup.objects.all()
    serializer_class = ChatGroupSerializer
    permission_classes = [IsAuthenticated]
    user_field = "members"

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        if "message" not in request.data:
            return Response({"error": "At least one message is required."}, status=status.HTTP_400_BAD_REQUEST)

        ai_user = User.objects.filter(is_ai=True).first()
        user_message = request.data["message"]
        gpt_response = ask_gpt(message=user_message)

        chat_group = ChatGroup.objects.create(
            title=data.get("title", gpt_response["title"]),
            vehicle_id=data.get("vehicle"),
            is_private=data.get("is_private", False),
        )
        members = User.objects.filter(id__in=[request.user.id, ai_user.pk])
        chat_group.members.set(members)

        GroupMessage.objects.create(chat_group=chat_group, sender=request.user, content=user_message)
        GroupMessage.objects.create(chat_group=chat_group, sender=ai_user, content=gpt_response["content"])

        if not gpt_response["is_question"]:
            # Loop through each issue in the response
            for issue_data in gpt_response["issues"]:
                issue = Issue.objects.create(
                    chat_group=chat_group,
                    description=issue_data["description"],
                    category=issue_data["category"],
                    status="open",
                )

                # Loop through each recommendation related to the current issue
                for recommendation in gpt_response["recommendations"]:
                    if recommendation["issue_related"] == issue_data["description"]:
                        service = get_object_or_404(Service, name=recommendation["service_needed"])
                        Recommendation.objects.create(issue=issue, service=service)
                        break

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
