# Generated by Django 3.2.4 on 2021-06-22 18:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Chat', '0008_messages_group'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='messages',
            name='group',
        ),
    ]
