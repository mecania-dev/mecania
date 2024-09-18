from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.contrib.auth.models import Group
from django.db.models.fields.files import ImageFieldFile

from .models import User
from utils.image import compress_image


@receiver(pre_save, sender=User)
def user_pre_save(sender, instance: User, **kwargs):
    instance.email = instance.email.lower()

    if instance.password:
        if instance._state.adding:
            instance.set_password(instance.password)
        else:
            old_instance = User.objects.get(pk=instance.pk)
            if old_instance.password != instance.password:
                instance.set_password(instance.password)

    if instance.avatar_url and isinstance(instance.avatar_url, ImageFieldFile):
        instance.avatar_url = compress_image(instance.avatar_url)


@receiver(post_save, sender=User)
def user_post_save(sender: User, instance: User, created: bool, **kwargs):
    if not instance.is_superuser and instance.groups.count() == 0:
        default_group, _ = Group.objects.get_or_create(name="Driver")
        instance.groups.add(default_group)
