from django.urls import path
from . import views
urlpatterns = [
    path('',views.index,name="home"),
    path('login',views.login_view,name="login"),
    path('register',views.register,name="register"),
    path('get_status',views.get_status,name="status"),
    path('logout',views.logout_view,name="logout"),
    path('set_messages/<str:type>',views.set_messages,name="set_messages"),
    path('get_messages/<str:user>/<str:type>',views.get_messages,name="get_messages"),
    path("get_contacts/<str:user>",views.get_contacts,name="get_contacts"),
    path("get_friends",views.get_friends,name="get_friends"),
    path("set_read_status/<str:user>",views.set_read_status,name="set_read_status"),
    path("get_user_details",views.set_get_user_details,name="user_details"),
    path("create_group",views.create_group,name="create_group"),
    path("leave_delete/<str:type>/<str:group>",views.leave_delete,name="leave_delete")
]