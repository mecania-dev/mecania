from django.db import models
from users.models import User
from chat.models import ChatGroup


class Rating(models.Model):
    driver = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="given_ratings",
        limit_choices_to=models.Q(groups__name="Driver") | models.Q(is_superuser=True),
    )
    mechanic = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="received_ratings", limit_choices_to={"groups__name": "Mechanic"}
    )
    score = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # Rating from 1 to 5
    feedback = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["driver", "mechanic"]  # Ensures each driver rates a mechanic only once
        ordering = ["created_at"]


class AIRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="given_ai_ratings")
    chat_group = models.ForeignKey(ChatGroup, on_delete=models.CASCADE, related_name="received_ai_ratings")
    score = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # Rating from 1 to 5
    feedback = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user", "chat_group"]  # Ensures each user rates a chat group only once
        ordering = ["created_at"]
