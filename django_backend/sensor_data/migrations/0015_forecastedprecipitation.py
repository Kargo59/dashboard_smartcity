# Generated by Django 4.2.8 on 2025-01-16 13:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sensor_data', '0014_waterlevelreading_battery_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ForecastedPrecipitation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.BigIntegerField()),
                ('precipitation', models.FloatField(default=0)),
            ],
            options={
                'ordering': ['timestamp'],
            },
        ),
    ]
