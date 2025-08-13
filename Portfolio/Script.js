document.addEventListener('DOMContentLoaded', function() {
    
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
    });
    
    // Menu toggle for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById("nav-menu");
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            navMenu.classList.toggle("active");
            menuToggle.classList.toggle("active");
        });

        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove("active");
                menuToggle.classList.remove("active");
            }
        });
    }
    
    // Header text animation - initial fade in
    setTimeout(() => {
        const headerText = document.querySelector('.header-text');
        if (headerText) {
            headerText.classList.add('visible');
        }
    }, 500);
    
    // Resume button functionality
    const resumeBtn = document.querySelector('.Resume-btn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', function() {
            // const resumeUrl = 'Assets/resume.pdf'; 
            // window.open(resumeUrl, '_blank');
     
            alert('Resume Have not implemented yet.');
        });
    }
    
    window.addEventListener('load', function() {
        document.body.classList.remove('loading');
    });
    

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const header = document.getElementById('header');
        if (header) {
            const rate = scrolled * -0.5;
            header.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
    });
    

    window.addEventListener('scroll', function() {
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