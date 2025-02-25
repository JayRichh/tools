class ToolTimezone extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.userOffset = this.getTimezoneOffset(this.userTimezone);
    this.countries = [];
    this.eventDateTime = null;
    this.countdownInterval = null;
    this.timeUpdateInterval = null;
    this.recentEvents = [];
    this.currentEvent = null;

    this.timezoneSayings = [
      "It's always 5 o'clock somewhere",
      "New York never sleeps",
      "When Tokyo works, London sleeps",
      "The sun never sets on the global workday",
      "Time zones: where tomorrow happens today",
      "Time is an illusion, timezone doubly so",
      "Meeting at 9 AM? Which 9 AM?",
      "Time flies, but timezones crawl",
      "Somewhere in the world, it's already Monday",
      "Jet lag: when your body clock disagrees with the wall clock",
      "IST: Indian Standard Time or Israeli Standard Time?",
      "CST: Central, China, or Cuba Standard Time?",
      "EST, EDT, BST, GMT, UTC, PST, PDT, IST, JST, AEST...",
      "Zulu time waits for no one",
      "Military time: where 1500 means 3 PM"
    ];

    this.alternativeTimeUnits = {
      days: ["sols (Mars days)", "sleeps", "sunrises", "rotations", "cycles"],
      hours: ["bells", "military hours", "cycles", "marks"],
      minutes: ["ticks", "moments", "beats", "clicks"],
      seconds: ["instants", "tocks", "blinks", "jiffies"]
    };

    this.timezoneAcronyms = [
      { acronym: "UTC", meaning: "Coordinated Universal Time (formerly GMT)" },
      { acronym: "GMT", meaning: "Greenwich Mean Time" },
      { acronym: "EST", meaning: "Eastern Standard Time (UTC-5)" },
      { acronym: "EDT", meaning: "Eastern Daylight Time (UTC-4)" },
      { acronym: "CST", meaning: "Central Standard Time (UTC-6)" },
      { acronym: "CDT", meaning: "Central Daylight Time (UTC-5)" },
      { acronym: "MST", meaning: "Mountain Standard Time (UTC-7)" },
      { acronym: "MDT", meaning: "Mountain Daylight Time (UTC-6)" },
      { acronym: "PST", meaning: "Pacific Standard Time (UTC-8)" },
      { acronym: "PDT", meaning: "Pacific Daylight Time (UTC-7)" },
      { acronym: "AKST", meaning: "Alaska Standard Time (UTC-9)" },
      { acronym: "AKDT", meaning: "Alaska Daylight Time (UTC-8)" },
      { acronym: "HST", meaning: "Hawaii Standard Time (UTC-10)" },
      { acronym: "IST", meaning: "Indian Standard Time (UTC+5:30)" },
      { acronym: "JST", meaning: "Japan Standard Time (UTC+9)" },
      { acronym: "CST", meaning: "China Standard Time (UTC+8)" },
      { acronym: "AEST", meaning: "Australian Eastern Standard Time (UTC+10)" },
      { acronym: "AEDT", meaning: "Australian Eastern Daylight Time (UTC+11)" },
      { acronym: "ACST", meaning: "Australian Central Standard Time (UTC+9:30)" },
      { acronym: "ACDT", meaning: "Australian Central Daylight Time (UTC+10:30)" },
      { acronym: "AWST", meaning: "Australian Western Standard Time (UTC+8)" },
      { acronym: "BST", meaning: "British Summer Time (UTC+1)" },
      { acronym: "CET", meaning: "Central European Time (UTC+1)" },
      { acronym: "CEST", meaning: "Central European Summer Time (UTC+2)" },
      { acronym: "EET", meaning: "Eastern European Time (UTC+2)" },
      { acronym: "EEST", meaning: "Eastern European Summer Time (UTC+3)" },
      { acronym: "WET", meaning: "Western European Time (UTC+0)" },
      { acronym: "WEST", meaning: "Western European Summer Time (UTC+1)" },
      { acronym: "Z", meaning: "Zulu Time (Military/Aviation for UTC)" }
    ];

    // Load external stylesheet
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '../../styles/tool-timezone.css');
    
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="container">
        <div class="dashboard">
          <!-- Current Time Card -->
          <div class="card">
            <div class="card-header">
              <h2 class="card-title"><span class="card-icon">🕒</span>Current Time</h2>
            </div>
            <div class="card-body">
              <div class="time-info-container">
                <div class="time-display" id="local-time">00:00:00</div>
                <div class="date-display" id="local-date">Loading...</div>
                <div class="timezone-badge">
                  <span class="timezone-name" id="timezone-name">Detecting timezone...</span>
                  <span class="timezone-offset" id="timezone-offset">UTC+00:00</span>
                </div>
              </div>
              
              <div class="section-title">Alternative Time Units</div>
              <div class="alt-units-grid" id="alt-units-list"></div>
            </div>
          </div>
          
          <!-- Event Planner Card -->
          <div class="card">
            <div class="card-header">
              <h2 class="card-title"><span class="card-icon">📅</span>Event Planner</h2>
            </div>
            <div class="card-body">
              <form class="event-form" id="event-form">
                <div class="form-group">
                  <label for="event-name">Event Name</label>
                  <input type="text" id="event-name" placeholder="Meeting, Conference, etc.">
                </div>
                <div class="form-group">
                  <label for="event-date">Date</label>
                  <input type="date" id="event-date">
                </div>
                <div class="form-group">
                  <label for="event-time">Time</label>
                  <input type="time" id="event-time">
                </div>
                <div class="form-group">
                  <label for="event-timezone">Timezone</label>
                  <select id="event-timezone">
                    <option value="">Loading timezones...</option>
                  </select>
                </div>
                <div class="button-container">
                  <button type="submit" id="set-event-btn">Set Event</button>
                </div>
              </form>
              
              <div class="countdown-container hidden" id="countdown-container">
                <div class="countdown-title" id="countdown-title">Time until Event</div>
                <div class="countdown-units">
                  <div class="countdown-unit">
                    <span class="unit-value" id="days-value">0</span>
                    <span class="unit-label">Days</span>
                  </div>
                  <div class="countdown-unit">
                    <span class="unit-value" id="hours-value">0</span>
                    <span class="unit-label">Hours</span>
                  </div>
                  <div class="countdown-unit">
                    <span class="unit-value" id="minutes-value">0</span>
                    <span class="unit-label">Minutes</span>
                  </div>
                  <div class="countdown-unit">
                    <span class="unit-value" id="seconds-value">0</span>
                    <span class="unit-label">Seconds</span>
                  </div>
                </div>
                <div class="event-local-time" id="event-local-time">
                  This event will be at <strong>00:00</strong> your local time
                </div>
              </div>
              
              <div class="section-title">Recent Events</div>
              <div class="recent-events" id="recent-events">
                <div class="no-events">No recent events</div>
              </div>
            </div>
          </div>
          
          <!-- Country Lookup Card -->
          <div class="card">
            <div class="card-header">
              <h2 class="card-title"><span class="card-icon">🌍</span>Country Lookup</h2>
            </div>
            <div class="card-body">
              <div class="search-wrapper">
                <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" class="search-input" id="country-search" placeholder="Search countries...">
              </div>
              
              <div class="countries-list" id="countries-list">
                <div class="country-item">
                  <span class="country-name">Loading countries...</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Reference Card -->
          <div class="card">
            <div class="card-header">
              <h2 class="card-title"><span class="card-icon">📚</span>Reference</h2>
            </div>
            <div class="card-body">
              <div class="reference-section">
                <div>
                  <div class="section-title">Timezone Sayings</div>
                  <div class="sayings-list" id="sayings-list"></div>
                </div>
                
                <div>
                  <div class="section-title">Common Acronyms</div>
                  <div class="acronym-list" id="acronym-list"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    this.shadowRoot.appendChild(linkElem);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  
  connectedCallback() {
    // Get DOM elements
    this.localTimeEl = this.shadowRoot.getElementById('local-time');
    this.localDateEl = this.shadowRoot.getElementById('local-date');
    this.timezoneNameEl = this.shadowRoot.getElementById('timezone-name');
    this.timezoneOffsetEl = this.shadowRoot.getElementById('timezone-offset');
    this.eventForm = this.shadowRoot.getElementById('event-form');
    this.eventNameInput = this.shadowRoot.getElementById('event-name');
    this.eventDateInput = this.shadowRoot.getElementById('event-date');
    this.eventTimeInput = this.shadowRoot.getElementById('event-time');
    this.eventTimezoneSelect = this.shadowRoot.getElementById('event-timezone');
    this.countdownContainer = this.shadowRoot.getElementById('countdown-container');
    this.countdownTitle = this.shadowRoot.getElementById('countdown-title');
    this.daysValueEl = this.shadowRoot.getElementById('days-value');
    this.hoursValueEl = this.shadowRoot.getElementById('hours-value');
    this.minutesValueEl = this.shadowRoot.getElementById('minutes-value');
    this.secondsValueEl = this.shadowRoot.getElementById('seconds-value');
    this.eventLocalTimeEl = this.shadowRoot.getElementById('event-local-time');
    this.countrySearchInput = this.shadowRoot.getElementById('country-search');
    this.countriesList = this.shadowRoot.getElementById('countries-list');
    this.sayingsList = this.shadowRoot.getElementById('sayings-list');
    this.recentEventsContainer = this.shadowRoot.getElementById('recent-events');
    
    // Initialize timezone data
    this.initializeTimezoneData();
    
    // Load saved events
    this.loadSavedEvents();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Start time updates
    this.startTimeUpdates();
    
    // Display random sayings, alternative time units, and acronyms
    this.displayRandomSayings();
    this.displayAlternativeTimeUnits();
    this.displayTimezoneAcronyms();
    
    // Set default event date/time values
    const today = new Date();
    this.eventDateInput.value = today.toISOString().split('T')[0];
    const nextHour = new Date(today.getTime() + 60 * 60 * 1000);
    this.eventTimeInput.value = `${String(nextHour.getHours()).padStart(2, '0')}:${String(nextHour.getMinutes()).padStart(2, '0')}`;
    
    // Load most recent event if available
    if (this.recentEvents.length > 0) {
      this.loadEvent(this.recentEvents[0]);
    }
  }
  
  disconnectedCallback() {
    if (this.timeUpdateInterval) clearInterval(this.timeUpdateInterval);
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }
  
  initializeTimezoneData() {
    this.timezoneNameEl.textContent = this.userTimezone.replace(/_/g, ' ');
    this.timezoneOffsetEl.textContent = this.userOffset;
    fetch('/tools/timezone/countries.json')
      .then(response => response.json())
      .then(data => {
        this.countries = data;
        this.populateCountriesList(data);
        this.populateTimezoneSelect(data);
      })
      .catch(error => {
        console.error('Error loading countries data:', error);
        this.populateTimezoneSelectFallback();
      });
  }
  
  setupEventListeners() {
    this.eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.setEventDateTime();
    });
    
    this.countrySearchInput.addEventListener('input', () => {
      const searchTerm = this.countrySearchInput.value.toLowerCase();
      this.filterCountries(searchTerm);
    });
  }
  
  startTimeUpdates() {
    this.updateLocalTime();
    this.timeUpdateInterval = setInterval(() => this.updateLocalTime(), 1000);
  }
  
  updateLocalTime() {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    this.localTimeEl.textContent = now.toLocaleTimeString(undefined, timeOptions);
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    this.localDateEl.textContent = now.toLocaleDateString(undefined, dateOptions);
    if (this.eventDateTime) this.updateCountdown();
  }
  
  getTimezoneOffset(timezone) {
    const now = new Date();
    const timeString = now.toLocaleString('en-US', { timeZone: timezone, timeZoneName: 'short' });
    const match = timeString.match(/[A-Z]{3,4}$/);
    if (match) return match[0];
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const localDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const diffMinutes = (tzDate - localDate) / 60000;
    const hours = Math.floor(Math.abs(diffMinutes) / 60);
    const minutes = Math.abs(diffMinutes) % 60;
    return `UTC${diffMinutes >= 0 ? '+' : '-'}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  
  populateCountriesList(countries) {
    this.countriesList.innerHTML = '';
    countries.forEach(country => {
      const countryItem = document.createElement('div');
      countryItem.className = 'country-item';
      const nameSpan = document.createElement('span');
      nameSpan.className = 'country-name';
      nameSpan.textContent = country.name;
      const offsetSpan = document.createElement('span');
      offsetSpan.className = 'country-offset';
      offsetSpan.textContent = country.timezone_offset;
      countryItem.appendChild(nameSpan);
      countryItem.appendChild(offsetSpan);
      countryItem.addEventListener('click', () => {
        this.eventTimezoneSelect.value = country.timezone;
      });
      this.countriesList.appendChild(countryItem);
    });
  }
  
  populateTimezoneSelect(countries) {
    this.eventTimezoneSelect.innerHTML = '';
    const userOption = document.createElement('option');
    userOption.value = this.userTimezone;
    userOption.textContent = `${this.userTimezone.replace(/_/g, ' ')} (${this.userOffset})`;
    this.eventTimezoneSelect.appendChild(userOption);
    const separator = document.createElement('option');
    separator.disabled = true;
    separator.textContent = '──────────';
    this.eventTimezoneSelect.appendChild(separator);
    const customTimezones = [
      { name: "Business Hours (NYC)", value: "America/New_York", offset: "UTC-05:00" },
      { name: "Silicon Valley Time", value: "America/Los_Angeles", offset: "UTC-08:00" },
      { name: "London Trading Hours", value: "Europe/London", offset: "UTC+00:00" },
      { name: "Frankfurt Exchange", value: "Europe/Berlin", offset: "UTC+01:00" },
      { name: "Tokyo Market Open", value: "Asia/Tokyo", offset: "UTC+09:00" },
      { name: "Sydney Morning Bell", value: "Australia/Sydney", offset: "UTC+10:00" },
      { name: "Mumbai Business Day", value: "Asia/Kolkata", offset: "UTC+05:30" },
      { name: "Singapore Trading", value: "Asia/Singapore", offset: "UTC+08:00" },
      { name: "Zulu/Military Time", value: "UTC", offset: "UTC+00:00" },
      { name: "International Space Station", value: "UTC", offset: "UTC+00:00" },
      { name: "Internet Time (Swatch .beat)", value: "UTC", offset: "UTC+01:00" },
      { name: "Mars Time (Curiosity Rover)", value: "UTC", offset: "UTC+00:00" },
      { name: "Hawaiian Beach Time", value: "Pacific/Honolulu", offset: "UTC-10:00" },
      { name: "Bollywood Hours", value: "Asia/Kolkata", offset: "UTC+05:30" },
      { name: "Wall Street Opening Bell", value: "America/New_York", offset: "UTC-05:00" },
      { name: "European Central Bank", value: "Europe/Frankfurt", offset: "UTC+01:00" },
      { name: "Silicon Alley (NYC Tech)", value: "America/New_York", offset: "UTC-05:00" },
      { name: "Hollywood Production Time", value: "America/Los_Angeles", offset: "UTC-08:00" },
      { name: "NASDAQ Hours", value: "America/New_York", offset: "UTC-05:00" },
      { name: "Nikkei Trading Hours", value: "Asia/Tokyo", offset: "UTC+09:00" }
    ];
    customTimezones.forEach(tz => {
      const option = document.createElement('option');
      option.value = tz.value;
      option.textContent = `${tz.name} (${tz.offset})`;
      this.eventTimezoneSelect.appendChild(option);
    });
    const separator2 = document.createElement('option');
    separator2.disabled = true;
    separator2.textContent = '──────────';
    this.eventTimezoneSelect.appendChild(separator2);
    const timezones = new Set();
    countries.forEach(country => {
      if (!timezones.has(country.timezone)) {
        timezones.add(country.timezone);
        const option = document.createElement('option');
        option.value = country.timezone;
        option.textContent = `${country.timezone.replace(/_/g, ' ')} (${country.timezone_offset})`;
        this.eventTimezoneSelect.appendChild(option);
      }
    });
    this.eventTimezoneSelect.value = this.userTimezone;
  }
  
  populateTimezoneSelectFallback() {
    this.eventTimezoneSelect.innerHTML = '';
    const userOption = document.createElement('option');
    userOption.value = this.userTimezone;
    userOption.textContent = `${this.userTimezone.replace(/_/g, ' ')} (${this.userOffset})`;
    this.eventTimezoneSelect.appendChild(userOption);
    const separator = document.createElement('option');
    separator.disabled = true;
    separator.textContent = '──────────';
    this.eventTimezoneSelect.appendChild(separator);
    const customTimezones = [
      { name: "Business Hours (NYC)", value: "America/New_York", offset: "UTC-05:00" },
      { name: "Silicon Valley Time", value: "America/Los_Angeles", offset: "UTC-08:00" },
      { name: "London Trading Hours", value: "Europe/London", offset: "UTC+00:00" },
      { name: "Frankfurt Exchange", value: "Europe/Berlin", offset: "UTC+01:00" },
      { name: "Tokyo Market Open", value: "Asia/Tokyo", offset: "UTC+09:00" },
      { name: "Sydney Morning Bell", value: "Australia/Sydney", offset: "UTC+10:00" },
      { name: "Mumbai Business Day", value: "Asia/Kolkata", offset: "UTC+05:30" },
      { name: "Singapore Trading", value: "Asia/Singapore", offset: "UTC+08:00" },
      { name: "Zulu/Military Time", value: "UTC", offset: "UTC+00:00" },
      { name: "International Space Station", value: "UTC", offset: "UTC+00:00" },
      { name: "Internet Time (Swatch .beat)", value: "UTC", offset: "UTC+01:00" },
      { name: "Mars Time (Curiosity Rover)", value: "UTC", offset: "UTC+00:00" },
      { name: "Hawaiian Beach Time", value: "Pacific/Honolulu", offset: "UTC-10:00" },
      { name: "Bollywood Hours", value: "Asia/Kolkata", offset: "UTC+05:30" },
      { name: "Wall Street Opening Bell", value: "America/New_York", offset: "UTC-05:00" },
      { name: "European Central Bank", value: "Europe/Frankfurt", offset: "UTC+01:00" },
      { name: "Silicon Alley (NYC Tech)", value: "America/New_York", offset: "UTC-05:00" },
      { name: "Hollywood Production Time", value: "America/Los_Angeles", offset: "UTC-08:00" },
      { name: "NASDAQ Hours", value: "America/New_York", offset: "UTC-05:00" },
      { name: "Nikkei Trading Hours", value: "Asia/Tokyo", offset: "UTC+09:00" }
    ];
    customTimezones.forEach(tz => {
      const option = document.createElement('option');
      option.value = tz.value;
      option.textContent = `${tz.name} (${tz.offset})`;
      this.eventTimezoneSelect.appendChild(option);
    });
    const separator2 = document.createElement('option');
    separator2.disabled = true;
    separator2.textContent = '──────────';
    this.eventTimezoneSelect.appendChild(separator2);
    const commonTimezones = [
      { name: 'UTC', offset: 'UTC+00:00' },
      { name: 'America/New_York', offset: 'UTC-05:00' },
      { name: 'America/Los_Angeles', offset: 'UTC-08:00' },
      { name: 'Europe/London', offset: 'UTC+00:00' },
      { name: 'Europe/Paris', offset: 'UTC+01:00' },
      { name: 'Asia/Tokyo', offset: 'UTC+09:00' },
      { name: 'Australia/Sydney', offset: 'UTC+10:00' }
    ];
    commonTimezones.forEach(tz => {
      if (tz.name !== this.userTimezone) {
        const option = document.createElement('option');
        option.value = tz.name;
        option.textContent = `${tz.name.replace(/_/g, ' ')} (${tz.offset})`;
        this.eventTimezoneSelect.appendChild(option);
      }
    });
    this.eventTimezoneSelect.value = this.userTimezone;
  }
  
  filterCountries(searchTerm) {
    const filtered = this.countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm) ||
      country.timezone.toLowerCase().includes(searchTerm)
    );
    this.populateCountriesList(filtered);
  }
  
  loadSavedEvents() {
    try {
      const savedEvents = localStorage.getItem('timezone-events');
      if (savedEvents) {
        this.recentEvents = JSON.parse(savedEvents);
        this.displayRecentEvents();
      }
    } catch (error) {
      console.error('Error loading saved events:', error);
      this.recentEvents = [];
    }
  }
  
  saveEvents() {
    try {
      localStorage.setItem('timezone-events', JSON.stringify(this.recentEvents));
    } catch (error) {
      console.error('Error saving events:', error);
    }
  }
  
  displayRecentEvents() {
    this.recentEventsContainer.innerHTML = '';
    
    if (this.recentEvents.length === 0) {
      const noEvents = document.createElement('div');
      noEvents.className = 'no-events';
      noEvents.textContent = 'No recent events';
      this.recentEventsContainer.appendChild(noEvents);
      return;
    }
    
    this.recentEvents.forEach((event, index) => {
      const eventItem = document.createElement('div');
      eventItem.className = 'recent-event-item';
      if (this.currentEvent && this.currentEvent.id === event.id) {
        eventItem.classList.add('active');
      }
      
      const nameEl = document.createElement('div');
      nameEl.className = 'recent-event-name';
      nameEl.textContent = event.name;
      
      const detailsEl = document.createElement('div');
      detailsEl.className = 'recent-event-details';
      
      const dateEl = document.createElement('span');
      dateEl.textContent = new Date(event.dateTime).toLocaleDateString();
      
      const timeEl = document.createElement('span');
      timeEl.className = 'recent-event-time';
      timeEl.textContent = new Date(event.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      detailsEl.appendChild(dateEl);
      detailsEl.appendChild(timeEl);
      
      eventItem.appendChild(nameEl);
      eventItem.appendChild(detailsEl);
      
      eventItem.addEventListener('click', () => {
        this.loadEvent(event);
      });
      
      this.recentEventsContainer.appendChild(eventItem);
    });
  }
  
  loadEvent(event) {
    this.currentEvent = event;
    
    // Update form values
    this.eventNameInput.value = event.name;
    this.eventDateInput.value = event.date;
    this.eventTimeInput.value = event.time;
    this.eventTimezoneSelect.value = event.timezone;
    
    // Set event date time
    this.eventDateTime = new Date(event.dateTime);
    this.eventTimezone = event.timezone;
    
    // Update UI
    this.countdownTitle.textContent = `Time until ${event.name}`;
    this.countdownContainer.classList.remove('hidden');
    this.updateEventLocalTime();
    this.updateCountdown();
    
    // Start countdown
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
    
    // Update active state in recent events list
    this.displayRecentEvents();
  }
  
  setEventDateTime() {
    const eventName = this.eventNameInput.value || 'Event';
    const eventDate = this.eventDateInput.value;
    const eventTime = this.eventTimeInput.value;
    const eventTimezone = this.eventTimezoneSelect.value;
    if (!eventDate || !eventTime || !eventTimezone) {
      alert('Please fill in all event details');
      return;
    }
    
    const eventDateTimeString = `${eventDate}T${eventTime}:00`;
    const eventDateTime = new Date(eventDateTimeString);
    
    // Create event object
    const event = {
      id: Date.now().toString(),
      name: eventName,
      date: eventDate,
      time: eventTime,
      timezone: eventTimezone,
      dateTime: eventDateTime.toISOString()
    };
    
    // Add to recent events
    this.recentEvents.unshift(event);
    
    // Keep only the last 5 events
    if (this.recentEvents.length > 5) {
      this.recentEvents = this.recentEvents.slice(0, 5);
    }
    
    // Save to local storage
    this.saveEvents();
    
    // Load the event
    this.loadEvent(event);
  }
  
  updateCountdown() {
    const now = new Date();
    const diff = this.eventDateTime - now;
    
    // Always show zeros for passed events
    if (diff <= 0) {
      this.daysValueEl.textContent = '0';
      this.hoursValueEl.textContent = '0';
      this.minutesValueEl.textContent = '0';
      this.secondsValueEl.textContent = '0';
      
      // Only add the passed text if it's not already there
      if (!this.countdownTitle.textContent.includes('(Passed)')) {
        this.countdownTitle.textContent += ' (Passed)';
      }
      
      if (this.countdownInterval) clearInterval(this.countdownInterval);
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    this.daysValueEl.textContent = days;
    this.hoursValueEl.textContent = hours;
    this.minutesValueEl.textContent = minutes;
    this.secondsValueEl.textContent = seconds;
  }
  
  updateEventLocalTime() {
    const eventLocal = new Date(this.eventDateTime);
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedTime = eventLocal.toLocaleTimeString(undefined, timeOptions);
    const today = new Date();
    const isToday = today.toDateString() === eventLocal.toDateString();
    let text;
    if (isToday) {
      text = `This event will be at <strong>${formattedTime}</strong> your local time`;
    } else {
      const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
      const formattedDate = eventLocal.toLocaleDateString(undefined, dateOptions);
      text = `This event will be at <strong>${formattedTime}</strong> on <strong>${formattedDate}</strong> your local time`;
    }
    this.eventLocalTimeEl.innerHTML = text;
  }
  
  displayRandomSayings() {
    const shuffled = [...this.timezoneSayings].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    this.sayingsList.innerHTML = '';
    selected.forEach(saying => {
      const div = document.createElement('div');
      div.className = 'saying';
      div.textContent = saying;
      this.sayingsList.appendChild(div);
    });
  }
  
  displayAlternativeTimeUnits() {
    const altUnitsList = this.shadowRoot.getElementById('alt-units-list');
    altUnitsList.innerHTML = '';
    Object.entries(this.alternativeTimeUnits).forEach(([unit, alternatives]) => {
      const container = document.createElement('div');
      container.className = 'alt-unit-item';
      const nameEl = document.createElement('span');
      nameEl.className = 'alt-unit-name';
      nameEl.textContent = unit.charAt(0).toUpperCase() + unit.slice(1) + ':';
      const examplesEl = document.createElement('span');
      examplesEl.className = 'alt-unit-examples';
      examplesEl.textContent = alternatives.join(', ');
      container.appendChild(nameEl);
      container.appendChild(examplesEl);
      altUnitsList.appendChild(container);
    });
  }
  
  displayTimezoneAcronyms() {
    const acronymList = this.shadowRoot.getElementById('acronym-list');
    acronymList.innerHTML = '';
    const shuffled = [...this.timezoneAcronyms].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 8);
    selected.forEach(({ acronym, meaning }) => {
      const item = document.createElement('div');
      item.className = 'acronym-item';
      const acroEl = document.createElement('div');
      acroEl.className = 'acronym';
      acroEl.textContent = acronym;
      const meanEl = document.createElement('div');
      meanEl.className = 'acronym-meaning';
      meanEl.textContent = meaning;
      item.appendChild(acroEl);
      item.appendChild(meanEl);
      acronymList.appendChild(item);
    });
  }
}

customElements.define('tool-timezone', ToolTimezone);
