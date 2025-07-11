class WebHeader extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    
    const style = document.createElement('style')
    style.textContent = `
      :host {
        display: block;
        width: 100%;
      }
      
      header {
        height: var(--header-height, 4rem);
        background: var(--sage, #a3a380);
        position: sticky;
        top: 0;
        z-index: var(--layer-header, 20);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        width: 100%;
      }
      
      .header-content {
        max-width: 84rem;
        margin: 0 auto;
        padding: 0 var(--content-spacing, 1rem);
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
      }
      
      .back-button {
        display: none;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: none;
        border: none;
        color: var(--light-beige, #f7f5e8);
        font-size: 1.125rem;
        font-weight: 500;
        cursor: pointer;
        z-index: 10;
        opacity: 1;
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      
      .back-button span:first-child {
        font-size: 1.5rem;
        line-height: 0.8;
        font-family: monospace;
        transform: translateX(0);
        transition: transform var(--transition-speed, 0.3s) var(--transition-timing, cubic-bezier(0.4, 0.0, 0.2, 1));
      }
      
      .back-button:hover span:first-child {
        transform: translateX(-6px);
      }
      
      .back-button:active span:first-child {
        transform: translateX(-12px);
      }
      
      .back-button.visible {
        display: flex;
      }
      
      .logo-link {
        text-decoration: none;
        position: relative;
        display: inline-block;
        padding-bottom: 4px;
      }
      
      .logo-link::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        bottom: 0;
        left: 0;
        background-color: var(--light-beige, #f7f5e8);
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .logo-link:hover::after {
        transform: scaleX(1);
        transform-origin: left;
      }
      
      .logo {
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: clamp(1.5rem, 3vw, 1.75rem);
        font-weight: 600;
        color: var(--light-beige, #f7f5e8);
        letter-spacing: -0.02em;
      }
      
      .logo img {
        width: clamp(24px, 5vw, 40px);
        height: auto;
        object-fit: contain;
        vertical-align: middle;
      }
      
      .menu-toggle {
        width: var(--header-height, 4rem);
        height: var(--header-height, 4rem);
        background: none;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        z-index: calc(var(--layer-nav, 9999) + 1);
        padding: 0.5rem;
        transition: background-color 0.3s ease;
      }
      
      .menu-toggle[aria-expanded="true"] {
        background: rgba(0, 0, 0, 0.1);
        z-index: calc(var(--layer-nav, 9999) + 9000);
      }
      
      .menu-toggle span {
        display: block;
        width: 32px;
        height: 3px;
        background: var(--light-beige, #f7f5e8);
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1),
                    opacity 0.2s cubic-bezier(0.4, 0.0, 0.2, 1),
                    background-color 0.3s ease,
                    box-shadow 0.3s ease;
      }
      
      .menu-toggle[aria-expanded="true"] span {
        background: var(--light-beige, #f7f5e8);
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
        width: 28px;
      }
      
      .menu-toggle span:nth-child(1) {
        top: calc(50% - 7px);
      }
      
      .menu-toggle span:nth-child(2) {
        top: 50%;
        transform: translate(-50%, -50%);
      }
      
      .menu-toggle span:nth-child(3) {
        top: calc(50% + 7px);
      }
      
      .menu-toggle[aria-expanded="true"] span:nth-child(1) {
        top: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
      }
      
      .menu-toggle[aria-expanded="true"] span:nth-child(2) {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0);
      }
      
      .menu-toggle[aria-expanded="true"] span:nth-child(3) {
        top: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
      }
    `
    
    const template = document.createElement('template')
    template.innerHTML = `
      <header>
        <div class="header-content">
          <button class="back-button" aria-label="Back to home">
            <span>←</span>
            <span>Back to Home</span>
          </button>
          <a href="" class="logo-link">
            <div class="logo">
              <img src="" alt="Web Tools Logo" width="24" height="24">
              <span>Web Tools</span>
            </div>
          </a>
          <button class="menu-toggle" aria-label="Toggle menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
    `
    
    this.shadowRoot.appendChild(style)
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    
    this.backButton = this.shadowRoot.querySelector('.back-button')
    this.logoLink = this.shadowRoot.querySelector('.logo-link')
    this.logoImg = this.shadowRoot.querySelector('.logo img')
    this.menuToggle = this.shadowRoot.querySelector('.menu-toggle')
  }
  
  connectedCallback() {
    this.setupPaths()
    this.setupBackButton()
    this.setupMenuToggle()
  }
  
  setupPaths() {
    const path = this.getBasePath()
    this.logoLink.href = `${path}index.html`
    this.logoImg.src = `${path}logo-bg-128.png`
  }
  
  getBasePath() {
    const currentPath = window.location.pathname
    
    // If we're at the root or index.html
    if (currentPath === '/' || 
        currentPath.endsWith('/index.html') || 
        currentPath === '/' || 
        currentPath === '/index.html') {
      return ''
    }
    
    // If we're in a tool directory
    if (currentPath.includes('/')) {
      return '../../'
    }
    
    return ''
  }
  
  setupBackButton() {
    const currentPath = window.location.pathname
    const isRootPage = currentPath === '/' || 
                      currentPath.endsWith('index.html') ||
                      currentPath === '/'
    
    if (!isRootPage) {
      this.backButton.classList.add('visible')
      this.backButton.addEventListener('click', (e) => {
        e.preventDefault()
        const transition = () => {
          window.location.href = `${this.getBasePath()}index.html`
        }
        this.backButton.style.opacity = '0'
        this.backButton.style.transform = 'translate(-50%, -50%) translateX(-8px)'
        setTimeout(transition, 300)
      })
    }
  }
  
  setupMenuToggle() {
    this.menuToggle.addEventListener('click', () => {
      const isExpanded = this.menuToggle.getAttribute('aria-expanded') === 'true'
      this.menuToggle.setAttribute('aria-expanded', !isExpanded)
      
      // Dispatch a custom event that the nav component can listen for
      const event = new CustomEvent('toggle-menu', { 
        detail: { isExpanded: !isExpanded },
        bubbles: true,
        composed: true
      })
      this.dispatchEvent(event)
    })
  }
}

customElements.define('web-header', WebHeader)
