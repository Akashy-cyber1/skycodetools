from rest_framework import serializers
from .models import Tool


class ToolSerializer(serializers.ModelSerializer):
    """
    Serializer for the Tool model.
    Handles serialization and deserialization of Tool objects.
    """
    
    class Meta:
        model = Tool
        fields = ['id', 'name', 'description', 'website', 'category', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def validate_website(self, value):
        """Ensure website URL is valid."""
        if not value:
            raise serializers.ValidationError("Website URL is required.")
        return value
    
    def validate_name(self, value):
        """Ensure name is not empty."""
        if not value or not value.strip():
            raise serializers.ValidationError("Name cannot be empty.")
        return value.strip()

