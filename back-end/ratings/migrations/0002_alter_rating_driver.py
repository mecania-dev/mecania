# Generated by Django 5.0.4 on 2024-09-23 17:51

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("ratings", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name="rating",
            name="driver",
            field=models.ForeignKey(
                limit_choices_to={"groups__name": "Driver", "is_superuser": True},
                on_delete=django.db.models.deletion.CASCADE,
                related_name="given_ratings",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
