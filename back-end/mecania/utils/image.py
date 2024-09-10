from .env import env
from io import BytesIO
from PIL import Image
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import InMemoryUploadedFile

def compress_image(image):
    max_size_bytes = round(env("MAX_IMAGE_SIZE_LIMIT", 1024 * 1024 * 2.5, float))  # 2.5MB

    if image.size <= max_size_bytes:
        return image

    img = Image.open(image)
    output = BytesIO()
    quality = 95

    # Iterate until the image size is reduced to fit within max_size_bytes
    while True:
        img.save(output, format=img.format, quality=quality)
        output.seek(0, 2)  # Move to the end of the buffer
        if output.tell() <= max_size_bytes:
            break
        else:
            quality -= 5
            output.seek(0)
            output.truncate()

        if quality < 50:
            raise ValidationError(f"Image cannot be compressed to fit {max_size_bytes} bytes. Consider using a lower resolution image.")

    output.seek(0)
    content_type = Image.MIME.get(img.format)
    return InMemoryUploadedFile(output, 'ImageField', image.name, content_type, output.tell(), None)
