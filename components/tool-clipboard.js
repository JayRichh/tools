class ToolClipboard extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.isProcessing = false
    this.currentImage = null
    
    const style = document.createElement('style')
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
        grid-template-rows: auto auto auto auto;
        gap: 1.5rem;
        padding: 1rem;
        width: min(100%, 600px);
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
        max-width: 35ch;
        margin: 0 auto;
        line-height: 1.5;
        opacity: 0.9;
        text-align: center;
      }

      kbd {
        background: var(--vanilla, #d6ce93);
        padding: 0.25em 0.5em;
        border-radius: 2px;
        font-size: 0.9em;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
        font-weight: 600;
        display: inline-block;
        transform: skew(-2deg);
        margin: 0 0.15em;
        position: relative;
        top: -1px;
        color: var(--dark-sage);
      }

      #dropbox {
        width: 100%;
        min-height: 300px;
        border: 2px dashed var(--sage, #a3a380);
        border-radius: 0.75rem;
        padding: 1.5rem;
        position: relative;
        cursor: pointer;
        background: var(--beige, #efebce);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      #dropbox.hover {
        border-color: var(--buff, #d8a48f);
        background: var(--vanilla, #d6ce93);
        transform: scale(1.01);
        box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .icon {
        font-size: 3rem;
        color: var(--sage, #a3a380);
        opacity: 0.6;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        pointer-events: none;
      }

      #dropbox:hover .icon {
        transform: scale(1.1);
        opacity: 0.8;
      }

      .button-group {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
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
        min-width: 120px;
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

      img {
        display: block;
        max-width: 100%;
        max-height: 100%;
        height: auto;
        width: auto;
        object-fit: contain;
        border-radius: 0.5rem;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .notification {
        position: fixed;
        top: 4rem;
        right: 1rem;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        background: var(--dark-sage);
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

      .notification.error {
        background: #e74c3c;
      }

      .loading {
        position: absolute;
        inset: 0;
        background: rgba(239, 235, 206, 0.9);
        display: grid;
        place-items: center;
        z-index: 2;
      }

      .loading::after {
        content: '';
        width: 32px;
        height: 32px;
        border: 3px solid var(--sage);
        border-right-color: transparent;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @media (min-width: 1600px) {
        .main-content {
          width: min(100%, 800px);
        }
        
        #dropbox {
          min-height: 400px;
        }
      }

      @media (max-width: 480px) {
        .main-content {
          gap: 1rem;
          padding: 0.75rem;
        }

        h1 {
          font-size: 1.5rem;
        }

        p {
          font-size: 0.875rem;
        }

        .button-group {
          flex-direction: column;
          width: 100%;
        }

        button {
          width: 100%;
          min-width: 0;
        }
        
        #dropbox {
          min-height: 250px;
        }
      }
    `

    const template = document.createElement('template')
    template.innerHTML = `
      <div class="container">
        <div class="main-content">
          <h1>Clipboard Paste</h1>
          <p>Paste an image to download using <kbd>Ctrl+V</kbd>, drag & drop, or click the icon below.</p>
          
          <div id="dropbox">
            <div class="icon" id="dropIcon">
              📋
            </div>
          </div>

          <div class="button-group">
            <button id="pasteBtn">Paste Image</button>
            <button id="copyBtn" style="display: none;">Copy Image</button>
          </div>
        </div>
      </div>
    `

    this.shadowRoot.appendChild(style)
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  connectedCallback() {
    this.dropbox = this.shadowRoot.getElementById('dropbox')
    this.pasteBtn = this.shadowRoot.getElementById('pasteBtn')
    this.copyBtn = this.shadowRoot.getElementById('copyBtn')
    this.dropIcon = this.shadowRoot.getElementById('dropIcon')
    
    // Bind event handlers
    this.handlePaste = this.handlePaste.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
    this.handleDragOver = this.handleDragOver.bind(this)
    this.handleDragLeave = this.handleDragLeave.bind(this)
    this.handleButtonPaste = this.handleButtonPaste.bind(this)
    this.handleCopy = this.handleCopy.bind(this)
    
    // Add event listeners
    document.addEventListener('paste', this.handlePaste)
    this.dropbox.addEventListener('drop', this.handleDrop)
    this.dropbox.addEventListener('dragover', this.handleDragOver)
    this.dropbox.addEventListener('dragleave', this.handleDragLeave)
    this.pasteBtn.addEventListener('click', this.handleButtonPaste)
    this.copyBtn.addEventListener('click', this.handleCopy)
    this.dropIcon.addEventListener('click', this.handleButtonPaste)
  }

  disconnectedCallback() {
    // Remove event listeners
    document.removeEventListener('paste', this.handlePaste)
    this.dropbox.removeEventListener('drop', this.handleDrop)
    this.dropbox.removeEventListener('dragover', this.handleDragOver)
    this.dropbox.removeEventListener('dragleave', this.handleDragLeave)
    this.pasteBtn.removeEventListener('click', this.handleButtonPaste)
    this.copyBtn.removeEventListener('click', this.handleCopy)
    this.dropIcon.removeEventListener('click', this.handleButtonPaste)
  }

  showLoading(show) {
    const existingLoader = this.dropbox.querySelector('.loading')
    if (show && !existingLoader) {
      const loader = document.createElement('div')
      loader.className = 'loading'
      this.dropbox.appendChild(loader)
    } else if (!show && existingLoader) {
      existingLoader.remove()
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div')
    notification.className = `notification ${type}`
    notification.style.position = 'fixed';
    notification.style.top = '2rem';
    notification.style.right = '2rem';
    notification.style.zIndex = '9999';
    notification.style.pointerEvents = 'none';
    
    notification.textContent = message
    this.shadowRoot.appendChild(notification)
    
    requestAnimationFrame(() => {
      notification.classList.add('show')
      setTimeout(() => {
        notification.classList.remove('show')
        setTimeout(() => notification.remove(), 300)
      }, 3000)
    })
  }

  clearPreviousImage() {
    const images = this.dropbox.querySelectorAll('img')
    images.forEach(img => {
      URL.revokeObjectURL(img.src)
      img.remove()
    })
    this.currentImage = null
    this.copyBtn.style.display = 'none'
    this.dropIcon.style.display = 'block'
  }

  async processImage(file) {
    if (this.isProcessing) {
      this.showNotification('Please wait while processing current image', 'info')
      return
    }

    this.isProcessing = true
    this.showLoading(true)
    
    try {
      this.clearPreviousImage()
      
      const url = URL.createObjectURL(file)
      const img = document.createElement('img')
      img.src = url
      img.alt = "Pasted Image"
      this.dropbox.appendChild(img)
      this.currentImage = img
      this.copyBtn.style.display = 'block'
      this.dropIcon.style.display = 'none'

      const a = document.createElement('a')
      a.href = url
      const extension = file.type.split('/')[1] || 'png'
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      a.download = `clipboard_image_${timestamp}.${extension}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      this.showNotification('Image processed and downloaded successfully')
    } catch (error) {
      console.error('Failed to process image:', error)
      this.showNotification('Failed to process image', 'error')
    } finally {
      this.isProcessing = false
      this.showLoading(false)
    }
  }

  async handleCopy(e) {
    if (!this.currentImage) {
      this.showNotification('No image to copy', 'error')
      return
    }

    try {
      const response = await fetch(this.currentImage.src)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])
      this.showNotification('Image copied to clipboard')
      
      // Trigger burst animation
      const rainBackground = document.querySelector('emoji-rain-background')
      if (rainBackground && e) {
        const rect = this.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        rainBackground.burstEmoji('📋', x, y)
      }
    } catch (error) {
      console.error('Failed to copy image:', error)
      this.showNotification('Failed to copy image', 'error')
    }
  }

  handlePaste(e) {
    if (e.clipboardData) {
      const items = e.clipboardData.items
      let hasImage = false
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          hasImage = true
          const file = items[i].getAsFile()
          if (file) this.processImage(file)
          break
        }
      }
      
      if (!hasImage) {
        this.showNotification('No image found in clipboard', 'error')
      }
    }
  }

  handleDrop(e) {
    e.preventDefault()
    this.dropbox.classList.remove('hover')
    const files = e.dataTransfer.files
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.indexOf("image") !== -1) {
        this.processImage(files[i])
      }
    }
  }

  handleDragOver(e) {
    e.preventDefault()
    this.dropbox.classList.add('hover')
  }

  handleDragLeave() {
    this.dropbox.classList.remove('hover')
  }

  async handleButtonPaste() {
    if (navigator.clipboard && navigator.clipboard.read) {
      try {
        const items = await navigator.clipboard.read()
        for (const clipboardItem of items) {
          for (const type of clipboardItem.types) {
            if (type.startsWith('image/')) {
              const blob = await clipboardItem.getType(type)
              this.processImage(blob)
            }
          }
        }
      } catch (error) {
        console.error('Clipboard read failed:', error)
        this.showNotification('Unable to read from clipboard. Try using Ctrl+V.', 'error')
      }
    } else {
      this.showNotification('Clipboard API not supported. Use Ctrl+V instead.', 'error')
    }
  }
}

customElements.define('tool-clipboard', ToolClipboard)
