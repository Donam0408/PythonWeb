from django.http import HttpResponseRedirect
from django.core.exceptions import PermissionDenied
from django.urls import reverse
from django.shortcuts import render
from django.shortcuts import redirect


def role_required(allowed_roles=[]):
    def decorator(view_func):
        def wrap(request, *args, **kwargs):
            if request.user.profile.userStatus in allowed_roles:
                return view_func(request, *args, **kwargs)
            else:
                return render(request, "dashboard/404.html")
        return wrap
    return decorator


def admin_only(view_func):
    def wrap(request, *args, **kwargs):
        if request.user.username == "admin":
            return view_func(request, *args, **kwargs)
        else:
            return render(request, "home/TestDG.html")
    return wrap
def admin_only2(view_func):
    def wrap(request, *args, **kwargs):
        if request.user.username == "admin":
            return view_func(request, *args, **kwargs)
        else:
            return render(request, "home/TestDG.html")
    return wrap

