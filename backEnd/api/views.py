from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import Student
from .serializers import StudentSerializer, ExcelUploadSerializer, StudentLocationSerializer
import pandas as pd
from django.shortcuts import get_object_or_404
from .serializers import (
    StudentSerializer,
    ExcelUploadSerializer,
    StudentImageUploadSerializer
)
from rest_framework.permissions import IsAuthenticated




class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    @permission_classes([IsAuthenticated])
    @action(
        detail=False,
        methods=['post'],
        serializer_class=ExcelUploadSerializer
    )
    def upload_excel(self, request):
        serializer = ExcelUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        file = serializer.validated_data['file']

        try:
            df = pd.read_excel(file)
        except Exception:
            return Response(
                {"error": "Invalid Excel file"},
                status=status.HTTP_400_BAD_REQUEST
            )

        required_columns = {'student_code', 'first_name', 'last_name'}
        if not required_columns.issubset(df.columns):
            return Response(
                {
                    "error": f"Missing required columns: {required_columns}"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        errors = []
        success_count = 0

        for index, row in df.iterrows():
            row_number = index + 2  # Excel row number

            student_code = row.get('student_code')
            first_name = row.get('first_name')
            last_name = row.get('last_name')

            if pd.isna(student_code) or str(student_code).strip() == "":
                errors.append({
                    "row": row_number,
                    "error": "student_code is missing"
                })
                continue

            if pd.isna(first_name) or str(first_name).strip() == "":
                errors.append({
                    "row": row_number,
                    "error": "first_name is missing"
                })
                continue

            if pd.isna(last_name) or str(last_name).strip() == "":
                errors.append({
                    "row": row_number,
                    "error": "last_name is missing"
                })
                continue

            Student.objects.update_or_create(
                student_code=str(student_code).strip(),
                defaults={
                    "first_name": str(first_name).strip(),
                    "last_name": str(last_name).strip(),
                    "phone": (
                        str(row.get('phone')).strip()
                        if row.get('phone') and not pd.isna(row.get('phone'))
                        else None
                    ),
                }
            )

            success_count += 1


        return Response(
            {
                "created_or_updated": success_count,
                "errors": errors
            },
            status=status.HTTP_200_OK
        )

    
    @action(
        detail=False,
        methods=['post'],
        url_path=r'(?P<student_code>[^/.]+)/upload_image',
        serializer_class=StudentImageUploadSerializer
    )
    def upload_image(self, request, student_code=None):
        student = get_object_or_404(Student, student_code=student_code)

        serializer = StudentImageUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        student.image = serializer.validated_data['image']
        student.save()

        return Response(
            StudentSerializer(student).data,
            status=status.HTTP_200_OK
        )

    @action(
        detail=False,
        methods=['patch'],
        url_path=r'(?P<student_code>[^/.]+)/update_location',
        serializer_class=StudentLocationSerializer
    )
    def update_location(self, request, student_code=None):
        student = get_object_or_404(Student, student_code=student_code)

        serializer = StudentLocationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        student.latitude = serializer.validated_data['latitude']
        student.longitude = serializer.validated_data['longitude']
        student.save()

        return Response(
            {
                "student_code": student.student_code,
                "latitude": student.latitude,
                "longitude": student.longitude
            },
            status=status.HTTP_200_OK
        )

