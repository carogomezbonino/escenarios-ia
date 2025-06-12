// ===== ARCHIVO PRINCIPAL DE JAVASCRIPT =====
// main.js - Funcionalidad principal y coordinación de módulos

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Escenarios para aprender con IA - Iniciando aplicación...');
    
    // Inicializar todos los módulos
    initializeApp();
});

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====
function initializeApp() {
    try {
        // Cargar datos del contenido
        loadContentData();
        
        // Inicializar módulos
        initializeProgress();
        initializeNavigation();
        initializeSlotMachine();
        initializeTimers();
        initializeAnimations();
        initializeAccessibility();
        
        // Configurar eventos globales
        setupGlobalEvents();
        
        console.log('✅ Aplicación inicializada correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar la aplicación:', error);
        showErrorMessage('Error al cargar la aplicación. Por favor, recarga la página.');
    }
}

// ===== CARGA DE DATOS =====
async function loadContentData() {
    try {
        const response = await fetch('data/content.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        window.appData = data;
        console.log('📊 Datos de contenido cargados:', data);
    } catch (error) {
        console.warn('⚠️ No se pudieron cargar los datos de contenido:', error);
        // Usar datos por defecto si no se puede cargar el archivo
        window.appData = getDefaultData();
    }
}

// ===== DATOS POR DEFECTO =====
function getDefaultData() {
    return {
        moments: [
            { title: "Primero - Revisamos nuestro camino" },
            { title: "SEGUNDO MOMENTO - Jugamos? y luego dialogamos" },
            { title: "TERCER MOMENTO Ahora Desafío grupal!!! A crear" },
            { title: "CUARTO MOMENTO Reflexionamos sobre la IA" },
            { title: "QUINTO MOMENTO - ¿Qué hacemos en periodo asincrónico?" }
        ]
    };
}

// ===== CONFIGURACIÓN DE EVENTOS GLOBALES =====
function setupGlobalEvents() {
    // Evento de scroll para animaciones
    window.addEventListener('scroll', handleScroll);
    
    // Evento de resize para responsive
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Eventos de teclado para accesibilidad
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Eventos de visibilidad de página
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

// ===== MANEJO DE SCROLL =====
function handleScroll() {
    // Actualizar navegación activa
    updateActiveNavigation();
    
    // Activar animaciones de scroll
    revealElementsOnScroll();
    
    // Actualizar progreso basado en scroll
    updateScrollProgress();
}

// ===== MANEJO DE RESIZE =====
function handleResize() {
    // Reajustar elementos responsive
    adjustResponsiveElements();
    
    // Recalcular posiciones de elementos fijos
    recalculateFixedElements();
}

// ===== NAVEGACIÓN POR TECLADO =====
function handleKeyboardNavigation(event) {
    // Navegación con teclas de flecha
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        if (event.target.classList.contains('nav-link')) {
            event.preventDefault();
            navigateWithKeyboard(event.key);
        }
    }
    
    // Escape para cerrar menús
    if (event.key === 'Escape') {
        closeAllMenus();
    }
    
    // Enter/Space para activar elementos
    if (event.key === 'Enter' || event.key === ' ') {
        if (event.target.classList.contains('moment-checkbox')) {
            event.preventDefault();
            toggleMomentCompletion(event.target);
        }
    }
}

// ===== MANEJO DE VISIBILIDAD =====
function handleVisibilityChange() {
    if (document.hidden) {
        // Pausar animaciones cuando la página no es visible
        pauseAnimations();
    } else {
        // Reanudar animaciones cuando la página es visible
        resumeAnimations();
    }
}

// ===== UTILIDADES =====

// Función debounce para optimizar eventos
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

// Función throttle para optimizar eventos
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

// ===== MANEJO DE ERRORES =====
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div class="error-content">
            <span class="error-icon">⚠️</span>
            <span class="error-text">${message}</span>
            <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Agregar estilos si no existen
    if (!document.querySelector('#error-styles')) {
        const style = document.createElement('style');
        style.id = 'error-styles';
        style.textContent = `
            .error-message {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
                border-radius: 8px;
                padding: 15px;
                z-index: 1000;
                max-width: 400px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                animation: slideInRight 0.3s ease-out;
            }
            .error-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .error-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #721c24;
                margin-left: auto;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(errorDiv);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

// ===== FUNCIONES DE INICIALIZACIÓN PLACEHOLDER =====
// Estas funciones serán implementadas en sus respectivos archivos

function initializeProgress() {
    console.log('🔄 Inicializando sistema de progreso...');
    // Implementado en progress.js
}

function initializeNavigation() {
    console.log('🧭 Inicializando navegación...');
    // Implementado en navigation.js
}

function initializeSlotMachine() {
    console.log('🎰 Inicializando tragamonedas...');
    // Implementado en tragamonedas.js
}

function initializeTimers() {
    console.log('⏱️ Inicializando timers...');
    // Implementado en este archivo
}

function initializeAnimations() {
    console.log('✨ Inicializando animaciones...');
    // Implementado en este archivo
}

function initializeAccessibility() {
    console.log('♿ Inicializando características de accesibilidad...');
    // Implementado en este archivo
}

// ===== IMPLEMENTACIÓN DE TIMERS =====
class Timer {
    constructor(element) {
        this.element = element;
        this.minutesElement = element.querySelector('.timer-minutes');
        this.secondsElement = element.querySelector('.timer-seconds');
        this.startButton = element.querySelector('.start-timer');
        this.isRunning = false;
        this.seconds = 0;
        this.interval = null;
        
        this.init();
    }
    
    init() {
        this.startButton.addEventListener('click', () => {
            if (this.isRunning) {
                this.stop();
            } else {
                this.start();
            }
        });
    }
    
    start() {
        this.isRunning = true;
        this.startButton.textContent = 'Detener';
        this.startButton.classList.add('active');
        
        this.interval = setInterval(() => {
            this.seconds++;
            this.updateDisplay();
        }, 1000);
    }
    
    stop() {
        this.isRunning = false;
        this.startButton.textContent = 'Iniciar';
        this.startButton.classList.remove('active');
        
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    
    reset() {
        this.stop();
        this.seconds = 0;
        this.updateDisplay();
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.seconds / 60);
        const remainingSeconds = this.seconds % 60;
        
        this.minutesElement.textContent = minutes.toString().padStart(2, '0');
        this.secondsElement.textContent = remainingSeconds.toString().padStart(2, '0');
    }
}

// Inicializar timers
function initializeTimers() {
    const timerElements = document.querySelectorAll('.activity-timer');
    timerElements.forEach(element => {
        new Timer(element);
    });
}

// ===== IMPLEMENTACIÓN DE ANIMACIONES =====
function initializeAnimations() {
    // Configurar Intersection Observer para animaciones de scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    // Observar elementos que deben animarse al hacer scroll
    const elementsToReveal = document.querySelectorAll('.scroll-reveal');
    elementsToReveal.forEach(element => {
        observer.observe(element);
    });
    
    // Agregar clases de animación a elementos
    addAnimationClasses();
}

function addAnimationClasses() {
    // Agregar animaciones escalonadas a las tarjetas de subsección
    const subsectionCards = document.querySelectorAll('.subsection-card');
    subsectionCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
    
    // Agregar efectos hover a botones
    const buttons = document.querySelectorAll('button, .btn, .external-link, .meeting-btn');
    buttons.forEach(button => {
        button.classList.add('hover-lift');
    });
}

function revealElementsOnScroll() {
    const elements = document.querySelectorAll('.scroll-reveal:not(.revealed)');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

function pauseAnimations() {
    document.body.style.animationPlayState = 'paused';
}

function resumeAnimations() {
    document.body.style.animationPlayState = 'running';
}

// ===== IMPLEMENTACIÓN DE ACCESIBILIDAD =====
function initializeAccessibility() {
    // Configurar ARIA labels dinámicos
    setupAriaLabels();
    
    // Configurar navegación por teclado
    setupKeyboardNavigation();
    
    // Configurar anuncios para lectores de pantalla
    setupScreenReaderAnnouncements();
}

function setupAriaLabels() {
    // Actualizar ARIA labels para el progreso
    const progressBar = document.getElementById('globalProgressFill');
    if (progressBar) {
        progressBar.setAttribute('role', 'progressbar');
        progressBar.setAttribute('aria-valuemin', '0');
        progressBar.setAttribute('aria-valuemax', '100');
        progressBar.setAttribute('aria-valuenow', '0');
    }
    
    // Configurar ARIA para checkboxes
    const checkboxes = document.querySelectorAll('.moment-checkbox');
    checkboxes.forEach((checkbox, index) => {
        checkbox.setAttribute('aria-describedby', `moment-${index + 1}-description`);
    });
}

function setupKeyboardNavigation() {
    // Configurar orden de tabulación lógico
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach((element, index) => {
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
    });
}

function setupScreenReaderAnnouncements() {
    // Crear elemento para anuncios
    const announcer = document.createElement('div');
    announcer.id = 'screen-reader-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.left = '-10000px';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.overflow = 'hidden';
    document.body.appendChild(announcer);
    
    window.announceToScreenReader = function(message) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };
}

// ===== FUNCIONES AUXILIARES =====
function updateActiveNavigation() {
    const sections = document.querySelectorAll('.moment-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 100) {
            currentSection = section.id;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // Actualizar barra de progreso de scroll si existe
    const scrollProgressBar = document.querySelector('.scroll-progress-bar');
    if (scrollProgressBar) {
        scrollProgressBar.style.width = `${scrollPercent}%`;
    }
}

function adjustResponsiveElements() {
    // Ajustar elementos según el tamaño de pantalla
    const isMobile = window.innerWidth <= 767;
    const isTablet = window.innerWidth > 767 && window.innerWidth <= 1023;
    
    document.body.classList.toggle('mobile', isMobile);
    document.body.classList.toggle('tablet', isTablet);
    document.body.classList.toggle('desktop', !isMobile && !isTablet);
}

function recalculateFixedElements() {
    // Recalcular posiciones de elementos fijos
    const fixedElements = document.querySelectorAll('.fixed-element');
    fixedElements.forEach(element => {
        // Lógica de reposicionamiento si es necesaria
    });
}

function navigateWithKeyboard(direction) {
    const currentActive = document.querySelector('.nav-link.active');
    if (!currentActive) return;
    
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const currentIndex = navLinks.indexOf(currentActive);
    
    let nextIndex;
    if (direction === 'ArrowUp') {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : navLinks.length - 1;
    } else {
        nextIndex = currentIndex < navLinks.length - 1 ? currentIndex + 1 : 0;
    }
    
    navLinks[nextIndex].focus();
    navLinks[nextIndex].click();
}

function closeAllMenus() {
    // Cerrar menú móvil
    const mobileMenu = document.getElementById('navList');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    
    if (mobileMenu && mobileToggle) {
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
    }
}

function toggleMomentCompletion(checkbox) {
    const momentId = checkbox.id.replace('check-momento-', '');
    const isChecked = checkbox.checked;
    
    // Actualizar progreso
    updateProgress();
    
    // Anunciar cambio a lectores de pantalla
    const message = isChecked 
        ? `Momento ${momentId} marcado como completado`
        : `Momento ${momentId} desmarcado`;
    
    if (window.announceToScreenReader) {
        window.announceToScreenReader(message);
    }
}

// ===== EXPORTAR FUNCIONES GLOBALES =====
window.appUtils = {
    debounce,
    throttle,
    showErrorMessage,
    announceToScreenReader: null // Se configurará en initializeAccessibility
};

console.log('📄 main.js cargado correctamente');

