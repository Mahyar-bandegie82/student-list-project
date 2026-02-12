from django.shortcuts import render
from django.contrib.auth import authenticate, get_user_model
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from .serializers import (
    RecoveryQuestionSerializer,
    PasswordResetSerializer,
)
from .models import Teacher
from .serializers import TeacherSignupSerializer, TeacherLoginSerializer

Teacher = get_user_model()


@api_view(["GET"])
def teacher_list(request):
    teachers = Teacher.objects.values("id", "username")
    return Response(list(teachers))

@api_view(["POST"])
@permission_classes([AllowAny])
def teacher_signup(request):
    serializer = TeacherSignupSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({"message": "Teacher account created"})


@api_view(["POST"])
@permission_classes([AllowAny])
def teacher_login(request):
    serializer = TeacherLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    username = serializer.validated_data["username"]
    password = serializer.validated_data["password"]

    user = authenticate(username=username, password=password)

    if not user:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)

    return Response({
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh),
        "username": user.username
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def get_recovery_question(request):
    serializer = RecoveryQuestionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    username = serializer.validated_data["username"]

    try:
        user = Teacher.objects.get(username=username)
    except Teacher.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response({
        "recovery_question": user.recovery_question
    })

@api_view(["POST"])
@permission_classes([AllowAny])
def reset_password(request):
    serializer = PasswordResetSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    username = serializer.validated_data["username"]
    answer = serializer.validated_data["recovery_answer"]
    new_password = serializer.validated_data["new_password"]

    try:
        user = Teacher.objects.get(username=username)
    except Teacher.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if user.recovery_answer != answer:
        return Response(
            {"error": "Incorrect recovery answer"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.set_password(new_password)
    user.save()

    return Response({"message": "Password updated successfully"})
