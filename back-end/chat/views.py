from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required

from .models import ChatGroup
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
        ai_user = User.objects.filter(is_ai=True).first()
        chat_group = ChatGroup.objects.create(
            vehicle_id=request.data.get("vehicle"),
            is_private=request.data.get("is_private", False),
        )
        chat_group.members.set([request.user, ai_user])
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
