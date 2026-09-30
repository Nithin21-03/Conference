/**
 * ICBDTT-2026 / Project Expo: Multi-Step Registration Controller
 * Implements 5-step registration workflow:
 * Step 1: Team Leader Info
 * Step 2: Team Members (2-5 students)
 * Step 3: Project Innovation & Abstract
 * Step 4: Review & Academic Declaration
 * Step 5: Fee Summary & Gateway Simulation
 */

(function () {
  'use strict';

  const DRAFT_DATA_KEY = 'snpsu_expo_reg_draft_data_v2';
  const DRAFT_STEP_KEY = 'snpsu_expo_reg_draft_step_v2';

  // Default state matching the specification
  const DEFAULT_FORM_DATA = {
    leader: {
      name: '',
      srn: '',
      email: '',
      phone: '',
      department: 'Computer Science & Engineering',
      semester: '6th'
    },
    members: [
      {
        id: 'member-1',
        name: '',
        srn: '',
        email: '',
        department: 'Computer Science & Engineering',
        semester: '6th'
      }
    ],
    project: {
      title: '',
      category: 'Artificial Intelligence & Machine Learning',
      abstract: '',
      technologies: '',
      mentorName: ''
    },
    confirmedAccuracy: false
  };

  let currentStep = 1;
  let maxVisitedStep = 1;
  let formData = JSON.parse(JSON.stringify(DEFAULT_FORM_DATA));

  // Initialize on DOM Ready
  document.addEventListener('DOMContentLoaded', function () {
    const regForm = document.getElementById('multi-step-reg-form');
    if (!regForm) return;

    loadDraft();
    bindEvents();
    renderMembers();
    renderStep(currentStep);
    updateAbstractCounter();
  });

  /* ---------------------------------------------------------
   * Draft Storage (LocalStorage Persistence)
   * --------------------------------------------------------- */
  function saveDraft() {
    try {
      syncDomToState();
      localStorage.setItem(DRAFT_DATA_KEY, JSON.stringify(formData));
      localStorage.setItem(DRAFT_STEP_KEY, currentStep.toString());
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  function loadDraft() {
    try {
      const savedData = localStorage.getItem(DRAFT_DATA_KEY);
      const savedStep = localStorage.getItem(DRAFT_STEP_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        formData = Object.assign({}, DEFAULT_FORM_DATA, parsed);
        // Ensure at least 1 member exists
        if (!formData.members || formData.members.length === 0) {
          formData.members = [JSON.parse(JSON.stringify(DEFAULT_FORM_DATA.members[0]))];
        }
      }
      if (savedStep) {
        const stepNum = parseInt(savedStep, 10);
        if (stepNum >= 1 && stepNum <= 5) {
          currentStep = stepNum;
          maxVisitedStep = Math.max(maxVisitedStep, stepNum);
        }
      }
    } catch (e) {
      console.warn('LocalStorage load error:', e);
      formData = JSON.parse(JSON.stringify(DEFAULT_FORM_DATA));
    }
    populateDomFromState();
  }

  function clearDraft() {
    try {
      localStorage.removeItem(DRAFT_DATA_KEY);
      localStorage.removeItem(DRAFT_STEP_KEY);
    } catch (e) {}
  }

  /* ---------------------------------------------------------
   * State <-> DOM Synchronization
   * --------------------------------------------------------- */
  function syncDomToState() {
    // Step 1: Leader
    const nameEl = document.getElementById('leader_name');
    const srnEl = document.getElementById('leader_srn');
    const emailEl = document.getElementById('leader_email');
    const phoneEl = document.getElementById('leader_phone');
    const deptEl = document.getElementById('leader_department');
    const semEl = document.getElementById('leader_semester');

    if (nameEl) formData.leader.name = nameEl.value.trim();
    if (srnEl) formData.leader.srn = srnEl.value.trim().toUpperCase();
    if (emailEl) formData.leader.email = emailEl.value.trim().toLowerCase();
    if (phoneEl) formData.leader.phone = phoneEl.value.trim();
    if (deptEl) formData.leader.department = deptEl.value;
    if (semEl) formData.leader.semester = semEl.value;

    // Step 2: Members
    const memberRows = document.querySelectorAll('.member-entry-card');
    formData.members = [];
    memberRows.forEach(function (row, idx) {
      const mName = row.querySelector('.member-name-input');
      const mSrn = row.querySelector('.member-srn-input');
      const mEmail = row.querySelector('.member-email-input');
      const mDept = row.querySelector('.member-dept-input');
      const mSem = row.querySelector('.member-sem-input');

      formData.members.push({
        id: 'member-' + (idx + 1),
        name: mName ? mName.value.trim() : '',
        srn: mSrn ? mSrn.value.trim().toUpperCase() : '',
        email: mEmail ? mEmail.value.trim().toLowerCase() : '',
        department: mDept ? mDept.value : formData.leader.department,
        semester: mSem ? mSem.value : formData.leader.semester
      });
    });

    // Step 3: Project
    const titleEl = document.getElementById('project_title');
    const catEl = document.getElementById('project_category');
    const abstractEl = document.getElementById('project_abstract');
    const techEl = document.getElementById('project_tech');
    const mentorEl = document.getElementById('project_mentor');

    if (titleEl) formData.project.title = titleEl.value.trim();
    if (catEl) formData.project.category = catEl.value;
    if (abstractEl) formData.project.abstract = abstractEl.value.trim();
    if (techEl) formData.project.technologies = techEl.value.trim();
    if (mentorEl) formData.project.mentorName = mentorEl.value.trim();

    // Step 4: Accuracy Confirmation
    const checkEl = document.getElementById('review-accuracy-checkbox');
    if (checkEl) formData.confirmedAccuracy = checkEl.checked;
  }

  function populateDomFromState() {
    // Leader
    setValue('leader_name', formData.leader.name);
    setValue('leader_srn', formData.leader.srn);
    setValue('leader_email', formData.leader.email);
    setValue('leader_phone', formData.leader.phone);
    setValue('leader_department', formData.leader.department || 'Computer Science & Engineering');
    setValue('leader_semester', formData.leader.semester || '6th');

    // Project
    setValue('project_title', formData.project.title);
    setValue('project_category', formData.project.category || 'Artificial Intelligence & Machine Learning');
    setValue('project_abstract', formData.project.abstract);
    setValue('project_tech', formData.project.technologies);
    setValue('project_mentor', formData.project.mentorName);

    // Accuracy
    const checkEl = document.getElementById('review-accuracy-checkbox');
    if (checkEl) {
      checkEl.checked = Boolean(formData.confirmedAccuracy);
      const btn4 = document.getElementById('btn-next-step-4');
      if (btn4) btn4.disabled = !formData.confirmedAccuracy;
    }
  }

  function setValue(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) {
      el.value = val;
    }
  }

  /* ---------------------------------------------------------
   * Step Navigation & Rendering
   * --------------------------------------------------------- */
  function renderStep(step) {
    currentStep = step;
    maxVisitedStep = Math.max(maxVisitedStep, step);

    // Hide all step panels
    for (let s = 1; s <= 5; s++) {
      const panel = document.getElementById('step-panel-' + s);
      if (panel) {
        panel.style.display = (s === step) ? 'block' : 'none';
      }
    }

    // Update stepper list items
    const stepperItems = document.querySelectorAll('.reg-step-item');
    stepperItems.forEach(function (item) {
      const itemStep = parseInt(item.getAttribute('data-step'), 10);
      const btn = item.querySelector('.reg-step-btn');
      const circle = item.querySelector('.reg-step-circle');

      item.classList.remove('active', 'completed');

      if (itemStep < step) {
        item.classList.add('completed');
        if (circle) circle.innerHTML = '<i class="bi bi-check-lg" style="font-weight:900;"></i>';
        if (btn) btn.removeAttribute('disabled');
      } else if (itemStep === step) {
        item.classList.add('active');
        if (circle) circle.textContent = itemStep;
        if (btn) btn.removeAttribute('disabled');
      } else {
        if (circle) circle.textContent = itemStep;
        if (btn) {
          if (itemStep <= maxVisitedStep) {
            btn.removeAttribute('disabled');
          } else {
            btn.setAttribute('disabled', 'disabled');
          }
        }
      }
    });

    hideError();

    // Contextual renders
    if (step === 2) {
      updateLeaderSummaryBanner();
    } else if (step === 4) {
      renderReviewStep();
    } else if (step === 5) {
      renderPaymentStep();
    }

    saveDraft();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  function showError(msg) {
    const alertBox = document.getElementById('step-error-alert');
    const alertText = document.getElementById('step-error-text');
    if (alertBox && alertText) {
      alertText.textContent = msg;
      alertBox.style.display = 'block';
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function hideError() {
    const alertBox = document.getElementById('step-error-alert');
    if (alertBox) alertBox.style.display = 'none';
  }

  /* ---------------------------------------------------------
   * Validation Rules
   * --------------------------------------------------------- */
  function validateStep1() {
    syncDomToState();
    const l = formData.leader;
    if (!l.name || l.name.length < 2) {
      showError('Please enter the Team Leader full name.');
      return false;
    }
    if (!l.srn || l.srn.length < 3) {
      showError('Please enter a valid SRN / USN / Student ID for the Team Leader.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!l.email || !emailRegex.test(l.email)) {
      showError('Please enter a valid college / institutional email address.');
      return false;
    }
    if (!l.phone || l.phone.replace(/[^0-9]/g, '').length < 10) {
      showError('Please enter a valid 10-digit phone number.');
      return false;
    }
    if (!l.department) {
      showError('Please select your academic department.');
      return false;
    }
    return true;
  }

  function validateStep2() {
    syncDomToState();
    const totalSize = 1 + formData.members.length;
    if (totalSize < 2) {
      showError('A minimum of 2 students (1 Leader + at least 1 Member) is required to register.');
      return false;
    }
    if (totalSize > 5) {
      showError('A maximum of 5 students (1 Leader + up to 4 Members) is allowed per team.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (let i = 0; i < formData.members.length; i++) {
      const m = formData.members[i];
      const memberNum = i + 2;
      if (!m.name || m.name.length < 2) {
        showError('Please enter the full name for Team Member #' + memberNum + '.');
        return false;
      }
      if (!m.srn || m.srn.length < 3) {
        showError('Please enter a valid SRN / USN for Team Member #' + memberNum + ' (' + m.name + ').');
        return false;
      }
      if (!m.email || !emailRegex.test(m.email)) {
        showError('Please enter a valid email for Team Member #' + memberNum + ' (' + m.name + ').');
        return false;
      }
    }
    return true;
  }

  function validateStep3() {
    syncDomToState();
    const p = formData.project;
    if (!p.title || p.title.length < 5) {
      showError('Please enter a descriptive Project Title (minimum 5 characters).');
      return false;
    }
    if (!p.category) {
      showError('Please select a project category / track.');
      return false;
    }
    if (!p.abstract || p.abstract.length < 40) {
      showError('Please provide a descriptive abstract (minimum 40 characters). Current length: ' + (p.abstract ? p.abstract.length : 0) + ' characters.');
      return false;
    }
    if (p.abstract.length > 2000) {
      showError('Abstract exceeds maximum 2000 character limit. Current length: ' + p.abstract.length + ' characters.');
      return false;
    }
    return true;
  }

  function validateStep4() {
    syncDomToState();
    if (!formData.confirmedAccuracy) {
      showError('Please check the confirmation box to declare academic integrity before proceeding to payment.');
      return false;
    }
    return true;
  }

  /* ---------------------------------------------------------
   * Dynamic Members UI (2-5 Students)
   * --------------------------------------------------------- */
  function renderMembers() {
    const container = document.getElementById('members-container');
    if (!container) return;

    container.innerHTML = '';

    formData.members.forEach(function (member, index) {
      const memberIndex = index + 2; // Member 2, 3, 4, 5
      const card = document.createElement('div');
      card.className = 'member-entry-card';
      card.style.cssText = 'background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:18px 20px; box-shadow:0 1px 3px rgba(0,0,0,0.04);';

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; padding-bottom:8px; border-bottom:1px solid #f1f5f9;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="width:24px; height:24px; border-radius:50%; background:#f1f5f9; color:#475569; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; border:1px solid #cbd5e1;">
              ${memberIndex}
            </span>
            <strong style="color:var(--primary-navy); font-size:0.92rem;">Team Member #${memberIndex}</strong>
          </div>
          ${formData.members.length > 1 ? `
            <button type="button" class="btn btn-sm btn-remove-member" data-index="${index}" style="background:#fee2e2; color:#dc2626; border:none; padding:4px 10px; font-size:0.75rem; border-radius:4px; font-weight:600; cursor:pointer;" title="Remove this member">
              <i class="bi bi-trash"></i> Remove
            </button>
          ` : '<span style="font-size:0.75rem; color:#94a3b8;">Required (Min 2 students)</span>'}
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Full Name <span class="req">*</span></label>
            <input type="text" class="form-input member-name-input" placeholder="e.g. Priya Sharma" value="${escapeHtml(member.name)}" required>
          </div>

          <div class="form-group">
            <label class="form-label">SRN / USN <span class="req">*</span></label>
            <input type="text" class="form-input member-srn-input" placeholder="e.g. 1MS21CS085" value="${escapeHtml(member.srn)}" style="font-family:monospace; text-transform:uppercase;" required>
          </div>

          <div class="form-group">
            <label class="form-label">College Email <span class="req">*</span></label>
            <input type="email" class="form-input member-email-input" placeholder="e.g. priya.sharma@snpsu.edu.in" value="${escapeHtml(member.email)}" required>
          </div>

          <div class="form-group">
            <label class="form-label">Department <span class="req">*</span></label>
            <select class="form-select member-dept-input">
              <option value="Computer Science & Engineering" ${member.department === 'Computer Science & Engineering' ? 'selected' : ''}>Computer Science & Engineering</option>
              <option value="Information Science & Engineering" ${member.department === 'Information Science & Engineering' ? 'selected' : ''}>Information Science & Engineering</option>
              <option value="Artificial Intelligence & Data Science" ${member.department === 'Artificial Intelligence & Data Science' ? 'selected' : ''}>Artificial Intelligence & Data Science</option>
              <option value="Electronics & Communication Engineering" ${member.department === 'Electronics & Communication Engineering' ? 'selected' : ''}>Electronics & Communication Engineering</option>
              <option value="Electrical & Electronics Engineering" ${member.department === 'Electrical & Electronics Engineering' ? 'selected' : ''}>Electrical & Electronics Engineering</option>
              <option value="Mechanical Engineering" ${member.department === 'Mechanical Engineering' ? 'selected' : ''}>Mechanical Engineering</option>
              <option value="Civil Engineering" ${member.department === 'Civil Engineering' ? 'selected' : ''}>Civil Engineering</option>
              <option value="Biotechnology / Biomedical" ${member.department === 'Biotechnology / Biomedical' ? 'selected' : ''}>Biotechnology / Biomedical</option>
              <option value="Other Department" ${member.department === 'Other Department' ? 'selected' : ''}>Other Department</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Semester <span class="req">*</span></label>
            <select class="form-select member-sem-input">
              <option value="1st" ${member.semester === '1st' ? 'selected' : ''}>1st Semester</option>
              <option value="2nd" ${member.semester === '2nd' ? 'selected' : ''}>2nd Semester</option>
              <option value="3rd" ${member.semester === '3rd' ? 'selected' : ''}>3rd Semester</option>
              <option value="4th" ${member.semester === '4th' ? 'selected' : ''}>4th Semester</option>
              <option value="5th" ${member.semester === '5th' ? 'selected' : ''}>5th Semester</option>
              <option value="6th" ${member.semester === '6th' ? 'selected' : ''}>6th Semester</option>
              <option value="7th" ${member.semester === '7th' ? 'selected' : ''}>7th Semester</option>
              <option value="8th" ${member.semester === '8th' ? 'selected' : ''}>8th Semester</option>
              <option value="PG / Post Graduate" ${member.semester === 'PG / Post Graduate' ? 'selected' : ''}>PG / Post Graduate</option>
            </select>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    updateTeamCounterBadge();
    bindMemberInputListeners();
  }

  function updateLeaderSummaryBanner() {
    syncDomToState();
    const nameEl = document.getElementById('summary-leader-name');
    const srnEl = document.getElementById('summary-leader-srn');
    if (nameEl) nameEl.textContent = formData.leader.name || 'Team Leader';
    if (srnEl) srnEl.textContent = formData.leader.srn ? `(${formData.leader.srn})` : '';
  }

  function updateTeamCounterBadge() {
    const totalCount = 1 + formData.members.length;
    const badge = document.getElementById('team-size-counter-badge');
    const addBtn = document.getElementById('btn-add-member');

    if (badge) {
      badge.textContent = `Total Team Size: ${totalCount} Students (${totalCount === 5 ? 'Max' : '2-5 allowed'})`;
    }

    if (addBtn) {
      if (totalCount >= 5) {
        addBtn.setAttribute('disabled', 'disabled');
        addBtn.style.opacity = '0.5';
        addBtn.style.cursor = 'not-allowed';
      } else {
        addBtn.removeAttribute('disabled');
        addBtn.style.opacity = '1';
        addBtn.style.cursor = 'pointer';
      }
    }
  }

  function bindMemberInputListeners() {
    const inputs = document.querySelectorAll('.member-entry-card input, .member-entry-card select');
    inputs.forEach(function (inp) {
      inp.addEventListener('input', function () {
        syncDomToState();
        saveDraft();
      });
      inp.addEventListener('change', function () {
        syncDomToState();
        saveDraft();
      });
    });

    const removeBtns = document.querySelectorAll('.btn-remove-member');
    removeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        syncDomToState();
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        if (formData.members.length > 1) {
          formData.members.splice(idx, 1);
          renderMembers();
          saveDraft();
        }
      });
    });
  }

  function addMember() {
    syncDomToState();
    if (formData.members.length < 4) { // Max 4 additional members + 1 leader = 5
      formData.members.push({
        id: 'member-' + (formData.members.length + 1),
        name: '',
        srn: '',
        email: '',
        department: formData.leader.department || 'Computer Science & Engineering',
        semester: formData.leader.semester || '6th'
      });
      renderMembers();
      saveDraft();
    }
  }

  /* ---------------------------------------------------------
   * Review Step Renderer
   * --------------------------------------------------------- */
  function renderReviewStep() {
    syncDomToState();

    // Leader
    setText('rev-leader-name', formData.leader.name || '—');
    setText('rev-leader-srn', formData.leader.srn || '—');
    setText('rev-leader-email', formData.leader.email || '—');
    setText('rev-leader-dept', `${formData.leader.department} (${formData.leader.semester} Sem)`);

    // Members Table
    const tbody = document.getElementById('rev-members-table-body');
    const badge = document.getElementById('rev-member-count-badge');
    const totalCount = 1 + formData.members.length;

    if (badge) badge.textContent = `${totalCount} Registered Students`;

    if (tbody) {
      let rowsHtml = '';
      // Row 1: Leader
      rowsHtml += `
        <tr style="border-bottom:1px solid #f1f5f9; background:#f8fafc;">
          <td style="padding:10px 14px; font-weight:700; color:var(--primary-navy);">1</td>
          <td style="padding:10px 14px; font-weight:700; color:#0f172a;">${escapeHtml(formData.leader.name)}</td>
          <td style="padding:10px 14px; font-family:monospace; color:#001040; font-weight:600;">${escapeHtml(formData.leader.srn)}</td>
          <td style="padding:10px 14px; color:#475569;">${escapeHtml(formData.leader.email)}</td>
          <td style="padding:10px 14px; color:#475569;">${escapeHtml(formData.leader.department)}</td>
          <td style="padding:10px 14px;"><span class="badge badge-navy" style="font-size:0.7rem;">Team Leader</span></td>
        </tr>
      `;

      // Rows 2..N: Additional Members
      formData.members.forEach(function (m, idx) {
        rowsHtml += `
          <tr style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:10px 14px; color:#64748b;">${idx + 2}</td>
            <td style="padding:10px 14px; font-weight:600; color:#0f172a;">${escapeHtml(m.name || '—')}</td>
            <td style="padding:10px 14px; font-family:monospace; color:#334155;">${escapeHtml(m.srn || '—')}</td>
            <td style="padding:10px 14px; color:#475569;">${escapeHtml(m.email || '—')}</td>
            <td style="padding:10px 14px; color:#475569;">${escapeHtml(m.department || formData.leader.department)}</td>
            <td style="padding:10px 14px;"><span class="badge" style="background:#e2e8f0; color:#475569; font-size:0.7rem;">Member</span></td>
          </tr>
        `;
      });

      tbody.innerHTML = rowsHtml;
    }

    // Project
    setText('rev-project-title', formData.project.title || '—');
    setText('rev-project-category', formData.project.category || 'General Innovation');
    setText('rev-project-abstract', formData.project.abstract || 'No abstract summary provided.');
    setText('rev-project-tech', formData.project.technologies || 'None specified');
    setText('rev-project-mentor', formData.project.mentorName || 'Self-guided / To be assigned');

    // Accuracy checkbox state
    const checkEl = document.getElementById('review-accuracy-checkbox');
    const nextBtn = document.getElementById('btn-next-step-4');
    if (checkEl && nextBtn) {
      checkEl.checked = Boolean(formData.confirmedAccuracy);
      nextBtn.disabled = !formData.confirmedAccuracy;
    }
  }

  function renderPaymentStep() {
    syncDomToState();
    const titleEl = document.getElementById('pay-project-title-preview');
    const teamEl = document.getElementById('pay-team-size-preview');
    const totalSize = 1 + formData.members.length;

    if (titleEl) titleEl.textContent = formData.project.title || 'Project Innovation Entry';
    if (teamEl) teamEl.textContent = `${totalSize} Registered Members`;
  }

  function updateAbstractCounter() {
    const el = document.getElementById('project_abstract');
    const counter = document.getElementById('abstract-char-counter');
    if (!el || !counter) return;

    const len = el.value.length;
    counter.textContent = `${len} / 2000 characters`;
    if (len > 2000) {
      counter.style.color = '#dc2626';
      counter.style.fontWeight = '700';
    } else if (len >= 40) {
      counter.style.color = '#059669';
      counter.style.fontWeight = '600';
    } else {
      counter.style.color = '#64748b';
      counter.style.fontWeight = 'normal';
    }
  }

  /* ---------------------------------------------------------
   * Event Listeners Binding
   * --------------------------------------------------------- */
  function bindEvents() {
    // Stepper navigation clicks
    const stepBtns = document.querySelectorAll('.reg-step-btn');
    stepBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = parseInt(btn.getAttribute('data-step-target'), 10);
        if (target <= maxVisitedStep) {
          syncDomToState();
          renderStep(target);
        }
      });
    });

    // Back buttons
    const backBtns = document.querySelectorAll('[data-back-to]');
    backBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = parseInt(btn.getAttribute('data-back-to'), 10);
        syncDomToState();
        renderStep(target);
      });
    });

    // Jump step buttons from review screen
    const jumpBtns = document.querySelectorAll('[data-jump-step]');
    jumpBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = parseInt(btn.getAttribute('data-jump-step'), 10);
        syncDomToState();
        renderStep(target);
      });
    });

    // Step 1 Next
    const btn1 = document.getElementById('btn-next-step-1');
    if (btn1) {
      btn1.addEventListener('click', function () {
        if (validateStep1()) {
          renderStep(2);
        }
      });
    }

    // Step 2 Next
    const btn2 = document.getElementById('btn-next-step-2');
    if (btn2) {
      btn2.addEventListener('click', function () {
        if (validateStep2()) {
          renderStep(3);
        }
      });
    }

    // Step 3 Next
    const btn3 = document.getElementById('btn-next-step-3');
    if (btn3) {
      btn3.addEventListener('click', function () {
        if (validateStep3()) {
          renderStep(4);
        }
      });
    }

    // Step 4 Next
    const btn4 = document.getElementById('btn-next-step-4');
    if (btn4) {
      btn4.addEventListener('click', function () {
        if (validateStep4()) {
          renderStep(5);
        }
      });
    }

    // Declaration checkbox change
    const checkEl = document.getElementById('review-accuracy-checkbox');
    if (checkEl) {
      checkEl.addEventListener('change', function () {
        formData.confirmedAccuracy = checkEl.checked;
        if (btn4) btn4.disabled = !checkEl.checked;
        if (checkEl.checked) hideError();
        saveDraft();
      });
    }

    // Add Member Button
    const addBtn = document.getElementById('btn-add-member');
    if (addBtn) {
      addBtn.addEventListener('click', addMember);
    }

    // Abstract character counter
    const abstractEl = document.getElementById('project_abstract');
    if (abstractEl) {
      abstractEl.addEventListener('input', function () {
        updateAbstractCounter();
        saveDraft();
      });
    }

    // Real-time input persistence
    const allInputs = document.querySelectorAll('#multi-step-reg-form input, #multi-step-reg-form select, #multi-step-reg-form textarea');
    allInputs.forEach(function (inp) {
      inp.addEventListener('change', function () {
        syncDomToState();
        saveDraft();
      });
    });

    // Reset Form Modal trigger
    const resetTrigger = document.getElementById('btn-reset-form-trigger');
    const resetModal = document.getElementById('modal-reset-confirm');
    const cancelReset = document.getElementById('btn-cancel-reset');
    const confirmReset = document.getElementById('btn-confirm-reset');

    if (resetTrigger && resetModal) {
      resetTrigger.addEventListener('click', function () {
        resetModal.style.display = 'flex';
      });
    }
    if (cancelReset && resetModal) {
      cancelReset.addEventListener('click', function () {
        resetModal.style.display = 'none';
      });
    }
    if (confirmReset && resetModal) {
      confirmReset.addEventListener('click', function () {
        clearDraft();
        formData = JSON.parse(JSON.stringify(DEFAULT_FORM_DATA));
        currentStep = 1;
        maxVisitedStep = 1;
        populateDomFromState();
        renderMembers();
        renderStep(1);
        resetModal.style.display = 'none';
      });
    }

    // Payment Gateway Modal
    const openGatewayBtn = document.getElementById('btn-open-payment-gateway');
    const gatewayModal = document.getElementById('modal-payment-gateway');
    const closeGatewayBtn = document.getElementById('btn-close-gateway');
    const simulateSuccessBtn = document.getElementById('btn-simulate-pay-success');
    const simulateDeclineBtn = document.getElementById('btn-simulate-pay-decline');

    if (openGatewayBtn && gatewayModal) {
      openGatewayBtn.addEventListener('click', function () {
        const orderIdEl = document.getElementById('gateway-order-id');
        if (orderIdEl) {
          orderIdEl.textContent = 'ord_exp_2026_' + Math.floor(100000 + Math.random() * 900000);
        }
        gatewayModal.style.display = 'flex';
      });
    }

    if (closeGatewayBtn && gatewayModal) {
      closeGatewayBtn.addEventListener('click', function () {
        gatewayModal.style.display = 'none';
      });
    }

    if (simulateDeclineBtn && gatewayModal) {
      simulateDeclineBtn.addEventListener('click', function () {
        gatewayModal.style.display = 'none';
        showError('Transaction failed or was canceled by user at the payment gateway. No funds were debited. Your registration details remain saved. Please retry.');
      });
    }

    if (simulateSuccessBtn && gatewayModal) {
      simulateSuccessBtn.addEventListener('click', function () {
        submitRegistrationWithPayment(simulateSuccessBtn, gatewayModal);
      });
    }
  }

  /* ---------------------------------------------------------
   * Final Form Submission with Simulated Payment
   * --------------------------------------------------------- */
  function submitRegistrationWithPayment(btn, modal) {
    syncDomToState();

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting registration...';

    const txnId = 'TXN_EXPO_' + Math.floor(1000000000 + Math.random() * 9000000000);

    const payload = {
      leader_name: formData.leader.name,
      leader_srn: formData.leader.srn,
      leader_email: formData.leader.email,
      leader_phone: formData.leader.phone,
      leader_department: formData.leader.department,
      leader_semester: formData.leader.semester,
      institution: 'Sapthagiri NPS University (SNPSU)',
      participant_type: 'Student Project Team',
      country: 'India',
      project_title: formData.project.title,
      project_category: formData.project.category,
      project_abstract: formData.project.abstract,
      technologies: formData.project.technologies,
      mentor_name: formData.project.mentorName,
      team_members: JSON.stringify(formData.members),
      payment_mode: 'Razorpay UPI / NetBanking',
      payment_status: 'Paid',
      amount_paid: '₹500',
      transaction_ref: txnId
    };

    fetch('/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (res) {
        if (res.success && res.redirect_url) {
          clearDraft();
          window.location.href = res.redirect_url;
        } else {
          modal.style.display = 'none';
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Simulate Successful Payment (₹500 Paid)';
          showError((res.errors && res.errors.join(' ')) || 'Registration submission failed. Please try again.');
        }
      })
      .catch(function (err) {
        console.error('Submission error:', err);
        // Fallback: populate hidden form fields and submit traditional form
        const form = document.getElementById('multi-step-reg-form');
        if (form) {
          document.getElementById('hidden_team_members').value = JSON.stringify(formData.members);
          document.getElementById('hidden_transaction_ref').value = txnId;
          clearDraft();
          form.submit();
        } else {
          modal.style.display = 'none';
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Simulate Successful Payment (₹500 Paid)';
          showError('Something went wrong while connecting to the server. Your information has not been lost. Please retry.');
        }
      });
  }

  /* ---------------------------------------------------------
   * Utilities
   * --------------------------------------------------------- */
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

})();
