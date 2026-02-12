// Omen Projects - Enhanced JavaScript
// Full interactivity with animations, scroll effects, and dynamic content

const servicesUrl = window.SERVICES_JSON || 'data/services.json';
const projectsUrl = window.PROJECTS_JSON || 'data/projects.json';

// Utility: Normalize images for a project object
function normalizeImages(project) {
  if (!project) return [];
  if (Array.isArray(project.images)) {
    return project.images.filter(Boolean);
  }
  if (typeof project.image === 'string') {
    return [project.image];
  }
  // Fallback: no images
  return [];
}

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
        });
      }
    
    


// ===== LOAD SERVICES =====
async function loadServices(projectsArray) {
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

            const imgs = normalizeImages(project);
            imgs.forEach(src => {
              const imgEl = document.createElement('img');
              imgEl.src = src || 'images/hero.svg';
              imgEl.alt = project.title;
              imgEl.loading = 'lazy';
              imgEl.decoding = 'async';
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

          // Click handled by event delegation below
      	});

  observeElements();
  // Hide page loader after all project images are loaded
  const pageLoader = document.getElementById('pageLoader');
  if (pageLoader) {
    const projectsList = document.getElementById('projectsList');
    const images = projectsList ? projectsList.querySelectorAll('img') : [];
    let loadedCount = 0;
    const total = images.length;
    let loaderHidden = false;
    function hideLoader() {
      if (loaderHidden) return;
      loaderHidden = true;
      pageLoader.classList.add('hidden');
      setTimeout(() => {
        pageLoader.style.display = 'none';
      }, 700);
    }
    // Fallback: always hide loader after 5 seconds
    setTimeout(hideLoader, 5000);
    if (total === 0) {
      hideLoader();
    } else {
      images.forEach(img => {
        if (img.complete) {
          loadedCount++;
          if (loadedCount === total) hideLoader();
        } else {
          img.addEventListener('load', () => {
            loadedCount++;
            if (loadedCount === total) hideLoader();
          });
          img.addEventListener('error', () => {
            loadedCount++;
            if (loadedCount === total) hideLoader();
          });
        }
      });
    }
    // Extra fallback: always hide loader after DOMContentLoaded + 6s
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(hideLoader, 6000);
    });
  }
}

// ===== LOAD PROJECTS (fetches data and calls loadServices) =====
async function loadProjects() {
  try {
    const response = await fetch(projectsUrl);
    if (!response.ok) throw new Error('Failed to load projects data');
    const projectsArray = await response.json();
    await loadServices(projectsArray);
  } catch (e) {
    console.error('Error loading projects:', e);
    await loadServices([]); // fallback to empty
  }
}


// ===== PROJECT MODAL =====
async function openProjectModal(projectId) {
  // Use the homepage gallery modal
  const modal = document.getElementById('projects-gallery-modal');
  if (!modal) return;

  try {
    // Permanent project modal logic
    if (projectId === 'perm-1' || projectId === 'perm-2' || projectId === 'perm-3') {
      const track = document.getElementById('modalCarouselTrack');
      const indicators = document.getElementById('modalIndicators');
      const prevBtn = document.getElementById('modalPrev');
      const nextBtn = document.getElementById('modalNext');
      const closeBtn = modal.querySelector('.modal-close');
      if (!track || !indicators) return;
      track.innerHTML = '';
      // Find the card in the DOM
      const card = document.querySelector(`.project-card[onclick*='${projectId}']`);
      let imgs = [];
      let title = 'Permanent Project';
      let category = '';
      let description = '';
      if (card) {
        // Get images from card
        const imgEls = card.querySelectorAll('.card-track img');
        imgs = Array.from(imgEls).map(img => img.src);
        // Get title, category, description
        const info = card.querySelector('.project-info');
        if (info) {
          const h3 = info.querySelector('h3');
          const cat = info.querySelector('.project-category');
          const p = info.querySelector('p');
          if (h3) title = h3.textContent;
          if (cat) category = cat.textContent;
          if (p) description = p.textContent;
        }
      }
      imgs.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${title} Image ${i+1}`;
        img.loading = 'lazy';
        img.decoding = 'async';
        track.appendChild(img);
      });
      indicators.innerHTML = '';
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
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      const modalTitle = modal.querySelector('#modalProjectTitle');
      if (modalTitle) modalTitle.textContent = title;

      // Slide state
      let currentModalSlide = 0;
      function updateButtons() {
        indicators.querySelectorAll('.indicator').forEach((ind, idx) => ind.classList.toggle('active', idx === currentModalSlide));
        track.style.transform = `translateX(-${currentModalSlide * 100}%)`;
      }
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
          modal.classList.remove('active');
          document.body.style.overflow = 'auto';
        };
      }
      modal.onclick = (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = 'auto';
        }
      };
      // Keyboard navigation
      const keyHandler = (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') { modal.classList.remove('active'); document.body.style.overflow = 'auto'; }
        if (e.key === 'ArrowLeft') { prevBtn?.click(); }
        if (e.key === 'ArrowRight') { nextBtn?.click(); }
      };
      document.addEventListener('keydown', keyHandler);
      // Clean up when modal closes
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
      const originalBackdrop = modal.onclick;
      modal.onclick = (e) => {
        if (e.target === modal) {
          originalBackdrop && originalBackdrop(e);
          cleanup();
        }
      };
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
  loadProjects();
  bindCarouselControls();

  // Event delegation for all project cards (permanent and CMS)
  const projectsList = document.getElementById('projectsList');
  if (projectsList) {
    projectsList.addEventListener('click', function(e) {
      const card = e.target.closest('.project-card');
      if (!card) return;
      // Only trigger for cards that are not disabled
      if (card.style.cursor === 'default') return;
      // Get images from card
      const imgEls = card.querySelectorAll('.card-track img');
      const images = Array.from(imgEls).map(img => img.getAttribute('src'));
      // Get title
      const titleEl = card.querySelector('.project-info h3');
      const title = titleEl ? titleEl.textContent.trim() : 'Project Gallery';
      // Open modal gallery
      if (images.length > 0 && window.openProjectGalleryModal) {
        window.openProjectGalleryModal(images, title);
      }
    });
  }

  // Observe initial elements
  observeElements();
});
