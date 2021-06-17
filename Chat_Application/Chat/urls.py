from django.urls import path
from . import views
urlpatterns = [
    path('',views.index,name="home"),
    path('login',views.login_view,name="login"),
    path('register',views.register,name="register"),
    path('get_status',views.get_status,name="status"),
    path('logout',views.logout_view,name="logout"),
]