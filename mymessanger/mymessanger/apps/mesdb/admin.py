from django.contrib import admin

from .models import Chat, User, Message, Homework

admin.site.register(Chat)
admin.site.register(User)
admin.site.register(Message)
admin.site.register(Homework)
