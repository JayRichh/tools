// Shader presets as a separate constant for better maintainability
export const SHADER_PRESETS = {
  waves: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  
  // Create waves
  float wave1 = sin(uv.x * 10.0 + u_time) * 0.5 + 0.5;
  float wave2 = sin(uv.y * 8.0 - u_time * 0.5) * 0.5 + 0.5;
  
  // Mix colors
  vec3 color1 = vec3(0.0, 0.5, 1.0); // Blue
  vec3 color2 = vec3(0.0, 0.8, 0.5); // Teal
  vec3 color = mix(color1, color2, wave1 * wave2);
  
  gl_FragColor = vec4(color, 1.0);
}`,
  circles: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 center = vec2(0.5, 0.5);
  
  // Create pulsating circles
  float dist = distance(uv, center);
  float circle1 = smoothstep(0.1, 0.09, dist);
  float circle2 = smoothstep(0.3, 0.29, dist) - smoothstep(0.2, 0.19, dist);
  float circle3 = smoothstep(0.5, 0.49, dist) - smoothstep(0.4, 0.39, dist);
  
  // Animate circles
  circle1 *= sin(u_time) * 0.5 + 0.5;
  circle2 *= sin(u_time + 1.0) * 0.5 + 0.5;
  circle3 *= sin(u_time + 2.0) * 0.5 + 0.5;
  
  // Mix colors
  vec3 color1 = vec3(1.0, 0.2, 0.3); // Red
  vec3 color2 = vec3(0.2, 0.4, 1.0); // Blue
  vec3 color3 = vec3(1.0, 0.8, 0.1); // Yellow
  
  vec3 color = circle1 * color1 + circle2 * color2 + circle3 * color3;
  
  gl_FragColor = vec4(color, 1.0);
}`,
  noise: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

// Pseudo-random function
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 2D noise function
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  
  // Four corners in 2D of a tile
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  
  // Smooth interpolation
  vec2 u = f * f * (3.0 - 2.0 * f);
  
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  
  // Scale and animate noise
  float n = noise(uv * 10.0 + u_time * 0.5);
  
  // Create color gradient
  vec3 color = mix(
    vec3(0.2, 0.0, 0.5), // Dark purple
    vec3(1.0, 0.5, 0.0), // Orange
    n
  );
  
  gl_FragColor = vec4(color, 1.0);
}`,
  gradient: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  
  // Create animated gradient
  vec3 color1 = vec3(0.1, 0.3, 0.9); // Blue
  vec3 color2 = vec3(0.9, 0.1, 0.5); // Pink
  
  // Animate gradient direction
  float angle = u_time * 0.2;
  vec2 dir = vec2(cos(angle), sin(angle));
  float gradient = dot(uv - 0.5, dir) * 0.5 + 0.5;
  
  vec3 color = mix(color1, color2, gradient);
  
  gl_FragColor = vec4(color, 1.0);
}`,
  particles: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

// Pseudo-random function
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec3 color = vec3(0.0);
  
  // Create grid for particles
  float size = 20.0;
  vec2 cell = floor(uv * size) / size;
  
  // Generate random position within each cell
  vec2 pos = cell + vec2(
    random(cell + 0.1) * 0.5,
    random(cell + 0.2) * 0.5
  );
  
  // Animate particles
  pos.x += sin(u_time * random(cell) * 2.0) * 0.02;
  pos.y += cos(u_time * random(cell + 0.1) * 2.0) * 0.02;
  
  // Draw particles
  float particle = 1.0 - smoothstep(0.0, 0.05, distance(uv, pos));
  
  // Random color for each particle
  vec3 particleColor = vec3(
    random(cell + 0.3),
    random(cell + 0.4),
    random(cell + 0.5)
  );
  
  color += particle * particleColor;
  
  gl_FragColor = vec4(color, 1.0);
}`,
  fractal: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  
  // Scale and center coordinates
  vec2 c = (uv * 4.0 - 2.0) / (0.5 + sin(u_time * 0.1) * 0.2 + 0.8);
  c.x -= 0.5;
  
  // Initialize z
  vec2 z = vec2(0.0);
  
  // Mandelbrot iteration
  int iterations = 0;
  int maxIterations = 100;
  
  for (int i = 0; i < 100; i++) {
    // z = z^2 + c
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    
    if (dot(z, z) > 4.0) break;
    iterations = i;
  }
  
  // Color based on iterations
  float t = float(iterations) / float(maxIterations);
  vec3 color = vec3(
    0.5 + 0.5 * sin(t * 20.0 + u_time + 0.0),
    0.5 + 0.5 * sin(t * 20.0 + u_time + 2.0),
    0.5 + 0.5 * sin(t * 20.0 + u_time + 4.0)
  );
  
  gl_FragColor = vec4(color, 1.0);
}`
};

// 3D shader presets
export const VERTEX_SHADER_3D = `
precision mediump float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float u_time;
uniform float u_rotation;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

// Simple matrix rotation functions
mat4 rotateX(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, c, -s, 0.0,
    0.0, s, c, 0.0,
    0.0, 0.0, 0.0, 1.0
  );
}

mat4 rotateY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat4(
    c, 0.0, s, 0.0,
    0.0, 1.0, 0.0, 0.0,
    -s, 0.0, c, 0.0,
    0.0, 0.0, 0.0, 1.0
  );
}

void main() {
  // Animate vertices based on time
  vec3 pos = position;
  pos.y += sin(position.x * 5.0 + u_time) * 0.1;
  
  // Apply rotation
  mat4 rotMatrix = rotateY(u_rotation) * rotateX(u_rotation * 0.5);
  vec4 rotatedPos = rotMatrix * vec4(pos, 1.0);
  
  // Pass values to fragment shader
  vNormal = mat3(rotMatrix) * normal;
  vUv = uv;
  vPosition = rotatedPos.xyz;
  
  // Set vertex position with perspective
  float perspective = 1.0 + rotatedPos.z * 0.5;
  gl_Position = vec4(rotatedPos.xy / perspective, rotatedPos.z * 0.01, 1.0);
}`;

export const FRAGMENT_SHADER_3D = `
precision mediump float;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

uniform float u_time;
uniform vec3 u_color1;
uniform vec3 u_color2;

void main() {
  // Calculate lighting
  vec3 light = normalize(vec3(1.0, 1.0, 1.0));
  float diffuse = max(0.0, dot(normalize(vNormal), light));
  
  // Create color gradient based on UV coordinates
  vec3 color = mix(u_color1, u_color2, vUv.x);
  
  // Add time-based animation
  color += 0.1 * sin(u_time + vPosition.x * 10.0);
  
  // Apply lighting
  color *= 0.3 + 0.7 * diffuse;
  
  gl_FragColor = vec4(color, 1.0);
}`;

// 3D geometry generators
export const GeometryGenerators = {
  // Create cube vertices, normals, and UVs
  createCube: function(size = 1.0) {
    const s = size / 2;
    
    // Vertices (8 corners of a cube)
    const vertices = [
      // Front face
      -s, -s,  s,
       s, -s,  s,
       s,  s,  s,
      -s,  s,  s,
      // Back face
      -s, -s, -s,
      -s,  s, -s,
       s,  s, -s,
       s, -s, -s,
      // Top face
      -s,  s, -s,
      -s,  s,  s,
       s,  s,  s,
       s,  s, -s,
      // Bottom face
      -s, -s, -s,
       s, -s, -s,
       s, -s,  s,
      -s, -s,  s,
      // Right face
       s, -s, -s,
       s,  s, -s,
       s,  s,  s,
       s, -s,  s,
      // Left face
      -s, -s, -s,
      -s, -s,  s,
      -s,  s,  s,
      -s,  s, -s
    ];
    
    // Normals (perpendicular to each face)
    const normals = [
      // Front face
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
      // Back face
      0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
      // Top face
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
      // Bottom face
      0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
      // Right face
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
      // Left face
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
    ];
    
    // UVs (texture coordinates)
    const uvs = [
      // Front face
      0, 0, 1, 0, 1, 1, 0, 1,
      // Back face
      1, 0, 1, 1, 0, 1, 0, 0,
      // Top face
      0, 1, 0, 0, 1, 0, 1, 1,
      // Bottom face
      1, 1, 0, 1, 0, 0, 1, 0,
      // Right face
      1, 0, 1, 1, 0, 1, 0, 0,
      // Left face
      0, 0, 1, 0, 1, 1, 0, 1
    ];
    
    // Indices (for triangles)
    const indices = [
      0, 1, 2, 0, 2, 3,    // front
      4, 5, 6, 4, 6, 7,    // back
      8, 9, 10, 8, 10, 11,  // top
      12, 13, 14, 12, 14, 15, // bottom
      16, 17, 18, 16, 18, 19, // right
      20, 21, 22, 20, 22, 23  // left
    ];
    
    return { vertices, normals, uvs, indices };
  },
  
  // Create sphere vertices, normals, and UVs
  createSphere: function(radius = 1.0, segments = 16) {
    const vertices = [];
    const normals = [];
    const uvs = [];
    const indices = [];
    
    for (let y = 0; y <= segments; y++) {
      const v = y / segments;
      const theta = v * Math.PI;
      
      for (let x = 0; x <= segments; x++) {
        const u = x / segments;
        const phi = u * 2 * Math.PI;
        
        // Calculate vertex position
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);
        
        const ux = cosPhi * sinTheta;
        const uy = cosTheta;
        const uz = sinPhi * sinTheta;
        
        // Add vertex
        vertices.push(radius * ux, radius * uy, radius * uz);
        
        // Add normal (normalized vertex position)
        normals.push(ux, uy, uz);
        
        // Add UV
        uvs.push(u, v);
      }
    }
    
    // Generate indices
    for (let y = 0; y < segments; y++) {
      for (let x = 0; x < segments; x++) {
        const a = (y * (segments + 1)) + x;
        const b = a + 1;
        const c = a + (segments + 1);
        const d = c + 1;
        
        // Add two triangles for each quad
        indices.push(a, b, d);
        indices.push(a, d, c);
      }
    }
    
    return { vertices, normals, uvs, indices };
  },
  
  // Create torus vertices, normals, and UVs
  createTorus: function(radius = 0.7, tubeRadius = 0.3, radialSegments = 16, tubularSegments = 32) {
    const vertices = [];
    const normals = [];
    const uvs = [];
    const indices = [];
    
    for (let j = 0; j <= radialSegments; j++) {
      for (let i = 0; i <= tubularSegments; i++) {
        const u = i / tubularSegments * 2 * Math.PI;
        const v = j / radialSegments * 2 * Math.PI;
        
        // Calculate vertex position
        const x = (radius + tubeRadius * Math.cos(v)) * Math.cos(u);
        const y = (radius + tubeRadius * Math.cos(v)) * Math.sin(u);
        const z = tubeRadius * Math.sin(v);
        
        // Add vertex
        vertices.push(x, z, y); // Swap y and z for better orientation
        
        // Calculate normal
        const nx = Math.cos(v) * Math.cos(u);
        const ny = Math.cos(v) * Math.sin(u);
        const nz = Math.sin(v);
        
        // Add normal
        normals.push(nx, nz, ny); // Swap y and z for better orientation
        
        // Add UV
        uvs.push(i / tubularSegments, j / radialSegments);
      }
    }
    
    // Generate indices
    for (let j = 1; j <= radialSegments; j++) {
      for (let i = 1; i <= tubularSegments; i++) {
        const a = (tubularSegments + 1) * j + i - 1;
        const b = (tubularSegments + 1) * (j - 1) + i - 1;
        const c = (tubularSegments + 1) * (j - 1) + i;
        const d = (tubularSegments + 1) * j + i;
        
        // Add two triangles for each quad
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }
    
    return { vertices, normals, uvs, indices };
  },
  
  // Create teapot (simplified as a knot)
  createTeapot: function(radius = 0.6, tubularSegments = 64, radialSegments = 8, p = 2, q = 3) {
    const vertices = [];
    const normals = [];
    const uvs = [];
    const indices = [];
    
    // Generate a torus knot
    for (let i = 0; i <= tubularSegments; i++) {
      const u = i / tubularSegments * 2 * Math.PI;
      
      // Calculate the position on the curve
      const cu = Math.cos(u);
      const su = Math.sin(u);
      const quOverP = q * u / p;
      const cs = Math.cos(quOverP);
      
      const x = radius * (2 + cs) * 0.5 * cu;
      const y = radius * (2 + cs) * 0.5 * su;
      const z = radius * Math.sin(quOverP) * 0.5;
      
      // Calculate the tangent
      const tx = -radius * (2 + cs) * 0.5 * su;
      const ty = radius * (2 + cs) * 0.5 * cu;
      const tz = 0;
      
      // Calculate the normal
      const nx = -radius * Math.sin(quOverP) * 0.5 * cu;
      const ny = -radius * Math.sin(quOverP) * 0.5 * su;
      const nz = radius * (2 + cs) * 0.5 * Math.cos(quOverP);
      
      // Calculate the binormal
      const bx = ty * nz - tz * ny;
      const by = tz * nx - tx * nz;
      const bz = tx * ny - ty * nx;
      
      // Normalize the binormal
      const mag = Math.sqrt(bx * bx + by * by + bz * bz);
      const binormalX = bx / mag;
      const binormalY = by / mag;
      const binormalZ = bz / mag;
      
      // Generate the tube
      for (let j = 0; j <= radialSegments; j++) {
        const v = j / radialSegments * 2 * Math.PI;
        const cx = Math.cos(v);
        const cy = Math.sin(v);
        
        // Calculate the position on the tube
        const px = x + 0.2 * (cx * binormalX + cy * nx);
        const py = y + 0.2 * (cx * binormalY + cy * ny);
        const pz = z + 0.2 * (cx * binormalZ + cy * nz);
        
        // Add vertex
        vertices.push(px, pz, py); // Swap y and z for better orientation
        
        // Add normal (simplified)
        normals.push(cx * binormalX + cy * nx, cx * binormalZ + cy * nz, cx * binormalY + cy * ny);
        
        // Add UV
        uvs.push(i / tubularSegments, j / radialSegments);
      }
    }
    
    // Generate indices
    for (let i = 0; i < tubularSegments; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const a = (radialSegments + 1) * i + j;
        const b = (radialSegments + 1) * ((i + 1) % tubularSegments) + j;
        const c = (radialSegments + 1) * ((i + 1) % tubularSegments) + ((j + 1) % radialSegments);
        const d = (radialSegments + 1) * i + ((j + 1) % radialSegments);
        
        // Add two triangles for each quad
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }
    
    return { vertices, normals, uvs, indices };
  }
};
