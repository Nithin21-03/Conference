import os
from flask import Flask
from config import Config
from models.db import db
from models.admin import Admin
from models.track import ConferenceTrack
from models.dates import ImportantDate
from models.speaker import Speaker
from models.schedule import ScheduleItem
from models.fee import RegistrationFee
from models.faq import FAQItem

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    os.makedirs(os.path.join(app.root_path, 'instance'), exist_ok=True)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['SPEAKER_UPLOAD_FOLDER'], exist_ok=True)
    db.init_app(app)
    return app

def seed_database():
    app = create_app()
    with app.app_context():
        # Clear existing data to remove unwanted invented information
        db.drop_all()
        db.create_all()

        # 1. Admin User
        admin = Admin(
            username='admin',
            full_name='Conference Administrator',
            email='icbdtt@snpsu.edu.in'
        )
        admin.set_password('Admin@SNPSU2026!')
        db.session.add(admin)
        print("Created default admin user: admin / Admin@SNPSU2026!")

        # 2. Conference Tracks (Core requested academic topics)
        tracks_data = [
            {
                "track_number": 1,
                "code": "TRACK-01",
                "title": "Big Data Analytics",
                "short_title": "Data Analytics",
                "icon": "bi-bar-chart-steps",
                "description": "Techniques and methodologies for extracting intelligence, patterns, and insights from massive and complex datasets.",
                "topics": "Large-Scale Data Processing\nPredictive Analytics\nData Mining\nBusiness Intelligence"
            },
            {
                "track_number": 2,
                "code": "TRACK-02",
                "title": "Artificial Intelligence & Machine Learning",
                "short_title": "AI & ML",
                "icon": "bi-cpu",
                "description": "Foundational and applied advancements in machine learning, deep learning architectures, and generative AI models.",
                "topics": "Machine Learning\nDeep Learning\nGenerative AI\nIntelligent Systems"
            },
            {
                "track_number": 3,
                "code": "TRACK-03",
                "title": "Big Data Technologies",
                "short_title": "Distributed Technologies",
                "icon": "bi-hdd-network",
                "description": "Modern distributed frameworks, query systems, and cloud infrastructure engineered for massive data estates.",
                "topics": "Hadoop\nApache Spark\nDistributed Computing\nData Lakes\nCloud Platforms"
            },
            {
                "track_number": 4,
                "code": "TRACK-04",
                "title": "Data Science",
                "short_title": "Data Science",
                "icon": "bi-diagram-3",
                "description": "Rigorous statistical modelling, knowledge discovery paradigms, and analytics for complex data systems.",
                "topics": "Statistical Modelling\nData Visualization\nKnowledge Discovery"
            },
            {
                "track_number": 5,
                "code": "TRACK-05",
                "title": "IoT & Edge Computing",
                "short_title": "IoT & Edge",
                "icon": "bi-broadcast-pin",
                "description": "Architectures, algorithms, and systems for real-time edge intelligence and distributed sensor stream analytics.",
                "topics": "IoT Analytics\nEdge Intelligence\nReal-Time Data Processing"
            },
            {
                "track_number": 6,
                "code": "TRACK-06",
                "title": "Cybersecurity & Privacy",
                "short_title": "Security & Privacy",
                "icon": "bi-shield-check",
                "description": "Safeguarding big data architectures through privacy-preserving analytics, cryptography, and secure data pipelines.",
                "topics": "Big Data Security\nPrivacy-Preserving Analytics\nSecure Data Systems"
            }
        ]
        for td in tracks_data:
            db.session.add(ConferenceTrack(**td))
        print("Seeded 6 Conference Tracks.")

        # 3. Important Dates (Using clear placeholders as instructed)
        dates_data = [
            {
                "title": "Paper Submission Opens",
                "date_value": "[DATE TO BE ANNOUNCED]",
                "description": "Official opening of portal for research paper submissions",
                "is_extended": False,
                "status_badge": "Upcoming",
                "display_order": 1
            },
            {
                "title": "Paper Submission Deadline",
                "date_value": "[SUBMISSION DEADLINE]",
                "description": "Strict deadline for full manuscript submissions (6-8 pages)",
                "is_extended": False,
                "status_badge": "Open",
                "display_order": 2
            },
            {
                "title": "Notification of Acceptance",
                "date_value": "[ACCEPTANCE DATE]",
                "description": "Double-blind review feedback and acceptance notices issued",
                "is_extended": False,
                "status_badge": "Upcoming",
                "display_order": 3
            },
            {
                "title": "Camera Ready Paper",
                "date_value": "[CAMERA READY DEADLINE]",
                "description": "Final formatted manuscript submission and copyright form",
                "is_extended": False,
                "status_badge": "Upcoming",
                "display_order": 4
            },
            {
                "title": "Registration Deadline",
                "date_value": "[REGISTRATION DEADLINE]",
                "description": "Deadline for author and participant registrations",
                "is_extended": False,
                "status_badge": "Upcoming",
                "display_order": 5
            },
            {
                "title": "Conference Date",
                "date_value": "[CONFERENCE DATE]",
                "description": "Inauguration, Keynotes, Technical Presentations & Valedictory",
                "is_extended": False,
                "status_badge": "Upcoming",
                "display_order": 6
            }
        ]
        for dd in dates_data:
            db.session.add(ImportantDate(**dd))
        print("Seeded Important Dates with placeholders.")

        # 4. Speakers (Using clean academic placeholders)
        speakers_data = [
            {
                "name": "[KEYNOTE SPEAKER 1]",
                "designation": "[DESIGNATION]",
                "institution": "[INSTITUTION / UNIVERSITY]",
                "country": "[COUNTRY]",
                "biography": "[Speaker profile and biography to be announced.]",
                "photo": "speaker1.svg",
                "speaker_type": "Keynote",
                "session_topic": "[KEYNOTE TOPIC 1]",
                "display_order": 1
            },
            {
                "name": "[KEYNOTE SPEAKER 2]",
                "designation": "[DESIGNATION]",
                "institution": "[INSTITUTION / UNIVERSITY]",
                "country": "[COUNTRY]",
                "biography": "[Speaker profile and biography to be announced.]",
                "photo": "speaker2.svg",
                "speaker_type": "Keynote",
                "session_topic": "[KEYNOTE TOPIC 2]",
                "display_order": 2
            },
            {
                "name": "[KEYNOTE SPEAKER 3]",
                "designation": "[DESIGNATION]",
                "institution": "[INSTITUTION / UNIVERSITY]",
                "country": "[COUNTRY]",
                "biography": "[Speaker profile and biography to be announced.]",
                "photo": "speaker3.svg",
                "speaker_type": "Keynote",
                "session_topic": "[KEYNOTE TOPIC 3]",
                "display_order": 3
            },
            {
                "name": "[INVITED SPEAKER 1]",
                "designation": "[DESIGNATION]",
                "institution": "[INSTITUTION / INDUSTRY]",
                "country": "[COUNTRY]",
                "biography": "[Speaker profile and biography to be announced.]",
                "photo": "speaker4.svg",
                "speaker_type": "Invited",
                "session_topic": "[INVITED TALK TOPIC]",
                "display_order": 4
            }
        ]
        for sd in speakers_data:
            db.session.add(Speaker(**sd))
        print("Seeded Speakers with clean placeholders.")

        # 5. Registration Fees (Using clean placeholders as requested)
        fees_data = [
            {
                "category": "Students",
                "inr_early": "[REGISTRATION FEE]",
                "inr_regular": "[REGISTRATION FEE]",
                "usd_early": "[REGISTRATION FEE]",
                "usd_regular": "[REGISTRATION FEE]",
                "benefits": "Conference Kit, Certificate, Lunch & Access to Sessions",
                "display_order": 1
            },
            {
                "category": "Research Scholars",
                "inr_early": "[REGISTRATION FEE]",
                "inr_regular": "[REGISTRATION FEE]",
                "usd_early": "[REGISTRATION FEE]",
                "usd_regular": "[REGISTRATION FEE]",
                "benefits": "Proceedings Inclusion, Certificate, Conference Kit & Lunch",
                "display_order": 2
            },
            {
                "category": "Faculty / Academicians",
                "inr_early": "[REGISTRATION FEE]",
                "inr_regular": "[REGISTRATION FEE]",
                "usd_early": "[REGISTRATION FEE]",
                "usd_regular": "[REGISTRATION FEE]",
                "benefits": "Full Conference Access, Presentation Slot, Certificate & Proceedings",
                "display_order": 3
            },
            {
                "category": "Industry Professionals",
                "inr_early": "[REGISTRATION FEE]",
                "inr_regular": "[REGISTRATION FEE]",
                "usd_early": "[REGISTRATION FEE]",
                "usd_regular": "[REGISTRATION FEE]",
                "benefits": "Industry Delegate Access, Certificate & Full Conference Kit",
                "display_order": 4
            },
            {
                "category": "International Participants",
                "inr_early": "[REGISTRATION FEE]",
                "inr_regular": "[REGISTRATION FEE]",
                "usd_early": "[REGISTRATION FEE]",
                "usd_regular": "[REGISTRATION FEE]",
                "benefits": "International Delegate Pass, Proceedings & Certificate",
                "display_order": 5
            }
        ]
        for fd in fees_data:
            db.session.add(RegistrationFee(**fd))
        print("Seeded Registration Fees with placeholders.")

        # 6. Schedule Items
        schedule_data = [
            # Day 1
            {
                "day_number": 1,
                "date_display": "Day 1",
                "start_time": "08:30 AM",
                "end_time": "09:30 AM",
                "session_type": "Registration",
                "session_title": "Delegate Check-in & Registration",
                "speaker": "[REGISTRATION COMMITTEE]",
                "topic": "Welcome reception and badge collection",
                "venue": "[VENUE NAME]",
                "display_order": 1
            },
            {
                "day_number": 1,
                "date_display": "Day 1",
                "start_time": "09:30 AM",
                "end_time": "10:30 AM",
                "session_type": "Inauguration",
                "session_title": "Inauguration Ceremony",
                "speaker": "[DIGNITARIES & CHAIRS]",
                "topic": "Welcome Address, Conference Overview & Inauguration",
                "venue": "[VENUE NAME]",
                "display_order": 2
            },
            {
                "day_number": 1,
                "date_display": "Day 1",
                "start_time": "10:30 AM",
                "end_time": "11:00 AM",
                "session_type": "Break",
                "session_title": "Tea & Networking Break",
                "speaker": None,
                "topic": None,
                "venue": "[VENUE NAME]",
                "display_order": 3
            },
            {
                "day_number": 1,
                "date_display": "Day 1",
                "start_time": "11:00 AM",
                "end_time": "12:15 PM",
                "session_type": "Keynote",
                "session_title": "Keynote Address 1",
                "speaker": "[KEYNOTE SPEAKER 1]",
                "topic": "[KEYNOTE TOPIC 1]",
                "venue": "[VENUE NAME]",
                "display_order": 4
            },
            {
                "day_number": 1,
                "date_display": "Day 1",
                "start_time": "12:15 PM",
                "end_time": "01:15 PM",
                "session_type": "Break",
                "session_title": "Lunch Break",
                "speaker": None,
                "topic": None,
                "venue": "[VENUE NAME]",
                "display_order": 5
            },
            {
                "day_number": 1,
                "date_display": "Day 1",
                "start_time": "01:15 PM",
                "end_time": "03:30 PM",
                "session_type": "Technical Session",
                "session_title": "Technical Paper Presentations: Tracks 1 & 2",
                "speaker": "[SESSION CHAIRS]",
                "topic": "Oral presentations on Big Data Analytics and AI/ML",
                "venue": "[VENUE / HALL A & B]",
                "display_order": 6
            },
            {
                "day_number": 1,
                "date_display": "Day 1",
                "start_time": "03:45 PM",
                "end_time": "05:00 PM",
                "session_type": "Keynote",
                "session_title": "Keynote Address 2",
                "speaker": "[KEYNOTE SPEAKER 2]",
                "topic": "[KEYNOTE TOPIC 2]",
                "venue": "[VENUE NAME]",
                "display_order": 7
            },
            # Day 2
            {
                "day_number": 2,
                "date_display": "Day 2",
                "start_time": "09:30 AM",
                "end_time": "10:45 AM",
                "session_type": "Keynote",
                "session_title": "Keynote Address 3",
                "speaker": "[KEYNOTE SPEAKER 3]",
                "topic": "[KEYNOTE TOPIC 3]",
                "venue": "[VENUE NAME]",
                "display_order": 8
            },
            {
                "day_number": 2,
                "date_display": "Day 2",
                "start_time": "11:00 AM",
                "end_time": "01:00 PM",
                "session_type": "Technical Session",
                "session_title": "Technical Paper Presentations: Tracks 3, 4, 5 & 6",
                "speaker": "[SESSION CHAIRS]",
                "topic": "Oral presentations on Big Data Technologies, Data Science, IoT & Security",
                "venue": "[VENUE / HALL A & B]",
                "display_order": 9
            },
            {
                "day_number": 2,
                "date_display": "Day 2",
                "start_time": "01:00 PM",
                "end_time": "02:00 PM",
                "session_type": "Break",
                "session_title": "Lunch Break",
                "speaker": None,
                "topic": None,
                "venue": "[VENUE NAME]",
                "display_order": 10
            },
            {
                "day_number": 2,
                "date_display": "Day 2",
                "start_time": "02:00 PM",
                "end_time": "03:30 PM",
                "session_type": "Panel",
                "session_title": "Industry-Academia Panel Discussion",
                "speaker": "[PANEL MODERATOR & SPEAKERS]",
                "topic": "Big Data Tools & Techniques in Practice",
                "venue": "[VENUE NAME]",
                "display_order": 11
            },
            {
                "day_number": 2,
                "date_display": "Day 2",
                "start_time": "03:45 PM",
                "end_time": "05:00 PM",
                "session_type": "Valedictory",
                "session_title": "Valedictory & Awards Ceremony",
                "speaker": "[CONFERENCE CHAIRS]",
                "topic": "Best Paper Awards & Vote of Thanks",
                "venue": "[VENUE NAME]",
                "display_order": 12
            }
        ]
        for s in schedule_data:
            db.session.add(ScheduleItem(**s))
        print("Seeded Conference Schedule Items.")

        # 7. FAQs (Clean and factual without invented dates or fake partners)
        faq_data = [
            {
                "category": "Submissions",
                "question": "Who can submit a paper?",
                "answer": "Researchers, academicians, PhD scholars, students, and industry professionals are eligible to submit original research manuscripts within the scope of the conference tracks.",
                "display_order": 1
            },
            {
                "category": "Submissions",
                "question": "What is the paper format?",
                "answer": "Papers should be prepared according to standard double-column conference format (Word template available on the Call for Papers page). Full papers should strictly follow the prescribed page limit.",
                "display_order": 2
            },
            {
                "category": "Submissions",
                "question": "What file formats are accepted?",
                "answer": "The submission portal accepts PDF, DOC, and DOCX formats up to a maximum file size of 16 MB.",
                "display_order": 3
            },
            {
                "category": "Submissions",
                "question": "What are the important dates?",
                "answer": "All important dates, including submission deadlines, notification of acceptance, and camera-ready deadlines, are listed on the Important Dates section of the website.",
                "display_order": 4
            },
            {
                "category": "Registration",
                "question": "How do I register?",
                "answer": "Navigate to the 'Registration' page, select your participant category, fill in your details and linked Paper ID (if applicable), and submit the form to receive your unique Registration ID.",
                "display_order": 5
            },
            {
                "category": "Registration",
                "question": "Can students participate?",
                "answer": "Yes, undergraduate and postgraduate students are encouraged to participate and register under the student category.",
                "display_order": 6
            },
            {
                "category": "Registration",
                "question": "Is there a registration fee?",
                "answer": "Yes, there is a registration fee based on participant categories. Please refer to the Registration Fees section on the website for the current fee structure.",
                "display_order": 7
            },
            {
                "category": "Venue",
                "question": "Where will the conference be conducted?",
                "answer": "The conference will be conducted at Sapthagiri NPS University (SNPSU) Campus, Bengaluru, Karnataka, India. Detailed venue information is available on the Venue page.",
                "display_order": 8
            }
        ]
        for f in faq_data:
            db.session.add(FAQItem(**f))
        print("Seeded FAQ items.")

        db.session.commit()
        print("Clean database seeding completed successfully.")

if __name__ == '__main__':
    seed_database()
