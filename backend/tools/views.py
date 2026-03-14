from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from .models import Tool
from .serializers import ToolSerializer
from io import BytesIO
from django.conf import settings
from PIL import Image

import PyPDF2
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
    """
    Merge PDF files.
    """
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

@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def split_pdf(request):
    """
    Split PDF file.
    """
    if request.method != 'POST':
        return Response(
            {"success": False, "error": "Method not allowed. Use POST."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
    
    pdf_file = request.FILES.get('pdf') or request.FILES.get('file')
    if isinstance(pdf_file, list):
        pdf_file = pdf_file[0] if pdf_file else None
    
    if not pdf_file:
        return Response(
            {"success": False, "error": "No PDF file uploaded"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if pdf_file.content_type != 'application/pdf':
        return Response(
            {"success": False, "error": "Invalid file type. Only PDF allowed."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    logger.info(f"split_pdf: Processing {pdf_file.name}")

    # Parse page ranges
    page_ranges = request.POST.get('page_ranges', '').strip()
    if not page_ranges:
        return Response(
            {"success": False, "error": "Page ranges required (e.g., '1', '1-3,5')"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        pdf_file.seek(0)
        reader = PyPDF2.PdfReader(pdf_file)
        total_pages = len(reader.pages)
        if total_pages == 0:
            return Response(
                {"success": False, "error": "PDF has no pages"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Parse page ranges: 1, 1-3, 2,4,6, 1-3,5,7-9
        selected_pages = set()
        range_parts = page_ranges.split(',')
        for part in range_parts:
            part = part.strip()
            if not part:
                continue
            if '-' in part:
                try:
                    start, end = map(int, part.split('-'))
                    start = max(1, start)
                    end = min(total_pages, end)
                    if start <= end:
                        selected_pages.update(range(start, end + 1))
                except ValueError:
                    return Response(
                        {"success": False, "error": f"Invalid range format: '{part}'. Use '1-3'"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                try:
                    page = int(part)
                    if 1 <= page <= total_pages:
                        selected_pages.add(page)
                except ValueError:
                    return Response(
                        {"success": False, "error": f"Invalid page number: '{part}'. Use numbers only"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

        if not selected_pages:
            return Response(
                {"success": False, "error": "No valid pages selected. Check range limits."},
                status=status.HTTP_400_BAD_REQUEST
            )

        logger.info(f"Extracting pages {sorted(selected_pages)} from {total_pages} total")

        writer = PyPDF2.PdfWriter()
        for page_num in sorted(selected_pages):
            writer.add_page(reader.pages[page_num - 1])

        output = BytesIO()
        writer.write(output)
        output.seek(0)
        
        response = HttpResponse(output.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="split_{pdf_file.name}"'
        return response
        
    except Exception as e:
        logger.exception(f"split_pdf error: {str(e)}")
        return Response(
            {"success": False, "error": f"Split failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@csrf_exempt
@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def image_compressor(request):
    """
    Compress uploaded images to reduce file size.
    Accepts: POST with 'images' (multiple image files)
    Returns: JPEG blob on success
    """
    if request.method != 'POST':
        return Response(
            {"success": False, "error": "Method not allowed. Use POST."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
    
    # Get uploaded files
    files = request.FILES.getlist('images') + request.FILES.getlist('files') + request.FILES.getlist('image') + request.FILES.getlist('file')
    
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
                {"success": False, "error": f"Invalid file type: {f.content_type}"},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Get compression quality (default 80)
    quality = int(request.POST.get('quality', 80))
    quality = max(10, min(95, quality))
    
    logger.info(f"image_compressor: Processing file with quality {quality}")
    
    try:
        image_file = files[0]  # Single file for now
        image_file.seek(0)
        img = Image.open(image_file)
        
        # Convert RGBA/P to RGB for JPEG
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        
        # Compress to JPEG
        output = BytesIO()
        img.save(output, format='JPEG', quality=quality, optimize=True)
        output.seek(0)
        
        # Return blob
        response = HttpResponse(output.getvalue(), content_type='image/jpeg')
        response['Content-Disposition'] = 'attachment; filename="compressed.jpg"'
        return response
        
    except Exception as e:
        logger.exception(f"image_compressor error: {str(e)}")
        return Response(
            {"success": False, "error": f"Compress failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def background_remover(request):
    """
    Remove background using rembg.
    """
    try:
        from rembg import remove
    except ImportError:
        return Response(
            {"success": False, "error": "Background remover dependency is not installed on the server."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    
    if request.method != "POST":
        return Response(
            {"success": False, "error": "Method not allowed. Use POST."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    # Get file
    image_file = request.FILES.get("file") or request.FILES.get("image")
    if not image_file:
        image_list = request.FILES.getlist("images") or request.FILES.getlist("files")
        image_file = image_list[0] if image_list else None

    if not image_file:
        return Response(
            {"success": False, "error": "No image uploaded."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Validate
    allowed_types = {"image/jpeg", "image/png", "image/jpg", "image/webp"}
    if image_file.content_type not in allowed_types:
        return Response(
            {"success": False, "error": "Invalid image type."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if image_file.size > 10 * 1024 * 1024:
        return Response(
            {"success": False, "error": "File too large (max 10MB)."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    logger.info(f"background_remover: Processing {image_file.name}")

    try:
        image_file.seek(0)
        input_bytes = image_file.read()
        output_bytes = remove(input_bytes)

        if not output_bytes:
            return Response(
                {"success": False, "error": "Background removal failed."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        response = HttpResponse(output_bytes, content_type="image/png")
        response["Content-Disposition"] = 'attachment; filename="no-bg.png"'
        return response

    except Exception as e:
        logger.exception(f"background_remover error: {str(e)}")
        return Response(
            {"success": False, "error": "Processing failed."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

