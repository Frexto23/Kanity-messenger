from django.urls import path, re_path

from . import views

app_name = "mesdb"

urlpatterns = [
	path('index/message/<int:chats_id>/', views.chats, name = 'index-chat'),
	path('index/new_chat/<int:chat_id>/', views.findedchat, name = 'findedchat'),
	path('index/<str:searching>/', views.get_chats, name = 'perestax'),
	path('login/', views.LoginFormView.as_view(), name = 'login'),
	path('logout/', views.user_logout, name = 'logout'),
	path('regestration/', views.RegisterFormView.as_view(), name = 'reg'),
	path('index/', views.main, name = 'index'),
	path('sendmessage/', views.send_message, name = 'sendmessage'),
	path('main/', views.main, name = 'main'),
	path('index/change_day/<int:day_number>/', views.change_day, name = 'change_day' ),
	path('edit_hw/', views.edit_hw, name = 'edit_hw'),
	re_path(r'^getmessage/', views.get_message, name = 'getmessage'),
]
