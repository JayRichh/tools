class ToolTextTransform extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        flex: 1;
        display: flex;
        align-items: center;
        box-sizing: border-box;
      }
      
      *, *::before, *::after {
        box-sizing: border-box;
      }
      
      .container {
        width: 100%;
        position: relative;
        padding: 1rem 0;
      }
      
      .main-content {
        display: grid;
        grid-template-rows: auto auto 1fr;
        gap: 1.5rem;
        padding: 1rem;
        width: min(100%, 900px);
        margin: 0 auto;
        max-width: 100%;
      }
      
      h1 {
        font-size: 2rem;
        color: var(--dark-sage, #6b6b54);
        line-height: 1.1;
        margin: 0;
        letter-spacing: -0.02em;
        font-weight: 800;
        text-align: center;
      }
      
      p {
        font-size: 1rem;
        color: var(--text-primary, #6b6b54);
        max-width: 45ch;
        margin: 0 auto;
        line-height: 1.5;
        opacity: 0.9;
        text-align: center;
      }
      
      .tabs {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }
      
      .tab {
        padding: 0.75rem 1.25rem;
        background: var(--beige, #f5f5dc);
        border: none;
        border-radius: 0.5rem;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--dark-sage, #6b6b54);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .tab:hover {
        background: var(--vanilla, #f8f8e8);
      }
      
      .tab.active {
        background: var(--buff, #d8a48f);
        color: white;
      }
      
      .tab-content {
        display: none;
      }
      
      .tab-content.active {
        display: block;
      }
      
      .transform-container {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .panel {
        display: flex;
        flex-direction: column;
        background: var(--beige, #f5f5dc);
        border-radius: 0.5rem;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      
      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
        background: var(--sage, #9c9c7e);
        color: white;
      }
      
      .panel-title {
        font-weight: 600;
        font-size: 0.875rem;
      }
      
      .action-button {
        background: transparent;
        border: none;
        color: white;
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .action-button:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      .text-input {
        flex: 1;
        padding: 1rem;
        border: none;
        resize: none;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.875rem;
        line-height: 1.5;
        background: white;
        color: var(--text-primary, #333);
        min-height: 150px;
      }
      
      .text-input:focus {
        outline: none;
      }
      
      .text-output {
        flex: 1;
        padding: 1rem;
        overflow-y: auto;
        background: white;
        color: var(--text-primary, #333);
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.875rem;
        line-height: 1.5;
        min-height: 150px;
      }
      
      .button-group {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
        margin-top: 1rem;
        flex-wrap: wrap;
      }
      
      button {
        background: var(--buff, #d8a48f);
        border: none;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        letter-spacing: 0.02em;
      }
      
      button:hover {
        background: var(--deep-buff, #b37a68);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      button:active {
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      button.secondary {
        background: var(--sage, #9c9c7e);
      }
      
      button.secondary:hover {
        background: var(--dark-sage, #6b6b54);
      }
      
      .notification {
        position: fixed;
        top: 4rem;
        right: 1rem;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        background: var(--dark-sage, #6b6b54);
        color: white;
        font-size: 0.875rem;
        opacity: 0;
        transform: translateY(-1rem);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
      }
      
      .notification.show {
        opacity: 1;
        transform: translateY(0);
      }
      
      .notification.success {
        background: #2ecc71;
      }
    `;
    
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="container">
        <div class="main-content">
          <h1>Text Transform</h1>
          <p>Encode, decode, and transform text for various applications</p>
          
          <div class="tabs">
            <button class="tab active" data-tab="url">URL Encoder/Decoder</button>
            <button class="tab" data-tab="base64">Base64 Encoder/Decoder</button>
            <button class="tab" data-tab="case">Case Converter</button>
            <button class="tab" data-tab="csv">CSV to JSON</button>
          </div>
          
          <div class="tab-content active" data-content="url">
            <div class="transform-container">
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">Input Text</span>
                  <button class="action-button" id="url-clear">Clear</button>
                </div>
                <textarea id="url-input" class="text-input" placeholder="Enter text to encode or decode..."></textarea>
              </div>
              
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">Output</span>
                  <button class="action-button" id="url-copy">Copy</button>
                </div>
                <div id="url-output" class="text-output"></div>
              </div>
            </div>
            
            <div class="button-group">
              <button id="url-encode">URL Encode</button>
              <button id="url-decode">URL Decode</button>
              <button id="url-encode-component" class="secondary">Encode URI Component</button>
              <button id="url-decode-component" class="secondary">Decode URI Component</button>
            </div>
          </div>
          
          <div class="tab-content" data-content="base64">
            <div class="transform-container">
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">Input Text</span>
                  <button class="action-button" id="base64-clear">Clear</button>
                </div>
                <textarea id="base64-input" class="text-input" placeholder="Enter text to encode or decode..."></textarea>
              </div>
              
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">Output</span>
                  <button class="action-button" id="base64-copy">Copy</button>
                </div>
                <div id="base64-output" class="text-output"></div>
              </div>
            </div>
            
            <div class="button-group">
              <button id="base64-encode">Base64 Encode</button>
              <button id="base64-decode">Base64 Decode</button>
            </div>
          </div>
          
          <div class="tab-content" data-content="case">
            <div class="transform-container">
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">Input Text</span>
                  <button class="action-button" id="case-clear">Clear</button>
                </div>
                <textarea id="case-input" class="text-input" placeholder="Enter text to convert..."></textarea>
              </div>
              
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">Output</span>
                  <button class="action-button" id="case-copy">Copy</button>
                </div>
                <div id="case-output" class="text-output"></div>
              </div>
            </div>
            
            <div class="button-group">
              <button id="case-upper">UPPERCASE</button>
              <button id="case-lower">lowercase</button>
              <button id="case-title">Title Case</button>
              <button id="case-camel" class="secondary">camelCase</button>
              <button id="case-pascal" class="secondary">PascalCase</button>
              <button id="case-snake" class="secondary">snake_case</button>
              <button id="case-kebab" class="secondary">kebab-case</button>
            </div>
          </div>
          
          <div class="tab-content" data-content="csv">
            <div class="transform-container">
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">CSV Input</span>
                  <button class="action-button" id="csv-clear">Clear</button>
                </div>
                <textarea id="csv-input" class="text-input" placeholder="Enter CSV data (comma-separated values)..."></textarea>
              </div>
              
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">JSON Output</span>
                  <button class="action-button" id="csv-copy">Copy</button>
                </div>
                <div id="csv-output" class="text-output"></div>
              </div>
            </div>
            
            <div class="button-group">
              <button id="csv-convert">Convert to JSON</button>
              <button id="csv-pretty" class="secondary">Pretty JSON</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  
  connectedCallback() {
    // Tab switching
    const tabs = this.shadowRoot.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchTab(tab.dataset.tab);
      });
    });
    
    // Initialize tabs
    this.initUrlTab();
    this.initBase64Tab();
    this.initCaseTab();
    this.initCsvTab();
  }
  
  switchTab(tabId) {
    // Update active tab buttons
    const tabs = this.shadowRoot.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabId);
    });
    
    // Update tab content
    const contents = this.shadowRoot.querySelectorAll('.tab-content');
    contents.forEach(content => {
      content.classList.toggle('active', content.dataset.content === tabId);
    });
  }
  
  initUrlTab() {
    const urlInput = this.shadowRoot.getElementById('url-input');
    const urlOutput = this.shadowRoot.getElementById('url-output');
    const encodeBtn = this.shadowRoot.getElementById('url-encode');
    const decodeBtn = this.shadowRoot.getElementById('url-decode');
    const encodeComponentBtn = this.shadowRoot.getElementById('url-encode-component');
    const decodeComponentBtn = this.shadowRoot.getElementById('url-decode-component');
    const clearBtn = this.shadowRoot.getElementById('url-clear');
    const copyBtn = this.shadowRoot.getElementById('url-copy');
    
    // URL Encode button
    encodeBtn.addEventListener('click', () => {
      try {
        const encoded = encodeURI(urlInput.value);
        urlOutput.textContent = encoded;
        this.showNotification('URL encoded successfully');
      } catch (error) {
        urlOutput.textContent = `Error: ${error.message}`;
      }
    });
    
    // URL Decode button
    decodeBtn.addEventListener('click', () => {
      try {
        const decoded = decodeURI(urlInput.value);
        urlOutput.textContent = decoded;
        this.showNotification('URL decoded successfully');
      } catch (error) {
        urlOutput.textContent = `Error: ${error.message}`;
      }
    });
    
    // Encode URI Component button
    encodeComponentBtn.addEventListener('click', () => {
      try {
        const encoded = encodeURIComponent(urlInput.value);
        urlOutput.textContent = encoded;
        this.showNotification('URI component encoded successfully');
      } catch (error) {
        urlOutput.textContent = `Error: ${error.message}`;
      }
    });
    
    // Decode URI Component button
    decodeComponentBtn.addEventListener('click', () => {
      try {
        const decoded = decodeURIComponent(urlInput.value);
        urlOutput.textContent = decoded;
        this.showNotification('URI component decoded successfully');
      } catch (error) {
        urlOutput.textContent = `Error: ${error.message}`;
      }
    });
    
    // Clear button
    clearBtn.addEventListener('click', () => {
      urlInput.value = '';
      urlOutput.textContent = '';
    });
    
    // Copy button
    copyBtn.addEventListener('click', () => {
      const text = urlOutput.textContent;
      if (text) {
        navigator.clipboard.writeText(text)
          .then(() => {
            this.showNotification('Copied to clipboard', 'success');
          })
          .catch(err => {
            console.error('Could not copy text: ', err);
          });
      }
    });
  }
  
  initBase64Tab() {
    const base64Input = this.shadowRoot.getElementById('base64-input');
    const base64Output = this.shadowRoot.getElementById('base64-output');
    const encodeBtn = this.shadowRoot.getElementById('base64-encode');
    const decodeBtn = this.shadowRoot.getElementById('base64-decode');
    const clearBtn = this.shadowRoot.getElementById('base64-clear');
    const copyBtn = this.shadowRoot.getElementById('base64-copy');
    
    // Base64 Encode button
    encodeBtn.addEventListener('click', () => {
      try {
        const encoded = btoa(unescape(encodeURIComponent(base64Input.value)));
        base64Output.textContent = encoded;
        this.showNotification('Base64 encoded successfully');
      } catch (error) {
        base64Output.textContent = `Error: ${error.message}`;
      }
    });
    
    // Base64 Decode button
    decodeBtn.addEventListener('click', () => {
      try {
        const decoded = decodeURIComponent(escape(atob(base64Input.value)));
        base64Output.textContent = decoded;
        this.showNotification('Base64 decoded successfully');
      } catch (error) {
        base64Output.textContent = `Error: ${error.message}`;
      }
    });
    
    // Clear button
    clearBtn.addEventListener('click', () => {
      base64Input.value = '';
      base64Output.textContent = '';
    });
    
    // Copy button
    copyBtn.addEventListener('click', () => {
      const text = base64Output.textContent;
      if (text) {
        navigator.clipboard.writeText(text)
          .then(() => {
            this.showNotification('Copied to clipboard', 'success');
          })
          .catch(err => {
            console.error('Could not copy text: ', err);
          });
      }
    });
  }
  
  initCaseTab() {
    const caseInput = this.shadowRoot.getElementById('case-input');
    const caseOutput = this.shadowRoot.getElementById('case-output');
    const upperBtn = this.shadowRoot.getElementById('case-upper');
    const lowerBtn = this.shadowRoot.getElementById('case-lower');
    const titleBtn = this.shadowRoot.getElementById('case-title');
    const camelBtn = this.shadowRoot.getElementById('case-camel');
    const pascalBtn = this.shadowRoot.getElementById('case-pascal');
    const snakeBtn = this.shadowRoot.getElementById('case-snake');
    const kebabBtn = this.shadowRoot.getElementById('case-kebab');
    const clearBtn = this.shadowRoot.getElementById('case-clear');
    const copyBtn = this.shadowRoot.getElementById('case-copy');
    
    // Uppercase button
    upperBtn.addEventListener('click', () => {
      caseOutput.textContent = caseInput.value.toUpperCase();
      this.showNotification('Converted to uppercase');
    });
    
    // Lowercase button
    lowerBtn.addEventListener('click', () => {
      caseOutput.textContent = caseInput.value.toLowerCase();
      this.showNotification('Converted to lowercase');
    });
    
    // Title Case button
    titleBtn.addEventListener('click', () => {
      caseOutput.textContent = this.toTitleCase(caseInput.value);
      this.showNotification('Converted to title case');
    });
    
    // camelCase button
    camelBtn.addEventListener('click', () => {
      caseOutput.textContent = this.toCamelCase(caseInput.value);
      this.showNotification('Converted to camelCase');
    });
    
    // PascalCase button
    pascalBtn.addEventListener('click', () => {
      caseOutput.textContent = this.toPascalCase(caseInput.value);
      this.showNotification('Converted to PascalCase');
    });
    
    // snake_case button
    snakeBtn.addEventListener('click', () => {
      caseOutput.textContent = this.toSnakeCase(caseInput.value);
      this.showNotification('Converted to snake_case');
    });
    
    // kebab-case button
    kebabBtn.addEventListener('click', () => {
      caseOutput.textContent = this.toKebabCase(caseInput.value);
      this.showNotification('Converted to kebab-case');
    });
    
    // Clear button
    clearBtn.addEventListener('click', () => {
      caseInput.value = '';
      caseOutput.textContent = '';
    });
    
    // Copy button
    copyBtn.addEventListener('click', () => {
      const text = caseOutput.textContent;
      if (text) {
        navigator.clipboard.writeText(text)
          .then(() => {
            this.showNotification('Copied to clipboard', 'success');
          })
          .catch(err => {
            console.error('Could not copy text: ', err);
          });
      }
    });
  }
  
  initCsvTab() {
    const csvInput = this.shadowRoot.getElementById('csv-input');
    const csvOutput = this.shadowRoot.getElementById('csv-output');
    const convertBtn = this.shadowRoot.getElementById('csv-convert');
    const prettyBtn = this.shadowRoot.getElementById('csv-pretty');
    const clearBtn = this.shadowRoot.getElementById('csv-clear');
    const copyBtn = this.shadowRoot.getElementById('csv-copy');
    
    // Convert to JSON button
    convertBtn.addEventListener('click', () => {
      try {
        const json = this.csvToJson(csvInput.value);
        csvOutput.textContent = JSON.stringify(json);
        this.showNotification('Converted to JSON');
      } catch (error) {
        csvOutput.textContent = `Error: ${error.message}`;
      }
    });
    
    // Pretty JSON button
    prettyBtn.addEventListener('click', () => {
      try {
        // Try to parse as JSON first
        let json;
        try {
          json = JSON.parse(csvOutput.textContent);
        } catch {
          // If not valid JSON, try to convert from CSV
          json = this.csvToJson(csvInput.value);
        }
        
        csvOutput.textContent = JSON.stringify(json, null, 2);
        this.showNotification('JSON formatted');
      } catch (error) {
        csvOutput.textContent = `Error: ${error.message}`;
      }
    });
    
    // Clear button
    clearBtn.addEventListener('click', () => {
      csvInput.value = '';
      csvOutput.textContent = '';
    });
    
    // Copy button
    copyBtn.addEventListener('click', () => {
      const text = csvOutput.textContent;
      if (text) {
        navigator.clipboard.writeText(text)
          .then(() => {
            this.showNotification('Copied to clipboard', 'success');
          })
          .catch(err => {
            console.error('Could not copy text: ', err);
          });
      }
    });
  }
  
  // Helper methods for case conversion
  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }
  
  toCamelCase(str) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '')
      .replace(/[-_]/g, '');
  }
  
  toPascalCase(str) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase())
      .replace(/\s+/g, '')
      .replace(/[-_]/g, '');
  }
  
  toSnakeCase(str) {
    return str
      .replace(/\s+/g, '_')
      .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
      .replace(/^_/, '')
      .replace(/[-]/g, '_')
      .replace(/_+/g, '_');
  }
  
  toKebabCase(str) {
    return str
      .replace(/\s+/g, '-')
      .replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
      .replace(/^-/, '')
      .replace(/[_]/g, '-')
      .replace(/-+/g, '-');
  }
  
  // Helper method for CSV to JSON conversion
  csvToJson(csv) {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',').map(header => header.trim());
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const obj = {};
      const currentLine = lines[i].split(',');
      
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentLine[j]?.trim() || '';
      }
      
      result.push(obj);
    }
    
    return result;
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

customElements.define('tool-text-transform', ToolTextTransform);
