from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.generic.edit import FormView
import time
import requests
from .models import Message, User, Chat


def count_day_number():
    year = int(time.strftime("%Y", time.gmtime(time.time())))
    month = int(time.strftime("%m", time.gmtime(time.time())))
    day = int(time.strftime("%d", time.gmtime(time.time())))
    if year % 4 == 0 and year % 100 != 0 or year % 400 == 0:
        flag = 1
    else:
        flag = 0
    d = [30, 31, 30, 31, 31, 28 + flag, 31, 30, 31]  # колво дней в месяцах с сентября по май
    if month == 9:
        day_number = day
    elif month > 9:
        day_number = sum(d[:month - 9]) + day
    else:
        day_number = sum(d[:12 - (8 - month)])

    return day_number


def found_data(the_user):
    the_user_chats = the_user.chat_set.all()
    data = []

    for i in range(len(the_user_chats)):

        TCU = the_user_chats[i].chat_users.all()
        if len(TCU) == 2:
            if TCU[0].user_login == the_user.user_login:
                data_name = TCU[1].user_login
                data_avatar = TCU[1].user_avatar
            else:
                data_name = TCU[0].user_login
                data_avatar = TCU[0].user_avatar
        else:
            data_name = the_user_chats[i].chat_title
            data_avatar = the_user.user_avatar
        the_user_chats_messages = the_user_chats[i].message_set.all()
        last_message_text = ""
        last_message_unread = 0
        last_message_time_timestamp = time.time()
        if len(the_user_chats_messages) - 1 > 0:
            last_message_text = the_user_chats_messages[len(the_user_chats_messages) - 1].message_text
            last_message_unread = len(the_user_chats_messages[len(the_user_chats_messages) - 1].unread.all())
            last_message_time_timestamp = int(the_user_chats_messages[len(the_user_chats_messages) - 1].message_time)
        last_message_time_struct_time = time.localtime(last_message_time_timestamp)
        if time.strftime("%Y", last_message_time_struct_time) == time.strftime("%Y", time.localtime(time.time())):
            if time.strftime("%b", last_message_time_struct_time) == time.strftime("%b", time.localtime(time.time())):
                if time.strftime("%d", last_message_time_struct_time) == time.strftime("%d",
                                                                                       time.localtime(time.time())):
                    last_message_time = time.strftime("%H:%M", last_message_time_struct_time)
                else:
                    last_message_time = time.strftime("%a, %d", last_message_time_struct_time)
            else:
                last_message_time = time.strftime("%b, %d", last_message_time_struct_time)
        else:
            last_message_time = time.strftime("%Y, %b", last_message_time_struct_time)

        table_chat = the_user.chat_set.get(chat_class=True)

        data.append({
            'name': data_name,
            'avatar': data_avatar,
            'id': the_user_chats[i].id,
            'last_message': last_message_text,
            'last_message_time': last_message_time,
            'last_message_unread': last_message_unread,
        })

    return data, table_chat


def main(request):
    if not request.user.is_authenticated:
        return render(request, 'mesdb/login.html')
    the_user_id = request.user.id
    the_user = User.objects.get(id=the_user_id)

    day_number = count_day_number()  # вычисление даты таблицы
    data, table_chat = found_data(the_user)
    hw_table = {
        "table_chat": table_chat.homework_set.get(day_number=day_number),
        "day_number": day_number
    }

    return render(request, 'mesdb/index.html', {'data': data, 'me': the_user, 'hw_table': hw_table, })


def get_chats(request, searching):
    the_user_id = request.user.id
    the_user = User.objects.get(id=the_user_id)
    the_user_chats = the_user.chat_set.all()
    result_users = User.objects.filter(user_login__contains=searching)
    x = 0
    json = {}
    old = False
    for i in result_users:
        if i == the_user:
            continue
        for j in the_user_chats:
            if len(j.chat_users.all()) == 2:
                if i in j.chat_users.all():
                    old = True
                    break
        if not old:
            json[str(x)] = [i.user_login, i.id]
            x += 1
            old = False
    return JsonResponse(json, safe=False)


def findedchat(request, chat_id):
    the_user_id = request.user.id
    the_user = User.objects.get(id=the_user_id)
    opponent = User.objects.get(id=chat_id)
    new_chat = Chat(
        chat_title=the_user.user_login + '*' + opponent.user_login
    )
    new_chat.save()
    new_chat.chat_users.add(the_user)
    new_chat.chat_users.add(opponent)
    a = Chat.objects.get(id=new_chat.id)
    b = a.message_set.all()
    c = a.chat_users.all()
    op = a.chat_title
    if len(c) == 2:
        op = (c[1] if c[0].user_login == the_user.user_login else c[0])
    json = {}
    json["chat"] = [a.id, a.chat_title]
    json["messages"] = []
    for i in b:
        json["messages"].append([i.message_author_id, i.message_text])
    json["me"] = int(the_user_id)
    json["opname"] = str(op)

    return JsonResponse(json, safe=False)


def chats(request, chats_id):
    if not request.user.is_authenticated:
        return render(request, 'mesdb/login.html')
    the_user_id = request.user.id
    the_user = User.objects.get(id=the_user_id)
    the_user_chat = the_user.chat_set.get(id=chats_id)
    a = the_user_chat
    b = a.message_set.all()
    c = a.chat_users.all()
    op = a.chat_title
    if len(c) == 2:
        op = (c[1] if c[0].user_login == the_user.user_login else c[0])
    json = {}
    json["chat"] = [a.id, a.chat_title]
    json["messages"] = []
    for i in b:
        json["messages"].append(
            [i.message_author_id, i.message_text, i.message_time])
    json["me"] = int(the_user_id)
    json["opname"] = str(op)

    return JsonResponse(json, safe=False)


def index(request):
    if not request.user.is_authenticated:
        return redirect('login/')
    else:
        return redirect('chats/')


class RegisterFormView(FormView):
    form_class = UserCreationForm

    success_url = "/messanger/index"

    template_name = "mesdb/register.html"

    def form_valid(self, form):
        form.save()
        username = self.request.POST['username']
        password = self.request.POST['password1']
        # authenticate user then login
        us = authenticate(username=username, password=password)
        login(self.request, us)
        new_user = User(user_login=username)
        new_user.save()
        return super(RegisterFormView, self).form_valid(form)


class LoginFormView(FormView):
    form_class = AuthenticationForm

    template_name = "mesdb/login.html"

    success_url = "/messanger/index"

    def form_valid(self, form):
        self.user = form.get_user()
        login(self.request, self.user)
        return super(LoginFormView, self).form_valid(form)


def user_logout(request):
    if request.user.is_authenticated:
        logout(request)
    return redirect('login/')


def send_message(request):
    to_chat_id = request.POST.get('to_user', None)
    to_chat = Chat.objects.get(id=to_chat_id)
    new_message = request.POST.get('message', None)
    the_user_id = request.user.id
    add_new_message = Message(
        message_chat=to_chat,
        message_author_id=the_user_id,
        message_text=new_message,
        message_time=time.time()
    )
    add_new_message.save()
    notify_users = to_chat.chat_users.exclude(id=the_user_id)
    add_new_message.unread.set(notify_users)

    for i in to_chat.chat_users.all():
        if i.is_it_bot:
            response = requests.post('https://cubebattle.ru/supermess.php', data={
                'text': new_message,
                'author_id': the_user_id,
                'chat_id': to_chat_id,
                'amount_chat_members': len(to_chat.chat_users.all()),
            })
            print(response)

    return JsonResponse({})


def get_message(request):
    the_user_id = request.user.id
    the_user = User.objects.get(id=the_user_id)
    list_messages = the_user.message_set.all()
    list_json = {}
    if not list_messages:
        return JsonResponse(list_json)
    for i in range(len(list_messages)):
        list_json[str(i)] = {
            'message_chat_id': list_messages[i].message_chat.id,
            'author_id': list_messages[i].message_author_id,
            'message_text': list_messages[i].message_text,
            'message_time': time.strftime("%H:%M", time.localtime(list_messages[i].message_time))
        }
    for i in range(len(list_messages)):
        list_messages[i].unread.clear()
    return JsonResponse(list_json)


def change_day(request, day_number):
    the_user_id = request.user.id
    the_user = User.objects.get(id=the_user_id)
    the_user_chat_class = the_user.chat_set.get(chat_class=True)
    last_hw_table = the_user_chat_class.homework_set.get(day_number=day_number)

    json = {"lessons": [last_hw_table.class_1, last_hw_table.class_2, last_hw_table.class_3, last_hw_table.class_4,
                        last_hw_table.class_5, last_hw_table.class_6, last_hw_table.class_7, last_hw_table.class_8],

            "tasks": [last_hw_table.task_1, last_hw_table.task_2, last_hw_table.task_3, last_hw_table.task_4,
                      last_hw_table.task_5, last_hw_table.task_6, last_hw_table.task_7, last_hw_table.task_8],

            "descriptions": [last_hw_table.description_1, last_hw_table.description_2, last_hw_table.description_3,
                             last_hw_table.description_4, last_hw_table.description_5, last_hw_table.description_6,
                             last_hw_table.description_7, last_hw_table.description_8]}

    return JsonResponse(json, safe=False)


def edit_hw(request):
    the_user_id = request.user.id
    the_user = User.objects.get(id=the_user_id)
    the_user_chat_class = the_user.chat_set.get(chat_class=True)
    day_number = request.POST.get('day_number', None)
    lessons = request.POST.getlist('homework[0][]', None)
    tasks = request.POST.getlist('homework[1][]', None)
    descriptions = request.POST.getlist('homework[2][]', None)
    edited_hw_table = the_user_chat_class.homework_set.get(day_number=day_number)

    edited_hw_table.class_1, edited_hw_table.class_2, edited_hw_table.class_3, edited_hw_table.class_4, edited_hw_table.class_5, edited_hw_table.class_6, edited_hw_table.class_7, edited_hw_table.class_8 = lessons
    edited_hw_table.task_1, edited_hw_table.task_2, edited_hw_table.task_3, edited_hw_table.task_4, edited_hw_table.task_5, edited_hw_table.task_6, edited_hw_table.task_7, edited_hw_table.task_8 = tasks
    edited_hw_table.description_1, edited_hw_table.description_2, edited_hw_table.description_3, edited_hw_table.description_4, edited_hw_table.description_5, edited_hw_table.description_6, edited_hw_table.description_7, edited_hw_table.description_8 = descriptions

    edited_hw_table.save()

    print(lessons)

    return JsonResponse({})