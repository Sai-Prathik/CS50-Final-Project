from django.db import models 
from django.contrib.auth.models import AbstractUser
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
    def serialize(self): 
            return {
            "username":self.contact.username,
            "status":self.status
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