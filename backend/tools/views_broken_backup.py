from django.http import JsonResponse, HttpResponse
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from .models import Tool
from .serializers import ToolSerializer
from io import BytesIO
from django.conf import settings
from PIL import Image
from rembg import remove
import PyPDF2
import logging

# from PIL import Image
# from django.http import JsonResponse, HttpResponse
# from rest_framework import viewsets
# from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
# from rest_framework.decorators import api_view, permission_classes, authentication_classes
# from rest_framework.response import Response
# from rest_framework import status
# from .models import Tool
# from .serializers import ToolSerializer
# from io import BytesIO
# from django.conf import settings
# from PyPDF2 import PdfReader, PdfWriter, PdfMerger
# import logging

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
        queryset = Tool.objects.all()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__name=category)
        return queryset.order_by('-created_at')


# ============================================================================
# File Processing Tool Endpoints
# ============================================================================

@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def image_to_pdf(request):
    """
    Convert uploaded images to PDF.
    Accepts: POST with 'images' or 'files' (multiple image files)
    Returns: PDF blob on success
    """
    from django.http import HttpResponse
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.utils import ImageReader
    from reportlab.pdfgen import canvas
    import io
    from PIL import Image
    
    if request.method != 'POST':
        return Response(
            {"success": False, "error": "Method not allowed. Use POST."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
    
    # FE priority first
    files = request.FILES.getlist('files') or request.FILES.getlist('images') or request.FILES.getlist('image') or request.FILES.getlist('file')
    
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
    
    logger.info(f"image_to_pdf: Processing {len(files)} images")
    
    try:
        # Create PDF in memory
        pdf_buffer = io.BytesIO()
        c = canvas.Canvas(pdf_buffer, pagesize=letter)
        width, height = letter
        
        for image_file in files:
            # Reset file position after any previous reads
            image_file.seek(0)
            
            # Open image to get dimensions
            img = Image.open(image_file)
            img_width, img_height = img.size
            
            # Calculate aspect ratio to fit page
            page_width, page_height = width - 72 * 2, height - 72 * 2  # 1 inch margins
            img_aspect = img_height / img_width
            page_aspect = page_height / page_width
            
            if img_aspect > page_aspect:
                # Image is taller than page aspect
                draw_height = page_height
                draw_width = draw_height / img_aspect
            else:
                # Image is wider than page aspect
                draw_width = page_width
                draw_height = draw_width * img_aspect
            
            # Center on page
            x_offset = (width - draw_width) / 2
            y_offset = (height - draw_height) / 2
            
            # Reset to read image data
            image_file.seek(0)
            img_data = image_file.read()
            
            # Draw image on PDF
            c.drawImage(
                ImageReader(io.BytesIO(img_data)),
                x_offset, y_offset,
                width=draw_width,
                height=draw_height
            )
            c.showPage()  # New page for each image
        
        c.save()
        pdf_buffer.seek(0)
        
        logger.info(f"image_to_pdf: Successfully created PDF with {len(files)} pages")
        
        # Return PDF as response
        response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="images-to-pdf.pdf"'
        return response
        
    except Exception as e:
        logger.exception(f"image_to_pdf: Error creating PDF - {str(e)}")
        return Response(
            {"success": False, "error": f"Failed to create PDF: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def merge_pdf(request):
    if request.method != 'POST':
        return Response(
            {"success": False, "error": "Method not allowed. Use POST."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
    
    files = request.FILES.getlist('files') or request.FILES.getlist('pdfs') or request.FILES.getlist('pdf')
    
    if not files:
        return Response(
            {"success": False, "error": "No files uploaded"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    allowed_pdf_type = 'application/pdf'
    for f in files:
        if f.content_type != allowed_pdf_type:
            return Response(
                {"success": False, "error": f"Invalid file type: {f.content_type}. Only PDF files allowed."},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    logger.info(f"merge_pdf: Processing {len(files)} PDF files")

    try:
        merger = PyPDF2.PdfMerger()

        for pdf_file in files:
            pdf_file.seek(0)
            merger.append(pdf_file)

        output = BytesIO()
        merger.write(output)
        merger.close()
        output.seek(0)

        response = HttpResponse(output.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="merged.pdf"'
        return response

    except Exception as e:
        logger.exception(f"merge_pdf error: {str(e)}")
        return Response(
            {"success": False, "error": f"Merge failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
# @api_view(["POST"])
# @authentication_classes([])
# @permission_classes([AllowAny])
# def merge_pdf(request):
#     """
#     Merge multiple PDF files into one.
#     Accepts: POST with 'pdfs' (multiple PDF files)
#     Returns: JSON success/error response
#     """
#     if request.method != 'POST':
#         return Response(
#             {"success": False, "error": "Method not allowed. Use POST."},
#             status=status.HTTP_405_METHOD_NOT_ALLOWED
#         )
    
#     # Get uploaded files
#     # FE priority first
#     files = request.FILES.getlist('files') or request.FILES.getlist('pdfs') or request.FILES.getlist('pdf')
    
#     # Validate files
#     if not files:
#         return Response(
#             {"success": False, "error": "No files uploaded"},
#             status=status.HTTP_400_BAD_REQUEST
#         )
    
#     # Validate file types
#     allowed_pdf_type = 'application/pdf'
#     for f in files:
#         if f.content_type != allowed_pdf_type:
#             return Response(
#                 {"success": False, "error": f"Invalid file type: {f.content_type}. Only PDF files allowed."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
    
#     # Log the request (actual PDF merge would be implemented here)
#     logger.info(f"merge_pdf: Processing {len(files)} PDF files")
    
#     # For now, return success response (actual merge logic would go here)
#     return Response({
#         "success": True,
#         "message": f"Merge PDF endpoint working. Processing {len(files)} PDF file(s)"
#     }, status=status.HTTP_200_OK)


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
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
    
    try:
        pdf_file.seek(0)
        reader = PyPDF2.PdfReader(pdf_file)
        writer = PyPDF2.PdfWriter()
        
        if len(reader.pages) > 0:
            writer.add_page(reader.pages[0])
        
        output = BytesIO()
        writer.write(output)
        output.seek(0)
        
        response = HttpResponse(output.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="split-page1.pdf"'
        return response
        
    except Exception as e:
        logger.exception(f"split_pdf error: {str(e)}")
        return Response(
            {"success": False, "error": f"Split failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


from django.views.decorators.csrf import csrf_exempt\n\n@csrf_exempt\n@api_view(["POST"])\n@authentication_classes([])\n@permission_classes([AllowAny])\ndef image_compressor(request):
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
    quality = int(request.POST.get('quality', 80))
    quality = max(10, min(95, quality))
    
    # Log the request (actual compression would be implemented here)
    logger.info(f"image_compressor: Processing {len(files)} images with {quality} quality")
    
    try:
        image_file = files[0]  # Single image for now
        image_file.seek(0)
        img = Image.open(image_file)
        
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        
        output = BytesIO()
        img.save(output, format='JPEG', quality=quality, optimize=True)
        output.seek(0)
        
        response = HttpResponse(output.getvalue(), content_type='image/jpeg')
        response['Content-Disposition'] = f'attachment; filename="compressed.jpg"'
        return response
        
    except Exception as e:
        logger.exception(f"image_compressor error: {str(e)}")
        return Response(
            {"success": False, "error": f"Compress failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# @api_view(["POST"])
# @authentication_classes([])
# @permission_classes([AllowAny])
# def background_remover(request):
#     import requests
    
#     if request.method != 'POST':
#         return Response(
#             {"success": False, "error": "Method not allowed. Use POST."},
#             status=status.HTTP_405_METHOD_NOT_ALLOWED
#         )
    
#     # FE priority first, safe file access
#     image_file = request.FILES.get('file') or request.FILES.get('image')

#     if not image_file:
#         image_list = request.FILES.getlist('images') or request.FILES.getlist('files')
#         image_file = image_list[0] if image_list else None
    
#     # Validate file exists
#     if not image_file:
#         logger.error("background_remover: No image file uploaded")
#         return Response(
#             {"success": False, "error": "No image file uploaded. Please upload an image."},
#             status=status.HTTP_400_BAD_REQUEST
#         )
    
#     # Validate file type
#     allowed_image_types = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']
#     if image_file.content_type not in allowed_image_types:
#         logger.error(f"background_remover: Invalid file type - {image_file.content_type}")
#         return Response(
#             {"success": False, "error": f"Invalid file type: {image_file.content_type}. Only JPEG, PNG, GIF, WEBP allowed."},
#             status=status.HTTP_400_BAD_REQUEST
#         )
    
#     logger.info(f"background_remover: Processing image - {image_file.name}, size: {image_file.size}")
    
#     # Get API key from Django settings
#     api_key = settings.REMOVE_BG_API_KEY
    
#     if not api_key:
#         logger.error("background_remover: REMOVE_BG_API_KEY not configured")
#         return Response(
#             {"success": False, "error": "Background removal service not configured. Please contact admin."},
#             status=status.HTTP_503_SERVICE_UNAVAILABLE
#         )
    
#     try:
#         # Prepare the file for remove.bg API
#         # The API expects 'image_file' as the field name
#         files = {
#             'image_file': (image_file.name, image_file.read(), image_file.content_type)
#         }
        
#         # API request headers
#         headers = {
#             'X-Api-Key': api_key
#         }
        
#         # API payload
#         data = {
#             'size': 'auto',  # Options: 'auto', 'preview', 'full', '4k'
#             'format': 'png'
#         }
        
#         logger.info("background_remover: Calling remove.bg API...")
        
#         # Make request to remove.bg
#         response = requests.post(
#             'https://api.remove.bg/v1.0/removebg',
#             files=files,
#             data=data,
#             headers=headers,
#             timeout=60  # 60 seconds timeout
#         )
        
#         # Log response status for debugging
#         logger.info(f"background_remover: remove.bg response status - {response.status_code}")
        
#         # Handle API errors
#         if response.status_code == 402:
#             logger.error("background_remover: remove.bg API credits exhausted")
#             return Response(
#                 {"success": False, "error": "Background removal service credits exhausted. Please contact admin."},
#                 status=status.HTTP_503_SERVICE_UNAVAILABLE
#             )
        
#         if response.status_code == 403:
#             logger.error("background_remover: Invalid API key")
#             return Response(
#                 {"success": False, "error": "Background removal service authentication failed. Please contact admin."},
#                 status=status.HTTP_503_SERVICE_UNAVAILABLE
#             )
        
#         if response.status_code == 429:
#             logger.error("background_remover: Rate limit exceeded")
#             return Response(
#                 {"success": False, "error": "Too many requests. Please try again later."},
#                 status=status.HTTP_429_TOO_MANY_REQUESTS
#             )
        
#         if not response.ok:
#             error_text = response.text
#             logger.error(f"background_remover: remove.bg API error - {error_text}")
#             return Response(
#                 {"success": False, "error": f"Failed to remove background: {response.status_code}"},
#                 status=status.HTTP_502_BAD_GATEWAY
#             )
        
#         # Check if we got a valid image back
#         content_type = response.headers.get('content-type', '')
#         if 'image' not in content_type:
#             logger.error(f"background_remover: Invalid response content type - {content_type}")
#             return Response(
#                 {"success": False, "error": "Invalid response from background removal service."},
#                 status=status.HTTP_502_BAD_GATEWAY
#             )
        
#         logger.info("background_remover: Background removed successfully!")
        
#         # Return the processed image as a blob
#         from django.http import HttpResponse
#         return HttpResponse(response.content, content_type='image/png')
        
#     except requests.exceptions.Timeout:
#         logger.error("background_remover: Request to remove.bg timed out")
#         return Response(
#             {"success": False, "error": "Request timed out. Please try again with a smaller image."},
#             status=status.HTTP_504_GATEWAY_TIMEOUT
#         )
#     except requests.exceptions.ConnectionError:
#         logger.error("background_remover: Connection error to remove.bg API")
#         return Response(
#             {"success": False, "error": "Could not connect to background removal service. Please try again later."},
#             status=status.HTTP_503_SERVICE_UNAVAILABLE
#         )
#     except Exception as e:
#         logger.exception(f"background_remover: Unexpected error - {str(e)}")
#         return Response(
#             {"success": False, "error": f"An unexpected error occurred: {str(e)}"},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )

@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def background_remover(request):
    """
    Remove background locally using rembg.
    Accepts: POST with 'file' or 'image' or first item from 'images'/'files'
    Returns: PNG blob with transparent background
    """
    if request.method != "POST":
        return Response(
            {"success": False, "error": "Method not allowed. Use POST."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    # Safe file access
    image_file = request.FILES.get("file") or request.FILES.get("image")
    if not image_file:
        image_list = request.FILES.getlist("images") or request.FILES.getlist("files")
        image_file = image_list[0] if image_list else None

    if not image_file:
        logger.error("background_remover: No image file uploaded")
        return Response(
            {"success": False, "error": "No image file uploaded. Please upload an image."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Validation
    allowed_image_types = {"image/jpeg", "image/png", "image/jpg", "image/webp"}
    if image_file.content_type not in allowed_image_types:
        logger.error(f"background_remover: Invalid file type - {image_file.content_type}")
        return Response(
            {
                "success": False,
                "error": f"Invalid file type: {image_file.content_type}. Only JPEG, PNG, JPG, WEBP allowed.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    max_size = 10 * 1024 * 1024  # 10MB
    if image_file.size > max_size:
        logger.error(f"background_remover: File too large - {image_file.size} bytes")
        return Response(
            {"success": False, "error": "File too large. Maximum allowed size is 10MB."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    logger.info(
        f"background_remover: Processing image - {image_file.name}, "
        f"type={image_file.content_type}, size={image_file.size}"
    )

    try:
        image_file.seek(0)
        input_bytes = image_file.read()

        logger.info("background_remover: Removing background with rembg...")
        output_bytes = remove(input_bytes, force_return_bytes=True)

        if not output_bytes:
            logger.error("background_remover: rembg returned empty output")
            return Response(
                {"success": False, "error": "Background removal failed. Empty output received."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        logger.info("background_remover: Background removed successfully")

        response = HttpResponse(output_bytes, content_type="image/png")
        response["Content-Disposition"] = 'attachment; filename="removed_bg.png"'
        return response

    except Exception as e:
        logger.exception(f"background_remover: Unexpected error - {str(e)}")
        return Response(
            {"success": False, "error": f"Background removal failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )