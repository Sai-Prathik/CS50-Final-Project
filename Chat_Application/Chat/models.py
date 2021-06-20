from django.db import models 
from django.contrib.auth.models import AbstractUser
from datetime import datetime

class User(AbstractUser):
    pass 

    def serialize(self):
        return {
            "username":self.username
        }

class Contacts(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name="user")
    contact=models.ForeignKey(User,on_delete=models.CASCADE,related_name="contact")
    
    def serialize(self): 
            return {
            "username":self.contact.username
            }
     

class Messages(models.Model):
    sender=models.ForeignKey(User,on_delete=models.CASCADE,related_name="Sender",default="")
    message=models.CharField(max_length=1000000,default="")
    sent_date=models.DateTimeField(auto_now=True,blank="")
    receiver=models.ForeignKey(User,on_delete=models.CASCADE,related_name="Receiver",default="")
    
    
    def __str__(self):
        return self.message
    
    
    def serialize(self):
        return{
            "message":self.message,
            "sender":self.sender.username,
            "receiver":self.receiver.username,
            "date":self.sent_date.date(),
            "time":str(self.sent_date.time().hour)+":"+str(self.sent_date.time().minute)
            }