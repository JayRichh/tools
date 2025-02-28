import { SHADER_PRESETS, VERTEX_SHADER_3D, FRAGMENT_SHADER_3D, GeometryGenerators } from './shader-presets.js';

class ToolShaderPlayground extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Load external stylesheet
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '../../styles/tool-shader-playground.css');
    
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="container">
        <div class="main-content">
          <h1>WebGL Shader Playground</h1>
          <p>Create and experiment with GLSL shaders in real-time</p>
          
          <div class="tabs">
            <button class="tab active" data-tab="2d">2D Shader</button>
            <button class="tab" data-tab="3d">3D Object View</button>
          </div>
          
          <!-- 2D Shader Tab -->
          <div class="tab-content active" data-content="2d">
            <div class="shader-playground">
              <div class="editor-panel">
                <div class="editor-header">
                  <h2>Fragment Shader</h2>
                  <div class="editor-actions">
                    <button class="editor-action" id="run-shader-btn">
                      <span>Run Shader</span>
                    </button>
                    <button class="editor-action" id="copy-shader-btn">
                      <span>Copy Code</span>
                    </button>
                  </div>
                </div>
                
                <div class="editor-container">
                  <textarea class="code-editor" id="fragment-shader-editor" spellcheck="false">
// Fragment shader
precision mediump float;

// Canvas dimensions
uniform vec2 u_resolution;

// Time in seconds
uniform float u_time;

// Mouse position in normalized coordinates
uniform vec2 u_mouse;

void main() {
  // Normalized pixel coordinates (from 0 to 1)
  vec2 uv = gl_FragCoord.xy / u_resolution;
  
  // Time-based color animation
  float r = 0.5 + 0.5 * sin(u_time);
  float g = 0.5 + 0.5 * sin(u_time + 2.0);
  float b = 0.5 + 0.5 * sin(u_time + 4.0);
  
  // Distance from mouse position
  float dist = distance(uv, u_mouse);
  float circle = smoothstep(0.2, 0.19, dist);
  
  // Final color
  gl_FragColor = vec4(r, g, b, 1.0) + circle * vec4(0.2, 0.2, 0.2, 0.0);
}</textarea>
                </div>
              </div>
              
              <div class="preview-panel">
                <div class="preview-header">
                  <h2>Preview</h2>
                  <div class="preview-actions">
                    <button class="preview-action" id="fullscreen-btn">
                      <span>Fullscreen</span>
                    </button>
                    <button class="preview-action" id="screenshot-btn">
                      <span>Screenshot</span>
                    </button>
                  </div>
                </div>
                
                <div class="canvas-container">
                  <canvas class="shader-canvas" id="shader-canvas" width="512" height="512"></canvas>
                </div>
              </div>
            </div>
            
            <div class="controls-panel">
              <div class="controls-header">
                <h2>Shader Parameters</h2>
              </div>
              
              <div class="controls-grid">
                <div class="control-group">
                  <div class="control-group-header">Animation</div>
                  
                  <div class="control-row">
                    <label for="time-speed">
                      Time Speed
                      <span id="time-speed-value">1.0</span>
                    </label>
                    <input type="range" id="time-speed" min="0" max="2" step="0.1" value="1.0">
                  </div>
                  
                  <div class="control-row">
                    <label for="animation-toggle">Animation Enabled</label>
                    <input type="checkbox" id="animation-toggle" checked>
                  </div>
                </div>
                
                <div class="control-group">
                  <div class="control-group-header">Colors</div>
                  
                  <div class="control-row">
                    <label for="color1">Primary Color</label>
                    <input type="color" id="color1" value="#ff0066">
                  </div>
                  
                  <div class="control-row">
                    <label for="color2">Secondary Color</label>
                    <input type="color" id="color2" value="#00aaff">
                  </div>
                </div>
                
                <div class="control-group">
                  <div class="control-group-header">Effects</div>
                  
                  <div class="control-row">
                    <label for="effect-scale">
                      Effect Scale
                      <span id="effect-scale-value">1.0</span>
                    </label>
                    <input type="range" id="effect-scale" min="0.1" max="5" step="0.1" value="1.0">
                  </div>
                  
                  <div class="control-row">
                    <label for="effect-intensity">
                      Effect Intensity
                      <span id="effect-intensity-value">0.5</span>
                    </label>
                    <input type="range" id="effect-intensity" min="0" max="1" step="0.05" value="0.5">
                  </div>
                </div>
                
                <div class="control-group">
                  <div class="control-group-header">Particles</div>
                  
                  <div class="control-row">
                    <label for="particle-count">
                      Particle Count
                      <span id="particle-count-value">50</span>
                    </label>
                    <input type="range" id="particle-count" min="0" max="200" step="10" value="50">
                  </div>
                  
                  <div class="control-row">
                    <label for="particle-size">
                      Particle Size
                      <span id="particle-size-value">0.05</span>
                    </label>
                    <input type="range" id="particle-size" min="0.01" max="0.2" step="0.01" value="0.05">
                  </div>
                </div>
              </div>
            </div>
            
            <div class="presets-panel">
              <div class="presets-header">
                <h2>Shader Presets</h2>
              </div>
              
              <div class="presets-grid">
                <div class="preset-card" data-preset="waves">
                  <div class="preset-preview" id="preset-preview-waves"></div>
                  <div class="preset-info">
                    <h3 class="preset-title">Waves</h3>
                    <p class="preset-description">Animated wave pattern</p>
                  </div>
                </div>
                
                <div class="preset-card" data-preset="circles">
                  <div class="preset-preview" id="preset-preview-circles"></div>
                  <div class="preset-info">
                    <h3 class="preset-title">Circles</h3>
                    <p class="preset-description">Pulsating circles</p>
                  </div>
                </div>
                
                <div class="preset-card" data-preset="noise">
                  <div class="preset-preview" id="preset-preview-noise"></div>
                  <div class="preset-info">
                    <h3 class="preset-title">Noise</h3>
                    <p class="preset-description">Animated noise pattern</p>
                  </div>
                </div>
                
                <div class="preset-card" data-preset="gradient">
                  <div class="preset-preview" id="preset-preview-gradient"></div>
                  <div class="preset-info">
                    <h3 class="preset-title">Gradient</h3>
                    <p class="preset-description">Smooth color gradient</p>
                  </div>
                </div>
                
                <div class="preset-card" data-preset="particles">
                  <div class="preset-preview" id="preset-preview-particles"></div>
                  <div class="preset-info">
                    <h3 class="preset-title">Particles</h3>
                    <p class="preset-description">Moving particles</p>
                  </div>
                </div>
                
                <div class="preset-card" data-preset="fractal">
                  <div class="preset-preview" id="preset-preview-fractal"></div>
                  <div class="preset-info">
                    <h3 class="preset-title">Fractal</h3>
                    <p class="preset-description">Mandelbrot fractal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 3D Object View Tab -->
          <div class="tab-content" data-content="3d">
            <div class="shader-playground">
              <div class="editor-panel">
                <div class="editor-header">
                  <h2>Vertex & Fragment Shaders</h2>
                  <div class="editor-actions">
                    <button class="editor-action" id="run-3d-shader-btn">
                      <span>Run Shader</span>
                    </button>
                    <button class="editor-action" id="copy-3d-shader-btn">
                      <span>Copy Code</span>
                    </button>
                  </div>
                </div>
                
                <div class="editor-container">
                  <textarea class="code-editor" id="vertex-shader-editor" spellcheck="false"></textarea>
                  <textarea class="code-editor" id="fragment-3d-shader-editor" spellcheck="false"></textarea>
                </div>
                
                <div class="object-controls">
                  <button class="object-control active" data-object="cube">
                    <span class="object-control-icon">□</span>
                    <span>Cube</span>
                  </button>
                  <button class="object-control" data-object="sphere">
                    <span class="object-control-icon">○</span>
                    <span>Sphere</span>
                  </button>
                  <button class="object-control" data-object="torus">
                    <span class="object-control-icon">⊗</span>
                    <span>Torus</span>
                  </button>
                  <button class="object-control" data-object="teapot">
                    <span class="object-control-icon">🫖</span>
                    <span>Teapot</span>
                  </button>
                </div>
                
                <div class="camera-controls">
                  <button class="camera-control" id="camera-reset">
                    <span>⟲</span>
                  </button>
                  <button class="camera-control" id="camera-zoom-in">
                    <span>+</span>
                  </button>
                  <button class="camera-control" id="camera-zoom-out">
                    <span>-</span>
                  </button>
                </div>
              </div>
              
              <div class="preview-panel">
                <div class="preview-header">
                  <h2>3D Preview</h2>
                  <div class="preview-actions">
                    <button class="preview-action" id="fullscreen-3d-btn">
                      <span>Fullscreen</span>
                    </button>
                    <button class="preview-action" id="screenshot-3d-btn">
                      <span>Screenshot</span>
                    </button>
                  </div>
                </div>
                
                <div class="canvas-container">
                  <canvas class="shader-canvas" id="shader-3d-canvas" width="512" height="512"></canvas>
                </div>
              </div>
            </div>
            
            <div class="controls-panel">
              <div class="controls-header">
                <h2>3D Shader Parameters</h2>
              </div>
              
              <div class="controls-grid">
                <div class="control-group">
                  <div class="control-group-header">Animation</div>
                  
                  <div class="control-row">
                    <label for="3d-time-speed">
                      Time Speed
                      <span id="3d-time-speed-value">1.0</span>
                    </label>
                    <input type="range" id="3d-time-speed" min="0" max="2" step="0.1" value="1.0">
                  </div>
                  
                  <div class="control-row">
                    <label for="3d-animation-toggle">Animation Enabled</label>
                    <input type="checkbox" id="3d-animation-toggle" checked>
                  </div>
                  
                  <div class="control-row">
                    <label for="3d-rotation-toggle">Auto Rotation</label>
                    <input type="checkbox" id="3d-rotation-toggle" checked>
                  </div>
                </div>
                
                <div class="control-group">
                  <div class="control-group-header">Colors</div>
                  
                  <div class="control-row">
                    <label for="3d-color1">Primary Color</label>
                    <input type="color" id="3d-color1" value="#ff0066">
                  </div>
                  
                  <div class="control-row">
                    <label for="3d-color2">Secondary Color</label>
                    <input type="color" id="3d-color2" value="#00aaff">
                  </div>
                </div>
                
                <div class="control-group">
                  <div class="control-group-header">Lighting</div>
                  
                  <div class="control-row">
                    <label for="light-intensity">
                      Light Intensity
                      <span id="light-intensity-value">1.0</span>
                    </label>
                    <input type="range" id="light-intensity" min="0" max="2" step="0.1" value="1.0">
                  </div>
                  
                  <div class="control-row">
                    <label for="ambient-light">
                      Ambient Light
                      <span id="ambient-light-value">0.3</span>
                    </label>
                    <input type="range" id="ambient-light" min="0" max="1" step="0.05" value="0.3">
                  </div>
                </div>
                
                <div class="control-group">
                  <div class="control-group-header">Material</div>
                  
                  <div class="control-row">
                    <label for="material-shininess">
                      Shininess
                      <span id="material-shininess-value">30</span>
                    </label>
                    <input type="range" id="material-shininess" min="1" max="100" step="1" value="30">
                  </div>
                  
                  <div class="control-row">
                    <label for="material-metalness">
                      Metalness
                      <span id="material-metalness-value">0.5</span>
                    </label>
                    <input type="range" id="material-metalness" min="0" max="1" step="0.05" value="0.5">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.shadowRoot.appendChild(linkElem);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    // Use the imported shader presets
    this.shaderPresets = SHADER_PRESETS;
  }
  
  connectedCallback() {
    // Initialize DOM references
    this.initDomReferences();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initialize WebGL
    this.initWebGL();
    
    // Start animation loop
    this.startAnimationLoop();
  }
  
  initDomReferences() {
    // Tab elements
    this.tabs = this.shadowRoot.querySelectorAll('.tab');
    this.tabContents = this.shadowRoot.querySelectorAll('.tab-content');
    
    // 2D shader elements
    this.fragmentShaderEditor = this.shadowRoot.getElementById('fragment-shader-editor');
    this.shaderCanvas = this.shadowRoot.getElementById('shader-canvas');
    this.runShaderBtn = this.shadowRoot.getElementById('run-shader-btn');
    this.copyShaderBtn = this.shadowRoot.getElementById('copy-shader-btn');
    this.fullscreenBtn = this.shadowRoot.getElementById('fullscreen-btn');
    this.screenshotBtn = this.shadowRoot.getElementById('screenshot-btn');
    
    // Shader controls
    this.timeSpeedInput = this.shadowRoot.getElementById('time-speed');
    this.timeSpeedValue = this.shadowRoot.getElementById('time-speed-value');
    this.animationToggle = this.shadowRoot.getElementById('animation-toggle');
    this.color1Input = this.shadowRoot.getElementById('color1');
    this.color2Input = this.shadowRoot.getElementById('color2');
    this.effectScaleInput = this.shadowRoot.getElementById('effect-scale');
    this.effectScaleValue = this.shadowRoot.getElementById('effect-scale-value');
    this.effectIntensityInput = this.shadowRoot.getElementById('effect-intensity');
    this.effectIntensityValue = this.shadowRoot.getElementById('effect-intensity-value');
    this.particleCountInput = this.shadowRoot.getElementById('particle-count');
    this.particleCountValue = this.shadowRoot.getElementById('particle-count-value');
    this.particleSizeInput = this.shadowRoot.getElementById('particle-size');
    this.particleSizeValue = this.shadowRoot.getElementById('particle-size-value');
    
    // Preset elements
    this.presetCards = this.shadowRoot.querySelectorAll('.preset-card');
    
    // 3D shader elements
    this.vertexShaderEditor = this.shadowRoot.getElementById('vertex-shader-editor');
    this.fragment3dShaderEditor = this.shadowRoot.getElementById('fragment-3d-shader-editor');
    this.shader3dCanvas = this.shadowRoot.getElementById('shader-3d-canvas');
    this.run3dShaderBtn = this.shadowRoot.getElementById('run-3d-shader-btn');
    this.copy3dShaderBtn = this.shadowRoot.getElementById('copy-3d-shader-btn');
    this.fullscreen3dBtn = this.shadowRoot.getElementById('fullscreen-3d-btn');
    this.screenshot3dBtn = this.shadowRoot.getElementById('screenshot-3d-btn');
    
    // 3D object controls
    this.objectControls = this.shadowRoot.querySelectorAll('.object-control');
    this.cameraReset = this.shadowRoot.getElementById('camera-reset');
    this.cameraZoomIn = this.shadowRoot.getElementById('camera-zoom-in');
    this.cameraZoomOut = this.shadowRoot.getElementById('camera-zoom-out');
    
    // 3D shader controls
    this.time3dSpeedInput = this.shadowRoot.getElementById('3d-time-speed');
    this.time3dSpeedValue = this.shadowRoot.getElementById('3d-time-speed-value');
    this.animation3dToggle = this.shadowRoot.getElementById('3d-animation-toggle');
    this.rotation3dToggle = this.shadowRoot.getElementById('3d-rotation-toggle');
    this.color3d1Input = this.shadowRoot.getElementById('3d-color1');
    this.color3d2Input = this.shadowRoot.getElementById('3d-color2');
    this.lightIntensityInput = this.shadowRoot.getElementById('light-intensity');
    this.lightIntensityValue = this.shadowRoot.getElementById('light-intensity-value');
    this.ambientLightInput = this.shadowRoot.getElementById('ambient-light');
    this.ambientLightValue = this.shadowRoot.getElementById('ambient-light-value');
    this.materialShininessInput = this.shadowRoot.getElementById('material-shininess');
    this.materialShininessValue = this.shadowRoot.getElementById('material-shininess-value');
    this.materialMetalnessInput = this.shadowRoot.getElementById('material-metalness');
    this.materialMetalnessValue = this.shadowRoot.getElementById('material-metalness-value');
    
    // Set initial shader code
    this.vertexShaderEditor.value = VERTEX_SHADER_3D;
    this.fragment3dShaderEditor.value = FRAGMENT_SHADER_3D;
  }
  
  setupEventListeners() {
    // Tab switching
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchTab(tab.dataset.tab);
      });
    });
    
    // 2D shader controls
    this.runShaderBtn.addEventListener('click', () => {
      this.compileAndRunShader();
    });
    
    this.copyShaderBtn.addEventListener('click', () => {
      this.copyShaderCode();
    });
    
    this.fullscreenBtn.addEventListener('click', () => {
      this.toggleFullscreen(this.shaderCanvas);
    });
    
    this.screenshotBtn.addEventListener('click', () => {
      this.takeScreenshot(this.shaderCanvas);
    });
    
    // Shader parameter controls
    this.timeSpeedInput.addEventListener('input', () => {
      this.timeSpeedValue.textContent = this.timeSpeedInput.value;
      this.timeSpeed = parseFloat(this.timeSpeedInput.value);
    });
    
    this.animationToggle.addEventListener('change', () => {
      this.animationEnabled = this.animationToggle.checked;
    });
    
    this.color1Input.addEventListener('input', () => {
      this.updateShaderUniforms();
    });
    
    this.color2Input.addEventListener('input', () => {
      this.updateShaderUniforms();
    });
    
    this.effectScaleInput.addEventListener('input', () => {
      this.effectScaleValue.textContent = this.effectScaleInput.value;
      this.updateShaderUniforms();
    });
    
    this.effectIntensityInput.addEventListener('input', () => {
      this.effectIntensityValue.textContent = this.effectIntensityInput.value;
      this.updateShaderUniforms();
    });
    
    this.particleCountInput.addEventListener('input', () => {
      this.particleCountValue.textContent = this.particleCountInput.value;
      this.updateShaderUniforms();
    });
    
    this.particleSizeInput.addEventListener('input', () => {
      this.particleSizeValue.textContent = this.particleSizeInput.value;
      this.updateShaderUniforms();
    });
    
    // Preset cards
    this.presetCards.forEach(card => {
      card.addEventListener('click', () => {
        const presetName = card.dataset.preset;
        this.applyShaderPreset(presetName);
      });
    });
    
    // 3D shader controls
    this.run3dShaderBtn.addEventListener('click', () => {
      this.compileAndRun3dShader();
    });
    
    this.copy3dShaderBtn.addEventListener('click', () => {
      this.copy3dShaderCode();
    });
    
    this.fullscreen3dBtn.addEventListener('click', () => {
      this.toggleFullscreen(this.shader3dCanvas);
    });
    
    this.screenshot3dBtn.addEventListener('click', () => {
      this.takeScreenshot(this.shader3dCanvas);
    });
    
    // 3D object controls
    this.objectControls.forEach(control => {
      control.addEventListener('click', () => {
        this.objectControls.forEach(c => c.classList.remove('active'));
        control.classList.add('active');
        this.currentObject = control.dataset.object;
        this.update3dObject();
      });
    });
    
    this.cameraReset.addEventListener('click', () => {
      this.resetCamera();
    });
    
    this.cameraZoomIn.addEventListener('click', () => {
      this.zoomCamera(0.9); // Zoom in by reducing distance
    });
    
    this.cameraZoomOut.addEventListener('click', () => {
      this.zoomCamera(1.1); // Zoom out by increasing distance
    });
    
    // 3D shader parameter controls
    this.time3dSpeedInput.addEventListener('input', () => {
      this.time3dSpeedValue.textContent = this.time3dSpeedInput.value;
      this.time3dSpeed = parseFloat(this.time3dSpeedInput.value);
    });
    
    this.animation3dToggle.addEventListener('change', () => {
      this.animation3dEnabled = this.animation3dToggle.checked;
    });
    
    this.rotation3dToggle.addEventListener('change', () => {
      this.rotation3dEnabled = this.rotation3dToggle.checked;
    });
    
    this.color3d1Input.addEventListener('input', () => {
      this.update3dUniforms();
    });
    
    this.color3d2Input.addEventListener('input', () => {
      this.update3dUniforms();
    });
    
    this.lightIntensityInput.addEventListener('input', () => {
      this.lightIntensityValue.textContent = this.lightIntensityInput.value;
      this.update3dUniforms();
    });
    
    this.ambientLightInput.addEventListener('input', () => {
      this.ambientLightValue.textContent = this.ambientLightInput.value;
      this.update3dUniforms();
    });
    
    this.materialShininessInput.addEventListener('input', () => {
      this.materialShininessValue.textContent = this.materialShininessInput.value;
      this.update3dUniforms();
    });
    
    this.materialMetalnessInput.addEventListener('input', () => {
      this.materialMetalnessValue.textContent = this.materialMetalnessInput.value;
      this.update3dUniforms();
    });
    
    // Mouse events for shader canvas
    this.shaderCanvas.addEventListener('mousemove', (e) => {
      const rect = this.shaderCanvas.getBoundingClientRect();
      this.mouseX = (e.clientX - rect.left) / this.shaderCanvas.width;
      this.mouseY = 1.0 - (e.clientY - rect.top) / this.shaderCanvas.height; // Flip Y for WebGL
    });
    
    // Mouse events for 3D canvas (for camera rotation)
    this.shader3dCanvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });
    
    document.addEventListener('mouseup', () => {
      this.isDragging = false;
    });
    
    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;
        
        this.cameraRotationY += deltaX * 0.01;
        this.cameraRotationX += deltaY * 0.01;
        
        // Limit vertical rotation to avoid flipping
        this.cameraRotationX = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.cameraRotationX));
        
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      }
    });
  }
  
  switchTab(tabId) {
    console.log(`Switching to tab: ${tabId}`);
    
    // Update active tab buttons
    this.tabs.forEach(tab => {
      const isActive = tab.dataset.tab === tabId;
      tab.classList.toggle('active', isActive);
      console.log(`Tab ${tab.dataset.tab}: ${isActive ? 'active' : 'inactive'}`);
    });
    
    // Get the tab content elements
    const tab2dContent = this.shadowRoot.querySelector('.tab-content[data-content="2d"]');
    const tab3dContent = this.shadowRoot.querySelector('.tab-content[data-content="3d"]');
    
    console.log(`2D content element:`, tab2dContent);
    console.log(`3D content element:`, tab3dContent);
    
    // Force refresh the DOM by removing both tabs from display first
    if (tab2dContent) {
      tab2dContent.style.display = 'none';
      tab2dContent.classList.remove('active');
    }
    
    if (tab3dContent) {
      tab3dContent.style.display = 'none';
      tab3dContent.classList.remove('active');
    }
    
    // Delay showing the active tab to ensure the DOM has time to update
    setTimeout(() => {
      // Show the active tab content
      if (tabId === '2d' && tab2dContent) {
        tab2dContent.style.display = 'block';
        tab2dContent.classList.add('active');
        
        // Resize and recompile 2D shader
        this.resizeCanvas(this.shaderCanvas);
        this.compileAndRunShader();
        console.log('Switched to 2D view and recompiled shader');
      } else if (tabId === '3d' && tab3dContent) {
        tab3dContent.style.display = 'block';
        tab3dContent.classList.add('active');
        
        // Resize and recompile 3D shader
        this.resizeCanvas(this.shader3dCanvas);
        this.compileAndRun3dShader();
        console.log('Switched to 3D view and recompiled shader');
      }
    }, 50); // Small delay to ensure DOM updates
  }
  
  initWebGL() {
    // Initialize 2D shader variables
    this.gl = this.shaderCanvas.getContext('webgl') || this.shaderCanvas.getContext('experimental-webgl');
    this.program = null;
    this.timeSpeed = 1.0;
    this.animationEnabled = true;
    this.startTime = Date.now();
    this.mouseX = 0.5;
    this.mouseY = 0.5;
    
    // Initialize 3D shader variables
    this.gl3d = this.shader3dCanvas.getContext('webgl') || this.shader3dCanvas.getContext('experimental-webgl');
    this.program3d = null;
    this.time3dSpeed = 1.0;
    this.animation3dEnabled = true;
    this.rotation3dEnabled = true;
    this.currentObject = 'cube';
    this.cameraDistance = 3.0;
    this.cameraRotationX = 0.0;
    this.cameraRotationY = 0.0;
    this.rotationAngle = 0.0;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    
    // Resize canvases
    this.resizeCanvas(this.shaderCanvas);
    this.resizeCanvas(this.shader3dCanvas);
    
    // Compile initial shaders
    this.compileAndRunShader();
    this.compileAndRun3dShader();
    
    // Initialize preset previews
    this.initPresetPreviews();
  }
  
  resizeCanvas(canvas) {
    // Get the display size of the canvas
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    
    // Check if the canvas is not the same size
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      // Make the canvas the same size
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      
      // Update the viewport
      const gl = canvas === this.shaderCanvas ? this.gl : this.gl3d;
      if (gl) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      }
    }
  }
  
  compileAndRunShader() {
    if (!this.gl) {
      console.error('WebGL not supported');
      return;
    }
    
    // Get shader source code
    const fragmentShaderSource = this.fragmentShaderEditor.value;
    
    // Create shader program
    if (this.program) {
      this.gl.deleteProgram(this.program);
    }
    
    // Create vertex shader (simple pass-through for 2D)
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;
    
    // Compile shaders
    const vertexShader = this.compileShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.compileShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) {
      return;
    }
    
    // Create program
    this.program = this.createProgram(this.gl, vertexShader, fragmentShader);
    
    if (!this.program) {
      return;
    }
    
    // Set up geometry (a simple quad covering the entire canvas)
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0
      ]),
      this.gl.STATIC_DRAW
    );
    
    // Set up attributes
    const positionAttributeLocation = this.gl.getAttribLocation(this.program, 'a_position');
    this.gl.enableVertexAttribArray(positionAttributeLocation);
    this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
    
    // Set up uniforms
    this.resolutionUniformLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
    this.timeUniformLocation = this.gl.getUniformLocation(this.program, 'u_time');
    this.mouseUniformLocation = this.gl.getUniformLocation(this.program, 'u_mouse');
    
    // Additional uniforms for controls
    this.color1UniformLocation = this.gl.getUniformLocation(this.program, 'u_color1');
    this.color2UniformLocation = this.gl.getUniformLocation(this.program, 'u_color2');
    this.effectScaleUniformLocation = this.gl.getUniformLocation(this.program, 'u_effect_scale');
    this.effectIntensityUniformLocation = this.gl.getUniformLocation(this.program, 'u_effect_intensity');
    this.particleCountUniformLocation = this.gl.getUniformLocation(this.program, 'u_particle_count');
    this.particleSizeUniformLocation = this.gl.getUniformLocation(this.program, 'u_particle_size');
    
    // Update uniforms
    this.updateShaderUniforms();
  }
  
  compileAndRun3dShader() {
    if (!this.gl3d) {
      console.error('WebGL not supported');
      return;
    }
    
    // Get shader source code
    const vertexShaderSource = this.vertexShaderEditor.value;
    const fragmentShaderSource = this.fragment3dShaderEditor.value;
    
    // Create shader program
    if (this.program3d) {
      this.gl3d.deleteProgram(this.program3d);
    }
    
    // Compile shaders
    const vertexShader = this.compileShader(this.gl3d, this.gl3d.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.compileShader(this.gl3d, this.gl3d.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) {
      return;
    }
    
    // Create program
    this.program3d = this.createProgram(this.gl3d, vertexShader, fragmentShader);
    
    if (!this.program3d) {
      return;
    }
    
    // Update 3D object
    this.update3dObject();
    
    // Update uniforms
    this.update3dUniforms();
  }
  
  compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    
    console.error('Failed to compile shader:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  
  createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
    
    console.error('Failed to link program:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  
  updateShaderUniforms() {
    if (!this.program || !this.gl) {
      return;
    }
    
    this.gl.useProgram(this.program);
    
    // Set resolution uniform
    this.gl.uniform2f(this.resolutionUniformLocation, this.shaderCanvas.width, this.shaderCanvas.height);
    
    // Set mouse uniform
    this.gl.uniform2f(this.mouseUniformLocation, this.mouseX, this.mouseY);
    
    // Set color uniforms
    if (this.color1UniformLocation) {
      const color1 = this.hexToRgb(this.color1Input.value);
      this.gl.uniform3f(this.color1UniformLocation, color1.r / 255, color1.g / 255, color1.b / 255);
    }
    
    if (this.color2UniformLocation) {
      const color2 = this.hexToRgb(this.color2Input.value);
      this.gl.uniform3f(this.color2UniformLocation, color2.r / 255, color2.g / 255, color2.b / 255);
    }
    
    // Set effect uniforms
    if (this.effectScaleUniformLocation) {
      this.gl.uniform1f(this.effectScaleUniformLocation, parseFloat(this.effectScaleInput.value));
    }
    
    if (this.effectIntensityUniformLocation) {
      this.gl.uniform1f(this.effectIntensityUniformLocation, parseFloat(this.effectIntensityInput.value));
    }
    
    // Set particle uniforms
    if (this.particleCountUniformLocation) {
      this.gl.uniform1f(this.particleCountUniformLocation, parseFloat(this.particleCountInput.value));
    }
    
    if (this.particleSizeUniformLocation) {
      this.gl.uniform1f(this.particleSizeUniformLocation, parseFloat(this.particleSizeInput.value));
    }
  }
  
  update3dUniforms() {
    if (!this.program3d || !this.gl3d) {
      return;
    }
    
    this.gl3d.useProgram(this.program3d);
    
    // Set color uniforms
    const color1Location = this.gl3d.getUniformLocation(this.program3d, 'u_color1');
    const color2Location = this.gl3d.getUniformLocation(this.program3d, 'u_color2');
    
    if (color1Location) {
      const color1 = this.hexToRgb(this.color3d1Input.value);
      this.gl3d.uniform3f(color1Location, color1.r / 255, color1.g / 255, color1.b / 255);
    }
    
    if (color2Location) {
      const color2 = this.hexToRgb(this.color3d2Input.value);
      this.gl3d.uniform3f(color2Location, color2.r / 255, color2.g / 255, color2.b / 255);
    }
    
    // Set lighting uniforms
    const lightIntensityLocation = this.gl3d.getUniformLocation(this.program3d, 'u_light_intensity');
    const ambientLightLocation = this.gl3d.getUniformLocation(this.program3d, 'u_ambient_light');
    
    if (lightIntensityLocation) {
      this.gl3d.uniform1f(lightIntensityLocation, parseFloat(this.lightIntensityInput.value));
    }
    
    if (ambientLightLocation) {
      this.gl3d.uniform1f(ambientLightLocation, parseFloat(this.ambientLightInput.value));
    }
    
    // Set material uniforms
    const materialShininessLocation = this.gl3d.getUniformLocation(this.program3d, 'u_material_shininess');
    const materialMetalnessLocation = this.gl3d.getUniformLocation(this.program3d, 'u_material_metalness');
    
    if (materialShininessLocation) {
      this.gl3d.uniform1f(materialShininessLocation, parseFloat(this.materialShininessInput.value));
    }
    
    if (materialMetalnessLocation) {
      this.gl3d.uniform1f(materialMetalnessLocation, parseFloat(this.materialMetalnessInput.value));
    }
  }
  
  update3dObject() {
    if (!this.program3d || !this.gl3d) {
      return;
    }
    
    this.gl3d.useProgram(this.program3d);
    
    // Clear existing buffers
    if (this.vertexBuffer) {
      this.gl3d.deleteBuffer(this.vertexBuffer);
    }
    if (this.normalBuffer) {
      this.gl3d.deleteBuffer(this.normalBuffer);
    }
    if (this.uvBuffer) {
      this.gl3d.deleteBuffer(this.uvBuffer);
    }
    if (this.indexBuffer) {
      this.gl3d.deleteBuffer(this.indexBuffer);
    }
    
    // Create geometry based on selected object
    let geometry;
    switch (this.currentObject) {
      case 'cube':
        geometry = GeometryGenerators.createCube();
        break;
      case 'sphere':
        geometry = GeometryGenerators.createSphere();
        break;
      case 'torus':
        geometry = GeometryGenerators.createTorus();
        break;
      case 'teapot':
        geometry = GeometryGenerators.createTeapot();
        break;
      default:
        geometry = GeometryGenerators.createCube();
    }
    
    // Create vertex buffer
    this.vertexBuffer = this.gl3d.createBuffer();
    this.gl3d.bindBuffer(this.gl3d.ARRAY_BUFFER, this.vertexBuffer);
    this.gl3d.bufferData(this.gl3d.ARRAY_BUFFER, new Float32Array(geometry.vertices), this.gl3d.STATIC_DRAW);
    
    // Create normal buffer
    this.normalBuffer = this.gl3d.createBuffer();
    this.gl3d.bindBuffer(this.gl3d.ARRAY_BUFFER, this.normalBuffer);
    this.gl3d.bufferData(this.gl3d.ARRAY_BUFFER, new Float32Array(geometry.normals), this.gl3d.STATIC_DRAW);
    
    // Create UV buffer
    this.uvBuffer = this.gl3d.createBuffer();
    this.gl3d.bindBuffer(this.gl3d.ARRAY_BUFFER, this.uvBuffer);
    this.gl3d.bufferData(this.gl3d.ARRAY_BUFFER, new Float32Array(geometry.uvs), this.gl3d.STATIC_DRAW);
    
    // Create index buffer
    this.indexBuffer = this.gl3d.createBuffer();
    this.gl3d.bindBuffer(this.gl3d.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl3d.bufferData(this.gl3d.ELEMENT_ARRAY_BUFFER, new Uint16Array(geometry.indices), this.gl3d.STATIC_DRAW);
    
    // Store index count for drawing
    this.indexCount = geometry.indices.length;
  }
  
  startAnimationLoop() {
    // Start time for animation
    this.startTime = Date.now();
    
    // Animation loop
    const animate = () => {
      // Calculate elapsed time
      const now = Date.now();
      const elapsedTime = (now - this.startTime) / 1000; // Convert to seconds
      
      // Render 2D shader
      this.render2dShader(elapsedTime);
      
      // Render 3D shader
      this.render3dShader(elapsedTime);
      
      // Request next frame
      requestAnimationFrame(animate);
    };
    
    // Start animation loop
    animate();
  }
  
  render2dShader(elapsedTime) {
    if (!this.program || !this.gl) {
      return;
    }
    
    // Skip if animation is disabled
    if (!this.animationEnabled) {
      return;
    }
    
    // Use shader program
    this.gl.useProgram(this.program);
    
    // Update time uniform
    this.gl.uniform1f(this.timeUniformLocation, elapsedTime * this.timeSpeed);
    
    // Draw the quad
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
  
  render3dShader(elapsedTime) {
    if (!this.program3d || !this.gl3d || !this.vertexBuffer || !this.indexBuffer) {
      return;
    }
    
    // Skip if animation is disabled
    if (!this.animation3dEnabled) {
      return;
    }
    
    // Use shader program
    this.gl3d.useProgram(this.program3d);
    
    // Clear canvas
    this.gl3d.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl3d.clear(this.gl3d.COLOR_BUFFER_BIT | this.gl3d.DEPTH_BUFFER_BIT);
    
    // Enable depth testing
    this.gl3d.enable(this.gl3d.DEPTH_TEST);
    
    // Update time uniform
    const timeLocation = this.gl3d.getUniformLocation(this.program3d, 'u_time');
    if (timeLocation) {
      this.gl3d.uniform1f(timeLocation, elapsedTime * this.time3dSpeed);
    }
    
    // Update rotation uniform
    if (this.rotation3dEnabled) {
      this.rotationAngle += 0.01;
    }
    
    const rotationLocation = this.gl3d.getUniformLocation(this.program3d, 'u_rotation');
    if (rotationLocation) {
      this.gl3d.uniform1f(rotationLocation, this.rotationAngle);
    }
    
    // Set up attributes
    const positionLocation = this.gl3d.getAttribLocation(this.program3d, 'position');
    const normalLocation = this.gl3d.getAttribLocation(this.program3d, 'normal');
    const uvLocation = this.gl3d.getAttribLocation(this.program3d, 'uv');
    
    // Bind vertex buffer
    this.gl3d.bindBuffer(this.gl3d.ARRAY_BUFFER, this.vertexBuffer);
    this.gl3d.enableVertexAttribArray(positionLocation);
    this.gl3d.vertexAttribPointer(positionLocation, 3, this.gl3d.FLOAT, false, 0, 0);
    
    // Bind normal buffer
    this.gl3d.bindBuffer(this.gl3d.ARRAY_BUFFER, this.normalBuffer);
    this.gl3d.enableVertexAttribArray(normalLocation);
    this.gl3d.vertexAttribPointer(normalLocation, 3, this.gl3d.FLOAT, false, 0, 0);
    
    // Bind UV buffer
    this.gl3d.bindBuffer(this.gl3d.ARRAY_BUFFER, this.uvBuffer);
    this.gl3d.enableVertexAttribArray(uvLocation);
    this.gl3d.vertexAttribPointer(uvLocation, 2, this.gl3d.FLOAT, false, 0, 0);
    
    // Bind index buffer
    this.gl3d.bindBuffer(this.gl3d.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    
    // Draw the object
    this.gl3d.drawElements(this.gl3d.TRIANGLES, this.indexCount, this.gl3d.UNSIGNED_SHORT, 0);
  }
  
  initPresetPreviews() {
    // Create mini WebGL contexts for each preset preview
    Object.keys(this.shaderPresets).forEach(presetName => {
      const previewElement = this.shadowRoot.getElementById(`preset-preview-${presetName}`);
      if (!previewElement) return;
      
      // Create canvas element
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      previewElement.appendChild(canvas);
      
      // Get WebGL context
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return;
      
      // Create shader program
      const vertexShaderSource = `
        attribute vec2 a_position;
        void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
        }
      `;
      
      const fragmentShaderSource = this.shaderPresets[presetName];
      
      // Compile shaders
      const vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = this.compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
      
      if (!vertexShader || !fragmentShader) return;
      
      // Create program
      const program = this.createProgram(gl, vertexShader, fragmentShader);
      
      if (!program) return;
      
      // Set up geometry (a simple quad covering the entire canvas)
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          -1.0, -1.0,
           1.0, -1.0,
          -1.0,  1.0,
          -1.0,  1.0,
           1.0, -1.0,
           1.0,  1.0
        ]),
        gl.STATIC_DRAW
      );
      
      // Set up attributes
      const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
      
      // Set up uniforms
      const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
      const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
      
      // Use program
      gl.useProgram(program);
      
      // Set resolution uniform
      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
      
      // Set time uniform (static for preview)
      gl.uniform1f(timeUniformLocation, 10.0); // Fixed time for preview
      
      // Draw the quad
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    });
  }
  
  applyShaderPreset(presetName) {
    if (this.shaderPresets[presetName]) {
      this.fragmentShaderEditor.value = this.shaderPresets[presetName];
      this.compileAndRunShader();
    }
  }
  
  copyShaderCode() {
    const code = this.fragmentShaderEditor.value;
    navigator.clipboard.writeText(code).then(() => {
      alert('Shader code copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy shader code:', err);
    });
  }
  
  copy3dShaderCode() {
    const vertexCode = this.vertexShaderEditor.value;
    const fragmentCode = this.fragment3dShaderEditor.value;
    const combinedCode = `// Vertex Shader\n${vertexCode}\n\n// Fragment Shader\n${fragmentCode}`;
    
    navigator.clipboard.writeText(combinedCode).then(() => {
      alert('3D shader code copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy 3D shader code:', err);
    });
  }
  
  toggleFullscreen(canvas) {
    if (!document.fullscreenElement) {
      canvas.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }
  
  takeScreenshot(canvas) {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'shader-screenshot.png';
    link.click();
  }
  
  resetCamera() {
    this.cameraRotationX = 0.0;
    this.cameraRotationY = 0.0;
    this.cameraDistance = 3.0;
  }
  
  zoomCamera(factor) {
    this.cameraDistance *= factor;
    // Limit zoom range
    this.cameraDistance = Math.max(1.0, Math.min(10.0, this.cameraDistance));
  }
  
  hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
  }
}

// Define the custom element
customElements.define('tool-shader-playground', ToolShaderPlayground);
