from django.urls import path
from . import views
urlpatterns = [
    path('', views.visual, name= "visual"),
    path('upload/',views.upload, name='upload'),
    path('dashboard/<str:name>/', views.dashboard, name = "dashboard"),
    path('jobs/<str:id>/', views.jobs, name="jobs")
]
