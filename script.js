// ========================================
// VARIÁVEIS GLOBAIS
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

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas as funcionalidades
    initializeNavigation();
    initializeLoadingScreen();
    initializeScrollProgress();
    initializeCounters();
    initializeTypingEffect();
    initializeParallax();
    initializeCarousel();
    initializePlanToggle();
    initializeBackToTop();
    initializeIntersectionObserver();
    initializeParticles();
});

// ========================================
// LOADING SCREEN
// ========================================
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simular carregamento
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        // Remover do DOM após animação
        setTimeout(() => {
            if (loadingScreen && loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
        }, 500);
    }, 1500);
}

// ========================================
// NAVEGAÇÃO
// ========================================
function initializeNavigation() {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll do header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Menu mobile
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Fechar menu ao clicar em link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            
            // Smooth scroll
            if (target.startsWith('#')) {
                const element = document.querySelector(target);
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }

            // Fechar menu mobile
            if (menuToggle) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (menuToggle && navMenu && !menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ========================================
// BARRA DE PROGRESSO
// ========================================
function initializeScrollProgress() {
    const progressBar = document.getElementById('progress-bar');

    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            scrollProgress = (scrollTop / scrollHeight) * 100;
            
            progressBar.style.width = scrollProgress + '%';
        });
    }
}

// ========================================
// CONTADORES ANIMADOS
// ========================================
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };

    // Intersection Observer para contadores
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// ========================================
// EFEITO DE DIGITAÇÃO
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
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }
            
            const timeout = setTimeout(typeEffect, typeSpeed);
            typingTimeouts.push(timeout);
        };
        
        // Iniciar efeito quando elemento estiver visível
        const typingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('typing-started')) {
                    entry.target.classList.add('typing-started');
                    typeEffect();
                }
            });
        }, { threshold: 0.5 });
        
        typingObserver.observe(element);
    });
}

// ========================================
// EFEITO PARALLAX
// ========================================
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Parallax para elementos flutuantes
    const floatingElements = document.querySelectorAll('.float-element');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        floatingElements.forEach((element, index) => {
            const speed = parseFloat(element.dataset.speed) || 1;
            const yPos = Math.sin(scrolled * 0.01 + index) * 20 * speed;
            const xPos = Math.cos(scrolled * 0.008 + index) * 15 * speed;
            element.style.transform = `translate(${xPos}px, ${yPos}px)`;
        });
    });
}

// ========================================
// CAROUSEL DE SUCESSOS COM NAVEGAÇÃO MANUAL
// ========================================
function initializeCarousel() {
    const carouselTrack = document.getElementById('carousel-track');
    const progressFill = document.querySelector('.progress-fill');
    
    if (!carouselTrack) return;

    // Inicializar carrossel automático
    startAutoSlide();

    // Pausar/Retomar carousel no hover
    const carouselContainer = document.querySelector('.carousel-container');
    
    if (carouselContainer) {
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

    // Adicionar hover effects aos cards
    const successCards = document.querySelectorAll('.success-card');
    successCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(-10px) scale(1)';
        });

        // Click para ver detalhes
        card.addEventListener('click', () => {
            const result = card.querySelector('h4').textContent;
            showSuccessDetail(result);
        });
    });
}

// Iniciar slide automático
function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    
    autoSlideInterval = setInterval(() => {
        if (!isCarouselPaused && !isManualMode) {
            nextSlide();
        }
    }, 5000); // Muda a cada 5 segundos
}

// Pausar slide automático
function pauseAutoSlide() {
    const carouselTrack = document.getElementById('carousel-track');
    const progressFill = document.querySelector('.progress-fill');
    
    if (carouselTrack) carouselTrack.style.animationPlayState = 'paused';
    if (progressFill) progressFill.style.animationPlayState = 'paused';
}

// Retomar slide automático
function resumeAutoSlide() {
    const carouselTrack = document.getElementById('carousel-track');
    const progressFill = document.querySelector('.progress-fill');
    
    if (carouselTrack) carouselTrack.style.animationPlayState = 'running';
    if (progressFill) progressFill.style.animationPlayState = 'running';
}

// Navegar para slide anterior
function prevSlide() {
    enableManualMode();
    currentSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
    updateCarouselPosition();
    updateIndicators();
}

// Navegar para próximo slide
function nextSlide() {
    enableManualMode();
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarouselPosition();
    updateIndicators();
}

// Ir para slide específico
function goToSlide(slideIndex) {
    enableManualMode();
    currentSlide = slideIndex;
    updateCarouselPosition();
    updateIndicators();
}

// Ativar modo manual
function enableManualMode() {
    const carouselTrack = document.getElementById('carousel-track');
    
    isManualMode = true;
    clearInterval(autoSlideInterval);
    
    if (carouselTrack) {
        carouselTrack.classList.add('manual-mode');
        carouselTrack.style.animationPlayState = 'paused';
    }
    
    // Voltar ao automático após 10 segundos de inatividade
    if (manualTimeout) clearTimeout(manualTimeout);
    manualTimeout = setTimeout(() => {
        disableManualMode();
    }, 10000);
}

// Desativar modo manual
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

// Atualizar posição do carrossel
function updateCarouselPosition() {
    const carouselTrack = document.getElementById('carousel-track');
    if (!carouselTrack) return;
    
    const cardWidth = 340; // 320px card + 20px gap
    const offset = -(currentSlide * cardWidth);
    carouselTrack.style.transform = `translateX(${offset}px)`;
}

// Atualizar indicadores
function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

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
    alert(`Detalhes do resultado: ${result}\n\nEm breve você poderá ver mais detalhes sobre esta transformação!\n\nPara mais informações, entre em contato pelo WhatsApp.`);
}

// ========================================
// TOGGLE DE PLANOS
// ========================================
function initializePlanToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const planTypes = document.querySelectorAll('.plan-type');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Atualizar botão ativo
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Mostrar plano correspondente
            const planType = btn.getAttribute('data-plan');
            
            planTypes.forEach(plan => {
                plan.classList.remove('active');
                if (plan.classList.contains(planType)) {
                    plan.classList.add('active');
                }
            });
        });
    });
}

// ========================================
// BOTÃO VOLTAR AO TOPO
// ========================================
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ========================================
// MODAIS
// ========================================
function openVideoModal() {
    const modal = document.getElementById('video-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function openLightbox(element) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('Abrindo lightbox para:', element);
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ========================================
// DETALHES DOS PROCESSOS
// ========================================
function showProcessDetail(step) {
    const details = {
        1: "Avaliação Completa:\n• Anamnese detalhada\n• Análise de exames\n• Avaliação antropométrica\n• Definição de objetivos\n• Identificação de restrições",
        2: "Estratégia Individual:\n• Cálculo de necessidades nutricionais\n• Elaboração do plano alimentar\n• Seleção de alimentos adequados\n• Definição de horários\n• Criação de cardápios variados",
        3: "Suporte Diário:\n• Acompanhamento via WhatsApp\n• Esclarecimento de dúvidas\n• Ajustes quando necessário\n• Motivação constante\n• Resolução de problemas",
        4: "Transformação Real:\n• Mudanças graduais e sustentáveis\n• Criação de novos hábitos\n• Melhoria da qualidade de vida\n• Resultados duradouros\n• Autonomia alimentar"
    };
    
    alert(details[step] || "Detalhes do processo em desenvolvimento...");
}

// ========================================
// DETALHES DOS PLANOS
// ========================================
function showPlanDetails(planType) {
    const details = {
        online: "Plano Online Detalhado:\n\n✅ Consulta inicial completa\n✅ Plano alimentar personalizado\n✅ Ficha de treino individualizada\n✅ Vídeos explicativos\n✅ Suporte diário por WhatsApp\n✅ Análise de exames\n✅ Grupo exclusivo no Instagram\n✅ Opção de videochamadas\n\n💰 A partir de R$ 250,00/mês\n⏰ Válido por 4 semanas\n📱 100% online",
        
        presencial: "Plano Presencial Detalhado:\n\n✅ Tudo do plano online +\n✅ Consultas presenciais (40min-1h)\n✅ Avaliação postural e funcional\n✅ Avaliação antropométrica\n✅ Lembretes semanais personalizados\n✅ Suporte especializado para medicamentos\n✅ Acompanhamento mais próximo\n\n💰 A partir de R$ 350,00/mês\n⏰ Válido por 4 semanas\n🏥 Atendimento presencial"
    };
    
    alert(details[planType] || "Detalhes do plano em desenvolvimento...");
}

// ========================================
// VALIDAÇÃO DE FORMULÁRIOS
// ========================================
function validateForm(data) {
    // Validações básicas
    if (data.name && data.name.length < 2) {
        alert('Nome deve ter pelo menos 2 caracteres');
        return false;
    }
    
    if (data.email && !isValidEmail(data.email)) {
        alert('Email inválido');
        return false;
    }
    
    if (data.phone && data.phone.length < 10) {
        alert('Telefone inválido');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function openWhatsApp(data) {
    const phone = '5511999999999'; // ⚠️ ALTERE ESTE NÚMERO PARA O REAL
    const message = `Olá! Tenho interesse no acompanhamento ${data.plan || 'nutricional'}.\n\nMeus dados:\nNome: ${data.name || ''}\nTelefone: ${data.phone || ''}\n\nGostaria de mais informações.`;
    
    const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}

function showSuccessMessage() {
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
}

// ========================================
// INTERSECTION OBSERVER
// ========================================
function initializeIntersectionObserver() {
    // Observer para animações
    const animateOnScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    // Observer para elementos que devem animar
    const elementsToAnimate = document.querySelectorAll('.truth-card, .process-step, .feature-item');
    elementsToAnimate.forEach(element => {
        animateOnScrollObserver.observe(element);
    });

    // Observer para lazy loading de imagens
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// SISTEMA DE PARTÍCULAS
// ========================================
function initializeParticles() {
    const particlesContainer = document.querySelector('.hero-particles');
    if (!particlesContainer) return;

    // Criar partículas dinamicamente
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 20 + 10}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }

    // Adicionar CSS para animação das partículas
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0%, 100% { 
                transform: translateY(0px) translateX(0px) rotate(0deg);
                opacity: 0.1;
            }
            25% { 
                transform: translateY(-100px) translateX(50px) rotate(90deg);
                opacity: 1;
            }
            50% { 
                transform: translateY(-50px) translateX(-50px) rotate(180deg);
                opacity: 0.5;
            }
            75% { 
                transform: translateY(-150px) translateX(30px) rotate(270deg);
                opacity: 0.8;
            }
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// UTILS E HELPERS
// ========================================

// Debounce function
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

// Throttle function
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ========================================
// EVENT LISTENERS GLOBAIS
// ========================================

// Fechar modais com ESC e controles do carrossel
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeVideoModal();
        closeLightbox();
    }
    
    // Controles do carrossel com teclado
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    } else if (e.key === ' ') { // Barra de espaço
        e.preventDefault();
        if (isCarouselPaused) {
            resumeCarousel();
        } else {
            pauseCarousel();
        }
    }
});

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

// Optimized scroll listener
const optimizedScrollHandler = throttle(() => {
    // Scroll-based functions here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Resize listener
const optimizedResizeHandler = debounce(() => {
    console.log('Window resized');
}, 250);

window.addEventListener('resize', optimizedResizeHandler);

// ========================================
// ERROR HANDLING
// ========================================
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// ========================================
// PERFORMANCE MONITORING
// ========================================
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// ========================================
// CLEANUP
// ========================================
window.addEventListener('beforeunload', () => {
    // Clear timeouts
    typingTimeouts.forEach(timeout => clearTimeout(timeout));
});

// ========================================
// FUNÇÕES EXTRAS PARA COMPATIBILIDADE
// ========================================

// Smooth scroll polyfill para navegadores antigos
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollPolyfill = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    };
    smoothScrollPolyfill();
}

// Detectar dispositivo móvel
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (isMobile) {
    document.body.classList.add('mobile-device');
}

// Log de inicialização
console.log('🥗 Rodrigo Nutrição - Site carregado com sucesso!');
console.log('📱 Dispositivo móvel:', isMobile ? 'Sim' : 'Não');
console.log('🎠 Carrossel com navegação manual ativado');
console.log('⌨️ Controles: ← → (setas), Espaço (pause/play)');
console.log('📱 Mobile: Swipe left/right para navegar');
console.log('🔧 JavaScript inicializado em:', new Date().toLocaleTimeString());