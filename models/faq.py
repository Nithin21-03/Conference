from models.db import db

class FAQItem(db.Model):
    __tablename__ = 'faq_items'

    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(60), default='General') # Submission, Registration, Venue, Presentation
    question = db.Column(db.String(255), nullable=False)
    answer = db.Column(db.Text, nullable=False)
    display_order = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<FAQItem {self.question[:30]}>'
