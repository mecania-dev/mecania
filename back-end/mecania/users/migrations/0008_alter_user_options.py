# Generated by Django 5.0.4 on 2024-09-10 06:57

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0007_user_services"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="user",
            options={"ordering": ["date_joined"]},
        ),
    ]