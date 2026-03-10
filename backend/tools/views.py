from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Tool
from .serializers import ToolSerializer
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def home(request):
    """
    Simple home view that returns a JSON message indicating the backend is running.
    """
    return JsonResponse({"message": "SkyCode Tools Backend Running"})


class ToolViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the Tool model.
    Provides complete CRUD operations:
    - list: GET /tools/ - Retrieve all tools
    - create: POST /tools/ - Create a new tool
    - retrieve: GET /tools/{id}/ - Retrieve a specific tool
    - update: PUT /tools/{id}/ - Update a specific tool
    - partial_update: PATCH /tools/{id}/ - Partially update a specific tool
    - destroy: DELETE /tools/{id}/ - Delete a specific tool
    """
    
    queryset = Tool.objects.all()
    serializer_class = ToolSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        """Optionally filter tools by category query parameter."""
        queryset = Tool.objects.all()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset.order_by('-created_at')


# ============================================================================
# File Processing Tool Endpoints
# ============================================================================

@api_view(['POST'])
def image_to_pdf(request):
    """
    Convert uploaded images to PDF.
    Accepts: POST with 'images' (multiple image files)
    Returns: JSON success/error response
    """
    if request.method != 'POST':
        return Response(
            {"success": False, "error": "Method not allowed. Use POST."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
    
    # Get uploaded files
    files = request.FILES.getlist('images')
    files += request.FILES.getlist('files')
    files += request.FILES.getlist('image')
    files += request.FILES.getlist('file')
    
    # Validate files
    if not files:
        return Response(
            {"success": False, "error": "No images uploaded"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate file types
    allowed_image_types = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']
    for f in files:
        if f.content_type not in allowed_image_types:
            return Response(
                {"success": False, "error": f"Invalid file type: {f.content_type}. Only JPEG, PNG, GIF, WEBP allowed."},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Log the request (actual PDF conversion would be implemented here)
    logger.info(f"image_to_pdf: Processing {len(files)} images")
    
    # For now, return success response (actual conversion logic would go here)
    return Response({
        "success": True,
        "message": f"Image to PDF conversion started for {len(files)} image(s)"
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def merge_pdf(request):
    """
    Merge multiple PDF files into one.
    Accepts: POST with 'pdfs' (multiple PDF files)
    Returns: JSON success/error response
    """
    if request.method != 'POST':
        return Response(
            {"success": False, "error": "Method not allowed. Use POST."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
    
    # Get uploaded files
    files = request.FILES.getlist('pdfs')
    files += request.FILES.getlist('files')
    files += request.FILES.getlist('pdf')
    files += request.FILES.getlist('file')
    
    # Validate files
    if not files:
        return Response(
            {"success": False, "error": "No files uploaded"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate file types
    allowed_pdf_type = 'application/pdf'
    for f in files:
        if f.content_type != allowed_pdf_type:
            return Response(
                {"success": False, "error": f"Invalid file type: {f.content_type}. Only PDF files allowed."},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Log the request (actual PDF merge would be implemented here)
    logger.info(f"merge_pdf: Processing {len(files)} PDF files")
    
    # For now, return success response (actual merge logic would go here)
    return Response({
        "success": True,
        "message": f"Merge PDF endpoint working. Processing {len(files)} PDF file(s)"
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def split_pdf(request):
    """
    Split a PDF file into multiple pages/files.
    Accepts: POST with 'pdf' (single PDF file)
    Returns: JSON success/error response
    """
    if request.method != 'POST':
        return Response(
            {"success": False, "error": "Method not allowed. Use POST."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
    
    # Get uploaded file
    pdf_file = request.FILES.get('pdf')
    if not pdf_file:
        pdf_file = request.FILES.get('file')
    if not pdf_file:
        pdf_file = request.FILES.get('files')
        if pdf_file and isinstance(pdf_file, list):
            pdf_file = pdf_file[0] if pdf_file else None
    
    # Validate file
    if not pdf_file:
        return Response(
            {"success": False, "error": "No PDF file uploaded"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate file type
    if pdf_file.content_type != 'application/pdf':
        return Response(
            {"success": False, "error": f"Invalid file type: {pdf_file.content_type}. Only PDF files allowed."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Log the request (actual PDF split would be implemented here)
    logger.info(f"split_pdf: Processing PDF file: {pdf_file.name}")
    
    # For now, return success response (actual split logic would go here)
    return Response({
        "success": True,
        "message": f"Split PDF endpoint working. Processing: {pdf_file.name}"
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def image_compressor(request):
    """
    Compress uploaded images to reduce file size.
    Accepts: POST with 'images' (multiple image files)
    Returns: JSON success/error response
    """
    if request.method != 'POST':
        return Response(
            {"success": False, "error": "Method not allowed. Use POST."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
    
    # Get uploaded files
    files = request.FILES.getlist('images')
    files += request.FILES.getlist('files')
    files += request.FILES.getlist('image')
    files += request.FILES.getlist('file')
    
    # Validate files
    if not files:
        return Response(
            {"success": False, "error": "No images uploaded"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate file types
    allowed_image_types = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']
    for f in files:
        if f.content_type not in allowed_image_types:
            return Response(
                {"success": False, "error": f"Invalid file type: {f.content_type}. Only JPEG, PNG, GIF, WEBP allowed."},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Get compression quality (optional parameter)
    quality = request.data.get('quality', 'medium')
    valid_qualities = ['low', 'medium', 'high']
    if quality not in valid_qualities:
        quality = 'medium'
    
    # Log the request (actual compression would be implemented here)
    logger.info(f"image_compressor: Processing {len(files)} images with {quality} quality")
    
    # For now, return success response (actual compression logic would go here)
    return Response({
        "success": True,
        "message": f"Image compression started for {len(files)} image(s) with {quality} quality"
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def background_remover(request):
    """
    Remove background from uploaded images using remove.bg API.
    Accepts: POST with 'file' or 'image' or 'images' (image file)
    Returns: Image blob (PNG with transparent background) on success
    """
    import requests
    
    if request.method != 'POST':
        return Response(
            {"success": False, "error": "Method not allowed. Use POST."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
    
    # Get uploaded file - try multiple field names
    image_file = request.FILES.get('file')
    if not image_file:
        image_file = request.FILES.get('image')
    if not image_file:
        image_file = request.FILES.get('images')
    if not image_file:
        files_list = request.FILES.getlist('files')
        if files_list:
            image_file = files_list[0]
    
    # Validate file exists
    if not image_file:
        logger.error("background_remover: No image file uploaded")
        return Response(
            {"success": False, "error": "No image file uploaded. Please upload an image."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate file type
    allowed_image_types = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']
    if image_file.content_type not in allowed_image_types:
        logger.error(f"background_remover: Invalid file type - {image_file.content_type}")
        return Response(
            {"success": False, "error": f"Invalid file type: {image_file.content_type}. Only JPEG, PNG, GIF, WEBP allowed."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    logger.info(f"background_remover: Processing image - {image_file.name}, size: {image_file.size}")
    
    # Get API key from Django settings
    api_key = settings.REMOVE_BG_API_KEY
    
    if not api_key:
        logger.error("background_remover: REMOVE_BG_API_KEY not configured")
        return Response(
            {"success": False, "error": "Background removal service not configured. Please contact admin."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    try:
        # Prepare the file for remove.bg API
        # The API expects 'image_file' as the field name
        files = {
            'image_file': (image_file.name, image_file.read(), image_file.content_type)
        }
        
        # API request headers
        headers = {
            'X-Api-Key': api_key
        }
        
        # API payload
        data = {
            'size': 'auto',  # Options: 'auto', 'preview', 'full', '4k'
            'format': 'png'
        }
        
        logger.info("background_remover: Calling remove.bg API...")
        
        # Make request to remove.bg
        response = requests.post(
            'https://api.remove.bg/v1.0/removebg',
            files=files,
            data=data,
            headers=headers,
            timeout=60  # 60 seconds timeout
        )
        
        # Log response status for debugging
        logger.info(f"background_remover: remove.bg response status - {response.status_code}")
        
        # Handle API errors
        if response.status_code == 402:
            logger.error("background_remover: remove.bg API credits exhausted")
            return Response(
                {"success": False, "error": "Background removal service credits exhausted. Please contact admin."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        
        if response.status_code == 403:
            logger.error("background_remover: Invalid API key")
            return Response(
                {"success": False, "error": "Background removal service authentication failed. Please contact admin."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        
        if response.status_code == 429:
            logger.error("background_remover: Rate limit exceeded")
            return Response(
                {"success": False, "error": "Too many requests. Please try again later."},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
        
        if not response.ok:
            error_text = response.text
            logger.error(f"background_remover: remove.bg API error - {error_text}")
            return Response(
                {"success": False, "error": f"Failed to remove background: {response.status_code}"},
                status=status.HTTP_502_BAD_GATEWAY
            )
        
        # Check if we got a valid image back
        content_type = response.headers.get('content-type', '')
        if 'image' not in content_type:
            logger.error(f"background_remover: Invalid response content type - {content_type}")
            return Response(
                {"success": False, "error": "Invalid response from background removal service."},
                status=status.HTTP_502_BAD_GATEWAY
            )
        
        logger.info("background_remover: Background removed successfully!")
        
        # Return the processed image as a blob
        from django.http import HttpResponse
        return HttpResponse(response.content, content_type='image/png')
        
    except requests.exceptions.Timeout:
        logger.error("background_remover: Request to remove.bg timed out")
        return Response(
            {"success": False, "error": "Request timed out. Please try again with a smaller image."},
            status=status.HTTP_504_GATEWAY_TIMEOUT
        )
    except requests.exceptions.ConnectionError:
        logger.error("background_remover: Connection error to remove.bg API")
        return Response(
            {"success": False, "error": "Could not connect to background removal service. Please try again later."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    except Exception as e:
        logger.exception(f"background_remover: Unexpected error - {str(e)}")
        return Response(
            {"success": False, "error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

