class ToolCssGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Load external stylesheet
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '../../styles/tool-css-grid.css');
    
    // Add custom styles for drag and drop
    const styleElem = document.createElement('style');
    styleElem.textContent = `
      .grid-item.dragging {
        opacity: 0.7;
        z-index: 10;
      }
      .grid-item.drop-target {
        outline: 2px dashed var(--buff, #d8a48f);
      }
    `;
    
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="container">
        <div class="main-content">
          <h1>CSS Grid Builder</h1>
          <p>Create, visualize, and generate CSS Grid layouts with an interactive builder</p>
          
          <div class="tabs">
            <button class="tab active" data-tab="builder">Visual Builder</button>
            <button class="tab" data-tab="templates">Grid Templates</button>
            <button class="tab" data-tab="tricks">Grid Tricks</button>
            <button class="tab" data-tab="code">Code Generator</button>
          </div>
          
          <!-- Visual Builder Tab -->
          <div class="tab-content active" data-content="builder">
            <div class="grid-builder-container">
              <div class="grid-canvas">
                <div class="grid-container" id="grid-container">
                  <div class="grid-item" data-id="1">Item 1</div>
                  <div class="grid-item" data-id="2">Item 2</div>
                  <div class="grid-item" data-id="3">Item 3</div>
                  <div class="grid-item" data-id="4">Item 4</div>
                </div>
              </div>
              
              <div class="controls-panel">
                <div class="control-group">
                  <h3>Grid Container</h3>
                  
                  <div class="control-row">
                    <label for="grid-template-columns">grid-template-columns</label>
                    <input type="text" id="grid-template-columns" value="1fr 1fr">
                  </div>
                  
                  <div class="control-row">
                    <label for="grid-template-rows">grid-template-rows</label>
                    <input type="text" id="grid-template-rows" value="auto auto">
                  </div>
                  
                  <div class="control-row">
                    <label for="grid-gap">gap</label>
                    <input type="text" id="grid-gap" value="10px">
                  </div>
                  
                  <div class="control-row">
                    <label for="justify-items">justify-items</label>
                    <select id="justify-items">
                      <option value="stretch" selected>stretch</option>
                      <option value="start">start</option>
                      <option value="center">center</option>
                      <option value="end">end</option>
                    </select>
                  </div>
                  
                  <div class="control-row">
                    <label for="align-items">align-items</label>
                    <select id="align-items">
                      <option value="stretch" selected>stretch</option>
                      <option value="start">start</option>
                      <option value="center">center</option>
                      <option value="end">end</option>
                    </select>
                  </div>
                </div>
                
                <div class="control-group">
                  <h3>Selected Item</h3>
                  <div id="item-controls">
                    <p>Select an item to edit its properties</p>
                  </div>
                  <div id="item-controls-active" style="display: none;">
                    <div class="control-row">
                      <label for="grid-column">grid-column</label>
                      <input type="text" id="grid-column" value="auto">
                    </div>
                    
                    <div class="control-row">
                      <label for="grid-row">grid-row</label>
                      <input type="text" id="grid-row" value="auto">
                    </div>
                    
                    <div class="control-row">
                      <label for="justify-self">justify-self</label>
                      <select id="justify-self">
                        <option value="auto" selected>auto</option>
                        <option value="start">start</option>
                        <option value="center">center</option>
                        <option value="end">end</option>
                        <option value="stretch">stretch</option>
                      </select>
                    </div>
                    
                    <div class="control-row">
                      <label for="align-self">align-self</label>
                      <select id="align-self">
                        <option value="auto" selected>auto</option>
                        <option value="start">start</option>
                        <option value="center">center</option>
                        <option value="end">end</option>
                        <option value="stretch">stretch</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div class="button-group">
                  <button id="add-item-btn">Add Item</button>
                  <button id="remove-item-btn" class="secondary">Remove Item</button>
                </div>
              </div>
            </div>
            
            <div class="code-output-container">
              <div class="code-header">
                <h2>Generated CSS</h2>
                <button id="copy-css-btn" class="secondary">Copy CSS</button>
              </div>
              <pre class="code-output" id="css-output">.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 10px;
  justify-items: stretch;
  align-items: stretch;
}</pre>
            </div>
          </div>
          
          <!-- Templates Tab -->
          <div class="tab-content" data-content="templates">
            <div class="templates-grid">
              <div class="template-card" data-template="holy-grail">
                <div class="template-preview">
                  <div class="template-preview-item" style="grid-column: 1 / 4; grid-row: 1;"></div>
                  <div class="template-preview-item" style="grid-column: 1; grid-row: 2;"></div>
                  <div class="template-preview-item" style="grid-column: 2; grid-row: 2;"></div>
                  <div class="template-preview-item" style="grid-column: 3; grid-row: 2;"></div>
                  <div class="template-preview-item" style="grid-column: 1 / 4; grid-row: 3;"></div>
                </div>
                <div class="template-info">
                  <h3 class="template-title">Holy Grail Layout</h3>
                  <p class="template-description">Classic layout with header, footer, main content, and two sidebars</p>
                </div>
              </div>
              
              <div class="template-card" data-template="card-grid">
                <div class="template-preview">
                  <div class="template-preview-item"></div>
                  <div class="template-preview-item"></div>
                  <div class="template-preview-item"></div>
                  <div class="template-preview-item"></div>
                  <div class="template-preview-item"></div>
                  <div class="template-preview-item"></div>
                </div>
                <div class="template-info">
                  <h3 class="template-title">Card Grid</h3>
                  <p class="template-description">Responsive grid of cards that adjust to screen size</p>
                </div>
              </div>
              
              <div class="template-card" data-template="magazine">
                <div class="template-preview" style="grid-template-columns: 2fr 1fr; grid-template-rows: auto auto auto;">
                  <div class="template-preview-item" style="grid-column: 1 / 3; grid-row: 1;"></div>
                  <div class="template-preview-item" style="grid-column: 1; grid-row: 2 / 4;"></div>
                  <div class="template-preview-item" style="grid-column: 2; grid-row: 2;"></div>
                  <div class="template-preview-item" style="grid-column: 2; grid-row: 3;"></div>
                </div>
                <div class="template-info">
                  <h3 class="template-title">Magazine Layout</h3>
                  <p class="template-description">Layout inspired by magazine designs with featured content</p>
                </div>
              </div>
              
              <div class="template-card" data-template="dashboard">
                <div class="template-preview" style="grid-template-columns: 1fr 1fr 1fr; grid-template-rows: auto auto auto;">
                  <div class="template-preview-item" style="grid-column: 1 / 4; grid-row: 1;"></div>
                  <div class="template-preview-item" style="grid-column: 1; grid-row: 2;"></div>
                  <div class="template-preview-item" style="grid-column: 2 / 4; grid-row: 2;"></div>
                  <div class="template-preview-item" style="grid-column: 1 / 3; grid-row: 3;"></div>
                  <div class="template-preview-item" style="grid-column: 3; grid-row: 3;"></div>
                </div>
                <div class="template-info">
                  <h3 class="template-title">Dashboard Layout</h3>
                  <p class="template-description">Perfect for admin interfaces and data dashboards</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Grid Tricks Tab -->
          <div class="tab-content" data-content="tricks">
            <div class="tricks-container">
              <div class="trick-card">
                <div class="trick-preview">
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(50px, 1fr)); gap: 5px; width: 100%;">
                    <div style="background: var(--vanilla); height: 30px;"></div>
                    <div style="background: var(--vanilla); height: 30px;"></div>
                    <div style="background: var(--vanilla); height: 30px;"></div>
                    <div style="background: var(--vanilla); height: 30px;"></div>
                  </div>
                </div>
                <div class="trick-info">
                  <h3 class="trick-title">Responsive Grid Without Media Queries</h3>
                  <p class="trick-description">Create a responsive grid that automatically adjusts columns based on available width</p>
                  <pre class="trick-code">.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}</pre>
                  <button class="trick-copy-btn" data-code="responsive-grid">Copy Code</button>
                </div>
              </div>
              
              <div class="trick-card">
                <div class="trick-preview">
                  <div style="display: grid; grid-template-areas: 'header header' 'sidebar content' 'footer footer'; gap: 5px; width: 100%; height: 100%;">
                    <div style="background: var(--vanilla); grid-area: header;"></div>
                    <div style="background: var(--vanilla); grid-area: sidebar;"></div>
                    <div style="background: var(--vanilla); grid-area: content;"></div>
                    <div style="background: var(--vanilla); grid-area: footer;"></div>
                  </div>
                </div>
                <div class="trick-info">
                  <h3 class="trick-title">Named Grid Areas</h3>
                  <p class="trick-description">Use named grid areas for more intuitive layout creation</p>
                  <pre class="trick-code">.container {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: 
    "header header"
    "sidebar content"
    "footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }</pre>
                  <button class="trick-copy-btn" data-code="named-areas">Copy Code</button>
                </div>
              </div>
              
              <div class="trick-card">
                <div class="trick-preview">
                  <div style="display: grid; place-items: center; width: 100%; height: 100%;">
                    <div style="background: var(--vanilla); width: 50px; height: 50px;"></div>
                  </div>
                </div>
                <div class="trick-info">
                  <h3 class="trick-title">Perfect Centering</h3>
                  <p class="trick-description">The easiest way to center an element both horizontally and vertically</p>
                  <pre class="trick-code">.container {
  display: grid;
  place-items: center;
  /* Shorthand for align-items: center; justify-items: center; */
}</pre>
                  <button class="trick-copy-btn" data-code="perfect-centering">Copy Code</button>
                </div>
              </div>
              
              <div class="trick-card">
                <div class="trick-preview">
                  <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 30px; gap: 5px; width: 100%;">
                    <div style="background: var(--vanilla); grid-column: span 2;"></div>
                    <div style="background: var(--vanilla);"></div>
                    <div style="background: var(--vanilla);"></div>
                    <div style="background: var(--vanilla); grid-column: span 2;"></div>
                  </div>
                </div>
                <div class="trick-info">
                  <h3 class="trick-title">Auto-Placement with Dense Packing</h3>
                  <p class="trick-description">Fill in grid gaps automatically for more efficient space usage</p>
                  <pre class="trick-code">.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(100px, auto);
  grid-auto-flow: dense; /* Key property */
  gap: 10px;
}</pre>
                  <button class="trick-copy-btn" data-code="dense-packing">Copy Code</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Code Generator Tab -->
          <div class="tab-content" data-content="code">
            <div class="code-output-container">
              <div class="code-header">
                <h2>CSS Code</h2>
                <button id="copy-full-css-btn" class="secondary">Copy CSS</button>
              </div>
              <pre class="code-output" id="full-css-output">.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 10px;
  justify-items: stretch;
  align-items: stretch;
}

.grid-item:nth-child(1) {
  grid-column: auto;
  grid-row: auto;
  justify-self: auto;
  align-self: auto;
}

.grid-item:nth-child(2) {
  grid-column: auto;
  grid-row: auto;
  justify-self: auto;
  align-self: auto;
}

.grid-item:nth-child(3) {
  grid-column: auto;
  grid-row: auto;
  justify-self: auto;
  align-self: auto;
}

.grid-item:nth-child(4) {
  grid-column: auto;
  grid-row: auto;
  justify-self: auto;
  align-self: auto;
}</pre>
            </div>
            
            <div class="code-output-container">
              <div class="code-header">
                <h2>HTML Code</h2>
                <button id="copy-html-btn" class="secondary">Copy HTML</button>
              </div>
              <pre class="code-output" id="html-output">&lt;div class="grid-container"&gt;
  &lt;div class="grid-item"&gt;Item 1&lt;/div&gt;
  &lt;div class="grid-item"&gt;Item 2&lt;/div&gt;
  &lt;div class="grid-item"&gt;Item 3&lt;/div&gt;
  &lt;div class="grid-item"&gt;Item 4&lt;/div&gt;
&lt;/div&gt;</pre>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.shadowRoot.appendChild(linkElem);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  
  connectedCallback() {
    // Initialize all DOM references first
    this.initDomReferences();
    
    // Tab switching
    const tabs = this.shadowRoot.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchTab(tab.dataset.tab);
      });
    });
    
    // Initialize in the correct order
    this.initGridBuilder();
    this.initTemplates();
    this.initTricks();
    this.initCodeGenerator();
    
    // Apply initial styles after everything is initialized
    this.applyGridStyles();
    this.updateFullCSSOutput();
    this.updateHTMLOutput();
  }
  
  initDomReferences() {
    // Container elements
    this.gridContainer = this.shadowRoot.getElementById('grid-container');
    this.gridItems = this.shadowRoot.querySelectorAll('.grid-item');
    
    // Container controls
    this.gridTemplateColumnsInput = this.shadowRoot.getElementById('grid-template-columns');
    this.gridTemplateRowsInput = this.shadowRoot.getElementById('grid-template-rows');
    this.gridGapInput = this.shadowRoot.getElementById('grid-gap');
    this.justifyItemsSelect = this.shadowRoot.getElementById('justify-items');
    this.alignItemsSelect = this.shadowRoot.getElementById('align-items');
    
    // Item controls
    this.itemControls = this.shadowRoot.getElementById('item-controls');
    this.itemControlsActive = this.shadowRoot.getElementById('item-controls-active');
    this.gridColumnInput = this.shadowRoot.getElementById('grid-column');
    this.gridRowInput = this.shadowRoot.getElementById('grid-row');
    this.justifySelfSelect = this.shadowRoot.getElementById('justify-self');
    this.alignSelfSelect = this.shadowRoot.getElementById('align-self');
    
    // Buttons
    this.addItemBtn = this.shadowRoot.getElementById('add-item-btn');
    this.removeItemBtn = this.shadowRoot.getElementById('remove-item-btn');
    this.copyCssBtn = this.shadowRoot.getElementById('copy-css-btn');
    
    // CSS output
    this.cssOutput = this.shadowRoot.getElementById('css-output');
    
    // Code generator elements
    this.fullCssOutput = this.shadowRoot.getElementById('full-css-output');
    this.htmlOutput = this.shadowRoot.getElementById('html-output');
    this.copyFullCssBtn = this.shadowRoot.getElementById('copy-full-css-btn');
    this.copyHtmlBtn = this.shadowRoot.getElementById('copy-html-btn');
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
  
  initGridBuilder() {
    // Apply initial grid styles - moved to connectedCallback
    // this.applyGridStyles();
    
    // Set up event listeners for grid container controls
    this.gridTemplateColumnsInput.addEventListener('input', () => this.applyGridStyles());
    this.gridTemplateRowsInput.addEventListener('input', () => this.applyGridStyles());
    this.gridGapInput.addEventListener('input', () => this.applyGridStyles());
    this.justifyItemsSelect.addEventListener('change', () => this.applyGridStyles());
    this.alignItemsSelect.addEventListener('change', () => this.applyGridStyles());
    
    // Set up event listeners for item controls
    this.gridColumnInput.addEventListener('input', () => this.applyItemStyles());
    this.gridRowInput.addEventListener('input', () => this.applyItemStyles());
    this.justifySelfSelect.addEventListener('change', () => this.applyItemStyles());
    this.alignSelfSelect.addEventListener('change', () => this.applyItemStyles());
    
    // Set up event listeners for buttons
    this.addItemBtn.addEventListener('click', () => this.addGridItem());
    this.removeItemBtn.addEventListener('click', () => this.removeGridItem());
    this.copyCssBtn.addEventListener('click', () => this.copyCSS());
    
    // Set up event listeners for grid items
    this.setupGridItemListeners();
  }
  
  setupGridItemListeners() {
    this.gridItems = this.shadowRoot.querySelectorAll('.grid-item');
    this.gridItems.forEach(item => {
      // Remove any existing event listeners
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);
      
      // Add click event listener
      newItem.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectGridItem(newItem);
      });
      
      // Make items draggable
      newItem.setAttribute('draggable', 'true');
      newItem.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', newItem.dataset.id);
        this.draggedItem = newItem;
      });
    });
    
    // Add drop event listeners to the grid container
    this.gridContainer.addEventListener('dragover', (e) => {
      e.preventDefault(); // Allow drop
    });
    
    this.gridContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      if (this.draggedItem) {
        // Get drop position
        const rect = this.gridContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate grid position based on current grid template
        const cols = this.gridTemplateColumnsInput.value.split(' ').length;
        const rows = this.gridTemplateRowsInput.value.split(' ').length;
        
        const colWidth = rect.width / cols;
        const rowHeight = rect.height / rows;
        
        const colIndex = Math.floor(x / colWidth) + 1;
        const rowIndex = Math.floor(y / rowHeight) + 1;
        
        // Update the dragged item's grid position
        this.draggedItem.style.gridColumn = colIndex;
        this.draggedItem.style.gridRow = rowIndex;
        
        // Select the dragged item to update controls
        this.selectGridItem(this.draggedItem);
        
        // Update CSS output
        this.updateCSSOutput();
      }
    });
  }
  
  selectGridItem(item) {
    // Remove selected class from all items
    this.gridItems.forEach(i => i.classList.remove('selected'));
    
    // Add selected class to clicked item
    item.classList.add('selected');
    
    // Show item controls
    this.itemControls.style.display = 'none';
    this.itemControlsActive.style.display = 'block';
    
    // Update item controls with current values
    this.selectedItem = item;
    
    // Get computed styles if inline styles are not set
    const computedStyle = window.getComputedStyle(item);
    
    this.gridColumnInput.value = item.style.gridColumn || 
                                (computedStyle.gridColumnStart !== 'auto' ? 
                                 `${computedStyle.gridColumnStart} / ${computedStyle.gridColumnEnd}` : 
                                 'auto');
    
    this.gridRowInput.value = item.style.gridRow || 
                             (computedStyle.gridRowStart !== 'auto' ? 
                              `${computedStyle.gridRowStart} / ${computedStyle.gridRowEnd}` : 
                              'auto');
    
    this.justifySelfSelect.value = item.style.justifySelf || computedStyle.justifySelf;
    this.alignSelfSelect.value = item.style.alignSelf || computedStyle.alignSelf;
  }
  
  applyGridStyles() {
    // Apply grid styles to container
    this.gridContainer.style.gridTemplateColumns = this.gridTemplateColumnsInput.value;
    this.gridContainer.style.gridTemplateRows = this.gridTemplateRowsInput.value;
    this.gridContainer.style.gap = this.gridGapInput.value;
    this.gridContainer.style.justifyItems = this.justifyItemsSelect.value;
    this.gridContainer.style.alignItems = this.alignItemsSelect.value;
    
    // Update CSS output
    this.updateCSSOutput();
  }
  
  applyItemStyles() {
    if (!this.selectedItem) return;
    
    // Apply styles to selected item
    this.selectedItem.style.gridColumn = this.gridColumnInput.value;
    this.selectedItem.style.gridRow = this.gridRowInput.value;
    this.selectedItem.style.justifySelf = this.justifySelfSelect.value;
    this.selectedItem.style.alignSelf = this.alignSelfSelect.value;
    
    // Update CSS output
    this.updateCSSOutput();
  }
  
  updateCSSOutput() {
    // Generate CSS for grid container
    let css = `.grid-container {
  display: grid;
  grid-template-columns: ${this.gridTemplateColumnsInput.value};
  grid-template-rows: ${this.gridTemplateRowsInput.value};
  gap: ${this.gridGapInput.value};
  justify-items: ${this.justifyItemsSelect.value};
  align-items: ${this.alignItemsSelect.value};
}`;
    
    // Update CSS output
    this.cssOutput.textContent = css;
    
    // Update full CSS output in code generator tab
    this.updateFullCSSOutput();
  }
  
  addGridItem() {
    // Get current number of items
    const itemCount = this.gridContainer.children.length;
    
    // Create new item
    const newItem = document.createElement('div');
    newItem.className = 'grid-item';
    newItem.dataset.id = itemCount + 1;
    newItem.textContent = `Item ${itemCount + 1}`;
    
    // Add to container
    this.gridContainer.appendChild(newItem);
    
    // Update grid items and set up listeners
    this.setupGridItemListeners();
    
    // Update HTML output
    this.updateHTMLOutput();
    
    // Select the new item
    this.selectGridItem(newItem);
  }
  
  removeGridItem() {
    if (!this.selectedItem) return;
    
    // Remove selected item
    this.gridContainer.removeChild(this.selectedItem);
    
    // Reset selected item
    this.selectedItem = null;
    this.itemControls.style.display = 'block';
    this.itemControlsActive.style.display = 'none';
    
    // Update HTML output
    this.updateHTMLOutput();
  }
  
  copyCSS() {
    const css = this.cssOutput.textContent;
    navigator.clipboard.writeText(css)
      .then(() => {
        this.showNotification('CSS copied to clipboard!');
      })
      .catch(err => {
        console.error('Could not copy CSS: ', err);
      });
  }
  
  initTemplates() {
    // Get template cards
    const templateCards = this.shadowRoot.querySelectorAll('.template-card');
    
    // Add click event listeners
    templateCards.forEach(card => {
      card.addEventListener('click', () => {
        const templateName = card.dataset.template;
        this.applyTemplate(templateName);
      });
    });
  }
  
  applyTemplate(templateName) {
    switch (templateName) {
      case 'holy-grail':
        this.gridTemplateColumnsInput.value = '1fr 3fr 1fr';
        this.gridTemplateRowsInput.value = 'auto 1fr auto';
        this.gridGapInput.value = '10px';
        
        // Clear existing items
        this.gridContainer.innerHTML = '';
        
        // Add new items
        const header = this.createGridItem('Header', 'span 3', '1');
        const sidebar1 = this.createGridItem('Left Sidebar', '1', '2');
        const content = this.createGridItem('Main Content', '2', '2');
        const sidebar2 = this.createGridItem('Right Sidebar', '3', '2');
        const footer = this.createGridItem('Footer', 'span 3', '3');
        
        this.gridContainer.append(header, sidebar1, content, sidebar2, footer);
        
        // Apply grid styles immediately
        this.applyGridStyles();
        break;
        
      case 'card-grid':
        this.gridTemplateColumnsInput.value = 'repeat(auto-fit, minmax(200px, 1fr))';
        this.gridTemplateRowsInput.value = 'auto';
        this.gridGapInput.value = '1rem';
        
        // Clear existing items
        this.gridContainer.innerHTML = '';
        
        // Add new items
        for (let i = 1; i <= 6; i++) {
          const card = this.createGridItem(`Card ${i}`);
          this.gridContainer.appendChild(card);
        }
        
        // Apply grid styles immediately
        this.applyGridStyles();
        break;
        
      case 'magazine':
        this.gridTemplateColumnsInput.value = '2fr 1fr';
        this.gridTemplateRowsInput.value = 'auto 1fr 1fr';
        this.gridGapInput.value = '15px';
        
        // Clear existing items
        this.gridContainer.innerHTML = '';
        
        // Add new items
        const headline = this.createGridItem('Headline', 'span 2', '1');
        const mainArticle = this.createGridItem('Main Article', '1', 'span 2');
        const sidebar1Article = this.createGridItem('Sidebar Article 1', '2', '2');
        const sidebar2Article = this.createGridItem('Sidebar Article 2', '2', '3');
        
        this.gridContainer.append(headline, mainArticle, sidebar1Article, sidebar2Article);
        
        // Apply grid styles immediately
        this.applyGridStyles();
        break;
        
      case 'dashboard':
        this.gridTemplateColumnsInput.value = '1fr 1fr 1fr';
        this.gridTemplateRowsInput.value = 'auto 1fr 1fr';
        this.gridGapInput.value = '12px';
        
        // Clear existing items
        this.gridContainer.innerHTML = '';
        
        // Add new items
        const dashHeader = this.createGridItem('Dashboard Header', 'span 3', '1');
        const sidebar = this.createGridItem('Sidebar', '1', '2');
        const mainContent = this.createGridItem('Main Content', 'span 2', '2');
        const chart1 = this.createGridItem('Chart 1', 'span 2', '3');
        const chart2 = this.createGridItem('Chart 2', '3', '3');
        
        this.gridContainer.append(dashHeader, sidebar, mainContent, chart1, chart2);
        
        // Apply grid styles immediately
        this.applyGridStyles();
        break;
    }
    
    // Apply grid styles
    this.applyGridStyles();
    
    // Update HTML output
    this.updateHTMLOutput();
    
    // Setup grid item listeners
    this.setupGridItemListeners();
    
    // Switch to builder tab
    this.switchTab('builder');
    
    // Show notification
    this.showNotification(`Applied ${templateName.replace('-', ' ')} template`);
  }
  
  createGridItem(text, column = 'auto', row = 'auto') {
    const item = document.createElement('div');
    item.className = 'grid-item';
    item.textContent = text;
    
    if (column !== 'auto') {
      item.style.gridColumn = column;
    }
    
    if (row !== 'auto') {
      item.style.gridRow = row;
    }
    
    return item;
  }
  
  initTricks() {
    // Get trick copy buttons
    const trickCopyBtns = this.shadowRoot.querySelectorAll('.trick-copy-btn');
    
    // Add click event listeners
    trickCopyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const codeBlock = btn.previousElementSibling;
        const code = codeBlock.textContent;
        
        navigator.clipboard.writeText(code)
          .then(() => {
            this.showNotification('Code copied to clipboard!');
          })
          .catch(err => {
            console.error('Could not copy code: ', err);
          });
      });
    });
  }
  
  initCodeGenerator() {
    // Elements are already referenced in initDomReferences
    
    // Add click event listeners
    this.copyFullCssBtn.addEventListener('click', () => {
      const css = this.fullCssOutput.textContent;
      navigator.clipboard.writeText(css)
        .then(() => {
          this.showNotification('CSS copied to clipboard!');
        })
        .catch(err => {
          console.error('Could not copy CSS: ', err);
        });
    });
    
    this.copyHtmlBtn.addEventListener('click', () => {
      const html = this.htmlOutput.textContent;
      navigator.clipboard.writeText(html)
        .then(() => {
          this.showNotification('HTML copied to clipboard!');
        })
        .catch(err => {
          console.error('Could not copy HTML: ', err);
        });
    });
    
    // Update initial outputs
    this.updateFullCSSOutput();
    this.updateHTMLOutput();
  }
  
  updateFullCSSOutput() {
    // Generate CSS for grid container
    let css = `.grid-container {
  display: grid;
  grid-template-columns: ${this.gridTemplateColumnsInput.value};
  grid-template-rows: ${this.gridTemplateRowsInput.value};
  gap: ${this.gridGapInput.value};
  justify-items: ${this.justifyItemsSelect.value};
  align-items: ${this.alignItemsSelect.value};
}`;
    
    // Generate CSS for grid items
    const items = this.shadowRoot.querySelectorAll('.grid-item');
    items.forEach((item, index) => {
      const gridColumn = item.style.gridColumn || 'auto';
      const gridRow = item.style.gridRow || 'auto';
      const justifySelf = item.style.justifySelf || 'auto';
      const alignSelf = item.style.alignSelf || 'auto';
      
      css += `

.grid-item:nth-child(${index + 1}) {
  grid-column: ${gridColumn};
  grid-row: ${gridRow};
  justify-self: ${justifySelf};
  align-self: ${alignSelf};
}`;
    });
    
    // Update full CSS output
    this.fullCssOutput.textContent = css;
  }
  
  updateHTMLOutput() {
    // Generate HTML for grid container and items
    let html = '<div class="grid-container">\n';
    
    const items = this.shadowRoot.querySelectorAll('.grid-item');
    items.forEach(item => {
      html += `  <div class="grid-item">${item.textContent}</div>\n`;
    });
    
    html += '</div>';
    
    // Update HTML output
    this.htmlOutput.textContent = html;
  }
  
  showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification success';
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

customElements.define('tool-css-grid', ToolCssGrid);
