document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            const scrollContainer = document.querySelector('.content-scroll');
            
            if (targetElement && scrollContainer) {
                // Remove active class from all links
                document.querySelectorAll('.nav-menu .nav-item').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Scroll to target smoothly with offset
                const offsetTop = targetElement.offsetTop - 40; 
                scrollContainer.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer to update active navigation item based on scroll position
    const sections = document.querySelectorAll('.section');
    const scrollContainer = document.querySelector('.content-scroll');
    const navItems = document.querySelectorAll('.nav-menu .nav-item');

    if ('IntersectionObserver' in window && scrollContainer) {
        let options = {
            root: scrollContainer,
            rootMargin: '0px 0px -50% 0px',
            threshold: 0
        };

        let currentSectionRef = null;
        let isClicking = false; // flag to prevent override when clicking

        const observer = new IntersectionObserver((entries) => {
            if(isClicking) return;

            let mostVisible = null;
            let maxRatio = 0;

            entries.forEach(entry => {
                // Using a simple intersection update logic
                if (entry.isIntersecting) {
                   const id = entry.target.getAttribute('id');
                   navItems.forEach(item => {
                       item.classList.remove('active');
                       if (item.getAttribute('href') === '#' + id) {
                           item.classList.add('active');
                       }
                   });
                }
            });
        }, options);

        sections.forEach(section => {
            observer.observe(section);
        });
        
        // Disable observer updates while smooth scrolling from click
        navItems.forEach(anchor => {
            anchor.addEventListener('click', () => {
                isClicking = true;
                setTimeout(() => { isClicking = false; }, 800);
            });
        });
    }
    
    // Add cool hover effect on cards utilizing mouse position
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
