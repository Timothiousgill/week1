let currentSlide = 0;
let projects = [];

let items = [];
let index = 0;

const track = document.querySelector(".carousel__track");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

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
                if (entry.target.id === 'skills') {
                    setTimeout(() => animateSkillBars(), 500);
                }
            }
        });
    }, scrollAnimationOptions);

    // fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Skills animation
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }

    // Smooth scroll
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
            closeMobileMenu();
        });
    });

    // Mobile menu
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleMobileMenu();
        });

        navMenu.addEventListener('click', function (e) {
            if (e.target === navMenu) {
                closeMobileMenu();
            }
        });

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

    // Parallax effect
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const header = document.getElementById('header');
        if (header) {
            const rate = scrolled * -0.5;
            header.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
    });

    // Navigation background
    window.addEventListener('scroll', function () {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.style.backdropFilter = 'blur(10px)';
        } else {
            nav.style.background = 'transparent';
            nav.style.backdropFilter = 'none';
        }
    });

    // Initialize graphics carousel
    initializeGraphicsCarousel();
    
    // Initialize projects carousel
    initializeProjectsCarousel();

    // Remove loading state 
    window.addEventListener('load', function () {
        document.body.classList.remove('loading');
    });

    // Handle window resize
    window.addEventListener('resize', function () {
        const navMenu = document.getElementById("nav-menu");
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
});

// Graphics Carousel Functions
async function initializeGraphicsCarousel() {
    try {
        await loadImages();
        if (items.length > 0) {
            setupGraphicsCarouselButtons();
            updateGraphicsCarousel();
        }
    } catch (error) {
        console.error('Failed to initialize graphics carousel:', error);
    }
}

async function loadImages() {
    try {
        const response = await fetch('images.json');
        if (!response.ok) {
            throw new Error('Failed to load images');
        }
        const data = await response.json();
        
        // Clear existing content
        if (track) {
            track.innerHTML = '';
        }
        
        data.images.forEach(imgData => {
            const item = document.createElement("div");
            item.classList.add("carousel__item");
            const img = document.createElement("img");
            img.src = imgData.src;
            img.alt = imgData.alt;
            img.onerror = function() {
                this.src = 'Assets/failedImg.png';
            };
            item.appendChild(img);
            track.appendChild(item);
        });
        
        // Update items array
        items = document.querySelectorAll(".carousel__item");
        console.log(`Loaded ${items.length} carousel items`);
        
    } catch (error) {
        console.error("Error loading images:", error);
        createFallbackCarousel();
    }
}

function createFallbackCarousel() {
    if (!track) return;
    
    const fallbackImages = [
        { src: 'Graphics/img1.png', alt: 'Graphics 1' },
        { src: 'Graphics/img2.png', alt: 'Graphics 2' },
        { src: 'Graphics/img3.png', alt: 'Graphics 3' }
    ];
    
    track.innerHTML = '';
    
    fallbackImages.forEach(imgData => {
        const item = document.createElement("div");
        item.classList.add("carousel__item");
        const img = document.createElement("img");
        img.src = imgData.src;
        img.alt = imgData.alt;
        img.onerror = function() {
            this.src = 'Assets/failedImg.png';
        };
        item.appendChild(img);
        track.appendChild(item);
    });
    
    items = document.querySelectorAll(".carousel__item");
}

function setupGraphicsCarouselButtons() {
    if (!nextBtn || !prevBtn || items.length === 0) {
        console.warn('Graphics carousel buttons or items not found');
        return;
    }
    
    // Next button
    nextBtn.addEventListener("click", () => {
        const itemsVisible = getVisibleItemsCount();
        const maxIndex = Math.max(0, items.length - itemsVisible);
        
        if (index < maxIndex) {
            index++;
            updateGraphicsCarousel();
        }
    });

    // Previous button
    prevBtn.addEventListener("click", () => {
        if (index > 0) {
            index--;
            updateGraphicsCarousel();
        }
    });
    
    // Initial setup
    updateGraphicsCarousel();
}

function getVisibleItemsCount() {
    // Determine how many items are visible based on screen size
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) return 1;      // Mobile: 1 item
    if (screenWidth < 1024) return 2;     // Tablet: 2 items
    return 3;                             // Desktop: 3 items
}

function updateGraphicsCarousel() {
    if (!items || items.length === 0 || !track) return;
    
    const itemsVisible = getVisibleItemsCount();
    const itemWidth = 100 / itemsVisible;
    const offset = -(index * itemWidth);
    
    track.style.transform = `translateX(${offset}%)`;
    
    // Apply center focus effect only for desktop (3 items visible)
    if (itemsVisible === 3) {
        applyCarouselFocusEffect();
    } else {
        // Reset all items for mobile/tablet view
        resetCarouselItems();
    }
    
    // Update button states
    updateGraphicsButtonStates();
}

function applyCarouselFocusEffect() {
    // Reset all items first
    items.forEach((item, i) => {
        const img = item.querySelector('img');
        if (img) {
            // Remove all classes
            item.classList.remove('carousel-center', 'carousel-side');
            
            // Reset transforms and opacity
            img.style.transform = 'scale(1)';
            img.style.opacity = '1';
            img.style.transition = 'all 0.5s ease';
        }
    });
    
    // Apply focus effect based on current index
    const centerIndex = index + 1; // Middle item in the visible set
    
    items.forEach((item, i) => {
        const img = item.querySelector('img');
        if (!img) return;
        
        if (i >= index && i < index + 3) {
            // This item is visible
            if (i === centerIndex) {
                // Center item - scale up
                item.classList.add('carousel-center');
                img.style.transform = 'scale(1.15)';
                img.style.opacity = '1';
                img.style.zIndex = '10';
            } else {
                // Side items - fade out slightly
                item.classList.add('carousel-side');
                img.style.transform = 'scale(0.95)';
                img.style.opacity = '0.7';
                img.style.zIndex = '5';
            }
        } else {
            // Hidden items
            img.style.transform = 'scale(1)';
            img.style.opacity = '1';
            img.style.zIndex = '1';
        }
    });
}

function resetCarouselItems() {
    // Reset all transformations for mobile/tablet view
    items.forEach((item) => {
        const img = item.querySelector('img');
        if (img) {
            item.classList.remove('carousel-center', 'carousel-side');
            img.style.transform = 'scale(1)';
            img.style.opacity = '1';
            img.style.zIndex = '1';
            img.style.transition = 'all 0.3s ease';
        }
    });
}

function updateGraphicsButtonStates() {
    if (!nextBtn || !prevBtn) return;
    
    const itemsVisible = getVisibleItemsCount();
    const maxIndex = Math.max(0, items.length - itemsVisible);
    
    // Previous button
    prevBtn.disabled = (index <= 0);
    prevBtn.style.opacity = (index <= 0) ? '0.5' : '1';
    prevBtn.style.cursor = (index <= 0) ? 'not-allowed' : 'pointer';
    
    // Next button
    nextBtn.disabled = (index >= maxIndex);
    nextBtn.style.opacity = (index >= maxIndex) ? '0.5' : '1';
    nextBtn.style.cursor = (index >= maxIndex) ? 'not-allowed' : 'pointer';
}

// Projects Carousel Functions
async function initializeProjectsCarousel() {
    try {
        const data = await loadProjects();
        if (Array.isArray(data) && data.length > 0) {
            projects = data;
        } else {
            // Fallback projects
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
        }
        createCarousel();
        createDots();
        showSlide(0);
    } catch (error) {
        console.error('Failed to initialize projects carousel:', error);
    }
}

async function loadProjects() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Failed to load projects');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.warn('Error loading projects:', error);
        return [];
    }
}

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

function showSlide(slideIndex) {
    const carousel = document.getElementById('projectCarousel');
    const dots = document.querySelectorAll('.dot');

    if (!carousel || !dots.length || !projects.length) return;
    
    currentSlide = slideIndex;
    const translateX = -slideIndex * 100;
    carousel.style.transform = `translateX(${translateX}%)`;
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === slideIndex);
    });
}

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

// Utility Functions
function animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate');
        }, index * 100);
    });
}

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
        
        const menuItems = navMenu.querySelectorAll('li');
        menuItems.forEach(item => {
            item.style.opacity = '';
            item.style.transform = '';
        });
    }
}

// Touch/Swipe Support for Projects
let startX = 0;
let endX = 0;

document.addEventListener('touchstart', function(e) {
    const projectCarousel = document.getElementById('projectCarousel');
    if (projectCarousel && projectCarousel.contains(e.target)) {
        startX = e.changedTouches[0].screenX;
    }
}, { passive: true });

document.addEventListener('touchend', function(e) {
    const projectCarousel = document.getElementById('projectCarousel');
    if (projectCarousel && projectCarousel.contains(e.target)) {
        endX = e.changedTouches[0].screenX;
        handleSwipe();
    }
}, { passive: true });

function handleSwipe() {
    const threshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            moveCarousel(1);  // Swipe left - next
        } else {
            moveCarousel(-1); // Swipe right - previous
        }
    }
}

// Handle window resize for graphics carousel
window.addEventListener('resize', function() {
    if (items.length > 0) {
        const itemsVisible = getVisibleItemsCount();
        const maxIndex = Math.max(0, items.length - itemsVisible);
        if (index > maxIndex) {
            index = maxIndex;
        }
        updateGraphicsCarousel();
    }
});