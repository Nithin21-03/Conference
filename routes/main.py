import os
from flask import Blueprint, render_template, send_from_directory, current_app, abort
from models import ConferenceTrack, ImportantDate, Speaker, ScheduleItem, RegistrationFee, FAQItem, PaperSubmission, Registration

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    tracks = ConferenceTrack.query.order_by(ConferenceTrack.track_number).all()
    dates = ImportantDate.query.order_by(ImportantDate.display_order).all()
    keynote_speakers = Speaker.query.filter_by(speaker_type='Keynote').order_by(Speaker.display_order).all()
    fees = RegistrationFee.query.order_by(RegistrationFee.display_order).all()
    
    return render_template(
        'index.html',
        tracks=tracks,
        dates=dates,
        speakers=keynote_speakers,
        fees=fees
    )

@main_bp.route('/about')
def about():
    return render_template('about.html')

@main_bp.route('/tracks')
def tracks():
    all_tracks = ConferenceTrack.query.order_by(ConferenceTrack.track_number).all()
    return render_template('tracks.html', tracks=all_tracks)

@main_bp.route('/call-for-papers')
def call_for_papers():
    tracks = ConferenceTrack.query.order_by(ConferenceTrack.track_number).all()
    dates = ImportantDate.query.order_by(ImportantDate.display_order).all()
    return render_template('call-for-papers.html', tracks=tracks, dates=dates)

@main_bp.route('/speakers')
def speakers():
    keynotes = Speaker.query.filter_by(speaker_type='Keynote').order_by(Speaker.display_order).all()
    invited = Speaker.query.filter(Speaker.speaker_type != 'Keynote').order_by(Speaker.display_order).all()
    return render_template('speakers.html', keynotes=keynotes, invited=invited)

@main_bp.route('/committee')
def committee():
    return render_template('committee.html')

@main_bp.route('/schedule')
def schedule():
    day1_items = ScheduleItem.query.filter_by(day_number=1).order_by(ScheduleItem.display_order).all()
    day2_items = ScheduleItem.query.filter_by(day_number=2).order_by(ScheduleItem.display_order).all()
    return render_template('schedule.html', day1_items=day1_items, day2_items=day2_items)

@main_bp.route('/fees')
def fees():
    fees_list = RegistrationFee.query.order_by(RegistrationFee.display_order).all()
    return render_template('fees.html', fees=fees_list)

@main_bp.route('/venue')
def venue():
    return render_template('venue.html')

@main_bp.route('/faq')
def faq():
    faqs = FAQItem.query.order_by(FAQItem.display_order).all()
    categories = list(dict.fromkeys([f.category for f in faqs]))
    return render_template('faq.html', faqs=faqs, categories=categories)

@main_bp.route('/download-template')
def download_template():
    downloads_dir = os.path.join(current_app.root_path, 'static', 'downloads')
    filename = 'SNPSU_BDTT_2026_Paper_Template.docx'
    if not os.path.exists(os.path.join(downloads_dir, filename)):
        abort(404)
    return send_from_directory(downloads_dir, filename, as_attachment=True)
