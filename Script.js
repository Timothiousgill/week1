let currentSlide = 0;
let projects = [];

let items = [];
let index = 0;

let autoScrollInterval = null;
let isAutoScrollPaused = false;
const autoScrollDelay = 1000; 

const track = document.querySelector(".carousel__track");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

document.addEventListener('DOMContentLoaded', function () {
    const scrollAnimationOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.id === 'skills') {
                    setTimeout(() => initializeSkills(), 500);
                }
            }
        });
    }, scrollAnimationOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }

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

    setTimeout(() => {
        const headerText = document.querySelector('.header-text');
        if (headerText) {
            headerText.classList.add('visible');
        }
    }, 500);

    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const header = document.getElementById('header');
        const nav = document.querySelector('nav');
        
        if (header) {
            const rate = scrolled * -0.3;
            header.style.transform = `translateY(${rate}px)`;
        }
        
        const parallaxElements = document.querySelectorAll('.skill-card, .experience-card, .project-card');
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top;
            const elementHeight = rect.height;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight && elementTop + elementHeight > 0) {
                const speed = (elementTop - windowHeight) * 0.1;
                element.style.transform = `translateY(${speed}px)`;
            }
        });
        
        if (nav) {
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(8, 8, 8, 0.95)';
                nav.style.backdropFilter = 'blur(15px)';
                nav.style.borderBottom = '1px solid rgba(14, 174, 198, 0.2)';
                nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
                nav.style.transition = 'all 0.3s ease';
            } else {
                nav.style.background = 'transparent';
                nav.style.backdropFilter = 'none';
                nav.style.borderBottom = 'none';
                nav.style.boxShadow = 'none';
            }
        }
    });

    initializeGraphicsCarousel();
    initializeProjectsCarousel();

    window.addEventListener('load', function () {
        document.body.classList.remove('loading');
    });

    window.addEventListener('resize', function () {
        const navMenu = document.getElementById("nav-menu");
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
});

async function initializeSkills() {
    try {
        const response = await fetch('skills.json');
        if (!response.ok) {
            throw new Error('Failed to load skills data');
        }
        const skillsData = await response.json();
        
        createSkillsGrid(skillsData);
        setupSkillAnimations();
    } catch (error) {
        console.error('Error loading skills:', error);
        createFallbackSkills();
    }
}

function createSkillsGrid(skillsData) {
    const skillsWrapper = document.querySelector('.skills-wrapper');
    if (!skillsWrapper) return;
    
    skillsWrapper.innerHTML = '';
    
    skillsData.forEach(category => {
        const skillCard = document.createElement('div');
        skillCard.className = 'skill-card';
        
        skillCard.innerHTML = `
            <div class="skill-icon">
                <i class="${category.icon}"></i>
            </div>
            <h3>${category.title}</h3>
            <div class="skills-list">
                ${category.skills.map(skill => `
                    <div class="skill-item">
                        <div class="skill-info">
                            <span class="skill-name">${skill.name}</span>
                            <span class="skill-percentage">${skill.level}%</span>
                        </div>
                        <div class="skill-bar">
                            <div class="skill-progress" style="width: 0%" data-width="${skill.level}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        skillsWrapper.appendChild(skillCard);
    });
}

function createFallbackSkills() {
    const skillsWrapper = document.querySelector('.skills-wrapper');
    if (!skillsWrapper) return;
    
    const fallbackSkills = [
        {
            id: "frontend",
            title: "Frontend Development",
            icon: "fas fa-code",
            skills: [
                { name: "HTML5 & CSS3", level: 90 },
                { name: "JavaScript", level: 85 },
                { name: "React.js", level: 82 }
            ]
        },
        {
            id: "backend",
            title: "Backend Development", 
            icon: "fas fa-server",
            skills: [
                { name: "Python", level: 92 },
                { name: "Django", level: 82 },
                { name: "MySQL", level: 78 }
            ]
        }
    ];
    
    createSkillsGrid(fallbackSkills);
}

function setupSkillAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.skill-card').forEach(card => {
        observer.observe(card);
    });
}

function animateSkillBars(skillCard) {
    const progressBars = skillCard.querySelectorAll('.skill-progress');
    
    progressBars.forEach((bar, index) => {
        setTimeout(() => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
        }, index * 100);
    });
}

function startAutoScroll() {
    if (autoScrollInterval) return;
    
    if (items.length === 0) return;
    
    autoScrollInterval = setInterval(() => {
        if (!isAutoScrollPaused) {
            nextGraphicsSlide();
        }
    }, autoScrollDelay);
}

function stopAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
}

function pauseAutoScroll() {
    isAutoScrollPaused = true;
}

function resumeAutoScroll() {
    isAutoScrollPaused = false;
}

function nextGraphicsSlide() {
    if (items.length === 0) return;
    
    const itemsVisible = getVisibleItemsCount();
    
    if (itemsVisible === 1) {
        index++;
        if (index >= items.length) {
            index = 0;
        }
    } else {
        const maxIndex = items.length - itemsVisible;
        
        if (maxIndex <= 0) {
            index++;
            if (index >= items.length) {
                index = 0;
            }
        } else {
            index++;
            if (index > maxIndex) {
                index = 0;
            }
        }
    }
    
    updateGraphicsCarousel();
}

function prevGraphicsSlide() {
    if (items.length === 0) return;
    
    const itemsVisible = getVisibleItemsCount();
    
    if (itemsVisible === 1) {
        index--;
        if (index < 0) {
            index = items.length - 1;
        }
    } else {
        const maxIndex = items.length - itemsVisible;
        
        if (maxIndex <= 0) {
            index--;
            if (index < 0) {
                index = items.length - 1;
            }
        } else {
            index--;
            if (index < 0) {
                index = maxIndex;
            }
        }
    }
    
    updateGraphicsCarousel();
}

async function initializeGraphicsCarousel() {
    try {
        await loadImages();
        if (items.length > 0) {
            setupGraphicsCarouselButtons();
            setupCarouselHoverEvents();
            updateGraphicsCarousel();
            setupVisibilityObserver();
        }
    } catch (error) {
        console.error('Failed to initialize graphics carousel:', error);
    }
}

function setupVisibilityObserver() {
    const carouselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startAutoScroll();
            } else {
                stopAutoScroll();
            }
        });
    }, { threshold: 0.1 });
    
    if (track) {
        carouselObserver.observe(track);
    }
}

function setupCarouselHoverEvents() {
    if (!track) return;
    
    track.addEventListener('mouseenter', pauseAutoScroll);
    track.addEventListener('mouseleave', resumeAutoScroll);
    
    if (nextBtn) {
        nextBtn.addEventListener('mouseenter', pauseAutoScroll);
        nextBtn.addEventListener('mouseleave', resumeAutoScroll);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('mouseenter', pauseAutoScroll);
        prevBtn.addEventListener('mouseleave', resumeAutoScroll);
    }
}

async function loadImages() {
    try {
        const response = await fetch('images.json');
        if (!response.ok) {
            throw new Error('Failed to load images');
        }
        const data = await response.json();
        
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
        
        items = document.querySelectorAll(".carousel__item");
        
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
        { src: 'Graphics/img3.png', alt: 'Graphics 3' },
        { src: 'Graphics/img4.png', alt: 'Graphics 4' },
        { src: 'Graphics/img5.png', alt: 'Graphics 5' }
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
    if (!nextBtn || !prevBtn || items.length === 0) return;
    
    nextBtn.addEventListener("click", () => {
        pauseAutoScroll();
        nextGraphicsSlide();
        setTimeout(resumeAutoScroll, 3000);
    });

    prevBtn.addEventListener("click", () => {
        pauseAutoScroll();
        prevGraphicsSlide();
        setTimeout(resumeAutoScroll, 3000);
    });
 
    updateGraphicsCarousel();
}

function getVisibleItemsCount() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) return 1;     
    if (screenWidth < 1024) return 2;    
    return 3;                             
}

function updateGraphicsCarousel() {
    if (!items || items.length === 0 || !track) return;
    
    const itemsVisible = getVisibleItemsCount();
    const itemWidth = 100 / itemsVisible;
    const offset = -(index * itemWidth);
    
    track.style.transform = `translateX(${offset}%)`;
    
    if (itemsVisible === 3) {
        applyCarouselFocusEffect();
    } else {
        resetCarouselItems();
    }
    
    updateGraphicsButtonStates();
}

function applyCarouselFocusEffect() {
    items.forEach((item) => {
        const img = item.querySelector('img');
        if (img) {
            item.classList.remove('carousel-center', 'carousel-side');
            img.style.transform = 'scale(1)';
            img.style.opacity = '1';
            img.style.transition = 'all 0.5s ease';
            img.style.zIndex = '1';
        }
    });
    
    const itemsVisible = getVisibleItemsCount();
    
    if (itemsVisible === 3) {
        const centerIndex = index + 1;
        
        for (let i = index; i < index + 3 && i < items.length; i++) {
            const item = items[i];
            const img = item.querySelector('img');
            
            if (!img) continue;
            
            if (i === centerIndex) {
                item.classList.add('carousel-center');
                img.style.transform = 'scale(1.15)';
                img.style.opacity = '1';
                img.style.zIndex = '10';
                img.style.boxShadow = '0 15px 35px rgba(14, 174, 198, 0.4)';
                img.style.border = '2px solid rgba(14, 174, 198, 0.3)';
            } else {
                item.classList.add('carousel-side');
                img.style.transform = 'scale(0.95)';
                img.style.opacity = '0.7';
                img.style.zIndex = '5';
                img.style.filter = 'brightness(0.8)';
            }
        }
    }
}

function resetCarouselItems() {
    items.forEach((item) => {
        const img = item.querySelector('img');
        if (img) {
            item.classList.remove('carousel-center', 'carousel-side');
            img.style.transform = 'scale(1)';
            img.style.opacity = '1';
            img.style.zIndex = '1';
            img.style.transition = 'all 0.3s ease';
            img.style.boxShadow = '';
            img.style.border = '';
            img.style.filter = '';
        }
    });
}

function updateGraphicsButtonStates() {
    if (!nextBtn || !prevBtn) return;
    
    prevBtn.disabled = false;
    prevBtn.style.opacity = '1';
    prevBtn.style.cursor = 'pointer';
    
    nextBtn.disabled = false;
    nextBtn.style.opacity = '1';
    nextBtn.style.cursor = 'pointer';
}

async function initializeProjectsCarousel() {
    try {
        const data = await loadProjects();
        if (Array.isArray(data) && data.length > 0) {
            projects = data;
        } else {
            projects = [
                {
                    title: "Eye Tracking WheelChair - IOT, Machine Learning, React, Python, Node js",
                    image: "Assets/fyp.jpg"
                },
                {
                    title: "Face Detection - Python, Deep Learning, OpenCV", 
                    image: "https://miro.medium.com/v2/resize:fit:1200/1*a6kXOpZQ4abIk0EfIkKOpw.jpeg"
                },
                {
                    title: "The Hunter - FPS Game - GD Script and C# using Godot Game Engine",
                    image: "Assets/the_hunter_fps_game_by_Timothious.png"
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
            moveCarousel(1);
        } else {
            moveCarousel(-1);
        }
    }
}

window.addEventListener('resize', function() {
    if (items.length > 0) {
        const itemsVisible = getVisibleItemsCount();
        
        if (itemsVisible === 1) {
            if (index >= items.length) {
                index = 0;
            }
        } else {
            const maxIndex = Math.max(0, items.length - itemsVisible);
            if (index > maxIndex) {
                index = maxIndex;
            }
        }
        
        updateGraphicsCarousel();
    }
});

window.addEventListener('beforeunload', function() {
    stopAutoScroll();
});