import random
import string
from datetime import datetime

def generate_registration_id() -> str:
    """Generate a clean, professional unique Registration ID like SNPSU-BDTT-REG-4821"""
    suffix = ''.join(random.choices(string.digits, k=4))
    return f"SNPSU-BDTT-REG-{suffix}"

def generate_paper_id() -> str:
    """Generate a clean, professional unique Paper ID like SNPSU-BDTT-P-1082"""
    suffix = ''.join(random.choices(string.digits, k=4))
    return f"SNPSU-BDTT-P-{suffix}"

def format_file_size(size_bytes: int) -> str:
    if not size_bytes:
        return "0 KB"
    if size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    return f"{size_bytes / (1024 * 1024):.2f} MB"
