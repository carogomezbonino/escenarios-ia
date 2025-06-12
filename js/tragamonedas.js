// ===== TRAGAMONEDAS INTERACTIVO =====
// tragamonedas.js - Sistema completo del sorteo de grupos

class SlotMachine {
    constructor() {
        this.container = document.querySelector('.slot-machine-container');
        this.reels = document.querySelectorAll('.slot-reel');
        this.lever = document.getElementById('slotLever');
        this.resultsList = document.getElementById('resultsList');
        this.numbers = Array.from({length: 18}, (_, i) => i + 1); // Números del 1 al 18
        this.isSpinning = false;
        this.results = [];
        this.maxSorteos = 6; // Máximo 6 sorteos para que todos participen
        this.currentSorteo = 0;
        this.usedNumbers = new Set();
        
        this.init();
    }
    
    init() {
        console.log('🎰 Inicializando tragamonedas...');
        
        // Configurar ruedas iniciales
        this.setupReels();
        
        // Configurar eventos
        this.setupEventListeners();
        
        // Cargar resultados guardados
        this.loadResults();
        
        // Actualizar UI inicial
        this.updateUI();
        
        console.log('✅ Tragamonedas inicializado');
    }
    
    setupReels() {
        this.reels.forEach((reel, index) => {
            const numbersContainer = reel.querySelector('.slot-numbers');
            
            // Crear números visibles en cada rueda
            this.createReelNumbers(numbersContainer);
            
            // Establecer número inicial aleatorio
            this.setReelNumber(reel, this.getRandomNumber());
        });
    }
    
    createReelNumbers(container) {
        // Crear múltiples copias de números para efecto de scroll
        const numbersToShow = 5; // Números visibles en la rueda
        const totalNumbers = this.numbers.length * 3; // Triplicar para scroll infinito
        
        container.innerHTML = '';
        
        for (let i = 0; i < totalNumbers; i++) {
            const numberDiv = document.createElement('div');
            numberDiv.className = 'slot-number';
            numberDiv.textContent = this.numbers[i % this.numbers.length];
            numberDiv.style.cssText = `
                height: ${100 / numbersToShow}%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: var(--texto-principal);
                border-bottom: 1px solid rgba(46, 134, 171, 0.1);
            `;
            container.appendChild(numberDiv);
        }
    }
    
    setupEventListeners() {
        // Evento del botón de palanca
        if (this.lever) {
            this.lever.addEventListener('click', () => {
                this.spin();
            });
        }
        
        // Eventos de teclado para accesibilidad
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target === this.lever) {
                e.preventDefault();
                this.spin();
            }
        });
    }
    
    async spin() {
        if (this.isSpinning) return;
        
        // Verificar si se pueden hacer más sorteos
        if (this.currentSorteo >= this.maxSorteos) {
            this.showMaxSorteosMessage();
            return;
        }
        
        this.isSpinning = true;
        this.currentSorteo++;
        
        // Actualizar UI del botón
        this.updateLeverState(true);
        
        // Anunciar inicio del sorteo
        if (window.announceToScreenReader) {
            window.announceToScreenReader(`Iniciando sorteo ${this.currentSorteo} de ${this.maxSorteos}`);
        }
        
        // Animar ruedas
        await this.animateReels();
        
        // Generar resultado
        const result = this.generateResult();
        
        // Mostrar resultado
        this.displayResult(result);
        
        // Guardar resultado
        this.saveResult(result);
        
        // Actualizar UI
        this.updateUI();
        
        this.isSpinning = false;
        this.updateLeverState(false);
        
        console.log(`🎯 Sorteo ${this.currentSorteo} completado:`, result);
    }
    
    async animateReels() {
        const spinDuration = 2000; // 2 segundos de animación
        const spinPromises = [];
        
        this.reels.forEach((reel, index) => {
            const promise = this.animateReel(reel, spinDuration + (index * 200));
            spinPromises.push(promise);
        });
        
        // Esperar a que todas las ruedas terminen
        await Promise.all(spinPromises);
    }
    
    animateReel(reel, duration) {
        return new Promise((resolve) => {
            const numbersContainer = reel.querySelector('.slot-numbers');
            const numbers = numbersContainer.querySelectorAll('.slot-number');
            
            // Agregar clase de animación
            reel.classList.add('spinning');
            
            // Animación de rotación rápida
            let currentRotation = 0;
            const rotationSpeed = 50; // ms entre rotaciones
            const totalRotations = duration / rotationSpeed;
            
            const rotateInterval = setInterval(() => {
                currentRotation++;
                const randomIndex = Math.floor(Math.random() * numbers.length);
                
                // Resaltar número actual
                numbers.forEach((num, idx) => {
                    num.style.background = idx === randomIndex ? 'rgba(46, 134, 171, 0.2)' : 'transparent';
                    num.style.transform = idx === randomIndex ? 'scale(1.1)' : 'scale(1)';
                });
                
                if (currentRotation >= totalRotations) {
                    clearInterval(rotateInterval);
                    
                    // Detener animación
                    reel.classList.remove('spinning');
                    reel.classList.add('stopping');
                    
                    // Establecer número final
                    const finalNumber = this.getAvailableNumber();
                    this.setReelNumber(reel, finalNumber);
                    
                    setTimeout(() => {
                        reel.classList.remove('stopping');
                        resolve(finalNumber);
                    }, 300);
                }
            }, rotationSpeed);
        });
    }
    
    setReelNumber(reel, number) {
        const numbersContainer = reel.querySelector('.slot-numbers');
        const numbers = numbersContainer.querySelectorAll('.slot-number');
        
        // Limpiar estilos anteriores
        numbers.forEach(num => {
            num.style.background = 'transparent';
            num.style.transform = 'scale(1)';
            num.style.color = 'var(--texto-principal)';
        });
        
        // Encontrar y resaltar el número seleccionado
        const targetNumber = Array.from(numbers).find(num => 
            parseInt(num.textContent) === number
        );
        
        if (targetNumber) {
            targetNumber.style.background = 'var(--azul-educativo)';
            targetNumber.style.color = 'white';
            targetNumber.style.transform = 'scale(1.2)';
            targetNumber.style.borderRadius = '8px';
            targetNumber.style.fontWeight = 'bold';
        }
        
        // Guardar número en el reel
        reel.dataset.currentNumber = number;
    }
    
    generateResult() {
        const result = [];
        
        // Obtener números de cada rueda
        this.reels.forEach(reel => {
            const number = parseInt(reel.dataset.currentNumber);
            result.push(number);
            this.usedNumbers.add(number);
        });
        
        return {
            sorteo: this.currentSorteo,
            numeros: result,
            timestamp: new Date().toISOString(),
            grupos: this.assignGroups(result)
        };
    }
    
    assignGroups(numbers) {
        // Asignar números a grupos (3 números por grupo)
        const grupos = [];
        for (let i = 0; i < numbers.length; i += 3) {
            const grupo = numbers.slice(i, i + 3);
            if (grupo.length === 3) {
                grupos.push({
                    id: Math.floor(i / 3) + 1,
                    participantes: grupo,
                    reunion: `https://meet.jit.si/escenario-ia-${Math.floor(i / 3) + 1}`
                });
            }
        }
        return grupos;
    }
    
    getAvailableNumber() {
        // Obtener número que no haya sido usado
        const availableNumbers = this.numbers.filter(num => !this.usedNumbers.has(num));
        
        if (availableNumbers.length === 0) {
            // Si todos los números fueron usados, reiniciar
            this.usedNumbers.clear();
            return this.getRandomNumber();
        }
        
        return availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    }
    
    getRandomNumber() {
        return this.numbers[Math.floor(Math.random() * this.numbers.length)];
    }
    
    displayResult(result) {
        const resultElement = document.createElement('div');
        resultElement.className = 'result-item new';
        resultElement.innerHTML = `
            <div class="result-header">
                <strong>Sorteo ${result.sorteo}:</strong>
                <span class="result-numbers">${result.numeros.join(', ')}</span>
            </div>
            <div class="result-groups">
                ${result.grupos.map(grupo => `
                    <div class="result-group">
                        <span class="group-label">Grupo ${grupo.id}:</span>
                        <span class="group-participants">${grupo.participantes.join(', ')}</span>
                        <a href="${grupo.reunion}" target="_blank" class="group-meeting-link">
                            📹 Reunión
                        </a>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Agregar estilos específicos
        resultElement.style.cssText = `
            background: var(--fondo-principal);
            border: 2px solid var(--azul-educativo);
            border-radius: var(--border-radius-sm);
            padding: var(--spacing-sm);
            margin-bottom: var(--spacing-xs);
            animation: resultAppear 0.6s ease-out forwards;
        `;
        
        this.resultsList.appendChild(resultElement);
        
        // Scroll al resultado
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Anunciar resultado
        if (window.announceToScreenReader) {
            const announcement = `Sorteo ${result.sorteo} completado. Números: ${result.numeros.join(', ')}. ${result.grupos.length} grupos formados.`;
            window.announceToScreenReader(announcement);
        }
        
        // Actualizar enlaces de reunión
        this.updateMeetingLinks(result);
    }
    
    updateMeetingLinks(result) {
        // Resaltar botones de reunión correspondientes
        result.grupos.forEach(grupo => {
            const meetingBtn = document.querySelector(`[data-group="${grupo.id}"]`);
            if (meetingBtn) {
                meetingBtn.classList.add('active-group');
                meetingBtn.style.background = 'var(--gradiente-acento)';
                meetingBtn.style.animation = 'pulse 2s ease-in-out 3';
            }
        });
    }
    
    updateLeverState(isSpinning) {
        if (!this.lever) return;
        
        if (isSpinning) {
            this.lever.disabled = true;
            this.lever.classList.add('spinning');
            this.lever.innerHTML = `
                <span class="lever-icon spinning">🎰</span>
                SORTEANDO...
            `;
        } else {
            this.lever.disabled = false;
            this.lever.classList.remove('spinning');
            
            if (this.currentSorteo >= this.maxSorteos) {
                this.lever.innerHTML = `
                    <span class="lever-icon">✅</span>
                    SORTEOS COMPLETADOS
                `;
                this.lever.disabled = true;
            } else {
                this.lever.innerHTML = `
                    <span class="lever-icon">🎰</span>
                    SORTEAR (${this.currentSorteo}/${this.maxSorteos})
                `;
            }
        }
    }
    
    updateUI() {
        // Actualizar contador de sorteos
        const sorteoCounter = document.querySelector('.sorteo-counter');
        if (sorteoCounter) {
            sorteoCounter.textContent = `${this.currentSorteo}/${this.maxSorteos}`;
        }
        
        // Actualizar estado del botón
        this.updateLeverState(false);
        
        // Mostrar/ocultar botón de reset
        this.toggleResetButton();
    }
    
    toggleResetButton() {
        let resetBtn = document.querySelector('.slot-reset-btn');
        
        if (this.currentSorteo > 0 && !resetBtn) {
            resetBtn = document.createElement('button');
            resetBtn.className = 'slot-reset-btn';
            resetBtn.innerHTML = '🔄 Reiniciar Sorteos';
            resetBtn.style.cssText = `
                background: var(--rojo-educativo);
                color: white;
                border: none;
                border-radius: var(--border-radius-sm);
                padding: var(--spacing-sm) var(--spacing-md);
                cursor: pointer;
                font-weight: 500;
                margin-top: var(--spacing-sm);
                transition: all var(--transition-fast);
            `;
            
            resetBtn.addEventListener('click', () => {
                this.resetSlotMachine();
            });
            
            this.container.appendChild(resetBtn);
        }
        
        if (resetBtn) {
            resetBtn.style.display = this.currentSorteo > 0 ? 'inline-block' : 'none';
        }
    }
    
    resetSlotMachine() {
        if (confirm('¿Estás seguro de que quieres reiniciar todos los sorteos?')) {
            this.currentSorteo = 0;
            this.results = [];
            this.usedNumbers.clear();
            
            // Limpiar resultados
            this.resultsList.innerHTML = '';
            
            // Reiniciar ruedas
            this.setupReels();
            
            // Actualizar UI
            this.updateUI();
            
            // Limpiar almacenamiento
            this.clearSavedResults();
            
            // Limpiar estilos de botones de reunión
            document.querySelectorAll('.meeting-btn').forEach(btn => {
                btn.classList.remove('active-group');
                btn.style.background = '';
                btn.style.animation = '';
            });
            
            console.log('🔄 Tragamonedas reiniciado');
            
            if (window.announceToScreenReader) {
                window.announceToScreenReader('Tragamonedas reiniciado. Todos los sorteos han sido eliminados.');
            }
        }
    }
    
    showMaxSorteosMessage() {
        const message = document.createElement('div');
        message.className = 'max-sorteos-message';
        message.innerHTML = `
            <div class="message-content">
                <h4>🎯 Sorteos Completados</h4>
                <p>Se han realizado todos los sorteos posibles (${this.maxSorteos}/${this.maxSorteos}).</p>
                <p>Todos los participantes han sido asignados a grupos.</p>
                <button onclick="this.parentElement.parentElement.remove()">Entendido</button>
            </div>
        `;
        
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: var(--border-radius);
            padding: var(--spacing-lg);
            box-shadow: var(--sombra-fuerte);
            z-index: 1000;
            text-align: center;
            max-width: 400px;
            animation: scaleIn 0.3s ease-out;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentElement) {
                message.remove();
            }
        }, 5000);
    }
    
    saveResult(result) {
        this.results.push(result);
        
        try {
            const saveData = {
                results: this.results,
                currentSorteo: this.currentSorteo,
                usedNumbers: Array.from(this.usedNumbers),
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('slot-machine-results', JSON.stringify(saveData));
            console.log('💾 Resultados del tragamonedas guardados');
        } catch (error) {
            console.warn('⚠️ No se pudieron guardar los resultados:', error);
        }
    }
    
    loadResults() {
        try {
            const saved = localStorage.getItem('slot-machine-results');
            if (saved) {
                const saveData = JSON.parse(saved);
                this.results = saveData.results || [];
                this.currentSorteo = saveData.currentSorteo || 0;
                this.usedNumbers = new Set(saveData.usedNumbers || []);
                
                // Restaurar resultados en UI
                this.results.forEach(result => {
                    this.displayResult(result);
                });
                
                console.log('📂 Resultados del tragamonedas cargados:', saveData);
            }
        } catch (error) {
            console.warn('⚠️ No se pudieron cargar los resultados guardados:', error);
            this.results = [];
            this.currentSorteo = 0;
            this.usedNumbers = new Set();
        }
    }
    
    clearSavedResults() {
        localStorage.removeItem('slot-machine-results');
    }
    
    // Métodos públicos para uso externo
    getCurrentResults() {
        return this.results;
    }
    
    getGroupAssignments() {
        const allGroups = [];
        this.results.forEach(result => {
            allGroups.push(...result.grupos);
        });
        return allGroups;
    }
    
    exportResults() {
        const exportData = {
            fecha: new Date().toLocaleDateString('es-ES'),
            totalSorteos: this.currentSorteo,
            resultados: this.results,
            grupos: this.getGroupAssignments()
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `sorteo-grupos-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        console.log('📤 Resultados exportados');
    }
}

// ===== INICIALIZACIÓN =====
let slotMachine;

function initializeSlotMachine() {
    const slotContainer = document.querySelector('.slot-machine-container');
    if (slotContainer) {
        slotMachine = new SlotMachine();
        
        // Exponer globalmente
        window.slotMachine = slotMachine;
        
        // Agregar botón de exportación para desarrollo
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            addExportButton();
        }
    }
}

function addExportButton() {
    const exportBtn = document.createElement('button');
    exportBtn.textContent = '📤 Exportar Resultados';
    exportBtn.style.cssText = `
        position: fixed;
        bottom: 70px;
        right: 20px;
        background: var(--azul-educativo);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 15px;
        cursor: pointer;
        z-index: 1000;
        font-size: 12px;
        opacity: 0.8;
    `;
    exportBtn.addEventListener('click', () => {
        if (slotMachine) {
            slotMachine.exportResults();
        }
    });
    document.body.appendChild(exportBtn);
}

console.log('🎰 tragamonedas.js cargado correctamente');

