class ToolEmoji extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    
    const style = document.createElement('style')
    style.textContent = `
      :host {
        display: block;
        padding: 2rem;
      }

      .container {
        width: 100%;
        max-width: 84rem;
        margin: 0 auto;
        padding: 0 var(--content-spacing);
      }

      .content {
        max-width: 1200px;
        margin: 0 auto;
      }

      .search-controls {
        width: 100%;
        max-width: 800px;
        margin: 0 auto 2rem;
        display: flex;
        gap: 1rem;
        align-items: start;
      }

      .input-group {
        flex: 1;
      }

      .search-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }

      .search-icon {
        position: absolute;
        left: 1rem;
        width: 1.25rem;
        height: 1.25rem;
        color: var(--sage);
        pointer-events: none;
      }

      input {
        width: 100%;
        padding: 0.875rem 2.5rem 0.875rem 2.75rem;
        font-size: 1rem;
        border: 2px solid var(--sage);
        border-radius: 0.75rem;
        background: var(--light-beige);
        color: var(--dark-sage);
        transition: all 0.2s;
      }

      input:focus {
        outline: none;
        border-color: var(--buff);
        box-shadow: 0 0 0 3px rgba(216, 164, 143, 0.2);
      }

      .clear-input {
        position: absolute;
        right: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        padding: 0;
        font-size: 1.25rem;
        color: var(--light-beige);
        background: var(--buff);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s;
        opacity: 0;
        transform: scale(0.8);
      }

      .clear-input.visible {
        opacity: 1;
        transform: scale(1);
      }

      .clear-input:hover {
        background: var(--deep-buff);
        transform: scale(1.1);
      }

      .filter-group {
        width: auto;
        min-width: 200px;
      }

      .select-wrapper {
        position: relative;
        display: flex;
        gap: 0.5rem;
      }

      select {
        flex: 1;
        appearance: none;
        padding: 0.875rem 2.5rem 0.875rem 1rem;
        font-size: 1rem;
        border: 2px solid var(--sage);
        border-radius: 0.75rem;
        background: var(--light-beige);
        color: var(--dark-sage);
        cursor: pointer;
        transition: all 0.2s;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b6b54' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 0.75rem center;
        background-size: 1.25rem;
      }

      select:focus {
        outline: none;
        border-color: var(--buff);
        box-shadow: 0 0 0 3px rgba(216, 164, 143, 0.2);
      }

      .clear-filter {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        padding: 0;
        font-size: 1.25rem;
        color: var(--light-beige);
        background: var(--buff);
        border: none;
        border-radius: 0.75rem;
        cursor: pointer;
        transition: all 0.2s;
        opacity: 0;
        transform: scale(0.8);
      }

      .clear-filter.visible {
        opacity: 1;
        transform: scale(1);
      }

      .clear-filter:hover {
        background: var(--deep-buff);
        transform: scale(1.05);
      }

      [data-theme="dark"] select {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23d1d1b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      }

      .emoji-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 1.5rem;
        padding: 1.5rem;
      }

      .emoji-item {
        aspect-ratio: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: var(--vanilla);
        border-radius: 0.75rem;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }

      .emoji-item:hover {
        transform: scale(1.05);
        background: var(--buff);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .emoji {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        transition: transform 0.2s;
      }

      .emoji-item:hover .emoji {
        transform: scale(1.1);
      }

      .tooltip-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 20000;
      }

      .tooltip {
        position: absolute;
        background: var(--dark-sage);
        color: white;
        padding: 0.5rem 0.75rem;
        border-radius: 0.25rem;
        font-size: 0.8rem;
        opacity: 0;
        transition: opacity 0.2s;
        pointer-events: none;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }

      .copied {
        position: fixed;
        top: 4rem;
        right: 2rem;
        background: var(--dark-sage);
        color: white;
        padding: 0.75rem 1.25rem;
        border-radius: 0.5rem;
        opacity: 0;
        transform: translateY(-10px);
        transition: opacity 0.3s, transform 0.3s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 20000;
      }

      .copied.show {
        opacity: 1;
        transform: translateY(0);
      }

      @media (max-width: 768px) {
        .search-controls {
          flex-direction: column;
          gap: 1rem;
        }

        .filter-group {
          width: 100%;
          min-width: 0;
        }

        .emoji-grid {
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 1rem;
          padding: 1rem;
        }

        .emoji {
          font-size: 2rem;
        }
      }
    `

    const template = document.createElement('template')
    template.innerHTML = `
      <div class="container">
        <div class="content">
          <div class="search-controls">
            <div class="input-group">
              <div class="search-wrapper">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" placeholder="Search emoji..." aria-label="Search emoji">
                <button class="clear-input" aria-label="Clear search">×</button>
              </div>
            </div>
            <div class="filter-group">
              <div class="select-wrapper">
                <select aria-label="Filter by group">
                  <option value="">All Categories</option>
                </select>
                <button class="clear-filter" aria-label="Reset filter">×</button>
              </div>
            </div>
          </div>
          <div class="emoji-grid"></div>
          <div class="copied">Copied!</div>
        </div>
      </div>
      <div class="tooltip-container">
        <div class="tooltip"></div>
      </div>
    `

    this.shadowRoot.appendChild(style)
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    
    this.emojiData = []
    this.groups = new Set()
    this.tooltip = null
    this.tooltipTarget = null
  }

  connectedCallback() {
    this.input = this.shadowRoot.querySelector('input')
    this.clearSearchButton = this.shadowRoot.querySelector('.clear-input')
    this.clearFilterButton = this.shadowRoot.querySelector('.clear-filter')
    this.groupSelect = this.shadowRoot.querySelector('select')
    this.grid = this.shadowRoot.querySelector('.emoji-grid')
    this.copiedNotification = this.shadowRoot.querySelector('.copied')
    this.tooltip = this.shadowRoot.querySelector('.tooltip')
    
    this.setupEventListeners()
    this.loadEmojiData()
    this.loadStateFromURL()
  }

  setupEventListeners() {
    const handleUpdate = () => {
      this.filterEmoji()
      this.updateClearButtons()
      this.updateURL()
    }

    this.input.addEventListener('input', handleUpdate)
    this.groupSelect.addEventListener('change', handleUpdate)

    this.clearSearchButton.addEventListener('click', () => {
      this.input.value = ''
      handleUpdate()
    })

    this.clearFilterButton.addEventListener('click', () => {
      this.groupSelect.value = ''
      handleUpdate()
    })

    // Global mouse move handler for tooltip
    document.addEventListener('mousemove', (e) => {
      if (this.tooltipTarget) {
        const rect = this.tooltipTarget.getBoundingClientRect()
        const tooltipRect = this.tooltip.getBoundingClientRect()
        
        // Position tooltip above the emoji
        let x = rect.left + (rect.width / 2) - (tooltipRect.width / 2)
        let y = rect.top - tooltipRect.height - 10

        // Keep tooltip within viewport
        x = Math.max(10, Math.min(x, window.innerWidth - tooltipRect.width - 10))
        y = Math.max(10, Math.min(y, window.innerHeight - tooltipRect.height - 10))

        this.tooltip.style.transform = `translate(${x}px, ${y}px)`
      }
    })
  }

  updateClearButtons() {
    const hasSearchValue = this.input.value.trim().length > 0
    this.clearSearchButton.classList.toggle('visible', hasSearchValue)
    
    const hasFilterValue = this.groupSelect.value.length > 0
    this.clearFilterButton.classList.toggle('visible', hasFilterValue)
  }

  loadStateFromURL() {
    const params = new URLSearchParams(window.location.search)
    const searchValue = params.get('search')?.trim() || ''
    const groupValue = params.get('group')?.trim() || ''
    
    this.input.value = searchValue
    this.initialGroup = groupValue
    this.updateClearButtons()
  }

  updateURL() {
    const params = new URLSearchParams(window.location.search)
    const searchValue = this.input.value.trim()
    const groupValue = this.groupSelect.value

    if (searchValue) {
      params.set('search', searchValue)
    } else {
      params.delete('search')
    }

    if (groupValue) {
      params.set('group', groupValue)
    } else {
      params.delete('group')
    }

    const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname
    window.history.replaceState(null, '', newURL)
  }

  parseEmojiData(content) {
    const lines = content.split('\n')
    let currentGroup = ''
    let currentSubgroup = ''
    const emojis = []

    lines.forEach(line => {
      line = line.trim()
      if (!line || line.startsWith('#')) {
        if (line.startsWith('# group:')) {
          currentGroup = line.replace('# group:', '').trim()
          this.groups.add(currentGroup)
        } else if (line.startsWith('# subgroup:')) {
          currentSubgroup = line.replace('# subgroup:', '').trim()
        }
        return
      }

      const match = line.match(/^([0-9A-F\s]+)\s*;\s*fully-qualified\s*#\s*(.*?)\s+([^E].*)/)
      if (match) {
        const [, codes, emoji, name] = match
        const codePoints = codes.trim().split(/\s+/).map(code => parseInt(code, 16))
        emojis.push({
          code: codes.trim(),
          char: String.fromCodePoint(...codePoints),
          name: name.trim(),
          group: currentGroup,
          subgroup: currentSubgroup
        })
      }
    })

    return emojis
  }

  updateGroupSelect() {
    const groups = Array.from(this.groups).sort()
    groups.forEach(group => {
      const option = document.createElement('option')
      option.value = group
      option.textContent = group
      this.groupSelect.appendChild(option)
    })

    if (this.initialGroup) {
      this.groupSelect.value = this.initialGroup
      this.filterEmoji()
    }
  }

  async loadEmojiData() {
    try {
      const response = await fetch('../../emoji-test.txt')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const content = await response.text()
      this.emojiData = this.parseEmojiData(content)
      this.updateGroupSelect()
      this.renderEmoji(this.emojiData)
    } catch (err) {
      console.error('Failed to load emoji data:', err)
      this.grid.innerHTML = `
        <p style="color: var(--dark-sage); text-align: center; padding: 2rem;">
          Failed to load emoji data. Please try refreshing the page.
        </p>
      `
    }
  }

  renderEmoji(emojis) {
    this.grid.innerHTML = ''
    
    emojis.forEach(emoji => {
      const item = document.createElement('div')
      item.className = 'emoji-item'
      item.innerHTML = `<span class="emoji">${emoji.char}</span>`
      
      item.addEventListener('click', () => this.copyEmoji(emoji.char))
      
      // Tooltip handling
      item.addEventListener('mouseenter', () => {
        this.tooltipTarget = item
        this.tooltip.textContent = emoji.name
        this.tooltip.style.opacity = '1'
      })
      
      item.addEventListener('mouseleave', () => {
        this.tooltipTarget = null
        this.tooltip.style.opacity = '0'
      })
      
      this.grid.appendChild(item)
    })
  }

  filterEmoji() {
    const query = this.input.value.trim().toLowerCase()
    const selectedGroup = this.groupSelect.value
    
    const filtered = this.emojiData.filter(emoji => {
      const matchesSearch = !query || 
        emoji.name.toLowerCase().includes(query) || 
        emoji.group.toLowerCase().includes(query) ||
        emoji.subgroup.toLowerCase().includes(query) ||
        emoji.char.includes(query)
      
      const matchesGroup = !selectedGroup || emoji.group === selectedGroup
      
      return matchesSearch && matchesGroup
    })
    
    this.renderEmoji(filtered)
  }

  async copyEmoji(emoji) {
    try {
      await navigator.clipboard.writeText(emoji)
      this.showCopiedNotification()
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  showCopiedNotification() {
    this.copiedNotification.classList.add('show')
    setTimeout(() => {
      this.copiedNotification.classList.remove('show')
    }, 2000)
  }
}

customElements.define('tool-emoji', ToolEmoji)
