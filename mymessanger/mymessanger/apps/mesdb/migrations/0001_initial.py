# Generated by Django 3.2.8 on 2021-11-01 10:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('chat_title', models.CharField(max_length=30, verbose_name='Название чата')),
            ],
            options={
                'verbose_name': 'Чат',
                'verbose_name_plural': 'Чаты',
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_login', models.CharField(max_length=30, verbose_name='Логин пользователя')),
            ],
            options={
                'verbose_name': 'Пользователь',
                'verbose_name_plural': 'Пользователи',
            },
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message_text', models.TextField(verbose_name='Текст сообщения')),
                ('message_author', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='mesdb.user')),
                ('message_chat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='mesdb.chat')),
            ],
            options={
                'verbose_name': 'Сообщение',
                'verbose_name_plural': 'Сообщения',
            },
        ),
        migrations.AddField(
            model_name='chat',
            name='chat_users',
            field=models.ManyToManyField(to='mesdb.User'),
        ),
    ]