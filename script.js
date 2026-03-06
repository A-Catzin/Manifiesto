/* ============================================
   MANIFIESTO PERSONAL — script.js
   ============================================ */

// ── 1. CURSOR PERSONALIZADO ──────────────────
const cursor    = document.querySelector('.custom-cursor');
const cursorDot = document.querySelector('.custom-cursor-dot');

document.addEventListener('mousemove', (e) => {
  // El anillo sigue con un leve retraso (via CSS transition)
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
  // El punto sigue exacto
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top  = e.clientY + 'px';
});

// Escala el cursor al pasar sobre elementos interactivos
document.querySelectorAll('a, button, .decalogo-item, .chapter-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1.6)';
    cursor.style.opacity   = '1';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursor.style.opacity   = '0.7';
  });
});


// ── 2. TOGGLE TEMA OSCURO / CLARO ────────────
const themeToggle = document.getElementById('themeToggle');
const html        = document.documentElement;

// Recupera preferencia guardada
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  // Actualiza partículas al cambiar tema
  updateParticleColor();
});


// ── 3. TYPEWRITER EFFECT (Hero Title) ────────
const heroTitle = document.getElementById('heroTitle');
const fullText  = 'Dueño de mi Destino y Arquitecto de mi Camino';
let charIndex   = 0;

function typeWriter() {
  if (charIndex < fullText.length) {
    heroTitle.textContent += fullText[charIndex];
    charIndex++;
    // Velocidad variable para efecto más natural
    const delay = fullText[charIndex - 1] === ' ' ? 60 : Math.random() * 60 + 40;
    setTimeout(typeWriter, delay);
  } else {
    // Oculta el cursor parpadeante al terminar
    heroTitle.classList.add('typing-done');
  }
}

// Inicia el typewriter con un pequeño delay
setTimeout(typeWriter, 800);


// ── 4. INTERSECTION OBSERVER (Fade-in scroll) ─
const fadeElements = document.querySelectorAll('.fade-in');

const observerOptions = {
  threshold: 0.15,       // visible al 15%
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Delay escalonado para elementos consecutivos
      const siblings = [...entry.target.parentElement.querySelectorAll('.fade-in')];
      const index    = siblings.indexOf(entry.target);
      const delay    = index * 80; // ms entre cada elemento

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      observer.unobserve(entry.target); // solo anima una vez
    }
  });
}, observerOptions);

fadeElements.forEach(el => observer.observe(el));


// ── 5. PARTÍCULAS (constelaciones ligeras) ────
const canvas  = document.getElementById('particles-canvas');
const ctx     = canvas.getContext('2d');
let particles = [];
let particleColor = getComputedStyle(document.documentElement)
                      .getPropertyValue('--accent').trim() || '#c9a84c';

// Ajusta tamaño del canvas al viewport
function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

// Actualiza color de partículas según tema
function updateParticleColor() {
  particleColor = getComputedStyle(document.documentElement)
                    .getPropertyValue('--accent').trim();
}

// Clase partícula
class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.size  = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.25;
    this.speedY = (Math.random() - 0.5) * 0.25;
    this.alpha = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    // Rebota en los bordes
    if (this.x < 0 || this.x > canvas.width)  this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = particleColor;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// Dibuja líneas entre partículas cercanas (efecto constelación)
function drawConnections() {
  const maxDist = 120;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.12;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = particleColor;
        ctx.globalAlpha = alpha;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}

// Inicializa partículas (densidad baja para no saturar)
function initParticles() {
  const count = Math.floor((canvas.width * canvas.height) / 18000);
  particles   = Array.from({ length: Math.min(count, 60) }, () => new Particle());
}

// Loop de animación
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();


// ── 6. SMOOTH SCROLL para el CTA ─────────────
document.querySelector('.scroll-cta').addEventListener('click', (e) => {
  e.preventDefault();
  const target = document.querySelector('#manifiesto');
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});