# Generated by Django 5.0.4 on 2024-09-06 04:41

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("services", "0001_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="service",
            options={"ordering": ["created_at"]},
        ),
        migrations.AlterField(
            model_name="service",
            name="category",
            field=models.CharField(
                choices=[
                    ("Controls", "Controles"),
                    ("Harness", "Fiação"),
                    ("PTO", "PTO (Tomada de Força)"),
                    ("Maintenance", "Manutenção"),
                    ("Rotation", "Rotação"),
                    ("Outrigger", "Estabilizador"),
                    ("Body", "Carroceria"),
                    ("Electronics", "Eletrônicos"),
                    ("Resale", "Revenda"),
                    ("Hydraulics", "Hidráulica"),
                    ("Boom", "Braço"),
                    ("Test", "Teste"),
                    ("Auger", "Sonda"),
                    ("Digger", "Escavadeira"),
                    ("Chassis", "Chassi"),
                    ("Vague", "Vago"),
                ],
                max_length=50,
            ),
        ),
        migrations.AlterField(
            model_name="service",
            name="vehicle_type",
            field=models.CharField(
                choices=[("Car", "Carro"), ("Motorcycle", "Moto")],
                default="CAR",
                max_length=20,
            ),
        ),
    ]
