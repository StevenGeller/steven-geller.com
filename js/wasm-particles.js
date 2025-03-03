// WebAssembly Loader and Interface
class WasmParticles {
  constructor() {
    this.memory = new WebAssembly.Memory({ initial: 1 });
    this.instance = null;
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
  }
  
  // Initialize the WebAssembly module
  async init() {
    try {
      // Create canvas element
      this.createCanvas();
      
      // Import object for WebAssembly
      const importObject = {
        env: {
          memory: this.memory,
          log: (ptr, len) => {
            const bytes = new Uint8Array(this.memory.buffer, ptr, len);
            const message = new TextDecoder('utf8').decode(bytes);
            console.log('WASM:', message);
          },
          random: Math.random,
        }
      };
      
      // Fetch and compile WebAssembly module
      const response = await fetch('wasm/particles.wasm');
      const buffer = await response.arrayBuffer();
      const module = await WebAssembly.compile(buffer);
      
      // Instantiate WebAssembly module
      this.instance = await WebAssembly.instantiate(module, importObject);
      
      // Initialize particles
      const width = window.innerWidth;
      const height = window.innerHeight;
      const numParticles = 100;
      
      this.instance.exports.initParticles(width, height, numParticles);
      
      // Start animation
      this.animate();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize WebAssembly particles:', error);
      this.fallbackToParticlesJS();
      return false;
    }
  }
  
  // Create canvas element
  createCanvas() {
    // Create container if it doesn't exist
    let container = document.getElementById('wasm-particles');
    if (!container) {
      container = document.createElement('div');
      container.id = 'wasm-particles';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.zIndex = '-1';
      container.style.pointerEvents = 'none';
      document.body.prepend(container);
    }
    
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.display = 'block';
    container.appendChild(this.canvas);
    
    // Get 2D context
    this.ctx = this.canvas.getContext('2d');
    
    // Handle window resize
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      
      // Re-initialize particles with new dimensions
      if (this.instance) {
        this.instance.exports.initParticles(
          window.innerWidth,
          window.innerHeight,
          this.instance.exports.getNumParticles()
        );
      }
    });
  }
  
  // Animation loop
  animate() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update particles
    this.instance.exports.updateParticles();
    
    // Draw particles
    const numParticles = this.instance.exports.getNumParticles();
    
    for (let i = 0; i < numParticles; i++) {
      // Get particle position
      const [x, y] = [
        this.instance.exports.getParticleData(i),
        this.instance.exports.getParticleData(i + 1)
      ];
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(x, y, 2, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 153, 0, 0.4)';
      this.ctx.fill();
    }
    
    // Draw connections
    this.drawConnections();
    
    // Request next frame
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  // Draw connections between particles
  drawConnections() {
    const numParticles = this.instance.exports.getNumParticles();
    const maxDistance = 150;
    
    for (let i = 0; i < numParticles; i++) {
      const [x1, y1] = [
        this.instance.exports.getParticleData(i),
        this.instance.exports.getParticleData(i + 1)
      ];
      
      for (let j = i + 1; j < numParticles; j++) {
        const [x2, y2] = [
          this.instance.exports.getParticleData(j),
          this.instance.exports.getParticleData(j + 1)
        ];
        
        const dx = x1 - x2;
        const dy = y1 - y2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance;
          this.ctx.beginPath();
          this.ctx.moveTo(x1, y1);
          this.ctx.lineTo(x2, y2);
          this.ctx.strokeStyle = `rgba(0, 102, 255, ${opacity * 0.4})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }
  
  // Fallback to particles.js if WebAssembly fails
  fallbackToParticlesJS() {
    console.log('Falling back to particles.js');
    
    // Check if particles.js is available
    if (typeof particlesJS !== 'undefined') {
      particlesJS('particles', {
        "particles": {
          "number": {
            "value": 60,
            "density": {
              "enable": true,
              "value_area": 800
            }
          },
          "color": {
            "value": "#ff9900"
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#000000"
            },
          },
          "opacity": {
            "value": 0.4,
            "random": true,
            "anim": {
              "enable": true,
              "speed": 1,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": 3,
            "random": true,
            "anim": {
              "enable": true,
              "speed": 2,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#0066ff",
            "opacity": 0.4,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 1,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
              "enable": true,
              "rotateX": 600,
              "rotateY": 1200
            }
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "grab"
            },
            "onclick": {
              "enable": true,
              "mode": "push"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 140,
              "line_linked": {
                "opacity": 1
              }
            },
            "push": {
              "particles_nb": 4
            }
          }
        },
        "retina_detect": true
      });
    }
  }
  
  // Stop animation
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

// Initialize WebAssembly particles when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  const wasmParticles = new WasmParticles();
  const success = await wasmParticles.init();
  
  if (success) {
    console.log('WebAssembly particles initialized successfully');
  }
});