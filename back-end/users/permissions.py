from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import View
from typing import List

SAFE_METHODS = ("GET", "HEAD", "OPTIONS")


class IsSelfOrAdmin(BasePermission):
    def __init__(self, user_id_arg: str = "pk", admin: bool = True, read_only: bool = False):
        self.user_id_arg = user_id_arg
        self.admin = admin
        self.read_only = read_only

    def has_permission(self, request, view):
        user_id = view.kwargs.get(self.user_id_arg)
        is_self = request.user.id == int(user_id)
        is_admin_allowed = self.admin and request.user.is_superuser
        is_read_only = self.read_only and request.method in SAFE_METHODS

        return is_self or is_admin_allowed or is_read_only


class IsInGroups(BasePermission):
    def __init__(self, groups: List[str], admin: bool = True, read_only: bool = False):
        self.groups = groups
        self.admin = admin
        self.read_only = read_only

    def has_permission(self, request: Request, view: View) -> bool:
        is_group_valid = not len(self.groups) or request.user.groups.filter(name__in=self.groups).exists()
        is_admin_allowed = self.admin and request.user.is_superuser
        is_read_only = self.read_only and request.method in SAFE_METHODS

        return is_group_valid or is_admin_allowed or is_read_only
