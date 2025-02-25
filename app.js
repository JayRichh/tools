// Import web components
import './components/web-header.js'
import './components/web-nav.js'
import './components/web-footer.js'
import './components/web-seo.js'

class App {
  constructor() {
    this.header = document.querySelector('web-header')
    this.nav = document.querySelector('web-nav')
    this.setupEventListeners()
  }

  setupEventListeners() {
    // Listen for nav-closed events from the nav component
    document.addEventListener('nav-closed', () => {
      // Find the header's menu toggle and update its state
      const menuToggle = this.header?.shadowRoot?.querySelector('.menu-toggle')
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false')
      }
    })
  }
}

// Initialize the app after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  new App()
})
