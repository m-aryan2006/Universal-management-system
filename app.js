/**
 * Event Manager Pro - Main Application
 * Version: 1.0.0
 * Description: A complete event management system with local storage persistence
 */

(function() {
  'use strict';

  // ============================================
  // App Configuration
  // ============================================
  const APP = {
    name: 'Event Manager Pro',
    version: '1.0.0',
    storageKey: 'eventManagerData'
  };

  // ============================================
  // State Management
  // ============================================
  let events = [];

  // Load events from localStorage
  function loadEvents() {
    try {
      const stored = localStorage.getItem(APP.storageKey);
      if (stored) {
        events = JSON.parse(stored);
        return true;
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
    events = [];
    return false;
  }

  // Save events to localStorage
  function saveEvents() {
    try {
      localStorage.setItem(APP.storageKey, JSON.stringify(events));
      return true;
    } catch (error) {
      console.error('Error saving events:', error);
      return false;
    }
  }

  // ============================================
  // DOM Reference Cache
  // ============================================
  const DOM = {
    container: document.getElementById('eventListContainer'),
    counter: document.getElementById('eventCounter'),
    alertBanner: document.getElementById('alertBanner'),
    alertMessage: document.getElementById('alertMessage'),
    alertBadge: document.getElementById('alertBadgeText'),
    
    // Form fields
    name: document.getElementById('eventName'),
    location: document.getElementById('eventLocation'),
    date: document.getElementById('eventDate'),
    time: document.getElementById('eventTime'),
    ampm: document.getElementById('eventAmPm'),
    inchargeName: document.getElementById('inchargeName'),
    inchargePhone: document.getElementById('inchargePhone'),
    volunteerNames: document.getElementById('volunteerNames'),
    volunteerPhones: document.getElementById('volunteerPhones'),
    payee: document.getElementById('payeeAmount'),
    
    // Buttons
    addBtn: document.getElementById('addEventBtn'),
    todayBtn: document.getElementById('todayAlertBtn')
  };

  // ============================================
  // Helper Functions
  // ============================================
  function formatDate(dateStr) {
    if (!dateStr) return 'No date';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (error) {
      return dateStr;
    }
  }

  function getTodayString() {
    return new Date().toISOString().split('T')[0];
  }

  function formatVolunteers(names, phones) {
    const nameArr = names ? names.split(',').map(s => s.trim()).filter(Boolean) : [];
    const phoneArr = phones ? phones.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    if (nameArr.length === 0) {
      return '<span style="opacity:0.6;">No volunteers</span>';
    }
    
    return nameArr.map((name, i) => {
      const phone = phoneArr[i] || '';
      return `<span class="volunteer-tag">
        <i class="fas fa-user"></i> ${name} ${phone ? '📞' + phone : ''}
      </span>`;
    }).join(' ');
  }

  function formatIncharge(name, phone) {
    if (!name && !phone) return 'Not set';
    return `${name || ''} ${phone ? '📞' + phone : ''}`.trim();
  }

  // ============================================
  // Core App Functions
  // ============================================
  function checkTodayEvents() {
    const todayStr = getTodayString();
    const todayEvents = events.filter(ev => ev.date === todayStr);
    
    if (todayEvents.length > 0) {
      DOM.alertBanner.style.display = 'flex';
      DOM.alertMessage.textContent = `📅 ${todayEvents.length} event${todayEvents.length > 1 ? 's' : ''} today!`;
      DOM.alertBadge.textContent = `🔔 ${todayEvents.length}`;
      return true;
    } else {
      DOM.alertBanner.style.display = 'none';
      DOM.alertBadge.textContent = 'Today?';
      return false;
    }
  }

  function renderEvents() {
    if (events.length === 0) {
      DOM.container.innerHTML = `
        <div class="empty-message">
          <i class="far fa-calendar-times"></i>
          <br>No events yet. Add one!
        </div>
      `;
      DOM.counter.textContent = '0';
      checkTodayEvents();
      return;
    }

    let html = '';
    events.forEach((ev, index) => {
      const volTags = formatVolunteers(ev.volunteerNames, ev.volunteerPhones);
      const incharge = formatIncharge(ev.inchargeName, ev.inchargePhone);
      const dateDisplay = formatDate(ev.date);
      const timeDisplay = ev.time || '--:--';
      const ampm = ev.ampm || '';

      html += `
        <div class="event-card" data-index="${index}">
          <div class="event-name">
            <span>${escapeHtml(ev.name || 'Untitled')}</span>
            <span class="payee-badge">
              <i class="fas fa-coins"></i> ${escapeHtml(ev.payee || '$0')}
            </span>
          </div>
          <div class="event-meta">
            <span class="meta-item">
              <i class="fas fa-map-marker-alt"></i> ${escapeHtml(ev.location || 'No location')}
            </span>
            <span class="meta-item">
              <i class="far fa-calendar-alt"></i> ${dateDisplay}
            </span>
            <span class="meta-item">
              <i class="far fa-clock"></i> ${timeDisplay} ${ampm}
            </span>
          </div>
          <div class="incharge-section">
            <i class="fas fa-user-tie"></i> ${escapeHtml(incharge)}
          </div>
          <div class="volunteer-section">
            <i class="fas fa-users"></i> ${volTags}
          </div>
          <div class="event-actions">
            <button class="remind-btn" data-idx="${index}" aria-label="Remind about this event">
              <i class="fas fa-bell"></i> Remind
            </button>
            <button class="delete-btn" data-idx="${index}" aria-label="Delete this event">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      `;
    });

    DOM.container.innerHTML = html;
    DOM.counter.textContent = events.length;

    // Attach event listeners
    attachEventListeners();
    checkTodayEvents();
  }

  // Simple HTML escaping to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================
  // Event Listeners
  // ============================================
  function attachEventListeners() {
    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.removeEventListener('click', handleDelete);
      btn.addEventListener('click', handleDelete);
    });

    // Remind buttons
    document.querySelectorAll('.remind-btn').forEach(btn => {
      btn.removeEventListener('click', handleRemind);
      btn.addEventListener('click', handleRemind);
    });
  }

  function handleDelete(e) {
    e.stopPropagation();
    const idx = parseInt(this.dataset.idx);
    if (confirm('Are you sure you want to delete this event?')) {
      events.splice(idx, 1);
      saveAndRender();
    }
  }

  function handleRemind(e) {
    e.stopPropagation();
    const idx = parseInt(this.dataset.idx);
    const ev = events[idx];
    if (ev) {
      const msg = `🔔 REMINDER: "${ev.name}"\n📍 ${ev.location}\n📅 ${formatDate(ev.date)} ${ev.time || ''} ${ev.ampm || ''}`;
      alert(msg);
    }
  }

  // ============================================
  // Data Management
  // ============================================
  function saveAndRender() {
    saveEvents();
    renderEvents();
  }

  function addEventFromForm() {
    // Collect form data
    const name = DOM.name.value.trim() || 'Unnamed';
    const location = DOM.location.value.trim() || 'TBD';
    const date = DOM.date.value;
    const time = DOM.time.value || '';
    const ampm = DOM.ampm.value;
    const inchargeName = DOM.inchargeName.value.trim();
    const inchargePhone = DOM.inchargePhone.value.trim();
    const volunteerNames = DOM.volunteerNames.value.trim();
    const volunteerPhones = DOM.volunteerPhones.value.trim();
    const payee = DOM.payee.value.trim() || '$0';

    // Validation
    if (!date) {
      alert('⚠️ Please select a date for the event.');
      return;
    }

    // Create event object
    const newEvent = {
      name,
      location,
      date,
      time,
      ampm,
      inchargeName,
      inchargePhone,
      volunteerNames,
      volunteerPhones,
      payee,
      createdAt: new Date().toISOString()
    };

    // Add to events array
    events.push(newEvent);
    saveAndRender();

    // Clear form fields (keep date/time for convenience)
    DOM.name.value = '';
    DOM.location.value = '';
    DOM.inchargeName.value = '';
    DOM.inchargePhone.value = '';
    DOM.volunteerNames.value = '';
    DOM.volunteerPhones.value = '';
    DOM.payee.value = '';

    // Focus back on name field
    DOM.name.focus();
  }

  // ============================================
  // Initialization
  // ============================================
  function init() {
    // Load existing events
    loadEvents();

    // Set default date if empty
    if (!DOM.date.value) {
      DOM.date.value = getTodayString();
    }

    // Render events
    renderEvents();

    // Add sample events if no events exist
    if (events.length === 0) {
      addSampleEvents();
    }

    // Set up form submission
    DOM.addBtn.addEventListener('click', addEventFromForm);

    // Enter key support
    DOM.name.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        DOM.location.focus();
      }
    });

    // Today's events button
    DOM.todayBtn.addEventListener('click', showTodayEvents);

    console.log(`${APP.name} v${APP.version} initialized successfully`);
  }

  // ============================================
  // Sample Data
  // ============================================
  function addSampleEvents() {
    const today = getTodayString();
    const future = new Date();
    future.setDate(future.getDate() + 3);
    const futureStr = future.toISOString().split('T')[0];

    const sampleEvents = [
      {
        name: 'Tech Summit 2026',
        location: 'Convention Center, SF',
        date: today,
        time: '09:30',
        ampm: 'AM',
        inchargeName: 'Sarah Lee',
        inchargePhone: '+1 555 7890',
        volunteerNames: 'Mike, Jessica, Tom',
        volunteerPhones: '+1 111, +1 222, +1 333',
        payee: '$2,500'
      },
      {
        name: 'Design Workshop',
        location: 'Studio 5',
        date: futureStr,
        time: '14:00',
        ampm: 'PM',
        inchargeName: 'Alex Rivera',
        inchargePhone: '+1 555 1122',
        volunteerNames: 'Emma, Olivia',
        volunteerPhones: '+1 444, +1 555',
        payee: '$850'
      }
    ];

    events.push(...sampleEvents);
    saveAndRender();
  }

  // ============================================
  // Today's Events Handler
  // ============================================
  function showTodayEvents() {
    const todayStr = getTodayString();
    const todayEvents = events.filter(ev => ev.date === todayStr);

    if (todayEvents.length === 0) {
      alert('🎯 No events scheduled for today. Enjoy your day! 🗓️');
      return;
    }

    let msg = '📌 Today\'s Events:\n\n';
    todayEvents.forEach((ev, i) => {
      msg += `${i + 1}. ${ev.name}\n`;
      msg += `   📍 ${ev.location}\n`;
      msg += `   ⏰ ${ev.time || ''} ${ev.ampm || ''}\n`;
      if (ev.inchargeName) {
        msg += `   👤 ${ev.inchargeName}\n`;
      }
      msg += '\n';
    });

    alert(msg);
  }

  // ============================================
  // Start the App
  // ============================================
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();