// Header scroll effect
function handleScroll() {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

        // Smooth scroll navigation
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
            });
        });

        // Testimonials Carousel
        let currentSlideIndex = 1;
        const totalSlides = 6;

        function showSlide(n) {
            const slides = document.querySelectorAll('.testimonial-slide');
            const dots = document.querySelectorAll('.carousel-dot');
            
            if (n > totalSlides) currentSlideIndex = 1;
            if (n < 1) currentSlideIndex = totalSlides;
            
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[currentSlideIndex - 1].classList.add('active');
            dots[currentSlideIndex - 1].classList.add('active');
        }

        function nextSlide() {
            currentSlideIndex++;
            showSlide(currentSlideIndex);
        }

        function previousSlide() {
            currentSlideIndex--;
            showSlide(currentSlideIndex);
        }

        function currentSlide(n) {
            currentSlideIndex = n;
            showSlide(currentSlideIndex);
        }

        // Auto-advance carousel
        setInterval(nextSlide, 5000);

        // FAQ toggle
        function toggleFaq(element) {
            const answer = element.nextElementSibling;
            const icon = element.querySelector('.faq-icon');
            
            // Close all other FAQs
            document.querySelectorAll('.faq-answer').forEach(faq => {
                if (faq !== answer && faq.classList.contains('active')) {
                    faq.classList.remove('active');
                    faq.previousElementSibling.querySelector('.faq-icon').classList.remove('rotated');
                }
            });
            
            // Toggle current FAQ
            answer.classList.toggle('active');
            icon.classList.toggle('rotated');
        }

        // Scroll reveal animation
        function revealElements() {
            const reveals = document.querySelectorAll('.reveal');
            
            reveals.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('active');
                }
            });
        }

        // Add glow effects on scroll
        function addGlowEffects() {
            const glowElements = document.querySelectorAll('.benefit-card, .step');
            
            glowElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 200;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('glow');
                }
            });
        }

        // Event listeners
        window.addEventListener('scroll', () => {
            handleScroll();
            revealElements();
            addGlowEffects();
        });

        // Initial reveal check
        document.addEventListener('DOMContentLoaded', () => {
            // Ensure all content is visible
            document.body.style.visibility = 'visible';
            document.body.style.opacity = '1';
            
            revealElements();
            addGlowEffects();
            
            // Track CTA clicks
            const ctaButtons = document.querySelectorAll('.btn, .header-cta, .whatsapp-float');
            ctaButtons.forEach(button => {
                button.addEventListener('click', () => {
                    console.log('CTA clicked:', button.textContent || 'WhatsApp Float');
                });
            });
        });

        // Add dynamic glow to text elements
        function addTextGlow() {
            const textElements = document.querySelectorAll('.section-title, .hero-text h1 .highlight');
            textElements.forEach(element => {
                element.classList.add('text-glow');
            });
        }

        // Initialize text glow
        document.addEventListener('DOMContentLoaded', addTextGlow);

        // Prevent right-click on images
        document.addEventListener('contextmenu', function(e) {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });

        // Keyboard navigation for carousel
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                previousSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });