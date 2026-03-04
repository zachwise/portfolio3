// Setup Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// Portfolio Data (Placeholders)
const imageUrls = [
  './images/journalism.jpg', // Journalism
  './images/camera.jpg', // Camera
  './images/writing.jpg', // Writing
  './images/photography.jpg'  // Photography
];

const loader = new THREE.TextureLoader();
const items = [];

// Create Floating Planes
imageUrls.forEach((url, i) => {
  const geometry = new THREE.PlaneGeometry(4, 2.5);
  const material = new THREE.MeshBasicMaterial({ 
    map: loader.load(url),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9
  });
  
  const plane = new THREE.Mesh(geometry, material);
  
  // Position items in a "tunnel"
  plane.position.x = (i % 2 === 0 ? -3 : 3) + (Math.random() - 0.5);
  plane.position.y = (Math.random() - 0.5) * 4;
  plane.position.z = i * -8;
  
  scene.add(plane);
  items.push(plane);
});

camera.position.z = 8;

// Mouse Movement Logic
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

window.addEventListener('mousemove', (event) => {
  // Normalize mouse coordinates (-1 to 1)
  targetX = (event.clientX - window.innerWidth / 2) / 100;
  targetY = (event.clientY - window.innerHeight / 2) / 100;
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  
  // Smoothly interpolate mouse movement (Easing)
  mouseX += (targetX - mouseX) * 0.05;
  mouseY += (targetY - mouseY) * 0.05;
  
  // Apply movement to camera
  camera.position.x = mouseX * 0.5;
  camera.position.y = -mouseY * 0.5;
  camera.lookAt(new THREE.Vector3(0, 0, -10));

  // Individual plane floating effect
  items.forEach((item, index) => {
    item.rotation.y = Math.sin(Date.now() * 0.001 + index) * 0.1;
    item.position.y += Math.cos(Date.now() * 0.001 + index) * 0.002;
  });

  renderer.render(scene, camera);
}

// Scroll to move through the gallery
window.addEventListener('wheel', (e) => {
  camera.position.z += e.deltaY * 0.01;
});

animate();

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});