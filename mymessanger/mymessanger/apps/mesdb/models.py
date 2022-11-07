from django.db import models
from time import time


class User(models.Model):
    user_login = models.CharField('Логин пользователя', max_length=30)
    grade = models.IntegerField("Параллель", default=-1)
    class_letter = models.CharField("Буква класса", max_length=1, default="G")
    user_avatar = models.ImageField(default='../../static/img/def.jpg', upload_to='avatars/')

    def __str__(self):
        return self.user_login

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'


class Chat(models.Model):
    chat_users = models.ManyToManyField(User)
    chat_title = models.CharField('Название чата', max_length=30)
    chat_class = models.BooleanField("Это класс?", default=False)

    def __str__(self):
        return self.chat_title

    class Meta:
        verbose_name = 'Чат'
        verbose_name_plural = 'Чаты'


class Message(models.Model):
    unread = models.ManyToManyField(User)
    message_chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    message_author_id = models.IntegerField('id')
    message_text = models.TextField('Текст сообщения')
    message_time = models.IntegerField(default=time())

    def __str__(self):
        return self.message_text

    class Meta:
        verbose_name = 'Сообщение'
        verbose_name_plural = 'Сообщения'


class Homework(models.Model):
    day_number = models.IntegerField('Номер дня в учебном году')

    class_1 = models.CharField('1 урок', max_length=20, default="Физика")
    class_2 = models.CharField('2 урок', max_length=20, default="Физика")
    class_3 = models.CharField('3 урок', max_length=20, default="Физика")
    class_4 = models.CharField('4 урок', max_length=20, default="Физика")
    class_5 = models.CharField('5 урок', max_length=20, default="Физика")
    class_6 = models.CharField('6 урок', max_length=20, default="Физика")
    class_7 = models.CharField('7 урок', max_length=20, default="Физика")
    class_8 = models.CharField('8 урок', max_length=20, default="Физика")

    task_1 = models.TextField('задание на 1 урок', default="Физика")
    task_2 = models.TextField('задание на 1 урок', default="Физика")
    task_3 = models.TextField('задание на 1 урок', default="Физика")
    task_4 = models.TextField('задание на 1 урок', default="Физика")
    task_5 = models.TextField('задание на 1 урок', default="Физика")
    task_6 = models.TextField('задание на 1 урок', default="Физика")
    task_7 = models.TextField('задание на 1 урок', default="Физика")
    task_8 = models.TextField('задание на 1 урок', default="Физика")

    description_1 = models.TextField('Пояснение к уроку 1', default="Физика")
    description_2 = models.TextField('Пояснение к уроку 2', default="Физика")
    description_3 = models.TextField('Пояснение к уроку 3', default="Физика")
    description_4 = models.TextField('Пояснение к уроку 4', default="Физика")
    description_5 = models.TextField('Пояснение к уроку 5', default="Физика")
    description_6 = models.TextField('Пояснение к уроку 6', default="Физика")
    description_7 = models.TextField('Пояснение к уроку 7', default="Физика")
    description_8 = models.TextField('Пояснение к уроку 8', default="Физика")

    homework_chat = models.ForeignKey(Chat, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.homework_chat) + " " +str(self.day_number)

    class Meta:
        verbose_name = 'Домашнее задание'
        verbose_name_plural = 'Домашние задания'
