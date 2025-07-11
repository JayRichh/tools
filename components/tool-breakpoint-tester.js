class ToolBreakpointTester extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '../../styles/tool-breakpoint-tester.css');
    
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="container">
        <div class="main-content">
          <h1>Responsive Breakpoint Tester</h1>
          <p>Simulate how your layout adapts across devices with a live preview tool</p>
          
          <div class="breakpoint-tester">
            <div class="controls-panel">
              <div class="control-section">
                <div class="control-section-header">
                  <h2>URL or File</h2>
                </div>
                
                <div class="control-row">
                  <div class="control-group">
                    <label for="url-input">Enter URL to test</label>
                    <input type="url" id="url-input" placeholder="https://example.com" value="">
                  </div>
                </div>
                
                <div class="control-row">
                  <div class="control-group">
                    <label for="file-input">Or upload HTML file</label>
                    <input type="file" id="file-input" accept=".html,.htm">
                  </div>
                </div>
                
                <div class="action-buttons">
                  <button id="load-url-btn" class="action-button">
                    <span>Load URL</span>
                  </button>
                  <button id="reset-btn" class="action-button secondary">
                    <span>Reset</span>
                  </button>
                </div>
              </div>
              
              <div class="control-section">
                <div class="control-section-header">
                  <h2>Device Presets</h2>
                </div>
                
                <div class="device-presets">
                  <button class="device-preset" data-width="375" data-height="667" data-device="phone">
                    <span class="device-preset-icon">📱</span>
                    <span>Mobile</span>
                  </button>
                  <button class="device-preset" data-width="768" data-height="1024" data-device="tablet">
                    <span class="device-preset-icon">📱</span>
                    <span>Tablet</span>
                  </button>
                  <button class="device-preset" data-width="1024" data-height="768" data-device="tablet-landscape">
                    <span class="device-preset-icon">📱</span>
                    <span>Tablet Landscape</span>
                  </button>
                  <button class="device-preset" data-width="1280" data-height="800" data-device="laptop">
                    <span class="device-preset-icon">💻</span>
                    <span>Laptop</span>
                  </button>
                  <button class="device-preset" data-width="1920" data-height="1080" data-device="desktop">
                    <span class="device-preset-icon">🖥️</span>
                    <span>Desktop</span>
                  </button>
                </div>
              </div>
              
              <div class="control-section">
                <div class="control-section-header">
                  <h2>Custom Dimensions</h2>
                </div>
                
                <div class="control-row">
                  <div class="control-group">
                    <label for="width-input">Width (px)</label>
                    <input type="number" id="width-input" min="320" max="3840" value="375">
                  </div>
                  
                  <div class="control-group">
                    <label for="height-input">Height (px)</label>
                    <input type="number" id="height-input" min="320" max="2160" value="667">
                  </div>
                </div>
                
                <div class="control-row">
                  <div class="control-group">
                    <label for="device-frame-toggle">Show Device Frame</label>
                    <input type="checkbox" id="device-frame-toggle" checked>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="preview-container">
              <div class="preview-header">
                <div class="preview-dimensions">
                  <span>Dimensions:</span>
                  <span class="preview-dimensions-value" id="dimensions-display">375 × 667</span>
                </div>
                
                <div class="preview-actions">
                  <button class="preview-action" id="rotate-btn" title="Rotate Device">
                    <span>⟳</span>
                  </button>
                  <button class="preview-action" id="screenshot-btn" title="Take Screenshot">
                    <span>📷</span>
                  </button>
                </div>
              </div>
              
              <div class="preview-frame-container" id="frame-container">
                <div class="preview-frame-wrapper" id="frame-wrapper">
                  <div class="device-frame" id="device-frame"></div>
                  <iframe class="preview-frame" id="preview-frame" src="about:blank" crossorigin="anonymous"></iframe>

                  <div class="touch-indicator" id="touch-indicator"></div>
                </div>
                
                <div class="breakpoint-indicator" id="breakpoint-indicator">
                  <div class="breakpoint-marker" data-breakpoint="sm">SM</div>
                  <div class="breakpoint-marker" data-breakpoint="md">MD</div>
                  <div class="breakpoint-marker" data-breakpoint="lg">LG</div>
                  <div class="breakpoint-marker" data-breakpoint="xl">XL</div>
                  <div class="breakpoint-marker" data-breakpoint="2xl">2XL</div>
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
    this.initDomReferences();
    this.setupEventListeners();
    this.updateFrameDimensions(375, 667);
    this.updateDeviceFrame('phone');
    this.updateBreakpointIndicators(375);
    this.initDragFunctionality();
    this.initTouchCursorFunctionality();
    this.handleWindowResize();
    
    this.frameWrapper.style.position = 'relative';
    this.frameWrapper.style.left = '0px';
    this.frameWrapper.style.top = '0px';
    
    this.devicePresets[0].classList.add('active');
    this.updateTouchMode();
  }
  
  initDomReferences() {
    this.urlInput = this.shadowRoot.getElementById('url-input');
    this.fileInput = this.shadowRoot.getElementById('file-input');
    this.widthInput = this.shadowRoot.getElementById('width-input');
    this.heightInput = this.shadowRoot.getElementById('height-input');
    this.deviceFrameToggle = this.shadowRoot.getElementById('device-frame-toggle');
    
    this.loadUrlBtn = this.shadowRoot.getElementById('load-url-btn');
    this.resetBtn = this.shadowRoot.getElementById('reset-btn');
    this.rotateBtn = this.shadowRoot.getElementById('rotate-btn');
    this.screenshotBtn = this.shadowRoot.getElementById('screenshot-btn');
    
    this.devicePresets = this.shadowRoot.querySelectorAll('.device-preset');
    
    this.previewFrame = this.shadowRoot.getElementById('preview-frame');
    this.frameWrapper = this.shadowRoot.getElementById('frame-wrapper');
    this.deviceFrame = this.shadowRoot.getElementById('device-frame');
    this.dimensionsDisplay = this.shadowRoot.getElementById('dimensions-display');
    this.breakpointIndicator = this.shadowRoot.getElementById('breakpoint-indicator');
    this.breakpointMarkers = this.shadowRoot.querySelectorAll('.breakpoint-marker');
    this.touchIndicator = this.shadowRoot.getElementById('touch-indicator');
  }
  
  setupEventListeners() {
    this.loadUrlBtn.addEventListener('click', () => {
      this.loadUrl();
    });
    
    this.urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.loadUrl();
      }
    });
    
    this.fileInput.addEventListener('change', (e) => {
      this.loadFile(e.target.files[0]);
    });
    
    this.resetBtn.addEventListener('click', () => {
      this.resetTool();
    });
    
    this.widthInput.addEventListener('input', () => {
      this.updateFrameDimensions(
        parseInt(this.widthInput.value) || 375,
        parseInt(this.heightInput.value) || 667
      );
    });
    
    this.heightInput.addEventListener('input', () => {
      this.updateFrameDimensions(
        parseInt(this.widthInput.value) || 375,
        parseInt(this.heightInput.value) || 667
      );
    });
    
    this.deviceFrameToggle.addEventListener('change', () => {
      this.toggleDeviceFrame();
    });
    
    this.rotateBtn.addEventListener('click', () => {
      this.rotateFrame();
    });
    
    this.screenshotBtn.addEventListener('click', () => {
      this.takeScreenshot();
    });
    
    this.devicePresets.forEach(preset => {
      preset.addEventListener('click', () => {
        const width = parseInt(preset.dataset.width);
        const height = parseInt(preset.dataset.height);
        const device = preset.dataset.device;
        
        this.widthInput.value = width;
        this.heightInput.value = height;
        
        this.updateFrameDimensions(width, height);
        this.updateDeviceFrame(device);
        
        this.devicePresets.forEach(p => p.classList.remove('active'));
        preset.classList.add('active');
      });
    });
  }
  
  loadUrl() {
    const url = this.urlInput.value.trim();
    
    if (!url) {
      this.showNotification('Please enter a URL', 'error');
      return;
    }
    
    let fullUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      fullUrl = 'https://' + url;
      this.urlInput.value = fullUrl;
    }
    
    try {
      this.showNotification('Loading URL...');
      
      this.frameWrapper.style.left = '0px';
      this.frameWrapper.style.top = '0px';
      
      this.previewFrame.src = fullUrl;
      
      const frameContainer = this.shadowRoot.getElementById('frame-container');
      frameContainer.classList.add('loading');
      
      this.previewFrame.onload = () => {
        frameContainer.classList.remove('loading');
        
        const width = parseInt(this.widthInput.value) || 375;
        const height = parseInt(this.heightInput.value) || 667;
        this.updateFrameDimensions(width, height);
        
        this.showNotification('URL loaded successfully');
      };
    } catch (error) {
      this.showNotification('Error loading URL: ' + error.message, 'error');
    }
  }
  
  loadFile(file) {
    if (!file) return;
    
    if (file.type !== 'text/html' && !file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
      this.showNotification('Please select an HTML file', 'error');
      return;
    }
    
    this.showNotification('Loading file...');
    
    this.frameWrapper.style.left = '0px';
    this.frameWrapper.style.top = '0px';
    
    const frameContainer = this.shadowRoot.getElementById('frame-container');
    frameContainer.classList.add('loading');
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const htmlContent = e.target.result;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      
      this.previewFrame.src = blobUrl;
      
      this.previewFrame.onload = () => {
        frameContainer.classList.remove('loading');
        
        const width = parseInt(this.widthInput.value) || 375;
        const height = parseInt(this.heightInput.value) || 667;
        this.updateFrameDimensions(width, height);
        
        this.showNotification('File loaded successfully');
      };
    };
    
    reader.onerror = () => {
      frameContainer.classList.remove('loading');
      this.showNotification('Error reading file', 'error');
    };
    
    reader.readAsText(file);
  }
  
  resetTool() {
    this.urlInput.value = '';
    this.fileInput.value = '';
    
    this.previewFrame.src = 'about:blank';
    
    this.widthInput.value = 375;
    this.heightInput.value = 667;
    this.updateFrameDimensions(375, 667);
    this.updateDeviceFrame('phone');
    
    this.frameWrapper.style.left = '0px';
    this.frameWrapper.style.top = '0px';
    
    this.devicePresets.forEach(p => p.classList.remove('active'));
    this.devicePresets[0].classList.add('active');
    
    const frameContainer = this.shadowRoot.getElementById('frame-container');
    frameContainer.classList.remove('loading');
    
    this.deviceFrameToggle.checked = true;
    this.deviceFrame.style.display = 'block';
    
    this.showNotification('Tool reset successfully');
  }
  
  updateFrameDimensions(width, height) {
    this.frameWrapper.style.width = `${width}px`;
    this.frameWrapper.style.height = `${height}px`;
    
    this.dimensionsDisplay.textContent = `${width} × ${height}`;
    
    this.updateBreakpointIndicators(width);
    
    this.previewFrame.style.width = '100%';
    this.previewFrame.style.height = '100%';
    
    const deviceType = this.deviceFrame.classList.contains('phone') ? 'phone' : 
                       this.deviceFrame.classList.contains('tablet') ? 'tablet' : 
                       this.deviceFrame.classList.contains('laptop') ? 'laptop' : '';
    
    if (deviceType === 'phone') {
      this.frameWrapper.style.borderRadius = '24px';
    } else if (deviceType === 'tablet') {
      this.frameWrapper.style.borderRadius = '24px';
    } else if (deviceType === 'laptop') {
      this.frameWrapper.style.borderRadius = '12px';
    } else {
      this.frameWrapper.style.borderRadius = '8px';
    }
    
    this.updateTouchMode();
  }
  
  initTouchCursorFunctionality() {
    this.previewFrame.addEventListener('mousemove', (e) => {
      this.handleTouchCursorMove(e);
    });
    
    this.previewFrame.addEventListener('mouseenter', (e) => {
      if (this.frameWrapper.classList.contains('touch-mode')) {
        this.handleTouchCursorMove(e);
      }
    });
    
    this.previewFrame.addEventListener('mouseleave', () => {
      this.hideTouchIndicator();
    });
    
    this.previewFrame.addEventListener('click', (e) => {
      if (this.frameWrapper.classList.contains('touch-mode')) {
        this.showTouchIndicator(e.clientX, e.clientY, true);
        
        setTimeout(() => {
          this.hideTouchIndicator();
        }, 500);
      }
    });
    
    this.widthInput.addEventListener('change', () => {
      this.updateTouchMode();
    });
    
    this.devicePresets.forEach(preset => {
      preset.addEventListener('click', () => {
        setTimeout(() => {
          this.updateTouchMode();
        }, 0);
      });
    });
  }
  
  updateTouchMode() {
    const width = parseInt(this.widthInput.value) || 375;
    const deviceType = this.deviceFrame.classList.contains('phone') ? 'phone' : 
                       this.deviceFrame.classList.contains('tablet') ? 'tablet' : '';
    
    if (width < 768 || deviceType === 'phone' || deviceType === 'tablet') {
      this.frameWrapper.classList.add('touch-mode');
    } else {
      this.frameWrapper.classList.remove('touch-mode');
      this.hideTouchIndicator();
    }
  }
  
  handleTouchCursorMove(e) {
    if (this.frameWrapper.classList.contains('touch-mode')) {
      const rect = this.previewFrame.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        this.showTouchIndicator(x, y);
      } else {
        this.hideTouchIndicator();
      }
    }
  }
  
  showTouchIndicator(x, y, animate = false) {
    this.touchIndicator.style.left = `${x}px`;
    this.touchIndicator.style.top = `${y}px`;
    this.touchIndicator.style.display = 'block';
    
    if (animate) {
      this.touchIndicator.classList.add('active');
      
      setTimeout(() => {
        this.touchIndicator.classList.remove('active');
      }, 500);
    }
  }
  
  hideTouchIndicator() {
    this.touchIndicator.style.display = 'none';
    this.touchIndicator.classList.remove('active');
  }
  
  updateDeviceFrame(deviceType) {
    this.deviceFrame.classList.remove('phone', 'tablet', 'laptop');
    
    if (deviceType === 'phone' || deviceType === 'tablet' || deviceType === 'laptop') {
      this.deviceFrame.classList.add(deviceType);
      
      if (deviceType === 'phone') {
        this.frameWrapper.style.borderRadius = '24px';
      } else if (deviceType === 'tablet') {
        this.frameWrapper.style.borderRadius = '24px';
      } else if (deviceType === 'laptop') {
        this.frameWrapper.style.borderRadius = '12px';
      }
    } else {
      this.frameWrapper.style.borderRadius = '8px';
    }
    
    this.previewFrame.style.borderRadius = this.frameWrapper.style.borderRadius;
  }
  
  toggleDeviceFrame() {
    if (this.deviceFrameToggle.checked) {
      this.deviceFrame.style.display = 'block';
      
      const deviceType = this.deviceFrame.classList.contains('phone') ? 'phone' : 
                         this.deviceFrame.classList.contains('tablet') ? 'tablet' : 
                         this.deviceFrame.classList.contains('laptop') ? 'laptop' : '';
      
      if (deviceType === 'phone') {
        this.frameWrapper.style.borderRadius = '24px';
      } else if (deviceType === 'tablet') {
        this.frameWrapper.style.borderRadius = '24px';
      } else if (deviceType === 'laptop') {
        this.frameWrapper.style.borderRadius = '12px';
      } else {
        this.frameWrapper.style.borderRadius = '8px';
      }
    } else {
      this.deviceFrame.style.display = 'none';
      this.frameWrapper.style.borderRadius = '8px';
    }
    
    this.previewFrame.style.borderRadius = this.frameWrapper.style.borderRadius;
  }
  
  rotateFrame() {
    const currentWidth = parseInt(this.widthInput.value) || 375;
    const currentHeight = parseInt(this.heightInput.value) || 667;
    
    this.widthInput.value = currentHeight;
    this.heightInput.value = currentWidth;
    
    this.updateFrameDimensions(currentHeight, currentWidth);
    
    let deviceType = '';
    if (currentHeight > currentWidth) {
      if (currentHeight < 500) deviceType = 'phone';
      else if (currentHeight < 1200) deviceType = 'tablet-landscape';
      else deviceType = 'laptop';
    } else {
      if (currentWidth < 500) deviceType = 'phone';
      else if (currentWidth < 1200) deviceType = 'tablet';
      else deviceType = 'desktop';
    }
    
    this.updateDeviceFrame(deviceType);
    
    this.showNotification('Device rotated');
  }
  
  takeScreenshot() {
    this.showNotification('Taking screenshot...');
    
    const width = parseInt(this.widthInput.value) || 375;
    const height = parseInt(this.heightInput.value) || 667;
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    const frameContent = this.previewFrame.contentDocument || this.previewFrame.contentWindow.document;
    
    html2canvas(frameContent.body, {
      width: width,
      height: height,
      scale: 1,
      allowTaint: true,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    }).then(contentCanvas => {
      ctx.drawImage(contentCanvas, 0, 0, width, height);
      this.downloadScreenshot(canvas);
    }).catch(error => {
      console.error('Screenshot error:', error);
      this.showNotification('Error taking screenshot. Try a different URL or file.', 'error');
      
      this.takeScreenshotFallback();
    });
  }
  
  takeScreenshotFallback() {
    const width = parseInt(this.widthInput.value) || 375;
    const height = parseInt(this.heightInput.value) || 667;
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    html2canvas(this.frameWrapper, {
      width: width,
      height: height,
      scale: 1,
      allowTaint: true,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      ignoreElements: (element) => {
        return element === this.deviceFrame;
      }
    }).then(canvas => {
      this.downloadScreenshot(canvas);
    }).catch(error => {
      console.error('Fallback screenshot failed:', error);
      this.showNotification('Unable to capture screenshot', 'error');
    });
  }
  
  downloadScreenshot(canvas) {
    try {
      this.copyToClipboard(canvas);
      
      const link = document.createElement('a');
      link.download = `breakpoint-tester-${this.widthInput.value}x${this.heightInput.value}-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.showNotification('Screenshot captured and downloaded');
    } catch (error) {
      console.error('Download error:', error);
      this.showNotification('Error saving screenshot', 'error');
    }
  }
  
  copyToClipboard(canvas) {
    try {
      canvas.toBlob(blob => {
        if (navigator.clipboard && navigator.clipboard.write) {
          const item = new ClipboardItem({ 'image/png': blob });
          navigator.clipboard.write([item]);
        }
      });
    } catch (error) {
      console.error('Clipboard error:', error);
    }
  }
  
  updateBreakpointIndicators(width) {
    const breakpoints = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    };
    
    this.breakpointMarkers.forEach(marker => {
      const breakpoint = marker.dataset.breakpoint;
      const breakpointValue = breakpoints[breakpoint];
      
      if (width >= breakpointValue) {
        marker.classList.add('active');
      } else {
        marker.classList.remove('active');
      }
    });
  }
  
  initDragFunctionality() {
    let isDragging = false;
    let startX, startY;
    let offsetX = 0, offsetY = 0;
    
    const frameContainer = this.shadowRoot.getElementById('frame-container');
    
    this.frameWrapper.addEventListener('mousedown', (e) => {
      if (e.target === this.frameWrapper || e.target === this.deviceFrame) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        
        const currentLeft = parseInt(this.frameWrapper.style.left || '0');
        const currentTop = parseInt(this.frameWrapper.style.top || '0');
        
        offsetX = currentLeft;
        offsetY = currentTop;
        
        e.preventDefault();
      }
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newLeft = offsetX + deltaX;
      let newTop = offsetY + deltaY;
      
      const containerRect = frameContainer.getBoundingClientRect();
      const frameRect = this.frameWrapper.getBoundingClientRect();
      
      const maxLeft = containerRect.width - frameRect.width;
      const maxTop = containerRect.height - frameRect.height;
      
      newLeft = Math.max(-20, Math.min(newLeft, maxLeft + 20));
      newTop = Math.max(-20, Math.min(newTop, maxTop + 20));
      
      this.frameWrapper.style.left = `${newLeft}px`;
      this.frameWrapper.style.top = `${newTop}px`;
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
    
    document.addEventListener('mouseleave', () => {
      isDragging = false;
    });
    
    this.frameWrapper.addEventListener('touchstart', (e) => {
      if (e.target === this.frameWrapper || e.target === this.deviceFrame) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        
        const currentLeft = parseInt(this.frameWrapper.style.left || '0');
        const currentTop = parseInt(this.frameWrapper.style.top || '0');
        
        offsetX = currentLeft;
        offsetY = currentTop;
        
        e.preventDefault();
      }
    });
    
    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      const deltaX = e.touches[0].clientX - startX;
      const deltaY = e.touches[0].clientY - startY;
      
      let newLeft = offsetX + deltaX;
      let newTop = offsetY + deltaY;
      
      const containerRect = frameContainer.getBoundingClientRect();
      const frameRect = this.frameWrapper.getBoundingClientRect();
      
      const maxLeft = containerRect.width - frameRect.width;
      const maxTop = containerRect.height - frameRect.height;
      
      newLeft = Math.max(-20, Math.min(newLeft, maxLeft + 20));
      newTop = Math.max(-20, Math.min(newTop, maxTop + 20));
      
      this.frameWrapper.style.left = `${newLeft}px`;
      this.frameWrapper.style.top = `${newTop}px`;
    });
    
    document.addEventListener('touchend', () => {
      isDragging = false;
    });
    
    document.addEventListener('touchcancel', () => {
      isDragging = false;
    });
  }
  
  handleWindowResize() {
    const handleResize = () => {
      const width = parseInt(this.widthInput.value) || 375;
      const height = parseInt(this.heightInput.value) || 667;
      
      this.updateFrameDimensions(width, height);
      
      const frameContainer = this.shadowRoot.getElementById('frame-container');
      const containerRect = frameContainer.getBoundingClientRect();
      const frameRect = this.frameWrapper.getBoundingClientRect();
      
      if (frameRect.right > containerRect.right || frameRect.bottom > containerRect.bottom) {
        this.frameWrapper.style.left = '0px';
        this.frameWrapper.style.top = '0px';
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    this.previewFrame.addEventListener('load', () => {
      const width = parseInt(this.widthInput.value) || 375;
      const height = parseInt(this.heightInput.value) || 667;
      
      this.updateFrameDimensions(width, height);
      
      this.frameWrapper.style.left = '0px';
      this.frameWrapper.style.top = '0px';
      
      this.showNotification('Content loaded successfully');
    });
  }
  
  showNotification(message, type = 'success') {
    const existingNotification = this.shadowRoot.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.position = 'fixed';
    notification.style.top = '2rem';
    notification.style.right = '2rem';
    notification.style.zIndex = '9999';
    notification.style.pointerEvents = 'none';
    
    this.shadowRoot.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
}

customElements.define('tool-breakpoint-tester', ToolBreakpointTester);
