/**
 * Event Manager Pro - Version 3.2.0
 * Complete Event Management System with Fixed Invoice Generation
 */

(function() {
  'use strict';

  // ============================================
  // Configuration
  // ============================================
  const APP = {
    version: '3.2.0',
    storageKey: 'eventManagerData_v3',
    historyKey: 'eventHistory_v3',
    templatesKey: 'eventTemplates_v3',
    emergencyKey: 'emergencyKit_v3',
    darkModeKey: 'darkModePreference',
    profileKey: 'companyProfile_v3',
    languageKey: 'appLanguage'
  };

  // ============================================
  // State
  // ============================================
  let events = [];
  let eventHistory = {};
  let templates = [];
  let emergencyKit = {};
  let companyProfile = {};
  let mapInstance = null;
  let mapPickerInstance = null;
  let selectedLocation = null;
  let currentLanguage = 'en';

  // ============================================
  // DOM References
  // ============================================
  const DOM = {
    tabs: document.querySelectorAll('.nav-tab'),
    tabProfile: document.getElementById('tab-profile'),
    tabAdd: document.getElementById('tab-add'),
    tabEvents: document.getElementById('tab-events'),
    
    // Profile
    companyName: document.getElementById('companyName'),
    ownerName: document.getElementById('ownerName'),
    companyEmail: document.getElementById('companyEmail'),
    companyPhone: document.getElementById('companyPhone'),
    companyAddress: document.getElementById('companyAddress'),
    companyGst: document.getElementById('companyGst'),
    companyLogo: document.getElementById('companyLogo'),
    saveProfileBtn: document.getElementById('saveProfileBtn'),
    
    // Add Event
    eventName: document.getElementById('eventName'),
    bookedBy: document.getElementById('bookedBy'),
    bookieNumber: document.getElementById('bookieNumber'),
    eventLocation: document.getElementById('eventLocation'),
    eventAddress: document.getElementById('eventAddress'),
    eventDate: document.getElementById('eventDate'),
    eventTime: document.getElementById('eventTime'),
    eventAmPm: document.getElementById('eventAmPm'),
    inchargeName: document.getElementById('inchargeName'),
    inchargePhone: document.getElementById('inchargePhone'),
    volunteerNames: document.getElementById('volunteerNames'),
    volunteerPhones: document.getElementById('volunteerPhones'),
    payeeAmount: document.getElementById('payeeAmount'),
    eventPriority: document.getElementById('eventPriority'),
    eventType: document.getElementById('eventType'),
    addBtn: document.getElementById('addEventBtn'),
    quickAddBtn: document.getElementById('quickAddBtn'),
    
    // Events List
    eventList: document.getElementById('eventListContainer'),
    eventCounter: document.getElementById('eventCounter'),
    navEventCount: document.getElementById('navEventCount'),
    
    // Other
    todayBtn: document.getElementById('todayAlertBtn'),
    alertBanner: document.getElementById('alertBanner'),
    alertMessage: document.getElementById('alertMessage'),
    alertBadge: document.getElementById('alertBadgeText'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    emergencyBtn: document.getElementById('emergencyBtn'),
    templateSaveBtn: document.getElementById('templateSaveBtn'),
    templateLoadBtn: document.getElementById('templateLoadBtn'),
    openMapPickerBtn: document.getElementById('openMapPickerBtn'),
    closeMapPicker: document.getElementById('closeMapPicker'),
    confirmLocationBtn: document.getElementById('confirmLocationBtn'),
    pickedAddress: document.getElementById('pickedAddress'),
    miniMapContainer: document.getElementById('miniMapContainer'),
    mapPickerContainer: document.getElementById('mapPickerContainer'),
    langToggle: document.getElementById('langToggle'),
    langDropdown: document.getElementById('langDropdown'),
    currentLangLabel: document.getElementById('currentLangLabel'),
    langOptions: document.querySelectorAll('.lang-option')
  };

  // ============================================
  // TRANSLATIONS
  // ============================================
  const TRANSLATIONS = {
    en: {
      'tab.profile': 'Profile',
      'tab.add': 'Add Event',
      'tab.events': 'Events',
      'profile.title': 'Company Profile',
      'profile.subtitle': 'Enter your company details for professional invoices',
      'profile.companyName': 'Company Name',
      'profile.companyNamePlaceholder': 'Your Company Name',
      'profile.ownerName': 'Owner Name',
      'profile.ownerNamePlaceholder': 'John Doe',
      'profile.email': 'Company Email',
      'profile.emailPlaceholder': 'info@company.com',
      'profile.phone': 'Company Phone',
      'profile.phonePlaceholder': '+1 555 1234',
      'profile.address': 'Company Address',
      'profile.addressPlaceholder': '123 Business St, City',
      'profile.gst': 'GST/Tax Number',
      'profile.gstPlaceholder': 'GST-123456789',
      'profile.logo': 'Logo URL (optional)',
      'profile.logoPlaceholder': 'https://example.com/logo.png',
      'profile.save': 'Save Profile',
      'profile.saved': '✅ Company profile saved successfully!',
      'profile.failed': '❌ Failed to save profile.',
      'add.title': 'Add New Event',
      'add.eventName': 'Event Name',
      'add.eventNamePlaceholder': 'e.g. Tech Meetup',
      'add.bookedBy': 'Booked By',
      'add.bookedByPlaceholder': 'Client/Booker Name',
      'add.bookieNumber': 'Bookie Number',
      'add.bookieNumberPlaceholder': '+1 555 6789',
      'add.venue': 'Venue Name',
      'add.venuePlaceholder': 'Hall 2, NY',
      'add.date': 'Date',
      'add.time': 'Time',
      'add.incharge': 'Incharge',
      'add.inchargePlaceholder': 'John Doe',
      'add.inchargePhone': 'Incharge #',
      'add.inchargePhonePlaceholder': '+1 555 1234',
      'add.amount': 'Amount',
      'add.amountPlaceholder': '$150.00',
      'add.volunteers': 'Volunteers',
      'add.volunteersPlaceholder': 'Alice, Bob, Carol',
      'add.volunteerPhones': 'Vol. Numbers',
      'add.volunteerPhonesPlaceholder': '+1 111, +1 222',
      'add.address': 'Event Address',
      'add.addressPlaceholder': 'Full address or pick from map',
      'add.pickFromMap': 'Pick from Map',
      'add.priority': 'Priority',
      'add.type': 'Event Type',
      'add.addEvent': 'Add Event',
      'priority.high': '🔴 High',
      'priority.medium': '🟡 Medium',
      'priority.low': '🟢 Low',
      'type.conference': 'Conference',
      'type.workshop': 'Workshop',
      'type.meeting': 'Meeting',
      'type.party': 'Party',
      'type.general': 'General',
      'quick.quickAdd': 'Quick Add',
      'quick.saveTemplate': 'Save Template',
      'quick.loadTemplate': 'Load Template',
      'quick.emergency': 'Emergency Kit',
      'events.title': 'All Events',
      'events.empty': 'No events yet. Add one!',
      'events.bookedBy': 'Booked by: {name}',
      'btn.invoice': 'Invoice',
      'btn.map': 'Map',
      'btn.remind': 'Remind',
      'btn.delete': 'Delete',
      'alert.today': '📅 You have an event today!',
      'map.pickLocation': 'Pick Location on Map',
      'map.confirm': 'Confirm',
      'map.confirmed': '✅ Location confirmed and saved!',
      'today.noEvents': '🎯 No events today!',
      'invoice.generating': 'Generating Invoice...',
      'invoice.pleaseWait': 'Please wait',
      'invoice.failed': '❌ Failed to generate invoice. Please try again.',
      'invoice.thankyou': 'Thank you for your business!',
      'invoice.generated': 'Generated on {date}'
    },
    hi: {
      'tab.profile': 'प्रोफ़ाइल',
      'tab.add': 'इवेंट जोड़ें',
      'tab.events': 'इवेंट्स',
      'profile.title': 'कंपनी प्रोफ़ाइल',
      'profile.subtitle': 'पेशेवर इनवॉइस के लिए अपनी कंपनी का विवरण दर्ज करें',
      'profile.companyName': 'कंपनी का नाम',
      'profile.companyNamePlaceholder': 'आपकी कंपनी का नाम',
      'profile.ownerName': 'मालिक का नाम',
      'profile.ownerNamePlaceholder': 'जॉन डो',
      'profile.email': 'कंपनी ईमेल',
      'profile.emailPlaceholder': 'info@company.com',
      'profile.phone': 'कंपनी फोन',
      'profile.phonePlaceholder': '+1 555 1234',
      'profile.address': 'कंपनी का पता',
      'profile.addressPlaceholder': '123 बिजनेस स्ट्रीट, शहर',
      'profile.gst': 'जीएसटी/टैक्स नंबर',
      'profile.gstPlaceholder': 'GST-123456789',
      'profile.logo': 'लोगो URL (वैकल्पिक)',
      'profile.logoPlaceholder': 'https://example.com/logo.png',
      'profile.save': 'प्रोफ़ाइल सहेजें',
      'profile.saved': '✅ कंपनी प्रोफ़ाइल सफलतापूर्वक सहेजी गई!',
      'profile.failed': '❌ प्रोफ़ाइल सहेजने में विफल।',
      'add.title': 'नया इवेंट जोड़ें',
      'add.eventName': 'इवेंट का नाम',
      'add.eventNamePlaceholder': 'जैसे: टेक मीटअप',
      'add.bookedBy': 'बुक किया',
      'add.bookedByPlaceholder': 'ग्राहक/बुकर का नाम',
      'add.bookieNumber': 'बुकी नंबर',
      'add.bookieNumberPlaceholder': '+1 555 6789',
      'add.venue': 'स्थल का नाम',
      'add.venuePlaceholder': 'हॉल 2, NY',
      'add.date': 'तारीख',
      'add.time': 'समय',
      'add.incharge': 'प्रभारी',
      'add.inchargePlaceholder': 'जॉन डो',
      'add.inchargePhone': 'प्रभारी #',
      'add.inchargePhonePlaceholder': '+1 555 1234',
      'add.amount': 'राशि',
      'add.amountPlaceholder': '$150.00',
      'add.volunteers': 'स्वयंसेवक',
      'add.volunteersPlaceholder': 'आलिस, बॉब, कैरोल',
      'add.volunteerPhones': 'स्वयंसेवक नंबर',
      'add.volunteerPhonesPlaceholder': '+1 111, +1 222',
      'add.address': 'इवेंट का पता',
      'add.addressPlaceholder': 'पूरा पता या मानचित्र से चुनें',
      'add.pickFromMap': 'मानचित्र से चुनें',
      'add.priority': 'प्राथमिकता',
      'add.type': 'इवेंट प्रकार',
      'add.addEvent': 'इवेंट जोड़ें',
      'priority.high': '🔴 उच्च',
      'priority.medium': '🟡 मध्यम',
      'priority.low': '🟢 निम्न',
      'type.conference': 'सम्मेलन',
      'type.workshop': 'कार्यशाला',
      'type.meeting': 'बैठक',
      'type.party': 'पार्टी',
      'type.general': 'सामान्य',
      'quick.quickAdd': 'त्वरित जोड़ें',
      'quick.saveTemplate': 'टेम्पलेट सहेजें',
      'quick.loadTemplate': 'टेम्पलेट लोड करें',
      'quick.emergency': 'आपातकालीन किट',
      'events.title': 'सभी इवेंट्स',
      'events.empty': 'अभी कोई इवेंट नहीं। एक जोड़ें!',
      'events.bookedBy': 'बुक किया: {name}',
      'btn.invoice': 'इनवॉइस',
      'btn.map': 'मानचित्र',
      'btn.remind': 'याद दिलाएं',
      'btn.delete': 'हटाएं',
      'alert.today': '📅 आज आपका एक इवेंट है!',
      'map.pickLocation': 'मानचित्र पर स्थान चुनें',
      'map.confirm': 'पुष्टि करें',
      'map.confirmed': '✅ स्थान पुष्टि और सहेजा गया!',
      'today.noEvents': '🎯 आज कोई इवेंट नहीं!',
      'invoice.generating': 'इनवॉइस जेनरेट हो रहा है...',
      'invoice.pleaseWait': 'कृपया प्रतीक्षा करें',
      'invoice.failed': '❌ इनवॉइस जेनरेट करने में विफल। कृपया पुनः प्रयास करें।',
      'invoice.thankyou': 'आपके व्यवसाय के लिए धन्यवाद!',
      'invoice.generated': '{date} को जेनरेट किया गया'
    },
    es: {
      'tab.profile': 'Perfil',
      'tab.add': 'Agregar Evento',
      'tab.events': 'Eventos',
      'profile.title': 'Perfil de Empresa',
      'profile.subtitle': 'Ingrese los detalles de su empresa para facturas profesionales',
      'profile.companyName': 'Nombre de Empresa',
      'profile.companyNamePlaceholder': 'Nombre de su Empresa',
      'profile.ownerName': 'Nombre del Propietario',
      'profile.ownerNamePlaceholder': 'Juan Pérez',
      'profile.email': 'Correo Electrónico',
      'profile.emailPlaceholder': 'info@empresa.com',
      'profile.phone': 'Teléfono de Empresa',
      'profile.phonePlaceholder': '+1 555 1234',
      'profile.address': 'Dirección de Empresa',
      'profile.addressPlaceholder': '123 Calle Comercial, Ciudad',
      'profile.gst': 'Número GST/Impuesto',
      'profile.gstPlaceholder': 'GST-123456789',
      'profile.logo': 'URL del Logo (opcional)',
      'profile.logoPlaceholder': 'https://ejemplo.com/logo.png',
      'profile.save': 'Guardar Perfil',
      'profile.saved': '✅ Perfil de empresa guardado exitosamente!',
      'profile.failed': '❌ Error al guardar el perfil.',
      'add.title': 'Agregar Nuevo Evento',
      'add.eventName': 'Nombre del Evento',
      'add.eventNamePlaceholder': 'Ej: Reunión Tecnológica',
      'add.bookedBy': 'Reservado Por',
      'add.bookedByPlaceholder': 'Nombre del Cliente',
      'add.bookieNumber': 'Número del Reservador',
      'add.bookieNumberPlaceholder': '+1 555 6789',
      'add.venue': 'Nombre del Lugar',
      'add.venuePlaceholder': 'Salón 2, NY',
      'add.date': 'Fecha',
      'add.time': 'Hora',
      'add.incharge': 'Encargado',
      'add.inchargePlaceholder': 'Juan Pérez',
      'add.inchargePhone': 'Teléfono del Encargado',
      'add.inchargePhonePlaceholder': '+1 555 1234',
      'add.amount': 'Monto',
      'add.amountPlaceholder': '$150.00',
      'add.volunteers': 'Voluntarios',
      'add.volunteersPlaceholder': 'Ana, Luis, Carlos',
      'add.volunteerPhones': 'Números de Voluntarios',
      'add.volunteerPhonesPlaceholder': '+1 111, +1 222',
      'add.address': 'Dirección del Evento',
      'add.addressPlaceholder': 'Dirección completa o seleccionar del mapa',
      'add.pickFromMap': 'Seleccionar del Mapa',
      'add.priority': 'Prioridad',
      'add.type': 'Tipo de Evento',
      'add.addEvent': 'Agregar Evento',
      'priority.high': '🔴 Alta',
      'priority.medium': '🟡 Media',
      'priority.low': '🟢 Baja',
      'type.conference': 'Conferencia',
      'type.workshop': 'Taller',
      'type.meeting': 'Reunión',
      'type.party': 'Fiesta',
      'type.general': 'General',
      'quick.quickAdd': 'Agregar Rápido',
      'quick.saveTemplate': 'Guardar Plantilla',
      'quick.loadTemplate': 'Cargar Plantilla',
      'quick.emergency': 'Kit de Emergencia',
      'events.title': 'Todos los Eventos',
      'events.empty': '¡Sin eventos aún! Agrega uno.',
      'events.bookedBy': 'Reservado por: {name}',
      'btn.invoice': 'Factura',
      'btn.map': 'Mapa',
      'btn.remind': 'Recordar',
      'btn.delete': 'Eliminar',
      'alert.today': '📅 ¡Tienes un evento hoy!',
      'map.pickLocation': 'Seleccionar Ubicación en el Mapa',
      'map.confirm': 'Confirmar',
      'map.confirmed': '✅ Ubicación confirmada y guardada!',
      'today.noEvents': '🎯 ¡No hay eventos hoy!',
      'invoice.generating': 'Generando Factura...',
      'invoice.pleaseWait': 'Por favor espere',
      'invoice.failed': '❌ Error al generar la factura. Intente nuevamente.',
      'invoice.thankyou': '¡Gracias por su negocio!',
      'invoice.generated': 'Generado el {date}'
    },
    fr: {
      'tab.profile': 'Profil',
      'tab.add': 'Ajouter un Événement',
      'tab.events': 'Événements',
      'profile.title': 'Profil d\'Entreprise',
      'profile.subtitle': 'Entrez les détails de votre entreprise pour des factures professionnelles',
      'profile.companyName': 'Nom de l\'Entreprise',
      'profile.companyNamePlaceholder': 'Nom de votre Entreprise',
      'profile.ownerName': 'Nom du Propriétaire',
      'profile.ownerNamePlaceholder': 'Jean Dupont',
      'profile.email': 'Email de l\'Entreprise',
      'profile.emailPlaceholder': 'info@entreprise.com',
      'profile.phone': 'Téléphone de l\'Entreprise',
      'profile.phonePlaceholder': '+1 555 1234',
      'profile.address': 'Adresse de l\'Entreprise',
      'profile.addressPlaceholder': '123 Rue Commerciale, Ville',
      'profile.gst': 'Numéro GST/TVA',
      'profile.gstPlaceholder': 'GST-123456789',
      'profile.logo': 'URL du Logo (optionnel)',
      'profile.logoPlaceholder': 'https://exemple.com/logo.png',
      'profile.save': 'Enregistrer le Profil',
      'profile.saved': '✅ Profil d\'entreprise enregistré avec succès!',
      'profile.failed': '❌ Échec de l\'enregistrement du profil.',
      'add.title': 'Ajouter un Nouvel Événement',
      'add.eventName': 'Nom de l\'Événement',
      'add.eventNamePlaceholder': 'Ex: Rencontre Tech',
      'add.bookedBy': 'Réservé Par',
      'add.bookedByPlaceholder': 'Nom du Client',
      'add.bookieNumber': 'Numéro du Réservateur',
      'add.bookieNumberPlaceholder': '+1 555 6789',
      'add.venue': 'Nom du Lieu',
      'add.venuePlaceholder': 'Salle 2, NY',
      'add.date': 'Date',
      'add.time': 'Heure',
      'add.incharge': 'Responsable',
      'add.inchargePlaceholder': 'Jean Dupont',
      'add.inchargePhone': 'Téléphone du Responsable',
      'add.inchargePhonePlaceholder': '+1 555 1234',
      'add.amount': 'Montant',
      'add.amountPlaceholder': '$150.00',
      'add.volunteers': 'Bénévoles',
      'add.volunteersPlaceholder': 'Alice, Bob, Carol',
      'add.volunteerPhones': 'N° des Bénévoles',
      'add.volunteerPhonesPlaceholder': '+1 111, +1 222',
      'add.address': 'Adresse de l\'Événement',
      'add.addressPlaceholder': 'Adresse complète ou choisir sur la carte',
      'add.pickFromMap': 'Choisir sur la Carte',
      'add.priority': 'Priorité',
      'add.type': 'Type d\'Événement',
      'add.addEvent': 'Ajouter l\'Événement',
      'priority.high': '🔴 Élevée',
      'priority.medium': '🟡 Moyenne',
      'priority.low': '🟢 Basse',
      'type.conference': 'Conférence',
      'type.workshop': 'Atelier',
      'type.meeting': 'Réunion',
      'type.party': 'Fête',
      'type.general': 'Général',
      'quick.quickAdd': 'Ajout Rapide',
      'quick.saveTemplate': 'Enregistrer le Modèle',
      'quick.loadTemplate': 'Charger le Modèle',
      'quick.emergency': 'Kit d\'Urgence',
      'events.title': 'Tous les Événements',
      'events.empty': 'Aucun événement pour le moment. Ajoutez-en un !',
      'events.bookedBy': 'Réservé par: {name}',
      'btn.invoice': 'Facture',
      'btn.map': 'Carte',
      'btn.remind': 'Rappeler',
      'btn.delete': 'Supprimer',
      'alert.today': '📅 Vous avez un événement aujourd\'hui !',
      'map.pickLocation': 'Choisir un Emplacement sur la Carte',
      'map.confirm': 'Confirmer',
      'map.confirmed': '✅ Emplacement confirmé et enregistré !',
      'today.noEvents': '🎯 Pas d\'événements aujourd\'hui !',
      'invoice.generating': 'Génération de la Facture...',
      'invoice.pleaseWait': 'Veuillez patienter',
      'invoice.failed': '❌ Échec de la génération de la facture. Veuillez réessayer.',
      'invoice.thankyou': 'Merci pour votre confiance !',
      'invoice.generated': 'Généré le {date}'
    }
  };

  // ============================================
  // Data Management
  // ============================================
  function loadAllData() {
    loadEvents();
    loadHistory();
    loadTemplates();
    loadEmergencyKit();
    loadCompanyProfile();
    loadDarkMode();
    loadLanguage();
  }

  function loadEvents() {
    try {
      const stored = localStorage.getItem(APP.storageKey);
      events = stored ? JSON.parse(stored) : [];
    } catch { events = []; }
  }

  function saveEvents() {
    try {
      localStorage.setItem(APP.storageKey, JSON.stringify(events));
    } catch {}
  }

  function loadHistory() {
    try {
      const stored = localStorage.getItem(APP.historyKey);
      eventHistory = stored ? JSON.parse(stored) : {};
    } catch { eventHistory = {}; }
  }

  function saveHistory() {
    try {
      localStorage.setItem(APP.historyKey, JSON.stringify(eventHistory));
    } catch {}
  }

  function loadTemplates() {
    try {
      const stored = localStorage.getItem(APP.templatesKey);
      templates = stored ? JSON.parse(stored) : [];
    } catch { templates = []; }
  }

  function saveTemplates() {
    try {
      localStorage.setItem(APP.templatesKey, JSON.stringify(templates));
    } catch {}
  }

  function loadEmergencyKit() {
    try {
      const stored = localStorage.getItem(APP.emergencyKey);
      emergencyKit = stored ? JSON.parse(stored) : {
        wifiName: '', wifiPassword: '', emergencyContact1: '', emergencyContact2: '', venueNotes: ''
      };
    } catch { emergencyKit = {}; }
  }

  function saveEmergencyKit() {
    try {
      localStorage.setItem(APP.emergencyKey, JSON.stringify(emergencyKit));
    } catch {}
  }

  function loadCompanyProfile() {
    try {
      const stored = localStorage.getItem(APP.profileKey);
      if (stored) {
        companyProfile = JSON.parse(stored);
        populateProfileForm();
      }
    } catch { companyProfile = {}; }
  }

  function saveCompanyProfile() {
    const profile = {
      companyName: DOM.companyName.value.trim(),
      ownerName: DOM.ownerName.value.trim(),
      companyEmail: DOM.companyEmail.value.trim(),
      companyPhone: DOM.companyPhone.value.trim(),
      companyAddress: DOM.companyAddress.value.trim(),
      companyGst: DOM.companyGst.value.trim(),
      companyLogo: DOM.companyLogo.value.trim()
    };
    
    try {
      localStorage.setItem(APP.profileKey, JSON.stringify(profile));
      companyProfile = profile;
      alert(t('profile.saved'));
    } catch {
      alert(t('profile.failed'));
    }
  }

  function populateProfileForm() {
    if (companyProfile) {
      DOM.companyName.value = companyProfile.companyName || '';
      DOM.ownerName.value = companyProfile.ownerName || '';
      DOM.companyEmail.value = companyProfile.companyEmail || '';
      DOM.companyPhone.value = companyProfile.companyPhone || '';
      DOM.companyAddress.value = companyProfile.companyAddress || '';
      DOM.companyGst.value = companyProfile.companyGst || '';
      DOM.companyLogo.value = companyProfile.companyLogo || '';
    }
  }

  // ============================================
  // Dark Mode
  // ============================================
  function loadDarkMode() {
    try {
      const stored = localStorage.getItem(APP.darkModeKey);
      if (stored !== null) {
        applyDarkMode(JSON.parse(stored));
        return;
      }
    } catch {}
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyDarkMode(prefersDark);
  }

  function applyDarkMode(isDark) {
    const html = document.documentElement;
    if (isDark) {
      html.setAttribute('data-theme', 'dark');
      DOM.darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      html.removeAttribute('data-theme');
      DOM.darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    localStorage.setItem(APP.darkModeKey, JSON.stringify(isDark));
  }

  function toggleDarkMode() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyDarkMode(!isDark);
    setTimeout(() => { 
      if (mapInstance) mapInstance.invalidateSize(); 
      if (mapPickerInstance) mapPickerInstance.invalidateSize();
    }, 300);
  }

  // ============================================
  // Language Management
  // ============================================
  function loadLanguage() {
    try {
      const stored = localStorage.getItem(APP.languageKey);
      if (stored && TRANSLATIONS[stored]) {
        currentLanguage = stored;
      } else {
        const browserLang = navigator.language.split('-')[0];
        if (TRANSLATIONS[browserLang]) {
          currentLanguage = browserLang;
        }
      }
    } catch {
      currentLanguage = 'en';
    }
    updateUI();
    updateLangButton();
  }

  function saveLanguage(lang) {
    try {
      localStorage.setItem(APP.languageKey, lang);
      currentLanguage = lang;
    } catch {}
  }

  function t(key, params = {}) {
    const translation = TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS.en[key] || key;
    let result = translation;
    for (const [param, value] of Object.entries(params)) {
      result = result.replace(`{${param}}`, value);
    }
    return result;
  }

  function updateUI() {
    // Update text content for elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = t(key);
      if (translation) {
        el.textContent = translation;
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = t(key);
      if (translation) {
        el.placeholder = translation;
      }
    });

    // Update tab labels
    const tabLabels = document.querySelectorAll('.nav-tab span');
    if (tabLabels.length >= 3) {
      tabLabels[0].textContent = t('tab.profile');
      tabLabels[1].textContent = t('tab.add');
      tabLabels[2].textContent = t('tab.events');
    }

    // Update profile section
    const profileTitle = document.querySelector('.profile-section h3');
    if (profileTitle) {
      const icon = profileTitle.querySelector('i');
      profileTitle.innerHTML = `${icon.outerHTML} ${t('profile.title')}`;
    }

    // Update add event section
    const addTitle = document.querySelector('.event-form h3');
    if (addTitle) {
      const icon = addTitle.querySelector('i');
      addTitle.innerHTML = `${icon.outerHTML} ${t('add.title')}`;
    }

    // Update events header
    const eventsHeader = document.querySelector('.events-header h3');
    if (eventsHeader) {
      const icon = eventsHeader.querySelector('i');
      eventsHeader.innerHTML = `${icon.outerHTML} ${t('events.title')}`;
    }

    // Update buttons
    const addBtn = document.getElementById('addEventBtn');
    if (addBtn) {
      const icon = addBtn.querySelector('i');
      addBtn.innerHTML = `${icon.outerHTML} ${t('add.addEvent')}`;
    }

    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) {
      const icon = saveProfileBtn.querySelector('i');
      saveProfileBtn.innerHTML = `${icon.outerHTML} ${t('profile.save')}`;
    }

    // Update quick action buttons
    const quickBtns = document.querySelectorAll('.btn-quick');
    if (quickBtns.length >= 4) {
      const icons = quickBtns[0].querySelector('i');
      quickBtns[0].innerHTML = `${icons.outerHTML} ${t('quick.quickAdd')}`;
      
      const icons2 = quickBtns[1].querySelector('i');
      quickBtns[1].innerHTML = `${icons2.outerHTML} ${t('quick.saveTemplate')}`;
      
      const icons3 = quickBtns[2].querySelector('i');
      quickBtns[2].innerHTML = `${icons3.outerHTML} ${t('quick.loadTemplate')}`;
      
      const icons4 = quickBtns[3].querySelector('i');
      quickBtns[3].innerHTML = `${icons4.outerHTML} ${t('quick.emergency')}`;
    }

    // Update map picker button
    const mapBtn = document.getElementById('openMapPickerBtn');
    if (mapBtn) {
      const icon = mapBtn.querySelector('i');
      mapBtn.innerHTML = `${icon.outerHTML} ${t('add.pickFromMap')}`;
    }

    // Update form labels - including bookie number
    const labels = document.querySelectorAll('.field label');
    const labelKeys = [
      'profile.companyName', 'profile.ownerName', 'profile.email', 'profile.phone',
      'profile.address', 'profile.gst', 'profile.logo',
      'add.eventName', 'add.bookedBy', 'add.bookieNumber', 'add.venue', 
      'add.date', 'add.time', 'add.incharge', 'add.inchargePhone',
      'add.amount', 'add.volunteers', 'add.volunteerPhones', 
      'add.address', 'add.priority', 'add.type'
    ];
    
    labels.forEach((label, index) => {
      if (index < labelKeys.length) {
        const key = labelKeys[index];
        const translation = t(key);
        if (translation) {
          const icon = label.querySelector('i');
          if (icon) {
            label.innerHTML = `${icon.outerHTML} ${translation}`;
          } else {
            label.textContent = translation;
          }
        }
      }
    });

    // Update placeholders for form inputs - including bookie number
    const inputs = document.querySelectorAll('.field input');
    const placeholderKeys = [
      'profile.companyNamePlaceholder', 'profile.ownerNamePlaceholder',
      'profile.emailPlaceholder', 'profile.phonePlaceholder',
      'profile.addressPlaceholder', 'profile.gstPlaceholder',
      'profile.logoPlaceholder',
      'add.eventNamePlaceholder', 'add.bookedByPlaceholder',
      'add.bookieNumberPlaceholder', 'add.venuePlaceholder', 
      '', '', 'add.inchargePlaceholder',
      'add.inchargePhonePlaceholder', 'add.amountPlaceholder',
      'add.volunteersPlaceholder', 'add.volunteerPhonesPlaceholder',
      'add.addressPlaceholder'
    ];
    
    inputs.forEach((input, index) => {
      if (index < placeholderKeys.length && placeholderKeys[index]) {
        const key = placeholderKeys[index];
        const translation = t(key);
        if (translation) {
          input.placeholder = translation;
        }
      }
    });

    // Update priority options
    const prioritySelect = document.getElementById('eventPriority');
    if (prioritySelect) {
      const options = prioritySelect.querySelectorAll('option');
      if (options.length >= 3) {
        options[0].textContent = t('priority.high');
        options[1].textContent = t('priority.medium');
        options[2].textContent = t('priority.low');
      }
    }

    // Update event type options
    const typeSelect = document.getElementById('eventType');
    if (typeSelect) {
      const options = typeSelect.querySelectorAll('option');
      if (options.length >= 5) {
        options[0].textContent = t('type.conference');
        options[1].textContent = t('type.workshop');
        options[2].textContent = t('type.meeting');
        options[3].textContent = t('type.party');
        options[4].textContent = t('type.general');
      }
    }

    // Update empty message
    const emptyMsg = document.querySelector('.empty-message');
    if (emptyMsg) {
      const text = emptyMsg.querySelector('br');
      if (text) {
        const icon = emptyMsg.querySelector('i');
        emptyMsg.innerHTML = `${icon.outerHTML}<br>${t('events.empty')}`;
      }
    }

    // Update alert banner
    const alertMsg = document.getElementById('alertMessage');
    if (alertMsg) {
      const todayStr = getTodayString();
      const todayEvents = events.filter(ev => ev.date === todayStr);
      if (todayEvents.length > 0) {
        alertMsg.textContent = `📅 ${todayEvents.length} event${todayEvents.length > 1 ? 's' : ''} today!`;
      }
    }

    // Update confirm location button
    const confirmBtn = document.getElementById('confirmLocationBtn');
    if (confirmBtn) {
      const icon = confirmBtn.querySelector('i');
      confirmBtn.innerHTML = `${icon.outerHTML} ${t('map.confirm')}`;
    }

    // Update map modal title
    const mapTitle = document.querySelector('.map-modal-header h3');
    if (mapTitle) {
      const icon = mapTitle.querySelector('i');
      mapTitle.innerHTML = `${icon.outerHTML} ${t('map.pickLocation')}`;
    }
  }

  function updateLangButton() {
    const langMap = {
      en: 'EN', hi: 'हिं', es: 'ES', fr: 'FR', 
      de: 'DE', zh: '中文', ar: 'عربي', ja: '日本語'
    };
    if (DOM.currentLangLabel) {
      DOM.currentLangLabel.textContent = langMap[currentLanguage] || currentLanguage.toUpperCase();
    }

    DOM.langOptions.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
    });
  }

  function toggleLanguageDropdown() {
    DOM.langDropdown.classList.toggle('active');
  }

  function changeLanguage(lang) {
    if (TRANSLATIONS[lang]) {
      saveLanguage(lang);
      updateUI();
      updateLangButton();
      DOM.langDropdown.classList.remove('active');
      console.log(`🌍 Language changed to: ${lang}`);
    }
  }

  // ============================================
  // Helpers
  // ============================================
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }

  function getTodayString() {
    return new Date().toISOString().split('T')[0];
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'No date';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return dateStr; }
  }

  function formatCurrency(amount) {
    if (!amount) return '$0';
    const clean = amount.replace(/[^0-9.]/g, '');
    if (!clean) return '$0';
    const num = parseFloat(clean);
    return isNaN(num) ? amount : '$' + num.toFixed(2);
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function getPriorityColor(priority) {
    switch(priority) {
      case 'High': return '#ff4757';
      case 'Medium': return '#ffa502';
      case 'Low': return '#2ed573';
      default: return '#747d8c';
    }
  }

  function getPriorityIcon(priority) {
    switch(priority) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  }

  // ============================================
  // Format Volunteers
  // ============================================
  function formatVolunteers(names, phones) {
    const nameArr = names ? names.split(',').map(s => s.trim()).filter(Boolean) : [];
    const phoneArr = phones ? phones.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    if (nameArr.length === 0) {
      return '<span style="opacity:0.6; font-size:13px;">No volunteers</span>';
    }
    
    return nameArr.map((name, i) => {
      const phone = phoneArr[i] || '';
      return `<span class="volunteer-tag">
        <i class="fas fa-user"></i> ${escapeHtml(name)} ${phone ? '📞 ' + escapeHtml(phone) : ''}
      </span>`;
    }).join(' ');
  }

  // ============================================
  // Tabs Navigation
  // ============================================
  function switchTab(tabId) {
    DOM.tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabId);
    });
    
    if (DOM.tabProfile) DOM.tabProfile.classList.toggle('active', tabId === 'profile');
    if (DOM.tabAdd) DOM.tabAdd.classList.toggle('active', tabId === 'add');
    if (DOM.tabEvents) DOM.tabEvents.classList.toggle('active', tabId === 'events');
    
    if (tabId === 'add') {
      setTimeout(initializeMiniMap, 300);
    }
  }

  // ============================================
  // Map Functions
  // ============================================
  function initializeMiniMap() {
    const container = DOM.miniMapContainer;
    if (!container) return;
    
    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
    }
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const address = DOM.eventAddress.value || 'New York, NY';
    
    mapInstance = L.map(container, {
      center: [40.7128, -74.0060],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });
    
    const tileLayer = isDark 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    
    L.tileLayer(tileLayer, { maxZoom: 19 }).addTo(mapInstance);
    
    if (address && address.trim().length > 0 && address !== 'New York, NY') {
      geocodeAddress(address, (lat, lon) => {
        mapInstance.setView([lat, lon], 15);
        L.marker([lat, lon]).addTo(mapInstance);
      });
    }
    
    setTimeout(() => mapInstance.invalidateSize(), 300);
  }

  function openMapPicker() {
    const modal = document.getElementById('mapPickerModal');
    modal.style.display = 'flex';
    modal.classList.add('active');
    
    setTimeout(() => {
      const container = DOM.mapPickerContainer;
      if (!container) return;
      
      if (mapPickerInstance) {
        mapPickerInstance.remove();
        mapPickerInstance = null;
      }
      
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      
      mapPickerInstance = L.map(container, {
        center: [40.7128, -74.0060],
        zoom: 13,
        zoomControl: true,
        attributionControl: true
      });
      
      const tileLayer = isDark 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      
      L.tileLayer(tileLayer, {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(mapPickerInstance);
      
      let marker = null;
      
      mapPickerInstance.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        selectedLocation = { lat, lng };
        
        if (marker) {
          mapPickerInstance.removeLayer(marker);
        }
        
        marker = L.marker([lat, lng]).addTo(mapPickerInstance);
        
        DOM.pickedAddress.value = '⏳ Fetching address...';
        
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
        
        fetch(url)
          .then(response => response.json())
          .then(data => {
            if (data && data.display_name) {
              DOM.pickedAddress.value = data.display_name;
            } else {
              DOM.pickedAddress.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            }
          })
          .catch(() => {
            DOM.pickedAddress.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          });
      });
      
      const existingAddress = DOM.eventAddress.value;
      if (existingAddress && existingAddress.trim().length > 0) {
        geocodeAddress(existingAddress, (lat, lon) => {
          mapPickerInstance.setView([lat, lon], 15);
          marker = L.marker([lat, lon]).addTo(mapPickerInstance);
          selectedLocation = { lat, lon };
          DOM.pickedAddress.value = existingAddress;
        });
      }
      
      setTimeout(() => mapPickerInstance.invalidateSize(), 300);
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
    const address = DOM.pickedAddress.value;
    
    if (address && address.trim().length > 0 && !address.includes('⏳')) {
      DOM.eventAddress.value = address;
      
      if (selectedLocation && mapInstance) {
        mapInstance.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            mapInstance.removeLayer(layer);
          }
        });
        mapInstance.setView([selectedLocation.lat, selectedLocation.lng], 15);
        L.marker([selectedLocation.lat, selectedLocation.lng]).addTo(mapInstance);
      } else {
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
      alert(t('map.confirmed'));
    } else if (address && address.includes('⏳')) {
      alert('⚠️ Please wait for the address to load or click on the map again.');
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
          callback(parseFloat(data[0].lat), parseFloat(data[0].lon));
        } else {
          callback(40.7128, -74.0060);
        }
      })
      .catch(() => callback(40.7128, -74.0060));
  }

  // ============================================
  // Event CRUD
  // ============================================
  function addEvent() {
    const name = DOM.eventName.value.trim() || 'Unnamed';
    const bookedBy = DOM.bookedBy.value.trim() || 'Unknown';
    const bookieNumber = DOM.bookieNumber.value.trim() || '';
    const location = DOM.eventLocation.value.trim() || 'TBD';
    const address = DOM.eventAddress.value.trim() || '';
    const date = DOM.eventDate.value;
    const time = DOM.eventTime.value || '';
    const ampm = DOM.eventAmPm.value;
    const inchargeName = DOM.inchargeName.value.trim();
    const inchargePhone = DOM.inchargePhone.value.trim();
    const volunteerNames = DOM.volunteerNames.value.trim();
    const volunteerPhones = DOM.volunteerPhones.value.trim();
    const payee = DOM.payeeAmount.value.trim() || '$0';
    const priority = DOM.eventPriority.value;
    const eventType = DOM.eventType.value;

    if (!date) {
      alert('⚠️ Please select a date.');
      return;
    }

    const newEvent = {
      id: generateId(),
      name,
      bookedBy,
      bookieNumber,
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

    const conflicts = events.filter(ev => 
      ev.id !== newEvent.id && 
      ev.date === newEvent.date && 
      ev.time && newEvent.time &&
      Math.abs(
        (parseInt(ev.time.split(':')[0]) * 60 + parseInt(ev.time.split(':')[1])) -
        (parseInt(newEvent.time.split(':')[0]) * 60 + parseInt(newEvent.time.split(':')[1]))
      ) < 30
    );

    if (conflicts.length > 0) {
      const names = conflicts.map(ev => ev.name).join(', ');
      if (!confirm(`⚠️ Conflicts with: ${names}\n\nAdd anyway?`)) return;
    }

    events.push(newEvent);
    saveEventHistory(newEvent.id, newEvent);
    saveAndRender();
    
    DOM.eventName.value = '';
    DOM.bookedBy.value = '';
    DOM.bookieNumber.value = '';
    DOM.eventLocation.value = '';
    DOM.eventAddress.value = '';
    DOM.inchargeName.value = '';
    DOM.inchargePhone.value = '';
    DOM.volunteerNames.value = '';
    DOM.volunteerPhones.value = '';
    DOM.payeeAmount.value = '';
    
    switchTab('events');
  }

  function deleteEvent(id) {
    const event = events.find(ev => ev.id === id);
    if (!event) return;
    
    if (confirm(`Delete "${event.name}"?`)) {
      events = events.filter(ev => ev.id !== id);
      delete eventHistory[id];
      saveHistory();
      saveAndRender();
    }
  }

  function saveAndRender() {
    saveEvents();
    renderEvents();
    updateCounters();
  }

  // ============================================
  // History
  // ============================================
  function saveEventHistory(eventId, eventData) {
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

  // ============================================
  // Render Events
  // ============================================
  function renderEvents() {
    if (events.length === 0) {
      DOM.eventList.innerHTML = `
        <div class="empty-message">
          <i class="far fa-calendar-times"></i>
          <br>${t('events.empty')}
        </div>
      `;
      return;
    }

    const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    const sorted = [...events].sort((a, b) => 
      (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1)
    );

    let html = '';
    sorted.forEach(ev => {
      const priorityColor = getPriorityColor(ev.priority);
      const priorityIcon = getPriorityIcon(ev.priority);
      const volTags = formatVolunteers(ev.volunteerNames, ev.volunteerPhones);
      const incharge = ev.inchargeName || 'Not assigned';
      const inchargePhone = ev.inchargePhone || '';

      html += `
        <div class="event-card" data-id="${ev.id}">
          <div class="event-name">
            <span>${escapeHtml(ev.name)}</span>
            <span class="event-badges">
              <span class="priority-badge" style="background:${priorityColor}20; color:${priorityColor};">
                ${priorityIcon} ${ev.priority}
              </span>
              <span class="payee-badge"><i class="fas fa-coins"></i> ${escapeHtml(ev.payee)}</span>
            </span>
          </div>
          <div class="event-type-tag">${escapeHtml(ev.eventType || 'General')}</div>
          <div class="event-meta">
            <span class="meta-item"><i class="fas fa-user"></i> ${t('events.bookedBy', { name: escapeHtml(ev.bookedBy || 'Unknown') })}</span>
            ${ev.bookieNumber ? `<span class="meta-item"><i class="fas fa-phone"></i> ${escapeHtml(ev.bookieNumber)}</span>` : ''}
            <span class="meta-item"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(ev.location)}</span>
            <span class="meta-item"><i class="far fa-calendar-alt"></i> ${formatDate(ev.date)}</span>
            <span class="meta-item"><i class="far fa-clock"></i> ${ev.time || '--:--'} ${ev.ampm || ''}</span>
          </div>
          ${ev.address ? `
            <div class="event-meta" style="margin-top:-5px;">
              <span class="meta-item"><i class="fas fa-location-dot"></i> ${escapeHtml(ev.address)}</span>
            </div>
          ` : ''}
          <div class="incharge-section">
            <i class="fas fa-user-tie"></i> ${escapeHtml(incharge)} ${inchargePhone ? '📞 ' + escapeHtml(inchargePhone) : ''}
          </div>
          <div class="volunteer-section">
            <i class="fas fa-users"></i> ${volTags}
          </div>
          <div class="event-actions">
            <button class="pdf-btn" data-id="${ev.id}"><i class="fas fa-file-invoice"></i> ${t('btn.invoice')}</button>
            <button class="map-btn" data-id="${ev.id}"><i class="fas fa-map"></i> ${t('btn.map')}</button>
            <button class="remind-btn" data-id="${ev.id}"><i class="fas fa-bell"></i> ${t('btn.remind')}</button>
            <button class="delete-btn" data-id="${ev.id}"><i class="fas fa-trash-alt"></i> ${t('btn.delete')}</button>
          </div>
        </div>
      `;
    });

    DOM.eventList.innerHTML = html;
    attachEventListeners();
  }

  function updateCounters() {
    const count = events.length;
    DOM.eventCounter.textContent = count;
    DOM.navEventCount.textContent = count;
    
    const todayStr = getTodayString();
    const todayEvents = events.filter(ev => ev.date === todayStr);
    if (todayEvents.length > 0) {
      DOM.alertBanner.style.display = 'flex';
      DOM.alertMessage.textContent = `📅 ${todayEvents.length} event${todayEvents.length > 1 ? 's' : ''} today!`;
      DOM.alertBadge.textContent = `🔔 ${todayEvents.length}`;
    } else {
      DOM.alertBanner.style.display = 'none';
      DOM.alertBadge.textContent = 'Today?';
    }
  }

  // ============================================
  // Event Listeners
  // ============================================
  function attachEventListeners() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        deleteEvent(btn.dataset.id);
      };
    });

    document.querySelectorAll('.remind-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const ev = events.find(e => e.id === btn.dataset.id);
        if (ev) {
          let msg = `🔔 REMINDER: "${ev.name}"\n`;
          msg += `📍 ${ev.location}\n`;
          msg += `📅 ${formatDate(ev.date)} ${ev.time || ''} ${ev.ampm || ''}\n`;
          msg += `👤 ${ev.inchargeName || 'Not assigned'}`;
          if (ev.bookieNumber) {
            msg += `\n📞 Bookie: ${ev.bookieNumber}`;
          }
          alert(msg);
        }
      };
    });

    document.querySelectorAll('.pdf-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const ev = events.find(e => e.id === btn.dataset.id);
        if (ev) generateInvoice(ev);
      };
    });

    document.querySelectorAll('.map-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const ev = events.find(e => e.id === btn.dataset.id);
        if (ev) showEventMap(ev);
      };
    });
  }

  // ============================================
  // FIXED: Invoice Generation - Using html2canvas + jsPDF
  // ============================================
  function generateInvoice(event) {
    if (!event) {
      alert('❌ Event not found!');
      return;
    }

    const company = companyProfile || {};
    const companyName = company.companyName || 'Your Company';
    const ownerName = company.ownerName || '';
    const companyEmail = company.companyEmail || '';
    const companyPhone = company.companyPhone || '';
    const companyAddress = company.companyAddress || '';
    const companyGst = company.companyGst || '';
    const logoUrl = company.companyLogo || '';
    const formattedAmount = formatCurrency(event.payee);

    // Show loading indicator
    const loadingMsg = document.createElement('div');
    loadingMsg.id = 'invoiceLoading';
    loadingMsg.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      backdrop-filter: blur(4px);
    `;
    loadingMsg.innerHTML = `
      <div style="background: white; padding: 40px 50px; border-radius: 16px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 400px;">
        <div style="font-size: 50px; margin-bottom: 15px;">📄</div>
        <div style="font-weight: 700; font-size: 18px; color: #1e2b3a;">${t('invoice.generating')}</div>
        <div style="font-size: 14px; color: #6d7f92; margin-top: 8px;">${t('invoice.pleaseWait')}</div>
        <div style="margin-top: 20px; width: 100%; height: 4px; background: #e7ecf3; border-radius: 4px; overflow: hidden;">
          <div style="width: 40%; height: 100%; background: #3b7cff; border-radius: 4px; animation: loadingProgress 1.5s infinite ease-in-out;"></div>
        </div>
        <style>
          @keyframes loadingProgress {
            0% { transform: translateX(-100%); width: 30%; }
            50% { width: 70%; }
            100% { transform: translateX(100%); width: 30%; }
          }
        </style>
      </div>
    `;
    document.body.appendChild(loadingMsg);

    // Build invoice HTML
    const invoiceHTML = `
      <div id="invoiceContainer" style="font-family: 'Arial', 'Helvetica', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: #ffffff; color: #1e2b3a; border: 1px solid #e7ecf3; border-radius: 12px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; border-bottom: 3px solid #3b7cff; padding-bottom: 20px; margin-bottom: 25px; flex-wrap: wrap;">
          <div>
            ${logoUrl ? `<img src="${logoUrl}" style="max-height:60px; margin-bottom:10px;" onerror="this.style.display='none'">` : ''}
            <h1 style="color: #3b7cff; font-size: 30px; margin: 0;">INVOICE</h1>
            <p style="color: #6d7f92; font-size: 14px; margin: 5px 0 0;">#${event.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div style="text-align: right; min-width: 200px;">
            <div style="font-size: 22px; font-weight: 700; color: #1e2b3a;">${escapeHtml(companyName)}</div>
            ${ownerName ? `<div style="font-size: 13px; color: #6d7f92;">${escapeHtml(ownerName)}</div>` : ''}
            ${companyAddress ? `<div style="font-size: 13px; color: #6d7f92;">${escapeHtml(companyAddress)}</div>` : ''}
            ${companyPhone ? `<div style="font-size: 13px; color: #6d7f92;">📞 ${escapeHtml(companyPhone)}</div>` : ''}
            ${companyEmail ? `<div style="font-size: 13px; color: #6d7f92;">✉ ${escapeHtml(companyEmail)}</div>` : ''}
            ${companyGst ? `<div style="font-size: 13px; color: #1e2b3a; font-weight: 600;">GST: ${escapeHtml(companyGst)}</div>` : ''}
          </div>
        </div>

        <!-- Event Details -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: #f8faff; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
          <div>
            <h3 style="color: #3b7cff; font-size: 16px; margin: 0 0 10px;">📋 Event Details</h3>
            <div style="font-size: 14px; line-height: 2;">
              <div><span style="color: #6d7f92;">Event:</span> <strong>${escapeHtml(event.name)}</strong></div>
              <div><span style="color: #6d7f92;">Booked By:</span> <strong>${escapeHtml(event.bookedBy || 'Unknown')}</strong></div>
              ${event.bookieNumber ? `<div><span style="color: #6d7f92;">Bookie Number:</span> <strong>${escapeHtml(event.bookieNumber)}</strong></div>` : ''}
              <div><span style="color: #6d7f92;">Type:</span> <strong>${escapeHtml(event.eventType || 'General')}</strong></div>
              <div><span style="color: #6d7f92;">Date:</span> <strong>${formatDate(event.date)}</strong></div>
              <div><span style="color: #6d7f92;">Time:</span> <strong>${event.time || '--:--'} ${event.ampm || ''}</strong></div>
            </div>
          </div>
          <div>
            <h3 style="color: #3b7cff; font-size: 16px; margin: 0 0 10px;">📞 Contact</h3>
            <div style="font-size: 14px; line-height: 2;">
              <div><span style="color: #6d7f92;">Venue:</span> <strong>${escapeHtml(event.location)}</strong></div>
              ${event.address ? `<div><span style="color: #6d7f92;">Address:</span> <strong>${escapeHtml(event.address)}</strong></div>` : ''}
              <div><span style="color: #6d7f92;">Incharge:</span> <strong>${escapeHtml(event.inchargeName || 'Not assigned')}</strong></div>
              ${event.inchargePhone ? `<div><span style="color: #6d7f92;">Phone:</span> <strong>${escapeHtml(event.inchargePhone)}</strong></div>` : ''}
              ${event.volunteerNames ? `<div><span style="color: #6d7f92;">Volunteers:</span> <strong>${escapeHtml(event.volunteerNames)}</strong></div>` : ''}
            </div>
          </div>
        </div>

        <!-- Bill Table -->
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #3b7cff; color: white;">
              <th style="padding: 12px 16px; text-align: left; font-size: 14px;">Description</th>
              <th style="padding: 12px 16px; text-align: right; font-size: 14px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e7ecf3;">
              <td style="padding: 12px 16px;">${escapeHtml(event.name)} - Event Management Services</td>
              <td style="padding: 12px 16px; text-align: right;">${formattedAmount}</td>
            </tr>
            ${event.volunteerNames ? `
              <tr style="border-bottom: 1px solid #e7ecf3;">
                <td style="padding: 12px 16px; color: #6d7f92;">Volunteer Coordination (${escapeHtml(event.volunteerNames)})</td>
                <td style="padding: 12px 16px; text-align: right; color: #6d7f92;">Included</td>
              </tr>
            ` : ''}
            <tr style="font-weight: 700; font-size: 18px; border-top: 2px solid #3b7cff;">
              <td style="padding: 16px 16px;">TOTAL AMOUNT</td>
              <td style="padding: 16px 16px; text-align: right; color: #3b7cff;">${formattedAmount}</td>
            </tr>
          </tbody>
        </table>

        <!-- Footer -->
        <div style="border-top: 2px solid #e7ecf3; padding-top: 20px; margin-top: 25px; text-align: center; font-size: 12px; color: #9aabba;">
          <p style="margin: 4px 0;"><strong style="color: #1e2b3a;">${escapeHtml(companyName)}</strong> - ${t('invoice.thankyou')}</p>
          <p style="margin: 4px 0;">${t('invoice.generated', { date: new Date().toLocaleString() })}</p>
          <p style="margin: 8px 0 0; font-size: 11px; color: #c0c8d0;">This is a system-generated invoice. For queries, please contact us.</p>
        </div>
      </div>
    `;

    // Create a temporary container
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = invoiceHTML;
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '800px';
    tempContainer.style.background = 'white';
    tempContainer.style.padding = '20px';
    document.body.appendChild(tempContainer);

    // Wait for images to load then generate PDF
    const images = tempContainer.querySelectorAll('img');
    let imagesLoaded = 0;
    const totalImages = images.length;

    function generatePDFFromContainer() {
      const invoiceElement = tempContainer.querySelector('#invoiceContainer');
      
      if (!invoiceElement) {
        document.body.removeChild(tempContainer);
        document.body.removeChild(loadingMsg);
        alert(t('invoice.failed'));
        return;
      }

      // Use html2canvas to capture the invoice
      html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 800,
        height: invoiceElement.scrollHeight + 40
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        let heightLeft = pdfHeight;
        let position = 0;
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Add first page
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
        
        // Add additional pages if needed
        while (heightLeft > 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pageHeight;
        }
        
        // Save the PDF
        pdf.save(`Invoice_${event.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
        
        // Clean up
        document.body.removeChild(tempContainer);
        document.body.removeChild(loadingMsg);
        console.log('✅ Invoice PDF generated successfully!');
      }).catch(err => {
        console.error('html2canvas error:', err);
        document.body.removeChild(tempContainer);
        document.body.removeChild(loadingMsg);
        alert(t('invoice.failed'));
      });
    }

    // Check if all images are loaded
    if (totalImages === 0) {
      // No images, generate immediately
      setTimeout(generatePDFFromContainer, 500);
    } else {
      images.forEach(img => {
        if (img.complete) {
          imagesLoaded++;
          if (imagesLoaded >= totalImages) {
            setTimeout(generatePDFFromContainer, 500);
          }
        } else {
          img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded >= totalImages) {
              setTimeout(generatePDFFromContainer, 500);
            }
          };
          img.onerror = () => {
            imagesLoaded++;
            if (imagesLoaded >= totalImages) {
              setTimeout(generatePDFFromContainer, 500);
            }
          };
        }
      });
    }

    // Fallback: If something goes wrong, try after 10 seconds
    setTimeout(() => {
      if (document.body.contains(tempContainer) && document.body.contains(loadingMsg)) {
        console.warn('Invoice generation taking too long, forcing...');
        document.body.removeChild(tempContainer);
        document.body.removeChild(loadingMsg);
        alert(t('invoice.failed'));
      }
    }, 15000);
  }

  // ============================================
  // Show Event Map
  // ============================================
  function showEventMap(event) {
    const address = event.address || event.location || 'New York, NY';
    
    const modal = document.createElement('div');
    modal.className = 'map-modal active';
    modal.id = 'eventMapModal';
    modal.innerHTML = `
      <div class="map-modal-content">
        <div class="map-modal-header">
          <h3>📍 ${escapeHtml(event.name)}</h3>
          <button class="map-modal-close" onclick="this.closest('.map-modal').remove()"><i class="fas fa-times"></i></button>
        </div>
        <div id="eventMapContainer" style="height:400px; border-radius:12px; overflow:hidden;"></div>
        <div style="margin-top:10px; padding:10px; background:var(--section-bg); border-radius:10px;">
          <p style="margin:0; color:var(--text-medium); font-size:14px;">
            <strong>📍</strong> ${escapeHtml(address)}
          </p>
          ${event.bookieNumber ? `<p style="margin:5px 0 0 0; color:var(--text-muted); font-size:13px;">
            <strong>📞 Bookie:</strong> ${escapeHtml(event.bookieNumber)}
          </p>` : ''}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    setTimeout(() => {
      const container = document.getElementById('eventMapContainer');
      if (!container) return;
      
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const map = L.map(container, { center: [40.7128, -74.0060], zoom: 13 });
      
      const tileLayer = isDark 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      
      L.tileLayer(tileLayer, { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(map);
      
      geocodeAddress(address, (lat, lon) => {
        map.setView([lat, lon], 15);
        L.marker([lat, lon])
          .addTo(map)
          .bindPopup(`<strong>${escapeHtml(event.name)}</strong><br>${escapeHtml(address)}`)
          .openPopup();
      });
      
      setTimeout(() => map.invalidateSize(), 300);
    }, 100);
  }

  // ============================================
  // Templates
  // ============================================
  function saveTemplate() {
    const name = DOM.eventName.value.trim() || 'Untitled Template';
    const template = {
      id: generateId(),
      name,
      location: DOM.eventLocation.value.trim(),
      address: DOM.eventAddress.value.trim(),
      bookieNumber: DOM.bookieNumber.value.trim(),
      time: DOM.eventTime.value,
      ampm: DOM.eventAmPm.value,
      inchargeName: DOM.inchargeName.value.trim(),
      inchargePhone: DOM.inchargePhone.value.trim(),
      volunteerNames: DOM.volunteerNames.value.trim(),
      volunteerPhones: DOM.volunteerPhones.value.trim(),
      payee: DOM.payeeAmount.value.trim(),
      priority: DOM.eventPriority.value,
      eventType: DOM.eventType.value
    };
    
    templates.push(template);
    saveTemplates();
    alert(`✅ Template "${name}" saved!`);
  }

  function loadTemplate() {
    if (templates.length === 0) {
      alert('📭 No templates saved.');
      return;
    }
    
    let msg = '📋 Templates:\n\n';
    templates.forEach((t, i) => {
      msg += `${i+1}. ${t.name}\n   📍 ${t.location || 'No location'}\n\n`;
    });
    msg += 'Enter number to load:';
    
    const choice = prompt(msg);
    if (choice) {
      const idx = parseInt(choice) - 1;
      if (idx >= 0 && idx < templates.length) {
        const t = templates[idx];
        DOM.eventName.value = t.name;
        DOM.eventLocation.value = t.location || '';
        DOM.eventAddress.value = t.address || '';
        DOM.bookieNumber.value = t.bookieNumber || '';
        DOM.eventTime.value = t.time || '';
        DOM.eventAmPm.value = t.ampm || 'PM';
        DOM.inchargeName.value = t.inchargeName || '';
        DOM.inchargePhone.value = t.inchargePhone || '';
        DOM.volunteerNames.value = t.volunteerNames || '';
        DOM.volunteerPhones.value = t.volunteerPhones || '';
        DOM.payeeAmount.value = t.payee || '';
        DOM.eventPriority.value = t.priority || 'Medium';
        DOM.eventType.value = t.eventType || 'General';
        alert(`✅ Template "${t.name}" loaded!`);
      }
    }
  }

  // ============================================
  // Quick Add
  // ============================================
  function quickAdd() {
    const name = prompt('📝 Event name:');
    if (!name || name.trim() === '') return;
    
    const date = DOM.eventDate.value || getTodayString();
    
    const newEvent = {
      id: generateId(),
      name: name.trim(),
      bookedBy: 'Quick Add',
      bookieNumber: '',
      location: 'TBD',
      address: '',
      date: date,
      time: '',
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
    switchTab('events');
  }

  // ============================================
  // Emergency Kit
  // ============================================
  function showEmergencyKit() {
    let msg = '🚨 EMERGENCY KIT\n';
    msg += '═'.repeat(30) + '\n\n';
    msg += `📶 WiFi: ${emergencyKit.wifiName || 'Not set'}\n`;
    msg += `🔑 Password: ${emergencyKit.wifiPassword || 'Not set'}\n\n`;
    msg += `📞 Contact 1: ${emergencyKit.emergencyContact1 || 'Not set'}\n`;
    msg += `📞 Contact 2: ${emergencyKit.emergencyContact2 || 'Not set'}\n\n`;
    msg += `📝 Notes:\n${emergencyKit.venueNotes || 'No notes'}\n`;
    
    const input = prompt(msg + '\n\nUpdate? (Format: WiFi,Password,Contact1,Contact2,Notes)');
    
    if (input && input !== 'null') {
      const parts = input.split(',').map(s => s.trim());
      if (parts.length >= 5) {
        emergencyKit.wifiName = parts[0] || emergencyKit.wifiName;
        emergencyKit.wifiPassword = parts[1] || emergencyKit.wifiPassword;
        emergencyKit.emergencyContact1 = parts[2] || emergencyKit.emergencyContact1;
        emergencyKit.emergencyContact2 = parts[3] || emergencyKit.emergencyContact2;
        emergencyKit.venueNotes = parts.slice(4).join(', ') || emergencyKit.venueNotes;
        saveEmergencyKit();
        alert('✅ Emergency Kit updated!');
      }
    }
  }

  // ============================================
  // Today Events
  // ============================================
  function showTodayEvents() {
    const todayStr = getTodayString();
    const todayEvents = events.filter(ev => ev.date === todayStr);
    
    if (todayEvents.length === 0) {
      alert(t('today.noEvents'));
      return;
    }
    
    let msg = '📌 Today\'s Events:\n\n';
    todayEvents.forEach((ev, i) => {
      msg += `${i+1}. ${getPriorityIcon(ev.priority)} ${ev.name}\n`;
      msg += `   📍 ${ev.location}\n`;
      msg += `   ⏰ ${ev.time || '--:--'} ${ev.ampm || ''}\n`;
      if (ev.inchargeName) msg += `   👤 ${ev.inchargeName}\n`;
      if (ev.bookieNumber) msg += `   📞 ${ev.bookieNumber}\n`;
      msg += '\n';
    });
    alert(msg);
  }

  // ============================================
  // Sample Data
  // ============================================
  function addSampleEvents() {
    const today = getTodayString();
    const future = new Date();
    future.setDate(future.getDate() + 3);
    const futureStr = future.toISOString().split('T')[0];
    
    const samples = [
      {
        id: generateId(),
        name: 'Tech Summit 2026',
        bookedBy: 'Sarah Johnson',
        bookieNumber: '+1 555 9999',
        location: 'Convention Center, SF',
        address: '123 Main St, San Francisco, CA 94105',
        date: today,
        time: '09:30',
        ampm: 'AM',
        inchargeName: 'Mike Chen',
        inchargePhone: '+1 555 7890',
        volunteerNames: 'Alice, Bob, Carol',
        volunteerPhones: '+1 111, +1 222, +1 333',
        payee: '$2,500',
        priority: 'High',
        eventType: 'Conference',
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        name: 'Design Workshop',
        bookedBy: 'Emma Wilson',
        bookieNumber: '+1 555 8888',
        location: 'Studio 5, NY',
        address: '456 Broadway, New York, NY 10012',
        date: futureStr,
        time: '14:00',
        ampm: 'PM',
        inchargeName: 'Alex Rivera',
        inchargePhone: '+1 555 1122',
        volunteerNames: 'David, Eva',
        volunteerPhones: '+1 444, +1 555',
        payee: '$850',
        priority: 'Medium',
        eventType: 'Workshop',
        createdAt: new Date().toISOString()
      }
    ];
    
    samples.forEach(ev => {
      events.push(ev);
      saveEventHistory(ev.id, ev);
    });
    saveAndRender();
  }

  // ============================================
  // Initialization
  // ============================================
  function init() {
    loadAllData();
    
    if (!DOM.eventDate.value) {
      DOM.eventDate.value = getTodayString();
    }
    
    renderEvents();
    updateCounters();
    
    if (events.length === 0) {
      addSampleEvents();
    }
    
    setTimeout(initializeMiniMap, 500);
    
    // --- Tab Navigation ---
    DOM.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        switchTab(tab.dataset.tab);
      });
    });
    
    // --- Profile ---
    DOM.saveProfileBtn.addEventListener('click', saveCompanyProfile);
    
    // --- Add Event ---
    DOM.addBtn.addEventListener('click', addEvent);
    DOM.quickAddBtn.addEventListener('click', quickAdd);
    
    // --- Templates ---
    DOM.templateSaveBtn.addEventListener('click', saveTemplate);
    DOM.templateLoadBtn.addEventListener('click', loadTemplate);
    
    // --- Emergency ---
    DOM.emergencyBtn.addEventListener('click', showEmergencyKit);
    
    // --- Today ---
    DOM.todayBtn.addEventListener('click', showTodayEvents);
    
    // --- Dark Mode ---
    DOM.darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // --- Map Picker ---
    DOM.openMapPickerBtn.addEventListener('click', openMapPicker);
    DOM.closeMapPicker.addEventListener('click', closeMapPicker);
    DOM.confirmLocationBtn.addEventListener('click', confirmLocation);
    
    // Close map picker on outside click
    document.getElementById('mapPickerModal').addEventListener('click', function(e) {
      if (e.target === this) closeMapPicker();
    });
    
    // --- Language ---
    DOM.langToggle.addEventListener('click', toggleLanguageDropdown);
    DOM.langOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        changeLanguage(btn.dataset.lang);
      });
    });
    
    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.language-selector')) {
        DOM.langDropdown.classList.remove('active');
      }
    });
    
    // Enter key support
    DOM.eventName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        DOM.bookedBy.focus();
      }
    });
    
    console.log(`✅ Event Manager Pro v${APP.version} initialized`);
    console.log(`📊 ${events.length} events loaded`);
    console.log(`🌍 Language: ${currentLanguage}`);
  }

  // ============================================
  // Start App
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();