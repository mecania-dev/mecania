from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware


@database_sync_to_async
def get_user(token_key):
    try:
        jwt_auth = JWTAuthentication()
        validated_token = jwt_auth.get_validated_token(token_key)
        return jwt_auth.get_user(validated_token)
    except InvalidToken:
        return AnonymousUser()


class SocketTokenAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        super().__init__(inner)

    async def __call__(self, scope, receive, send):
        try:
            token_key = (dict((x.split("=") for x in scope["query_string"].decode().split("&")))).get("token", None)
        except ValueError:
            token_key = None
        scope["user"] = AnonymousUser() if token_key is None else await get_user(token_key)
        return await super().__call__(scope, receive, send)
