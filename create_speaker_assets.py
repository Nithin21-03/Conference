import os

os.makedirs('static/images/speakers', exist_ok=True)

speakers = [
    {
        'file': 'speaker1.svg',
        'initials': 'DS',
        'name': 'Prof. David A. Sterling',
        'bg1': '#001040',
        'bg2': '#123569',
        'accent': '#C69E66',
        'role': 'Distributed Systems / MIT'
    },
    {
        'file': 'speaker2.svg',
        'initials': 'SR',
        'name': 'Dr. Sunita Ramanathan',
        'bg1': '#1e1b4b',
        'bg2': '#312e81',
        'accent': '#f59e0b',
        'role': 'Chief AI Scientist / IISc'
    },
    {
        'file': 'speaker3.svg',
        'initials': 'HT',
        'name': 'Prof. Hiroshi Tanaka',
        'bg1': '#0f172a',
        'bg2': '#1e293b',
        'accent': '#38bdf8',
        'role': 'Edge Computing / Tokyo Tech'
    },
    {
        'file': 'speaker4.svg',
        'initials': 'AS',
        'name': 'Dr. Arvind K. Swaminathan',
        'bg1': '#022c22',
        'bg2': '#064e3b',
        'accent': '#34d399',
        'role': 'Cloud Big Data Architect / AWS'
    }
]

for s in speakers:
    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 360" width="320" height="360">
  <defs>
    <linearGradient id="grad_{s['initials']}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{s['bg1']}" />
      <stop offset="100%" stop-color="{s['bg2']}" />
    </linearGradient>
    <radialGradient id="glow_{s['initials']}" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="{s['accent']}" stop-opacity="0.35" />
      <stop offset="100%" stop-color="{s['accent']}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="320" height="360" rx="16" fill="url(#grad_{s['initials']})" />
  <circle cx="160" cy="140" r="110" fill="url(#glow_{s['initials']})" />
  
  <g stroke="rgba(255,255,255,0.08)" stroke-width="1">
    <line x1="40" y1="60" x2="280" y2="60" />
    <line x1="40" y1="160" x2="280" y2="160" />
    <line x1="40" y1="260" x2="280" y2="260" />
    <line x1="100" y1="30" x2="100" y2="330" />
    <line x1="220" y1="30" x2="220" y2="330" />
  </g>
  
  <circle cx="160" cy="130" r="60" fill="rgba(255,255,255,0.06)" stroke="{s['accent']}" stroke-width="3" />
  <circle cx="160" cy="130" r="50" fill="rgba(0,0,0,0.25)" />
  
  <path d="M160 95 a 22 22 0 1 0 0.1 0 Z M126 165 C126 142 142 134 160 134 C178 134 194 142 194 165 Z" fill="{s['accent']}" opacity="0.9" />

  <rect x="134" y="170" width="52" height="22" rx="11" fill="{s['accent']}" />
  <text x="160" y="185" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#001040" text-anchor="middle">{s['initials']}</text>

  <text x="160" y="235" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">{s['name']}</text>
  <text x="160" y="260" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="{s['accent']}" text-anchor="middle">{s['role']}</text>
  <text x="160" y="282" font-family="Arial, sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">Keynote Scholar &amp; Speaker</text>
  <text x="160" y="302" font-family="Arial, sans-serif" font-size="10" fill="#cbd5e1" text-anchor="middle">ICBDTT-2026 • SNPSU</text>
</svg>"""
    
    path = os.path.join('static', 'images', 'speakers', s['file'])
    with open(path, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print(f"Created: {path}")

# Update speaker records in database to point to these SVG files
from seed_data import create_app
from models import db, Speaker
app = create_app()
with app.app_context():
    s1 = Speaker.query.filter_by(name='Prof. David A. Sterling').first()
    if s1: s1.photo = 'speaker1.svg'
    s2 = Speaker.query.filter_by(name='Dr. Sunita Ramanathan').first()
    if s2: s2.photo = 'speaker2.svg'
    s3 = Speaker.query.filter_by(name='Prof. Hiroshi Tanaka').first()
    if s3: s3.photo = 'speaker3.svg'
    s4 = Speaker.query.filter_by(name='Dr. Arvind K. Swaminathan').first()
    if s4: s4.photo = 'speaker4.svg'
    db.session.commit()
    print("Updated database speaker photo filenames.")
