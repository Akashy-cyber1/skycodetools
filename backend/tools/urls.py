from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ToolViewSet, image_to_pdf, merge_pdf, split_pdf, image_compressor, background_remover

# Create a router and register the ToolViewSet
router = DefaultRouter()
router.register(r'tools', ToolViewSet, basename='tool')

urlpatterns = [
    # Custom POST endpoints first - add tools/ prefix
    path('tools/image-to-pdf/', image_to_pdf, name='image-to-pdf'),
    path('tools/merge-pdf/', merge_pdf, name='merge-pdf'),
    path('tools/split-pdf/', split_pdf, name='split-pdf'),
    path('tools/image-compressor/', image_compressor, name='image-compressor'),
    path('tools/background-remover/', background_remover, name='background-remover'),

    # Router URLs after custom endpoints
    path('', include(router.urls)),
]

# urlpatterns = [
#     # Custom POST endpoints first
#     path('image-to-pdf/', image_to_pdf, name='image-to-pdf'),
#     path('merge-pdf/', merge_pdf, name='merge-pdf'),
#     path('split-pdf/', split_pdf, name='split-pdf'),
#     path('image-compressor/', image_compressor, name='image-compressor'),
#     path('background-remover/', background_remover, name='background-remover'),

#     # Router URLs after custom endpoints
#     path('', include(router.urls)),
# ]