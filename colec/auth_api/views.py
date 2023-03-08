from django.contrib.auth import login as django_login
from django.contrib.auth import logout as django_logout
from rest_framework.authentication import SessionAuthentication, \
    BasicAuthentication
from rest_framework.decorators import api_view, permission_classes, \
    authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import UserSerializer


class CustomBasicAuthentication(BasicAuthentication):
    def authenticate_header(self, request):
        # Important see https://stackoverflow.com/questions/9859627/how-to-prevent-browser-to-invoke-basic-auth-popup-and-handle-401-error-using-jqu?lq=1
        return None


@api_view(['POST'])
@authentication_classes([CustomBasicAuthentication, SessionAuthentication])
def login(request):
    django_login(request, request.user)
    return Response(UserSerializer(request.user).data)


@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    django_logout(request)
    return Response({})


@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)
