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
from .models import Messages, User,Contacts
from django.views.generic import TemplateView
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
            return JsonResponse({"Message":"Logged in Successfully","status":True,"username":request.user.serialize()},safe=False)
    return JsonResponse({"Message":"Login Failed","status":False})

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


@csrf_exempt
def set_messages(request):
        if request.method=="POST":
            data=json.loads(request.body)
            sender=User.objects.get(username=request.user)
            receiver=User.objects.get(username=data["receiver"])
            message=data["message"]
            obj=Messages(sender=sender,receiver=receiver,message=message)
            obj.save()

            
            try:
                Contacts.objects.get(user=sender,contact=receiver) 
                
            except Contacts.DoesNotExist:
                Contacts(user=sender,contact=receiver).save()
                Contacts(user=receiver,contact=sender).save()
            
            obj=Contacts.objects.get(user=receiver,contact=sender)
            obj.status=True
            obj.save()
                
            return JsonResponse({"Message":"Message Sent"})
        else:
            return JsonResponse({"Message":"Error"})



def get_messages(request,user):
        l=[] 
        user_=User.objects.get(username=user)
        sent_messages=Messages.objects.filter(sender=request.user,receiver=user_)
        received_messages=Messages.objects.filter(receiver=request.user,sender=user_) 
        l=list(sent_messages)+list(received_messages) 
        l=sorted(l,key=lambda x:x.sent_date,reverse=False) 
        return JsonResponse([i.serialize() for i in l],safe=False)



def get_contacts(request,user): 
        obj=User.objects.filter(username__contains=user)  
        return JsonResponse([i.serialize() for i in obj if i!=request.user],safe=False)

def get_friends(request):
    obj=Contacts.objects.filter(user=request.user) 
    l1=[i.serialize() for i in obj] 
    return JsonResponse(l1,safe=False)

def set_read_status(request,user):
    contact_obj=User.objects.get(username=user)
    user_obj=User.objects.get(username=request.user)
    obj=Contacts.objects.get(user=user_obj,contact=contact_obj)
    print(user)
    obj.status=False
    obj.save()
    return JsonResponse({"Message":"Successful"})

@csrf_exempt
def set_get_user_details(request):
        if request.method=="POST":
            data=json.loads(request.body)
            obj=User.objects.get(username=request.user)
            obj.username=data["username"]
            obj.email=data["Email"]
            obj.first_name=data["first_name"]
            obj.last_name=data["last_name"]
            obj.save()

            return JsonResponse({"Message":"Changes Saved"})
        else:
            return JsonResponse(request.user.serialize())