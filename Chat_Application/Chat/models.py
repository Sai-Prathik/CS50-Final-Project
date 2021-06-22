from django.db import models 
from django.contrib.auth.models import AbstractUser, Group
from datetime import datetime

class User(AbstractUser):
    pass 

    def serialize(self):
        return {
            "username":self.username,
            "Email":self.email,
            "first_name":self.first_name,
            "second_name":self.last_name
        }

class Contacts(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name="user")
    contact=models.ForeignKey(User,on_delete=models.CASCADE,related_name="contact")
    status=models.BooleanField(default=True)
    def get_status(self):
        return self.status
    def serialize(self): 
            return {
            "username":self.contact.username,
            "status":self.status,
            "type":"contact"
            }

class Chat_Group(models.Model):
    group_name=models.CharField(default="Default Group",max_length=30)
    created_by=models.ForeignKey(User,on_delete=models.CASCADE)
    created_date=models.DateTimeField(auto_now_add=True)
    members=models.ManyToManyField(User,related_name="members",default="")

    def serialize(self):
        return{
            "username":self.group_name,
            "type":"group",
            "admin":self.created_by.username
        }
     

class Messages(models.Model):
    sender=models.ForeignKey(User,on_delete=models.CASCADE,related_name="Sender",default="")
    message=models.CharField(max_length=1000000,default="")
    sent_date=models.DateTimeField(auto_now=True,blank="")
    receiver=models.ForeignKey(User,on_delete=models.CASCADE,related_name="Receiver",default="")
     
    
    def __str__(self):
        return self.message
    
    
    def serialize(self): 
        month=datetime.strptime(str(self.sent_date.month),"%m") 
        date=str(month.strftime("%b"))+","+str(self.sent_date.day)
        time=self.sent_date.strftime("%H:%M %p") 

       

        return {
            "message":self.message,
            "sender":self.sender.username,
            "receiver":self.receiver.username,
            "date":date,
            "time": time 
            }

class Group_messages(models.Model):
    sender=models.ForeignKey(User,on_delete=models.CASCADE,related_name="Group_Sender",null=True)
    message=models.CharField(max_length=1000000,default="")
    sent_date=models.DateTimeField(auto_now=True)
    receiver=models.ForeignKey(User,on_delete=models.CASCADE,related_name="Group_Receiver",null=True)
    group_name=models.ForeignKey(Chat_Group,on_delete=models.CASCADE)


    def __str__(self):
        return self.message
    
    
    def serialize(self): 
        month=datetime.strptime(str(self.sent_date.month),"%m") 
        date=str(month.strftime("%b"))+","+str(self.sent_date.day)
        time=self.sent_date.strftime("%H:%M %p") 

       

        return {
            "message":self.message,
            "sender":self.sender.username, 
            "date":date,
            "time": time 
            }