

# Create your models here.
from django.db import models

class Tool(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    website = models.URLField()
    category = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name