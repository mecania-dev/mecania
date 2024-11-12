from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from asgiref.sync import async_to_sync
from django.shortcuts import get_object_or_404

from .models import ChatGroup, GroupMessage, RequestGroup, RequestGroupMessage
from .serializers import ChatGroupSerializer, RequestGroupSerializer, RequestGroupUpdateSerializer
from .chatgpt_utils import ask_gpt
from users.models import User
from utils.mixins import UserQuerysetMixin, DynamicQuerysetMixin


class ChatGroupListCreateView(UserQuerysetMixin, DynamicQuerysetMixin, generics.ListCreateAPIView):
    queryset = ChatGroup.objects.all()
    serializer_class = ChatGroupSerializer
    permission_classes = [IsAuthenticated]
    user_field = "members"
    allow_staff_view = True

    def create(self, request, *args, **kwargs):
        chat_group = ChatGroup.objects.create(
            vehicle_id=request.data.get("vehicle"),
            is_private=request.data.get("is_private", False),
        )

        if (
            request.data.get("members")
            and isinstance(request.data.get("members"), list)
            and len(request.data.get("members")) > 0
        ):
            members = User.objects.filter(id__in=request.data.get("members"))
            chat_group.members.set(members)
        else:
            ai_user = User.objects.filter(is_ai=True).first()
            chat_group.members.set([request.user, ai_user])

        if (
            request.data.get("messages")
            and isinstance(request.data.get("messages"), list)
            and len(request.data.get("messages")) > 0
        ):
            for message in request.data.get("messages"):
                GroupMessage.objects.create(
                    chat_group=chat_group,
                    sender=User.objects.get(id=message.get("sender")),
                    content=message.get("content"),
                )

        serializer = self.get_serializer(chat_group)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ChatGroupRetrieveUpdateDestroyView(UserQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = ChatGroup.objects.all()
    serializer_class = ChatGroupSerializer
    permission_classes = [IsAuthenticated]
    user_field = "members"


class ChatSummaryView(APIView):
    queryset = ChatGroup.objects.all()
    permission_classes = [IsAuthenticated]

    def get(self, request, chat_group_id):
        chat_group = ChatGroup.objects.get(id=chat_group_id)
        messages = [
            {"role": "user" if msg.sender == request.user else "assistant", "content": msg.content}
            for msg in chat_group.group_messages.all()
        ]
        messages.append(
            {
                "role": "user",
                "content": "Me forneça um resumo do problema para que eu envie para a oficina mecânica. Sua resposta deve estar em formato JSON onde o campo message será a mensagem que eu enviarei para a oficina. Campo 'message': string",
            }
        )

        gpt_response = async_to_sync(ask_gpt)(message=messages)
        return Response(gpt_response)


class RequestGroupView(UserQuerysetMixin, DynamicQuerysetMixin, generics.GenericAPIView):
    queryset = RequestGroup.objects.all()
    permission_classes = [IsAuthenticated]
    user_field = ["driver", "mechanic"]

    def get_serializer_class(self):
        if self.request.method == "PUT":
            return RequestGroupUpdateSerializer
        return RequestGroupSerializer

    def get(self, request, pk=None):
        if pk:
            instance = self.get_queryset().filter(id=pk).first()
            if not instance:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
            serializer = self.get_serializer(instance)
        else:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)

    def post(self, request):
        driver = request.user.id
        mechanic = request.data.get("mechanic")
        chat_group = request.data.get("chat_group")
        title = request.data.get("title")
        messages = request.data.get("messages")

        if not messages or not isinstance(messages, list) or len(messages) > 0:
            return Response({"detail": "A list of messages is required."}, status=status.HTTP_400_BAD_REQUEST)

        request_group = RequestGroup.objects.create(
            driver_id=driver,
            mechanic_id=mechanic,
            chat_group_id=chat_group,
            title=title,
        )

        for message in messages:
            RequestGroupMessage.objects.create(
                request_group=request_group,
                sender_id=message.get("sender"),
                content=message.get("content"),
            )

    def put(self, request, pk):
        instance = get_object_or_404(self.get_queryset(), id=pk)
        serializer = self.get_serializer(instance, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
