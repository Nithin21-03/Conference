from models.db import db

class ImportantDate(db.Model):
    __tablename__ = 'important_dates'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False) # e.g. "Paper Submission Deadline"
    date_value = db.Column(db.String(100), nullable=False) # e.g. "August 30, 2026"
    description = db.Column(db.String(255), nullable=True)
    is_extended = db.Column(db.Boolean, default=False)
    status_badge = db.Column(db.String(40), default='Upcoming') # Upcoming, Open, Closed, Extended
    display_order = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<ImportantDate {self.title}: {self.date_value}>'
