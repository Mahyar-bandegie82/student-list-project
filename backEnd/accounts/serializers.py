from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers
from django.contrib.auth import get_user_model

Teacher = get_user_model()


class TeacherSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Teacher
        fields = (
            "username",
            "password",
            "recovery_question",
            "recovery_answer"
        )

    def create(self, validated_data):
        user = Teacher.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            recovery_question=validated_data["recovery_question"],
            recovery_answer=validated_data["recovery_answer"],
        )
        return user


class TeacherLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()




class RecoveryQuestionSerializer(serializers.Serializer):
    username = serializers.CharField()


class PasswordResetSerializer(serializers.Serializer):
    username = serializers.CharField()
    recovery_answer = serializers.CharField()
    new_password = serializers.CharField()