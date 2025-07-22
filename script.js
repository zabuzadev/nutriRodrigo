// ========================================
// VARIÁVEIS GLOBAIS - MOBILE FIRST
// ========================================
let isCarouselPaused = false;
let scrollProgress = 0;
let typingTimeouts = [];
let currentFilter = 'all';
let currentSlide = 0;
let totalSlides = 8; // Total de cards únicos
let isManualMode = false;
let autoSlideInterval;
let manualTimeout;

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Performance optimization
const supportsPassive = (() => {
    let supportsPassive = false;
    try {
        addEventListener("test", null, Object.defineProperty({}, 'passive', {
            get: function () {
                supportsPassive = true;
            }
        }));
    } catch(e) {}
    return supportsPassive;
})();

// ========================================
// INICIALIZAÇÃO - MOBILE FIRST
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🥗 Rodrigo Nutrição - Inicializando...');
    console.log('📱 Mobile:', isMobile ? 'Sim' : 'Não');
    console.log('👆 Touch:', isTouch ? 'Sim' : 'Não');
    
    // Inicializar funcionalidades essenciais primeiro
    initializeLoadingScreen();
    initializeNavigation();
    initializeScrollProgress();
    
    // Depois as funcionalidades secundárias
    setTimeout(() => {
        initializeCounters();
        initializeTypingEffect();
        initializeCarousel();
        initializePlanToggle();
        initializeBackToTop();
        initializeIntersectionObserver();
        
        // Só em desktop
        if (!isMobile) {
            initializeParallax();
            initializeParticles();
        }
    }, 100);

    // Log de sucesso
    setTimeout(() => {
        console.log('✅ Site carregado com sucesso!');
        console.log('🎠 Carrossel:', totalSlides, 'slides');
        console.log('📊 Performance otimizada para mobile');
    }, 1000);
});

// ========================================
// LOADING SCREEN - OTIMIZADO
// ========================================
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simular carregamento mais rápido no mobile
    const loadTime = isMobile ? 1000 : 1500;
    
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            
            // Remover do DOM após animação para liberar memória
            setTimeout(() => {
                if (loadingScreen && loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                    console.log('🗑️ Loading screen removido do DOM');
                }
            }, 500);
        }
    }, loadTime);
}

// ========================================
// NAVEGAÇÃO - MOBILE FIRST
// ========================================
function initializeNavigation() {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Otimizar scroll no mobile
    let ticking = false;
    const handleScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    header?.classList.add('scrolled');
                } else {
                    header?.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', handleScroll, supportsPassive ? { passive: true } : false);

    // Menu mobile
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevenir scroll quando menu aberto
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        // Fechar menu ao clicar fora (apenas desktop)
        if (!isMobile) {
            document.addEventListener('click', (e) => {
                if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    closeMenu();
                }
            });
        }
    }

    // Navegação suave otimizada
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            
            // Smooth scroll
            if (target.startsWith('#')) {
                const element = document.querySelector(target);
                if (element) {
                    // Offset para header fixo (mobile menor)
                    const offsetTop = element.offsetTop - (isMobile ? 70 : 80);
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }

            // Fechar menu mobile
            closeMenu();
        });
    });

    function closeMenu() {
        menuToggle?.classList.remove('active');
        navMenu?.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ========================================
// BARRA DE PROGRESSO - OTIMIZADA
// ========================================
function initializeScrollProgress() {
    const progressBar = document.getElementById('progress-bar');
    
    if (!progressBar) return;

    let ticking = false;
    const updateProgress = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                scrollProgress = Math.min((scrollTop / scrollHeight) * 100, 100);
                
                progressBar.style.width = scrollProgress + '%';
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', updateProgress, supportsPassive ? { passive: true } : false);
}

// ========================================
// CONTADORES ANIMADOS - MOBILE OTIMIZADO
// ========================================
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = isMobile ? 1500 : 2000; // Mais rápido no mobile
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(Math.min(current, target));
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };

    // Intersection Observer otimizado para mobile
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { 
        threshold: isMobile ? 0.3 : 0.5,
        rootMargin: isMobile ? '50px' : '0px'
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// ========================================
// EFEITO DE DIGITAÇÃO - OTIMIZADO
// ========================================
function initializeTypingEffect() {
    const typedElements = document.querySelectorAll('[data-text]');
    
    typedElements.forEach(element => {
        const texts = element.getAttribute('data-text').split(',');
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const typeEffect = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                element.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                element.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            // Velocidade otimizada para mobile
            let typeSpeed = isDeleting ? 30 : (isMobile ? 80 : 100);
            
            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 1500; // Pausa menor no mobile
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 300;
            }
            
            const timeout = setTimeout(typeEffect, typeSpeed);
            typingTimeouts.push(timeout);
        };
        
        // Iniciar quando visível
        const typingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('typing-started')) {
                    entry.target.classList.add('typing-started');
                    setTimeout(typeEffect, 500); // Delay inicial menor
                }
            });
        }, { 
            threshold: 0.3,
            rootMargin: isMobile ? '100px' : '50px'
        });
        
        typingObserver.observe(element);
    });
}

// ========================================
// EFEITO PARALLAX - APENAS DESKTOP
// ========================================
function initializeParallax() {
    if (isMobile) return; // Não usar parallax no mobile por performance
    
    const parallaxElements = document.querySelectorAll('.parallax-element');
    const floatingElements = document.querySelectorAll('.float-element');
    
    let ticking = false;
    const handleParallax = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                parallaxElements.forEach(element => {
                    const speed = element.dataset.speed || 0.5;
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                });
                
                floatingElements.forEach((element, index) => {
                    const speed = parseFloat(element.dataset.speed) || 1;
                    const yPos = Math.sin(scrolled * 0.008 + index) * 15 * speed;
                    const xPos = Math.cos(scrolled * 0.006 + index) * 10 * speed;
                    element.style.transform = `translate(${xPos}px, ${yPos}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', handleParallax, supportsPassive ? { passive: true } : false);
}

// ========================================
// CAROUSEL - MOBILE FIRST COM TOUCH
// ========================================
function initializeCarousel() {
    const carouselTrack = document.getElementById('carousel-track');
    const carouselContainer = document.querySelector('.carousel-container');
    const progressFill = document.querySelector('.progress-fill');
    
    if (!carouselTrack) return;

    // Touch support para mobile
    let startX = 0;
    let isDragging = false;
    let currentTransform = 0;

    if (isTouch && carouselContainer) {
        carouselContainer.addEventListener('touchstart', handleTouchStart, supportsPassive ? { passive: true } : false);
        carouselContainer.addEventListener('touchmove', handleTouchMove, supportsPassive ? { passive: false } : false);
        carouselContainer.addEventListener('touchend', handleTouchEnd, supportsPassive ? { passive: true } : false);
    }

    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
        enableManualMode();
    }

    function handleTouchMove(e) {
        if (!isDragging) return;
        
        e.preventDefault(); // Prevenir scroll
        const currentX = e.touches[0].clientX;
        const diffX = startX - currentX;
        
        if (Math.abs(diffX) > 10) { // Threshold para evitar cliques acidentais
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            isDragging = false;
        }
    }

    function handleTouchEnd() {
        isDragging = false;
    }

    // Inicializar carrossel automático
    startAutoSlide();

    // Hover effects apenas desktop
    if (!isMobile && carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            if (!isCarouselPaused && !isManualMode) {
                pauseAutoSlide();
            }
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            if (!isCarouselPaused && !isManualMode) {
                resumeAutoSlide();
            }
        });
    }

    // Hover effects nos cards
    const successCards = document.querySelectorAll('.success-card');
    successCards.forEach(card => {
        if (!isMobile) {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(-10px) scale(1)';
            });
        }

        // Click para ver detalhes
        card.addEventListener('click', () => {
            const result = card.querySelector('h4')?.textContent || 'Caso de Sucesso';
            showSuccessDetail(result);
        });
    });
}

// Funções do carrossel
function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    
    // Intervalo menor no mobile
    const interval = isMobile ? 4000 : 5000;
    
    autoSlideInterval = setInterval(() => {
        if (!isCarouselPaused && !isManualMode) {
            nextSlide();
        }
    }, interval);
}

function pauseAutoSlide() {
    const carouselTrack = document.getElementById('carousel-track');
    const progressFill = document.querySelector('.progress-fill');
    
    if (carouselTrack) carouselTrack.style.animationPlayState = 'paused';
    if (progressFill) progressFill.style.animationPlayState = 'paused';
}

function resumeAutoSlide() {
    const carouselTrack = document.getElementById('carousel-track');
    const progressFill = document.querySelector('.progress-fill');
    
    if (carouselTrack) carouselTrack.style.animationPlayState = 'running';
    if (progressFill) progressFill.style.animationPlayState = 'running';
}

function nextSlide() {
    enableManualMode();
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarouselPosition();
}

function prevSlide() {
    enableManualMode();
    currentSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
    updateCarouselPosition();
}

function enableManualMode() {
    const carouselTrack = document.getElementById('carousel-track');
    
    isManualMode = true;
    clearInterval(autoSlideInterval);
    
    if (carouselTrack) {
        carouselTrack.classList.add('manual-mode');
        carouselTrack.style.animationPlayState = 'paused';
    }
    
    // Voltar ao automático após inatividade
    if (manualTimeout) clearTimeout(manualTimeout);
    manualTimeout = setTimeout(() => {
        disableManualMode();
    }, isMobile ? 8000 : 10000); // Menos tempo no mobile
}

function disableManualMode() {
    const carouselTrack = document.getElementById('carousel-track');
    
    isManualMode = false;
    
    if (carouselTrack) {
        carouselTrack.classList.remove('manual-mode');
        if (!isCarouselPaused) {
            carouselTrack.style.animationPlayState = 'running';
        }
    }
    
    startAutoSlide();
}

function updateCarouselPosition() {
    const carouselTrack = document.getElementById('carousel-track');
    if (!carouselTrack) return;
    
    // Largura do card otimizada para mobile
    const cardWidth = isMobile ? 295 : 340; // 280px card + 15px gap mobile
    const offset = -(currentSlide * cardWidth);
    carouselTrack.style.transform = `translateX(${offset}px)`;
}

// Controles do carrossel
function pauseCarousel() {
    const carouselTrack = document.getElementById('carousel-track');
    const progressFill = document.querySelector('.progress-fill');
    const pauseBtn = document.querySelector('.pause-btn');
    const playBtn = document.querySelector('.play-btn');
    
    isCarouselPaused = true;
    clearInterval(autoSlideInterval);
    
    if (carouselTrack) carouselTrack.style.animationPlayState = 'paused';
    if (progressFill) progressFill.style.animationPlayState = 'paused';
    
    // Trocar botões
    if (pauseBtn) pauseBtn.style.display = 'none';
    if (playBtn) playBtn.style.display = 'flex';
}

function resumeCarousel() {
    const carouselTrack = document.getElementById('carousel-track');
    const progressFill = document.querySelector('.progress-fill');
    const pauseBtn = document.querySelector('.pause-btn');
    const playBtn = document.querySelector('.play-btn');
    
    isCarouselPaused = false;
    
    if (!isManualMode) {
        if (carouselTrack) carouselTrack.style.animationPlayState = 'running';
        if (progressFill) progressFill.style.animationPlayState = 'running';
        startAutoSlide();
    }
    
    // Trocar botões
    if (pauseBtn) pauseBtn.style.display = 'flex';
    if (playBtn) playBtn.style.display = 'none';
}

function showSuccessDetail(result) {
    const message = `🎯 Resultado: ${result}\n\n✨ Em breve você poderá ver mais detalhes sobre esta incrível transformação!\n\n📱 Para mais informações e começar sua jornada, entre em contato pelo WhatsApp.`;
    
    if (isMobile && navigator.vibrate) {
        navigator.vibrate(100); // Feedback tátil no mobile
    }
    
    alert(message);
}

// ========================================
// TOGGLE DE PLANOS - MOBILE OTIMIZADO
// ========================================
function initializePlanToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const planTypes = document.querySelectorAll('.plan-type');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Feedback tátil no mobile
            if (isMobile && navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            // Atualizar botão ativo
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Mostrar plano correspondente com animação
            const planType = btn.getAttribute('data-plan');
            
            planTypes.forEach(plan => {
                plan.classList.remove('active');
                if (plan.classList.contains(planType)) {
                    setTimeout(() => {
                        plan.classList.add('active');
                    }, 150); // Pequeno delay para animação suave
                }
            });
        });
    });
}

// ========================================
// BOTÃO VOLTAR AO TOPO - MOBILE OTIMIZADO
// ========================================
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (!backToTopBtn) return;

    let ticking = false;
    const handleScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const showThreshold = isMobile ? 200 : 300;
                if (window.scrollY > showThreshold) {
                    backToTopBtn.classList.add('show');
                } else {
                    backToTopBtn.classList.remove('show');
                }
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', handleScroll, supportsPassive ? { passive: true } : false);
}

function scrollToTop() {
    // Feedback tátil no mobile
    if (isMobile && navigator.vibrate) {
        navigator.vibrate(100);
    }
    
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ========================================
// MODAIS - MOBILE FRIENDLY
// ========================================
function openVideoModal() {
    const modal = document.getElementById('video-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Feedback tátil no mobile
        if (isMobile && navigator.vibrate) {
            navigator.vibrate(100);
        }
    }
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ========================================
// INTERSECTION OBSERVER - OTIMIZADO
// ========================================
function initializeIntersectionObserver() {
    // Observer para animações com configurações mobile
    const animateOnScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { 
        threshold: isMobile ? 0.1 : 0.2,
        rootMargin: isMobile ? '50px' : '0px'
    });

    // Observer para elementos que devem animar
    const elementsToAnimate = document.querySelectorAll('.truth-card, .process-step, .feature-item');
    elementsToAnimate.forEach(element => {
        animateOnScrollObserver.observe(element);
    });

    // Lazy loading otimizado para mobile
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: isMobile ? '100px' : '50px'
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ========================================
// SISTEMA DE PARTÍCULAS - APENAS DESKTOP
// ========================================
function initializeParticles() {
    if (isMobile) return; // Não usar no mobile por performance
    
    const particlesContainer = document.querySelector('.hero-particles');
    if (!particlesContainer) return;

    // Criar menos partículas para melhor performance
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 15 + 10}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }

    // CSS para animação das partículas
    if (!document.querySelector('#particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% { 
                    transform: translateY(0px) translateX(0px) rotate(0deg);
                    opacity: 0.1;
                }
                25% { 
                    transform: translateY(-80px) translateX(40px) rotate(90deg);
                    opacity: 0.8;
                }
                50% { 
                    transform: translateY(-40px) translateX(-40px) rotate(180deg);
                    opacity: 0.4;
                }
                75% { 
                    transform: translateY(-120px) translateX(20px) rotate(270deg);
                    opacity: 0.6;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// UTILS E HELPERS - MOBILE OTIMIZADO
// ========================================

// Debounce otimizado
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle otimizado
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Verificar se elemento está visível
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Abrir WhatsApp com mensagem personalizada
function openWhatsApp(planType = 'nutricional') {
    const phone = '5511999999999'; // ⚠️ ALTERE ESTE NÚMERO PARA O REAL
    const messages = {
        'online': 'Olá! Tenho interesse no Acompanhamento Online. Gostaria de mais informações sobre o plano e como começar.',
        'presencial': 'Olá! Tenho interesse no Acompanhamento Presencial. Gostaria de agendar uma consulta e saber sobre disponibilidade.',
        'nutricional': 'Olá! Tenho interesse no acompanhamento nutricional. Gostaria de mais informações sobre os planos disponíveis.'
    };
    
    const message = messages[planType] || messages['nutricional'];
    const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    // Feedback tátil no mobile
    if (isMobile && navigator.vibrate) {
        navigator.vibrate(100);
    }
    
    window.open(whatsappURL, '_blank');
}

// ========================================
// EVENT LISTENERS GLOBAIS - MOBILE OTIMIZADO
// ========================================

// Controles de teclado (apenas desktop)
if (!isMobile) {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeVideoModal();
        }
        
        // Controles do carrossel
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === ' ') {
            e.preventDefault();
            if (isCarouselPaused) {
                resumeCarousel();
            } else {
                pauseCarousel();
            }
        }
    });
}

// Fechar modais clicando fora
window.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// Listener de resize otimizado
const optimizedResizeHandler = debounce(() => {
    console.log('📱 Window resized, reajustando...');
    
    // Reajustar carrossel se necessário
    if (currentSlide > 0) {
        updateCarouselPosition();
    }
}, 250);

window.addEventListener('resize', optimizedResizeHandler);

// ========================================
// ERROR HANDLING E PERFORMANCE
// ========================================

// Error handling global
window.addEventListener('error', (e) => {
    console.error('❌ JavaScript Error:', e.error);
    console.error('📍 File:', e.filename, 'Line:', e.lineno);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = Math.round(perfData.loadEventEnd - perfData.loadEventStart);
            console.log('⚡ Page Load Time:', loadTime + 'ms');
            
            if (loadTime > 3000) {
                console.warn('⚠️ Slow loading detected. Consider optimizations.');
            } else {
                console.log('✅ Good performance!');
            }
        }, 0);
    });
}

// Memory cleanup
window.addEventListener('beforeunload', () => {
    // Limpar timeouts
    typingTimeouts.forEach(timeout => clearTimeout(timeout));
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    if (manualTimeout) clearTimeout(manualTimeout);
    
    console.log('🧹 Cleanup completed');
});

// ========================================
// SMOOTH SCROLL POLYFILL - FALLBACK
// ========================================
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollPolyfill = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - (isMobile ? 70 : 80);
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };
    smoothScrollPolyfill();
}

// ========================================
// FUNÇÕES AUXILIARES ESPECÍFICAS
// ========================================

// Mostrar detalhes do processo
function showProcessDetail(step) {
    const details = {
        1: "🔍 AVALIAÇÃO COMPLETA:\n\n• Anamnese detalhada personalizada\n• Análise completa de exames laboratoriais\n• Avaliação antropométrica profissional\n• Definição clara de objetivos realistas\n• Identificação de restrições e preferências",
        2: "🎯 ESTRATÉGIA INDIVIDUAL:\n\n• Cálculo preciso das necessidades nutricionais\n• Elaboração do plano alimentar personalizado\n• Seleção criteriosa de alimentos adequados\n• Definição de horários otimizados\n• Criação de cardápios variados e saborosos",
        3: "💬 SUPORTE DIÁRIO:\n\n• Acompanhamento constante via WhatsApp\n• Esclarecimento imediato de dúvidas\n• Ajustes quando necessário\n• Motivação e suporte psicológico\n• Resolução rápida de problemas",
        4: "🏆 TRANSFORMAÇÃO REAL:\n\n• Mudanças graduais e sustentáveis\n• Criação de novos hábitos saudáveis\n• Melhoria significativa da qualidade de vida\n• Resultados duradouros comprovados\n• Autonomia alimentar conquistada"
    };
    
    const detail = details[step] || "Detalhes do processo em desenvolvimento...";
    
    // Feedback tátil no mobile
    if (isMobile && navigator.vibrate) {
        navigator.vibrate(100);
    }
    
    alert(detail);
}

// Validar formulário (se necessário)
function validateForm(data) {
    if (data.name && data.name.length < 2) {
        alert('❌ Nome deve ter pelo menos 2 caracteres');
        return false;
    }
    
    if (data.email && !isValidEmail(data.email)) {
        alert('❌ Email inválido');
        return false;
    }
    
    if (data.phone && data.phone.length < 10) {
        alert('❌ Telefone inválido');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========================================
// INICIALIZAÇÃO FINAL E LOG
// ========================================

// Log final de inicialização
setTimeout(() => {
    console.log('🎉 Rodrigo Nutrição - Site totalmente carregado!');
    console.log('📊 Estatísticas:');
    console.log(`   • Mobile: ${isMobile}`);
    console.log(`   • Touch: ${isTouch}`);
    console.log(`   • Carrossel: ${totalSlides} slides`);
    console.log(`   • Performance: Otimizado`);
    console.log('🚀 Pronto para conversões!');
}, 2000);

// Export das funções principais para uso global
window.rodrigoNutricao = {
    openVideoModal,
    closeVideoModal,
    scrollToTop,
    openWhatsApp,
    showProcessDetail,
    pauseCarousel,
    resumeCarousel,
    nextSlide,
    prevSlide
};