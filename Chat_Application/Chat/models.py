from django.db import models 
from django.contrib.auth.models import AbstractUser
from datetime import datetime

class User(AbstractUser):
    pass 

class Messages(models.Model):
    sender=models.ForeignKey(User,on_delete=models.CASCADE,related_name="Sender",default="")
    message=models.CharField(max_length=1000000,default="")
    sent_date=models.DateTimeField(default=datetime.now(),blank="")
    receiver=models.ForeignKey(User,on_delete=models.CASCADE,related_name="Receiver",default="")
  