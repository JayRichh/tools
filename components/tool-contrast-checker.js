class ToolContrastChecker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Load external stylesheet
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '../../styles/tool-contrast-checker.css');
    
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="container">
        <div class="main-content">
          <h1>Color Contrast Checker</h1>
          <p>Verify that your color choices meet accessibility standards (WCAG)</p>
          
          <div class="contrast-checker">
            <div class="color-selection-panel">
              <h2>Color Selection</h2>
              
              <div class="color-panel">
                <h3>Foreground Color (Text)</h3>
                <div class="color-preview" id="foreground-preview">
                  <div class="color-preview-inner" id="foreground-preview-inner">#000000</div>
                </div>
                
                <div class="color-input-methods">
                  <div class="color-input-method">
                    <div class="color-input-group">
                      <label for="foreground-color-picker">Color Picker</label>
                      <input type="color" id="foreground-color-picker" value="#000000">
                    </div>
                    
                    <div class="color-input-group">
                      <label for="foreground-hex-input">HEX</label>
                      <input type="text" id="foreground-hex-input" placeholder="#000000" value="#000000">
                    </div>
                  </div>
                  
                  <div class="color-input-method">
                    <div class="slider-inputs">
                      <div class="slider-input">
                        <label for="foreground-r-slider">R</label>
                        <input type="range" id="foreground-r-slider" min="0" max="255" value="0" class="color-slider red-slider">
                        <input type="number" id="foreground-r-input" min="0" max="255" value="0">
                      </div>
                      
                      <div class="slider-input">
                        <label for="foreground-g-slider">G</label>
                        <input type="range" id="foreground-g-slider" min="0" max="255" value="0" class="color-slider green-slider">
                        <input type="number" id="foreground-g-input" min="0" max="255" value="0">
                      </div>
                      
                      <div class="slider-input">
                        <label for="foreground-b-slider">B</label>
                        <input type="range" id="foreground-b-slider" min="0" max="255" value="0" class="color-slider blue-slider">
                        <input type="number" id="foreground-b-input" min="0" max="255" value="0">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="color-panel">
                <h3>Background Color</h3>
                <div class="color-preview" id="background-preview">
                  <div class="color-preview-inner" id="background-preview-inner">#FFFFFF</div>
                </div>
                
                <div class="color-input-methods">
                  <div class="color-input-method">
                    <div class="color-input-group">
                      <label for="background-color-picker">Color Picker</label>
                      <input type="color" id="background-color-picker" value="#FFFFFF">
                    </div>
                    
                    <div class="color-input-group">
                      <label for="background-hex-input">HEX</label>
                      <input type="text" id="background-hex-input" placeholder="#FFFFFF" value="#FFFFFF">
                    </div>
                  </div>
                  
                  <div class="color-input-method">
                    <div class="slider-inputs">
                      <div class="slider-input">
                        <label for="background-r-slider">R</label>
                        <input type="range" id="background-r-slider" min="0" max="255" value="255" class="color-slider red-slider">
                        <input type="number" id="background-r-input" min="0" max="255" value="255">
                      </div>
                      
                      <div class="slider-input">
                        <label for="background-g-slider">G</label>
                        <input type="range" id="background-g-slider" min="0" max="255" value="255" class="color-slider green-slider">
                        <input type="number" id="background-g-input" min="0" max="255" value="255">
                      </div>
                      
                      <div class="slider-input">
                        <label for="background-b-slider">B</label>
                        <input type="range" id="background-b-slider" min="0" max="255" value="255" class="color-slider blue-slider">
                        <input type="number" id="background-b-input" min="0" max="255" value="255">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button id="swap-colors-btn" class="action-button">Swap Colors</button>
            </div>
            
            <div class="contrast-results-panel">
              <h2>Contrast Results</h2>
              
              <div class="contrast-preview" id="contrast-preview">
                <div class="contrast-preview-text">
                  <div class="contrast-preview-text-large">Large Text (18pt+)</div>
                  <div class="contrast-preview-text-normal">Normal Text (16px)</div>
                  <div class="contrast-preview-text-small">Small Text (14px)</div>
                </div>
              </div>
              
              <div class="contrast-ratio-display">
                <div class="contrast-ratio-value" id="contrast-ratio">21:1</div>
                <div class="contrast-ratio-label">Contrast Ratio</div>
              </div>
              
              <div class="wcag-results">
                <div class="wcag-result">
                  <div class="wcag-result-label">WCAG AA (Normal Text)</div>
                  <div class="wcag-result-value pass" id="wcag-aa-normal">PASS</div>
                  <div class="wcag-result-description">Minimum ratio of 4.5:1</div>
                </div>
                
                <div class="wcag-result">
                  <div class="wcag-result-label">WCAG AA (Large Text)</div>
                  <div class="wcag-result-value pass" id="wcag-aa-large">PASS</div>
                  <div class="wcag-result-description">Minimum ratio of 3:1</div>
                </div>
                
                <div class="wcag-result">
                  <div class="wcag-result-label">WCAG AAA (Normal Text)</div>
                  <div class="wcag-result-value pass" id="wcag-aaa-normal">PASS</div>
                  <div class="wcag-result-description">Minimum ratio of 7:1</div>
                </div>
                
                <div class="wcag-result">
                  <div class="wcag-result-label">WCAG AAA (Large Text)</div>
                  <div class="wcag-result-value pass" id="wcag-aaa-large">PASS</div>
                  <div class="wcag-result-description">Minimum ratio of 4.5:1</div>
                </div>
              </div>
              
              <div class="color-suggestions" id="color-suggestions">
                <div class="color-suggestions-header">
                  <h3>Suggested Alternatives</h3>
                </div>
                <div class="color-suggestion-list" id="color-suggestion-list">
                  <!-- Suggestions will be added dynamically -->
                </div>
              </div>
              
              <div class="color-blindness-preview">
                <div class="color-blindness-header">
                  <h3>Color Blindness Simulation</h3>
                </div>
                <div class="color-blindness-options">
                  <div class="color-blindness-option">
                    <div class="color-blindness-preview-box" id="protanopia-preview"></div>
                    <div class="color-blindness-label">Protanopia</div>
                  </div>
                  
                  <div class="color-blindness-option">
                    <div class="color-blindness-preview-box" id="deuteranopia-preview"></div>
                    <div class="color-blindness-label">Deuteranopia</div>
                  </div>
                  
                  <div class="color-blindness-option">
                    <div class="color-blindness-preview-box" id="tritanopia-preview"></div>
                    <div class="color-blindness-label">Tritanopia</div>
                  </div>
                  
                  <div class="color-blindness-option">
                    <div class="color-blindness-preview-box" id="grayscale-preview"></div>
                    <div class="color-blindness-label">Grayscale</div>
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
    // Initialize DOM references
    this.initDomReferences();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initialize with default values
    this.updateContrastCheck();
    this.updateColorBlindnessSimulation();
    this.generateColorSuggestions();
  }
  
  initDomReferences() {
    // Foreground color elements
    this.foregroundPreview = this.shadowRoot.getElementById('foreground-preview');
    this.foregroundPreviewInner = this.shadowRoot.getElementById('foreground-preview-inner');
    this.foregroundColorPicker = this.shadowRoot.getElementById('foreground-color-picker');
    this.foregroundHexInput = this.shadowRoot.getElementById('foreground-hex-input');
    
    // Foreground RGB sliders and inputs
    this.foregroundRSlider = this.shadowRoot.getElementById('foreground-r-slider');
    this.foregroundGSlider = this.shadowRoot.getElementById('foreground-g-slider');
    this.foregroundBSlider = this.shadowRoot.getElementById('foreground-b-slider');
    this.foregroundRInput = this.shadowRoot.getElementById('foreground-r-input');
    this.foregroundGInput = this.shadowRoot.getElementById('foreground-g-input');
    this.foregroundBInput = this.shadowRoot.getElementById('foreground-b-input');
    
    // Background color elements
    this.backgroundPreview = this.shadowRoot.getElementById('background-preview');
    this.backgroundPreviewInner = this.shadowRoot.getElementById('background-preview-inner');
    this.backgroundColorPicker = this.shadowRoot.getElementById('background-color-picker');
    this.backgroundHexInput = this.shadowRoot.getElementById('background-hex-input');
    
    // Background RGB sliders and inputs
    this.backgroundRSlider = this.shadowRoot.getElementById('background-r-slider');
    this.backgroundGSlider = this.shadowRoot.getElementById('background-g-slider');
    this.backgroundBSlider = this.shadowRoot.getElementById('background-b-slider');
    this.backgroundRInput = this.shadowRoot.getElementById('background-r-input');
    this.backgroundGInput = this.shadowRoot.getElementById('background-g-input');
    this.backgroundBInput = this.shadowRoot.getElementById('background-b-input');
    
    // Contrast preview elements
    this.contrastPreview = this.shadowRoot.getElementById('contrast-preview');
    this.contrastRatio = this.shadowRoot.getElementById('contrast-ratio');
    
    // WCAG result elements
    this.wcagAaNormal = this.shadowRoot.getElementById('wcag-aa-normal');
    this.wcagAaLarge = this.shadowRoot.getElementById('wcag-aa-large');
    this.wcagAaaNormal = this.shadowRoot.getElementById('wcag-aaa-normal');
    this.wcagAaaLarge = this.shadowRoot.getElementById('wcag-aaa-large');
    
    // Color blindness preview elements
    this.protanopiaPreview = this.shadowRoot.getElementById('protanopia-preview');
    this.deuteranopiaPreview = this.shadowRoot.getElementById('deuteranopia-preview');
    this.tritanopiaPreview = this.shadowRoot.getElementById('tritanopia-preview');
    this.grayscalePreview = this.shadowRoot.getElementById('grayscale-preview');
    
    // Color suggestions
    this.colorSuggestionList = this.shadowRoot.getElementById('color-suggestion-list');
    
    // Swap colors button
    this.swapColorsBtn = this.shadowRoot.getElementById('swap-colors-btn');
  }
  
  setupEventListeners() {
    // Foreground color picker
    this.foregroundColorPicker.addEventListener('input', () => {
      this.updateFromForegroundHex(this.foregroundColorPicker.value);
    });
    
    // Foreground hex input
    this.foregroundHexInput.addEventListener('input', () => {
      const hex = this.foregroundHexInput.value;
      if (this.isValidHex(hex)) {
        this.updateFromForegroundHex(hex);
      }
    });
    
    this.foregroundHexInput.addEventListener('blur', () => {
      const hex = this.foregroundHexInput.value;
      if (!this.isValidHex(hex)) {
        this.foregroundHexInput.value = this.foregroundColorPicker.value;
      }
    });
    
    // Foreground RGB sliders and inputs
    this.setupRgbControls(
      this.foregroundRSlider, this.foregroundRInput,
      this.foregroundGSlider, this.foregroundGInput,
      this.foregroundBSlider, this.foregroundBInput,
      (r, g, b) => this.updateFromForegroundRgb(r, g, b)
    );
    
    // Background color picker
    this.backgroundColorPicker.addEventListener('input', () => {
      this.updateFromBackgroundHex(this.backgroundColorPicker.value);
    });
    
    // Background hex input
    this.backgroundHexInput.addEventListener('input', () => {
      const hex = this.backgroundHexInput.value;
      if (this.isValidHex(hex)) {
        this.updateFromBackgroundHex(hex);
      }
    });
    
    this.backgroundHexInput.addEventListener('blur', () => {
      const hex = this.backgroundHexInput.value;
      if (!this.isValidHex(hex)) {
        this.backgroundHexInput.value = this.backgroundColorPicker.value;
      }
    });
    
    // Background RGB sliders and inputs
    this.setupRgbControls(
      this.backgroundRSlider, this.backgroundRInput,
      this.backgroundGSlider, this.backgroundGInput,
      this.backgroundBSlider, this.backgroundBInput,
      (r, g, b) => this.updateFromBackgroundRgb(r, g, b)
    );
    
    // Swap colors button
    this.swapColorsBtn.addEventListener('click', () => {
      this.swapColors();
    });
  }
  
  setupRgbControls(rSlider, rInput, gSlider, gInput, bSlider, bInput, updateCallback) {
    // Connect RGB sliders to inputs
    const updateFromSliders = () => {
      const r = parseInt(rSlider.value);
      const g = parseInt(gSlider.value);
      const b = parseInt(bSlider.value);
      
      rInput.value = r;
      gInput.value = g;
      bInput.value = b;
      
      updateCallback(r, g, b);
    };
    
    const updateFromInputs = () => {
      const r = parseInt(rInput.value) || 0;
      const g = parseInt(gInput.value) || 0;
      const b = parseInt(bInput.value) || 0;
      
      rSlider.value = r;
      gSlider.value = g;
      bSlider.value = b;
      
      updateCallback(r, g, b);
    };
    
    // Add event listeners
    rSlider.addEventListener('input', updateFromSliders);
    gSlider.addEventListener('input', updateFromSliders);
    bSlider.addEventListener('input', updateFromSliders);
    
    rInput.addEventListener('input', updateFromInputs);
    gInput.addEventListener('input', updateFromInputs);
    bInput.addEventListener('input', updateFromInputs);
  }
  
  updateFromForegroundHex(hex) {
    // Update color picker and hex input
    this.foregroundColorPicker.value = hex;
    this.foregroundHexInput.value = hex;
    
    // Update preview
    this.foregroundPreview.style.backgroundColor = hex;
    this.foregroundPreviewInner.textContent = hex.toUpperCase();
    this.foregroundPreviewInner.style.color = this.getContrastColor(hex);
    
    // Convert to RGB and update sliders/inputs
    const rgb = this.hexToRgb(hex);
    this.foregroundRSlider.value = rgb.r;
    this.foregroundGSlider.value = rgb.g;
    this.foregroundBSlider.value = rgb.b;
    this.foregroundRInput.value = rgb.r;
    this.foregroundGInput.value = rgb.g;
    this.foregroundBInput.value = rgb.b;
    
    // Update contrast check
    this.updateContrastCheck();
    this.updateColorBlindnessSimulation();
    this.generateColorSuggestions();
  }
  
  updateFromForegroundRgb(r, g, b) {
    // Clamp values
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    
    // Convert to hex
    const hex = this.rgbToHex(r, g, b);
    
    // Update color picker and hex input
    this.foregroundColorPicker.value = hex;
    this.foregroundHexInput.value = hex;
    
    // Update preview
    this.foregroundPreview.style.backgroundColor = hex;
    this.foregroundPreviewInner.textContent = hex.toUpperCase();
    this.foregroundPreviewInner.style.color = this.getContrastColor(hex);
    
    // Update contrast check
    this.updateContrastCheck();
    this.updateColorBlindnessSimulation();
    this.generateColorSuggestions();
  }
  
  updateFromBackgroundHex(hex) {
    // Update color picker and hex input
    this.backgroundColorPicker.value = hex;
    this.backgroundHexInput.value = hex;
    
    // Update preview
    this.backgroundPreview.style.backgroundColor = hex;
    this.backgroundPreviewInner.textContent = hex.toUpperCase();
    this.backgroundPreviewInner.style.color = this.getContrastColor(hex);
    
    // Convert to RGB and update sliders/inputs
    const rgb = this.hexToRgb(hex);
    this.backgroundRSlider.value = rgb.r;
    this.backgroundGSlider.value = rgb.g;
    this.backgroundBSlider.value = rgb.b;
    this.backgroundRInput.value = rgb.r;
    this.backgroundGInput.value = rgb.g;
    this.backgroundBInput.value = rgb.b;
    
    // Update contrast check
    this.updateContrastCheck();
    this.updateColorBlindnessSimulation();
    this.generateColorSuggestions();
  }
  
  updateFromBackgroundRgb(r, g, b) {
    // Clamp values
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    
    // Convert to hex
    const hex = this.rgbToHex(r, g, b);
    
    // Update color picker and hex input
    this.backgroundColorPicker.value = hex;
    this.backgroundHexInput.value = hex;
    
    // Update preview
    this.backgroundPreview.style.backgroundColor = hex;
    this.backgroundPreviewInner.textContent = hex.toUpperCase();
    this.backgroundPreviewInner.style.color = this.getContrastColor(hex);
    
    // Update contrast check
    this.updateContrastCheck();
    this.updateColorBlindnessSimulation();
    this.generateColorSuggestions();
  }
  
  swapColors() {
    // Get current colors
    const foregroundHex = this.foregroundColorPicker.value;
    const backgroundHex = this.backgroundColorPicker.value;
    
    // Swap colors
    this.updateFromForegroundHex(backgroundHex);
    this.updateFromBackgroundHex(foregroundHex);
    
    this.showNotification('Colors swapped');
  }
  
  updateContrastCheck() {
    const foregroundColor = this.foregroundColorPicker.value;
    const backgroundColor = this.backgroundColorPicker.value;
    
    // Update contrast preview
    this.contrastPreview.style.backgroundColor = backgroundColor;
    this.contrastPreview.style.color = foregroundColor;
    
    // Calculate contrast ratio
    const ratio = this.calculateContrastRatio(foregroundColor, backgroundColor);
    const formattedRatio = ratio.toFixed(2);
    this.contrastRatio.textContent = `${formattedRatio}:1`;
    
    // Update WCAG results
    this.updateWcagResults(ratio);
  }
  
  updateWcagResults(ratio) {
    // WCAG AA (Normal Text) - 4.5:1
    if (ratio >= 4.5) {
      this.wcagAaNormal.textContent = 'PASS';
      this.wcagAaNormal.className = 'wcag-result-value pass';
    } else {
      this.wcagAaNormal.textContent = 'FAIL';
      this.wcagAaNormal.className = 'wcag-result-value fail';
    }
    
    // WCAG AA (Large Text) - 3:1
    if (ratio >= 3) {
      this.wcagAaLarge.textContent = 'PASS';
      this.wcagAaLarge.className = 'wcag-result-value pass';
    } else {
      this.wcagAaLarge.textContent = 'FAIL';
      this.wcagAaLarge.className = 'wcag-result-value fail';
    }
    
    // WCAG AAA (Normal Text) - 7:1
    if (ratio >= 7) {
      this.wcagAaaNormal.textContent = 'PASS';
      this.wcagAaaNormal.className = 'wcag-result-value pass';
    } else {
      this.wcagAaaNormal.textContent = 'FAIL';
      this.wcagAaaNormal.className = 'wcag-result-value fail';
    }
    
    // WCAG AAA (Large Text) - 4.5:1
    if (ratio >= 4.5) {
      this.wcagAaaLarge.textContent = 'PASS';
      this.wcagAaaLarge.className = 'wcag-result-value pass';
    } else {
      this.wcagAaaLarge.textContent = 'FAIL';
      this.wcagAaaLarge.className = 'wcag-result-value fail';
    }
  }
  
  updateColorBlindnessSimulation() {
    const foregroundColor = this.foregroundColorPicker.value;
    const backgroundColor = this.backgroundColorPicker.value;
    
    // Apply color blindness filters
    // Note: In a real implementation, we would use actual color blindness simulation algorithms
    // For this demo, we'll use simplified approximations
    
    // Protanopia (red-blind)
    this.protanopiaPreview.style.backgroundColor = this.simulateProtanopia(backgroundColor);
    this.protanopiaPreview.style.color = this.simulateProtanopia(foregroundColor);
    this.protanopiaPreview.textContent = 'Aa';
    
    // Deuteranopia (green-blind)
    this.deuteranopiaPreview.style.backgroundColor = this.simulateDeuteranopia(backgroundColor);
    this.deuteranopiaPreview.style.color = this.simulateDeuteranopia(foregroundColor);
    this.deuteranopiaPreview.textContent = 'Aa';
    
    // Tritanopia (blue-blind)
    this.tritanopiaPreview.style.backgroundColor = this.simulateTritanopia(backgroundColor);
    this.tritanopiaPreview.style.color = this.simulateTritanopia(foregroundColor);
    this.tritanopiaPreview.textContent = 'Aa';
    
    // Grayscale
    this.grayscalePreview.style.backgroundColor = this.simulateGrayscale(backgroundColor);
    this.grayscalePreview.style.color = this.simulateGrayscale(foregroundColor);
    this.grayscalePreview.textContent = 'Aa';
  }
  
  generateColorSuggestions() {
    // Clear existing suggestions
    this.colorSuggestionList.innerHTML = '';
    
    const foregroundColor = this.foregroundColorPicker.value;
    const backgroundColor = this.backgroundColorPicker.value;
    const ratio = this.calculateContrastRatio(foregroundColor, backgroundColor);
    
    // Only generate suggestions if the contrast ratio is below WCAG AA (4.5:1)
    if (ratio >= 4.5) {
      const message = document.createElement('div');
      message.textContent = 'Current colors meet WCAG AA standards.';
      message.style.padding = '0.5rem';
      this.colorSuggestionList.appendChild(message);
      return;
    }
    
    // Generate suggestions by adjusting the foreground color
    const suggestions = this.generateSuggestions(foregroundColor, backgroundColor);
    
    suggestions.forEach(suggestion => {
      const suggestionElement = document.createElement('div');
      suggestionElement.className = 'color-suggestion';
      
      const swatch = document.createElement('div');
      swatch.className = 'color-suggestion-swatch';
      swatch.style.backgroundColor = suggestion.color;
      
      const value = document.createElement('div');
      value.className = 'color-suggestion-value';
      value.textContent = suggestion.color.toUpperCase();
      
      suggestionElement.appendChild(swatch);
      suggestionElement.appendChild(value);
      
      // Add click event to apply the suggestion
      suggestionElement.addEventListener('click', () => {
        this.updateFromForegroundHex(suggestion.color);
        this.showNotification('Color applied');
      });
      
      this.colorSuggestionList.appendChild(suggestionElement);
    });
  }
  
  generateSuggestions(foregroundColor, backgroundColor) {
    const suggestions = [];
    const fgRgb = this.hexToRgb(foregroundColor);
    const bgRgb = this.hexToRgb(backgroundColor);
    
    // Determine if we should darken or lighten the foreground color
    const fgLuminance = this.calculateRelativeLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
    const bgLuminance = this.calculateRelativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
    
    const shouldDarken = fgLuminance > bgLuminance;
    
    // Generate variations
    for (let i = 1; i <= 5; i++) {
      let newRgb;
      
      if (shouldDarken) {
        // Darken the foreground color
        newRgb = {
          r: Math.max(0, fgRgb.r - i * 30),
          g: Math.max(0, fgRgb.g - i * 30),
          b: Math.max(0, fgRgb.b - i * 30)
        };
      } else {
        // Lighten the foreground color
        newRgb = {
          r: Math.min(255, fgRgb.r + i * 30),
          g: Math.min(255, fgRgb.g + i * 30),
          b: Math.min(255, fgRgb.b + i * 30)
        };
      }
      
      const newColor = this.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
      const newRatio = this.calculateContrastRatio(newColor, backgroundColor);
      
      if (newRatio >= 4.5) {
        suggestions.push({
          color: newColor,
          ratio: newRatio
        });
      }
    }
    
    // Add some hue variations
    const fgHsl = this.rgbToHsl(fgRgb.r, fgRgb.g, fgRgb.b);
    
    for (let i = 1; i <= 3; i++) {
      // Adjust hue
      const newHue = (fgHsl.h + i * 30) % 360;
      
      // Adjust saturation and lightness for better contrast
      let newSat = fgHsl.s;
      let newLight = shouldDarken ? Math.max(0, fgHsl.l - i * 10) : Math.min(100, fgHsl.l + i * 10);
      
      const newRgb = this.hslToRgb(newHue, newSat, newLight);
      const newColor = this.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
      const newRatio = this.calculateContrastRatio(newColor, backgroundColor);
      
      if (newRatio >= 4.5) {
        suggestions.push({
          color: newColor,
          ratio: newRatio
        });
      }
    }
    
    // Sort by contrast ratio (highest first) and limit to 8 suggestions
    return suggestions
      .sort((a, b) => b.ratio - a.ratio)
      .slice(0, 8);
  }
  
  // Color utility functions
  isValidHex(hex) {
    return /^#([A-Fa-f0-9]{3}){1,2}$/.test(hex);
  }
  
  hexToRgb(hex) {
    // Expand shorthand form (e.g. "#03F") to full form (e.g. "#0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }
  
  rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
  
  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    return {
      h: h * 360,
      s: s * 100,
      l: l * 100
    };
  }
  
  hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }
  
  getContrastColor(hex) {
    const rgb = this.hexToRgb(hex);
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }
  
  calculateRelativeLuminance(r, g, b) {
    // Convert RGB to sRGB
    const sR = r / 255;
    const sG = g / 255;
    const sB = b / 255;
    
    // Calculate luminance
    const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
    const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
    const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);
    
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }
  
  calculateContrastRatio(foreground, background) {
    const fgRgb = this.hexToRgb(foreground);
    const bgRgb = this.hexToRgb(background);
    
    const L1 = this.calculateRelativeLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
    const L2 = this.calculateRelativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
    
    // Calculate contrast ratio: (L1 + 0.05) / (L2 + 0.05)
    // Where L1 is the lighter of the two luminances
    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }
  
  // Color blindness simulation functions
  // These are simplified approximations for demonstration purposes
  simulateProtanopia(hex) {
    const rgb = this.hexToRgb(hex);
    // Protanopia: reduce red component
    const r = rgb.r * 0.2;
    const g = rgb.g * 0.99;
    const b = rgb.b * 0.99;
    return this.rgbToHex(Math.round(r), Math.round(g), Math.round(b));
  }
  
  simulateDeuteranopia(hex) {
    const rgb = this.hexToRgb(hex);
    // Deuteranopia: reduce green component
    const r = rgb.r * 0.99;
    const g = rgb.g * 0.2;
    const b = rgb.b * 0.99;
    return this.rgbToHex(Math.round(r), Math.round(g), Math.round(b));
  }
  
  simulateTritanopia(hex) {
    const rgb = this.hexToRgb(hex);
    // Tritanopia: reduce blue component
    const r = rgb.r * 0.99;
    const g = rgb.g * 0.99;
    const b = rgb.b * 0.2;
    return this.rgbToHex(Math.round(r), Math.round(g), Math.round(b));
  }
  
  simulateGrayscale(hex) {
    const rgb = this.hexToRgb(hex);
    // Convert to grayscale using luminance formula
    const gray = Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
    return this.rgbToHex(gray, gray, gray);
  }
  
  showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = this.shadowRoot.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.position = 'fixed';
    notification.style.top = '2rem';
    notification.style.right = '2rem';
    notification.style.zIndex = '9999';
    notification.style.pointerEvents = 'none';
    
    notification.textContent = message;
    
    // Add to shadow DOM
    this.shadowRoot.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Hide and remove notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
}

customElements.define('tool-contrast-checker', ToolContrastChecker);
