class App {
  constructor() {
    this.menuToggle = document.querySelector('.menu-toggle')
    this.navDrawer = document.querySelector('.nav-drawer')
    this.navClose = document.querySelector('.nav-close')
    this.setupEventListeners()
  }

  setupEventListeners() {
    this.menuToggle.addEventListener('click', () => this.toggleMenu())
    this.navClose.addEventListener('click', () => this.closeMenu())
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isMenuOpen()) {
        this.closeMenu()
      }
    })

    document.addEventListener('click', e => {
      const link = e.target.closest('a')
      if (link && link.classList.contains('nav-link') && !link.hasAttribute('target')) {
        e.preventDefault()
        this.handleNavigation(link.href)
      }
    })
  }

  isMenuOpen() {
    return this.menuToggle.getAttribute('aria-expanded') === 'true'
  }

  toggleMenu() {
    const isOpen = this.isMenuOpen()
    this.menuToggle.setAttribute('aria-expanded', !isOpen)
    this.navDrawer.setAttribute('aria-hidden', isOpen)
  }

  closeMenu() {
    this.menuToggle.setAttribute('aria-expanded', false)
    this.navDrawer.setAttribute('aria-hidden', true)
  }

  async handleNavigation(url) {
    this.navDrawer.style.transform = 'translateY(100%)'
    await new Promise(resolve => setTimeout(resolve, 300))
    window.location.href = url
  }
}

new App()
