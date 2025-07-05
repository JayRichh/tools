class ToolTOTP extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Load external stylesheet
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '../../styles/tool-totp.css');
    
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="container">
        <div class="main-content">
          <h1>TOTP Generator</h1>
          <p>Generate time-based one-time passwords for two-factor authentication</p>
          
          <div class="totp-generator">
            <div class="input-section">
              <div class="input-group">
                <label for="secret-key">Secret Key</label>
                <div class="input-with-button">
                  <input type="text" id="secret-key" placeholder="Enter your secret key" value="JBSWY3DPEHPK3PXP">
                  <button class="paste-button" id="paste-secret" title="Paste from clipboard">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="settings-row">
                <div class="input-group">
                  <label for="num-digits">Digits</label>
                  <select id="num-digits">
                    <option value="6" selected>6 digits</option>
                    <option value="7">7 digits</option>
                    <option value="8">8 digits</option>
                  </select>
                </div>
                
                <div class="input-group">
                  <label for="period">Period (seconds)</label>
                  <input type="number" id="period" min="15" max="300" value="30">
                </div>
              </div>
            </div>
            
            <div class="token-display">
              <div class="token-container">
                <div class="token-value" id="token-value">------</div>
                <button class="copy-button" id="copy-token" title="Copy to clipboard">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
              
              <div class="progress-section">
                <div class="progress-label">
                  <span>Updating in</span>
                  <span id="countdown">30s</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" id="progress-fill"></div>
                </div>
              </div>
            </div>
            
            <div class="error-message" id="error-message"></div>
          </div>
        </div>
      </div>
    `;
    
    this.shadowRoot.appendChild(linkElem);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  
  connectedCallback() {
    // Get DOM elements
    this.secretKeyInput = this.shadowRoot.getElementById('secret-key');
    this.numDigitsSelect = this.shadowRoot.getElementById('num-digits');
    this.periodInput = this.shadowRoot.getElementById('period');
    this.tokenValue = this.shadowRoot.getElementById('token-value');
    this.copyButton = this.shadowRoot.getElementById('copy-token');
    this.pasteButton = this.shadowRoot.getElementById('paste-secret');
    this.countdown = this.shadowRoot.getElementById('countdown');
    this.progressFill = this.shadowRoot.getElementById('progress-fill');
    this.errorMessage = this.shadowRoot.getElementById('error-message');
    
    // Initialize state
    this.intervalId = null;
    
    // Set up event listeners
    this.secretKeyInput.addEventListener('input', () => this.onSettingsChange());
    this.numDigitsSelect.addEventListener('change', () => this.onSettingsChange());
    this.periodInput.addEventListener('input', () => this.onSettingsChange());
    this.copyButton.addEventListener('click', () => this.copyToken());
    this.pasteButton.addEventListener('click', () => this.pasteSecret());
    this.tokenValue.addEventListener('click', () => this.copyToken());
    
    // Start the TOTP generator
    this.startTOTP();
  }
  
  disconnectedCallback() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  onSettingsChange() {
    this.clearError();
    this.startTOTP();
  }
  
  startTOTP() {
    // Clear existing interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    // Generate initial token
    this.updateToken();
    
    // Set up interval to update every second
    this.intervalId = setInterval(() => {
      this.updateToken();
    }, 1000);
  }
  
  updateToken() {
    try {
      const secret = this.secretKeyInput.value.trim().toUpperCase();
      const digits = parseInt(this.numDigitsSelect.value);
      const period = parseInt(this.periodInput.value);
      
      if (!secret) {
        this.showError('Please enter a secret key');
        return;
      }
      
      if (period < 15 || period > 300) {
        this.showError('Period must be between 15 and 300 seconds');
        return;
      }
      
      // Calculate current time step
      const now = Math.floor(Date.now() / 1000);
      const timeStep = Math.floor(now / period);
      const timeRemaining = period - (now % period);
      
      // Generate TOTP
      const token = this.generateTOTP(secret, timeStep, digits);
      
      // Update UI
      this.tokenValue.textContent = this.formatToken(token, digits);
      this.countdown.textContent = `${timeRemaining}s`;
      
      // Update progress bar
      const progress = (timeRemaining / period) * 100;
      this.progressFill.style.width = `${progress}%`;
      
      // Add animation class when token changes
      if (timeRemaining === period) {
        this.tokenValue.classList.add('token-refresh');
        setTimeout(() => {
          this.tokenValue.classList.remove('token-refresh');
        }, 500);
      }
      
    } catch (error) {
      this.showError('Invalid secret key format');
      console.error('TOTP generation error:', error);
    }
  }
  
  generateTOTP(secret, timeStep, digits) {
    // Decode base32 secret
    const secretBytes = this.base32Decode(secret);
    
    // Convert time step to 8-byte big-endian
    const timeBytes = new ArrayBuffer(8);
    const timeView = new DataView(timeBytes);
    timeView.setUint32(4, timeStep, false); // Big-endian
    
    // Calculate HMAC-SHA1
    const hmac = this.hmacSha1(secretBytes, new Uint8Array(timeBytes));
    
    // Dynamic truncation
    const offset = hmac[hmac.length - 1] & 0x0f;
    const code = ((hmac[offset] & 0x7f) << 24) |
                 ((hmac[offset + 1] & 0xff) << 16) |
                 ((hmac[offset + 2] & 0xff) << 8) |
                 (hmac[offset + 3] & 0xff);
    
    // Generate the final token
    const token = code % Math.pow(10, digits);
    return token.toString().padStart(digits, '0');
  }
  
  base32Decode(base32) {
    const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const bits = [];
    
    // Remove padding and convert to uppercase
    base32 = base32.replace(/=+$/, '').toUpperCase();
    
    // Convert each character to 5 bits
    for (let i = 0; i < base32.length; i++) {
      const char = base32[i];
      const index = base32Chars.indexOf(char);
      if (index === -1) {
        throw new Error(`Invalid base32 character: ${char}`);
      }
      
      const binary = index.toString(2).padStart(5, '0');
      bits.push(binary);
    }
    
    // Convert bits to bytes
    const bitString = bits.join('');
    const bytes = [];
    
    for (let i = 0; i < bitString.length; i += 8) {
      const byte = bitString.slice(i, i + 8);
      if (byte.length === 8) {
        bytes.push(parseInt(byte, 2));
      }
    }
    
    return new Uint8Array(bytes);
  }
  
  hmacSha1(key, data) {
    // HMAC-SHA1 implementation
    const blockSize = 64;
    
    // If key is longer than block size, hash it
    if (key.length > blockSize) {
      key = this.sha1(key);
    }
    
    // Pad key to block size
    const paddedKey = new Uint8Array(blockSize);
    paddedKey.set(key);
    
    // Create inner and outer padded keys
    const innerKey = new Uint8Array(blockSize);
    const outerKey = new Uint8Array(blockSize);
    
    for (let i = 0; i < blockSize; i++) {
      innerKey[i] = paddedKey[i] ^ 0x36;
      outerKey[i] = paddedKey[i] ^ 0x5c;
    }
    
    // Hash inner key + data
    const innerData = new Uint8Array(innerKey.length + data.length);
    innerData.set(innerKey);
    innerData.set(data, innerKey.length);
    const innerHash = this.sha1(innerData);
    
    // Hash outer key + inner hash
    const outerData = new Uint8Array(outerKey.length + innerHash.length);
    outerData.set(outerKey);
    outerData.set(innerHash, outerKey.length);
    
    return this.sha1(outerData);
  }
  
  sha1(data) {
    // SHA-1 implementation
    const h = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];
    
    // Pre-processing
    const msgLength = data.length * 8;
    const paddedData = new Uint8Array(data.length + 1 + ((55 - (data.length % 64)) % 64) + 8);
    paddedData.set(data);
    paddedData[data.length] = 0x80;
    
    // Append length as big-endian 64-bit integer
    const lengthView = new DataView(paddedData.buffer, paddedData.length - 8);
    lengthView.setUint32(4, msgLength, false);
    
    // Process message in 512-bit chunks
    for (let chunkStart = 0; chunkStart < paddedData.length; chunkStart += 64) {
      const w = new Array(80);
      
      // Break chunk into sixteen 32-bit words
      for (let i = 0; i < 16; i++) {
        const offset = chunkStart + i * 4;
        w[i] = (paddedData[offset] << 24) |
               (paddedData[offset + 1] << 16) |
               (paddedData[offset + 2] << 8) |
               paddedData[offset + 3];
      }
      
      // Extend the sixteen 32-bit words into eighty 32-bit words
      for (let i = 16; i < 80; i++) {
        const val = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
        w[i] = (val << 1) | (val >>> 31);
      }
      
      let [a, b, c, d, e] = h;
      
      // Main loop
      for (let i = 0; i < 80; i++) {
        let f, k;
        
        if (i < 20) {
          f = (b & c) | (~b & d);
          k = 0x5A827999;
        } else if (i < 40) {
          f = b ^ c ^ d;
          k = 0x6ED9EBA1;
        } else if (i < 60) {
          f = (b & c) | (b & d) | (c & d);
          k = 0x8F1BBCDC;
        } else {
          f = b ^ c ^ d;
          k = 0xCA62C1D6;
        }
        
        const temp = ((a << 5) | (a >>> 27)) + f + e + k + w[i];
        e = d;
        d = c;
        c = (b << 30) | (b >>> 2);
        b = a;
        a = temp;
      }
      
      // Add this chunk's hash to result
      h[0] = (h[0] + a) & 0xFFFFFFFF;
      h[1] = (h[1] + b) & 0xFFFFFFFF;
      h[2] = (h[2] + c) & 0xFFFFFFFF;
      h[3] = (h[3] + d) & 0xFFFFFFFF;
      h[4] = (h[4] + e) & 0xFFFFFFFF;
    }
    
    // Convert hash to byte array
    const result = new Uint8Array(20);
    for (let i = 0; i < 5; i++) {
      result[i * 4] = (h[i] >>> 24) & 0xFF;
      result[i * 4 + 1] = (h[i] >>> 16) & 0xFF;
      result[i * 4 + 2] = (h[i] >>> 8) & 0xFF;
      result[i * 4 + 3] = h[i] & 0xFF;
    }
    
    return result;
  }
  
  formatToken(token, digits) {
    // Add spaces every 3 digits for readability
    if (digits === 6) {
      return `${token.slice(0, 3)} ${token.slice(3)}`;
    } else if (digits === 8) {
      return `${token.slice(0, 4)} ${token.slice(4)}`;
    }
    return token;
  }
  
  async copyToken() {
    const token = this.tokenValue.textContent.replace(/\s/g, '');
    
    if (token && token !== '------') {
      try {
        await navigator.clipboard.writeText(token);
        this.showNotification('Token copied to clipboard', 'success');
      } catch (err) {
        this.showNotification('Failed to copy token', 'error');
        console.error('Could not copy token: ', err);
      }
    }
  }
  
  async pasteSecret() {
    try {
      const text = await navigator.clipboard.readText();
      this.secretKeyInput.value = text.trim().toUpperCase();
      this.onSettingsChange();
      this.showNotification('Secret pasted from clipboard', 'success');
    } catch (err) {
      this.showNotification('Failed to paste from clipboard', 'error');
      console.error('Could not paste: ', err);
    }
  }
  
  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.style.display = 'block';
    this.tokenValue.textContent = '------';
  }
  
  clearError() {
    this.errorMessage.style.display = 'none';
  }
  
  showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = this.shadowRoot.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    this.shadowRoot.appendChild(notification);
    
    // Show notification
    requestAnimationFrame(() => {
      notification.classList.add('show');
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        notification.classList.remove('show');
        
        // Remove notification after animation
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 3000);
    });
  }
}

customElements.define('tool-totp', ToolTOTP);