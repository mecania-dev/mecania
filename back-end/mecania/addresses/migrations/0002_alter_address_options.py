# Generated by Django 5.0.4 on 2024-09-10 06:57

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("addresses", "0001_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="address",
            options={"ordering": ["created_at"]},
        ),
    ]