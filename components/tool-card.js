class ToolCard extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    
    const style = document.createElement('style')
    style.textContent = `
      :host {
        display: block;
        background: var(--vanilla);
        border-radius: clamp(1rem, 3vw, 1.5rem);
        position: relative;
        cursor: pointer;
        padding: 2rem;
        min-height: 280px;
        will-change: transform;
        transition: all var(--transition-speed, 0.3s) var(--transition-timing, cubic-bezier(0.4, 0.0, 0.2, 1));
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        overflow: hidden;
      }

      :host(:hover) {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        background: var(--buff);
      }

      :host(:focus-visible) {
        outline: 3px solid var(--accent);
        outline-offset: 4px;
      }

      .card {
        display: grid;
        grid-template-rows: 1fr auto auto;
        align-items: center;
        justify-items: center;
        gap: 1.5rem;
        height: 100%;
        position: relative;
        z-index: 1;
      }

      .title {
        font-size: clamp(1.5rem, 4vw, 2rem);
        font-weight: 700;
        color: var(--dark-sage);
        text-align: center;
        margin: 0;
        line-height: 1.1;
        letter-spacing: -0.02em;
        grid-row: 2;
      }

      .icon {
        font-size: clamp(3rem, 8vw, 4rem);
        line-height: 1;
        transition: transform var(--transition-speed, 0.3s) var(--transition-timing, cubic-bezier(0.4, 0.0, 0.2, 1));
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        grid-row: 1;
        align-self: end;
        color: var(--dark-sage);
      }

      :host(:hover) .icon {
        transform: scale(1.2) rotate(5deg);
        color: var(--light-beige);
      }

      .description {
        background: var(--vanilla);
        color: var(--dark-sage);
        text-align: center;
        font-size: 0.9rem;
        line-height: 1.5;
        padding: 1.25rem;
        margin: -1rem -2rem 0;
        border-radius: clamp(0.5rem, 2vw, 0.75rem);
        opacity: 0;
        transform: translateY(100%);
        transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        grid-row: 3;
        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
        font-weight: 500;
      }

      :host(:hover) .description {
        opacity: 1;
        transform: translateY(0);
        background: var(--buff);
        color: var(--light-beige);
      }

      :host(:hover) .title {
        color: var(--light-beige);
      }

      ::slotted(p) {
        margin: 0;
        font-size: inherit;
        line-height: inherit;
      }
    `

    const template = document.createElement('template')
    template.innerHTML = `
      <div class="card">
        <span class="icon"></span>
        <h2 class="title"></h2>
        <div class="description">
          <slot></slot>
        </div>
      </div>
    `

    this.shadowRoot.appendChild(style)
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.title').textContent = this.dataset.title
    this.shadowRoot.querySelector('.icon').textContent = this.dataset.icon
    
    this.addEventListener('click', () => {
      if (this.dataset.route) {
        window.location.href = this.dataset.route
      }
    })
  }
}

customElements.define('tool-card', ToolCard)
