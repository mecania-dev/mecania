from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import Group
from .models import User


@receiver(post_save, sender=User)
def add_user_to_default_group(sender: User, instance: User, created: bool, **kwargs):
    if not instance.is_superuser and instance.groups.count() == 0:  # Check if user has no groups
        default_group, _ = Group.objects.get_or_create(name="Driver")
        instance.groups.add(default_group)
