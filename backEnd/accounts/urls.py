from django.urls import path
from .views import teacher_signup, teacher_login
from .views import (
    teacher_signup,
    teacher_login,
    get_recovery_question,
    reset_password,
    teacher_list
)

urlpatterns = [
    path("signup/", teacher_signup),
    path("login/", teacher_login),
    path("recovery-question/", get_recovery_question),
    path("reset-password/", reset_password),
    path("teachers/", teacher_list),

]
