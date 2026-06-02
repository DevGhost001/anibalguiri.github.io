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
const errorMsg = document.getElementById('form-error');

// ── EmailJS Config ──────────────────────────────────────
// TODO: Substitua pelas suas credenciais do EmailJS
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

// Inicializar EmailJS
if (typeof emailjs !== 'undefined') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

// ── Validation Helpers ──────────────────────────────────
const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (!input || !error) return;
  input.classList.add('invalid');
  input.classList.remove('valid');
  error.textContent = message;
  error.classList.add('visible');
}

function showValid(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (!input || !error) return;
  input.classList.remove('invalid');
  input.classList.add('valid');
  error.textContent = '';
  error.classList.remove('visible');
}

function clearState(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (!input || !error) return;
  input.classList.remove('invalid', 'valid');
  error.textContent = '';
  error.classList.remove('visible');
}

// ── Real-time Email Validation ──────────────────────────
const emailField = document.getElementById('field-email');
emailField?.addEventListener('input', () => {
  const val = emailField.value.trim();
  if (val === '') {
    clearState('field-email', 'email-error');
  } else if (!emailRegex.test(val)) {
    showError('field-email', 'email-error', '⚠ Formato de email inválido');
  } else {
    showValid('field-email', 'email-error');
  }
});

// ── Real-time Required Field Validation ─────────────────
function setupRequiredValidation(inputId, errorId, label) {
  const field = document.getElementById(inputId);
  field?.addEventListener('input', () => {
    const val = field.value.trim();
    if (val === '') {
      clearState(inputId, errorId);
    } else if (val.length < 2) {
      showError(inputId, errorId, `⚠ ${label} é muito curto`);
    } else {
      showValid(inputId, errorId);
    }
  });
}
setupRequiredValidation('field-name', 'name-error', 'Nome');
setupRequiredValidation('field-subject', 'subject-error', 'Assunto');
setupRequiredValidation('field-msg', 'msg-error', 'Mensagem');

// ── Form Submit ─────────────────────────────────────────
function validateAll() {
  let valid = true;
  const name = document.getElementById('field-name').value.trim();
  const email = document.getElementById('field-email').value.trim();
  const subject = document.getElementById('field-subject').value.trim();
  const msg = document.getElementById('field-msg').value.trim();

  if (!name || name.length < 2) {
    showError('field-name', 'name-error', '⚠ Por favor, insira o seu nome');
    valid = false;
  }
  if (!email) {
    showError('field-email', 'email-error', '⚠ Por favor, insira o seu email');
    valid = false;
  } else if (!emailRegex.test(email)) {
    showError('field-email', 'email-error', '⚠ Formato de email inválido');
    valid = false;
  }
  if (!subject || subject.length < 2) {
    showError('field-subject', 'subject-error', '⚠ Por favor, insira o assunto');
    valid = false;
  }
  if (!msg || msg.length < 2) {
    showError('field-msg', 'msg-error', '⚠ Por favor, escreva a sua mensagem');
    valid = false;
  }
  return valid;
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  successMsg.classList.remove('show');
  errorMsg.classList.remove('show');

  if (!validateAll()) return;

  const btn = document.getElementById('submit-contact');
  btn.disabled = true;
  submitText.textContent = 'A enviar...';

  try {
    // Enviar email real via EmailJS
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: document.getElementById('field-name').value.trim(),
        from_email: document.getElementById('field-email').value.trim(),
        subject: document.getElementById('field-subject').value.trim(),
        contact_type: document.getElementById('field-type').value,
        message: document.getElementById('field-msg').value.trim(),
      });
    } else {
      // Fallback: simular envio se EmailJS não estiver configurado
      console.warn('EmailJS não configurado. Simulando envio...');
      await new Promise(r => setTimeout(r, 1500));
    }

    // Sucesso
    form.reset();
    // Limpar estados visuais de validação
    ['field-name', 'field-email', 'field-subject', 'field-msg'].forEach(id => {
      const el = document.getElementById(id);
      el?.classList.remove('valid', 'invalid');
    });
    ['name-error', 'email-error', 'subject-error', 'msg-error'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.textContent = ''; el.classList.remove('visible'); }
    });

    successMsg.classList.add('show');
    setTimeout(() => { successMsg.classList.remove('show'); }, 7000);
  } catch (err) {
    console.error('Erro ao enviar email:', err);
    errorMsg.classList.add('show');
    setTimeout(() => { errorMsg.classList.remove('show'); }, 7000);
  } finally {
    btn.disabled = false;
    submitText.textContent = 'Enviar Mensagem';
  }
});
