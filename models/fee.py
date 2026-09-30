from models.db import db

class RegistrationFee(db.Model):
    __tablename__ = 'registration_fees'

    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(100), nullable=False) # e.g. "UG/PG Students", "Research Scholars"
    inr_early = db.Column(db.String(40), nullable=False) # e.g. "₹ 2,500"
    inr_regular = db.Column(db.String(40), nullable=False) # e.g. "₹ 3,500"
    usd_early = db.Column(db.String(40), nullable=False) # e.g. "$ 75"
    usd_regular = db.Column(db.String(40), nullable=False) # e.g. "$ 100"
    benefits = db.Column(db.String(255), nullable=True)
    display_order = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<RegistrationFee {self.category}>'
