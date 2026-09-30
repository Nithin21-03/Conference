from models.db import db

class ConferenceTrack(db.Model):
    __tablename__ = 'conference_tracks'

    id = db.Column(db.Integer, primary_key=True)
    track_number = db.Column(db.Integer, nullable=False, default=1)
    code = db.Column(db.String(20), nullable=True) # e.g. "TRACK-01"
    title = db.Column(db.String(150), nullable=False)
    short_title = db.Column(db.String(60), nullable=True)
    icon = db.Column(db.String(60), default='fa-database')
    description = db.Column(db.Text, nullable=False)
    topics = db.Column(db.Text, nullable=False) # newline or comma-separated list of topics

    def get_topic_list(self):
        return [t.strip() for t in self.topics.split('\n') if t.strip()]

    def __repr__(self):
        return f'<Track {self.track_number}: {self.title}>'
