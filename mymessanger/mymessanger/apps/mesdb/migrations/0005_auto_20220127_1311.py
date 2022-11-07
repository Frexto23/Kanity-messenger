# Generated by Django 3.2.8 on 2022-01-27 09:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mesdb', '0004_message_message_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='user_avatar',
            field=models.ImageField(default='avatars/def.jpg', upload_to='avatars/'),
        ),
        migrations.AlterField(
            model_name='message',
            name='message_time',
            field=models.IntegerField(default=1643274708.6674147),
        ),
    ]
