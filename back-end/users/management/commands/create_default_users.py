from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group

from users.models import User
from utils.env import env


class Command(BaseCommand):
    help = "Create default users if they do not exist"

    def handle(self, *args, **kwargs):
        # Create an admin if it doesn't exist
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser(
                username="admin", email="admin@example.com", password=env("ADMIN_PASSWORD", "admin")
            )
            self.stdout.write(self.style.SUCCESS("Successfully created the admin user."))
        else:
            self.stdout.write(self.style.WARNING("Admin user already exists."))

        # Create a driver if it doesn't exist
        if not User.objects.filter(username="driver").exists():
            driver = User.objects.create_user(
                username="driver", email="driver@example.com", password=env("ADMIN_PASSWORD", "driver")
            )
            driver_group, _ = Group.objects.get_or_create(name="Driver")
            driver.groups.set([driver_group])
            self.stdout.write(self.style.SUCCESS("Successfully created the driver user."))
        else:
            self.stdout.write(self.style.WARNING("Driver user already exists."))

        # Create a mechanic if it doesn't exist
        if not User.objects.filter(username="mechanic").exists():
            mechanic = User.objects.create_user(
                username="mechanic", email="mechanic@example.com", password=env("ADMIN_PASSWORD", "mechanic")
            )
            mechanic_group, _ = Group.objects.get_or_create(name="Mechanic")
            mechanic.groups.set([mechanic_group])
            self.stdout.write(self.style.SUCCESS("Successfully created the mechanic user."))
        else:
            self.stdout.write(self.style.WARNING("Mechanic user already exists."))

        # Create an AI "user" if it doesn't exist
        if not User.objects.filter(username="MecanIA").exists():
            mecania = User.objects.create_user(
                username="MecanIA", email="mecania.dev@gmail.com", password="mecania", is_active=False
            )
            mecania.set_unusable_password()
            mecania.save()
            ai_group, _ = Group.objects.get_or_create(name="AI")
            mecania.groups.set([ai_group])
            self.stdout.write(self.style.SUCCESS("Successfully created MecanIA user."))
        else:
            self.stdout.write(self.style.WARNING("MecanIA user already exists."))
