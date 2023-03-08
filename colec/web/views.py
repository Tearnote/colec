from django.http import HttpResponse
from django.shortcuts import render


def index(request, **kwargs):
    return render(request, 'web/index.html')
