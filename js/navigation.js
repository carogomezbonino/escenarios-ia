// ===== SISTEMA DE NAVEGACIÓN =====
// navigation.js - Manejo de navegación, menú móvil y scroll suave

class NavigationManager {
    constructor() {
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.navList = document.getElementById('navList');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.moment-section');
        this.isMenuOpen = false;
        this.currentSection = null;
        this.scrollOffset = 100; // Offset para la navegación
        
        this.init();
    }
    
    init() {
        console.log('🧭 Inicializando sistema de navegación...');
        
        // Configurar eventos
        this.setupEventListeners();
        
        // Configurar navegación inicial
        this.updateActiveNavigation();
        
        // Configurar scroll suave
        this.setupSmoothScroll();
        
        console.log('✅ Sistema de navegación inicializado');
    }
    
    setupEventListeners() {
        // Toggle del menú móvil
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Enlaces de navegación
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavClick(e);
            });
        });
        
        // Scroll para actualizar navegación activa
        window.addEventListener('scroll', this.throttle(() => {
            this.updateActiveNavigation();
        }, 100));
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            this.handleOutsideClick(e);
        });
        
        // Cerrar menú con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Manejar cambios de tamaño de ventana
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }
    
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.isMenuOpen = true;
        this.mobileMenuToggle.classList.add('active');
        this.navList.classList.add('active');
        
        // Animar entrada del menú
        this.navList.style.display = 'flex';
        setTimeout(() => {
            this.navList.classList.add('sliding-in');
        }, 10);
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
        
        // Focus en el primer enlace para accesibilidad
        const firstLink = this.navList.querySelector('.nav-link');
        if (firstLink) {
            firstLink.focus();
        }
        
        // Anunciar apertura del menú
        if (window.announceToScreenReader) {
            window.announceToScreenReader('Menú de navegación abierto');
        }
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        this.mobileMenuToggle.classList.remove('active');
        this.navList.classList.remove('active', 'sliding-in');
        
        // Restaurar scroll del body
        document.body.style.overflow = '';
        
        // Anunciar cierre del menú
        if (window.announceToScreenReader) {
            window.announceToScreenReader('Menú de navegación cerrado');
        }
    }
    
    handleNavClick(e) {
        e.preventDefault();
        
        const link = e.currentTarget;
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Cerrar menú móvil si está abierto
            if (this.isMenuOpen) {
                this.closeMobileMenu();
            }
            
            // Scroll suave a la sección
            this.scrollToSection(targetSection);
            
            // Actualizar navegación activa
            this.setActiveLink(link);
            
            // Anunciar navegación
            const momentTitle = link.querySelector('.nav-text').textContent;
            if (window.announceToScreenReader) {
                window.announceToScreenReader(`Navegando a ${momentTitle}`);
            }
        }
    }
    
    scrollToSection(section) {
        const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
        const offsetTop = sectionTop - this.scrollOffset;
        
        // Scroll suave
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Actualizar URL sin recargar página
        const sectionId = section.id;
        if (sectionId) {
            history.pushState(null, null, `#${sectionId}`);
        }
    }
    
    updateActiveNavigation() {
        let currentSection = null;
        let currentSectionTop = -Infinity;
        
        // Encontrar la sección actual basada en scroll
        this.sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            
            // Considerar sección activa si está en el viewport
            if (sectionTop <= this.scrollOffset && sectionTop + sectionHeight > this.scrollOffset) {
                if (sectionTop > currentSectionTop) {
                    currentSection = section;
                    currentSectionTop = sectionTop;
                }
            }
        });
        
        // Si no hay sección en viewport, usar la más cercana
        if (!currentSection) {
            let closestDistance = Infinity;
            this.sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                const distance = Math.abs(sectionTop - this.scrollOffset);
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    currentSection = section;
                }
            });
        }
        
        // Actualizar navegación activa
        if (currentSection && currentSection !== this.currentSection) {
            this.currentSection = currentSection;
            const targetLink = document.querySelector(`[href="#${currentSection.id}"]`);
            if (targetLink) {
                this.setActiveLink(targetLink);
            }
        }
    }
    
    setActiveLink(activeLink) {
        // Remover clase activa de todos los enlaces
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            link.setAttribute('aria-current', 'false');
        });
        
        // Agregar clase activa al enlace actual
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
        
        // Animar indicador de progreso en navegación
        this.animateNavProgress(activeLink);
    }
    
    animateNavProgress(activeLink) {
        // Crear o actualizar indicador de progreso en navegación
        let progressIndicator = document.querySelector('.nav-progress-indicator');
        
        if (!progressIndicator) {
            progressIndicator = document.createElement('div');
            progressIndicator.className = 'nav-progress-indicator';
            progressIndicator.style.cssText = `
                position: absolute;
                bottom: 0;
                height: 3px;
                background: var(--gradiente-principal);
                transition: all 0.3s ease;
                border-radius: 2px;
            `;
            this.navList.style.position = 'relative';
            this.navList.appendChild(progressIndicator);
        }
        
        // Calcular posición del indicador
        const linkRect = activeLink.getBoundingClientRect();
        const navRect = this.navList.getBoundingClientRect();
        const left = linkRect.left - navRect.left;
        const width = linkRect.width;
        
        progressIndicator.style.left = `${left}px`;
        progressIndicator.style.width = `${width}px`;
    }
    
    handleOutsideClick(e) {
        if (this.isMenuOpen && 
            !this.navList.contains(e.target) && 
            !this.mobileMenuToggle.contains(e.target)) {
            this.closeMobileMenu();
        }
    }
    
    handleResize() {
        // Cerrar menú móvil en resize a desktop
        if (window.innerWidth > 767 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Recalcular posiciones
        this.updateActiveNavigation();
    }
    
    setupSmoothScroll() {
        // Configurar scroll suave para todos los enlaces internos
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            if (!link.classList.contains('nav-link')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        this.scrollToSection(targetSection);
                    }
                });
            }
        });
    }
    
    // Navegación programática
    navigateToMoment(momentId) {
        const targetSection = document.getElementById(`momento-${momentId}`);
        const targetLink = document.querySelector(`[href="#momento-${momentId}"]`);
        
        if (targetSection && targetLink) {
            this.scrollToSection(targetSection);
            this.setActiveLink(targetLink);
            
            // Cerrar menú móvil si está abierto
            if (this.isMenuOpen) {
                this.closeMobileMenu();
            }
            
            return true;
        }
        return false;
    }
    
    // Navegación con teclado
    navigateWithKeyboard(direction) {
        const currentActiveLink = document.querySelector('.nav-link.active');
        if (!currentActiveLink) return;
        
        const navLinksArray = Array.from(this.navLinks);
        const currentIndex = navLinksArray.indexOf(currentActiveLink);
        
        let nextIndex;
        if (direction === 'next') {
            nextIndex = currentIndex < navLinksArray.length - 1 ? currentIndex + 1 : 0;
        } else {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : navLinksArray.length - 1;
        }
        
        const nextLink = navLinksArray[nextIndex];
        nextLink.click();
        nextLink.focus();
    }
    
    // Obtener momento actual
    getCurrentMoment() {
        if (this.currentSection) {
            const momentId = this.currentSection.id.replace('momento-', '');
            return parseInt(momentId);
        }
        return null;
    }
    
    // Verificar si hay siguiente momento
    hasNextMoment() {
        const currentMoment = this.getCurrentMoment();
        return currentMoment && currentMoment < this.sections.length;
    }
    
    // Verificar si hay momento anterior
    hasPreviousMoment() {
        const currentMoment = this.getCurrentMoment();
        return currentMoment && currentMoment > 1;
    }
    
    // Ir al siguiente momento
    goToNextMoment() {
        const currentMoment = this.getCurrentMoment();
        if (this.hasNextMoment()) {
            return this.navigateToMoment(currentMoment + 1);
        }
        return false;
    }
    
    // Ir al momento anterior
    goToPreviousMoment() {
        const currentMoment = this.getCurrentMoment();
        if (this.hasPreviousMoment()) {
            return this.navigateToMoment(currentMoment - 1);
        }
        return false;
    }
    
    // Utilidades
    throttle(func, limit) {
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
    
    debounce(func, wait) {
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
}

// ===== NAVEGACIÓN CON BREADCRUMBS =====
class BreadcrumbManager {
    constructor() {
        this.breadcrumbContainer = this.createBreadcrumbContainer();
        this.init();
    }
    
    init() {
        // Actualizar breadcrumbs cuando cambie la navegación
        document.addEventListener('scroll', this.throttle(() => {
            this.updateBreadcrumbs();
        }, 200));
    }
    
    createBreadcrumbContainer() {
        const container = document.createElement('nav');
        container.className = 'breadcrumb-nav';
        container.setAttribute('aria-label', 'Breadcrumb');
        container.style.cssText = `
            position: fixed;
            top: 80px;
            left: 20px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 8px;
            padding: 8px 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            z-index: 90;
            font-size: 0.875rem;
            display: none;
        `;
        
        document.body.appendChild(container);
        return container;
    }
    
    updateBreadcrumbs() {
        const currentSection = document.querySelector('.moment-section');
        if (!currentSection) return;
        
        const sectionRect = currentSection.getBoundingClientRect();
        const isVisible = sectionRect.top <= 100 && sectionRect.bottom >= 100;
        
        if (isVisible) {
            const momentTitle = currentSection.querySelector('.moment-title');
            if (momentTitle) {
                this.breadcrumbContainer.innerHTML = `
                    <ol style="display: flex; align-items: center; gap: 8px; margin: 0; padding: 0; list-style: none;">
                        <li><a href="#" style="color: var(--azul-educativo); text-decoration: none;">Inicio</a></li>
                        <li style="color: var(--texto-secundario);">›</li>
                        <li style="color: var(--texto-principal); font-weight: 500;">${momentTitle.textContent}</li>
                    </ol>
                `;
                this.breadcrumbContainer.style.display = 'block';
            }
        } else {
            this.breadcrumbContainer.style.display = 'none';
        }
    }
    
    throttle(func, limit) {
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
}

// ===== INICIALIZACIÓN =====
let navigationManager;
let breadcrumbManager;

function initializeNavigation() {
    navigationManager = new NavigationManager();
    breadcrumbManager = new BreadcrumbManager();
    
    // Exponer métodos globalmente
    window.navigationManager = navigationManager;
    
    // Configurar navegación inicial basada en URL
    const hash = window.location.hash;
    if (hash) {
        const targetSection = document.querySelector(hash);
        if (targetSection) {
            setTimeout(() => {
                navigationManager.scrollToSection(targetSection);
            }, 100);
        }
    }
    
    // Agregar controles de navegación adicionales
    addNavigationControls();
}

function addNavigationControls() {
    // Botones de navegación anterior/siguiente
    const navControls = document.createElement('div');
    navControls.className = 'nav-controls';
    navControls.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
        z-index: 90;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 25px;
        padding: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    navControls.innerHTML = `
        <button id="prevMoment" class="nav-control-btn" title="Momento anterior">
            ← Anterior
        </button>
        <button id="nextMoment" class="nav-control-btn" title="Siguiente momento">
            Siguiente →
        </button>
    `;
    
    // Agregar estilos para los botones
    const style = document.createElement('style');
    style.textContent = `
        .nav-control-btn {
            background: var(--azul-educativo);
            color: white;
            border: none;
            border-radius: 20px;
            padding: 8px 16px;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        .nav-control-btn:hover {
            background: var(--magenta-calido);
            transform: translateY(-2px);
        }
        .nav-control-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }
        @media (max-width: 767px) {
            .nav-controls {
                bottom: 10px;
                left: 10px;
                right: 10px;
                transform: none;
                justify-content: space-between;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(navControls);
    
    // Configurar eventos
    document.getElementById('prevMoment').addEventListener('click', () => {
        navigationManager.goToPreviousMoment();
    });
    
    document.getElementById('nextMoment').addEventListener('click', () => {
        navigationManager.goToNextMoment();
    });
    
    // Actualizar estado de botones
    const updateNavButtons = () => {
        const prevBtn = document.getElementById('prevMoment');
        const nextBtn = document.getElementById('nextMoment');
        
        prevBtn.disabled = !navigationManager.hasPreviousMoment();
        nextBtn.disabled = !navigationManager.hasNextMoment();
    };
    
    // Actualizar botones en scroll
    window.addEventListener('scroll', navigationManager.throttle(updateNavButtons, 100));
    updateNavButtons();
}

console.log('🧭 navigation.js cargado correctamente');

