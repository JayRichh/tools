class ToolSeoChecker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Load external stylesheet
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '../styles/tool-seo-checker.css');
    
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="container">
        <div class="main-content">
          <h1>Bulk SEO Checker</h1>
          <p>Analyze multiple pages for SEO elements including meta tags, structured data, and more</p>
          
          <div class="seo-checker">
            <div class="input-tabs">
              <button class="tab-button active" data-tab="sitemap">📄 Sitemap</button>
              <button class="tab-button" data-tab="urls">📝 URL List</button>
              <button class="tab-button" data-tab="files">📁 HTML Files</button>
              <button class="tab-button" data-tab="import">⚙️ Import</button>
            </div>
            
            <div class="tab-content active" data-tab="sitemap">
              <div class="input-section">
                <h3>XML Sitemap Analysis</h3>
                <div class="input-group">
                  <label for="sitemap-input">Paste sitemap.xml content or URL:</label>
                  <textarea id="sitemap-input" placeholder="Paste your sitemap.xml content here or enter sitemap URL..."></textarea>
                </div>
                <div class="file-upload-area" id="sitemap-upload">
                  <span>Or drag & drop sitemap.xml file</span>
                  <input type="file" id="sitemap-file" accept=".xml,.txt" hidden>
                </div>
              </div>
            </div>
            
            <div class="tab-content" data-tab="urls">
              <div class="input-section">
                <h3>URL List Analysis</h3>
                <div class="input-group">
                  <label for="url-input">Enter URLs (one per line):</label>
                  <textarea id="url-input" placeholder="https://example.com/page1
https://example.com/page2
https://example.com/page3"></textarea>
                </div>
                <div class="file-upload-area" id="csv-upload">
                  <span>Or upload CSV file with URLs</span>
                  <input type="file" id="csv-file" accept=".csv,.txt" hidden>
                </div>
              </div>
            </div>
            
            <div class="tab-content" data-tab="files">
              <div class="input-section">
                <h3>HTML File Analysis</h3>
                <div class="file-upload-area" id="html-upload">
                  <span>Drag & drop HTML files for offline analysis</span>
                  <input type="file" id="html-files" accept=".html,.htm" multiple hidden>
                </div>
                <div class="file-list" id="html-file-list"></div>
              </div>
            </div>
            
            <div class="tab-content" data-tab="import">
              <div class="input-section">
                <h3>Import Configuration</h3>
                <div class="file-upload-area" id="json-upload">
                  <span>Upload JSON configuration file</span>
                  <input type="file" id="json-file" accept=".json" hidden>
                </div>
                <div class="input-group">
                  <label for="json-input">Or paste JSON configuration:</label>
                  <textarea id="json-input" placeholder='{"urls": ["https://example.com"], "settings": {"concurrent": 2}}'></textarea>
                </div>
              </div>
            </div>
            
            <div class="analysis-settings">
              <h3>Analysis Settings</h3>
              <div class="settings-grid">
                <div class="setting-item">
                  <label for="concurrent-limit">Concurrent Requests:</label>
                  <select id="concurrent-limit">
                    <option value="1">1 (Safe)</option>
                    <option value="2" selected>2 (Recommended)</option>
                    <option value="3">3 (Fast)</option>
                    <option value="5">5 (Aggressive)</option>
                  </select>
                </div>
                <div class="setting-item">
                  <label for="retry-attempts">Retry Attempts:</label>
                  <select id="retry-attempts">
                    <option value="1">1</option>
                    <option value="2" selected>2</option>
                    <option value="3">3</option>
                  </select>
                </div>
                <div class="setting-item">
                  <label for="include-images">Analyze Images:</label>
                  <input type="checkbox" id="include-images" checked>
                </div>
                <div class="setting-item">
                  <label for="include-links">Analyze Links:</label>
                  <input type="checkbox" id="include-links" checked>
                </div>
              </div>
            </div>
            
            <div class="action-buttons">
              <button class="analyze-button" id="start-analysis">🔍 Start Analysis</button>
              <button class="clear-button" id="clear-results">🗑️ Clear Results</button>
            </div>
            
            <div class="progress-section" id="progress-section" style="display: none;">
              <div class="progress-header">
                <h3>Analysis Progress</h3>
                <div class="progress-controls">
                  <button id="pause-analysis">⏸️ Pause</button>
                  <button id="resume-analysis" style="display: none;">▶️ Resume</button>
                  <button id="stop-analysis">⏹️ Stop</button>
                </div>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" id="progress-fill"></div>
              </div>
              <div class="progress-stats">
                <span id="progress-text">0 / 0 completed</span>
                <span id="progress-time">Estimated: --</span>
              </div>
              <div class="current-status" id="current-status">
                Initializing...
              </div>
            </div>
            
            <div class="results-section" id="results-section" style="display: none;">
              <div class="results-header">
                <h3>Analysis Results</h3>
                <div class="results-controls">
                  <div class="filter-group">
                    <select id="filter-status">
                      <option value="all">All Pages</option>
                      <option value="success">Successful</option>
                      <option value="error">Errors</option>
                      <option value="warning">Warnings</option>
                    </select>
                    <select id="sort-results">
                      <option value="score-desc">Score (High to Low)</option>
                      <option value="score-asc">Score (Low to High)</option>
                      <option value="url">URL (A-Z)</option>
                      <option value="issues">Issues Count</option>
                    </select>
                  </div>
                  <div class="export-group">
                    <button id="export-csv">📊 Export CSV</button>
                    <button id="export-json">📄 Export JSON</button>
                  </div>
                </div>
              </div>
              
              <div class="results-summary" id="results-summary">
                <div class="summary-card">
                  <h4>Overall Score</h4>
                  <div class="score-display" id="overall-score">--</div>
                </div>
                <div class="summary-card">
                  <h4>Pages Analyzed</h4>
                  <div class="stat-display" id="pages-count">0</div>
                </div>
                <div class="summary-card">
                  <h4>Critical Issues</h4>
                  <div class="stat-display error" id="critical-issues">0</div>
                </div>
                <div class="summary-card">
                  <h4>Warnings</h4>
                  <div class="stat-display warning" id="warning-issues">0</div>
                </div>
              </div>
              
              <div class="results-table-container">
                <table class="results-table" id="results-table">
                  <thead>
                    <tr>
                      <th>URL</th>
                      <th>Score</th>
                      <th>Title</th>
                      <th>Meta Desc.</th>
                      <th>Issues</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="results-tbody">
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="detailed-view" id="detailed-view" style="display: none;">
              <div class="detailed-dialog">
                <div class="detailed-header">
                  <h3 id="detailed-title">Page Details</h3>
                  <button id="close-detailed">✕</button>
                </div>
                <div class="detailed-content" id="detailed-content">
                  <!-- Detailed analysis content will be populated here -->
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
    
    // Initialize state
    this.analysisQueue = [];
    this.analysisResults = [];
    this.isAnalyzing = false;
    this.isPaused = false;
    this.currentIndex = 0;
    this.startTime = null;
    
    // GitHub Pages compatible CORS proxies
    this.corsProxies = [
      {
        url: 'https://api.allorigins.win/get?url=',
        name: 'AllOrigins',
        parseResponse: (data) => data.contents,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      },
      {
        url: 'https://cors-proxy.htmldriven.com/?url=',
        name: 'HTMLDriven',
        parseResponse: (data) => typeof data === 'string' ? data : data.body || data.contents || data
      },
      {
        url: 'https://proxy.cors.sh/',
        name: 'CORS.sh',
        parseResponse: (data) => data
      }
    ];
    
    // Detect GitHub Pages environment
    this.isGitHubPages = window.location.hostname.includes('github.io');
    this.baseUrl = this.isGitHubPages ? window.location.origin : window.location.origin;
  }
  
  connectedCallback() {
    this.initializeElements();
    this.setupEventListeners();
  }
  
  initializeElements() {
    // Tab elements
    this.tabButtons = this.shadowRoot.querySelectorAll('.tab-button');
    this.tabContents = this.shadowRoot.querySelectorAll('.tab-content');
    
    // Input elements
    this.sitemapInput = this.shadowRoot.getElementById('sitemap-input');
    this.urlInput = this.shadowRoot.getElementById('url-input');
    this.sitemapFile = this.shadowRoot.getElementById('sitemap-file');
    this.csvFile = this.shadowRoot.getElementById('csv-file');
    this.htmlFiles = this.shadowRoot.getElementById('html-files');
    this.jsonFile = this.shadowRoot.getElementById('json-file');
    this.jsonInput = this.shadowRoot.getElementById('json-input');
    
    // Settings elements
    this.concurrentLimit = this.shadowRoot.getElementById('concurrent-limit');
    this.retryAttempts = this.shadowRoot.getElementById('retry-attempts');
    this.includeImages = this.shadowRoot.getElementById('include-images');
    this.includeLinks = this.shadowRoot.getElementById('include-links');
    
    // Control elements
    this.startButton = this.shadowRoot.getElementById('start-analysis');
    this.clearButton = this.shadowRoot.getElementById('clear-results');
    this.pauseButton = this.shadowRoot.getElementById('pause-analysis');
    this.resumeButton = this.shadowRoot.getElementById('resume-analysis');
    this.stopButton = this.shadowRoot.getElementById('stop-analysis');
    
    // Progress elements
    this.progressSection = this.shadowRoot.getElementById('progress-section');
    this.progressFill = this.shadowRoot.getElementById('progress-fill');
    this.progressText = this.shadowRoot.getElementById('progress-text');
    this.progressTime = this.shadowRoot.getElementById('progress-time');
    this.currentStatus = this.shadowRoot.getElementById('current-status');
    
    // Results elements
    this.resultsSection = this.shadowRoot.getElementById('results-section');
    this.filterStatus = this.shadowRoot.getElementById('filter-status');
    this.sortResults = this.shadowRoot.getElementById('sort-results');
    this.exportCsv = this.shadowRoot.getElementById('export-csv');
    this.exportJson = this.shadowRoot.getElementById('export-json');
    this.overallScore = this.shadowRoot.getElementById('overall-score');
    this.pagesCount = this.shadowRoot.getElementById('pages-count');
    this.criticalIssues = this.shadowRoot.getElementById('critical-issues');
    this.warningIssues = this.shadowRoot.getElementById('warning-issues');
    this.resultsTable = this.shadowRoot.getElementById('results-table');
    this.resultsTbody = this.shadowRoot.getElementById('results-tbody');
    
    // Detailed view elements
    this.detailedView = this.shadowRoot.getElementById('detailed-view');
    this.detailedTitle = this.shadowRoot.getElementById('detailed-title');
    this.detailedContent = this.shadowRoot.getElementById('detailed-content');
    this.closeDetailed = this.shadowRoot.getElementById('close-detailed');
    
    // Error message
    this.errorMessage = this.shadowRoot.getElementById('error-message');
  }
  
  setupEventListeners() {
    // Tab switching
    this.tabButtons.forEach(button => {
      button.addEventListener('click', () => this.switchTab(button.dataset.tab));
    });
    
    // File upload areas
    this.setupFileUpload('sitemap-upload', 'sitemap-file', this.handleSitemapFile.bind(this));
    this.setupFileUpload('csv-upload', 'csv-file', this.handleCsvFile.bind(this));
    this.setupFileUpload('html-upload', 'html-files', this.handleHtmlFiles.bind(this));
    this.setupFileUpload('json-upload', 'json-file', this.handleJsonFile.bind(this));
    
    // Control buttons
    this.startButton.addEventListener('click', () => this.startAnalysis());
    this.clearButton.addEventListener('click', () => this.clearResults());
    this.pauseButton.addEventListener('click', () => this.pauseAnalysis());
    this.resumeButton.addEventListener('click', () => this.resumeAnalysis());
    this.stopButton.addEventListener('click', () => this.stopAnalysis());
    
    // Results controls
    this.filterStatus.addEventListener('change', () => this.updateResultsDisplay());
    this.sortResults.addEventListener('change', () => this.updateResultsDisplay());
    this.exportCsv.addEventListener('click', () => this.exportResults('csv'));
    this.exportJson.addEventListener('click', () => this.exportResults('json'));
    
    // Detailed view
    this.closeDetailed.addEventListener('click', () => this.closeDetailedView());
    
    // Backdrop click to close detailed view
    this.detailedView.addEventListener('click', (e) => {
      if (e.target === this.detailedView) {
        this.closeDetailedView();
      }
    });
    
    // Prevent dialog content clicks from closing
    const detailedDialog = this.shadowRoot.querySelector('.detailed-dialog');
    if (detailedDialog) {
      detailedDialog.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
    
    // Escape key to close detailed view
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.detailedView.style.display === 'block') {
        this.closeDetailedView();
      }
    });
  }
  
  setupFileUpload(areaId, fileId, handler) {
    const area = this.shadowRoot.getElementById(areaId);
    const input = this.shadowRoot.getElementById(fileId);
    
    area.addEventListener('click', () => input.click());
    area.addEventListener('dragover', (e) => {
      e.preventDefault();
      area.classList.add('dragover');
    });
    area.addEventListener('dragleave', () => area.classList.remove('dragover'));
    area.addEventListener('drop', (e) => {
      e.preventDefault();
      area.classList.remove('dragover');
      handler(e.dataTransfer.files);
    });
    
    input.addEventListener('change', (e) => handler(e.target.files));
  }
  
  switchTab(tabName) {
    this.tabButtons.forEach(btn => btn.classList.remove('active'));
    this.tabContents.forEach(content => content.classList.remove('active'));
    
    this.shadowRoot.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    this.shadowRoot.querySelector(`.tab-content[data-tab="${tabName}"]`).classList.add('active');
  }
  
  async handleSitemapFile(files) {
    if (files.length > 0) {
      const file = files[0];
      const content = await file.text();
      this.sitemapInput.value = content;
      this.showNotification(`Loaded sitemap: ${file.name}`, 'success');
    }
  }
  
  async handleCsvFile(files) {
    if (files.length > 0) {
      const file = files[0];
      const content = await file.text();
      const urls = this.parseCsvUrls(content);
      this.urlInput.value = urls.join('\n');
      this.showNotification(`Loaded ${urls.length} URLs from CSV`, 'success');
    }
  }
  
  parseCsvUrls(csvContent) {
    const lines = csvContent.split('\n');
    const urls = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && (trimmed.startsWith('http://') || trimmed.startsWith('https://'))) {
        urls.push(trimmed.split(',')[0].replace(/['"]/g, ''));
      }
    }
    
    return urls;
  }
  
  async handleHtmlFiles(files) {
    const fileList = this.shadowRoot.getElementById('html-file-list');
    fileList.innerHTML = '';
    
    for (const file of files) {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.innerHTML = `
        <span>${file.name}</span>
        <span>${(file.size / 1024).toFixed(1)} KB</span>
      `;
      fileList.appendChild(fileItem);
    }
    
    this.htmlFileList = Array.from(files);
    this.showNotification(`Selected ${files.length} HTML files`, 'success');
  }
  
  async handleJsonFile(files) {
    if (files.length > 0) {
      const file = files[0];
      const content = await file.text();
      this.jsonInput.value = content;
      this.showNotification(`Loaded configuration: ${file.name}`, 'success');
    }
  }
  
  async startAnalysis() {
    try {
      this.clearError();
      
      // Determine active tab and get URLs/files
      const activeTab = this.shadowRoot.querySelector('.tab-button.active').dataset.tab;
      let urlsToAnalyze = [];
      
      switch (activeTab) {
        case 'sitemap':
          urlsToAnalyze = await this.processSitemap();
          break;
        case 'urls':
          urlsToAnalyze = this.processUrlList();
          break;
        case 'files':
          return await this.processHtmlFiles();
        case 'import':
          urlsToAnalyze = await this.processJsonImport();
          break;
      }
      
      if (urlsToAnalyze.length === 0) {
        this.showError('No URLs to analyze. Please provide input data.');
        return;
      }
      
      if (urlsToAnalyze.length > 100) {
        if (!confirm(`You're about to analyze ${urlsToAnalyze.length} URLs. This may take a while. Continue?`)) {
          return;
        }
      }
      
      await this.runBatchAnalysis(urlsToAnalyze);
      
    } catch (error) {
      this.showError(`Analysis failed: ${error.message}`);
      console.error('Analysis error:', error);
    }
  }
  
  async processSitemap() {
    const content = this.sitemapInput.value.trim();
    if (!content) {
      throw new Error('Please provide sitemap content or URL');
    }
    
    // Check if it's a URL
    if (content.startsWith('http://') || content.startsWith('https://')) {
      try {
        const sitemapData = await this.fetchUrl(content);
        return this.extractUrlsFromSitemap(sitemapData);
      } catch (error) {
        throw new Error(`Failed to fetch sitemap from URL: ${error.message}`);
      }
    } else {
      // Assume it's XML content
      return this.extractUrlsFromSitemap(content);
    }
  }
  
  extractUrlsFromSitemap(xmlContent) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlContent, 'text/xml');
      
      // Check for XML parsing errors
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Invalid XML format');
      }
      
      const urlElements = doc.querySelectorAll('url loc, sitemap loc');
      const urls = Array.from(urlElements).map(loc => loc.textContent.trim());
      
      if (urls.length === 0) {
        throw new Error('No URLs found in sitemap');
      }
      
      return urls;
    } catch (error) {
      throw new Error(`Failed to parse sitemap: ${error.message}`);
    }
  }
  
  processUrlList() {
    const content = this.urlInput.value.trim();
    if (!content) {
      throw new Error('Please provide URLs to analyze');
    }
    
    const urls = content.split('\n')
      .map(url => url.trim())
      .filter(url => url && (url.startsWith('http://') || url.startsWith('https://')));
    
    if (urls.length === 0) {
      throw new Error('No valid URLs found');
    }
    
    return urls;
  }
  
  async processHtmlFiles() {
    if (!this.htmlFileList || this.htmlFileList.length === 0) {
      throw new Error('Please select HTML files to analyze');
    }
    
    this.analysisQueue = [];
    this.analysisResults = [];
    
    for (const file of this.htmlFileList) {
      const content = await file.text();
      const result = this.analyzePage(file.name, content, 'file');
      this.analysisResults.push(result);
    }
    
    this.displayResults();
    this.showNotification(`Analyzed ${this.htmlFileList.length} HTML files`, 'success');
  }
  
  async processJsonImport() {
    const content = this.jsonInput.value.trim();
    if (!content) {
      throw new Error('Please provide JSON configuration');
    }
    
    try {
      const config = JSON.parse(content);
      
      if (!config.urls || !Array.isArray(config.urls)) {
        throw new Error('JSON must contain "urls" array');
      }
      
      // Apply settings if provided
      if (config.settings) {
        if (config.settings.concurrent) {
          this.concurrentLimit.value = config.settings.concurrent;
        }
        if (config.settings.retries) {
          this.retryAttempts.value = config.settings.retries;
        }
      }
      
      return config.urls;
    } catch (error) {
      throw new Error(`Invalid JSON configuration: ${error.message}`);
    }
  }
  
  async runBatchAnalysis(urls) {
    this.analysisQueue = [...urls];
    this.analysisResults = [];
    this.currentIndex = 0;
    this.isAnalyzing = true;
    this.isPaused = false;
    this.startTime = Date.now();
    
    this.showProgressSection();
    this.updateProgress();
    
    const concurrentLimit = parseInt(this.concurrentLimit.value);
    const retryAttempts = parseInt(this.retryAttempts.value);
    
    const workers = [];
    for (let i = 0; i < concurrentLimit; i++) {
      workers.push(this.analyzeWorker(retryAttempts));
    }
    
    await Promise.all(workers);
    
    if (this.isAnalyzing) {
      this.completeAnalysis();
    }
  }
  
  async analyzeWorker(retryAttempts) {
    while (this.isAnalyzing && this.currentIndex < this.analysisQueue.length) {
      if (this.isPaused) {
        await new Promise(resolve => {
          const checkResume = () => {
            if (!this.isPaused || !this.isAnalyzing) {
              resolve();
            } else {
              setTimeout(checkResume, 100);
            }
          };
          checkResume();
        });
      }
      
      if (!this.isAnalyzing) break;
      
      const urlIndex = this.currentIndex++;
      if (urlIndex >= this.analysisQueue.length) break;
      
      const url = this.analysisQueue[urlIndex];
      this.updateCurrentStatus(`Fetching: ${url}`);
      
      let result = null;
      let attempts = 0;
      
      while (attempts < retryAttempts && !result && this.isAnalyzing) {
        attempts++;
        try {
          this.updateCurrentStatus(`Analyzing: ${url} (attempt ${attempts}/${retryAttempts})`);
          const html = await this.fetchUrl(url);
          this.updateCurrentStatus(`Processing: ${url}`);
          result = this.analyzePage(url, html, 'url');
          break;
        } catch (error) {
          if (attempts === retryAttempts) {
            // Provide helpful error messages based on the type of failure
            let userFriendlyError = error.message;
            let suggestions = [];
            
            if (error.message.includes('CORS') || error.message.includes('All methods failed')) {
              userFriendlyError = 'CORS blocked - unable to access this website';
              suggestions.push('Try using the HTML file upload feature instead');
              suggestions.push('Check if the website blocks automated requests');
            } else if (error.message.includes('timeout') || error.message.includes('aborted')) {
              userFriendlyError = 'Request timeout - website took too long to respond';
              suggestions.push('The website may be slow or experiencing issues');
            } else if (error.message.includes('HTTP 403') || error.message.includes('HTTP 429')) {
              userFriendlyError = 'Access denied - website blocks automated requests';
              suggestions.push('Try again later or use HTML file upload');
            } else if (error.message.includes('HTTP 404')) {
              userFriendlyError = 'Page not found - URL may be incorrect';
            } else if (error.message.includes('HTTP 5')) {
              userFriendlyError = 'Server error - website is experiencing issues';
            }
            
            result = {
              url,
              status: 'error',
              error: userFriendlyError,
              suggestions,
              score: 0,
              issues: [`Failed to fetch: ${userFriendlyError}`]
            };
          } else {
            this.updateCurrentStatus(`Retrying: ${url} (${this.getShortError(error.message)})`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
          }
        }
      }
      
      if (result) {
        this.analysisResults.push(result);
        this.updateProgress();
      }
    }
  }
  
  async fetchUrl(url) {
    // Normalize URL and handle redirects
    const normalizedUrl = this.normalizeUrl(url);
    this.updateCurrentStatus(`Fetching: ${normalizedUrl}`);
    
    let lastError = null;
    
    // Try CORS proxies in order
    for (let i = 0; i < this.corsProxies.length; i++) {
      const proxy = this.corsProxies[i];
      try {
        this.updateCurrentStatus(`Trying ${proxy.name}: ${normalizedUrl}`);
        
        const requestUrl = proxy.url + encodeURIComponent(normalizedUrl);
        const requestHeaders = {
          'Accept': 'application/json, text/html, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          ...(proxy.headers || {})
        };
        
        // Add timeout based on GitHub Pages environment
        const timeout = this.isGitHubPages ? 20000 : 15000;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(requestUrl, {
          signal: controller.signal,
          headers: requestHeaders,
          mode: 'cors',
          credentials: 'omit'
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`${proxy.name} returned HTTP ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type') || '';
        let data;
        
        if (contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }
        
        const htmlContent = proxy.parseResponse(data);
        
        if (!htmlContent || typeof htmlContent !== 'string') {
          throw new Error(`${proxy.name} returned invalid content`);
        }
        
        // Check if we got server-side rendered content
        return await this.ensureServerSideContent(htmlContent, normalizedUrl);
        
      } catch (error) {
        lastError = error;
        console.warn(`${proxy.name} failed for ${normalizedUrl}:`, error.message);
        
        // Add small delay before trying next proxy
        if (i < this.corsProxies.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        continue;
      }
    }
    
    // Final fallback - try direct request (usually fails due to CORS)
    try {
      this.updateCurrentStatus(`Direct request: ${normalizedUrl}`);
      const response = await fetch(normalizedUrl, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache'
        },
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const htmlContent = await response.text();
      return await this.ensureServerSideContent(htmlContent, normalizedUrl);
    } catch (error) {
      throw new Error(`All methods failed. Last error: ${lastError?.message || error.message}`);
    }
  }
  
  normalizeUrl(url) {
    // Handle common redirect patterns
    if (url.startsWith('http://')) {
      // Try HTTPS first
      url = url.replace('http://', 'https://');
    }
    
    // Handle www redirects by trying both variations
    if (!url.includes('www.') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
      const domain = new URL(url);
      return `https://www.${domain.hostname}${domain.pathname}${domain.search}${domain.hash}`;
    }
    
    return url;
  }
  
  getShortError(errorMessage) {
    // Return shortened error messages for status display
    if (errorMessage.includes('CORS') || errorMessage.includes('All methods failed')) {
      return 'CORS blocked';
    } else if (errorMessage.includes('timeout') || errorMessage.includes('aborted')) {
      return 'timeout';
    } else if (errorMessage.includes('HTTP 403')) {
      return '403 forbidden';
    } else if (errorMessage.includes('HTTP 404')) {
      return '404 not found';
    } else if (errorMessage.includes('HTTP 429')) {
      return '429 rate limited';
    } else if (errorMessage.includes('HTTP 5')) {
      return 'server error';
    }
    return errorMessage.substring(0, 30) + '...';
  }
  
  async ensureServerSideContent(htmlContent, url) {
    // Parse the initial HTML to check for signs of SSR vs CSR
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Check if content appears to be server-side rendered
    const hasTitle = doc.title && doc.title.trim() && !doc.title.includes('{{') && doc.title !== 'Loading...';
    const hasMetaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim();
    const hasContentIndicators = doc.body && doc.body.textContent.trim().length > 100;
    const hasStructuredData = doc.querySelectorAll('script[type="application/ld+json"]').length > 0;
    
    // Signs this might be a SPA/CSR that needs time to load
    const hasSpaIndicators = htmlContent.includes('ng-app') || 
                            htmlContent.includes('data-reactroot') || 
                            htmlContent.includes('__NEXT_DATA__') ||
                            htmlContent.includes('nuxt') ||
                            htmlContent.includes('gatsby') ||
                            doc.getElementById('root') ||
                            doc.getElementById('app') ||
                            doc.querySelector('[data-vue-ssr-id]');
    
    // If we have good SSR content, return it
    if (hasTitle && hasMetaDescription && hasContentIndicators && !hasSpaIndicators) {
      return htmlContent;
    }
    
    // If it looks like a SPA or has minimal content, try to get better content
    if (hasSpaIndicators || (!hasTitle || !hasMetaDescription)) {
      this.updateCurrentStatus(`Waiting for SSR content: ${url}`);
      return await this.fetchWithRetryForSSR(url, htmlContent);
    }
    
    return htmlContent;
  }
  
  async fetchWithRetryForSSR(url, fallbackContent) {
    // Strategy: Try different proxies with delays to allow SSR to complete
    const delays = [2000, 4000]; // Wait 2s, 4s for server-side rendering (reduced for better UX)
    
    for (let i = 0; i < delays.length && this.isAnalyzing; i++) {
      try {
        this.updateCurrentStatus(`Waiting for SSR (${delays[i]/1000}s): ${url}`);
        
        // Wait before retry to allow SSR to complete
        await new Promise(resolve => setTimeout(resolve, delays[i]));
        
        if (!this.isAnalyzing) break; // Check if analysis was stopped
        
        // Try a different proxy
        const proxyIndex = i % this.corsProxies.length;
        const proxy = this.corsProxies[proxyIndex];
        
        this.updateCurrentStatus(`Retry ${proxy.name}: ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);
        
        const response = await fetch(proxy.url + encodeURIComponent(url), {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json, text/html, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            ...(proxy.headers || {})
          },
          mode: 'cors',
          credentials: 'omit'
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) continue;
        
        const contentType = response.headers.get('content-type') || '';
        let data;
        
        if (contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }
        
        const newContent = proxy.parseResponse(data);
        
        if (!newContent || typeof newContent !== 'string') continue;
        
        // Check if this version has better content
        const newDoc = new DOMParser().parseFromString(newContent, 'text/html');
        const newTitle = newDoc.title?.trim();
        const newMeta = newDoc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim();
        const newBodyLength = newDoc.body?.textContent?.trim().length || 0;
        const newStructuredData = newDoc.querySelectorAll('script[type="application/ld+json"]').length;
        
        const originalDoc = new DOMParser().parseFromString(fallbackContent, 'text/html');
        const originalTitle = originalDoc.title?.trim();
        const originalMeta = originalDoc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim();
        const originalBodyLength = originalDoc.body?.textContent?.trim().length || 0;
        const originalStructuredData = originalDoc.querySelectorAll('script[type="application/ld+json"]').length;
        
        // If new content is significantly better, use it
        const titleImproved = newTitle && newTitle !== originalTitle && newTitle.length > 10;
        const metaImproved = newMeta && (!originalMeta || newMeta.length > originalMeta.length + 20);
        const contentImproved = newBodyLength > originalBodyLength * 1.3;
        const structuredDataImproved = newStructuredData > originalStructuredData;
        
        if (titleImproved || metaImproved || contentImproved || structuredDataImproved) {
          this.updateCurrentStatus(`Better content found: ${url}`);
          return newContent;
        }
        
      } catch (error) {
        console.warn(`SSR retry ${i+1} failed for ${url}:`, error.message);
        continue;
      }
    }
    
    // If all retries failed, return the original content
    return fallbackContent;
  }
  
  analyzePage(url, html, source = 'url') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const analysis = {
        url,
        source,
        status: 'success',
        timestamp: new Date().toISOString(),
        title: doc.title || '',
        meta: this.extractMetaTags(doc),
        openGraph: this.extractOpenGraph(doc),
        twitterCard: this.extractTwitterCard(doc),
        structuredData: this.parseStructuredData(doc),
        headers: this.extractHeaders(doc),
        images: this.includeImages.checked ? this.analyzeImages(doc) : [],
        links: this.includeLinks.checked ? this.analyzeLinks(doc) : [],
        issues: [],
        score: 0
      };
      
      // Calculate issues and score
      analysis.issues = this.identifyIssues(analysis);
      analysis.score = this.calculateSEOScore(analysis);
      
      return analysis;
    } catch (error) {
      return {
        url,
        source,
        status: 'error',
        error: error.message,
        score: 0,
        issues: [`Parse error: ${error.message}`]
      };
    }
  }
  
  extractMetaTags(doc) {
    const meta = {};
    
    // Basic meta tags
    const description = doc.querySelector('meta[name="description"]');
    meta.description = description ? description.getAttribute('content') : '';
    
    const keywords = doc.querySelector('meta[name="keywords"]');
    meta.keywords = keywords ? keywords.getAttribute('content') : '';
    
    const robots = doc.querySelector('meta[name="robots"]');
    meta.robots = robots ? robots.getAttribute('content') : '';
    
    const viewport = doc.querySelector('meta[name="viewport"]');
    meta.viewport = viewport ? viewport.getAttribute('content') : '';
    
    const charset = doc.querySelector('meta[charset]');
    meta.charset = charset ? charset.getAttribute('charset') : '';
    
    return meta;
  }
  
  extractOpenGraph(doc) {
    const og = {};
    const ogTags = doc.querySelectorAll('meta[property^="og:"]');
    
    ogTags.forEach(tag => {
      const property = tag.getAttribute('property').replace('og:', '');
      og[property] = tag.getAttribute('content');
    });
    
    return og;
  }
  
  extractTwitterCard(doc) {
    const twitter = {};
    const twitterTags = doc.querySelectorAll('meta[name^="twitter:"]');
    
    twitterTags.forEach(tag => {
      const name = tag.getAttribute('name').replace('twitter:', '');
      twitter[name] = tag.getAttribute('content');
    });
    
    return twitter;
  }
  
  parseStructuredData(doc) {
    const structuredData = [];
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
    
    scripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent);
        structuredData.push(data);
      } catch (error) {
        structuredData.push({ error: 'Invalid JSON-LD', content: script.textContent });
      }
    });
    
    return structuredData;
  }
  
  extractHeaders(doc) {
    const headers = {};
    for (let i = 1; i <= 6; i++) {
      const tags = doc.querySelectorAll(`h${i}`);
      headers[`h${i}`] = Array.from(tags).map(tag => tag.textContent.trim());
    }
    return headers;
  }
  
  analyzeImages(doc) {
    const images = doc.querySelectorAll('img');
    return Array.from(images).map(img => ({
      src: img.src,
      alt: img.alt || '',
      title: img.title || '',
      width: img.width,
      height: img.height,
      hasAlt: !!img.alt,
      hasTitle: !!img.title
    }));
  }
  
  analyzeLinks(doc) {
    const links = doc.querySelectorAll('a[href]');
    return Array.from(links).map(link => ({
      href: link.href,
      text: link.textContent.trim(),
      title: link.title || '',
      rel: link.rel,
      target: link.target,
      isExternal: link.href.startsWith('http') && !link.href.includes(window.location.hostname)
    }));
  }
  
  identifyIssues(analysis) {
    const issues = [];
    
    // Title issues
    if (!analysis.title) {
      issues.push({ type: 'error', message: 'Missing page title' });
    } else if (analysis.title.length < 30) {
      issues.push({ type: 'warning', message: 'Title too short (< 30 characters)' });
    } else if (analysis.title.length > 60) {
      issues.push({ type: 'warning', message: 'Title too long (> 60 characters)' });
    }
    
    // Meta description issues
    if (!analysis.meta.description) {
      issues.push({ type: 'error', message: 'Missing meta description' });
    } else if (analysis.meta.description.length < 120) {
      issues.push({ type: 'warning', message: 'Meta description too short (< 120 characters)' });
    } else if (analysis.meta.description.length > 160) {
      issues.push({ type: 'warning', message: 'Meta description too long (> 160 characters)' });
    }
    
    // Header structure issues
    if (!analysis.headers.h1 || analysis.headers.h1.length === 0) {
      issues.push({ type: 'error', message: 'Missing H1 tag' });
    } else if (analysis.headers.h1.length > 1) {
      issues.push({ type: 'warning', message: 'Multiple H1 tags found' });
    }
    
    // Open Graph issues
    if (!analysis.openGraph.title) {
      issues.push({ type: 'warning', message: 'Missing og:title' });
    }
    if (!analysis.openGraph.description) {
      issues.push({ type: 'warning', message: 'Missing og:description' });
    }
    if (!analysis.openGraph.image) {
      issues.push({ type: 'warning', message: 'Missing og:image' });
    }
    
    // Image issues
    if (this.includeImages.checked) {
      const imagesWithoutAlt = analysis.images.filter(img => !img.hasAlt);
      if (imagesWithoutAlt.length > 0) {
        issues.push({ type: 'warning', message: `${imagesWithoutAlt.length} images missing alt text` });
      }
    }
    
    return issues;
  }
  
  calculateSEOScore(analysis) {
    let score = 100;
    
    // Deduct points for issues
    analysis.issues.forEach(issue => {
      if (issue.type === 'error') {
        score -= 15;
      } else if (issue.type === 'warning') {
        score -= 5;
      }
    });
    
    // Bonus points for good practices
    if (analysis.structuredData.length > 0) {
      score += 10;
    }
    if (analysis.openGraph.title && analysis.openGraph.description && analysis.openGraph.image) {
      score += 10;
    }
    if (analysis.twitterCard.card) {
      score += 5;
    }
    
    return Math.max(0, Math.min(100, score));
  }
  
  showProgressSection() {
    this.progressSection.style.display = 'block';
    this.resultsSection.style.display = 'none';
  }
  
  updateProgress() {
    const total = this.analysisQueue.length;
    const completed = this.analysisResults.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    this.progressFill.style.width = `${percentage}%`;
    this.progressText.textContent = `${completed} / ${total} completed`;
    
    if (this.startTime && completed > 0) {
      const elapsed = Date.now() - this.startTime;
      const avgTime = elapsed / completed;
      const remaining = total - completed;
      const estimated = remaining * avgTime;
      const minutes = Math.floor(estimated / 60000);
      const seconds = Math.floor((estimated % 60000) / 1000);
      this.progressTime.textContent = `Estimated: ${minutes}m ${seconds}s`;
    }
  }
  
  updateCurrentStatus(status) {
    this.currentStatus.textContent = status;
  }
  
  pauseAnalysis() {
    this.isPaused = true;
    this.pauseButton.style.display = 'none';
    this.resumeButton.style.display = 'inline-block';
    this.updateCurrentStatus('Analysis paused');
  }
  
  resumeAnalysis() {
    this.isPaused = false;
    this.pauseButton.style.display = 'inline-block';
    this.resumeButton.style.display = 'none';
  }
  
  stopAnalysis() {
    this.isAnalyzing = false;
    this.isPaused = false;
    this.updateCurrentStatus('Analysis stopped');
    
    if (this.analysisResults.length > 0) {
      this.completeAnalysis();
    } else {
      this.progressSection.style.display = 'none';
    }
  }
  
  completeAnalysis() {
    this.isAnalyzing = false;
    this.progressSection.style.display = 'none';
    this.displayResults();
    this.showNotification(`Analysis complete! Processed ${this.analysisResults.length} pages`, 'success');
  }
  
  displayResults() {
    this.resultsSection.style.display = 'block';
    this.updateResultsSummary();
    this.updateResultsDisplay();
  }
  
  updateResultsSummary() {
    const total = this.analysisResults.length;
    const successful = this.analysisResults.filter(r => r.status === 'success').length;
    const avgScore = successful > 0 ? 
      this.analysisResults.filter(r => r.status === 'success')
        .reduce((sum, r) => sum + r.score, 0) / successful : 0;
    
    const criticalCount = this.analysisResults.reduce((count, result) => {
      return count + (result.issues ? result.issues.filter(i => i.type === 'error').length : 0);
    }, 0);
    
    const warningCount = this.analysisResults.reduce((count, result) => {
      return count + (result.issues ? result.issues.filter(i => i.type === 'warning').length : 0);
    }, 0);
    
    this.overallScore.textContent = Math.round(avgScore);
    this.pagesCount.textContent = total;
    this.criticalIssues.textContent = criticalCount;
    this.warningIssues.textContent = warningCount;
    
    // Update score display color
    this.overallScore.className = avgScore >= 80 ? 'success' : avgScore >= 60 ? 'warning' : 'error';
  }
  
  updateResultsDisplay() {
    let filteredResults = [...this.analysisResults];
    
    // Apply status filter
    const statusFilter = this.filterStatus.value;
    if (statusFilter !== 'all') {
      if (statusFilter === 'success') {
        filteredResults = filteredResults.filter(r => r.status === 'success');
      } else if (statusFilter === 'error') {
        filteredResults = filteredResults.filter(r => r.status === 'error' || 
          (r.issues && r.issues.some(i => i.type === 'error')));
      } else if (statusFilter === 'warning') {
        filteredResults = filteredResults.filter(r => r.issues && r.issues.some(i => i.type === 'warning'));
      }
    }
    
    // Apply sorting
    const sortBy = this.sortResults.value;
    filteredResults.sort((a, b) => {
      switch (sortBy) {
        case 'score-desc':
          return (b.score || 0) - (a.score || 0);
        case 'score-asc':
          return (a.score || 0) - (b.score || 0);
        case 'url':
          return a.url.localeCompare(b.url);
        case 'issues':
          return (b.issues ? b.issues.length : 0) - (a.issues ? a.issues.length : 0);
        default:
          return 0;
      }
    });
    
    // Update table
    this.resultsTbody.innerHTML = '';
    filteredResults.forEach(result => {
      const row = this.createResultRow(result);
      this.resultsTbody.appendChild(row);
    });
  }
  
  createResultRow(result) {
    const row = document.createElement('tr');
    row.className = result.status;
    
    const issues = result.issues || [];
    const errorCount = issues.filter(i => i.type === 'error').length;
    const warningCount = issues.filter(i => i.type === 'warning').length;
    
    row.innerHTML = `
      <td class="url-cell">
        <div class="url-text" title="${result.url}">${result.url}</div>
        ${result.source === 'file' ? '<span class="source-badge">File</span>' : ''}
      </td>
      <td class="score-cell">
        <div class="score-badge ${result.score >= 80 ? 'success' : result.score >= 60 ? 'warning' : 'error'}">
          ${result.score || 0}
        </div>
      </td>
      <td class="title-cell">${result.title || 'N/A'}</td>
      <td class="meta-cell">${result.meta ? (result.meta.description ? 
        (result.meta.description.length > 50 ? result.meta.description.substring(0, 50) + '...' : result.meta.description) 
        : 'N/A') : 'N/A'}</td>
      <td class="issues-cell">
        ${errorCount > 0 ? `<span class="issue-count error">${errorCount} errors</span>` : ''}
        ${warningCount > 0 ? `<span class="issue-count warning">${warningCount} warnings</span>` : ''}
        ${issues.length === 0 ? '<span class="issue-count success">No issues</span>' : ''}
      </td>
      <td class="actions-cell">
        <button class="view-details-btn" data-url="${result.url}">👁️ Details</button>
        ${result.suggestions && result.suggestions.length > 0 ? 
          `<button class="suggestions-btn" data-url="${result.url}" title="View suggestions">💡</button>` : ''}
      </td>
    `;
    
    // Add click handler for details button
    const detailsBtn = row.querySelector('.view-details-btn');
    detailsBtn.addEventListener('click', () => this.showDetailedView(result));
    
    return row;
  }
  
  showDetailedView(result) {
    this.detailedTitle.textContent = `Analysis Details: ${result.url}`;
    this.detailedContent.innerHTML = this.generateDetailedContent(result);
    this.detailedView.style.display = 'block';
  }
  
  generateDetailedContent(result) {
    if (result.status === 'error') {
      return `
        <div class="error-details">
          <h4>Analysis Error</h4>
          <p>${result.error}</p>
        </div>
      `;
    }
    
    const issues = result.issues || [];
    const errors = issues.filter(i => i.type === 'error');
    const warnings = issues.filter(i => i.type === 'warning');
    
    return `
      <div class="detailed-sections">
        <div class="detail-section">
          <h4>SEO Score: ${result.score}/100</h4>
          <div class="score-bar">
            <div class="score-fill" style="width: ${result.score}%"></div>
          </div>
        </div>
        
        ${issues.length > 0 ? `
        <div class="detail-section">
          <h4>Issues Found</h4>
          ${errors.length > 0 ? `
            <div class="issue-group">
              <h5>Errors (${errors.length})</h5>
              ${errors.map(issue => `<div class="issue-item error">${issue.message}</div>`).join('')}
            </div>
          ` : ''}
          ${warnings.length > 0 ? `
            <div class="issue-group">
              <h5>Warnings (${warnings.length})</h5>
              ${warnings.map(issue => `<div class="issue-item warning">${issue.message}</div>`).join('')}
            </div>
          ` : ''}
        </div>
        ` : ''}
        
        <div class="detail-section">
          <h4>Basic Information</h4>
          <div class="info-grid">
            <div class="info-item">
              <strong>Title:</strong> ${result.title || 'Not found'}
            </div>
            <div class="info-item">
              <strong>Meta Description:</strong> ${result.meta?.description || 'Not found'}
            </div>
            <div class="info-item">
              <strong>Meta Keywords:</strong> ${result.meta?.keywords || 'Not found'}
            </div>
            <div class="info-item">
              <strong>Robots:</strong> ${result.meta?.robots || 'Not specified'}
            </div>
          </div>
        </div>
        
        ${Object.keys(result.openGraph || {}).length > 0 ? `
        <div class="detail-section">
          <h4>Open Graph Tags</h4>
          <div class="tag-list">
            ${Object.entries(result.openGraph).map(([key, value]) => 
              `<div class="tag-item"><strong>og:${key}:</strong> ${value}</div>`
            ).join('')}
          </div>
        </div>
        ` : ''}
        
        ${Object.keys(result.twitterCard || {}).length > 0 ? `
        <div class="detail-section">
          <h4>Twitter Card Tags</h4>
          <div class="tag-list">
            ${Object.entries(result.twitterCard).map(([key, value]) => 
              `<div class="tag-item"><strong>twitter:${key}:</strong> ${value}</div>`
            ).join('')}
          </div>
        </div>
        ` : ''}
        
        ${result.structuredData && result.structuredData.length > 0 ? `
        <div class="detail-section">
          <h4>Structured Data (${result.structuredData.length} items)</h4>
          <div class="structured-data">
            ${result.structuredData.map((data, index) => `
              <div class="structured-item">
                <strong>Item ${index + 1}:</strong>
                ${data.error ? `<span class="error">${data.error}</span>` : 
                  `<span class="type">${data['@type'] || 'Unknown type'}</span>`}
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        <div class="detail-section">
          <h4>Header Structure</h4>
          <div class="headers-list">
            ${Object.entries(result.headers || {}).map(([tag, texts]) => {
              if (texts.length > 0) {
                return `<div class="header-group">
                  <strong>${tag.toUpperCase()}:</strong> ${texts.length} tags
                  <div class="header-items">
                    ${texts.slice(0, 3).map(text => `<div class="header-text">${text}</div>`).join('')}
                    ${texts.length > 3 ? `<div class="more-items">...and ${texts.length - 3} more</div>` : ''}
                  </div>
                </div>`;
              }
              return '';
            }).join('')}
          </div>
        </div>
        
        ${this.includeImages.checked && result.images && result.images.length > 0 ? `
        <div class="detail-section">
          <h4>Images (${result.images.length} found)</h4>
          <div class="images-list">
            ${result.images.slice(0, 5).map(img => `
              <div class="image-item ${!img.hasAlt ? 'missing-alt' : ''}">
                <div class="image-info">
                  <strong>Source:</strong> ${img.src}<br>
                  <strong>Alt text:</strong> ${img.alt || '<em>Missing</em>'}<br>
                  ${img.width && img.height ? `<strong>Dimensions:</strong> ${img.width}x${img.height}` : ''}
                </div>
              </div>
            `).join('')}
            ${result.images.length > 5 ? `<div class="more-items">...and ${result.images.length - 5} more images</div>` : ''}
          </div>
        </div>
        ` : ''}
      </div>
    `;
  }
  
  closeDetailedView() {
    this.detailedView.style.display = 'none';
  }
  
  exportResults(format) {
    if (this.analysisResults.length === 0) {
      this.showNotification('No results to export', 'warning');
      return;
    }
    
    try {
      let content, filename, mimeType;
      
      if (format === 'csv') {
        content = this.generateCsvExport();
        filename = `seo-analysis-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      } else if (format === 'json') {
        content = JSON.stringify(this.analysisResults, null, 2);
        filename = `seo-analysis-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      }
      
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      
      this.showNotification(`Exported ${this.analysisResults.length} results as ${format.toUpperCase()}`, 'success');
    } catch (error) {
      this.showError(`Export failed: ${error.message}`);
    }
  }
  
  generateCsvExport() {
    const headers = [
      'URL', 'Score', 'Status', 'Title', 'Meta Description', 'Meta Keywords',
      'H1 Count', 'Images', 'Images Missing Alt', 'OG Title', 'OG Description',
      'Twitter Card', 'Structured Data Count', 'Critical Issues', 'Warnings', 'Total Issues'
    ];
    
    const rows = this.analysisResults.map(result => {
      const issues = result.issues || [];
      const errors = issues.filter(i => i.type === 'error').length;
      const warnings = issues.filter(i => i.type === 'warning').length;
      const imagesWithoutAlt = result.images ? result.images.filter(img => !img.hasAlt).length : 0;
      
      return [
        `"${result.url || ''}"`,
        result.score || 0,
        result.status || '',
        `"${(result.title || '').replace(/"/g, '""')}"`,
        `"${(result.meta?.description || '').replace(/"/g, '""')}"`,
        `"${(result.meta?.keywords || '').replace(/"/g, '""')}"`,
        result.headers?.h1?.length || 0,
        result.images?.length || 0,
        imagesWithoutAlt,
        `"${(result.openGraph?.title || '').replace(/"/g, '""')}"`,
        `"${(result.openGraph?.description || '').replace(/"/g, '""')}"`,
        result.twitterCard?.card || '',
        result.structuredData?.length || 0,
        errors,
        warnings,
        issues.length
      ].join(',');
    });
    
    return [headers.join(','), ...rows].join('\n');
  }
  
  clearResults() {
    this.analysisResults = [];
    this.analysisQueue = [];
    this.isAnalyzing = false;
    this.isPaused = false;
    this.currentIndex = 0;
    
    this.progressSection.style.display = 'none';
    this.resultsSection.style.display = 'none';
    this.detailedView.style.display = 'none';
    
    // Clear inputs
    this.sitemapInput.value = '';
    this.urlInput.value = '';
    this.jsonInput.value = '';
    this.htmlFileList = [];
    this.shadowRoot.getElementById('html-file-list').innerHTML = '';
    
    this.showNotification('Results cleared', 'info');
  }
  
  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.style.display = 'block';
    this.errorMessage.scrollIntoView({ behavior: 'smooth' });
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
      
      // Hide notification after 4 seconds
      setTimeout(() => {
        notification.classList.remove('show');
        
        // Remove notification after animation
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 4000);
    });
  }
}

customElements.define('tool-seo-checker', ToolSeoChecker);