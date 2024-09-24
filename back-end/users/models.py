from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.core.validators import MinLengthValidator
from django.db.models.fields.files import ImageFieldFile

from services.models import Service
from utils.image import compress_image
from utils.models import NullableCharField


class UserManager(BaseUserManager):
    def create_user(self, username, email, password, set_unusable_password=False, **kwargs):
        user: User = self.model(username=username, email=self.normalize_email(email).lower(), **kwargs)

        user.set_password(password) if not set_unusable_password else user.set_unusable_password()

        user.save(using=self._db)

        return user

    def create_superuser(self, username, email, password, set_unusable_password=False, **kwargs):
        return self.create_user(
            username=username,
            email=email,
            password=password,
            is_staff=True,
            is_superuser=True,
            set_unusable_password=set_unusable_password,
            **kwargs,
        )


def avatar_url_path(instance, filename):
    return f"users/{instance.id}/{filename}"


class User(AbstractBaseUser, PermissionsMixin):
    # Required Fields
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(unique=True)
    # Optional Fields
    first_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=25, validators=[MinLengthValidator(14)], blank=True, null=True)
    fiscal_identification = NullableCharField(unique=True, max_length=18, validators=[MinLengthValidator(14)])
    avatar_url = models.ImageField(upload_to=avatar_url_path, blank=True, null=True)
    # Auto Generated Fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Relationships
    services = models.ManyToManyField(Service, related_name="users", blank=True)
    # Flags
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if not self._state.adding:
            old_instance = User.objects.get(pk=self.pk)
            if self.password and self.password != old_instance.password:
                self.set_password(self.password)

        if self._state.adding and not self.pk:
            temp_avatar_url = self.avatar_url
            self.avatar_url = None  # Temporarily set to None to avoid saving the file at this point
            super().save(*args, **kwargs)
            self.avatar_url = temp_avatar_url  # Restore the avatar URL after the instance has been saved

        if self.avatar_url and isinstance(self.avatar_url, ImageFieldFile):
            self.avatar_url = compress_image(self.avatar_url)

        super().save(*args, **kwargs)
