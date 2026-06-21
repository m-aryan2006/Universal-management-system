/**
 * Event Manager Pro - Main Application
 * Version: 3.0.0
 * Description: Enhanced event management with Professional PDF, Map Picker, and Company Profile
 */

(function() {
  'use strict';

  // ============================================
  // App Configuration
  // ============================================
  const APP = {
    name: 'Event Manager Pro',
    version: '3.0.0',
    storageKey: 'eventManagerData',
    historyKey: 'eventHistoryData',
    templatesKey: 'eventTemplatesData',
    emergencyKey: 'emergencyKitData',
    darkModeKey: 'darkModePreference',
    companyProfileKey: 'companyProfileData'
  };

  // ============================================
  // State Management
  // ============================================
  let events = [];
  let eventHistory = {};
  let templates = [];
  let emergencyKit = {};
  let companyProfile = {};
  let mapInstance = null;
  let mapPickerInstance = null;
  let selectedLocation = null;

  // Load all data from localStorage
  function loadAllData() {
    loadEvents();
    loadHistory();
    loadTemplates();
    loadEmergencyKit();
    loadDarkModePreference();
    loadCompanyProfile();
  }

  // Load events
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

  // Save events
  function saveEvents() {
    try {
      localStorage.setItem(APP.storageKey, JSON.stringify(events));
      return true;
    } catch (error) {
      console.error('Error saving events:', error);
      return false;
    }
  }

  // Load history
  function loadHistory() {
    try {
      const stored = localStorage.getItem(APP.historyKey);
      if (stored) {
        eventHistory = JSON.parse(stored);
        return true;
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
    eventHistory = {};
    return false;
  }

  // Save history
  function saveHistory() {
    try {
      localStorage.setItem(APP.historyKey, JSON.stringify(eventHistory));
      return true;
    } catch (error) {
      console.error('Error saving history:', error);
      return false;
    }
  }

  // Load templates
  function loadTemplates() {
    try {
      const stored = localStorage.getItem(APP.templatesKey);
      if (stored) {
        templates = JSON.parse(stored);
        return true;
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
    templates = [];
    return false;
  }

  // Save templates
  function saveTemplates() {
    try {
      localStorage.setItem(APP.templatesKey, JSON.stringify(templates));
      return true;
    } catch (error) {
      console.error('Error saving templates:', error);
      return false;
    }
  }

  // Load emergency kit
  function loadEmergencyKit() {
    try {
      const stored = localStorage.getItem(APP.emergencyKey);
      if (stored) {
        emergencyKit = JSON.parse(stored);
        return true;
      }
    } catch (error) {
      console.error('Error loading emergency kit:', error);
    }
    emergencyKit = {
      wifiName: '',
      wifiPassword: '',
      emergencyContact1: '',
      emergencyContact2: '',
      venueNotes: ''
    };
    return false;
  }

  // Save emergency kit
  function saveEmergencyKit() {
    try {
      localStorage.setItem(APP.emergencyKey, JSON.stringify(emergencyKit));
      return true;
    } catch (error) {
      console.error('Error saving emergency kit:', error);
      return false;
    }
  }

  // ============================================
  // Company Profile Management
  // ============================================
  function loadCompanyProfile() {
    try {
      const stored = localStorage.getItem(APP.companyProfileKey);
      if (stored) {
        companyProfile = JSON.parse(stored);
        populateCompanyProfileForm();
        return true;
      }
    } catch (error) {
      console.error('Error loading company profile:', error);
    }
    companyProfile = {
      companyName: '',
      ownerName: '',
      companyEmail: '',
      companyPhone: '',
      companyAddress: '',
      companyGst: '',
      companyLogo: ''
    };
    return false;
  }

  function saveCompanyProfile() {
    const profile = {
      companyName: document.getElementById('companyName').value.trim(),
      ownerName: document.getElementById('ownerName').value.trim(),
      companyEmail: document.getElementById('companyEmail').value.trim(),
      companyPhone: document.getElementById('companyPhone').value.trim(),
      companyAddress: document.getElementById('companyAddress').value.trim(),
      companyGst: document.getElementById('companyGst').value.trim(),
      companyLogo: document.getElementById('companyLogo').value.trim()
    };
    
    try {
      localStorage.setItem(APP.companyProfileKey, JSON.stringify(profile));
      companyProfile = profile;
      alert('✅ Company profile saved successfully!');
      return true;
    } catch (error) {
      console.error('Error saving company profile:', error);
      alert('❌ Failed to save company profile.');
      return false;
    }
  }

  function populateCompanyProfileForm() {
    if (companyProfile) {
      document.getElementById('companyName').value = companyProfile.companyName || '';
      document.getElementById('ownerName').value = companyProfile.ownerName || '';
      document.getElementById('companyEmail').value = companyProfile.companyEmail || '';
      document.getElementById('companyPhone').value = companyProfile.companyPhone || '';
      document.getElementById('companyAddress').value = companyProfile.companyAddress || '';
      document.getElementById('companyGst').value = companyProfile.companyGst || '';
      document.getElementById('companyLogo').value = companyProfile.companyLogo || '';
    }
  }

  function toggleProfile() {
    const content = document.getElementById('companyProfileContent');
    const icon = document.getElementById('profileToggleIcon');
    content.classList.toggle('active');
    icon.classList.toggle('rotated');
  }

  // ============================================
  // Dark Mode Management
  // ============================================
  function loadDarkModePreference() {
    try {
      const stored = localStorage.getItem(APP.darkModeKey);
      if (stored !== null) {
        const isDark = JSON.parse(stored);
        applyDarkMode(isDark);
        return isDark;
      }
    } catch (error) {
      console.error('Error loading dark mode preference:', error);
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyDarkMode(prefersDark);
    return prefersDark;
  }

  function saveDarkModePreference(isDark) {
    try {
      localStorage.setItem(APP.darkModeKey, JSON.stringify(isDark));
    } catch (error) {
      console.error('Error saving dark mode preference:', error);
    }
  }

  function applyDarkMode(isDark) {
    const html = document.documentElement;
    const toggle = document.getElementById('darkModeToggle');
    
    if (isDark) {
      html.setAttribute('data-theme', 'dark');
      if (toggle) {
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
        toggle.setAttribute('aria-label', 'Switch to light mode');
      }
    } else {
      html.removeAttribute('data-theme');
      if (toggle) {
        toggle.innerHTML = '<i class="fas fa-moon"></i>';
        toggle.setAttribute('aria-label', 'Switch to dark mode');
      }
    }
    
    // Re-render maps if they exist
    setTimeout(() => {
      if (mapInstance) mapInstance.invalidateSize();
      if (mapPickerInstance) mapPickerInstance.invalidateSize();
    }, 300);
  }

  function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    applyDarkMode(!isDark);
    saveDarkModePreference(!isDark);
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
    address: document.getElementById('eventAddress'),
    date: document.getElementById('eventDate'),
    time: document.getElementById('eventTime'),
    ampm: document.getElementById('eventAmPm'),
    inchargeName: document.getElementById('inchargeName'),
    inchargePhone: document.getElementById('inchargePhone'),
    volunteerNames: document.getElementById('volunteerNames'),
    volunteerPhones: document.getElementById('volunteerPhones'),
    payee: document.getElementById('payeeAmount'),
    priority: document.getElementById('eventPriority'),
    eventType: document.getElementById('eventType'),
    
    // Buttons
    addBtn: document.getElementById('addEventBtn'),
    todayBtn: document.getElementById('todayAlertBtn'),
    quickAddBtn: document.getElementById('quickAddBtn'),
    emergencyBtn: document.getElementById('emergencyBtn'),
    templateSaveBtn: document.getElementById('templateSaveBtn'),
    templateLoadBtn: document.getElementById('templateLoadBtn'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    saveProfileBtn: document.getElementById('saveProfileBtn'),
    pickLocationBtn: document.getElementById('pickLocationBtn'),
    closeMapPicker: document.getElementById('closeMapPicker'),
    confirmLocationBtn: document.getElementById('confirmLocationBtn'),
    pickedAddress: document.getElementById('pickedAddress')
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

  function formatCurrency(amount) {
    if (!amount) return '$0';
    // Remove any existing currency symbols and clean
    let cleanAmount = amount.replace(/[^0-9.]/g, '');
    if (!cleanAmount) return '$0';
    const num = parseFloat(cleanAmount);
    if (isNaN(num)) return amount;
    return '$' + num.toFixed(2);
  }

  function getTodayString() {
    return new Date().toISOString().split('T')[0];
  }

  function getTimeString() {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
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
        <i class="fas fa-user"></i> ${escapeHtml(name)} ${phone ? '📞' + escapeHtml(phone) : ''}
      </span>`;
    }).join(' ');
  }

  function formatIncharge(name, phone) {
    if (!name && !phone) return 'Not set';
    return `${escapeHtml(name || '')} ${phone ? '📞' + escapeHtml(phone) : ''}`.trim();
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function getPriorityIcon(priority) {
    switch(priority) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  }

  function getPriorityColor(priority) {
    switch(priority) {
      case 'High': return '#ff4757';
      case 'Medium': return '#ffa502';
      case 'Low': return '#2ed573';
      default: return '#747d8c';
    }
  }

  // ============================================
  // Professional PDF Bill Generation
  // ============================================
  function generatePDFBill(event) {
    if (!event) {
      alert('❌ Event not found!');
      return;
    }

    // Get company profile
    const company = companyProfile || {};
    const companyName = company.companyName || 'Your Company';
    const ownerName = company.ownerName || '';
    const companyEmail = company.companyEmail || '';
    const companyPhone = company.companyPhone || '';
    const companyAddress = company.companyAddress || '';
    const companyGst = company.companyGst || '';
    const logoUrl = company.companyLogo || '';

    const eventLocation = event.address || event.location || 'TBD';
    const formattedAmount = formatCurrency(event.payee);

    // Create professional bill content
    const billContent = `
      <div class="pdf-bill-preview" style="font-family: 'Inter', Arial, sans-serif; background: white; padding: 40px; max-width: 800px; margin: 0 auto; color: #1e2b3a;">
        <!-- Header with Company Info -->
        <div style="display: flex; justify-content: space-between; border-bottom: 3px solid #3b7cff; padding-bottom: 20px; margin-bottom: 25px;">
          <div style="flex: 1;">
            ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="max-height: 60px; margin-bottom: 10px;">` : ''}
            <h1 style="color: #3b7cff; margin: 0; font-size: 28px;">INVOICE</h1>
            <p style="margin: 5px 0 0 0; color: #6d7f92; font-size: 14px;">#${event.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div style="text-align: right; flex: 1;">
            <div style="font-size: 20px; font-weight: 600; color: #1e2b3a;">${escapeHtml(companyName)}</div>
            ${ownerName ? `<div style="font-size: 14px; color: #6d7f92;">${escapeHtml(ownerName)}</div>` : ''}
            ${companyAddress ? `<div style="font-size: 13px; color: #6d7f92;">${escapeHtml(companyAddress)}</div>` : ''}
            ${companyPhone ? `<div style="font-size: 13px; color: #6d7f92;">📞 ${escapeHtml(companyPhone)}</div>` : ''}
            ${companyEmail ? `<div style="font-size: 13px; color: #6d7f92;">✉ ${escapeHtml(companyEmail)}</div>` : ''}
            ${companyGst ? `<div style="font-size: 13px; color: #6d7f92; font-weight: 500;">GST: ${escapeHtml(companyGst)}</div>` : ''}
          </div>
        </div>

        <!-- Event Details -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; background: #f8faff; padding: 20px; border-radius: 12px;">
          <div>
            <h3 style="color: #3b7cff; margin: 0 0 8px 0; font-size: 16px;">Event Details</h3>
            <div style="font-size: 14px; line-height: 1.8;">
              <div><strong>Event:</strong> ${escapeHtml(event.name)}</div>
              <div><strong>Type:</strong> ${escapeHtml(event.eventType || 'General')}</div>
              <div><strong>Date:</strong> ${formatDate(event.date)}</div>
              <div><strong>Time:</strong> ${event.time || '--:--'} ${event.ampm || ''}</div>
              <div><strong>Venue:</strong> ${escapeHtml(event.location || 'TBD')}</div>
              ${event.address ? `<div><strong>Address:</strong> ${escapeHtml(event.address)}</div>` : ''}
            </div>
          </div>
          <div>
            <h3 style="color: #3b7cff; margin: 0 0 8px 0; font-size: 16px;">Contact</h3>
            <div style="font-size: 14px; line-height: 1.8;">
              <div><strong>Incharge:</strong> ${escapeHtml(event.inchargeName || 'Not assigned')}</div>
              ${event.inchargePhone ? `<div><strong>Phone:</strong> ${escapeHtml(event.inchargePhone)}</div>` : ''}
              ${event.volunteerNames ? `<div><strong>Volunteers:</strong> ${escapeHtml(event.volunteerNames)}</div>` : ''}
            </div>
          </div>
        </div>

        <!-- Bill Table -->
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #3b7cff; color: white;">
              <th style="padding: 12px 16px; text-align: left; font-size: 13px;">Description</th>
              <th style="padding: 12px 16px; text-align: right; font-size: 13px;">Quantity</th>
              <th style="padding: 12px 16px; text-align: right; font-size: 13px;">Rate</th>
              <th style="padding: 12px 16px; text-align: right; font-size: 13px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e7ecf3;">
              <td style="padding: 12px 16px; font-size: 14px;">${escapeHtml(event.name)} - Event Management</td>
              <td style="padding: 12px 16px; text-align: right; font-size: 14px;">1</td>
              <td style="padding: 12px 16px; text-align: right; font-size: 14px;">${formattedAmount}</td>
              <td style="padding: 12px 16px; text-align: right; font-size: 14px;">${formattedAmount}</td>
            </tr>
            ${event.volunteerNames ? `
              <tr style="border-bottom: 1px solid #e7ecf3;">
                <td style="padding: 12px 16px; font-size: 14px; color: #6d7f92;">Volunteer Coordination (${escapeHtml(event.volunteerNames)})</td>
                <td style="padding: 12px 16px; text-align: right; font-size: 14px; color: #6d7f92;">-</td>
                <td style="padding: 12px 16px; text-align: right; font-size: 14px; color: #6d7f92;">-</td>
                <td style="padding: 12px 16px; text-align: right; font-size: 14px; color: #6d7f92;">Included</td>
              </tr>
            ` : ''}
            <tr style="font-weight: 700; font-size: 18px; border-top: 2px solid #3b7cff;">
              <td style="padding: 16px 16px; color: #1e2b3a;">Total Amount</td>
              <td style="padding: 16px 16px; text-align: right;" colspan="2"></td>
              <td style="padding: 16px 16px; text-align: right; color: #3b7cff;">${formattedAmount}</td>
            </tr>
          </tbody>
        </table>

        <!-- Payment Terms & Notes -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
          <div style="background: #f8faff; padding: 15px; border-radius: 10px;">
            <h4 style="color: #3b7cff; margin: 0 0 8px 0; font-size: 14px;">Payment Terms</h4>
            <div style="font-size: 13px; color: #6d7f92; line-height: 1.6;">
              <div>Payment due within 15 days</div>
              <div>Bank transfer or cheque accepted</div>
              <div>Please reference invoice number</div>
            </div>
          </div>
          <div style="background: #f8faff; padding: 15px; border-radius: 10px;">
            <h4 style="color: #3b7cff; margin: 0 0 8px 0; font-size: 14px;">Notes</h4>
            <div style="font-size: 13px; color: #6d7f92; line-height: 1.6;">
              <div>Thank you for your business!</div>
              <div>Priority: ${event.priority || 'Medium'}</div>
              ${event.address ? `<div>📍 ${escapeHtml(event.address)}</div>` : ''}
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="border-top: 2px solid #e7ecf3; padding-top: 20px; margin-top: 25px; text-align: center; font-size: 12px; color: #9aabba;">
          <p style="margin: 3px 0;">${escapeHtml(companyName)} - ${escapeHtml(companyAddress || '')}</p>
          <p style="margin: 3px 0;">${companyEmail ? escapeHtml(companyEmail) + ' | ' : ''} ${companyPhone ? escapeHtml(companyPhone) : ''}</p>
          <p style="margin: 3px 0;">Generated on ${new Date().toLocaleString()}</p>
          <p style="margin: 5px 0 0 0; font-size: 11px; color: #c0c8d0;">This is a system-generated invoice. For queries, please contact us.</p>
        </div>
      </div>
    `;

    // Show loading
    const loadingMsg = '🔄 Generating professional invoice...';
    console.log(loadingMsg);

    // Generate PDF
    const element = document.createElement('div');
    element.innerHTML = billContent;
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.top = '0';
    document.body.appendChild(element);
    
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Invoice_${event.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        document.body.removeChild(element);
        console.log('✅ Professional invoice generated successfully!');
      })
      .catch((error) => {
        document.body.removeChild(element);
        console.error('❌ Error generating invoice:', error);
        alert('❌ Failed to generate invoice. Please try again.');
      });
  }

  // ============================================
  // Map Location Picker
  // ============================================
  function initializeMiniMap() {
    const container = document.getElementById('miniMapContainer');
    if (!container) return;
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (mapInstance) {
      mapInstance.remove();
    }
    
    mapInstance = L.map('miniMapContainer', {
      center: [40.7128, -74.0060],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });
    
    const tileLayer = isDark 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    
    L.tileLayer(tileLayer, {
      maxZoom: 19
    }).addTo(mapInstance);
    
    // If there's an address, try to geocode it
    const address = document.getElementById('eventAddress').value;
    if (address && address.trim().length > 0) {
      geocodeAddress(address, (lat, lon) => {
        mapInstance.setView([lat, lon], 15);
        L.marker([lat, lon]).addTo(mapInstance);
      });
    }
    
    setTimeout(() => {
      mapInstance.invalidateSize();
    }, 300);
  }

  function openMapPicker() {
    const modal = document.getElementById('mapPickerModal');
    modal.style.display = 'flex';
    modal.classList.add('active');
    
    setTimeout(() => {
      const container = document.getElementById('mapPickerContainer');
      if (!container) return;
      
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      
      if (mapPickerInstance) {
        mapPickerInstance.remove();
      }
      
      mapPickerInstance = L.map('mapPickerContainer', {
        center: [40.7128, -74.0060],
        zoom: 13,
        zoomControl: true,
        attributionControl: true
      });
      
      const tileLayer = isDark 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      
      L.tileLayer(tileLayer, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(mapPickerInstance);
      
      // Add click handler to pick location
      mapPickerInstance.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        selectedLocation = { lat, lng };
        
        // Reverse geocode to get address
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
        
        fetch(url)
          .then(response => response.json())
          .then(data => {
            const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            document.getElementById('pickedAddress').value = address;
            
            // Update mini map with marker
            if (mapPickerInstance) {
              mapPickerInstance.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                  mapPickerInstance.removeLayer(layer);
                }
              });
              L.marker([lat, lng]).addTo(mapPickerInstance);
            }
          })
          .catch(() => {
            const address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            document.getElementById('pickedAddress').value = address;
            
            if (mapPickerInstance) {
              mapPickerInstance.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                  mapPickerInstance.removeLayer(layer);
                }
              });
              L.marker([lat, lng]).addTo(mapPickerInstance);
            }
          });
      });
      
      // Try to geocode existing address
      const address = document.getElementById('eventAddress').value;
      if (address && address.trim().length > 0) {
        geocodeAddress(address, (lat, lon) => {
          mapPickerInstance.setView([lat, lon], 15);
          L.marker([lat, lon]).addTo(mapPickerInstance);
        });
      }
      
      setTimeout(() => {
        mapPickerInstance.invalidateSize();
      }, 300);
      
    }, 100);
  }

  function closeMapPicker() {
    const modal = document.getElementById('mapPickerModal');
    modal.style.display = 'none';
    modal.classList.remove('active');
    if (mapPickerInstance) {
      mapPickerInstance.remove();
      mapPickerInstance = null;
    }
  }

  function confirmLocation() {
    const address = document.getElementById('pickedAddress').value;
    if (address && address.trim().length > 0) {
      document.getElementById('eventAddress').value = address;
      
      // Update mini map
      if (selectedLocation) {
        if (mapInstance) {
          mapInstance.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
              mapInstance.removeLayer(layer);
            }
          });
          mapInstance.setView([selectedLocation.lat, selectedLocation.lng], 15);
          L.marker([selectedLocation.lat, selectedLocation.lng]).addTo(mapInstance);
        }
      } else {
        // Try to geocode the address
        geocodeAddress(address, (lat, lon) => {
          if (mapInstance) {
            mapInstance.eachLayer((layer) => {
              if (layer instanceof L.Marker) {
                mapInstance.removeLayer(layer);
              }
            });
            mapInstance.setView([lat, lon], 15);
            L.marker([lat, lon]).addTo(mapInstance);
          }
        });
      }
      
      closeMapPicker();
      alert('✅ Location confirmed!');
    } else {
      alert('⚠️ Please pick a location on the map first.');
    }
  }

  function geocodeAddress(address, callback) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          callback(lat, lon);
        } else {
          callback(40.7128, -74.0060);
        }
      })
      .catch(() => {
        callback(40.7128, -74.0060);
      });
  }

  // ============================================
  // Version History (Time Machine)
  // ============================================
  function saveEventHistory(eventId, eventData) {
    if (!eventId) return;
    
    if (!eventHistory[eventId]) {
      eventHistory[eventId] = [];
    }
    eventHistory[eventId].push({
      timestamp: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(eventData))
    });
    if (eventHistory[eventId].length > 10) {
      eventHistory[eventId].shift();
    }
    saveHistory();
  }

  function getEventHistory(eventId) {
    return eventHistory[eventId] || [];
  }

  function restoreEventVersion(eventId, versionIndex) {
    const history = getEventHistory(eventId);
    if (versionIndex >= 0 && versionIndex < history.length) {
      const version = history[versionIndex];
      const eventIndex = events.findIndex(e => e.id === eventId);
      if (eventIndex !== -1) {
        const restoredData = version.data;
        events[eventIndex] = {
          ...events[eventIndex],
          name: restoredData.name || events[eventIndex].name,
          location: restoredData.location || events[eventIndex].location,
          address: restoredData.address || events[eventIndex].address,
          date: restoredData.date || events[eventIndex].date,
          time: restoredData.time || events[eventIndex].time,
          ampm: restoredData.ampm || events[eventIndex].ampm,
          inchargeName: restoredData.inchargeName || events[eventIndex].inchargeName,
          inchargePhone: restoredData.inchargePhone || events[eventIndex].inchargePhone,
          volunteerNames: restoredData.volunteerNames || events[eventIndex].volunteerNames,
          volunteerPhones: restoredData.volunteerPhones || events[eventIndex].volunteerPhones,
          payee: restoredData.payee || events[eventIndex].payee,
          priority: restoredData.priority || events[eventIndex].priority || 'Medium',
          eventType: restoredData.eventType || events[eventIndex].eventType || 'General'
        };
        saveAndRender();
        return true;
      }
    }
    return false;
  }

  // ============================================
  // Conflict Detection
  // ============================================
  function checkConflicts(newEvent) {
    const conflicts = events.filter(ev => {
      if (ev.id === newEvent.id) return false;
      if (ev.date !== newEvent.date) return false;
      if (!ev.time || !newEvent.time) return false;
      
      const evTime = ev.time.split(':').map(Number);
      const newTime = newEvent.time.split(':').map(Number);
      const evMinutes = evTime[0] * 60 + evTime[1];
      const newMinutes = newTime[0] * 60 + newTime[1];
      
      return Math.abs(evMinutes - newMinutes) < 30;
    });
    
    return conflicts;
  }

  // ============================================
  // Emergency Kit
  // ============================================
  function showEmergencyKit() {
    let msg = '🚨 EMERGENCY KIT\n';
    msg += '═'.repeat(30) + '\n\n';
    msg += `📶 WiFi: ${emergencyKit.wifiName || 'Not set'}\n`;
    msg += `🔑 Password: ${emergencyKit.wifiPassword || 'Not set'}\n\n`;
    msg += `📞 Emergency Contact 1: ${emergencyKit.emergencyContact1 || 'Not set'}\n`;
    msg += `📞 Emergency Contact 2: ${emergencyKit.emergencyContact2 || 'Not set'}\n\n`;
    msg += `📝 Venue Notes:\n${emergencyKit.venueNotes || 'No notes'}\n`;
    msg += '\n' + '═'.repeat(30);
    
    const userInput = prompt(
      msg + '\n\nUpdate? Enter new values or OK to close.\n' +
      'Format: WiFi Name,WiFi Password,Contact1,Contact2,Venue Notes'
    );
    
    if (userInput && userInput !== 'null') {
      const parts = userInput.split(',').map(s => s.trim());
      if (parts.length >= 5) {
        emergencyKit.wifiName = parts[0] || emergencyKit.wifiName;
        emergencyKit.wifiPassword = parts[1] || emergencyKit.wifiPassword;
        emergencyKit.emergencyContact1 = parts[2] || emergencyKit.emergencyContact1;
        emergencyKit.emergencyContact2 = parts[3] || emergencyKit.emergencyContact2;
        emergencyKit.venueNotes = parts.slice(4).join(', ') || emergencyKit.venueNotes;
        saveEmergencyKit();
        alert('✅ Emergency Kit updated successfully!');
      }
    }
  }

  // ============================================
  // Templates System
  // ============================================
  function saveCurrentAsTemplate() {
    const name = DOM.name.value.trim() || 'Untitled Template';
    const template = {
      id: generateId(),
      name: name,
      location: DOM.location.value.trim(),
      address: DOM.address ? DOM.address.value.trim() : '',
      time: DOM.time.value,
      ampm: DOM.ampm.value,
      inchargeName: DOM.inchargeName.value.trim(),
      inchargePhone: DOM.inchargePhone.value.trim(),
      volunteerNames: DOM.volunteerNames.value.trim(),
      volunteerPhones: DOM.volunteerPhones.value.trim(),
      payee: DOM.payee.value.trim(),
      priority: DOM.priority ? DOM.priority.value : 'Medium',
      eventType: DOM.eventType ? DOM.eventType.value : 'General'
    };
    
    templates.push(template);
    saveTemplates();
    alert(`✅ Template "${name}" saved successfully!`);
  }

  function loadTemplateFromList() {
    if (templates.length === 0) {
      alert('📭 No templates saved yet. Save one first!');
      return;
    }
    
    let msg = '📋 Available Templates:\n\n';
    templates.forEach((t, i) => {
      msg += `${i + 1}. ${t.name}\n`;
      msg += `   📍 ${t.location || 'No location'}\n\n`;
    });
    msg += 'Enter template number to load:';
    
    const choice = prompt(msg);
    if (choice) {
      const idx = parseInt(choice) - 1;
      if (idx >= 0 && idx < templates.length) {
        const template = templates[idx];
        DOM.name.value = template.name;
        DOM.location.value = template.location || '';
        if (DOM.address) DOM.address.value = template.address || '';
        DOM.time.value = template.time || '';
        DOM.ampm.value = template.ampm || 'PM';
        DOM.inchargeName.value = template.inchargeName || '';
        DOM.inchargePhone.value = template.inchargePhone || '';
        DOM.volunteerNames.value = template.volunteerNames || '';
        DOM.volunteerPhones.value = template.volunteerPhones || '';
        DOM.payee.value = template.payee || '';
        if (DOM.priority) DOM.priority.value = template.priority || 'Medium';
        if (DOM.eventType) DOM.eventType.value = template.eventType || 'General';
        
        alert(`✅ Template "${template.name}" loaded!`);
      } else {
        alert('❌ Invalid choice.');
      }
    }
  }

  // ============================================
  // Quick Add
  // ============================================
  function quickAddEvent() {
    const name = prompt('📝 Quick Add - Enter event name:');
    if (!name || name.trim() === '') return;
    
    const location = prompt('📍 Enter location (or leave blank):') || 'TBD';
    const date = DOM.date.value || getTodayString();
    const time = getTimeString();
    
    const newEvent = {
      id: generateId(),
      name: name.trim(),
      location: location.trim() || 'TBD',
      address: '',
      date: date,
      time: time,
      ampm: 'PM',
      inchargeName: '',
      inchargePhone: '',
      volunteerNames: '',
      volunteerPhones: '',
      payee: '$0',
      priority: 'Medium',
      eventType: 'General',
      createdAt: new Date().toISOString()
    };
    
    events.push(newEvent);
    saveEventHistory(newEvent.id, newEvent);
    saveAndRender();
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

    const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    const sortedEvents = [...events].sort((a, b) => {
      return (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
    });

    let html = '';
    sortedEvents.forEach((ev) => {
      if (!ev.id) {
        ev.id = generateId();
      }
      
      const volTags = formatVolunteers(ev.volunteerNames, ev.volunteerPhones);
      const incharge = formatIncharge(ev.inchargeName, ev.inchargePhone);
      const dateDisplay = formatDate(ev.date);
      const timeDisplay = ev.time || '--:--';
      const ampm = ev.ampm || '';
      const priorityColor = getPriorityColor(ev.priority);
      const priorityIcon = getPriorityIcon(ev.priority);
      const eventType = ev.eventType || 'General';
      const hasAddress = ev.address && ev.address.trim().length > 0;

      html += `
        <div class="event-card" data-id="${ev.id}">
          <div class="event-header">
            <div class="event-name">
              <span>${escapeHtml(ev.name || 'Untitled')}</span>
              <span class="event-badges">
                <span class="priority-badge" style="background:${priorityColor}20; color:${priorityColor};">
                  ${priorityIcon} ${escapeHtml(ev.priority || 'Medium')}
                </span>
                <span class="payee-badge">
                  <i class="fas fa-coins"></i> ${escapeHtml(ev.payee || '$0')}
                </span>
              </span>
            </div>
            <span class="event-type-tag">${escapeHtml(eventType)}</span>
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
          ${hasAddress ? `
            <div class="event-meta" style="margin-top: -5px;">
              <span class="meta-item">
                <i class="fas fa-location-dot"></i> ${escapeHtml(ev.address)}
              </span>
            </div>
          ` : ''}
          <div class="incharge-section">
            <i class="fas fa-user-tie"></i> ${incharge}
          </div>
          <div class="volunteer-section">
            <i class="fas fa-users"></i> ${volTags}
          </div>
          <div class="event-actions">
            <button class="pdf-btn" data-id="${ev.id}" aria-label="Generate PDF invoice">
              <i class="fas fa-file-invoice"></i> Invoice
            </button>
            <button class="map-btn" data-id="${ev.id}" aria-label="Show location on map">
              <i class="fas fa-map"></i> Map
            </button>
            <button class="history-btn" data-id="${ev.id}" aria-label="View history">
              <i class="fas fa-history"></i> History
            </button>
            <button class="remind-btn" data-id="${ev.id}" aria-label="Remind about this event">
              <i class="fas fa-bell"></i> Remind
            </button>
            <button class="delete-btn" data-id="${ev.id}" aria-label="Delete this event">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      `;
    });

    DOM.container.innerHTML = html;
    DOM.counter.textContent = events.length;

    attachEventListeners();
    checkTodayEvents();
  }

  // ============================================
  // Event Listeners
  // ============================================
  function attachEventListeners() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.removeEventListener('click', handleDelete);
      btn.addEventListener('click', handleDelete);
    });

    document.querySelectorAll('.remind-btn').forEach(btn => {
      btn.removeEventListener('click', handleRemind);
      btn.addEventListener('click', handleRemind);
    });

    document.querySelectorAll('.history-btn').forEach(btn => {
      btn.removeEventListener('click', handleHistory);
      btn.addEventListener('click', handleHistory);
    });

    document.querySelectorAll('.pdf-btn').forEach(btn => {
      btn.removeEventListener('click', handlePDF);
      btn.addEventListener('click', handlePDF);
    });

    document.querySelectorAll('.map-btn').forEach(btn => {
      btn.removeEventListener('click', handleMap);
      btn.addEventListener('click', handleMap);
    });
  }

  function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const btn = this;
    const id = btn.getAttribute('data-id');
    
    if (!id) {
      console.error('No ID found on delete button');
      return;
    }
    
    const eventIndex = events.findIndex(ev => ev.id === id);
    
    if (eventIndex === -1) {
      console.error('Event not found with ID:', id);
      alert('❌ Event not found. It may have been already deleted.');
      return;
    }
    
    const eventName = events[eventIndex].name || 'Untitled Event';
    
    if (confirm(`Are you sure you want to delete "${eventName}"?`)) {
      events.splice(eventIndex, 1);
      
      if (eventHistory[id]) {
        delete eventHistory[id];
        saveHistory();
      }
      
      saveAndRender();
    }
  }

  function handleRemind(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const id = this.getAttribute('data-id');
    if (!id) return;
    
    const ev = events.find(e => e.id === id);
    if (ev) {
      const priorityIcon = getPriorityIcon(ev.priority);
      const msg = `🔔 REMINDER: "${ev.name}"\n` +
                  `${priorityIcon} Priority: ${ev.priority || 'Medium'}\n` +
                  `📍 ${ev.location || 'No location'}\n` +
                  `${ev.address ? `📌 ${ev.address}\n` : ''}` +
                  `📅 ${formatDate(ev.date)} ${ev.time || ''} ${ev.ampm || ''}\n` +
                  `👤 Incharge: ${ev.inchargeName || 'Not assigned'}\n` +
                  `📞 ${ev.inchargePhone || 'No phone'}`;
      alert(msg);
    }
  }

  function handleHistory(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const id = this.getAttribute('data-id');
    if (!id) return;
    
    const history = getEventHistory(id);
    const event = events.find(ev => ev.id === id);
    
    if (!event) {
      alert('Event not found.');
      return;
    }

    if (history.length === 0) {
      alert(`📜 No history for "${event.name}" yet.`);
      return;
    }

    let msg = `📜 Version History for "${event.name}"\n`;
    msg += '═'.repeat(40) + '\n\n';
    history.forEach((version, i) => {
      const date = new Date(version.timestamp);
      msg += `${i + 1}. ${date.toLocaleString()}\n`;
      msg += `   📍 ${version.data.location || 'No location'}\n`;
      msg += `   👤 ${version.data.inchargeName || 'No incharge'}\n\n`;
    });
    msg += '═'.repeat(40) + '\n';
    msg += 'Enter version number to restore (or cancel):';

    const choice = prompt(msg);
    if (choice) {
      const idx = parseInt(choice) - 1;
      if (idx >= 0 && idx < history.length) {
        if (restoreEventVersion(id, idx)) {
          alert('✅ Event restored to selected version!');
        } else {
          alert('❌ Failed to restore version.');
        }
      } else {
        alert('❌ Invalid version number.');
      }
    }
  }

  function handlePDF(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const id = this.getAttribute('data-id');
    if (!id) return;
    
    const event = events.find(ev => ev.id === id);
    if (event) {
      generatePDFBill(event);
    }
  }

  function handleMap(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const id = this.getAttribute('data-id');
    if (!id) return;
    
    const event = events.find(ev => ev.id === id);
    if (event) {
      showLocationOnMap(event);
    }
  }

  function showLocationOnMap(event) {
    if (!event) {
      alert('❌ Event not found!');
      return;
    }

    const address = event.address || event.location || 'New York, NY';
    
    const modal = document.createElement('div');
    modal.className = 'map-modal active';
    modal.id = 'mapModal';
    
    modal.innerHTML = `
      <div class="map-modal-content">
        <div class="map-modal-header">
          <h3>📍 ${escapeHtml(event.name)} - Location</h3>
          <button class="map-modal-close" onclick="this.closest('.map-modal').remove()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div id="mapViewContainer" style="height:400px; border-radius:12px; overflow:hidden;"></div>
        <div style="margin-top: 10px; padding: 10px; background: var(--section-bg); border-radius: 10px;">
          <p style="margin: 0; color: var(--text-medium); font-size: 14px;">
            <strong>Address:</strong> ${escapeHtml(address)}
          </p>
          ${event.inchargeName ? `<p style="margin: 5px 0 0 0; color: var(--text-muted); font-size: 13px;">
            <strong>Contact:</strong> ${escapeHtml(event.inchargeName)} ${event.inchargePhone ? '📞 ' + escapeHtml(event.inchargePhone) : ''}
          </p>` : ''}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    setTimeout(() => {
      const container = document.getElementById('mapViewContainer');
      if (!container) return;

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      
      const map = L.map('mapViewContainer', {
        center: [40.7128, -74.0060],
        zoom: 13,
        zoomControl: true,
        attributionControl: true
      });
      
      const tileLayer = isDark 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      
      L.tileLayer(tileLayer, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(map);

      geocodeAddress(address, (lat, lon) => {
        map.setView([lat, lon], 15);
        L.marker([lat, lon])
          .addTo(map)
          .bindPopup(`
            <strong>${escapeHtml(event.name)}</strong><br>
            ${escapeHtml(address)}
          `)
          .openPopup();
      });

      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    }, 100);
  }

  // ============================================
  // Data Management
  // ============================================
  function saveAndRender() {
    saveEvents();
    renderEvents();
  }

  function addEventFromForm() {
    const name = DOM.name.value.trim() || 'Unnamed';
    const location = DOM.location.value.trim() || 'TBD';
    const address = DOM.address ? DOM.address.value.trim() : '';
    const date = DOM.date.value;
    const time = DOM.time.value || '';
    const ampm = DOM.ampm.value;
    const inchargeName = DOM.inchargeName.value.trim();
    const inchargePhone = DOM.inchargePhone.value.trim();
    const volunteerNames = DOM.volunteerNames.value.trim();
    const volunteerPhones = DOM.volunteerPhones.value.trim();
    const payee = DOM.payee.value.trim() || '$0';
    const priority = DOM.priority ? DOM.priority.value : 'Medium';
    const eventType = DOM.eventType ? DOM.eventType.value : 'General';

    if (!date) {
      alert('⚠️ Please select a date for the event.');
      return;
    }

    const newEvent = {
      id: generateId(),
      name,
      location,
      address,
      date,
      time,
      ampm,
      inchargeName,
      inchargePhone,
      volunteerNames,
      volunteerPhones,
      payee,
      priority,
      eventType,
      createdAt: new Date().toISOString()
    };

    const conflicts = checkConflicts(newEvent);
    if (conflicts.length > 0) {
      const conflictNames = conflicts.map(ev => ev.name).join(', ');
      if (!confirm(`⚠️ This event conflicts with: ${conflictNames}\n\nDo you want to add anyway?`)) {
        return;
      }
    }

    events.push(newEvent);
    saveEventHistory(newEvent.id, newEvent);
    saveAndRender();

    DOM.name.value = '';
    DOM.location.value = '';
    if (DOM.address) DOM.address.value = '';
    DOM.inchargeName.value = '';
    DOM.inchargePhone.value = '';
    DOM.volunteerNames.value = '';
    DOM.volunteerPhones.value = '';
    DOM.payee.value = '';

    DOM.name.focus();
  }

  // ============================================
  // Initialization
  // ============================================
  function init() {
    loadAllData();

    if (!DOM.date.value) {
      DOM.date.value = getTodayString();
    }

    renderEvents();

    if (events.length === 0) {
      addSampleEvents();
    }

    // Initialize mini map
    setTimeout(() => {
      initializeMiniMap();
    }, 500);

    // Event Listeners
    DOM.addBtn.addEventListener('click', addEventFromForm);

    if (DOM.quickAddBtn) {
      DOM.quickAddBtn.addEventListener('click', quickAddEvent);
    }

    if (DOM.emergencyBtn) {
      DOM.emergencyBtn.addEventListener('click', showEmergencyKit);
    }

    if (DOM.templateSaveBtn) {
      DOM.templateSaveBtn.addEventListener('click', saveCurrentAsTemplate);
    }

    if (DOM.templateLoadBtn) {
      DOM.templateLoadBtn.addEventListener('click', loadTemplateFromList);
    }

    if (DOM.darkModeToggle) {
      DOM.darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    if (DOM.saveProfileBtn) {
      DOM.saveProfileBtn.addEventListener('click', saveCompanyProfile);
    }

    if (DOM.pickLocationBtn) {
      DOM.pickLocationBtn.addEventListener('click', openMapPicker);
    }

    if (DOM.closeMapPicker) {
      DOM.closeMapPicker.addEventListener('click', closeMapPicker);
    }

    if (DOM.confirmLocationBtn) {
      DOM.confirmLocationBtn.addEventListener('click', confirmLocation);
    }

    // Close map picker on outside click
    document.getElementById('mapPickerModal').addEventListener('click', function(e) {
      if (e.target === this) {
        closeMapPicker();
      }
    });

    DOM.name.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        DOM.location.focus();
      }
    });

    DOM.todayBtn.addEventListener('click', showTodayEvents);

    console.log(`${APP.name} v${APP.version} initialized successfully`);
    console.log(`📊 ${events.length} events loaded, ${templates.length} templates, ${Object.keys(eventHistory).length} histories`);
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
        id: generateId(),
        name: 'Tech Summit 2026',
        location: 'Convention Center',
        address: '123 Main St, San Francisco, CA 94105, USA',
        date: today,
        time: '09:30',
        ampm: 'AM',
        inchargeName: 'Sarah Lee',
        inchargePhone: '+1 555 7890',
        volunteerNames: 'Mike, Jessica, Tom',
        volunteerPhones: '+1 111, +1 222, +1 333',
        payee: '$2,500',
        priority: 'High',
        eventType: 'Conference',
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        name: 'Design Workshop',
        location: 'Studio 5',
        address: '456 Broadway, New York, NY 10012, USA',
        date: futureStr,
        time: '14:00',
        ampm: 'PM',
        inchargeName: 'Alex Rivera',
        inchargePhone: '+1 555 1122',
        volunteerNames: 'Emma, Olivia',
        volunteerPhones: '+1 444, +1 555',
        payee: '$850',
        priority: 'Medium',
        eventType: 'Workshop',
        createdAt: new Date().toISOString()
      }
    ];

    sampleEvents.forEach(ev => {
      events.push(ev);
      saveEventHistory(ev.id, ev);
    });
    
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
      const priorityIcon = getPriorityIcon(ev.priority);
      msg += `${i + 1}. ${priorityIcon} ${ev.name}\n`;
      msg += `   📍 ${ev.location || 'No location'}\n`;
      if (ev.address) {
        msg += `   📌 ${ev.address}\n`;
      }
      msg += `   ⏰ ${ev.time || ''} ${ev.ampm || ''}\n`;
      if (ev.inchargeName) {
        msg += `   👤 ${ev.inchargeName}\n`;
      }
      if (ev.priority) {
        msg += `   🏷️ Priority: ${ev.priority}\n`;
      }
      msg += '\n';
    });

    alert(msg);
  }

  // ============================================
  // Start the App
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();