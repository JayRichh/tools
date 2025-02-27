class ToolFlexbox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Load external stylesheet
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '../../styles/tool-flexbox.css');
    
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="container">
        <div class="main-content">
          <h1>Flexbox Builder</h1>
          <p>Create, visualize, and generate CSS Flexbox layouts with an interactive builder</p>
          
          <div class="tabs">
            <button class="tab active" data-tab="builder">Visual Builder</button>
            <button class="tab" data-tab="templates">Flexbox Templates</button>
            <button class="tab" data-tab="tricks">Flexbox Tricks</button>
            <button class="tab" data-tab="code">Code Generator</button>
          </div>
          
          <!-- Visual Builder Tab -->
          <div class="tab-content active" data-content="builder">
            <div class="flex-builder-container">
              <div class="flex-canvas">
                <div class="flex-container" id="flex-container">
                  <div class="flex-item" data-id="1">Item 1</div>
                  <div class="flex-item" data-id="2">Item 2</div>
                  <div class="flex-item" data-id="3">Item 3</div>
                  <div class="flex-item" data-id="4">Item 4</div>
                </div>
              </div>
              
              <div class="controls-panel">
                <div class="control-group">
                  <h3>Flex Container</h3>
                  
                  <div class="control-row">
                    <label for="flex-direction">flex-direction</label>
                    <select id="flex-direction">
                      <option value="row" selected>row</option>
                      <option value="row-reverse">row-reverse</option>
                      <option value="column">column</option>
                      <option value="column-reverse">column-reverse</option>
                    </select>
                  </div>
                  
                  <div class="control-row">
                    <label for="flex-wrap">flex-wrap</label>
                    <select id="flex-wrap">
                      <option value="nowrap" selected>nowrap</option>
                      <option value="wrap">wrap</option>
                      <option value="wrap-reverse">wrap-reverse</option>
                    </select>
                  </div>
                  
                  <div class="control-row">
                    <label for="justify-content">justify-content</label>
                    <select id="justify-content">
                      <option value="flex-start" selected>flex-start</option>
                      <option value="flex-end">flex-end</option>
                      <option value="center">center</option>
                      <option value="space-between">space-between</option>
                      <option value="space-around">space-around</option>
                      <option value="space-evenly">space-evenly</option>
                    </select>
                  </div>
                  
                  <div class="control-row">
                    <label for="align-items">align-items</label>
                    <select id="align-items">
                      <option value="stretch" selected>stretch</option>
                      <option value="flex-start">flex-start</option>
                      <option value="flex-end">flex-end</option>
                      <option value="center">center</option>
                      <option value="baseline">baseline</option>
                    </select>
                  </div>
                  
                  <div class="control-row">
                    <label for="align-content">align-content</label>
                    <select id="align-content">
                      <option value="stretch" selected>stretch</option>
                      <option value="flex-start">flex-start</option>
                      <option value="flex-end">flex-end</option>
                      <option value="center">center</option>
                      <option value="space-between">space-between</option>
                      <option value="space-around">space-around</option>
                    </select>
                  </div>
                  
                  <div class="control-row">
                    <label for="gap">gap</label>
                    <input type="text" id="gap" value="10px">
                  </div>
                </div>
                
                <div class="control-group">
                  <h3>Selected Item</h3>
                  <div id="item-controls">
                    <p>Select an item to edit its properties</p>
                  </div>
                  <div id="item-controls-active" style="display: none;">
                    <div class="control-row">
                      <label for="flex-grow">flex-grow</label>
                      <input type="number" id="flex-grow" value="0" min="0" step="1">
                    </div>
                    
                    <div class="control-row">
                      <label for="flex-shrink">flex-shrink</label>
                      <input type="number" id="flex-shrink" value="1" min="0" step="1">
                    </div>
                    
                    <div class="control-row">
                      <label for="flex-basis">flex-basis</label>
                      <input type="text" id="flex-basis" value="auto">
                    </div>
                    
                    <div class="control-row">
                      <label for="align-self">align-self</label>
                      <select id="align-self">
                        <option value="auto" selected>auto</option>
                        <option value="flex-start">flex-start</option>
                        <option value="flex-end">flex-end</option>
                        <option value="center">center</option>
                        <option value="stretch">stretch</option>
                        <option value="baseline">baseline</option>
                      </select>
                    </div>
                    
                    <div class="control-row">
                      <label for="order">order</label>
                      <input type="number" id="order" value="0" step="1">
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
              <pre class="code-output" id="css-output">.flex-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
  align-content: stretch;
  gap: 10px;
}</pre>
            </div>
          </div>
          
          <!-- Templates Tab -->
          <div class="tab-content" data-content="templates">
            <div class="templates-grid">
              <div class="template-card" data-template="navbar">
                <div class="template-preview">
                  <div class="template-preview-item"></div>
                  <div class="template-preview-item"></div>
                  <div class="template-preview-item"></div>
                  <div class="template-preview-item"></div>
                </div>
                <div class="template-info">
                  <h3 class="template-title">Navigation Bar</h3>
                  <p class="template-description">Horizontal navigation bar with evenly spaced items</p>
                </div>
              </div>
              
              <div class="template-card" data-template="centered">
                <div class="template-preview">
                  <div class="template-preview-item"></div>
                </div>
                <div class="template-info">
                  <h3 class="template-title">Centered Content</h3>
                  <p class="template-description">Perfectly centered content both horizontally and vertically</p>
                </div>
              </div>
              
              <div class="template-card" data-template="sidebar">
                <div class="template-preview">
                  <div class="template-preview-item"></div>
                  <div class="template-preview-item"></div>
                </div>
                <div class="template-info">
                  <h3 class="template-title">Sidebar Layout</h3>
                  <p class="template-description">Fixed sidebar with flexible main content area</p>
                </div>
              </div>
              
              <div class="template-card" data-template="card-layout">
                <div class="template-preview">
                  <div class="template-preview-item"></div>
                  <div class="template-preview-item"></div>
                  <div class="template-preview-item"></div>
                </div>
                <div class="template-info">
                  <h3 class="template-title">Card Layout</h3>
                  <p class="template-description">Responsive card layout with wrapping</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Flexbox Tricks Tab -->
          <div class="tab-content" data-content="tricks">
            <div class="tricks-container">
              <div class="trick-card">
                <div class="trick-preview">
                  <div style="display: flex; justify-content: space-between; width: 100%;">
                    <div style="background: var(--vanilla); height: 30px; width: 30px;"></div>
                    <div style="background: var(--vanilla); height: 30px; width: 30px;"></div>
                    <div style="background: var(--vanilla); height: 30px; width: 30px;"></div>
                  </div>
                </div>
                <div class="trick-info">
                  <h3 class="trick-title">Equal Spacing with space-between</h3>
                  <p class="trick-description">Create equal spacing between items with the first and last items at the edges</p>
                  <pre class="trick-code">.container {
  display: flex;
  justify-content: space-between;
}</pre>
                  <button class="trick-copy-btn" data-code="space-between">Copy Code</button>
                </div>
              </div>
              
              <div class="trick-card">
                <div class="trick-preview">
                  <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
                    <div style="background: var(--vanilla); height: 50px; width: 50px;"></div>
                  </div>
                </div>
                <div class="trick-info">
                  <h3 class="trick-title">Perfect Centering</h3>
                  <p class="trick-description">The easiest way to center an element both horizontally and vertically</p>
                  <pre class="trick-code">.container {
  display: flex;
  justify-content: center;
  align-items: center;
}</pre>
                  <button class="trick-copy-btn" data-code="perfect-centering">Copy Code</button>
                </div>
              </div>
              
              <div class="trick-card">
                <div class="trick-preview">
                  <div style="display: flex; flex-wrap: wrap; gap: 5px; width: 100%;">
                    <div style="background: var(--vanilla); height: 30px; flex: 1 1 30%;"></div>
                    <div style="background: var(--vanilla); height: 30px; flex: 1 1 30%;"></div>
                    <div style="background: var(--vanilla); height: 30px; flex: 1 1 30%;"></div>
                    <div style="background: var(--vanilla); height: 30px; flex: 1 1 30%;"></div>
                    <div style="background: var(--vanilla); height: 30px; flex: 1 1 30%;"></div>
                  </div>
                </div>
                <div class="trick-info">
                  <h3 class="trick-title">Responsive Grid with Flexbox</h3>
                  <p class="trick-description">Create a responsive grid layout that wraps items as needed</p>
                  <pre class="trick-code">.container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.item {
  flex: 1 1 300px; /* grow | shrink | basis */
}</pre>
                  <button class="trick-copy-btn" data-code="responsive-grid">Copy Code</button>
                </div>
              </div>
              
              <div class="trick-card">
                <div class="trick-preview">
                  <div style="display: flex; flex-direction: column; height: 100px; width: 100%;">
                    <div style="background: var(--vanilla); flex: 0 0 auto; height: 20px;"></div>
                    <div style="background: var(--buff); flex: 1 0 auto;"></div>
                    <div style="background: var(--vanilla); flex: 0 0 auto; height: 20px;"></div>
                  </div>
                </div>
                <div class="trick-info">
                  <h3 class="trick-title">Sticky Footer with Flexbox</h3>
                  <p class="trick-description">Create a layout with header, flexible content, and footer that sticks to the bottom</p>
                  <pre class="trick-code">.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header, .footer {
  flex: 0 0 auto;
}

.content {
  flex: 1 0 auto;
}</pre>
                  <button class="trick-copy-btn" data-code="sticky-footer">Copy Code</button>
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
              <pre class="code-output" id="full-css-output">.flex-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
  align-content: stretch;
  gap: 10px;
}

.flex-item:nth-child(1) {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
  align-self: auto;
  order: 0;
}

.flex-item:nth-child(2) {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
  align-self: auto;
  order: 0;
}

.flex-item:nth-child(3) {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
  align-self: auto;
  order: 0;
}

.flex-item:nth-child(4) {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
  align-self: auto;
  order: 0;
}</pre>
            </div>
            
            <div class="code-output-container">
              <div class="code-header">
                <h2>HTML Code</h2>
                <button id="copy-html-btn" class="secondary">Copy HTML</button>
              </div>
              <pre class="code-output" id="html-output">&lt;div class="flex-container"&gt;
  &lt;div class="flex-item"&gt;Item 1&lt;/div&gt;
  &lt;div class="flex-item"&gt;Item 2&lt;/div&gt;
  &lt;div class="flex-item"&gt;Item 3&lt;/div&gt;
  &lt;div class="flex-item"&gt;Item 4&lt;/div&gt;
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
    this.initFlexboxBuilder();
    this.initTemplates();
    this.initTricks();
    this.initCodeGenerator();
    
    // Apply initial styles after everything is initialized
    this.applyFlexboxStyles();
    this.updateFullCSSOutput();
    this.updateHTMLOutput();
  }
  
  initDomReferences() {
    // Container elements
    this.flexContainer = this.shadowRoot.getElementById('flex-container');
    this.flexItems = this.shadowRoot.querySelectorAll('.flex-item');
    
    // Container controls
    this.flexDirectionSelect = this.shadowRoot.getElementById('flex-direction');
    this.flexWrapSelect = this.shadowRoot.getElementById('flex-wrap');
    this.justifyContentSelect = this.shadowRoot.getElementById('justify-content');
    this.alignItemsSelect = this.shadowRoot.getElementById('align-items');
    this.alignContentSelect = this.shadowRoot.getElementById('align-content');
    this.gapInput = this.shadowRoot.getElementById('gap');
    
    // Item controls
    this.itemControls = this.shadowRoot.getElementById('item-controls');
    this.itemControlsActive = this.shadowRoot.getElementById('item-controls-active');
    this.flexGrowInput = this.shadowRoot.getElementById('flex-grow');
    this.flexShrinkInput = this.shadowRoot.getElementById('flex-shrink');
    this.flexBasisInput = this.shadowRoot.getElementById('flex-basis');
    this.alignSelfSelect = this.shadowRoot.getElementById('align-self');
    this.orderInput = this.shadowRoot.getElementById('order');
    
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
  
  initFlexboxBuilder() {
    // Apply initial flexbox styles - moved to connectedCallback
    // this.applyFlexboxStyles();
    
    // Set up event listeners for flexbox container controls
    this.flexDirectionSelect.addEventListener('change', () => this.applyFlexboxStyles());
    this.flexWrapSelect.addEventListener('change', () => this.applyFlexboxStyles());
    this.justifyContentSelect.addEventListener('change', () => this.applyFlexboxStyles());
    this.alignItemsSelect.addEventListener('change', () => this.applyFlexboxStyles());
    this.alignContentSelect.addEventListener('change', () => this.applyFlexboxStyles());
    this.gapInput.addEventListener('input', () => this.applyFlexboxStyles());
    
    // Set up event listeners for item controls
    this.flexGrowInput.addEventListener('input', () => this.applyItemStyles());
    this.flexShrinkInput.addEventListener('input', () => this.applyItemStyles());
    this.flexBasisInput.addEventListener('input', () => this.applyItemStyles());
    this.alignSelfSelect.addEventListener('change', () => this.applyItemStyles());
    this.orderInput.addEventListener('input', () => this.applyItemStyles());
    
    // Set up event listeners for buttons
    this.addItemBtn.addEventListener('click', () => this.addFlexItem());
    this.removeItemBtn.addEventListener('click', () => this.removeFlexItem());
    this.copyCssBtn.addEventListener('click', () => this.copyCSS());
    
    // Set up event listeners for flex items
    this.setupFlexItemListeners();
  }
  
  setupFlexItemListeners() {
    // Clear any existing listeners by removing old references
    if (this.flexContainer) {
      // Remove existing dragover/drop listeners
      this.flexContainer.removeEventListener('dragover', this.handleDragOver);
      this.flexContainer.removeEventListener('drop', this.handleDrop);
      
      // Store bound methods for later removal
      this.handleDragOver = this.handleDragOver.bind(this);
      this.handleDrop = this.handleDrop.bind(this);
      
      // Add listeners with bound methods
      this.flexContainer.addEventListener('dragover', this.handleDragOver);
      this.flexContainer.addEventListener('drop', this.handleDrop);
    }
    
    // Update flex items reference
    this.flexItems = this.shadowRoot.querySelectorAll('.flex-item');
    
    // Set up each item
    this.flexItems.forEach(item => {
      // Clone to remove existing listeners
      const newItem = item.cloneNode(true);
      
      // Copy all inline styles from the original item
      Array.from(item.style).forEach(property => {
        newItem.style[property] = item.style[property];
      });
      
      // Replace the original item
      if (item.parentNode) {
        item.parentNode.replaceChild(newItem, item);
      }
      
      // Add click listener
      newItem.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.selectFlexItem(newItem);
      });
      
      // Make draggable
      newItem.setAttribute('draggable', 'true');
      
      // Add drag start listener
      newItem.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', newItem.dataset.id);
        this.draggedItem = newItem;
        
        // Add visual feedback
        newItem.classList.add('dragging');
        
        // Create a drag image
        const dragImage = newItem.cloneNode(true);
        dragImage.style.opacity = '0.7';
        dragImage.style.position = 'absolute';
        dragImage.style.top = '-1000px';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 20, 20);
        
        // Remove the drag image after drag ends
        setTimeout(() => {
          document.body.removeChild(dragImage);
        }, 0);
      });
      
      // Add drag end listener
      newItem.addEventListener('dragend', () => {
        if (this.draggedItem) {
          this.draggedItem.classList.remove('dragging');
        }
      });
    });
  }
  
  handleDragOver(e) {
    e.preventDefault(); // Allow drop
    
    // Add visual cue for drop target
    const items = Array.from(this.flexContainer.children);
    items.forEach(item => {
      item.classList.remove('drop-target');
    });
    
    // Find potential drop target
    const dropTarget = this.findDropTarget(e.clientX, e.clientY);
    if (dropTarget && dropTarget !== this.draggedItem) {
      dropTarget.classList.add('drop-target');
    }
  }
  
  handleDrop(e) {
    e.preventDefault();
    
    // Remove visual cues
    const items = Array.from(this.flexContainer.children);
    items.forEach(item => {
      item.classList.remove('drop-target');
    });
    
    if (this.draggedItem) {
      // Get drop position
      const rect = this.flexContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate new order
      const items = Array.from(this.flexContainer.children);
      const dropIndex = this.calculateDropIndex(items, x, y);
      
      // Update the order property
      this.draggedItem.style.order = dropIndex;
      
      // Select the dragged item to update controls
      this.selectFlexItem(this.draggedItem);
      
      // Update CSS output
      this.updateCSSOutput();
    }
  }
  
  findDropTarget(clientX, clientY) {
    const items = Array.from(this.flexContainer.children);
    
    // Find the item under the cursor
    for (const item of items) {
      const rect = item.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        return item;
      }
    }
    
    return null;
  }
  
  calculateDropIndex(items, x, y) {
    // Get the flex direction
    const direction = this.flexDirectionSelect.value;
    const isRow = direction.includes('row');
    const isReverse = direction.includes('reverse');
    
    // Get the container rect
    const containerRect = this.flexContainer.getBoundingClientRect();
    
    // Calculate relative position within container
    const relX = (x - containerRect.left) / containerRect.width;
    const relY = (y - containerRect.top) / containerRect.height;
    
    // Get positions of all items
    const positions = items.map(item => {
      const rect = item.getBoundingClientRect();
      return {
        item,
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        center: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        },
        // Calculate relative position within container
        relCenter: {
          x: (rect.left + rect.width / 2 - containerRect.left) / containerRect.width,
          y: (rect.top + rect.height / 2 - containerRect.top) / containerRect.height
        }
      };
    });
    
    // Filter out the dragged item
    const filteredPositions = positions.filter(pos => pos.item !== this.draggedItem);
    
    // If no other items, return 0
    if (filteredPositions.length === 0) {
      return 0;
    }
    
    // Sort positions based on direction
    if (isRow) {
      filteredPositions.sort((a, b) => isReverse ? b.relCenter.x - a.relCenter.x : a.relCenter.x - b.relCenter.x);
    } else {
      filteredPositions.sort((a, b) => isReverse ? b.relCenter.y - a.relCenter.y : a.relCenter.y - b.relCenter.y);
    }
    
    // Find the index where the item should be inserted
    for (let i = 0; i < filteredPositions.length; i++) {
      const pos = filteredPositions[i];
      if (isRow) {
        if ((isReverse && relX > pos.relCenter.x) || (!isReverse && relX < pos.relCenter.x)) {
          return i;
        }
      } else {
        if ((isReverse && relY > pos.relCenter.y) || (!isReverse && relY < pos.relCenter.y)) {
          return i;
        }
      }
    }
    
    return filteredPositions.length;
  }
  
  selectFlexItem(item) {
    if (!item) return;
    
    // Remove selected class from all items
    this.flexItems.forEach(i => i.classList.remove('selected'));
    
    // Add selected class to clicked item
    item.classList.add('selected');
    
    // Show item controls
    if (this.itemControls && this.itemControlsActive) {
      this.itemControls.style.display = 'none';
      this.itemControlsActive.style.display = 'block';
    }
    
    // Update item controls with current values
    this.selectedItem = item;
    
    // Get computed styles if inline styles are not set
    const computedStyle = window.getComputedStyle(item);
    
    // Safely update input values
    if (this.flexGrowInput) {
      this.flexGrowInput.value = item.style.flexGrow || 
                               (computedStyle.flexGrow !== '' ? computedStyle.flexGrow : '0');
    }
    
    if (this.flexShrinkInput) {
      this.flexShrinkInput.value = item.style.flexShrink || 
                                 (computedStyle.flexShrink !== '' ? computedStyle.flexShrink : '1');
    }
    
    if (this.flexBasisInput) {
      this.flexBasisInput.value = item.style.flexBasis || 
                                (computedStyle.flexBasis !== 'auto' ? computedStyle.flexBasis : 'auto');
    }
    
    if (this.alignSelfSelect) {
      this.alignSelfSelect.value = item.style.alignSelf || 
                                 (computedStyle.alignSelf !== 'auto' ? computedStyle.alignSelf : 'auto');
    }
    
    if (this.orderInput) {
      this.orderInput.value = item.style.order || 
                            (computedStyle.order !== '0' ? computedStyle.order : '0');
    }
  }
  
  applyFlexboxStyles() {
    if (!this.flexContainer) return;
    
    try {
      // Apply flexbox styles to container
      this.flexContainer.style.flexDirection = this.flexDirectionSelect.value;
      this.flexContainer.style.flexWrap = this.flexWrapSelect.value;
      this.flexContainer.style.justifyContent = this.justifyContentSelect.value;
      this.flexContainer.style.alignItems = this.alignItemsSelect.value;
      this.flexContainer.style.alignContent = this.alignContentSelect.value;
      this.flexContainer.style.gap = this.gapInput.value;
      
      // Update CSS output
      this.updateCSSOutput();
    } catch (error) {
      console.error('Error applying flexbox styles:', error);
    }
  }
  
  applyItemStyles() {
    if (!this.selectedItem) return;
    
    try {
      // Validate inputs
      const flexGrow = parseFloat(this.flexGrowInput.value);
      const flexShrink = parseFloat(this.flexShrinkInput.value);
      const flexBasis = this.validateFlexBasis(this.flexBasisInput.value);
      const alignSelf = this.alignSelfSelect.value;
      const order = parseInt(this.orderInput.value, 10);
      
      // Apply styles to selected item
      this.selectedItem.style.flexGrow = isNaN(flexGrow) ? '0' : flexGrow.toString();
      this.selectedItem.style.flexShrink = isNaN(flexShrink) ? '1' : flexShrink.toString();
      this.selectedItem.style.flexBasis = flexBasis;
      this.selectedItem.style.alignSelf = alignSelf;
      this.selectedItem.style.order = isNaN(order) ? '0' : order.toString();
      
      // Update CSS output
      this.updateCSSOutput();
    } catch (error) {
      console.error('Error applying item styles:', error);
    }
  }
  
  validateFlexBasis(value) {
    // Check if it's a valid CSS size value
    if (value === 'auto' || value === 'content' || value === 'max-content' || 
        value === 'min-content' || value === 'fit-content') {
      return value;
    }
    
    // Check if it's a valid CSS length
    const validUnits = ['px', 'em', 'rem', '%', 'vw', 'vh', 'vmin', 'vmax', 'fr'];
    const hasValidUnit = validUnits.some(unit => value.endsWith(unit));
    
    if (hasValidUnit) {
      return value;
    }
    
    // Check if it's a valid number
    if (!isNaN(parseFloat(value))) {
      return value;
    }
    
    // Default to auto if invalid
    return 'auto';
  }
  
  updateCSSOutput() {
    if (!this.cssOutput) return;
    
    try {
      // Generate CSS for flexbox container
      let css = `.flex-container {
  display: flex;
  flex-direction: ${this.flexDirectionSelect.value};
  flex-wrap: ${this.flexWrapSelect.value};
  justify-content: ${this.justifyContentSelect.value};
  align-items: ${this.alignItemsSelect.value};
  align-content: ${this.alignContentSelect.value};
  gap: ${this.gapInput.value};
}`;
      
      // Update CSS output
      this.cssOutput.textContent = css;
      
      // Update full CSS output in code generator tab
      if (this.fullCssOutput) {
        this.updateFullCSSOutput();
      }
    } catch (error) {
      console.error('Error updating CSS output:', error);
    }
  }
  
  addFlexItem() {
    // Get current number of items
    const itemCount = this.flexContainer.children.length;
    
    // Create new item
    const newItem = document.createElement('div');
    newItem.className = 'flex-item';
    newItem.dataset.id = itemCount + 1;
    newItem.textContent = `Item ${itemCount + 1}`;
    
    // Add to container
    this.flexContainer.appendChild(newItem);
    
    // Update flex items and set up listeners
    this.setupFlexItemListeners();
    
    // Update HTML output
    this.updateHTMLOutput();
    
    // Select the new item
    this.selectFlexItem(newItem);
  }
  
  removeFlexItem() {
    if (!this.selectedItem) return;
    
    // Remove selected item
    this.flexContainer.removeChild(this.selectedItem);
    
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
    if (!this.flexContainer) return;
    
    try {
      switch (templateName) {
        case 'navbar':
          // Set container properties
          this.flexDirectionSelect.value = 'row';
          this.flexWrapSelect.value = 'nowrap';
          this.justifyContentSelect.value = 'space-between';
          this.alignItemsSelect.value = 'center';
          this.alignContentSelect.value = 'stretch';
          this.gapInput.value = '10px';
          
          // Clear existing items
          this.flexContainer.innerHTML = '';
          
          // Add new items
          const logo = this.createFlexItem('Logo', '0', '0', 'auto', 'auto', '0');
          const navItem1 = this.createFlexItem('Home', '0', '0', 'auto', 'auto', '0');
          const navItem2 = this.createFlexItem('About', '0', '0', 'auto', 'auto', '0');
          const navItem3 = this.createFlexItem('Contact', '0', '0', 'auto', 'auto', '0');
          
          this.flexContainer.append(logo, navItem1, navItem2, navItem3);
          break;
        
        case 'centered':
          // Set container properties
          this.flexDirectionSelect.value = 'row';
          this.flexWrapSelect.value = 'nowrap';
          this.justifyContentSelect.value = 'center';
          this.alignItemsSelect.value = 'center';
          this.alignContentSelect.value = 'stretch';
          this.gapInput.value = '0';
          
          // Clear existing items
          this.flexContainer.innerHTML = '';
          
          // Add new item
          const centeredItem = this.createFlexItem('Centered Content', '0', '0', 'auto', 'auto', '0');
          
          this.flexContainer.appendChild(centeredItem);
          break;
        
        case 'sidebar':
          // Set container properties
          this.flexDirectionSelect.value = 'row';
          this.flexWrapSelect.value = 'nowrap';
          this.justifyContentSelect.value = 'flex-start';
          this.alignItemsSelect.value = 'stretch';
          this.alignContentSelect.value = 'stretch';
          this.gapInput.value = '20px';
          
          // Clear existing items
          this.flexContainer.innerHTML = '';
          
          // Add new items
          const sidebar = this.createFlexItem('Sidebar', '0', '0', '250px', 'auto', '0');
          const content = this.createFlexItem('Main Content', '1', '1', 'auto', 'auto', '0');
          
          this.flexContainer.append(sidebar, content);
          break;
        
        case 'card-layout':
          this.flexDirectionSelect.value = 'row';
          this.flexWrapSelect.value = 'wrap';
          this.justifyContentSelect.value = 'flex-start';
          this.alignItemsSelect.value = 'stretch';
          this.alignContentSelect.value = 'flex-start';
          this.gapInput.value = '20px';
          
          // Clear existing items
          this.flexContainer.innerHTML = '';
          
          // Add new items
          for (let i = 1; i <= 6; i++) {
            const card = this.createFlexItem(`Card ${i}`, '1', '1', '200px', 'auto', '0');
            this.flexContainer.appendChild(card);
          }
          break;
      }
      
      // Apply flexbox styles
      this.applyFlexboxStyles();
      
      // Update HTML output
      this.updateHTMLOutput();
      
      // Setup flex item listeners
      this.setupFlexItemListeners();
      
      // Switch to builder tab
      this.switchTab('builder');
      
      // Show notification
      this.showNotification(`Applied ${templateName.replace('-', ' ')} template`);
    } catch (error) {
      console.error('Error applying template:', error);
    }
  }
  
  createFlexItem(text, grow = '0', shrink = '1', basis = 'auto', alignSelf = 'auto', order = '0') {
    const item = document.createElement('div');
    item.className = 'flex-item';
    item.textContent = text;
    
    item.style.flexGrow = grow;
    item.style.flexShrink = shrink;
    item.style.flexBasis = basis;
    item.style.alignSelf = alignSelf;
    item.style.order = order;
    
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
    // Get elements
    this.fullCssOutput = this.shadowRoot.getElementById('full-css-output');
    this.htmlOutput = this.shadowRoot.getElementById('html-output');
    this.copyFullCssBtn = this.shadowRoot.getElementById('copy-full-css-btn');
    this.copyHtmlBtn = this.shadowRoot.getElementById('copy-html-btn');
    
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
    // Generate CSS for flexbox container
    let css = `.flex-container {
  display: flex;
  flex-direction: ${this.flexDirectionSelect.value};
  flex-wrap: ${this.flexWrapSelect.value};
  justify-content: ${this.justifyContentSelect.value};
  align-items: ${this.alignItemsSelect.value};
  align-content: ${this.alignContentSelect.value};
  gap: ${this.gapInput.value};
}`;
    
    // Generate CSS for flex items
    const items = this.shadowRoot.querySelectorAll('.flex-item');
    items.forEach((item, index) => {
      const flexGrow = item.style.flexGrow || '0';
      const flexShrink = item.style.flexShrink || '1';
      const flexBasis = item.style.flexBasis || 'auto';
      const alignSelf = item.style.alignSelf || 'auto';
      const order = item.style.order || '0';
      
      css += `

.flex-item:nth-child(${index + 1}) {
  flex-grow: ${flexGrow};
  flex-shrink: ${flexShrink};
  flex-basis: ${flexBasis};
  align-self: ${alignSelf};
  order: ${order};
}`;
    });
    
    // Update full CSS output
    this.fullCssOutput.textContent = css;
  }
  
  updateHTMLOutput() {
    // Generate HTML for flex container and items
    let html = '<div class="flex-container">\n';
    
    const items = this.shadowRoot.querySelectorAll('.flex-item');
    items.forEach(item => {
      html += `  <div class="flex-item">${item.textContent}</div>\n`;
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

customElements.define('tool-flexbox', ToolFlexbox);
