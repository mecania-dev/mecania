from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import View
from typing import List

class IsSelfOrAdmin(BasePermission):
    def __init__(self, user_id_arg: str = 'pk', admin: bool = True):
        self.user_id_arg = user_id_arg
        self.admin = admin

    def has_permission(self, request, view):
        user_id = view.kwargs.get(self.user_id_arg)
        is_self = request.user.id == int(user_id)
        is_admin_allowed = self.admin and request.user.is_superuser

        return is_self or is_admin_allowed

class IsInGroups(BasePermission):
    def __init__(self, groups: List[str], admin: bool = True):
        self.groups = groups
        self.admin = admin

    def has_permission(self, request: Request, view: View) -> bool:
        if not request.user.is_authenticated:
            return False

        is_group_valid = not len(self.groups) or request.user.groups.filter(name__in=self.groups).exists()
        is_admin_allowed = self.admin and request.user.is_superuser

        return is_group_valid or is_admin_allowed
