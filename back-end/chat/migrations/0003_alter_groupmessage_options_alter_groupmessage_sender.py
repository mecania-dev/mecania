# Generated by Django 5.0.4 on 2024-09-19 15:44

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("chat", "0002_chatgroup_groupmessage"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="groupmessage",
            options={"ordering": ["sent_at"]},
        ),
        migrations.AlterField(
            model_name="groupmessage",
            name="sender",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
            ),
        ),
    ]
