from django.db import models


class Collection(models.Model):
    name = models.CharField(max_length=40)
    description = models.TextField(blank=True)
    tags_enabled = models.BooleanField(default=True)
