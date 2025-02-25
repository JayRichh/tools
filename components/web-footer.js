class WebFooter extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    
    const style = document.createElement('style')
    style.textContent = `
      :host {
        display: block;
        width: 100%;
      }
      
      footer {
        background: var(--sage, #a3a380);
        margin-top: auto;
        height: var(--footer-height, 3.5rem);
        width: 100%;
      }
      
      .footer-content {
        max-width: 84rem;
        margin: 0 auto;
        padding: 0 var(--content-spacing, 1rem);
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .footer-left {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      
      .theme-toggle {
        background: none;
        border: none;
        color: var(--light-beige, #f7f5e8);
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 0.5rem;
        transition: all var(--transition-speed, 0.3s) var(--transition-timing, cubic-bezier(0.4, 0.0, 0.2, 1));
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .theme-toggle:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      .theme-toggle:active {
        transform: scale(0.95);
      }
      
      .footer-right a {
        color: var(--light-beige, #f7f5e8);
        text-decoration: none;
        font-size: 0.9rem;
        letter-spacing: 0.02em;
        opacity: 0.9;
        transition: all var(--transition-speed, 0.3s) var(--transition-timing, cubic-bezier(0.4, 0.0, 0.2, 1));
      }
      
      .footer-right a:hover {
        opacity: 1;
      }
      
      @media (hover: hover) {
        .footer-right a:hover {
          text-decoration: underline;
        }
      }
    `
    
    const template = document.createElement('template')
    template.innerHTML = `
      <footer>
        <div class="footer-content">
          <div class="footer-left">
            <button class="theme-toggle" aria-label="Toggle theme">
              <span class="theme-icon">🌞</span>
            </button>
          </div>
          <div class="footer-right">
            <a href="https://jayrich.dev" target="_blank" rel="noopener noreferrer">jayrich.dev</a>
          </div>
        </div>
      </footer>
    `
    
    this.shadowRoot.appendChild(style)
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    
    this.themeToggle = this.shadowRoot.querySelector('.theme-toggle')
    this.themeIcon = this.shadowRoot.querySelector('.theme-icon')
  }
  
  connectedCallback() {
    this.setupThemeToggle()
  }
  
  setupThemeToggle() {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark')
      this.themeIcon.textContent = '🌛'
    }
    
    // Toggle theme
    this.themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
      const newTheme = isDark ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', newTheme)
      this.themeIcon.textContent = isDark ? '🌞' : '🌛'
      localStorage.setItem('theme', newTheme)
    })
  }
}

customElements.define('web-footer', WebFooter)
