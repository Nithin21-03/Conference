from models.db import db

class ScheduleItem(db.Model):
    __tablename__ = 'schedule_items'

    id = db.Column(db.Integer, primary_key=True)
    day_number = db.Column(db.Integer, nullable=False, default=1) # 1 or 2
    date_display = db.Column(db.String(60), nullable=False) # e.g. "Day 1 - [CONFERENCE DATE]"
    start_time = db.Column(db.String(30), nullable=False) # "09:00 AM"
    end_time = db.Column(db.String(30), nullable=False) # "10:30 AM"
    session_type = db.Column(db.String(60), nullable=False) # Inauguration, Keynote, Technical Session, Workshop, Valedictory, Break
    session_title = db.Column(db.String(255), nullable=False)
    speaker = db.Column(db.String(150), nullable=True)
    topic = db.Column(db.String(255), nullable=True)
    venue = db.Column(db.String(120), nullable=False, default='Main Auditorium')
    display_order = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<ScheduleItem Day {self.day_number} - {self.session_title}>'
