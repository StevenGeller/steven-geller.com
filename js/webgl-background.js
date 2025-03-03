// Import Three.js from CDN
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/postprocessing/UnrealBloomPass.js';

// Initialize WebGL background
function initWebGLBackground() {
  // Create container if it doesn't exist
  if (!document.getElementById('webgl-background')) {
    const container = document.createElement('div');
    container.id = 'webgl-background';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-1';
    container.style.pointerEvents = 'none';
    document.body.prepend(container);
  }

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ 
    alpha: true,
    antialias: true 
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x0c0c0e, 1);
  document.getElementById('webgl-background').appendChild(renderer.domElement);

  // Create a grid of points
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 3000;
  const posArray = new Float32Array(particlesCount * 3);

  for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 8;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  // Material with custom shader for glow effect
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.006,
    color: 0x333333,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  });

  // Mesh
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Add some ambient light
  const ambientLight = new THREE.AmbientLight(0x202020);
  scene.add(ambientLight);

  // Add a directional light
  const directionalLight = new THREE.DirectionalLight(0x505050, 0.2);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Camera position
  camera.position.z = 2;

  // Post-processing for glow effect
  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,  // strength
    0.4,  // radius
    0.85  // threshold
  );

  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  // Mouse movement effect
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
  });

  // Animation
  const animate = () => {
    requestAnimationFrame(animate);
    
    particlesMesh.rotation.y += 0.0005;
    particlesMesh.rotation.x += 0.0002;
    
    // Respond to mouse
    particlesMesh.rotation.y += mouseX * 0.01;
    particlesMesh.rotation.x += mouseY * 0.01;

    // Subtle wave effect
    const now = Date.now() / 1000;
    particlesMesh.position.y = Math.sin(now * 0.2) * 0.1;
    
    // Use composer instead of renderer for post-processing
    composer.render();
  };

  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  });

  // Start animation
  animate();
}

// Initialize when the page loads
window.addEventListener('load', initWebGLBackground);

export { initWebGLBackground };