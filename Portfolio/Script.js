
let currentSlide_index = 0;
document.addEventListener('DOMContentLoaded', function () {

    //fade-in animation
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

    //fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    

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

            const navMenu = document.getElementById("nav-menu");
            const menuToggle = document.querySelector('.menu-toggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove("active");
                if (menuToggle) {
                    menuToggle.classList.remove("active");
                }
            }
        });

        // Load the project data
        loadProjects().then(data => {
        if (Array.isArray(data)) {
            projects = data;
            createCarousel();
            createDots();
            showSlide(0);
        }
    });
    });

    // Menu toggle for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            navMenu.classList.toggle("active");
            menuToggle.classList.toggle("active");
        });

        document.addEventListener('click', function (e) {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove("active");
                menuToggle.classList.remove("active");
            }
        });
    }

    // Header text 
    setTimeout(() => {
        const headerText = document.querySelector('.header-text');
        if (headerText) {
            headerText.classList.add('visible');
        }
    }, 500);

    // Resume button functionality
    // const resumeBtn = document.querySelector('.Resume-btn');
    // if (resumeBtn) {
    //     resumeBtn.addEventListener('click', function () {
    //         const resumeUrl = '/Assets/docs/resume.pdf'; 
    //         window.open(resumeUrl, '_blank');
    //     });
    // }

    window.addEventListener('load', function () {
        document.body.classList.remove('loading');
    });


    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const header = document.getElementById('header');
        if (header) {
            const rate = scrolled * -0.5;
            header.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
    });


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

});

// ---------------------------Project Section Part using Json

async function loadProjects() {
    try {
        const response = await fetch('/data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading projects:', error);
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

function showSlide(index) {
    const carousel = document.getElementById('projectCarousel');
    const dots = document.querySelectorAll('.dot');

    if (!carousel || !dots.length) return;
    currentSlide = index;
    const translateX = -index * 100;
    carousel.style.transform = `translateX(${translateX}%)`;
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// carousel Button (next/previous)
function moveCarousel(direction) {
    let newSlide = currentSlide + direction;
    if (newSlide < 0) {
        newSlide = projects.length - 1;
    } else if (newSlide >= projects.length) {
        newSlide = 0;
    }
    showSlide(newSlide);
}