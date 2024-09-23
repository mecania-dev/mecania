# Generated by Django 5.0.4 on 2024-09-23 02:07

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Rating",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "score",
                    models.IntegerField(
                        choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)]
                    ),
                ),
                ("feedback", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "driver",
                    models.ForeignKey(
                        limit_choices_to={"groups__name": "Driver"},
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="given_ratings",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "mechanic",
                    models.ForeignKey(
                        limit_choices_to={"groups__name": "Mechanic"},
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="received_ratings",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["created_at"],
                "unique_together": {("driver", "mechanic")},
            },
        ),
    ]
