import json
import random
from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app, jsonify
from models import db, Registration, RegistrationFee, PaperSubmission
from utils import generate_registration_id

registration_bp = Blueprint('registration', __name__)

@registration_bp.route('/registration', methods=['GET', 'POST'])
def register():
    fees = RegistrationFee.query.order_by(RegistrationFee.display_order).all()
    
    if request.method == 'POST':
        is_json = request.is_json
        data = request.get_json(silent=True) if is_json else request.form.to_dict()
        if not data:
            data = request.form.to_dict()

        # Extract fields supporting both standard and multi-step format
        name = (data.get('leader_name') or data.get('name') or '').strip()
        srn = (data.get('leader_srn') or data.get('srn') or '').strip()
        email = (data.get('leader_email') or data.get('email') or '').strip().lower()
        phone = (data.get('leader_phone') or data.get('phone') or '').strip()
        institution = (data.get('institution') or 'Sapthagiri NPS University (SNPSU)').strip()
        department = (data.get('leader_department') or data.get('department') or 'Computer Science & Engineering').strip()
        semester = (data.get('leader_semester') or data.get('semester') or '6th').strip()
        designation = (data.get('designation') or 'Student Team Leader').strip()
        participant_type = (data.get('participant_type') or 'Student Project Team').strip()
        country = (data.get('country') or 'India').strip()
        paper_id = (data.get('paper_id') or '').strip().upper()
        accompanying = bool(data.get('accompanying_person'))
        
        # Project fields
        project_title = (data.get('project_title') or data.get('title') or '').strip()
        project_category = (data.get('project_category') or data.get('category') or 'Artificial Intelligence & Machine Learning').strip()
        project_abstract = (data.get('project_abstract') or data.get('abstract') or '').strip()
        technologies = (data.get('technologies') or data.get('project_tech') or '').strip()
        mentor_name = (data.get('mentor_name') or data.get('project_mentor') or '').strip()

        # Members list handling
        team_members_raw = data.get('team_members') or data.get('members') or '[]'
        if isinstance(team_members_raw, str):
            try:
                team_members_list = json.loads(team_members_raw)
            except Exception:
                team_members_list = []
        elif isinstance(team_members_list := team_members_raw, list):
            pass
        else:
            team_members_list = []

        team_members_json = json.dumps(team_members_list)

        # Payment details
        payment_mode = data.get('payment_mode') or 'Razorpay UPI / NetBanking'
        transaction_ref = (data.get('transaction_ref') or data.get('transactionId') or '').strip()
        if not transaction_ref:
            transaction_ref = f"TXN_EXPO_{random.randint(1000000000, 9999999999)}"
        payment_status = data.get('payment_status') or 'Paid'
        amount_paid = data.get('amount_paid') or data.get('amount') or '₹500'
        dietary_pref = data.get('dietary_pref', 'Standard')

        # Desk allocation
        desk_number = data.get('desk_number') or f"Booth {random.choice(['A', 'B', 'C', 'D'])}-{random.randint(10, 48)}"

        # Validation
        errors = []
        if not name:
            errors.append('Participant / Team Leader full name is required.')
        if not email or '@' not in email:
            errors.append('A valid college / institutional email address is required.')
        if not phone:
            errors.append('Contact phone number is required.')

        if errors:
            if is_json:
                return jsonify({'success': False, 'errors': errors}), 400
            for error in errors:
                flash(error, 'danger')
            return render_template('registration.html', fees=fees, form=data)

        try:
            reg_id = generate_registration_id()
            while Registration.query.filter_by(registration_id=reg_id).first():
                reg_id = generate_registration_id()

            new_reg = Registration(
                registration_id=reg_id,
                name=name,
                srn=srn,
                email=email,
                phone=phone,
                institution=institution,
                department=department,
                semester=semester,
                designation=designation,
                participant_type=participant_type,
                country=country,
                paper_id=paper_id if paper_id else None,
                accompanying_person=accompanying,
                project_title=project_title if project_title else 'Project Expo Innovation Entry',
                project_category=project_category,
                project_abstract=project_abstract,
                technologies=technologies,
                mentor_name=mentor_name,
                desk_number=desk_number,
                team_members_json=team_members_json,
                payment_mode=payment_mode,
                transaction_ref=transaction_ref,
                payment_status=payment_status,
                amount_paid=amount_paid,
                dietary_pref=dietary_pref
            )

            db.session.add(new_reg)
            db.session.commit()

            success_url = url_for('registration.registration_success', reg_id=reg_id)

            if is_json:
                return jsonify({
                    'success': True,
                    'registration_id': reg_id,
                    'redirect_url': success_url,
                    'registration': {
                        'id': reg_id,
                        'name': name,
                        'srn': srn,
                        'email': email,
                        'phone': phone,
                        'institution': institution,
                        'department': department,
                        'semester': semester,
                        'project_title': project_title,
                        'project_category': project_category,
                        'project_abstract': project_abstract,
                        'technologies': technologies,
                        'mentor_name': mentor_name,
                        'desk_number': desk_number,
                        'team_members': team_members_list,
                        'payment_status': payment_status,
                        'amount_paid': amount_paid,
                        'transaction_ref': transaction_ref,
                        'created_at': new_reg.created_at.strftime('%Y-%m-%d %H:%M')
                    }
                })

            flash(f'Registration confirmed! Your official Registration ID is {reg_id}', 'success')
            return redirect(success_url)

        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Registration Error: {e}")
            if is_json:
                return jsonify({'success': False, 'errors': ['Failed to complete registration due to a server error.']}), 500
            flash('Failed to complete registration due to a server error. Please try again.', 'danger')
            return render_template('registration.html', fees=fees, form=data)

    initial_paper_id = request.args.get('paper_id', '')
    return render_template('registration.html', fees=fees, initial_paper_id=initial_paper_id, form={})

@registration_bp.route('/registration/success/<reg_id>')
def registration_success(reg_id):
    reg = Registration.query.filter_by(registration_id=reg_id).first_or_404()
    return render_template('registration-success.html', registration=reg)

@registration_bp.route('/registration/api/<reg_id>')
def registration_api(reg_id):
    reg = Registration.query.filter_by(registration_id=reg_id).first_or_404()
    return jsonify({
        'id': reg.registration_id,
        'name': reg.name,
        'srn': reg.srn or '',
        'email': reg.email,
        'phone': reg.phone,
        'institution': reg.institution,
        'department': reg.department,
        'semester': reg.semester or '',
        'project': {
            'title': reg.project_title or 'Project Expo Entry',
            'category': reg.project_category or 'General Innovation',
            'abstract': reg.project_abstract or '',
            'technologies': reg.technologies or '',
            'mentorName': reg.mentor_name or '',
        },
        'members': reg.team_members,
        'deskNumber': reg.desk_number or 'Allocated on Event Day',
        'payment': {
            'status': reg.payment_status,
            'amount': reg.amount_paid or '₹500',
            'transactionId': reg.transaction_ref or 'TXN_EXPO_N/A',
            'method': reg.payment_mode
        },
        'createdAt': reg.created_at.strftime('%Y-%m-%d %H:%M')
    })
