import os
import secrets
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_paper_file(file_storage, upload_folder: str, paper_id: str):
    """
    Safely saves an uploaded paper file.
    Returns: (saved_relative_path, original_filename, file_size)
    """
    os.makedirs(upload_folder, exist_ok=True)
    
    orig_name = secure_filename(file_storage.filename)
    if not orig_name:
        orig_name = "paper_submission.pdf"
        
    ext = orig_name.rsplit('.', 1)[1].lower() if '.' in orig_name else 'pdf'
    safe_filename = f"{paper_id}_{secrets.token_hex(4)}.{ext}"
    full_path = os.path.join(upload_folder, safe_filename)
    
    # Save the file
    file_storage.save(full_path)
    file_size = os.path.getsize(full_path)
    
    return full_path, orig_name, file_size
