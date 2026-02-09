from django.db import models

class Student(models.Model):
    student_code = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, blank=True, null=True)
    image = models.ImageField(upload_to='student_images/', blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"{self.student_code} - {self.first_name} {self.last_name}"
