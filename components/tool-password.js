class ToolPassword extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Load external stylesheet
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '../../styles/tool-password.css');
    
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="container">
        <div class="main-content">
          <h1>Password Generator & Strength Checker</h1>
          <p>Create strong, random passwords and assess their security to reduce vulnerabilities</p>
          
          <div class="password-generator">
            <div class="password-display">
              <div class="password-text" id="password-output">Click Generate to create a password</div>
              <button class="copy-button" id="copy-password" title="Copy to clipboard">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
            
            <div class="options">
              <div class="option-group">
                <div class="length-container">
                  <label for="password-length">Password Length</label>
                  <div class="length-slider">
                    <input type="range" id="password-length" min="8" max="64" value="16">
                    <input type="number" id="password-length-number" min="8" max="64" value="16">
                  </div>
                </div>
                
                <div class="strength-meter">
                  <div class="strength-meter-label">
                    <span>Password Strength</span>
                    <span id="strength-text">Medium</span>
                  </div>
                  <div class="strength-meter-bar">
                    <div class="strength-meter-fill" id="strength-meter-fill"></div>
                  </div>
                </div>
              </div>
              
              <div class="option-group">
                <label>
                  <input type="checkbox" id="include-uppercase" checked>
                  Include Uppercase Letters
                </label>
                <label>
                  <input type="checkbox" id="include-lowercase" checked>
                  Include Lowercase Letters
                </label>
                <label>
                  <input type="checkbox" id="include-numbers" checked>
                  Include Numbers
                </label>
                <label>
                  <input type="checkbox" id="include-symbols" checked>
                  Include Symbols
                </label>
                <label>
                  <input type="checkbox" id="exclude-similar">
                  Exclude Similar Characters (i, l, 1, L, o, 0, O)
                </label>
                <label>
                  <input type="checkbox" id="exclude-ambiguous">
                  Exclude Ambiguous Characters ({}[]()/\\'\\"~,;:.<>)
                </label>
              </div>
            </div>
            
            <div class="button-container">
              <button class="generate-button" id="generate-password">
                <span>🔑</span> Generate Password
              </button>
              <button class="advanced-button" id="advanced-button">
                <span>⚙️</span> Advanced
              </button>
            </div>
            
            <div class="advanced-config" id="advanced-config">
              <h3>Advanced Configuration</h3>
              
              <div class="similar-to-container" id="similar-to-container">
                <!-- Similar to fields will be added here dynamically -->
              </div>
              
              <button class="add-similar-button" id="add-similar-button">
                <span>➕</span> Add "Similar To" Pattern
              </button>
              
              <div class="generation-summary" id="generation-summary">
                <div class="summary-title">
                  <span>📊</span> Generation Summary
                </div>
                
                <div class="summary-section">
                  <h4>Basic Settings</h4>
                  <div class="summary-item">
                    <span class="summary-label">Length:</span>
                    <span class="summary-value" id="summary-length">16</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Strength:</span>
                    <span class="summary-value" id="summary-strength">Medium</span>
                  </div>
                </div>
                
                <div class="summary-section">
                  <h4>Character Sets</h4>
                  <div class="summary-item">
                    <span class="summary-label">Uppercase:</span>
                    <span class="summary-value enabled" id="summary-uppercase">Yes</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Lowercase:</span>
                    <span class="summary-value enabled" id="summary-lowercase">Yes</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Numbers:</span>
                    <span class="summary-value enabled" id="summary-numbers">Yes</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Symbols:</span>
                    <span class="summary-value enabled" id="summary-symbols">Yes</span>
                  </div>
                </div>
                
                <div class="summary-section">
                  <h4>Exclusions</h4>
                  <div class="summary-item">
                    <span class="summary-label">Similar Chars:</span>
                    <span class="summary-value disabled" id="summary-similar">No</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Ambiguous Chars:</span>
                    <span class="summary-value disabled" id="summary-ambiguous">No</span>
                  </div>
                </div>
                
                <div class="summary-section" id="patterns-summary-section">
                  <h4>Patterns</h4>
                  <div id="patterns-summary-container">
                    <div class="summary-item">
                      <span class="summary-label">No patterns added</span>
                    </div>
                  </div>
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
    this.passwordOutput = this.shadowRoot.getElementById('password-output');
    this.copyButton = this.shadowRoot.getElementById('copy-password');
    this.generateButton = this.shadowRoot.getElementById('generate-password');
    this.lengthSlider = this.shadowRoot.getElementById('password-length');
    this.lengthNumber = this.shadowRoot.getElementById('password-length-number');
    this.strengthMeter = this.shadowRoot.getElementById('strength-meter-fill');
    this.strengthText = this.shadowRoot.getElementById('strength-text');
    
    // Advanced configuration elements
    this.advancedButton = this.shadowRoot.getElementById('advanced-button');
    this.advancedConfig = this.shadowRoot.getElementById('advanced-config');
    this.similarToContainer = this.shadowRoot.getElementById('similar-to-container');
    this.addSimilarButton = this.shadowRoot.getElementById('add-similar-button');
    this.generationSummary = this.shadowRoot.getElementById('generation-summary');
    this.patternsSummaryContainer = this.shadowRoot.getElementById('patterns-summary-container');
    
    // Summary elements
    this.summaryLength = this.shadowRoot.getElementById('summary-length');
    this.summaryStrength = this.shadowRoot.getElementById('summary-strength');
    this.summaryUppercase = this.shadowRoot.getElementById('summary-uppercase');
    this.summaryLowercase = this.shadowRoot.getElementById('summary-lowercase');
    this.summaryNumbers = this.shadowRoot.getElementById('summary-numbers');
    this.summarySymbols = this.shadowRoot.getElementById('summary-symbols');
    this.summarySimilar = this.shadowRoot.getElementById('summary-similar');
    this.summaryAmbiguous = this.shadowRoot.getElementById('summary-ambiguous');
    
    // Character set checkboxes
    this.includeUppercase = this.shadowRoot.getElementById('include-uppercase');
    this.includeLowercase = this.shadowRoot.getElementById('include-lowercase');
    this.includeNumbers = this.shadowRoot.getElementById('include-numbers');
    this.includeSymbols = this.shadowRoot.getElementById('include-symbols');
    this.excludeSimilar = this.shadowRoot.getElementById('exclude-similar');
    this.excludeAmbiguous = this.shadowRoot.getElementById('exclude-ambiguous');
    
    // Initialize state
    this.similarToFields = [];
    this.isAdvancedOpen = false;
    
    // Set up event listeners
    this.generateButton.addEventListener('click', () => this.generatePassword());
    this.copyButton.addEventListener('click', () => this.copyPassword());
    
    // Advanced configuration
    this.advancedButton.addEventListener('click', () => this.toggleAdvancedConfig());
    this.addSimilarButton.addEventListener('click', () => this.addSimilarToField());
    
    // Sync length inputs
    this.lengthSlider.addEventListener('input', () => {
      this.lengthNumber.value = this.lengthSlider.value;
      this.updateStrengthMeter();
      this.updateSummary();
    });
    
    this.lengthNumber.addEventListener('input', () => {
      this.lengthSlider.value = this.lengthNumber.value;
      this.updateStrengthMeter();
      this.updateSummary();
    });
    
    // Update strength meter when options change
    const options = [
      this.includeUppercase,
      this.includeLowercase,
      this.includeNumbers,
      this.includeSymbols,
      this.excludeSimilar,
      this.excludeAmbiguous
    ];
    
    options.forEach(option => {
      option.addEventListener('change', () => {
        this.updateStrengthMeter();
        this.validateOptions();
        this.updateSummary();
      });
    });
    
    // Generate initial password
    this.generatePassword();
    
    // Initialize summary
    this.updateSummary();
  }
  
  validateOptions() {
    // Ensure at least one character set is selected
    if (!this.includeUppercase.checked && 
        !this.includeLowercase.checked && 
        !this.includeNumbers.checked && 
        !this.includeSymbols.checked) {
      // If none are selected, default to lowercase
      this.includeLowercase.checked = true;
      this.showNotification('At least one character set must be selected', 'error');
    }
  }
  
  generatePassword() {
    // Check if we have any patterns to use
    const patternField = this.similarToFields.find(field => field.input.value.trim());
    
    if (patternField) {
      // If we have a pattern, use it to generate a similar password
      const pattern = patternField.input.value.trim();
      const similarity = parseInt(patternField.similaritySlider.value) / 100;
      const preserveStructure = parseInt(patternField.preserveSlider.value) / 100;
      
      const password = this.createSimilarPassword(pattern, similarity, preserveStructure);
      
      // Update UI with animation
      this.passwordOutput.textContent = password;
      this.passwordOutput.classList.add('pulse');
      setTimeout(() => this.passwordOutput.classList.remove('pulse'), 500);
      
      // Update strength meter
      this.updateStrengthMeter(password);
      
      // Update summary
      this.updateSummary();
      
      return;
    }
    
    // Otherwise, generate a random password
    const length = parseInt(this.lengthSlider.value);
    
    // Define character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Characters to exclude if options are checked
    const similarChars = 'iIlL1oO0';
    const ambiguousChars = '{}[]()/\\\'"`~,;:.<>';
    
    // Build character set based on options
    let chars = '';
    
    if (this.includeUppercase.checked) {
      chars += uppercaseChars;
    }
    
    if (this.includeLowercase.checked) {
      chars += lowercaseChars;
    }
    
    if (this.includeNumbers.checked) {
      chars += numberChars;
    }
    
    if (this.includeSymbols.checked) {
      chars += symbolChars;
    }
    
    // Remove excluded characters
    if (this.excludeSimilar.checked) {
      for (const char of similarChars) {
        chars = chars.replace(new RegExp(char, 'g'), '');
      }
    }
    
    if (this.excludeAmbiguous.checked) {
      for (const char of ambiguousChars) {
        chars = chars.replace(new RegExp('\\' + char, 'g'), '');
      }
    }
    
    // Generate password
    let password = '';
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
      password += chars.charAt(randomValues[i] % chars.length);
    }
    
    // Ensure password contains at least one character from each selected set
    let validPassword = false;
    
    while (!validPassword) {
      validPassword = true;
      
      if (this.includeUppercase.checked && !/[A-Z]/.test(password)) {
        validPassword = false;
      }
      
      if (this.includeLowercase.checked && !/[a-z]/.test(password)) {
        validPassword = false;
      }
      
      if (this.includeNumbers.checked && !/[0-9]/.test(password)) {
        validPassword = false;
      }
      
      if (this.includeSymbols.checked && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
        validPassword = false;
      }
      
      if (!validPassword) {
        // Regenerate password
        password = '';
        window.crypto.getRandomValues(randomValues);
        
        for (let i = 0; i < length; i++) {
          password += chars.charAt(randomValues[i] % chars.length);
        }
      }
    }
    
    // Update UI with animation
    this.passwordOutput.textContent = password;
    this.passwordOutput.classList.add('pulse');
    setTimeout(() => this.passwordOutput.classList.remove('pulse'), 500);
    
    // Update strength meter
    this.updateStrengthMeter(password);
    
    // Update summary
    this.updateSummary();
  }
  
  copyPassword() {
    const password = this.passwordOutput.textContent;
    
    if (password && password !== 'Click Generate to create a password') {
      navigator.clipboard.writeText(password)
        .then(() => {
          this.showNotification('Password copied to clipboard', 'success');
        })
        .catch(err => {
          this.showNotification('Failed to copy password', 'error');
          console.error('Could not copy password: ', err);
        });
    }
  }
  
  updateStrengthMeter(password = null) {
    // Calculate password strength
    let strength = 0;
    const length = parseInt(this.lengthSlider.value);
    
    // Length contribution (up to 40%)
    strength += Math.min(40, (length / 64) * 40);
    
    // Character set contribution (up to 60%)
    let charSetCount = 0;
    
    if (this.includeUppercase.checked) charSetCount++;
    if (this.includeLowercase.checked) charSetCount++;
    if (this.includeNumbers.checked) charSetCount++;
    if (this.includeSymbols.checked) charSetCount++;
    
    strength += (charSetCount / 4) * 60;
    
    // If we have an actual password, check for patterns
    if (password) {
      // Check for repeating characters
      const repeatingChars = password.match(/(.)\1{2,}/g);
      if (repeatingChars) {
        strength -= repeatingChars.length * 5;
      }
      
      // Check for sequential characters
      const sequentialChars = password.match(/(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/gi);
      if (sequentialChars) {
        strength -= sequentialChars.length * 5;
      }
    }
    
    // Ensure strength is between 0 and 100
    strength = Math.max(0, Math.min(100, strength));
    
    // Update UI
    this.strengthMeter.className = 'strength-meter-fill';
    this.strengthMeter.style.width = `${strength}%`;
    
    if (strength < 20) {
      this.strengthMeter.classList.add('strength-very-weak');
      this.strengthText.textContent = 'Very Weak';
    } else if (strength < 40) {
      this.strengthMeter.classList.add('strength-weak');
      this.strengthText.textContent = 'Weak';
    } else if (strength < 60) {
      this.strengthMeter.classList.add('strength-medium');
      this.strengthText.textContent = 'Medium';
    } else if (strength < 80) {
      this.strengthMeter.classList.add('strength-strong');
      this.strengthText.textContent = 'Strong';
    } else {
      this.strengthMeter.classList.add('strength-very-strong');
      this.strengthText.textContent = 'Very Strong';
    }
  }
  
  toggleAdvancedConfig() {
    this.isAdvancedOpen = !this.isAdvancedOpen;
    
    if (this.isAdvancedOpen) {
      this.advancedConfig.classList.add('show');
      this.advancedButton.classList.add('active');
      this.generationSummary.classList.add('show');
      this.updateSummary();
    } else {
      this.advancedConfig.classList.remove('show');
      this.advancedButton.classList.remove('active');
      this.generationSummary.classList.remove('show');
    }
    
    // Add animation class
    this.advancedConfig.classList.add('fade-in');
    setTimeout(() => {
      this.advancedConfig.classList.remove('fade-in');
    }, 300);
  }
  
  updateSummary() {
    // Update basic settings
    this.summaryLength.textContent = this.lengthSlider.value;
    this.summaryStrength.textContent = this.strengthText.textContent;
    
    // Update character sets
    this.updateSummaryValue(this.summaryUppercase, this.includeUppercase.checked);
    this.updateSummaryValue(this.summaryLowercase, this.includeLowercase.checked);
    this.updateSummaryValue(this.summaryNumbers, this.includeNumbers.checked);
    this.updateSummaryValue(this.summarySymbols, this.includeSymbols.checked);
    
    // Update exclusions
    this.updateSummaryValue(this.summarySimilar, this.excludeSimilar.checked);
    this.updateSummaryValue(this.summaryAmbiguous, this.excludeAmbiguous.checked);
    
    // Update patterns
    this.updatePatternsSummary();
  }
  
  updateSummaryValue(element, isEnabled) {
    if (isEnabled) {
      element.textContent = 'Yes';
      element.classList.add('enabled');
      element.classList.remove('disabled');
    } else {
      element.textContent = 'No';
      element.classList.add('disabled');
      element.classList.remove('enabled');
    }
  }
  
  updatePatternsSummary() {
    this.patternsSummaryContainer.innerHTML = '';
    
    if (this.similarToFields.length === 0) {
      const noPatterns = document.createElement('div');
      noPatterns.className = 'summary-item';
      noPatterns.innerHTML = '<span class="summary-label">No patterns added</span>';
      this.patternsSummaryContainer.appendChild(noPatterns);
      return;
    }
    
    this.similarToFields.forEach((field, index) => {
      const pattern = field.input.value.trim();
      if (!pattern) return;
      
      const similarity = parseInt(field.similaritySlider.value);
      const preserveValue = field.preserveSlider.value;
      const preserveText = this.shadowRoot.getElementById(`preserve-value-${field.id}`).textContent;
      
      const patternSummary = document.createElement('div');
      patternSummary.className = 'pattern-summary';
      
      const header = document.createElement('div');
      header.className = 'pattern-summary-header';
      header.innerHTML = `
        <span>Pattern ${index + 1}</span>
        <span>${similarity}% Similar</span>
      `;
      
      const text = document.createElement('div');
      text.className = 'pattern-summary-text';
      text.textContent = pattern.length > 20 ? pattern.substring(0, 20) + '...' : pattern;
      
      const settings = document.createElement('div');
      settings.className = 'pattern-summary-settings';
      settings.innerHTML = `
        <span>Structure: ${preserveText}</span>
      `;
      
      patternSummary.appendChild(header);
      patternSummary.appendChild(text);
      patternSummary.appendChild(settings);
      
      this.patternsSummaryContainer.appendChild(patternSummary);
    });
  }
  
  addSimilarToField() {
    // Limit to 2 similar-to fields
    if (this.similarToFields.length >= 2) {
      this.showNotification('Maximum of 2 "Similar To" patterns allowed', 'error');
      return;
    }
    
    const fieldId = Date.now().toString();
    const fieldIndex = this.similarToFields.length + 1;
    
    // Create field container
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'similar-to-field fade-in';
    fieldContainer.dataset.id = fieldId;
    
    // Create header
    const header = document.createElement('div');
    header.className = 'similar-to-header';
    
    const title = document.createElement('h4');
    title.textContent = `Pattern ${fieldIndex}`;
    
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-similar-button';
    removeButton.title = 'Remove pattern';
    removeButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    removeButton.addEventListener('click', () => this.removeSimilarToField(fieldId));
    
    header.appendChild(title);
    header.appendChild(removeButton);
    
    // Create input group
    const inputGroup = document.createElement('div');
    inputGroup.className = 'similar-to-input-group';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'similar-to-input';
    input.placeholder = 'Enter a pattern (e.g., "mypassword123")';
    input.id = `similar-input-${fieldId}`;
    
    const regenButton = document.createElement('button');
    regenButton.className = 'regen-button';
    regenButton.title = 'Generate similar password';
    regenButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 2v6h-6"></path>
        <path d="M3 12a9 9 0 0 1 15-6.7l3-3"></path>
        <path d="M3 22v-6h6"></path>
        <path d="M21 12a9 9 0 0 1-15 6.7l-3 3"></path>
      </svg>
    `;
    regenButton.addEventListener('click', () => this.generateSimilarPassword(fieldId));
    
    inputGroup.appendChild(input);
    inputGroup.appendChild(regenButton);
    
    // Create controls
    const controls = document.createElement('div');
    controls.className = 'similar-to-controls';
    
    // Similarity slider
    const similarityGroup = document.createElement('div');
    similarityGroup.className = 'control-group';
    
    const similarityLabel = document.createElement('label');
    similarityLabel.htmlFor = `similarity-${fieldId}`;
    similarityLabel.innerHTML = 'Similarity <span id="similarity-value-' + fieldId + '">50%</span>';
    
    const similaritySlider = document.createElement('input');
    similaritySlider.type = 'range';
    similaritySlider.id = `similarity-${fieldId}`;
    similaritySlider.min = '10';
    similaritySlider.max = '90';
    similaritySlider.value = '50';
    similaritySlider.addEventListener('input', () => {
      const valueEl = this.shadowRoot.getElementById(`similarity-value-${fieldId}`);
      valueEl.textContent = `${similaritySlider.value}%`;
    });
    
    similarityGroup.appendChild(similarityLabel);
    similarityGroup.appendChild(similaritySlider);
    
    // Character preservation slider
    const preserveGroup = document.createElement('div');
    preserveGroup.className = 'control-group';
    
    const preserveLabel = document.createElement('label');
    preserveLabel.htmlFor = `preserve-${fieldId}`;
    preserveLabel.innerHTML = 'Preserve Structure <span id="preserve-value-' + fieldId + '">Medium</span>';
    
    const preserveSlider = document.createElement('input');
    preserveSlider.type = 'range';
    preserveSlider.id = `preserve-${fieldId}`;
    preserveSlider.min = '0';
    preserveSlider.max = '100';
    preserveSlider.value = '50';
    preserveSlider.addEventListener('input', () => {
      const valueEl = this.shadowRoot.getElementById(`preserve-value-${fieldId}`);
      const value = parseInt(preserveSlider.value);
      let text = 'Medium';
      
      if (value < 25) text = 'Low';
      else if (value < 50) text = 'Medium-Low';
      else if (value < 75) text = 'Medium';
      else if (value < 90) text = 'Medium-High';
      else text = 'High';
      
      valueEl.textContent = text;
    });
    
    preserveGroup.appendChild(preserveLabel);
    preserveGroup.appendChild(preserveSlider);
    
    controls.appendChild(similarityGroup);
    controls.appendChild(preserveGroup);
    
    // Assemble field
    fieldContainer.appendChild(header);
    fieldContainer.appendChild(inputGroup);
    fieldContainer.appendChild(controls);
    
    // Add to container
    this.similarToContainer.appendChild(fieldContainer);
    
    // Store field reference
    this.similarToFields.push({
      id: fieldId,
      element: fieldContainer,
      input,
      similaritySlider,
      preserveSlider
    });
    
    // Update add button state
    if (this.similarToFields.length >= 2) {
      this.addSimilarButton.disabled = true;
    }
    
    // Update the summary
    this.updateSummary();
    
    // Focus the input
    setTimeout(() => input.focus(), 100);
    
    // Add event listeners to update summary when input or sliders change
    input.addEventListener('input', () => this.updateSummary());
    similaritySlider.addEventListener('input', () => this.updateSummary());
    preserveSlider.addEventListener('input', () => this.updateSummary());
  }
  
  removeSimilarToField(fieldId) {
    const fieldIndex = this.similarToFields.findIndex(field => field.id === fieldId);
    if (fieldIndex === -1) return;
    
    // Get the field element
    const field = this.similarToFields[fieldIndex];
    
    // Add fade-out animation
    field.element.style.opacity = '0';
    field.element.style.transform = 'translateY(-10px)';
    field.element.style.transition = 'all 0.3s ease';
    
    // Remove after animation
    setTimeout(() => {
      // Remove from DOM
      this.similarToContainer.removeChild(field.element);
      
      // Remove from array
      this.similarToFields.splice(fieldIndex, 1);
      
      // Update remaining field titles
      this.similarToFields.forEach((field, index) => {
        const title = field.element.querySelector('h4');
        title.textContent = `Pattern ${index + 1}`;
      });
      
      // Update add button state
      this.addSimilarButton.disabled = false;
      
      // Update the summary
      this.updateSummary();
    }, 300);
  }
  
  generateSimilarPassword(fieldId) {
    const field = this.similarToFields.find(field => field.id === fieldId);
    if (!field) return;
    
    const pattern = field.input.value.trim();
    if (!pattern) {
      this.showNotification('Please enter a pattern first', 'error');
      field.input.focus();
      return;
    }
    
    const similarity = parseInt(field.similaritySlider.value) / 100;
    const preserveStructure = parseInt(field.preserveSlider.value) / 100;
    
    // Generate a password similar to the pattern
    const password = this.createSimilarPassword(pattern, similarity, preserveStructure);
    
    // Update the password display
    this.passwordOutput.textContent = password;
    this.passwordOutput.classList.add('pulse');
    setTimeout(() => this.passwordOutput.classList.remove('pulse'), 500);
    
    // Update strength meter
    this.updateStrengthMeter(password);
  }
  
  createSimilarPassword(pattern, similarity, preserveStructure) {
    const length = parseInt(this.lengthSlider.value);
    
    // Define character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Characters to exclude if options are checked
    const similarChars = 'iIlL1oO0';
    const ambiguousChars = '{}[]()/\\\'"`~,;:.<>';
    
    // Build character set based on options
    let chars = '';
    
    if (this.includeUppercase.checked) {
      chars += uppercaseChars;
    }
    
    if (this.includeLowercase.checked) {
      chars += lowercaseChars;
    }
    
    if (this.includeNumbers.checked) {
      chars += numberChars;
    }
    
    if (this.includeSymbols.checked) {
      chars += symbolChars;
    }
    
    // Remove excluded characters
    if (this.excludeSimilar.checked) {
      for (const char of similarChars) {
        chars = chars.replace(new RegExp(char, 'g'), '');
      }
    }
    
    if (this.excludeAmbiguous.checked) {
      for (const char of ambiguousChars) {
        chars = chars.replace(new RegExp('\\' + char, 'g'), '');
      }
    }
    
    // Analyze pattern structure
    const patternStructure = this.analyzePattern(pattern);
    
    // Generate password
    let password = '';
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
    
    // Determine how many characters to preserve from the original pattern
    const patternLength = Math.min(pattern.length, length);
    const charsToPreserve = Math.round(patternLength * similarity);
    
    // Create a mask of positions to preserve (1 = preserve, 0 = randomize)
    const preserveMask = Array(patternLength).fill(0);
    
    // Randomly select positions to preserve, weighted by preserveStructure
    // Higher preserveStructure means we try to keep the same character types in the same positions
    for (let i = 0; i < charsToPreserve; i++) {
      let pos;
      
      if (Math.random() < preserveStructure) {
        // Preserve character type (e.g., uppercase, lowercase, number, symbol)
        // Find a position that hasn't been preserved yet
        const availablePositions = preserveMask
          .map((val, idx) => val === 0 ? idx : -1)
          .filter(idx => idx !== -1);
        
        if (availablePositions.length === 0) break;
        
        pos = availablePositions[Math.floor(Math.random() * availablePositions.length)];
      } else {
        // Completely random position
        do {
          pos = Math.floor(Math.random() * patternLength);
        } while (preserveMask[pos] === 1);
      }
      
      preserveMask[pos] = 1;
    }
    
    // Generate the password using the preserve mask
    for (let i = 0; i < length; i++) {
      if (i < patternLength && preserveMask[i] === 1) {
        // Preserve the character from the pattern
        password += pattern[i];
      } else if (i < patternLength && preserveStructure > 0.5) {
        // Try to preserve the character type
        const charType = patternStructure[i] || 'lowercase';
        password += this.getRandomCharOfType(charType, randomValues[i], chars);
      } else {
        // Random character
        password += chars.charAt(randomValues[i] % chars.length);
      }
    }
    
    // Ensure password contains at least one character from each selected set
    let validPassword = false;
    let attempts = 0;
    
    while (!validPassword && attempts < 10) {
      validPassword = true;
      attempts++;
      
      if (this.includeUppercase.checked && !/[A-Z]/.test(password)) {
        validPassword = false;
        // Replace a random character with an uppercase letter
        this.replaceRandomChar(password, uppercaseChars, preserveMask);
      }
      
      if (this.includeLowercase.checked && !/[a-z]/.test(password)) {
        validPassword = false;
        // Replace a random character with a lowercase letter
        this.replaceRandomChar(password, lowercaseChars, preserveMask);
      }
      
      if (this.includeNumbers.checked && !/[0-9]/.test(password)) {
        validPassword = false;
        // Replace a random character with a number
        this.replaceRandomChar(password, numberChars, preserveMask);
      }
      
      if (this.includeSymbols.checked && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
        validPassword = false;
        // Replace a random character with a symbol
        this.replaceRandomChar(password, symbolChars, preserveMask);
      }
    }
    
    return password;
  }
  
  analyzePattern(pattern) {
    // Analyze the pattern to determine the character type at each position
    const structure = [];
    
    for (let i = 0; i < pattern.length; i++) {
      const char = pattern[i];
      
      if (/[A-Z]/.test(char)) {
        structure[i] = 'uppercase';
      } else if (/[a-z]/.test(char)) {
        structure[i] = 'lowercase';
      } else if (/[0-9]/.test(char)) {
        structure[i] = 'number';
      } else {
        structure[i] = 'symbol';
      }
    }
    
    return structure;
  }
  
  getRandomCharOfType(type, randomValue, chars) {
    // Get a random character of the specified type
    let charSet = '';
    
    switch (type) {
      case 'uppercase':
        charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        break;
      case 'lowercase':
        charSet = 'abcdefghijklmnopqrstuvwxyz';
        break;
      case 'number':
        charSet = '0123456789';
        break;
      case 'symbol':
        charSet = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        break;
      default:
        charSet = chars;
    }
    
    // Apply exclusions
    if (this.excludeSimilar.checked) {
      const similarChars = 'iIlL1oO0';
      for (const char of similarChars) {
        charSet = charSet.replace(new RegExp(char, 'g'), '');
      }
    }
    
    if (this.excludeAmbiguous.checked && type === 'symbol') {
      const ambiguousChars = '{}[]()/\\\'"`~,;:.<>';
      for (const char of ambiguousChars) {
        charSet = charSet.replace(new RegExp('\\' + char, 'g'), '');
      }
    }
    
    // If the character set is empty after exclusions, fall back to the full set
    if (charSet.length === 0) {
      charSet = chars;
    }
    
    return charSet.charAt(randomValue % charSet.length);
  }
  
  replaceRandomChar(password, charSet, preserveMask) {
    // Find positions that are not preserved
    const availablePositions = [];
    for (let i = 0; i < password.length; i++) {
      if (!preserveMask || i >= preserveMask.length || preserveMask[i] === 0) {
        availablePositions.push(i);
      }
    }
    
    if (availablePositions.length === 0) return password;
    
    // Choose a random position
    const pos = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    
    // Replace the character
    const randomChar = charSet.charAt(Math.floor(Math.random() * charSet.length));
    return password.substring(0, pos) + randomChar + password.substring(pos + 1);
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

customElements.define('tool-password', ToolPassword);
