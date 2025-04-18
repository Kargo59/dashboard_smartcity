# Generated by Django 4.2.8 on 2024-07-24 14:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sensor_data', '0010_alter_weatherdata_luminosity_alter_weatherdata_uv'),
    ]

    operations = [
        migrations.CreateModel(
            name='SoilMoistureReading',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField()),
                ('soil_moisture_value', models.FloatField()),
                ('device', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='soil_moisture_readings', to='sensor_data.device')),
            ],
            options={
                'ordering': ['-timestamp'],
            },
        ),
    ]
