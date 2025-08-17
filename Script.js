let currentSlide = 0;
let projects = [];

document.addEventListener('DOMContentLoaded', function () {
    // Fade-in animation
    const scrollAnimationOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, scrollAnimationOptions);

    // Observe fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }

            // Close mobile menu after clicking a navigation link
            closeMobileMenu();
        });
    });

    // Mobile menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleMobileMenu();
        });

        // Close menu when clicking outside or on the overlay
        navMenu.addEventListener('click', function (e) {
            // If clicking on the menu background (not on menu items), close the menu
            if (e.target === navMenu) {
                closeMobileMenu();
            }
        });

        // Close menu when pressing Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // Header text animation
    setTimeout(() => {
        const headerText = document.querySelector('.header-text');
        if (headerText) {
            headerText.classList.add('visible');
        }
    }, 500);

    // Parallax effect for header
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const header = document.getElementById('header');
        if (header) {
            const rate = scrolled * -0.5;
            header.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
    });

    // Navigation background on scroll
    window.addEventListener('scroll', function () {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(0, 0, 0, 0.9)';
            nav.style.backdropFilter = 'blur(10px)';
        } else {
            nav.style.background = 'transparent';
            nav.style.backdropFilter = 'none';
        }
    });

    // Load the project data and initialize carousel
    loadProjects().then(data => {
        if (Array.isArray(data) && data.length > 0) {
            projects = data;
            createCarousel();
            createDots();
            showSlide(0);
        } else {
            // Fallback: Create sample projects if JSON loading fails
            projects = [
                {
                    title: "E-Commerce Website",
                    image: "Assets/project1.jpg"
                },
                {
                    title: "Mobile Game App", 
                    image: "Assets/project2.jpg"
                },
                {
                    title: "AI Dashboard",
                    image: "Assets/project3.jpg"
                }
            ];
            createCarousel();
            createDots();
            showSlide(0);
        }
    });

    // Remove loading state when everything is loaded
    window.addEventListener('load', function () {
        document.body.classList.remove('loading');
    });

    // Prevent body scroll when mobile menu is open
    function toggleBodyScroll(disable) {
        if (disable) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // Handle window resize
    window.addEventListener('resize', function () {
        const navMenu = document.getElementById("nav-menu");
        const menuToggle = document.querySelector('.menu-toggle');
        
        // Close mobile menu on desktop
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
});

// Mobile menu functions
function toggleMobileMenu() {
    const navMenu = document.getElementById("nav-menu");
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (navMenu && menuToggle) {
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
}

function openMobileMenu() {
    const navMenu = document.getElementById("nav-menu");
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (navMenu && menuToggle) {
        navMenu.classList.add('active');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add staggered animation to menu items
        const menuItems = navMenu.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100 + 200);
        });
    }
}

function closeMobileMenu() {
    const navMenu = document.getElementById("nav-menu");
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (navMenu && menuToggle) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset menu items animation
        const menuItems = navMenu.querySelectorAll('li');
        menuItems.forEach(item => {
            item.style.opacity = '';
            item.style.transform = '';
        });
    }
}

// Project loading function
async function loadProjects() {
    try {
        const response = await fetch('/data.json');
        if (!response.ok) {
            throw new Error('Failed to load projects');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}

// Create carousel from projects data
function createCarousel() {
    const carousel = document.getElementById('projectCarousel');
    if (!carousel) return;

    carousel.innerHTML = '';

    projects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';

        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}" onerror="this.src='Assets/failedImg.png';">
            <div class="project-content">
                <h3>${project.title}</h3>
            </div>
        `;

        carousel.appendChild(projectCard);
    });
}

// Create navigation dots
function createDots() {
    const dotsContainer = document.getElementById('carouselDots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';

    projects.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.addEventListener('click', () => showSlide(index));
        dotsContainer.appendChild(dot);
    });
}

// Show specific slide
function showSlide(index) {
    const carousel = document.getElementById('projectCarousel');
    const dots = document.querySelectorAll('.dot');

    if (!carousel || !dots.length || !projects.length) return;
    
    currentSlide = index;
    const translateX = -index * 100;
    carousel.style.transform = `translateX(${translateX}%)`;
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// Move carousel (next/previous)
function moveCarousel(direction) {
    if (!projects.length) return;
    
    let newSlide = currentSlide + direction;
    if (newSlide < 0) {
        newSlide = projects.length - 1;
    } else if (newSlide >= projects.length) {
        newSlide = 0;
    }
    showSlide(newSlide);
}

// Touch/swipe support for mobile carousel
let startX = 0;
let endX = 0;

document.addEventListener('touchstart', function(e) {
    startX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    endX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const carousel = document.getElementById('projectCarousel');
    if (!carousel) return;
    
    const threshold = 50; // minimum distance for swipe
    const diff = startX - endX;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            // Swiped left - next slide
            moveCarousel(1);
        } else {
            // Swiped right - previous slide
            moveCarousel(-1);
        }
    }
}

// Auto-advance carousel (optional - uncomment if desired)
// let autoSlideInterval;
// 
// function startAutoSlide() {
//     if (projects.length > 1) {
//         autoSlideInterval = setInterval(() => {
//             moveCarousel(1);
//         }, 5000);
//     }
// }
// 
// function stopAutoSlide() {
//     if (autoSlideInterval) {
//         clearInterval(autoSlideInterval);
//     }
// }
// 
// // Start auto-slide on load
// window.addEventListener('load', startAutoSlide);
// 
// // Stop auto-slide when user interacts
// document.querySelector('.carousel-container')?.addEventListener('mouseenter', stopAutoSlide);
// document.querySelector('.carousel-container')?.addEventListener('mouseleave', startAutoSlide);