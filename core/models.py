from django.db import models

class Resume(models.Model):
    resume = models.FileField(upload_to = "resume")

class Profile(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    identity = models.CharField(max_length = 10)
    name = models.CharField(max_length = 70)
    category = models.CharField(max_length = 70)
    email = models.CharField(max_length = 70)
    phone = models.CharField(max_length = 15)
    address = models.CharField(max_length = 100)

    def __str__(self):
        return self.name

class Skills(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    skills = models.JSONField(default=list, blank=True)