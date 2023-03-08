from django.urls import path, include
from rest_framework import serializers, viewsets, routers

from .models import Collection


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ['name', 'description', 'tags_enabled']


class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer


router = routers.DefaultRouter()
router.register(r'collections', CollectionViewSet)


urlpatterns = [
    path('', include(router.urls)),
]
