// Modern UI interactions with vanilla JS
document.addEventListener('DOMContentLoaded', () => {
  // Apply tilt effect to cards
  const tiltElements = document.querySelectorAll('.bitcoin-card, .project-card, .social-link');
  
  tiltElements.forEach(element => {
    element.classList.add('tilt-effect');
    
    element.addEventListener('mousemove', e => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const tiltX = (y - centerY) / 10;
      const tiltY = (centerX - x) / 10;
      
      element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
  
  // Staggered reveal animation for sections
  const revealSections = document.querySelectorAll('.section-header, .about-text, .bitcoin-grid, .projects-grid');
  
  revealSections.forEach(section => {
    section.classList.add('stagger-reveal');
    
    // Create observer for each section
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          section.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    observer.observe(section);
  });
  
  // Animated progress bars
  const progressBars = document.querySelectorAll('.progress-bar');
  
  progressBars.forEach(bar => {
    const progress = bar.getAttribute('data-progress') || '100';
    bar.style.setProperty('--progress', `${progress}%`);
  });
  
  // Particle connection lines
  const createParticleConnections = () => {
    const techTags = document.querySelectorAll('.tech-tag');
    const container = document.querySelector('.tech-stack');
    
    if (techTags.length > 0 && container) {
      // Remove any existing connections
      document.querySelectorAll('.particle-connection').forEach(el => el.remove());
      
      // Create connections between random tags
      for (let i = 0; i < techTags.length; i++) {
        const tag1 = techTags[i];
        
        // Connect to 1-2 random other tags
        const connections = Math.floor(Math.random() * 2) + 1;
        
        for (let j = 0; j < connections; j++) {
          const randomIndex = Math.floor(Math.random() * techTags.length);
          
          if (randomIndex !== i) {
            const tag2 = techTags[randomIndex];
            
            const rect1 = tag1.getBoundingClientRect();
            const rect2 = tag2.getBoundingClientRect();
            
            const containerRect = container.getBoundingClientRect();
            
            const x1 = rect1.left + rect1.width / 2 - containerRect.left;
            const y1 = rect1.top + rect1.height / 2 - containerRect.top;
            const x2 = rect2.left + rect2.width / 2 - containerRect.left;
            const y2 = rect2.top + rect2.height / 2 - containerRect.top;
            
            const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
            
            // Create line element
            const line = document.createElement('div');
            line.className = 'particle-connection';
            line.style.width = `${distance}px`;
            line.style.left = `${x1}px`;
            line.style.top = `${y1}px`;
            line.style.transform = `rotate(${angle}deg)`;
            
            container.appendChild(line);
          }
        }
      }
    }
  };
  
  // Create connections on load and resize
  window.addEventListener('load', createParticleConnections);
  window.addEventListener('resize', createParticleConnections);
  
  // Add futuristic tooltips
  const addTooltips = () => {
    const tooltipElements = document.querySelectorAll('.tech-tag, .project-tag');
    
    tooltipElements.forEach(element => {
      if (!element.hasAttribute('data-tooltip')) {
        element.setAttribute('data-tooltip', element.textContent);
        element.classList.add('tooltip');
      }
    });
  };
  
  addTooltips();
  
  // Add cyber grid background to sections
  const addCyberGrid = () => {
    const sections = document.querySelectorAll('.bitcoin, .projects');
    
    sections.forEach(section => {
      section.classList.add('cyber-grid');
    });
  };
  
  addCyberGrid();
  
  // Add neon text effect to headings
  const addNeonEffect = () => {
    const headings = document.querySelectorAll('h1, h2, .section-line');
    
    headings.forEach(heading => {
      heading.classList.add('neon-text');
    });
    
    // Add neon border to important elements
    const cards = document.querySelectorAll('.bitcoin-card, .project-card');
    cards.forEach(card => {
      card.classList.add('neon-border');
    });
  };
  
  addNeonEffect();
  
  // Add glassmorphism effect to nav and cards
  const addGlassmorphism = () => {
    const elements = document.querySelectorAll('.main-nav, .bitcoin-card, .project-card, .post, .terminal, .social-link');
    
    elements.forEach(element => {
      element.classList.add('glassmorphism');
    });
  };
  
  addGlassmorphism();
  
  // Add floating animation to code snippet
  const codeSnippet = document.querySelector('.code-snippet');
  if (codeSnippet) {
    codeSnippet.classList.add('float-animation');
  }
  
  // Add gradient background to hero section
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.classList.add('gradient-bg');
  }
  
  // Add futuristic button effects
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.classList.add('btn-futuristic');
  });
});

// Dynamic cursor effect
const createCustomCursor = () => {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);
  
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursorDot);
  
  document.addEventListener('mousemove', e => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    
    // Delayed follow for dot
    setTimeout(() => {
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    }, 100);
  });
  
  // Add hover effect for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .btn, .tech-tag, .project-card, .bitcoin-card, .social-link');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      cursorDot.classList.add('cursor-hover');
    });
    
    element.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      cursorDot.classList.remove('cursor-hover');
    });
  });
};

// Initialize cursor on load for desktop only
if (window.matchMedia('(min-width: 768px)').matches) {
  window.addEventListener('load', createCustomCursor);
}

// Parallax effect for hero section
const initParallax = () => {
  const hero = document.querySelector('.hero');
  
  if (hero) {
    window.addEventListener('mousemove', e => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      const heroContent = hero.querySelector('.hero-content');
      const codeSnippet = hero.querySelector('.code-snippet');
      
      if (heroContent) {
        heroContent.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
      }
      
      if (codeSnippet) {
        codeSnippet.style.transform = `rotate(2deg) translate(${-x * 20}px, ${-y * 20}px)`;
      }
    });
  }
};

// Initialize parallax on load
window.addEventListener('load', initParallax);