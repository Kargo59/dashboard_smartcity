# Generated by Django 4.2.8 on 2024-11-18 16:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sensor_data', '0013_waterlevelreading'),
    ]

    operations = [
        migrations.AddField(
            model_name='waterlevelreading',
            name='battery',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='weatherdata',
            name='air_pressure',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='weatherdata',
            name='humidity',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='weatherdata',
            name='precipitation',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='weatherdata',
            name='rainfall_counter',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='weatherdata',
            name='temperature',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='weatherdata',
            name='wind_direction',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='weatherdata',
            name='wind_speed',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
