# Generated by Django 4.2.8 on 2024-07-17 13:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sensor_data', '0006_treehealthreading'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='treehealthreading',
            name='health_status',
        ),
        migrations.AddField(
            model_name='treehealthreading',
            name='health_state',
            field=models.IntegerField(default=4),
            preserve_default=False,
        ),
    ]
