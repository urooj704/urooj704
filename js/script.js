/* js/script.js */

// NAV MENU
const hamburger = document.getElementById('ham');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelectorAll('.mobile-menu a');

function toggleMenu() {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  if (mobileMenu.classList.contains('open')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

hamburger.addEventListener('click', toggleMenu);

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// NAVBAR SCROLL EFFECT
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.style.background = 'rgba(5, 5, 5, 0.9)';
    nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
  } else {
    nav.style.background = 'rgba(5, 5, 5, 0.75)';
    nav.style.boxShadow = 'none';
  }
});

// CANVAS BACKGROUND
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W, H, pts = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

let mx = W / 2, my = H / 2;
window.addEventListener('mousemove', e => { 
  mx = e.clientX; 
  my = e.clientY; 
});
// Touch support
window.addEventListener('touchmove', e => {
  if(e.touches.length > 0) {
    mx = e.touches[0].clientX;
    my = e.touches[0].clientY;
  }
}, {passive: true});

class Dot {
  constructor() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.t = Math.random();
    this.a = Math.random() * 0.5 + 0.2;
    this.ph = Math.random() * Math.PI * 2;
  }
  tick() {
    this.x += this.vx; 
    this.y += this.vy;
    this.ph += 0.01;
    
    // Mouse interaction
    const dx = mx - this.x;
    const dy = my - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 200) {
      const force = (200 - dist) / 200;
      this.vx -= (dx / dist) * force * 0.02;
      this.vy -= (dy / dist) * force * 0.02;
    }

    // Gravity to center slightly
    this.vx += (W/2 - this.x) * 0.00001;
    this.vy += (H/2 - this.y) * 0.00001;

    // Friction
    this.vx *= 0.99; 
    this.vy *= 0.99;

    // Bounce off walls
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
  draw() {
    const a = this.a * (0.8 + 0.2 * Math.sin(this.ph));
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    if (this.t > 0.7) ctx.fillStyle = `rgba(167, 139, 250, ${a})`; // p2
    else if (this.t > 0.4) ctx.fillStyle = `rgba(196, 181, 253, ${a})`; // p3
    else ctx.fillStyle = `rgba(245, 158, 11, ${a * 0.8})`; // gold
    ctx.fill();
  }
}

// Responsive point count
const isMobile = window.innerWidth < 768;
const pointCount = isMobile ? 50 : 120;

for (let i = 0; i < pointCount; i++) pts.push(new Dot());

function frame() {
  ctx.clearRect(0, 0, W, H);
  
  // Connect dots
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
      const d = dx*dx + dy*dy;
      const maxDist = isMobile ? 6400 : 10000; // 80^2 or 100^2
      
      if (d < maxDist) {
        const dist = Math.sqrt(d);
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / Math.sqrt(maxDist))})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
  
  pts.forEach(p => { p.tick(); p.draw(); });
  requestAnimationFrame(frame);
}
frame();

// SCROLL FADE IN
const obsOptions = {
  root: null,
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
};

const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, obsOptions);

document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
