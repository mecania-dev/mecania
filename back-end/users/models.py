from django.db import models
from django.contrib.auth.models import UserManager, AbstractUser
from django.core.validators import MinLengthValidator

from services.models import Service


class CustomUserManager(UserManager):
    def _create_user(self, username, email, password, **kwargs):
        if not username:
            raise ValueError("The given username must be set")

        user = self.model(username=username, email=self.normalize_email(email), password=password, **kwargs)

        user.save(using=self._db)
        return user


def avatar_url_path(instance, filename):
    return f"users/{instance.id}/{filename}"


class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(null=True, blank=True, max_length=25, validators=[MinLengthValidator(14)])
    fiscal_identification = models.CharField(
        null=True, blank=True, unique=True, max_length=18, validators=[MinLengthValidator(14)]
    )
    avatar_url = models.ImageField(upload_to=avatar_url_path, null=True, blank=True)
    services = models.ManyToManyField(Service, related_name="users", blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    class Meta:
        ordering = ["date_joined"]
