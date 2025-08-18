let currentSlide = 0;
let projects = [];
let skillsData = null;

document.addEventListener('DOMContentLoaded', function () {
    // Initialize skills 
    initializeSkillsSection();
    
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
                    setTimeout(() => animateSummaryNumbers(), 800);
                }
            }
        });
    }, scrollAnimationOptions);

    // Observe fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Slills animation
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }

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
        } else {
            // Create sample projects if JSON loading fails
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
    });

    // Remove loading state when everything is loaded
    window.addEventListener('load', function () {
        document.body.classList.remove('loading');
    });

    // Handle window resize
    window.addEventListener('resize', function () {
        const navMenu = document.getElementById("nav-menu");
        
        // Close mobile menu on desktop
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
});

// Initialize skills section - load data from skills.json
async function initializeSkillsSection() {
    try {
        // Load skills data from external JSON file
        const response = await fetch('skills.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        skillsData = await response.json();
        console.log('✅ Skills loaded successfully from skills.json');
    } catch (error) {
        console.error('❌ Failed to load skills.json:', error);
        console.log('📋 Please ensure skills.json exists in your project root directory');
        
        // Show error message to user
        showSkillsLoadError();
        return;
    }


    if (skillsData) {
        createSkillsSection();
        createSummarySection();
    }
}

// Show error message when skills.json fails to load
function showSkillsLoadError() {
    const skillsGrid = document.getElementById('skillsGrid');
    const skillsSummary = document.getElementById('skillsSummary');
    
    if (skillsGrid) {
        skillsGrid.innerHTML = `
            <div style="
                grid-column: 1 / -1; 
                text-align: center; 
                padding: 40px; 
                background: rgba(255, 255, 255, 0.05); 
                border-radius: 20px;
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.1);
            ">
                <h3 style="color: #0eaec6; margin-bottom: 20px;">Skills Data Loading Error</h3>
                <p style="color: #ccc; margin-bottom: 10px;">Could not load skills.json file.</p>
                <p style="color: #ccc; font-size: 14px;">Please ensure the skills.json file exists in your project directory.</p>
            </div>
        `;
    }
    
    if (skillsSummary) {
        skillsSummary.innerHTML = '';
    }
}

// Create skills section dynamically from JSON data
function createSkillsSection() {
    const skillsGrid = document.getElementById('skillsGrid');
    if (!skillsGrid || !skillsData) {
        console.error('Skills grid container not found or no skills data available');
        return;
    }

    skillsGrid.innerHTML = '';

    skillsData.skillCategories.forEach(category => {
        const skillCategory = document.createElement('div');
        skillCategory.className = 'skill-category fade-in';
        
        skillCategory.innerHTML = `
            <div class="category-header">
                <div class="category-icon">
                    <i class="${category.icon}"></i>
                </div>
                <h3>${category.title}</h3>
            </div>
            <div class="skills-list">
                ${category.skills.map(skill => `
                    <div class="skill-item" data-level="${skill.level}">
                        <div class="skill-info">
                            <span class="skill-name">${skill.name}</span>
                            <span class="skill-percentage">${skill.level}%</span>
                        </div>
                        <div class="skill-bar">
                            <div class="skill-progress" style="--width: ${skill.level}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        skillsGrid.appendChild(skillCategory);
    });

    console.log('✅ Skills section created successfully');
}

// Create summary section dynamically from JSON data
function createSummarySection() {
    const skillsSummary = document.getElementById('skillsSummary');
    if (!skillsSummary || !skillsData) {
        console.error('Skills summary container not found or no skills data available');
        return;
    }

    skillsSummary.innerHTML = '';

    skillsData.summary.forEach(item => {
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        
        const percentageHtml = item.hasPercentage ? '<span class="percentage-sign">%</span>' : '';
        
        summaryItem.innerHTML = `
            <div class="summary-number" data-target="${item.value}">0${percentageHtml}</div>
            <div class="summary-label">${item.label}</div>
        `;

        skillsSummary.appendChild(summaryItem);
    });

    console.log('✅ Skills summary created successfully');
}

// Animate skill bars
function animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate');
        }, index * 100);
    });
}

// Animate summary numbers
function animateSummaryNumbers() {
    const numberElements = document.querySelectorAll('.summary-number');
    
    numberElements.forEach(element => {
        const target = parseInt(element.dataset.target);
        const hasPercentage = element.innerHTML.includes('%');
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            const displayValue = Math.floor(current);
            element.innerHTML = hasPercentage ? 
                `${displayValue}<span class="percentage-sign">%</span>` : 
                displayValue;
        }, 16);
    });
}

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

// Project loading 
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

// Move carousel
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

// Touch/swipe 
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
    
    const threshold = 50; 
    const diff = startX - endX;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            // Swipe left - next slide
            moveCarousel(1);
        } else {
            // Swipe right - previous slide
            moveCarousel(-1);
        }
    }
}