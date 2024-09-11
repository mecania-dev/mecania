from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator
from django.db.models.fields.files import ImageFieldFile

from services.models import Service
from utils.image import compress_image

def avatar_url_path(instance, filename):
    return f'users/{instance.id}/{filename}'

class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(null=True, blank=True, unique=True, max_length=25, validators=[MinLengthValidator(14)])
    fiscal_identification = models.CharField(null=True, blank=True, unique=True, max_length=18, validators=[MinLengthValidator(14)])
    avatar_url = models.ImageField(upload_to=avatar_url_path, null=True, blank=True)
    services = models.ManyToManyField(Service, related_name='users', blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date_joined']

    def save(self, *args, **kwargs):
        # checking if the password has changed, because in the admin panel the password is always sent as a hash
        if self._state.adding or User.objects.get(pk=self.pk).password != self.password:
            self.set_password(self.password)

        if self.avatar_url and isinstance(self.avatar_url, ImageFieldFile):
            self.avatar_url = compress_image(self.avatar_url)

        super().save(*args, **kwargs)
