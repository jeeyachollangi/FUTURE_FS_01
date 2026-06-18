/* ==========================================================================
   Jeeya Chollangi Portfolio JavaScript - Interactive Elements
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. CUSTOM CURSOR
  // ==========================================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');
  
  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;
  
  // Update mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position dot immediately
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });
  
  // Animate outline with interpolation (lerp) for smooth trailing effect
  function animateOutline() {
    // 0.15 is the easing factor
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    
    requestAnimationFrame(animateOutline);
  }
  requestAnimationFrame(animateOutline);
  
  // Add hover effects for interactive elements
  const hoverElements = document.querySelectorAll('.hover-trigger, a, button, input, textarea, .filter-btn, .project-card, .timeline-content, .cert-card');
  
  hoverElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursorOutline.classList.add('custom-cursor-hover');
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    element.addEventListener('mouseleave', () => {
      cursorOutline.classList.remove('custom-cursor-hover');
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });

  // ==========================================
  // 2. CANVAS PARTICLE SYSTEM (BACKGROUND)
  // ==========================================
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  
  let particlesArray = [];
  const numberOfParticles = 70;
  
  // Set canvas size
  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  setCanvasSize();
  window.addEventListener('resize', setCanvasSize);
  
  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1; // 1px to 3px
      this.speedX = Math.random() * 0.5 - 0.25; // -0.25 to 0.25
      this.speedY = Math.random() * 0.5 - 0.25;
      this.color = 'rgba(6, 182, 212, ' + (Math.random() * 0.3 + 0.1) + ')'; // Soft cyan
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Boundary check & loop particles around edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  
  // Initialize particles array
  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }
  initParticles();
  
  // Connect close particles with lines
  function connectParticles() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          opacityValue = 1 - (distance / 120);
          ctx.strokeStyle = 'rgba(99, 102, 241, ' + (opacityValue * 0.08) + ')'; // Soft indigo lines
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }
  
  // Particle loop
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    
    connectParticles();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ==========================================
  // 3. TYPING EFFECT
  // ==========================================
  const typingElement = document.getElementById('typing-element');
  const roles = ["Software Developer", "Python Programmer", "AI & ML Student", "MySQL Database Designer"];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  function typeAnimation() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Delete faster
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120; // Type natural pace
    }
    
    // Typing states logic
    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000; // Pause at the end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before typing next word
    }
    
    setTimeout(typeAnimation, typingSpeed);
  }
  setTimeout(typeAnimation, 1000); // Start after 1 second

  // ==========================================
  // 4. MOBILE HAMBURGER MENU TOGGLE
  // ==========================================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  function toggleMobileMenu() {
    hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Toggle body overflow to prevent background scrolling when menu open
    if (navMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }
  
  hamburgerBtn.addEventListener('click', toggleMobileMenu);
  
  // Close menu when clicking a nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // ==========================================
  // 5. STICKY HEADER & SCROLL BEHAVIOR
  // ==========================================
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top');
  
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    // Header shadow/blur class toggler
    if (scrollPos > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Back to top button visibility toggler
    if (scrollPos > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
    
    // Active navigation item highlighting on scroll
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
  
  // Back to top action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 6. SCROLL REVEAL (INTERSECTION OBSERVER)
  // ==========================================
  const scrollRevealItems = document.querySelectorAll('.scroll-reveal');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        // Stop observing once revealed to maintain state
        observer.unobserve(entry.target);
      }
    });
  };
  
  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null, // viewport
    threshold: 0.1, // 10% visibility trigger
    rootMargin: '0px 0px -50px 0px' // Offset triggers slightly
  });
  
  scrollRevealItems.forEach(item => {
    revealObserver.observe(item);
  });

  // ==========================================
  // 7. ANIMATED SKILL BARS
  // ==========================================
  const skillBars = document.querySelectorAll('.skill-bar-inner');
  const skillsContainer = document.querySelector('.skills-bars-container');
  
  const animateSkills = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillBars.forEach(bar => {
          const progress = bar.getAttribute('data-progress');
          bar.style.width = progress;
        });
        observer.unobserve(entry.target);
      }
    });
  };
  
  const skillsObserver = new IntersectionObserver(animateSkills, {
    threshold: 0.15
  });
  
  if (skillsContainer) {
    skillsObserver.observe(skillsContainer);
  }


  // ==========================================
  // 8. PROJECT FILTERS
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Manage active state classes
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
          // Trigger brief scroll reveal refresh to animate them back up nicely
          setTimeout(() => {
            card.classList.add('reveal');
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================
  // 9. FORM VALIDATION & SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('portfolio-contact-form');
  const formResponse = document.getElementById('form-response');
  const submitBtn = document.getElementById('form-submit-btn');
  const submitBtnText = submitBtn.querySelector('.btn-text');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent standard page reload
      
      // Basic client-side checks
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();
      
      if (!name || !email || !message) {
        showFormResponse('Please fill in all required fields.', 'error');
        return;
      }
      
      // Email format regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormResponse('Please enter a valid email address.', 'error');
        return;
      }
      
      // Change button state to "sending"
      submitBtn.disabled = true;
      submitBtnText.textContent = 'Sending...';
      const icon = submitBtn.querySelector('i');
      icon.className = 'fa-solid fa-spinner fa-spin'; // Spin animation
      
      // Simulate API payload request (1.5 seconds)
      setTimeout(() => {
        // Mock successful transaction
        showFormResponse(`Thank you, ${name}! Your message was sent successfully. Jeeya will get back to you shortly.`, 'success');
        
        // Reset form inputs
        contactForm.reset();
        
        // Reset button states
        submitBtn.disabled = false;
        submitBtnText.textContent = 'Send Message';
        icon.className = 'fa-regular fa-paper-plane';
      }, 1500);
    });
  }
  
  function showFormResponse(msg, status) {
    formResponse.textContent = msg;
    formResponse.className = 'form-response-msg ' + status;
    
    // Clear message after 6 seconds
    setTimeout(() => {
      formResponse.style.display = 'none';
      formResponse.className = 'form-response-msg';
    }, 6000);
  }
});
