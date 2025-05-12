# ByteBrains: AI-Powered Resume Processing Web Application

ByteBrains is a NLP based resume analysis and job recomendation system that processes resumes to extract skills, categorize profiles, and provide insights using AI models. The application supports file uploads, performs text extraction, and applies natural language processing techniques to analyze resumes.

## Models
#### Fine tuned transforemers models:
- DistillBert
- Bert

#### Available at:  
- [huggingface](https://huggingface.co/mehar27)

## Features

- **Resume Upload**: Users can upload resumes in `.pdf`, `.doc`, or `.docx` formats.
- **Text Extraction**: Extracts text from uploaded resumes.
- **Skill Extraction**: Identifies skills from resumes using a trained model.
- **Profile Categorization**: Categorizes resumes into predefined categories.
- **Interactive UI**: Drag-and-drop file upload with progress indicators.
- **Admin Panel**: Manage data through Django's admin interface.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mE-uMAr/nlp-byteBrains.git
   cd byteBrains
   ```

2. Install dependencies:
```bash
pip install -r requirements.txt
```
3. Apply migrations:
```bash
python manage.py migrate
```

4. Create a superuser:
```bash
python create_superuser.py
```

5. Run the development server:
```bash
python manage.py runserver
```

6. Access the application at http://127.0.0.1:8000

## Usage
- Upload a resume via the drag-and-drop interface or file input.
- The application processes the resume and extracts skills, categories, and other information.
- View the results in the admin panel or integrate them into your workflow.

## Key Files
core/views.py: Handles the upload and processing logic.
models/trained/extracted_skills.csv: Contains a list of extracted skills.
models/ : Fine tuned models available at [huggingface](https://huggingface.co/mehar27)
static/script.js: Manages the interactive UI for file uploads.
templates/index.html: Defines the main user interface.

## Contributing
Contributions are welcome! Please follow these steps:

- Fork the repository.
- Create a new branch for your feature or bug fix.
- Commit your changes and push the branch.
- Submit a pull request.