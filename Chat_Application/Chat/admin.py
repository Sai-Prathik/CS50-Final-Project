from django.contrib import admin
from .models import User,Messages,Contacts,Chat_Group,Group_messages
# Register your models here.

class MessageAdmin(admin.ModelAdmin):
    search_fields=["message","sender","receiver"]



admin.site.register(User)
admin.site.register(Messages,MessageAdmin)
admin.site.register(Contacts)
admin.site.register(Chat_Group)
admin.site.register(Group_messages)