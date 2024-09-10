from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage

class CustomS3Boto3Storage(S3Boto3Storage):
    def url(self, name, parameters=None, expire=None, http_method=None):
        url = super().url(name, parameters, expire, http_method)
        endpoint_url = getattr(settings, 'AWS_S3_ENDPOINT_URL', '/s3/')
        url = url.replace(endpoint_url, f"{endpoint_url.rstrip('/s3')}/object/public")
        return url
