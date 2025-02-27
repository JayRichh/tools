class ToolColorPicker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Load external stylesheet
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '../../styles/tool-color-picker.css');
    
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="container">
        <div class="main-content">
          <h1>Color Picker & Converter</h1>
          <p>Select colors and convert between formats for design consistency</p>
          
          <!-- Main color display and controls -->
          <div class="color-display-section">
            <div class="color-preview-wrapper">
              <div class="color-preview" id="color-preview"></div>
              <div class="eyedropper-tool" id="eyedropper-tool" title="Pick color from screen">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M17.5 5.5L19 7l-9.5 9.5-5 1L5.5 13 15 3.5l2.5 2zM14 6.5L7.5 13M16 9l2 2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div class="color-values">
              <div class="color-value-container">
                <div class="color-value" id="color-hex" title="Click to copy">#FFFFFF</div>
                <div class="color-value" id="color-rgb" title="Click to copy">rgb(255, 255, 255)</div>
                <div class="color-value" id="color-hsl" title="Click to copy">hsl(0, 0%, 100%)</div>
              </div>
            </div>
          </div>
          
          <!-- Color input methods -->
          <div class="color-input-section">
            <div class="input-section-header">
              <h2>Color Input</h2>
            </div>
            
            <div class="input-methods">
              <div class="input-method">
                <div class="color-input-group">
                  <label for="color-picker-input">Color Picker</label>
                  <input type="color" id="color-picker-input" value="#FFFFFF">
                </div>
                
                <div class="color-input-group">
                  <label for="hex-input">HEX</label>
                  <input type="text" id="hex-input" placeholder="#FFFFFF" value="#FFFFFF">
                </div>
              </div>
              
              <div class="input-method">
                <div class="input-method-header">RGB</div>
                <div class="slider-inputs">
                  <div class="slider-input">
                    <label for="r-slider">R</label>
                    <input type="range" id="r-slider" min="0" max="255" value="255" class="color-slider red-slider">
                    <input type="number" id="r-input" min="0" max="255" value="255">
                  </div>
                  
                  <div class="slider-input">
                    <label for="g-slider">G</label>
                    <input type="range" id="g-slider" min="0" max="255" value="255" class="color-slider green-slider">
                    <input type="number" id="g-input" min="0" max="255" value="255">
                  </div>
                  
                  <div class="slider-input">
                    <label for="b-slider">B</label>
                    <input type="range" id="b-slider" min="0" max="255" value="255" class="color-slider blue-slider">
                    <input type="number" id="b-input" min="0" max="255" value="255">
                  </div>
                </div>
              </div>
              
              <div class="input-method">
                <div class="input-method-header">HSL</div>
                <div class="slider-inputs">
                  <div class="slider-input">
                    <label for="h-slider">H</label>
                    <input type="range" id="h-slider" min="0" max="360" value="0" class="color-slider hue-slider">
                    <input type="number" id="h-input" min="0" max="360" value="0">
                  </div>
                  
                  <div class="slider-input">
                    <label for="s-slider">S</label>
                    <input type="range" id="s-slider" min="0" max="100" value="0" class="color-slider saturation-slider">
                    <input type="number" id="s-input" min="0" max="100" value="0">
                  </div>
                  
                  <div class="slider-input">
                    <label for="l-slider">L</label>
                    <input type="range" id="l-slider" min="0" max="100" value="100" class="color-slider lightness-slider">
                    <input type="number" id="l-input" min="0" max="100" value="100">
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Palette generator -->
          <div class="palette-section">
            <div class="section-header">
              <h2>Color Palette</h2>
              <div class="palette-controls">
                <select id="palette-type" class="palette-type-select">
                  <option value="monochromatic">Monochromatic</option>
                  <option value="analogous">Analogous</option>
                  <option value="complementary">Complementary</option>
                  <option value="triadic">Triadic</option>
                  <option value="tetradic">Tetradic</option>
                </select>
                <button class="action-button" id="generate-palette">Generate</button>
              </div>
            </div>
            
            <div class="temperature-control">
              <label for="temperature-slider">Color Temperature: <span id="temperature-value">Neutral</span></label>
              <input type="range" id="temperature-slider" min="-100" max="100" value="0" step="10" class="temperature-slider">
              <div class="temperature-labels">
                <span>Cool</span>
                <span>Neutral</span>
                <span>Warm</span>
              </div>
            </div>
            
            <div class="color-palette" id="color-palette"></div>
            
            <div class="palette-actions">
              <button class="action-button" id="copy-palette">Copy Palette</button>
              <button class="action-button" id="save-palette">Save Palette</button>
            </div>
          </div>
          
          <!-- Saved palettes -->
          <div class="saved-palettes-section">
            <div class="section-header">
              <h2>Saved Palettes</h2>
            </div>
            <div class="saved-palettes" id="saved-palettes"></div>
          </div>
        </div>
      </div>
    `;
    
    this.shadowRoot.appendChild(linkElem);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  
  connectedCallback() {
    // Initialize color picker
    this.initColorPicker();
    
    // Initialize palette generator
    this.initPaletteGenerator();
    
    // Load saved palettes
    this.loadSavedPalettes();
  }
  
  initColorPicker() {
    // Get elements
    this.colorPreview = this.shadowRoot.getElementById('color-preview');
    this.colorHex = this.shadowRoot.getElementById('color-hex');
    this.colorRgb = this.shadowRoot.getElementById('color-rgb');
    this.colorHsl = this.shadowRoot.getElementById('color-hsl');
    
    this.colorPickerInput = this.shadowRoot.getElementById('color-picker-input');
    this.hexInput = this.shadowRoot.getElementById('hex-input');
    this.eyedropperTool = this.shadowRoot.getElementById('eyedropper-tool');
    
    // RGB inputs and sliders
    this.rInput = this.shadowRoot.getElementById('r-input');
    this.gInput = this.shadowRoot.getElementById('g-input');
    this.bInput = this.shadowRoot.getElementById('b-input');
    this.rSlider = this.shadowRoot.getElementById('r-slider');
    this.gSlider = this.shadowRoot.getElementById('g-slider');
    this.bSlider = this.shadowRoot.getElementById('b-slider');
    
    // HSL inputs and sliders
    this.hInput = this.shadowRoot.getElementById('h-input');
    this.sInput = this.shadowRoot.getElementById('s-input');
    this.lInput = this.shadowRoot.getElementById('l-input');
    this.hSlider = this.shadowRoot.getElementById('h-slider');
    this.sSlider = this.shadowRoot.getElementById('s-slider');
    this.lSlider = this.shadowRoot.getElementById('l-slider');
    
    // Debounce function to prevent excessive updates
    this.debounce = (func, delay) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    };
    
    // Set up event listeners with debouncing
    this.colorPickerInput.addEventListener('input', this.debounce(() => {
      this.updateFromHex(this.colorPickerInput.value);
    }, 50));
    
    this.hexInput.addEventListener('input', this.debounce(() => {
      const hex = this.hexInput.value;
      if (this.isValidHex(hex)) {
        this.updateFromHex(hex);
      }
    }, 200));
    
    this.hexInput.addEventListener('blur', () => {
      const hex = this.hexInput.value;
      if (!this.isValidHex(hex)) {
        this.hexInput.value = this.colorPickerInput.value;
      }
    });
    
    // RGB inputs and sliders with debouncing
    const updateFromRgbDebounced = this.debounce(() => {
      this.updateFromRgb(
        parseInt(this.rInput.value) || 0,
        parseInt(this.gInput.value) || 0,
        parseInt(this.bInput.value) || 0
      );
    }, 50);
    
    // Connect RGB number inputs to sliders
    [this.rInput, this.gInput, this.bInput].forEach((input, index) => {
      const slider = [this.rSlider, this.gSlider, this.bSlider][index];
      
      input.addEventListener('input', () => {
        slider.value = input.value;
        updateFromRgbDebounced();
      });
      
      slider.addEventListener('input', () => {
        input.value = slider.value;
        updateFromRgbDebounced();
      });
    });
    
    // HSL inputs and sliders with debouncing
    const updateFromHslDebounced = this.debounce(() => {
      this.updateFromHsl(
        parseInt(this.hInput.value) || 0,
        parseInt(this.sInput.value) || 0,
        parseInt(this.lInput.value) || 0
      );
    }, 50);
    
    // Connect HSL number inputs to sliders
    [this.hInput, this.sInput, this.lInput].forEach((input, index) => {
      const slider = [this.hSlider, this.sSlider, this.lSlider][index];
      
      input.addEventListener('input', () => {
        slider.value = input.value;
        updateFromHslDebounced();
      });
      
      slider.addEventListener('input', () => {
        input.value = slider.value;
        updateFromHslDebounced();
      });
    });
    
    // Add click-to-copy functionality for color values
    [this.colorHex, this.colorRgb, this.colorHsl].forEach(element => {
      element.addEventListener('click', () => {
        navigator.clipboard.writeText(element.textContent)
          .then(() => {
            this.showNotification(`Copied: ${element.textContent}`, 'success');
          })
          .catch(err => {
            console.error('Could not copy text: ', err);
          });
      });
    });
    
    // Eyedropper tool (if supported by browser)
    if (this.eyedropperTool && window.EyeDropper) {
      this.eyedropperTool.addEventListener('click', async () => {
        try {
          const eyeDropper = new EyeDropper();
          const result = await eyeDropper.open();
          this.updateFromHex(result.sRGBHex);
          this.showNotification('Color picked from screen', 'success');
        } catch (e) {
          console.error('EyeDropper error:', e);
          this.showNotification('Failed to pick color', 'error');
        }
      });
    } else if (this.eyedropperTool) {
      // Hide eyedropper if not supported
      this.eyedropperTool.style.display = 'none';
    }
  }
  
  initPaletteGenerator() {
    // Get elements
    this.colorPalette = this.shadowRoot.getElementById('color-palette');
    this.generatePaletteBtn = this.shadowRoot.getElementById('generate-palette');
    this.copyPaletteBtn = this.shadowRoot.getElementById('copy-palette');
    this.savePaletteBtn = this.shadowRoot.getElementById('save-palette');
    this.savedPalettes = this.shadowRoot.getElementById('saved-palettes');
    this.temperatureSlider = this.shadowRoot.getElementById('temperature-slider');
    this.temperatureValue = this.shadowRoot.getElementById('temperature-value');
    this.paletteTypeSelect = this.shadowRoot.getElementById('palette-type');
    
    // Set default temperature
    this.colorTemperature = 0; // Neutral by default
    
    // Palette type selector (dropdown)
    this.paletteType = 'monochromatic'; // Default
    
    if (this.paletteTypeSelect) {
      this.paletteTypeSelect.addEventListener('change', () => {
        this.paletteType = this.paletteTypeSelect.value;
        
        // Force regeneration of palette
        this.generatePalette();
        
        // Log for debugging
        console.log(`Palette type changed to: ${this.paletteType}`);
      });
    }
    
    // Temperature slider with debouncing
    const updateTemperatureDebounced = this.debounce(() => {
      this.colorTemperature = parseInt(this.temperatureSlider.value);
      this.updateTemperatureLabel();
      
      // Force regeneration of palette
      this.generatePalette();
      
      // Log for debugging
      console.log(`Temperature changed to: ${this.colorTemperature}`);
    }, 50);
    
    this.temperatureSlider.addEventListener('input', updateTemperatureDebounced);
    
    // Generate palette button
    this.generatePaletteBtn.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default button behavior
      
      // Force regeneration of palette
      this.generatePalette();
      
      // Log for debugging
      console.log('Generate palette button clicked');
    });
    
    // Initialize temperature label
    this.updateTemperatureLabel();
    
    // Copy palette button
    this.copyPaletteBtn.addEventListener('click', () => {
      this.copyPalette();
    });
    
    // Save palette button
    this.savePaletteBtn.addEventListener('click', () => {
      this.savePalette();
    });
    
    // Generate initial palette with a slight delay to ensure DOM is ready
    setTimeout(() => {
      this.generatePalette();
      console.log('Initial palette generated');
    }, 100);
  }
  
  updateFromHex(hex) {
    // Update color picker
    this.colorPickerInput.value = hex;
    this.hexInput.value = hex;
    
    // Update preview
    this.colorPreview.style.backgroundColor = hex;
    this.colorHex.textContent = hex.toUpperCase();
    
    // Convert to RGB
    const rgb = this.hexToRgb(hex);
    this.rInput.value = rgb.r;
    this.gInput.value = rgb.g;
    this.bInput.value = rgb.b;
    this.colorRgb.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    
    // Convert to HSL
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    this.hInput.value = Math.round(hsl.h);
    this.sInput.value = Math.round(hsl.s);
    this.lInput.value = Math.round(hsl.l);
    this.colorHsl.textContent = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
    
    // Generate new palette based on the selected color
    this.generatePalette();
    
    // Log for debugging
    console.log('Color updated to:', hex);
  }
  
  updateFromRgb(r, g, b) {
    // Clamp values
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    
    // Update inputs
    this.rInput.value = r;
    this.gInput.value = g;
    this.bInput.value = b;
    
    // Convert to HEX
    const hex = this.rgbToHex(r, g, b);
    this.colorPickerInput.value = hex;
    this.hexInput.value = hex;
    
    // Update preview
    this.colorPreview.style.backgroundColor = hex;
    this.colorHex.textContent = hex.toUpperCase();
    this.colorRgb.textContent = `rgb(${r}, ${g}, ${b})`;
    
    // Convert to HSL
    const hsl = this.rgbToHsl(r, g, b);
    this.hInput.value = Math.round(hsl.h);
    this.sInput.value = Math.round(hsl.s);
    this.lInput.value = Math.round(hsl.l);
    this.colorHsl.textContent = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
    
    // Generate new palette based on the selected color
    this.generatePalette();
    
    // Log for debugging
    console.log('Color updated to RGB:', r, g, b);
  }
  
  updateFromHsl(h, s, l) {
    // Clamp values
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    l = Math.max(0, Math.min(100, l));
    
    // Update inputs
    this.hInput.value = h;
    this.sInput.value = s;
    this.lInput.value = l;
    
    // Convert to RGB
    const rgb = this.hslToRgb(h, s, l);
    this.rInput.value = rgb.r;
    this.gInput.value = rgb.g;
    this.bInput.value = rgb.b;
    
    // Convert to HEX
    const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
    this.colorPickerInput.value = hex;
    this.hexInput.value = hex;
    
    // Update preview
    this.colorPreview.style.backgroundColor = hex;
    this.colorHex.textContent = hex.toUpperCase();
    this.colorRgb.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    this.colorHsl.textContent = `hsl(${h}, ${s}%, ${l}%)`;
    
    // Generate new palette based on the selected color
    this.generatePalette();
    
    // Log for debugging
    console.log('Color updated to HSL:', h, s, l);
  }
  
  updateTemperatureLabel() {
    // Update temperature label based on slider value
    let temperatureText = 'Neutral';
    
    if (this.colorTemperature < -70) {
      temperatureText = 'Very Cool';
    } else if (this.colorTemperature < -30) {
      temperatureText = 'Cool';
    } else if (this.colorTemperature < -10) {
      temperatureText = 'Slightly Cool';
    } else if (this.colorTemperature > 70) {
      temperatureText = 'Very Warm';
    } else if (this.colorTemperature > 30) {
      temperatureText = 'Warm';
    } else if (this.colorTemperature > 10) {
      temperatureText = 'Slightly Warm';
    }
    
    this.temperatureValue.textContent = temperatureText;
  }
  
  generatePalette() {
    // Get current color
    const hex = this.colorPickerInput.value;
    const rgb = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // Apply temperature adjustment to the base color
    const adjustedHsl = this.applyTemperatureToColor(hsl);
    
    // Generate palette based on type
    let colors = [];
    
    switch (this.paletteType) {
      case 'monochromatic':
        colors = this.generateMonochromaticPalette(adjustedHsl);
        break;
      case 'analogous':
        colors = this.generateAnalogousPalette(adjustedHsl);
        break;
      case 'complementary':
        colors = this.generateComplementaryPalette(adjustedHsl);
        break;
      case 'triadic':
        colors = this.generateTriadicPalette(adjustedHsl);
        break;
      case 'tetradic':
        colors = this.generateTetradicPalette(adjustedHsl);
        break;
    }
    
    // Display palette
    this.displayPalette(colors);
  }
  
  generateTetradicPalette(hsl) {
    const colors = [];
    const { h, s, l } = hsl;
    
    // Generate 5 colors using tetradic (rectangle) color scheme
    // This creates colors at 0°, 90°, 180°, and 270° around the color wheel
    const hueAngles = [0, 90, 180, 270];
    
    // First color is the original
    colors.push(this.createColorObject(h, s, l));
    
    // Add the other tetradic colors
    for (let i = 1; i < 4; i++) {
      const newH = (h + hueAngles[i]) % 360;
      // Slightly adjust lightness for variety
      const newL = Math.max(30, Math.min(70, l + (i % 2 === 0 ? 5 : -5)));
      colors.push(this.createColorObject(newH, s, newL));
    }
    
    // Add a fifth color - a variation of the original with different lightness
    const fifthL = Math.max(20, Math.min(80, l - 15));
    colors.push(this.createColorObject(h, s, fifthL));
    
    return colors;
  }
  
  createColorObject(h, s, l) {
    const rgb = this.hslToRgb(h, s, l);
    const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
    return {
      hex,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`
    };
  }
  
  applyTemperatureToColor(hsl) {
    // Clone the HSL object to avoid modifying the original
    const adjustedHsl = { ...hsl };
    
    // Apply temperature adjustment
    if (this.colorTemperature !== 0) {
      // Adjust hue based on temperature
      // Warm colors shift toward red/orange/yellow (0-60°)
      // Cool colors shift toward blue/cyan (180-240°)
      if (this.colorTemperature > 0) {
        // Warm: shift toward red/orange/yellow
        const targetHue = adjustedHsl.h > 60 && adjustedHsl.h < 180 ? 60 : 30;
        const shift = (this.colorTemperature / 100) * 30; // Max 30° shift
        adjustedHsl.h = this.lerpHue(adjustedHsl.h, targetHue, shift / 100);
        
        // Increase saturation for warmer colors
        adjustedHsl.s = Math.min(100, adjustedHsl.s + (this.colorTemperature / 100) * 15);
      } else {
        // Cool: shift toward blue/cyan
        const targetHue = adjustedHsl.h > 240 || adjustedHsl.h < 60 ? 210 : 210;
        const shift = (Math.abs(this.colorTemperature) / 100) * 30; // Max 30° shift
        adjustedHsl.h = this.lerpHue(adjustedHsl.h, targetHue, shift / 100);
        
        // Slightly decrease saturation for cooler colors
        adjustedHsl.s = Math.max(0, adjustedHsl.s - (Math.abs(this.colorTemperature) / 100) * 5);
      }
    }
    
    return adjustedHsl;
  }
  
  lerpHue(h1, h2, t) {
    // Linear interpolation for hue that handles the circular nature of hue values
    const diff = Math.abs(h1 - h2);
    
    if (diff > 180) {
      // Go the other way around the color wheel
      if (h1 < h2) {
        h1 += 360;
      } else {
        h2 += 360;
      }
    }
    
    // Interpolate and ensure result is in [0, 360) range
    let result = h1 + (h2 - h1) * t;
    return ((result % 360) + 360) % 360;
  }
  
  generateMonochromaticPalette(hsl) {
    const colors = [];
    const { h, s } = hsl;
    
    // Generate 5 colors with different lightness
    for (let i = 0; i < 5; i++) {
      const l = Math.max(10, Math.min(90, 10 + i * 20)); // 10, 30, 50, 70, 90
      const rgb = this.hslToRgb(h, s, l);
      const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
      colors.push({
        hex,
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`
      });
    }
    
    return colors;
  }
  
  generateAnalogousPalette(hsl) {
    const colors = [];
    const { h, s, l } = hsl;
    
    // Generate 5 colors with different hues (-40, -20, 0, 20, 40 degrees)
    for (let i = 0; i < 5; i++) {
      const newH = (h + (i - 2) * 20 + 360) % 360;
      const rgb = this.hslToRgb(newH, s, l);
      const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
      colors.push({
        hex,
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: `hsl(${Math.round(newH)}, ${Math.round(s)}%, ${Math.round(l)}%)`
      });
    }
    
    return colors;
  }
  
  generateComplementaryPalette(hsl) {
    const colors = [];
    const { h, s, l } = hsl;
    
    // Generate 5 colors: 2 shades of the original, the original, and 2 shades of the complement
    for (let i = 0; i < 5; i++) {
      let newH, newS, newL;
      
      if (i < 2) {
        // Shades of the original
        newH = h;
        newS = s;
        newL = Math.max(20, Math.min(80, l - 20 + i * 20)); // l-20, l
      } else if (i === 2) {
        // Original
        newH = h;
        newS = s;
        newL = l;
      } else {
        // Shades of the complement
        newH = (h + 180) % 360;
        newS = s;
        newL = Math.max(20, Math.min(80, l - 20 + (i - 3) * 20)); // l-20, l
      }
      
      const rgb = this.hslToRgb(newH, newS, newL);
      const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
      colors.push({
        hex,
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: `hsl(${Math.round(newH)}, ${Math.round(newS)}%, ${Math.round(newL)}%)`
      });
    }
    
    return colors;
  }
  
  generateTriadicPalette(hsl) {
    const colors = [];
    const { h, s, l } = hsl;
    
    // Generate 5 colors: original and 2 triadic colors with variations
    for (let i = 0; i < 5; i++) {
      let newH;
      
      if (i < 2) {
        // Original and variation
        newH = h;
      } else if (i < 3) {
        // First triadic
        newH = (h + 120) % 360;
      } else {
        // Second triadic
        newH = (h + 240) % 360;
      }
      
      const newL = Math.max(30, Math.min(70, l - 10 + (i % 2) * 20)); // Alternate between l-10 and l+10
      
      const rgb = this.hslToRgb(newH, s, newL);
      const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
      colors.push({
        hex,
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: `hsl(${Math.round(newH)}, ${Math.round(s)}%, ${Math.round(newL)}%)`
      });
    }
    
    return colors;
  }
  
  displayPalette(colors) {
    // Clear existing palette
    if (this.colorPalette) {
      // Force clear the palette
      this.colorPalette.innerHTML = '';
      
      // Log for debugging
      console.log('Displaying palette with colors:', colors);
      
      // Create and append color swatches
      colors.forEach((color, index) => {
        // Create a new div for the color swatch
        const colorSwatch = document.createElement('div');
        colorSwatch.className = 'color-swatch';
        
        // Explicitly set the background color using the hex value
        colorSwatch.style.backgroundColor = color.hex;
        
        // Force the background color to be applied
        colorSwatch.setAttribute('style', `background-color: ${color.hex} !important`);
        
        // Log each color being added
        console.log(`Adding color ${index + 1}:`, color.hex);
        
        // Create the color info element
        const colorInfo = document.createElement('div');
        colorInfo.className = 'color-swatch-info';
        colorInfo.innerHTML = `
          <div class="color-swatch-value">${color.hex.toUpperCase()}</div>
          <div class="color-swatch-value">${color.rgb}</div>
          <div class="color-swatch-value">${color.hsl}</div>
        `;
        
        // Append the color info to the swatch
        colorSwatch.appendChild(colorInfo);
        
        // Add click event listener to update the main color picker when a swatch is clicked
        colorSwatch.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Update the color picker with this color
          console.log(`Swatch clicked: ${color.hex}`);
          
          // Update all inputs and preview with this color
          this.colorPickerInput.value = color.hex;
          this.hexInput.value = color.hex;
          this.colorPreview.style.backgroundColor = color.hex;
          this.colorHex.textContent = color.hex.toUpperCase();
          
          // Parse RGB values
          const rgb = this.hexToRgb(color.hex);
          this.rInput.value = rgb.r;
          this.gInput.value = rgb.g;
          this.bInput.value = rgb.b;
          this.colorRgb.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
          
          // Parse HSL values
          const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
          this.hInput.value = Math.round(hsl.h);
          this.sInput.value = Math.round(hsl.s);
          this.lInput.value = Math.round(hsl.l);
          this.colorHsl.textContent = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
          
          // Show notification
          this.showNotification(`Color selected: ${color.hex.toUpperCase()}`, 'success');
        });
        
        // Append the swatch to the palette
        this.colorPalette.appendChild(colorSwatch);
      });
      
      // Store current palette
      this.currentPalette = colors;
      
      // Force a repaint of the palette container
      this.colorPalette.style.display = 'none';
      setTimeout(() => {
        this.colorPalette.style.display = 'grid';
      }, 0);
    } else {
      console.error('Color palette element not found');
    }
  }
  
  copyPalette() {
    if (!this.currentPalette) return;
    
    const paletteText = this.currentPalette.map(color => color.hex.toUpperCase()).join(', ');
    
    navigator.clipboard.writeText(paletteText)
      .then(() => {
        this.showNotification('Palette copied to clipboard', 'success');
      })
      .catch(err => {
        console.error('Could not copy palette: ', err);
      });
  }
  
  savePalette() {
    if (!this.currentPalette) return;
    
    // Get saved palettes from localStorage
    let savedPalettes = JSON.parse(localStorage.getItem('colorPalettes') || '[]');
    
    // Add current palette
    savedPalettes.push({
      type: this.paletteType,
      colors: this.currentPalette,
      timestamp: new Date().toISOString()
    });
    
    // Limit to 10 palettes
    if (savedPalettes.length > 10) {
      savedPalettes = savedPalettes.slice(-10);
    }
    
    // Save to localStorage
    localStorage.setItem('colorPalettes', JSON.stringify(savedPalettes));
    
    // Update display
    this.loadSavedPalettes();
    
    this.showNotification('Palette saved', 'success');
  }
  
  loadSavedPalettes() {
    // Get saved palettes from localStorage
    const savedPalettes = JSON.parse(localStorage.getItem('colorPalettes') || '[]');
    
    // Clear container
    this.savedPalettes.innerHTML = '';
    
    if (savedPalettes.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-message';
      emptyMessage.textContent = 'No saved palettes yet. Generate and save a palette to see it here.';
      this.savedPalettes.appendChild(emptyMessage);
      return;
    }
    
    // Display palettes
    savedPalettes.forEach((palette, index) => {
      const paletteElement = document.createElement('div');
      paletteElement.className = 'saved-palette';
      
      // Create color swatches
      const swatchesContainer = document.createElement('div');
      swatchesContainer.className = 'saved-palette-swatches';
      
      palette.colors.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'saved-palette-swatch';
        swatch.style.backgroundColor = color.hex;
        swatchesContainer.appendChild(swatch);
      });
      
      // Create palette info
      const infoElement = document.createElement('div');
      infoElement.className = 'saved-palette-info';
      
      const typeElement = document.createElement('div');
      typeElement.className = 'saved-palette-type';
      typeElement.textContent = palette.type.charAt(0).toUpperCase() + palette.type.slice(1);
      
      const dateElement = document.createElement('div');
      dateElement.className = 'saved-palette-date';
      dateElement.textContent = new Date(palette.timestamp).toLocaleString();
      
      infoElement.appendChild(typeElement);
      infoElement.appendChild(dateElement);
      
      // Create actions
      const actionsElement = document.createElement('div');
      actionsElement.className = 'saved-palette-actions';
      
      const loadButton = document.createElement('button');
      loadButton.className = 'saved-palette-action';
      loadButton.textContent = 'Load';
      loadButton.addEventListener('click', () => {
        this.loadPalette(palette);
      });
      
      const deleteButton = document.createElement('button');
      deleteButton.className = 'saved-palette-action';
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => {
        this.deletePalette(index);
      });
      
      actionsElement.appendChild(loadButton);
      actionsElement.appendChild(deleteButton);
      
      // Assemble palette element
      paletteElement.appendChild(swatchesContainer);
      paletteElement.appendChild(infoElement);
      paletteElement.appendChild(actionsElement);
      
      this.savedPalettes.appendChild(paletteElement);
    });
  }
  
  loadPalette(palette) {
    // Set palette type in dropdown
    if (this.paletteTypeSelect) {
      this.paletteTypeSelect.value = palette.type;
    }
    this.paletteType = palette.type;
    
    // Reset temperature to neutral
    this.temperatureSlider.value = 0;
    this.colorTemperature = 0;
    this.updateTemperatureLabel();
    
    // Load first color
    if (palette.colors.length > 0) {
      this.updateFromHex(palette.colors[0].hex);
    }
    
    // Display palette
    this.displayPalette(palette.colors);
    
    this.showNotification('Palette loaded', 'success');
  }
  
  deletePalette(index) {
    // Get saved palettes from localStorage
    let savedPalettes = JSON.parse(localStorage.getItem('colorPalettes') || '[]');
    
    // Remove palette
    savedPalettes.splice(index, 1);
    
    // Save to localStorage
    localStorage.setItem('colorPalettes', JSON.stringify(savedPalettes));
    
    // Update display
    this.loadSavedPalettes();
    
    this.showNotification('Palette deleted', 'success');
  }
  
  // Color conversion utilities
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
  
  showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = this.shadowRoot.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type === 'success' ? 'success' : ''}`;
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

customElements.define('tool-color-picker', ToolColorPicker);
