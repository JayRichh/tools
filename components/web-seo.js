class WebSeo extends HTMLElement {
  constructor() {
    super()
    
    // This component doesn't use shadow DOM since it needs to modify the document head
    this.baseTitle = 'Web Tools'
    this.baseDescription = 'Free online developer tools for web developers and designers. Simple, fast, and easy to use web utilities.'
    this.baseUrl = 'https://jayrichh.github.io/tools/'
    this.baseImageUrl = 'https://jayrichh.github.io/tools/logo-bg-128.png'
  }
  
  connectedCallback() {
    // Get attributes or use defaults
    const pageTitle = this.getAttribute('page-title') || ''
    const pageDescription = this.getAttribute('description') || this.baseDescription
    const pageType = this.getAttribute('type') || 'website'
    const pagePath = this.getAttribute('path') || ''
    const pageImage = this.getAttribute('image') || this.baseImageUrl
    const pageKeywords = this.getAttribute('keywords') || 'web tools, developer tools, online utilities'
    
    // Construct full title
    const fullTitle = pageTitle ? `${pageTitle} - ${this.baseTitle}` : this.baseTitle
    
    // Construct full URL
    const fullUrl = `${this.baseUrl}${pagePath}`
    
    // Update document title
    document.title = fullTitle
    
    // Update or create meta tags
    this.updateMetaTag('description', pageDescription)
    this.updateMetaTag('keywords', pageKeywords)
    this.updateMetaTag('robots', 'index, follow')
    
    // Update or create Open Graph tags
    this.updateMetaTag('og:title', fullTitle, 'property')
    this.updateMetaTag('og:description', pageDescription, 'property')
    this.updateMetaTag('og:type', pageType, 'property')
    this.updateMetaTag('og:url', fullUrl, 'property')
    this.updateMetaTag('og:image', pageImage, 'property')
    
    // Update or create Twitter Card tags
    this.updateMetaTag('twitter:card', 'summary', 'name')
    this.updateMetaTag('twitter:title', fullTitle, 'name')
    this.updateMetaTag('twitter:description', pageDescription, 'name')
    this.updateMetaTag('twitter:image', pageImage, 'name')
    
    // Add canonical link if path is provided
    if (pagePath) {
      this.updateCanonicalLink(fullUrl)
    }
    
    // Add schema.org JSON-LD if type is provided
    if (pageType && pageType !== 'website') {
      this.addSchemaOrgData(pageType, fullTitle, pageDescription)
    }
  }
  
  updateMetaTag(name, content, attributeName = 'name') {
    let meta = document.querySelector(`meta[${attributeName}="${name}"]`)
    
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute(attributeName, name)
      document.head.appendChild(meta)
    }
    
    meta.setAttribute('content', content)
  }
  
  updateCanonicalLink(url) {
    let link = document.querySelector('link[rel="canonical"]')
    
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    
    link.setAttribute('href', url)
  }
  
  addSchemaOrgData(type, title, description) {
    // Remove any existing schema.org script
    const existingScript = document.querySelector('script[type="application/ld+json"]')
    if (existingScript) {
      existingScript.remove()
    }
    
    // Create schema.org data based on type
    let schemaData = {}
    
    switch (type) {
      case 'WebApplication':
        schemaData = {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': title,
          'description': description,
          'applicationCategory': 'UtilityApplication',
          'operatingSystem': 'Any',
          'offers': {
            '@type': 'Offer',
            'price': '0'
          }
        }
        break
        
      case 'Article':
        schemaData = {
          '@context': 'https://schema.org',
          '@type': 'Article',
          'headline': title,
          'description': description,
          'author': {
            '@type': 'Person',
            'name': 'Jay Rich'
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'Web Tools',
            'logo': {
              '@type': 'ImageObject',
              'url': this.baseImageUrl
            }
          }
        }
        break
        
      default:
        schemaData = {
          '@context': 'https://schema.org',
          '@type': type,
          'name': title,
          'description': description
        }
    }
    
    // Create and append the script element
    const script = document.createElement('script')
    script.setAttribute('type', 'application/ld+json')
    script.textContent = JSON.stringify(schemaData, null, 2)
    document.head.appendChild(script)
  }
}

customElements.define('web-seo', WebSeo)
