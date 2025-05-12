from django.shortcuts import render, redirect, get_object_or_404
import os
from .models import *
from django.conf import settings
import uuid
from django.contrib import messages
from .utils import dictResponse, listResponse, strResponse
from .textExtractor import cleaner
from .cosine_similarity import similarity
# from models.text_extractor import main as extractor
# from models.ner import extract_info
# from models.classifier import predict_category
# from models.skillsExtractor import main as skills_extractor


def visual(request):
    return render(request, "visual.html")

def upload(request):
    if request.method == 'POST':
        resume_file = request.FILES.get('resume_file')
        resume = Resume.objects.create(resume = resume_file)

        resume_path = resume.resume.name
        file_path = os.path.join(settings.MEDIA_ROOT, resume_path)

        text = cleaner(file_path)
        ner_dict = dictResponse(text)
        categ = strResponse(text)
        skills = listResponse(text)
        # manual configurations
        # text = extractor(file_path)
        # ner_dict = extract_info(text)
        # categ = predict_category(text)
        # skills = skills_extractor(text)

        skillsModel = Skills.objects.create(
            resume = resume,
            skills = skills
        )
        
        name = ner_dict.get('name', '') 
        email = ner_dict.get('email', '')
        phone = ner_dict.get('phone', '')
        address = ner_dict.get('address', '')
        identifier = str(uuid.uuid4()).replace('-','')[:10]

        profile = Profile.objects.create(
            resume = resume,
            identity = identifier,
            name = name,
            category = categ,
            email = email,
            phone = phone,
            address = address
        )
        return redirect("dashboard", name=profile.identity)
    return render(request, "index.html")

def dashboard(request, name):
    profile_obj = Profile.objects.filter(identity = name).first()
    resume = profile_obj.resume
    skills_obj = Skills.objects.filter(resume = resume).first()

    params = {
    "identity":profile_obj.identity,
    "resume": profile_obj.resume.resume,
    'name' : profile_obj.name,
    'email' : profile_obj.email,
    'phone' : profile_obj.phone,
    'address' : profile_obj.address,
    'category': profile_obj.category,
    'skills' : skills_obj.skills,
    'letter': profile_obj.name[:1].capitalize
    }
    return render(request, "home.html", params)

def jobs(request, id):
    if request.method == 'POST':
        jd_text = request.POST.get('job_description', '')
        profile_obj = get_object_or_404(Profile, identity=id)

        if not profile_obj.resume:
            similarity_score = 0
        else:
            resume_path = profile_obj.resume.resume.name
            file_path = os.path.join(settings.MEDIA_ROOT, resume_path)

            try:
                resume_text = cleaner(file_path)
                if jd_text and resume_text:
                    similarity_score = round(similarity(resume_text, jd_text) * 100, 4)
                    if similarity_score <= 30.00:
                        messages.error(request, "Bad Match!")
                    elif 30.00 < similarity_score <= 40.00:
                        messages.error(request, "Intermediate Match!")
                    elif 40.00 < similarity_score <= 50.00:
                        messages.success(request, "Good Match!")
                    elif similarity_score > 50.00:
                        messages.success(request, "Excellent Match!")
                    request.session['similarity_score'] = float(similarity_score)
                else:
                    similarity_score = 0
            except Exception as e:
                print("Error processing file:", e)
                messages.error(request, "Something went wrong.")
                request.session['similarity_score'] = 0

        return redirect('jobs', id=id)
    similarity_score = request.session.pop('similarity_score', None)
    if similarity_score is not None:
        similarity_score = round(similarity_score,2)

    return render(request, "jobs.html", {"similarity": similarity_score})