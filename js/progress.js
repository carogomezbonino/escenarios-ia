// ===== SISTEMA DE PROGRESO =====
// progress.js - Manejo del progreso de momentos y persistencia

class ProgressManager {
    constructor() {
        this.totalMoments = 5;
        this.completedMoments = new Set();
        this.progressBar = document.getElementById('globalProgressFill');
        this.progressPercentage = document.querySelector('.progress-percentage');
        this.completedCounter = document.getElementById('completedMoments');
        this.totalCounter = document.getElementById('totalMoments');
        this.checkboxes = document.querySelectorAll('.moment-checkbox');
        this.completeButtons = document.querySelectorAll('.complete-moment-btn');
        
        this.init();
    }
    
    init() {
        console.log('🔄 Inicializando sistema de progreso...');
        
        // Cargar progreso guardado
        this.loadProgress();
        
        // Configurar eventos
        this.setupEventListeners();
        
        // Actualizar UI inicial
        this.updateUI();
        
        // Configurar total de momentos
        if (this.totalCounter) {
            this.totalCounter.textContent = this.totalMoments;
        }
        
        console.log('✅ Sistema de progreso inicializado');
    }
    
    setupEventListeners() {
        // Eventos de checkboxes
        this.checkboxes.forEach((checkbox, index) => {
            checkbox.addEventListener('change', (e) => {
                this.toggleMoment(index + 1, e.target.checked);
            });
        });
        
        // Eventos de botones de completar
        this.completeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const momentId = parseInt(button.getAttribute('data-moment'));
                this.toggleMoment(momentId);
            });
        });
        
        // Evento personalizado para actualización externa
        document.addEventListener('updateProgress', () => {
            this.updateUI();
        });
    }
    
    toggleMoment(momentId, forceState = null) {
        const checkbox = document.getElementById(`check-momento-${momentId}`);
        const button = document.querySelector(`[data-moment="${momentId}"]`);
        
        if (!checkbox) return;
        
        // Determinar nuevo estado
        const newState = forceState !== null ? forceState : !checkbox.checked;
        
        // Actualizar checkbox
        checkbox.checked = newState;
        
        // Actualizar conjunto de momentos completados
        if (newState) {
            this.completedMoments.add(momentId);
        } else {
            this.completedMoments.delete(momentId);
        }
        
        // Actualizar UI
        this.updateUI();
        
        // Guardar progreso
        this.saveProgress();
        
        // Actualizar botón
        this.updateCompleteButton(button, newState);
        
        // Animaciones y efectos
        this.animateProgressChange(momentId, newState);
        
        // Anunciar cambio para accesibilidad
        this.announceProgressChange(momentId, newState);
        
        console.log(`📊 Momento ${momentId} ${newState ? 'completado' : 'desmarcado'}`);
    }
    
    updateUI() {
        const completedCount = this.completedMoments.size;
        const percentage = Math.round((completedCount / this.totalMoments) * 100);
        
        // Actualizar barra de progreso
        if (this.progressBar) {
            this.progressBar.style.width = `${percentage}%`;
            this.progressBar.setAttribute('aria-valuenow', percentage);
        }
        
        // Actualizar porcentaje
        if (this.progressPercentage) {
            this.progressPercentage.textContent = `${percentage}%`;
        }
        
        // Actualizar contador
        if (this.completedCounter) {
            this.completedCounter.textContent = completedCount;
        }
        
        // Actualizar clases CSS para estilos condicionales
        document.body.classList.toggle('progress-complete', percentage === 100);
        document.body.classList.toggle('progress-started', percentage > 0);
        document.body.classList.toggle('progress-halfway', percentage >= 50);
    }
    
    updateCompleteButton(button, isCompleted) {
        if (!button) return;
        
        const icon = button.querySelector('.btn-icon');
        const text = button.querySelector('.btn-text') || button;
        
        if (isCompleted) {
            button.classList.add('completed');
            if (icon) icon.textContent = '✓';
            if (text) text.textContent = text.textContent.replace('Marcar como completado', 'Completado');
        } else {
            button.classList.remove('completed');
            if (icon) icon.textContent = '○';
            if (text) text.textContent = text.textContent.replace('Completado', 'Marcar como completado');
        }
    }
    
    animateProgressChange(momentId, isCompleted) {
        // Animar barra de progreso
        if (this.progressBar) {
            this.progressBar.classList.add('animated');
            setTimeout(() => {
                this.progressBar.classList.remove('animated');
            }, 500);
        }
        
        // Animar checkbox
        const checkbox = document.getElementById(`check-momento-${momentId}`);
        if (checkbox) {
            const label = checkbox.nextElementSibling;
            if (label) {
                label.classList.add(isCompleted ? 'success-bounce' : 'shake');
                setTimeout(() => {
                    label.classList.remove('success-bounce', 'shake');
                }, 600);
            }
        }
        
        // Animar sección del momento
        const section = document.getElementById(`momento-${momentId}`);
        if (section) {
            section.classList.toggle('completed', isCompleted);
            if (isCompleted) {
                section.classList.add('pulse');
                setTimeout(() => {
                    section.classList.remove('pulse');
                }, 1000);
            }
        }
        
        // Efecto de confeti si se completa todo
        if (this.completedMoments.size === this.totalMoments) {
            this.celebrateCompletion();
        }
    }
    
    celebrateCompletion() {
        console.log('🎉 ¡Todos los momentos completados!');
        
        // Crear efecto de confeti
        this.createConfettiEffect();
        
        // Mostrar mensaje de felicitación
        this.showCompletionMessage();
        
        // Anunciar logro
        if (window.announceToScreenReader) {
            window.announceToScreenReader('¡Felicitaciones! Has completado todos los momentos del encuentro.');
        }
    }
    
    createConfettiEffect() {
        const colors = ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D'];
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(confettiContainer);
        
        // Crear partículas de confeti
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
                animation-delay: ${Math.random() * 2}s;
            `;
            confettiContainer.appendChild(confetti);
        }
        
        // Agregar animación CSS si no existe
        if (!document.querySelector('#confetti-styles')) {
            const style = document.createElement('style');
            style.id = 'confetti-styles';
            style.textContent = `
                @keyframes confettiFall {
                    0% {
                        transform: translateY(-100vh) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Limpiar después de la animación
        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    }
    
    showCompletionMessage() {
        const message = document.createElement('div');
        message.className = 'completion-message';
        message.innerHTML = `
            <div class="completion-content">
                <h3>🎉 ¡Felicitaciones!</h3>
                <p>Has completado todos los momentos del encuentro sincrónico.</p>
                <button class="completion-close" onclick="this.parentElement.parentElement.remove()">
                    Continuar
                </button>
            </div>
        `;
        
        // Agregar estilos si no existen
        if (!document.querySelector('#completion-styles')) {
            const style = document.createElement('style');
            style.id = 'completion-styles';
            style.textContent = `
                .completion-message {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    z-index: 10000;
                    text-align: center;
                    max-width: 400px;
                    animation: scaleIn 0.5s ease-out;
                }
                .completion-content h3 {
                    color: var(--azul-educativo);
                    margin-bottom: 15px;
                    font-size: 1.5rem;
                }
                .completion-content p {
                    color: var(--texto-secundario);
                    margin-bottom: 20px;
                }
                .completion-close {
                    background: var(--gradiente-principal);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 12px 24px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: transform 0.2s ease;
                }
                .completion-close:hover {
                    transform: translateY(-2px);
                }
                @keyframes scaleIn {
                    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(message);
        
        // Auto-remover después de 10 segundos
        setTimeout(() => {
            if (message.parentElement) {
                message.remove();
            }
        }, 10000);
    }
    
    announceProgressChange(momentId, isCompleted) {
        const momentTitle = this.getMomentTitle(momentId);
        const message = isCompleted 
            ? `${momentTitle} marcado como completado. Progreso: ${this.completedMoments.size} de ${this.totalMoments} momentos.`
            : `${momentTitle} desmarcado. Progreso: ${this.completedMoments.size} de ${this.totalMoments} momentos.`;
        
        if (window.announceToScreenReader) {
            window.announceToScreenReader(message);
        }
    }
    
    getMomentTitle(momentId) {
        const titles = {
            1: 'Primer momento: Revisamos nuestro camino',
            2: 'Segundo momento: Jugamos y dialogamos',
            3: 'Tercer momento: Desafío grupal',
            4: 'Cuarto momento: Reflexionamos sobre la IA',
            5: 'Quinto momento: Período asincrónico'
        };
        return titles[momentId] || `Momento ${momentId}`;
    }
    
    saveProgress() {
        try {
            const progressData = {
                completedMoments: Array.from(this.completedMoments),
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            localStorage.setItem('escenarios-ia-progress', JSON.stringify(progressData));
            console.log('💾 Progreso guardado:', progressData);
        } catch (error) {
            console.warn('⚠️ No se pudo guardar el progreso:', error);
        }
    }
    
    loadProgress() {
        try {
            const saved = localStorage.getItem('escenarios-ia-progress');
            if (saved) {
                const progressData = JSON.parse(saved);
                this.completedMoments = new Set(progressData.completedMoments || []);
                
                // Actualizar checkboxes según progreso guardado
                this.completedMoments.forEach(momentId => {
                    const checkbox = document.getElementById(`check-momento-${momentId}`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                    
                    const button = document.querySelector(`[data-moment="${momentId}"]`);
                    this.updateCompleteButton(button, true);
                });
                
                console.log('📂 Progreso cargado:', progressData);
            }
        } catch (error) {
            console.warn('⚠️ No se pudo cargar el progreso guardado:', error);
            this.completedMoments = new Set();
        }
    }
    
    resetProgress() {
        this.completedMoments.clear();
        
        // Desmarcar todos los checkboxes
        this.checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Actualizar todos los botones
        this.completeButtons.forEach(button => {
            this.updateCompleteButton(button, false);
        });
        
        // Actualizar UI
        this.updateUI();
        
        // Limpiar almacenamiento
        localStorage.removeItem('escenarios-ia-progress');
        
        console.log('🔄 Progreso reiniciado');
        
        if (window.announceToScreenReader) {
            window.announceToScreenReader('Progreso reiniciado. Todos los momentos han sido desmarcados.');
        }
    }
    
    getProgressStats() {
        return {
            completed: this.completedMoments.size,
            total: this.totalMoments,
            percentage: Math.round((this.completedMoments.size / this.totalMoments) * 100),
            completedMoments: Array.from(this.completedMoments),
            isComplete: this.completedMoments.size === this.totalMoments
        };
    }
    
    // Método para marcar momento como completado externamente
    completeMoment(momentId) {
        this.toggleMoment(momentId, true);
    }
    
    // Método para desmarcar momento externamente
    incompleteMoment(momentId) {
        this.toggleMoment(momentId, false);
    }
    
    // Método para verificar si un momento está completado
    isMomentCompleted(momentId) {
        return this.completedMoments.has(momentId);
    }
}

// ===== INICIALIZACIÓN =====
let progressManager;

function initializeProgress() {
    progressManager = new ProgressManager();
    
    // Exponer métodos globalmente para uso externo
    window.progressManager = progressManager;
    
    // Agregar botón de reset para desarrollo/testing
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        addResetButton();
    }
}

function addResetButton() {
    const resetButton = document.createElement('button');
    resetButton.textContent = '🔄 Reset Progress';
    resetButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 15px;
        cursor: pointer;
        z-index: 1000;
        font-size: 12px;
        opacity: 0.7;
    `;
    resetButton.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres reiniciar todo el progreso?')) {
            progressManager.resetProgress();
        }
    });
    document.body.appendChild(resetButton);
}

// ===== EVENTOS PERSONALIZADOS =====
function updateProgress() {
    if (progressManager) {
        progressManager.updateUI();
    }
}

// Exponer función globalmente
window.updateProgress = updateProgress;

console.log('📊 progress.js cargado correctamente');

