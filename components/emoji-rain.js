class EmojiRainBackground extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.emojiPool = []
    this.maxPoolSize = 50
    this.lastFrameTime = 0
    this.rainbowMode = false
    
    const style = document.createElement('style')
    style.textContent = `
      :host {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
        width: 100vw;
        height: 100vh;
        background: transparent;
      }

      .emoji {
        position: absolute;
        top: -50px;
        font-size: 32px;
        opacity: 0;
        user-select: none;
        will-change: transform;
        pointer-events: none;
        text-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
      }

      .golden {
        filter: drop-shadow(0 0 5px gold);
      }

      .rainbow {
        animation: rainbow 2s linear infinite;
      }

      .burst-emoji {
        position: absolute;
        font-size: 24px;
        pointer-events: none;
        will-change: transform;
        animation: burst 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        text-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
        opacity: 0.9;
      }

      @keyframes rainbow {
        0% { filter: hue-rotate(0deg) brightness(1.5); }
        100% { filter: hue-rotate(360deg) brightness(1.5); }
      }

      @keyframes burst {
        0% {
          opacity: 0.9;
          transform: scale(0) rotate(0deg);
        }
        50% {
          opacity: 0.9;
          transform: scale(1.5) rotate(180deg);
        }
        100% {
          opacity: 0;
          transform: scale(2) rotate(360deg);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .emoji, .burst-emoji {
          animation: none;
        }
      }
    `

    this.shadowRoot.appendChild(style)
  }

  connectedCallback() {
    this.startRain()
  }

  disconnectedCallback() {
    this.stopRain()
  }

  getEmojiFromPool() {
    return this.emojiPool.find(e => !e.isActive) || this.createNewEmoji()
  }

  createNewEmoji() {
    if (this.emojiPool.length >= this.maxPoolSize) {
      const oldestEmoji = this.emojiPool[0]
      oldestEmoji.element.remove()
      this.emojiPool.shift()
    }

    const element = document.createElement('div')
    element.className = 'emoji'
    const emoji = { element, isActive: false, velocity: 0, swing: 0, scale: 1 }
    this.emojiPool.push(emoji)
    this.shadowRoot.appendChild(element)
    return emoji
  }

  startRain() {
    const emojis = ['✨', '⭐', '🌟', '💫', '⚡', '🎉', '🎊', '🌠', '💥', '🔥', '💖', '🌈', '⚡️', '🎵', '🌸', '🎨', '🎪', '🎯', '🎲', '🎭']
    
    const addEmoji = () => {
      const emoji = this.getEmojiFromPool()
      emoji.isActive = true
      emoji.element.textContent = emojis[Math.floor(Math.random() * emojis.length)]
      emoji.element.style.left = Math.random() * 100 + '%'
      emoji.element.style.opacity = '0'
      
      const isGolden = Math.random() < 0.1
      if (isGolden) {
        emoji.element.classList.add('golden')
        this.triggerRainbowMode()
      } else {
        emoji.element.classList.remove('golden')
      }

      if (this.rainbowMode) {
        emoji.element.classList.add('rainbow')
      }

      emoji.velocity = Math.random() * 2 + 2
      emoji.swing = Math.random() * 4 - 2
      emoji.scale = Math.random() * 0.5 + 0.8
      emoji.rotation = Math.random() * 360
      emoji.rotationSpeed = (Math.random() - 0.5) * 2

      requestAnimationFrame(this.animate.bind(this))
    }

    const createRandomInterval = () => {
      addEmoji()
      const nextDelay = Math.random() * 400 + 100
      this.rainTimeout = setTimeout(createRandomInterval, nextDelay)
    }

    createRandomInterval()
  }

  animate(timestamp) {
    if (!this.lastFrameTime) this.lastFrameTime = timestamp
    const deltaTime = (timestamp - this.lastFrameTime) / 16
    this.lastFrameTime = timestamp

    let hasActiveEmojis = false

    this.emojiPool.forEach(emoji => {
      if (!emoji.isActive) return

      const element = emoji.element
      const currentTop = parseFloat(element.style.top || -50)
      
      if (currentTop > window.innerHeight) {
        emoji.isActive = false
        element.style.opacity = '0'
        return
      }

      hasActiveEmojis = true
      
      emoji.swing += Math.sin(timestamp / 1000) * 0.02
      emoji.rotation += emoji.rotationSpeed * deltaTime
      
      const newTop = currentTop + emoji.velocity * deltaTime
      const swingOffset = Math.sin(newTop / 100) * emoji.swing

      element.style.transform = `
        translateX(${swingOffset * 10}px)
        translateY(${newTop}px)
        rotate(${emoji.rotation}deg)
        scale(${emoji.scale})
      `
      element.style.opacity = currentTop > 0 ? '0.8' : '0'
    })

    if (hasActiveEmojis) {
      requestAnimationFrame(this.animate.bind(this))
    }
  }

  triggerRainbowMode() {
    if (this.rainbowMode) return
    this.rainbowMode = true
    this.emojiPool.forEach(emoji => {
      if (emoji.isActive) emoji.element.classList.add('rainbow')
    })
    setTimeout(() => {
      this.rainbowMode = false
      this.emojiPool.forEach(emoji => {
        emoji.element.classList.remove('rainbow')
      })
    }, 5000)
  }

  stopRain() {
    if (this.rainTimeout) {
      clearTimeout(this.rainTimeout)
    }
    this.emojiPool.forEach(emoji => {
      emoji.isActive = false
      emoji.element.remove()
    })
    this.emojiPool = []
  }

  burstEmoji(emoji, x, y) {
    const patterns = [
      { count: 8, radius: 60 },
      { count: 12, radius: 80 },
      { count: 6, radius: 50 }
    ]
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)]
    const angleStep = (2 * Math.PI) / pattern.count
    
    for (let i = 0; i < pattern.count; i++) {
      const burstEmoji = document.createElement('div')
      burstEmoji.className = 'burst-emoji'
      if (this.rainbowMode) burstEmoji.classList.add('rainbow')
      burstEmoji.textContent = emoji
      burstEmoji.style.left = x + 'px'
      burstEmoji.style.top = y + 'px'
      
      const angle = angleStep * i
      const distance = pattern.radius
      const finalX = Math.cos(angle) * distance
      const finalY = Math.sin(angle) * distance
      
      burstEmoji.style.transform = `translate(${finalX}px, ${finalY}px)`
      
      this.shadowRoot.appendChild(burstEmoji)
      
      burstEmoji.addEventListener('animationend', () => {
        burstEmoji.remove()
      })
    }
  }
}

customElements.define('emoji-rain-background', EmojiRainBackground)
