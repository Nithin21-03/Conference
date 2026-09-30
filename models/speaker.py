from models.db import db

class Speaker(db.Model):
    __tablename__ = 'speakers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    designation = db.Column(db.String(150), nullable=False)
    institution = db.Column(db.String(200), nullable=False)
    country = db.Column(db.String(80), nullable=True, default='India')
    biography = db.Column(db.Text, nullable=False)
    photo = db.Column(db.String(250), nullable=True) # relative path or URL
    speaker_type = db.Column(db.String(50), default='Keynote') # Keynote, Invited, Guest, Session Chair
    session_topic = db.Column(db.String(250), nullable=True)
    linkedin_url = db.Column(db.String(200), nullable=True)
    scholar_url = db.Column(db.String(200), nullable=True)
    display_order = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<Speaker {self.name} ({self.speaker_type})>'
