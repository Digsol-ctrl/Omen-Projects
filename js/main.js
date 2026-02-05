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

      // Clear any existing featured carousel content — we use per-card carousels instead
      if (carousel) {
        carousel.innerHTML = '';
        // hide the featured carousel container so no stray images appear
        carousel.style.display = 'none';
      }

      // Grid
      if (projectsList) {
        projectsArray.forEach((project, idx) => {
          const card = document.createElement('div');
          card.className = 'project-card scale-in';
          card.style.animationDelay = `${idx * 0.15}s`;
          card.style.cursor = 'pointer';

          // Card HTML uses a small carousel container
          card.innerHTML = `
            <div class="project-img">
              <div class="card-carousel">
                <div class="card-track"></div>
              </div>
            </div>
            <div class="project-info">
              <h3>${project.title}</h3>
              <span class="project-category">${project.location || 'Harare'}</span>
              <p>${project.description || 'Premium construction project'}</p>
            </div>
          `;

          // Append card first, then populate images and start auto-scroll
          projectsList.appendChild(card);

          const track = card.querySelector('.card-track');
          if (track) {
            track.style.display = 'flex';
            track.style.width = '100%';
            track.style.transition = 'transform 0.5s ease';

            const imgs = (project.images && project.images.length) ? project.images : ['images/hero.svg'];
            imgs.forEach(src => {
              const imgEl = document.createElement('img');
              imgEl.src = src || 'images/hero.svg';
              imgEl.alt = project.title;
              imgEl.style.width = '100%';
              imgEl.style.flex = '0 0 100%';
              track.appendChild(imgEl);
            });

            // Auto-scroll logic per card
            let currentIdx = 0;
            const count = track.querySelectorAll('img').length;

            function startCarousel() {
              if (count <= 1) return;
              // Advance every 3 seconds
              card._carouselInterval = setInterval(() => {
                currentIdx = (currentIdx + 1) % count;
                track.style.transform = `translateX(-${currentIdx * 100}%)`;
              }, 3000);
            }

            function stopCarousel() {
              if (card._carouselInterval) {
                clearInterval(card._carouselInterval);
                card._carouselInterval = null;
              }
            }

            // Pause on hover, resume on leave
            card.addEventListener('mouseenter', stopCarousel);
            card.addEventListener('mouseleave', () => {
              // small timeout to avoid immediate restart on accidental leaves
              setTimeout(startCarousel, 150);
            });

            // Start the carousel
            startCarousel();
          }

          // Click opens the larger modal gallery
          card.addEventListener('click', () => openProjectModal(project.id));
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
  // Use the homepage gallery modal
  const modal = document.getElementById('projects-gallery-modal');
  if (!modal) return;

  try {
    const response = await fetch(projectsUrl);
    const data = await response.json();
    const projectsArray = Array.isArray(data) ? data : (Array.isArray(data.projects) ? data.projects : []);
    const project = projectsArray.find(p => p.id === projectId);

    if (!project) return;

    const track = document.getElementById('modalCarouselTrack');
    const indicators = document.getElementById('modalIndicators');
    const prevBtn = document.getElementById('modalPrev');
    const nextBtn = document.getElementById('modalNext');
    const closeBtn = modal.querySelector('.modal-close');

    if (!track || !indicators) return;

    // Populate images
    track.innerHTML = '';
    project.images?.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = project.title;
      track.appendChild(img);
    });

    // Build indicators
    indicators.innerHTML = '';
    const imgs = Array.from(track.querySelectorAll('img'));
    imgs.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = `indicator ${i === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        currentModalSlide = i;
        track.style.transform = `translateX(-${currentModalSlide * 100}%)`;
        indicators.querySelectorAll('.indicator').forEach((ind, idx) => ind.classList.toggle('active', idx === currentModalSlide));
      });
      indicators.appendChild(dot);
    });

    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Slide state
    let currentModalSlide = 0;

    function updateButtons() {
      indicators.querySelectorAll('.indicator').forEach((ind, idx) => ind.classList.toggle('active', idx === currentModalSlide));
      track.style.transform = `translateX(-${currentModalSlide * 100}%)`;
    }

    // Attach controls (replace handlers to avoid doubling)
    if (prevBtn) {
      prevBtn.onclick = () => {
        currentModalSlide = (currentModalSlide - 1 + imgs.length) % imgs.length;
        updateButtons();
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        currentModalSlide = (currentModalSlide + 1) % imgs.length;
        updateButtons();
      };
    }

    if (closeBtn) {
      closeBtn.onclick = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      };
    }

    // Close on backdrop
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    };

    // Keyboard navigation
    const keyHandler = (e) => {
      if (modal.style.display !== 'flex') return;
      if (e.key === 'Escape') { modal.style.display = 'none'; document.body.style.overflow = 'auto'; }
      if (e.key === 'ArrowLeft') { prevBtn?.click(); }
      if (e.key === 'ArrowRight') { nextBtn?.click(); }
    };
    document.addEventListener('keydown', keyHandler);

    // Clean up when modal closes (one simple cleanup attached to close)
    const cleanup = () => {
      document.removeEventListener('keydown', keyHandler);
      if (prevBtn) prevBtn.onclick = null;
      if (nextBtn) nextBtn.onclick = null;
      if (closeBtn) closeBtn.onclick = null;
      modal.onclick = null;
    };

    // Ensure cleanup when modal hidden via close button or backdrop
    const originalClose = closeBtn?.onclick;
    if (closeBtn) {
      closeBtn.onclick = () => { originalClose && originalClose(); cleanup(); };
    }

  } catch (e) {
    console.error('Error opening modal:', e);
  }
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
