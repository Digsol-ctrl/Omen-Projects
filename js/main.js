// Omen Projects - Enhanced JavaScript
// Full interactivity with animations, scroll effects, and dynamic content

const servicesUrl = window.SERVICES_JSON || 'data/services.json';
const projectsUrl = window.PROJECTS_JSON || 'data/projects.json';

// ===== SCROLL & ANIMATION =====
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

function observeElements() {
  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
    scrollObserver.observe(el);
  });
}

// ===== HEADER BEHAVIOR =====
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  
  if (currentScroll > lastScrollTop && currentScroll > 100) {
    // Scrolling down
    header?.classList.add('hidden');
  } else {
    // Scrolling up
    header?.classList.remove('hidden');
  }
  
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== MOBILE NAV TOGGLE =====
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
    // Swap icon
    const icon = mobileToggle.querySelector('i');
    if (icon) {
      if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      }
    }
  });

  // Close menu on nav link click
  navMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      }
    });
  });
}

// ===== COUNTER ANIMATION =====
function animateCounter(element, finalValue, duration = 1500) {
  let currentValue = 0;
  const increment = finalValue / (duration / 16);
  
  const timer = setInterval(() => {
    currentValue += increment;
    if (currentValue >= finalValue) {
      element.textContent = finalValue + '+';
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(currentValue);
    }
  }, 16);
}

// Observe counters
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      const finalValue = parseInt(entry.target.textContent) || 0;
      animateCounter(entry.target, finalValue);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => {
  counterObserver.observe(el);
});

// ===== FORM RIPPLE EFFECT =====
document.querySelectorAll('.form-control').forEach(input => {
  input.addEventListener('focus', (e) => {
    createRipple(e.target);
  });
});

function createRipple(element) {
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  ripple.style.position = 'absolute';
  ripple.style.borderRadius = '50%';
  ripple.style.background = 'rgba(30, 144, 255, 0.6)';
  ripple.style.transform = 'scale(0)';
  ripple.style.animation = 'ripple-effect 0.6s ease-out';
  element.style.position = 'relative';
  element.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
}

// ===== WHATSAPP FLOAT RIPPLE =====
const whatsappFloat = document.querySelector('.whatsapp-float');
if (whatsappFloat) {
  whatsappFloat.addEventListener('mouseenter', () => {
    const ripple = document.createElement('span');
    ripple.classList.add('whatsapp-ripple');
    ripple.style.width = '12px';
    ripple.style.height = '12px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    whatsappFloat.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

// ===== LOAD SERVICES =====
async function loadServices() {
  try {
    const response = await fetch(servicesUrl);
    const data = await response.json();
    const container = document.getElementById('servicesList');
    
    if (data.services && Array.isArray(data.services)) {
      data.services.forEach((service, idx) => {
        const card = document.createElement('div');
        card.className = 'service-card fade-in';
        card.style.animationDelay = `${idx * 0.1}s`;
        card.innerHTML = `
          <i class="fa-solid fa-${getServiceIcon(service.title)} service-icon"></i>
          <h3>${service.title}</h3>
          <p>${service.description}</p>
        `;
        container?.appendChild(card);
      });
      observeElements();
    }
  } catch (e) {
    console.error('Error loading services:', e);
  }
}

function getServiceIcon(title) {
  const icons = {
    'residential': 'building',
    'architectural': 'pencil-ruler',
    'management': 'chart-line',
    'bills': 'receipt',
    'construction': 'hard-hat',
    'design': 'drafting-compass'
  };
  
  for (const [key, icon] of Object.entries(icons)) {
    if (title.toLowerCase().includes(key)) return icon;
  }
  return 'building';
}

// ===== LOAD PROJECTS =====
async function loadProjects() {
  try {
    const response = await fetch(projectsUrl);
    const data = await response.json();
    const projectsArray = Array.isArray(data) ? data : (Array.isArray(data.projects) ? data.projects : []);
    
    if (projectsArray && projectsArray.length) {
      const projectsList = document.getElementById('projectsList');
      const carousel = document.getElementById('projectCarousel');

      // Featured carousel
      if (carousel) {
        projectsArray.forEach((project) => {
          if (project.images && project.images.length > 0) {
            const img = document.createElement('img');
            img.src = project.images[0];
            img.alt = project.title;
            carousel.appendChild(img);
          }
        });
      }

      // Grid
      if (projectsList) {
        projectsArray.forEach((project, idx) => {
          const card = document.createElement('div');
          card.className = 'project-card scale-in';
          card.style.animationDelay = `${idx * 0.15}s`;
          card.style.cursor = 'pointer';
          card.innerHTML = `
            <div class="project-img">
              <img src="${project.images?.[0] || 'images/hero.svg'}" alt="${project.title}" />
            </div>
            <div class="project-info">
              <h3>${project.title}</h3>
              <span class="project-category">${project.location || 'Harare'}</span>
              <p>${project.description || 'Premium construction project'}</p>
            </div>
          `;
          card.addEventListener('click', () => openProjectModal(project.id));
          projectsList.appendChild(card);
        });
      }

      observeElements();
    }
  } catch (e) {
    console.error('Error loading projects:', e);
  }
}

// ===== PROJECT MODAL =====
async function openProjectModal(projectId) {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  
  try {
    const response = await fetch(projectsUrl);
    const data = await response.json();
    const projectsArray = Array.isArray(data) ? data : (Array.isArray(data.projects) ? data.projects : []);
    const project = projectsArray.find(p => p.id === projectId);
    
    if (project) {
      const carousel = modal.querySelector('#projectCarousel');
      if (carousel) {
        carousel.innerHTML = '';
        project.images?.forEach(img => {
          const imgEl = document.createElement('img');
          imgEl.src = img;
          imgEl.alt = project.title;
          carousel.appendChild(imgEl);
        });
      }
      
      const titleEl = modal.querySelector('h2');
      if (titleEl) titleEl.textContent = project.title;
      
      const descEl = modal.querySelector('p');
      if (descEl) descEl.textContent = project.description || 'Project details';
      
      modal.setAttribute('aria-hidden', 'false');
      bindModalCarouselControls();
    }
  } catch (e) {
    console.error('Error opening modal:', e);
  }
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  if (modal) modal.setAttribute('aria-hidden', 'true');
}

// ===== CAROUSEL CONTROLS =====
function bindCarouselControls() {
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const carousel = document.getElementById('projectCarousel');

  if (prevBtn && carousel) {
    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -300, behavior: 'smooth' });
    });
  }

  if (nextBtn && carousel) {
    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: 300, behavior: 'smooth' });
    });
  }
}

function bindModalCarouselControls() {
  const modal = document.getElementById('projectModal');
  const prevBtn = modal?.querySelector('.modal-prev');
  const nextBtn = modal?.querySelector('.modal-next');
  const carousel = modal?.querySelector('#projectCarousel');

  if (prevBtn && carousel) {
    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -600, behavior: 'smooth' });
    });
  }

  if (nextBtn && carousel) {
    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: 600, behavior: 'smooth' });
    });
  }
}

// ===== MODAL CLOSE =====
document.addEventListener('DOMContentLoaded', function() {
  // Load content
  loadServices();
  loadProjects();
  bindCarouselControls();

  // Modal close button
  const closeBtn = document.querySelector('[data-dismiss="modal"]');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeProjectModal);
  }

  // Modal backdrop click
  const modal = document.getElementById('projectModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeProjectModal();
      }
    });
  }

  // WhatsApp hover tooltip
  const whatsappFloat = document.querySelector('.whatsapp-float');
  const whatsappTooltip = document.querySelector('.whatsapp-tooltip');
  
  if (whatsappFloat && whatsappTooltip) {
    whatsappFloat.addEventListener('mouseenter', () => {
      whatsappTooltip.style.opacity = '1';
      whatsappTooltip.style.visibility = 'visible';
    });
    
    whatsappFloat.addEventListener('mouseleave', () => {
      whatsappTooltip.style.opacity = '0';
      whatsappTooltip.style.visibility = 'hidden';
    });
  }

  // Observe initial elements
  observeElements();
});
