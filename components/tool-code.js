class ToolCode extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Load external stylesheet
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '../../styles/tool-code.css');
    
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="container">
        <div class="main-content">
          <h1>Code Tools</h1>
          <p>Format, validate, and beautify code in various languages</p>
          
          <div class="tabs">
            <button class="tab active" data-tab="json">JSON Formatter</button>
            <button class="tab" data-tab="regex">Regex Tester</button>
            <button class="tab" data-tab="diff">Text Diff</button>
            <button class="tab" data-tab="beautify">Code Beautifier</button>
          </div>
          
          <div class="tab-content active" data-content="json">
            <div class="editor-container">
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">Input JSON</span>
                  <button class="action-button" id="json-clear">Clear</button>
                </div>
                <textarea id="json-input" class="code-input" placeholder="Paste your JSON here..."></textarea>
              </div>
              
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">Formatted JSON</span>
                  <button class="action-button" id="json-copy">Copy</button>
                </div>
                <div id="json-output" class="code-output"></div>
              </div>
            </div>
            
            <div class="button-group">
              <button id="json-format">Format JSON</button>
              <button id="json-validate" class="secondary">Validate JSON</button>
              <button id="json-minify" class="secondary">Minify JSON</button>
            </div>
          </div>
          
          <div class="tab-content" data-content="regex">
            <div class="editor-container">
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">Regular Expression</span>
                </div>
                <input type="text" id="regex-pattern" class="code-input" placeholder="Enter regex pattern (without slashes)..." style="font-size: 1rem; height: 3rem;">
                
                <div class="panel-header" style="margin-top: 1rem;">
                  <span class="panel-title">Test String</span>
                  <button class="action-button" id="regex-clear">Clear</button>
                </div>
                <textarea id="regex-input" class="code-input" placeholder="Enter text to test against the regex..."></textarea>
              </div>
              
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">Matches</span>
                  <span id="regex-match-count">0 matches</span>
                </div>
                <div id="regex-output" class="code-output"></div>
              </div>
            </div>
            
            <div class="button-group">
              <button id="regex-test">Test Regex</button>
              <button id="regex-replace" class="secondary">Replace</button>
            </div>
          </div>
          
          <div class="tab-content" data-content="diff">
            <div class="editor-container">
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">Original Text</span>
                  <button class="action-button" id="diff-clear-original">Clear</button>
                </div>
                <textarea id="diff-original" class="code-input" placeholder="Paste original text here..."></textarea>
              </div>
              
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">Modified Text</span>
                  <button class="action-button" id="diff-clear-modified">Clear</button>
                </div>
                <textarea id="diff-modified" class="code-input" placeholder="Paste modified text here..."></textarea>
              </div>
            </div>
            
            <div class="panel" style="margin-top: 1rem;">
              <div class="panel-header">
                <span class="panel-title">Diff Result</span>
                <button class="action-button" id="diff-copy">Copy</button>
              </div>
              <div id="diff-output" class="code-output"></div>
            </div>
            
            <div class="button-group">
              <button id="diff-compare">Compare Texts</button>
            </div>
          </div>
          
          <div class="tab-content" data-content="beautify">
            <div class="editor-container">
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">Input Code</span>
                  <button class="action-button" id="beautify-clear">Clear</button>
                </div>
                <textarea id="beautify-input" class="code-input" placeholder="Paste your code here..."></textarea>
              </div>
              
              <div class="panel">
                <div class="panel-header">
                  <span class="panel-title">Beautified Code</span>
                  <button class="action-button" id="beautify-copy">Copy</button>
                </div>
                <div id="beautify-output" class="code-output"></div>
              </div>
            </div>
            
            <div class="button-group">
              <button id="beautify-format">Beautify Code</button>
              <button id="beautify-minify" class="secondary">Minify Code</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.shadowRoot.appendChild(linkElem);
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
    
    // Initialize JSON tab
    this.initJsonTab();
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
  
  initJsonTab() {
    const jsonInput = this.shadowRoot.getElementById('json-input');
    const jsonOutput = this.shadowRoot.getElementById('json-output');
    const formatBtn = this.shadowRoot.getElementById('json-format');
    const validateBtn = this.shadowRoot.getElementById('json-validate');
    const minifyBtn = this.shadowRoot.getElementById('json-minify');
    const clearBtn = this.shadowRoot.getElementById('json-clear');
    const copyBtn = this.shadowRoot.getElementById('json-copy');
    
    // Format JSON button
    formatBtn.addEventListener('click', () => {
      try {
        // Parse JSON
        const json = JSON.parse(jsonInput.value);
        
        // Format JSON
        const formattedJson = JSON.stringify(json, null, 2);
        
        // Display formatted JSON
        jsonOutput.textContent = formattedJson;
      } catch (error) {
        jsonOutput.textContent = `Error: ${error.message}`;
      }
    });
    
    // Validate JSON button
    validateBtn.addEventListener('click', () => {
      try {
        // Parse JSON
        JSON.parse(jsonInput.value);
        
        // Display success message
        jsonOutput.textContent = 'JSON is valid!';
      } catch (error) {
        jsonOutput.textContent = `Error: ${error.message}`;
      }
    });
    
    // Minify JSON button
    minifyBtn.addEventListener('click', () => {
      try {
        // Parse JSON
        const json = JSON.parse(jsonInput.value);
        
        // Minify JSON
        const minifiedJson = JSON.stringify(json);
        
        // Display minified JSON
        jsonOutput.textContent = minifiedJson;
      } catch (error) {
        jsonOutput.textContent = `Error: ${error.message}`;
      }
    });
    
    // Clear button
    clearBtn.addEventListener('click', () => {
      jsonInput.value = '';
      jsonOutput.innerHTML = '';
    });
    
    // Copy button
    copyBtn.addEventListener('click', () => {
      const text = jsonOutput.textContent;
      if (text) {
        navigator.clipboard.writeText(text);
      }
    });
  }
}

customElements.define('tool-code', ToolCode);
