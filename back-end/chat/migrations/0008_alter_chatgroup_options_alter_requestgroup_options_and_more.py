# Generated by Django 5.0.4 on 2024-11-12 03:12

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("chat", "0007_requestgroup_requestgroupmessage"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="chatgroup",
            options={"ordering": ["updated_at"]},
        ),
        migrations.AlterModelOptions(
            name="requestgroup",
            options={"ordering": ["updated_at"]},
        ),
        migrations.AddField(
            model_name="requestgroup",
            name="updated_at",
            field=models.DateTimeField(auto_now=True),
        ),
    ]
