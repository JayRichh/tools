import '../../components/emoji-rain.js'

class ToolEmoji extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = `
      :host {
        display: block;
        height: 100%;
        position: relative;
        isolation: isolate;
        width: 100%;
      }

      emoji-rain-background {
        position: fixed;
        inset: 0;
        z-index: -1;
      }

      .container {
        height: 100%;
        width: 100%;
        position: relative;
        background: rgba(239, 235, 206, 0.85);
        backdrop-filter: blur(4px);
        border-radius: 1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        padding-right: 1rem;
        box-sizing: border-box;
      }

      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;
        width: 100%;
        z-index: 2;
        overflow: hidden;
      }

      .search-controls {
        flex-shrink: 0;
        width: 100%;
        max-width: 800px;
        margin: 0 auto 2rem;
        display: flex;
        gap: 1rem;
        align-items: flex-start;
        flex-wrap: wrap;
        position: sticky;
        top: 0;
        z-index: 10;
        background: rgba(239, 235, 206, 0.95);
        padding: 1rem;
        border-radius: 0.5rem;
        backdrop-filter: blur(4px);
        box-sizing: border-box;
      }

      .emoji-content {
        flex: 1;
        position: relative;
        width: 100%;
        margin: 0 auto;
        padding: 0 0.5rem;
      }

      .emoji-group {
        position: relative;
        display: grid;
        gap: 2rem;
        transition: transform 0.2s;
        width: 100%;
        box-sizing: border-box;
        padding: 0 0.5rem;
        margin-bottom: 2rem;
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

      input[type="text"] {
        width: 100%;
        padding: 0.875rem 2.5rem 0.875rem 2.75rem;
        font-size: 1rem;
        border: 2px solid var(--sage);
        border-radius: 0.75rem;
        background: var(--light-beige);
        color: var(--dark-sage);
        transition: all 0.2s;
      }

      input[type="text"]:focus {
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
        display: flex;
        gap: 1rem;
        align-items: center;
        min-width: 320px;
      }

      .select-wrapper {
        position: relative;
        display: flex;
        gap: 0.5rem;
        flex: 1;
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

      .size-control {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border: 2px solid var(--sage);
        border-radius: 0.75rem;
        background: var(--light-beige);
        padding: 0.75rem;
      }

      .size-decrease,
      .size-increase {
        background: none;
        border: none;
        color: var(--dark-sage);
        font-size: 1.25rem;
        cursor: pointer;
        line-height: 1;
        padding: 0.25rem 0.5rem;
        transition: transform 0.2s;
      }

      .size-decrease:hover,
      .size-increase:hover {
        transform: scale(1.1);
      }

      .size-range {
        -webkit-appearance: none;
        width: 100px;
        height: 2px;
        background: var(--sage);
        outline: none;
        border-radius: 1px;
        margin: 0 0.25rem;
      }

      .size-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--buff);
        cursor: pointer;
        transition: all 0.2s;
      }

      .size-range::-webkit-slider-thumb:hover {
        transform: scale(1.1);
        background: var(--deep-buff);
      }

      [data-theme="dark"] select {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23d1d1b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      }

      .group-header {
        font-size: 1.5rem;
        color: var(--dark-sage);
        font-weight: 700;
        margin: 0;
        padding-bottom: 0.75rem;
        border-bottom: 2px solid var(--sage);
      }

      .emoji-subgroup {
        display: grid;
        gap: 1rem;
      }

      .subgroup-header {
        font-size: 1.1rem;
        color: var(--dark-sage);
        opacity: 0.9;
        font-weight: 600;
        margin: 0;
      }

      .emoji-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(var(--emoji-size, 3.5rem), 1fr));
        gap: 0.5rem;
        padding: 0.5rem;
        background: var(--vanilla);
        border-radius: 0.5rem;
        width: 100%;
        box-sizing: border-box;
      }

      .emoji-item {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--light-beige);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
        font-size: var(--emoji-font-size, 1.75rem);
        border: 1px solid var(--sage);
      }

      .emoji-item:hover {
        transform: scale(1.1);
        background: var(--buff);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .tooltip-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
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
        z-index: 3;
      }

      .copied.show {
        opacity: 1;
        transform: translateY(0);
      }

      .loading-spinner {
        display: none;
        width: 50px;
        height: 50px;
        border: 5px solid var(--vanilla);
        border-top: 5px solid var(--buff);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 3;
        margin-top: 10rem;
      }

      @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }

      .loading-spinner.visible {
        display: block;
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
          grid-template-columns: repeat(3, 1fr);
        }

        .group-header {
          font-size: 1.25rem;
        }

        .subgroup-header {
          font-size: 1rem;
        }
      }
    `

    const template = document.createElement('template')
    template.innerHTML = `
      <emoji-rain-background></emoji-rain-background>
      <div class="container">
        <div class="loading-spinner"></div>
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
              <div class="size-control">
                <button class="size-decrease" type="button" aria-label="Decrease size">➖</button>
                <input type="range" class="size-range" min="40" max="100" value="56" aria-label="Emoji size">
                <button class="size-increase" type="button" aria-label="Increase size">➕</button>
              </div>
            </div>
          </div>
          <div class="emoji-content"></div>
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

    // Virtual scroll state
    this.filteredGroups = []
    this.groupHeights = new Map()
    this.visibleGroups = new Set()
    this.scrollPosition = 0
    this.viewportHeight = 0
    this.totalHeight = 0
    this.bufferGroups = 2
    this.resizeObserver = null
  }

  connectedCallback() {
    this.input = this.shadowRoot.querySelector('input[type="text"]')
    this.clearSearchButton = this.shadowRoot.querySelector('.clear-input')
    this.clearFilterButton = this.shadowRoot.querySelector('.clear-filter')
    this.groupSelect = this.shadowRoot.querySelector('select')
    this.emojiContent = this.shadowRoot.querySelector('.emoji-content')
    this.copiedNotification = this.shadowRoot.querySelector('.copied')
    this.tooltip = this.shadowRoot.querySelector('.tooltip')
    this.spinner = this.shadowRoot.querySelector('.loading-spinner')

    this.sizeRange = this.shadowRoot.querySelector('.size-range')
    this.sizeDecrease = this.shadowRoot.querySelector('.size-decrease')
    this.sizeIncrease = this.shadowRoot.querySelector('.size-increase')

    // Virtual scroll state initialization
    this.scrollTop = 0
    this.viewportHeight = 0
    this.totalHeight = 0
    this.visibleItems = new Map()
    this.itemHeights = new Map()
    this.itemPositions = new Map()
    this.bufferSize = 3 // Increased buffer size
    this.lastScrollDirection = 'down'
    this.scrollDebounceTimeout = null
    this.resizeDebounceTimeout = null
    this.updateDebounceTimeout = null

    this.setupEventListeners()
    this.setupResizeObserver()
    this.loadEmojiData()
    this.loadStateFromURL()
  }

  setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      clearTimeout(this.resizeDebounceTimeout)
      this.resizeDebounceTimeout = setTimeout(() => {
        this.viewportHeight = this.emojiContent.clientHeight
        this.recalculateVirtualScroll(true)
      }, 50)
    })
    this.resizeObserver.observe(this.emojiContent)
  }

  setupEventListeners() {
    const handleUpdate = () => {
      this.filterEmoji()
      this.updateClearButtons()
      this.updateURL()
    }

    // Debounce function
    const debounce = (fn, delay) => {
      let timeout
      return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => fn(...args), delay)
      }
    }

    // Apply debounce to search input
    this.input.addEventListener('input', debounce(handleUpdate, 300))

    // Group select changes can update immediately
    this.groupSelect.addEventListener('change', handleUpdate)

    this.clearSearchButton.addEventListener('click', () => {
      this.input.value = ''
      handleUpdate()
    })

    this.clearFilterButton.addEventListener('click', () => {
      this.groupSelect.value = ''
      handleUpdate()
    })

    // Size control with visual feedback
    this.sizeRange.addEventListener('input', (e) => {
      const size = e.target.value / 16 + 'rem'
      const fontSize = (e.target.value / 16) * 0.5 + 'rem'
      this.style.setProperty('--emoji-size', size)
      this.style.setProperty('--emoji-font-size', fontSize)
    })

    // Reload on size change completion
    this.sizeRange.addEventListener('mouseup', () => {
      this.itemHeights.clear()
      this.recalculateVirtualScroll(true)
    })

    this.sizeRange.addEventListener('touchend', () => {
      this.itemHeights.clear()
      this.recalculateVirtualScroll(true)
    })

    this.sizeDecrease.addEventListener('click', () => {
      const currentValue = parseInt(this.sizeRange.value, 10)
      const newValue = Math.max(40, currentValue - 4)
      this.sizeRange.value = newValue
      const size = newValue / 16 + 'rem'
      const fontSize = (newValue / 16) * 0.5 + 'rem'
      this.style.setProperty('--emoji-size', size)
      this.style.setProperty('--emoji-font-size', fontSize)
      this.itemHeights.clear()
      this.recalculateVirtualScroll(true)
    })

    this.sizeIncrease.addEventListener('click', () => {
      const currentValue = parseInt(this.sizeRange.value, 10)
      const newValue = Math.min(100, currentValue + 4)
      this.sizeRange.value = newValue
      const size = newValue / 16 + 'rem'
      const fontSize = (newValue / 16) * 0.5 + 'rem'
      this.style.setProperty('--emoji-size', size)
      this.style.setProperty('--emoji-font-size', fontSize)
      this.itemHeights.clear()
      this.recalculateVirtualScroll(true)
    })

    // Use window scroll event instead of emojiContent scroll
    window.addEventListener('scroll', (e) => {
      const scrollPosition = window.scrollY || window.pageYOffset
      const emojiContentRect = this.emojiContent.getBoundingClientRect()
      
      // Calculate the effective scroll position relative to the emoji content
      const effectiveScrollTop = Math.max(0, scrollPosition - emojiContentRect.top + window.innerHeight/2)
      
      this.lastScrollDirection = effectiveScrollTop > this.scrollTop ? 'down' : 'up'
      this.scrollTop = effectiveScrollTop
      
      clearTimeout(this.scrollDebounceTimeout)
      this.scrollDebounceTimeout = setTimeout(() => {
        this.updateVisibleItems()
      }, 5) // Reduced debounce time for more responsive scrolling
    })

    // Tooltip handling
    document.addEventListener('mousemove', (e) => {
      if (this.tooltipTarget) {
        const rect = this.tooltipTarget.getBoundingClientRect()
        const tooltipRect = this.tooltip.getBoundingClientRect()

        let x = rect.left + (rect.width / 2) - (tooltipRect.width / 2)
        let y = rect.top - tooltipRect.height - 10

        x = Math.max(10, Math.min(x, window.innerWidth - tooltipRect.width - 10))
        y = Math.max(10, Math.min(y, window.innerHeight - tooltipRect.height - 10))

        this.tooltip.style.transform = `translate(${x}px, ${y}px)`
      }
    })
  }

  // Simplified rendering approach that doesn't rely on virtual scrolling
  recalculateVirtualScroll(forceUpdate = false) {
    // Clear existing content
    this.emojiContent.innerHTML = '';
    this.visibleItems.clear();
    
    // Simply render all groups
    this.filteredGroups.forEach((group, index) => {
      const groupElement = this.createGroupSection(group, index);
      this.emojiContent.appendChild(groupElement);
      this.visibleItems.set(index, groupElement);
    });
  }
  
  // These methods are no longer needed with the simplified approach
  calculateItemHeight(index) {
    return 0; // Not used in the simplified approach
  }
  
  updateVisibleItems() {
    // Not needed in the simplified approach as we're rendering all items
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
    this.spinner.classList.add('visible')
    try {
      const response = await fetch('/tools/emoji/emoji-test.txt')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const content = await response.text()
      this.emojiData = this.parseEmojiData(content)
      this.updateGroupSelect()
      this.filterEmoji()
    } catch (err) {
      console.error('Failed to load emoji data:', err)
      this.emojiContent.innerHTML =
        '<p style="color: var(--dark-sage); text-align: center; padding: 2rem;">Failed to load emoji data. Please try refreshing the page.</p>'
    } finally {
      this.spinner.classList.remove('visible')
    }
  }

  buildGroupedData(emojis) {
    const groupedEmojis = emojis.reduce((acc, emoji) => {
      if (!acc[emoji.group]) {
        acc[emoji.group] = new Map()
      }
      if (!acc[emoji.group].has(emoji.subgroup)) {
        acc[emoji.group].set(emoji.subgroup, [])
      }
      acc[emoji.group].get(emoji.subgroup).push(emoji)
      return acc
    }, {})

    const groupArray = []
    Object.entries(groupedEmojis).forEach(([groupName, subgroups]) => {
      const subgroupArray = []
      subgroups.forEach((subgroupEmojis, subgroupName) => {
        subgroupArray.push({
          subgroupName,
          emojis: subgroupEmojis
        })
      })
      groupArray.push({
        groupName,
        subgroups: subgroupArray
      })
    })

    return groupArray
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

    this.filteredGroups = this.buildGroupedData(filtered)
      .sort((a, b) => a.groupName.localeCompare(b.groupName))

    // Reset scroll position and clear content
    this.emojiContent.scrollTop = 0
    this.scrollTop = 0
    this.visibleItems.clear()
    this.itemHeights.clear()
    this.itemPositions.clear()
    this.emojiContent.innerHTML = ''

    // Recalculate virtual scroll with the new data
    clearTimeout(this.updateDebounceTimeout)
    this.updateDebounceTimeout = setTimeout(() => {
      this.viewportHeight = this.emojiContent.clientHeight
      this.recalculateVirtualScroll(true)
    }, 50)
  }

  createGroupSection(groupObj, index) {
    const groupSection = document.createElement('div')
    groupSection.className = 'emoji-group'
    groupSection.dataset.groupIndex = index

    const groupHeader = document.createElement('h2')
    groupHeader.className = 'group-header'
    groupHeader.textContent = groupObj.groupName
    groupSection.appendChild(groupHeader)

    groupObj.subgroups.forEach(sub => {
      const subgroupSection = document.createElement('div')
      subgroupSection.className = 'emoji-subgroup'

      const subgroupHeader = document.createElement('h3')
      subgroupHeader.className = 'subgroup-header'
      subgroupHeader.textContent = sub.subgroupName
      subgroupSection.appendChild(subgroupHeader)

      const emojiGrid = document.createElement('div')
      emojiGrid.className = 'emoji-grid'

      sub.emojis.forEach(emoji => {
        emojiGrid.appendChild(this.createEmojiItem(emoji))
      })

      subgroupSection.appendChild(emojiGrid)
      groupSection.appendChild(subgroupSection)
    })

    return groupSection
  }

  createEmojiItem(emoji) {
    const item = document.createElement('div')
    item.className = 'emoji-item'
    item.textContent = emoji.char

    item.addEventListener('click', (e) => this.copyEmoji(emoji.char, e))
    item.addEventListener('mouseenter', () => {
      this.tooltipTarget = item
      this.tooltip.textContent = emoji.name
      this.tooltip.style.opacity = '1'
    })
    item.addEventListener('mouseleave', () => {
      this.tooltipTarget = null
      this.tooltip.style.opacity = '0'
    })

    return item
  }

  async copyEmoji(emoji, event) {
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
