from json.decoder import JSONDecodeError
from django.http.response import HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth import authenticate,login,logout
from django.http import JsonResponse, request
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required 
from django.views.decorators.csrf import csrf_exempt  
from django.db import IntegrityError
import json
from .models import User
def index(request): 
    return render(request,"Template.html")

@csrf_exempt
def login_view(request):
    if request.method=="POST":
        data=json.loads(request.body) 
        user=authenticate(request,username=data["username"],password=data["password"]) 
        
        if user is None:
         return JsonResponse({"Message":"Login Failed","status":False})
        else:
            login(request,user) 
            return JsonResponse({"Message":"Logged in Successfully","status":True},safe=False)

@csrf_exempt
def register(request):
    if request.method=="POST":
        data=json.loads(request.body) 
        try:
            new_user=User(email=data["mail"],username=data["username"],first_name=data["first_name"],last_name=data["last_name"])
            new_user.set_password(data["password"])
            new_user.save()
        except IntegrityError:
            return JsonResponse({"Message":"Username Already Exists"})
    return JsonResponse({"Message":"Signed up"})
 


def logout_view(request):
    logout(request)
    return JsonResponse({"message":"logged out"})


def get_status(request):
    if request.user.is_authenticated:
        return JsonResponse({"status":True})
    else:
        return JsonResponse({"status":False})