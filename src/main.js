import './style.css';

/* ── NAVBAR: scroll highlight + hamburger ───────────────── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Scroll shadow
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Hamburger
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
hamburger.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') hamburger.click();
});

// Close on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Active link on scroll (IntersectionObserver)
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a[data-section]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.classList.remove('active'));
      const target = document.querySelector(`.nav-links a[data-section="${entry.target.id}"]`);
      if (target) target.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ── REVEAL ON SCROLL ───────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── SKILL BARS ─────────────────────────────────────────── */
document.querySelectorAll('.skill-bar-fill').forEach(bar => {
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => { bar.style.width = bar.getAttribute('data-width') + '%'; }, 200);
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  barObs.observe(bar.closest('.lang-card'));
});

/* ── TYPING ANIMATION ───────────────────────────────────── */
const titles = [
  'Cybersecurity Enthusiast',
  'Ethical Hacker in Training',
  'Web Developer',
  'Cisco CyberOps Student',
  'C / Python / C# Coder',
];
let ti = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed-title');

function type() {
  if (!typedEl) return;
  const cur = titles[ti];
  typedEl.textContent = deleting ? cur.substring(0, --ci) : cur.substring(0, ++ci);
  let speed = deleting ? 50 : 90;
  if (!deleting && ci === cur.length) { speed = 2000; deleting = true; }
  else if (deleting && ci === 0) { deleting = false; ti = (ti + 1) % titles.length; speed = 400; }
  setTimeout(type, speed);
}
setTimeout(type, 900);

/* ── PROJECT FILTER ─────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      card.classList.toggle('hidden', f !== 'all' && card.getAttribute('data-category') !== f);
    });
  });
});

/* ── CONTACT FORM ───────────────────────────────────────── */
const form = document.getElementById('contact-form');
const submitText = document.getElementById('submit-text');
const successMsg = document.getElementById('form-success');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = form.querySelector('#field-name').value.trim();
  const email = form.querySelector('#field-email').value.trim();
  const msg = form.querySelector('#field-msg').value.trim();
  if (!name || !email || !msg) return;

  const btn = document.getElementById('submit-contact');
  btn.disabled = true;
  submitText.textContent = 'A enviar...';
  await new Promise(r => setTimeout(r, 1500));
  form.reset();
  btn.disabled = false;
  submitText.textContent = 'Enviar Mensagem';
  successMsg.hidden = false;
  setTimeout(() => { successMsg.hidden = true; }, 6000);
});
