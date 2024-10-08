# Generated by Django 5.0.4 on 2024-10-02 04:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("chat", "0002_initial"),
        ("vehicles", "0002_alter_vehicle_chassis_number_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="chatgroup",
            name="vehicle",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="chat_groups",
                to="vehicles.vehicle",
            ),
        ),
    ]
