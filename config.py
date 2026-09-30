import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'snpsu_bdtt_conf_2026_default_secret_key_8f7b3a9c')
    
    # Database: SQLite for development, can easily be switched to PostgreSQL
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        f"sqlite:///{BASE_DIR / 'instance' / 'conference.db'}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # File Uploads
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads', 'papers')
    SPEAKER_UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'images', 'speakers')
    ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max limit
    
    # Official Conference Branding (Using Clean Placeholders for unconfirmed details)
    CONFERENCE_NAME = "International Conference on Big Data Tools and Techniques"
    CONFERENCE_ACRONYM = "ICBDTT-2026"
    CONFERENCE_THEME = "Advancing Data-Driven Research, Innovation and Intelligent Solutions"
    HOST_INSTITUTION = "Sapthagiri NPS University (SNPSU)"
    HOST_LOCATION = "Bengaluru, Karnataka, India"
    HOST_CAMPUS = "Sapthagiri NPS University Campus, Bengaluru, Karnataka, India"
    VENUE_NAME = "[VENUE NAME]"
    CONFERENCE_DATE = "[CONFERENCE DATE]"
    CONFERENCE_EMAIL = "[CONFERENCE EMAIL]"
    CONFERENCE_PHONE = "[CONFERENCE PHONE]"
    REGISTRATION_FEE_PLACEHOLDER = "[REGISTRATION FEE]"
