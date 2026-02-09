from django.contrib.auth.models import AbstractUser
from django.db import models
# Create your models here.

class Teacher(AbstractUser):
    recovery_question = models.CharField(max_length=255)
    recovery_answer = models.CharField(max_length=255)

    def __str__(self):
        return self.username
