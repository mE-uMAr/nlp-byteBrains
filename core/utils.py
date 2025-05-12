import re
import ast
import requests
import json

API_KEY = "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"

def response(prompt, model="meta-llama/llama-4-scout-17b-16e-instruct", max_tokens=1024):
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "messages": [{"role": "user", "content": prompt}],
        "model": model,
        "max_tokens": max_tokens
    }

    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        return f"Error: {response.status_code} - {response.text}"

def dictResponse(prompt):
    request = "you are an ai trained to return only code no text in response and code must be : ner = {'name':'','email':'','phone':'','address':''} where ner is a dictionary with ners from given text the text is: " + prompt

    res = response(request)
    # print(res)
    dict_str = re.search(r"=\s*({.*})", res, re.DOTALL).group(1)
    ner = ast.literal_eval(dict_str)

    return ner

def listResponse(prompt):
    request = "you are an ai trained to return only code no text in response and code must be : t_skills = [] where t_skills is a list with technical skills from given text the text is: " + prompt

    res = response(request)
    # print(res)
    list_str = re.search(r"=\s*(\[.*\])", res, re.DOTALL).group(1)
    t_skills = ast.literal_eval(list_str)

    return t_skills

def clean_response(response):
    response = response.strip()

    if '=' in response:
        match = re.search(r'=\s*(.+)', response)
        if match:
            return match.group(1).strip()
    
    return response

def strResponse(prompt):
    request = (
        "you are an ai trained to return only a string, no explanation or extra text. "
        "The format must be: class = '' where class is the category of the resume (e.g., electrical engineer, python developer, etc). "
        f"Here is the resume text: {prompt}"
    )

    res = response(request)
    return clean_response(res)

