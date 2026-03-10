from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ToolViewSet, image_to_pdf, merge_pdf, split_pdf, image_compressor, background_remover

# Create a router and register the ToolViewSet
router = DefaultRouter()
router.register(r'tools', ToolViewSet, basename='tool')

# Custom endpoints for file processing tools
urlpatterns = [
    # Router URLs for Tool model (GET/POST /api/tools/)
    path('', include(router.urls)),
    
    # Custom POST endpoints for file-processing tools
    path('image-to-pdf/', image_to_pdf, name='image-to-pdf'),
    path('merge-pdf/', merge_pdf, name='merge-pdf'),
    path('split-pdf/', split_pdf, name='split-pdf'),
    path('image-compressor/', image_compressor, name='image-compressor'),
    path('background-remover/', background_remover, name='background-remover'),
]

