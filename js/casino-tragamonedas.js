// ===== TRAGAMONEDAS MEJORADO ESTILO CASINO =====

class CasinoSlotMachine {
    constructor() {
        this.container = document.getElementById('slot-machine');
        this.reels = [];
        this.isSpinning = false;
        this.spinCount = 0;
        this.maxSpins = 6;
        this.results = [];
        this.numbers = Array.from({length: 18}, (_, i) => i + 1);
        
        // Configuración de animación realista
        this.spinDuration = 3000; // 3 segundos de giro
        this.reelStopDelay = 500; // Delay entre paradas de cada reel
        this.symbolHeight = 80; // Altura de cada número
        this.visibleSymbols = 3; // Números visibles por reel
        
        this.init();
        this.loadResults();
    }

    init() {
        this.createSlotMachine();
        this.setupEventListeners();
        this.updateUI();
    }

    createSlotMachine() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="casino-slot-container">
                <div class="slot-header">
                    <div class="casino-lights">
                        <div class="light"></div>
                        <div class="light"></div>
                        <div class="light"></div>
                        <div class="light"></div>
                        <div class="light"></div>
                    </div>
                    <h3 class="slot-title">
                        <span class="slot-icon">🎰</span>
                        Sorteo de Grupos
                        <span class="slot-icon">🎰</span>
                    </h3>
                    <div class="casino-lights">
                        <div class="light"></div>
                        <div class="light"></div>
                        <div class="light"></div>
                        <div class="light"></div>
                        <div class="light"></div>
                    </div>
                </div>
                
                <div class="slot-machine-frame">
                    <div class="slot-reels-container">
                        <div class="reel-container" data-reel="0">
                            <div class="reel-window">
                                <div class="reel-strip" id="reel-0"></div>
                            </div>
                            <div class="reel-label">Reel 1</div>
                        </div>
                        <div class="reel-container" data-reel="1">
                            <div class="reel-window">
                                <div class="reel-strip" id="reel-1"></div>
                            </div>
                            <div class="reel-label">Reel 2</div>
                        </div>
                        <div class="reel-container" data-reel="2">
                            <div class="reel-window">
                                <div class="reel-strip" id="reel-2"></div>
                            </div>
                            <div class="reel-label">Reel 3</div>
                        </div>
                    </div>
                    
                    <div class="slot-controls">
                        <button id="spin-btn" class="spin-button">
                            <span class="btn-icon">🎰</span>
                            <span class="btn-text">SORTEAR</span>
                            <span class="btn-counter">(${this.spinCount}/${this.maxSpins})</span>
                        </button>
                        <button id="reset-btn" class="reset-button">
                            <span class="btn-icon">🔄</span>
                            <span class="btn-text">Reiniciar</span>
                        </button>
                    </div>
                    
                    <div class="jackpot-display">
                        <div class="jackpot-label">ÚLTIMO SORTEO</div>
                        <div class="jackpot-numbers" id="last-result">
                            <span>-</span><span>-</span><span>-</span>
                        </div>
                    </div>
                </div>
                
                <div class="results-section" id="results-section" style="display: none;">
                    <h4 class="results-title">
                        <span class="results-icon">🎯</span>
                        Resultados de Sorteos
                    </h4>
                    <div class="results-container" id="results-container"></div>
                    
                    <div class="group-links-section" id="group-links" style="display: none;">
                        <h4 class="links-title">
                            <span class="links-icon">🔗</span>
                            Enlaces a Reuniones por Grupo
                        </h4>
                        <div class="group-links-container" id="group-links-container"></div>
                    </div>
                </div>
            </div>
        `;

        // Crear los reels con números
        this.createReels();
    }

    createReels() {
        for (let i = 0; i < 3; i++) {
            const reelElement = document.getElementById(`reel-${i}`);
            const reel = {
                element: reelElement,
                symbols: [],
                currentPosition: 0,
                targetPosition: 0,
                isSpinning: false
            };

            // Crear múltiples copias de los números para el efecto de scroll infinito
            const totalSymbols = this.numbers.length * 4; // 4 copias para scroll suave
            
            for (let j = 0; j < totalSymbols; j++) {
                const symbolDiv = document.createElement('div');
                symbolDiv.className = 'reel-symbol';
                symbolDiv.textContent = this.numbers[j % this.numbers.length];
                symbolDiv.style.height = `${this.symbolHeight}px`;
                symbolDiv.style.lineHeight = `${this.symbolHeight}px`;
                reelElement.appendChild(symbolDiv);
                reel.symbols.push(symbolDiv);
            }

            // Posición inicial aleatoria
            const initialPosition = Math.floor(Math.random() * this.numbers.length) * this.symbolHeight;
            reelElement.style.transform = `translateY(-${initialPosition}px)`;
            reel.currentPosition = initialPosition;

            this.reels.push(reel);
        }
    }

    setupEventListeners() {
        const spinBtn = document.getElementById('spin-btn');
        const resetBtn = document.getElementById('reset-btn');

        if (spinBtn) {
            spinBtn.addEventListener('click', () => this.spin());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
    }

    async spin() {
        if (this.isSpinning || this.spinCount >= this.maxSpins) return;

        this.isSpinning = true;
        this.spinCount++;
        
        // Actualizar UI
        this.updateSpinButton();
        this.startCasinoLights();
        
        // Reproducir sonido de inicio (simulado con vibración visual)
        this.playSpinSound();

        // Generar números objetivo
        const targetNumbers = [
            Math.floor(Math.random() * 18) + 1,
            Math.floor(Math.random() * 18) + 1,
            Math.floor(Math.random() * 18) + 1
        ];

        // Animar cada reel con delay
        const spinPromises = this.reels.map((reel, index) => 
            this.spinReel(reel, targetNumbers[index], index * this.reelStopDelay)
        );

        // Esperar a que todos los reels terminen
        await Promise.all(spinPromises);

        // Procesar resultado
        this.processResult(targetNumbers);
        
        this.isSpinning = false;
        this.stopCasinoLights();
        this.updateUI();
    }

    async spinReel(reel, targetNumber, delay) {
        return new Promise((resolve) => {
            setTimeout(() => {
                reel.isSpinning = true;
                
                // Calcular posición objetivo
                const targetIndex = targetNumber - 1;
                const basePosition = targetIndex * this.symbolHeight;
                
                // Agregar vueltas completas para efecto visual
                const extraSpins = 5 + Math.floor(Math.random() * 3); // 5-7 vueltas extra
                const totalDistance = basePosition + (extraSpins * this.numbers.length * this.symbolHeight);
                
                reel.targetPosition = totalDistance;

                // Animación con easing realista
                this.animateReelSpin(reel, totalDistance, () => {
                    reel.isSpinning = false;
                    resolve();
                });
            }, delay);
        });
    }

    animateReelSpin(reel, targetDistance, callback) {
        const startPosition = reel.currentPosition;
        const startTime = performance.now();
        const duration = this.spinDuration - (this.reels.indexOf(reel) * this.reelStopDelay);

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function para desaceleración realista (ease-out-cubic)
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            
            const currentDistance = startPosition + (targetDistance - startPosition) * easeOutCubic;
            
            // Aplicar transformación
            reel.element.style.transform = `translateY(-${currentDistance % (this.numbers.length * this.symbolHeight)}px)`;
            reel.currentPosition = currentDistance;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Asegurar posición final exacta
                const finalPosition = targetDistance % (this.numbers.length * this.symbolHeight);
                reel.element.style.transform = `translateY(-${finalPosition}px)`;
                reel.currentPosition = finalPosition;
                
                // Efecto de "bounce" al final
                this.addBounceEffect(reel.element);
                callback();
            }
        };

        requestAnimationFrame(animate);
    }

    addBounceEffect(element) {
        element.style.animation = 'reelBounce 0.3s ease-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 300);
    }

    playSpinSound() {
        // Simular sonido con efectos visuales
        const container = document.querySelector('.casino-slot-container');
        container.classList.add('spinning');
        
        setTimeout(() => {
            container.classList.remove('spinning');
        }, this.spinDuration);
    }

    startCasinoLights() {
        const lights = document.querySelectorAll('.light');
        lights.forEach((light, index) => {
            setTimeout(() => {
                light.classList.add('active');
            }, index * 100);
        });
    }

    stopCasinoLights() {
        const lights = document.querySelectorAll('.light');
        lights.forEach(light => {
            light.classList.remove('active');
        });
    }

    processResult(numbers) {
        const result = {
            sorteo: this.spinCount,
            numeros: numbers,
            timestamp: new Date().toISOString(),
            grupos: this.generateGroups(numbers)
        };

        this.results.push(result);
        this.saveResults();
        this.displayResult(result);
        this.updateLastResult(numbers);
        
        console.log(`🎯 Sorteo ${this.spinCount} completado:`, result);
    }

    generateGroups(numbers) {
        // Cada sorteo genera UN grupo con los 3 números
        // Los 3 números del sorteo van a la MISMA reunión
        const grupoNumero = this.spinCount; // Número del grupo (1-6)
        const grupo = {
            grupo: grupoNumero,
            numeros: numbers, // Los 3 números van juntos
            enlace: `https://meet.jit.si/EscenariosIA-Reunion${grupoNumero}`,
            participantes: numbers.map(num => `Participante #${num}`)
        };
        return [grupo]; // Retorna un solo grupo con los 3 números
    }

    displayResult(result) {
        const resultsSection = document.getElementById('results-section');
        const resultsContainer = document.getElementById('results-container');
        
        if (!resultsSection || !resultsContainer) return;

        resultsSection.style.display = 'block';

        const resultElement = document.createElement('div');
        resultElement.className = 'result-item';
        resultElement.innerHTML = `
            <div class="result-header">
                <span class="result-number">${result.sorteo}</span>
                <span class="result-time">${new Date(result.timestamp).toLocaleTimeString()}</span>
            </div>
            <div class="result-numbers">
                ${result.numeros.map(num => `<span class="result-num">${num}</span>`).join('')}
            </div>
        `;

        resultsContainer.insertBefore(resultElement, resultsContainer.firstChild);
        
        // Animar entrada
        setTimeout(() => {
            resultElement.classList.add('show');
        }, 100);

        this.updateGroupLinks();
    }

    updateLastResult(numbers) {
        const lastResult = document.getElementById('last-result');
        if (lastResult) {
            lastResult.innerHTML = numbers.map(num => `<span>${num}</span>`).join('');
            lastResult.classList.add('jackpot-animation');
            
            setTimeout(() => {
                lastResult.classList.remove('jackpot-animation');
            }, 1000);
        }
    }

    updateGroupLinks() {
        const groupLinksSection = document.getElementById('group-links');
        const groupLinksContainer = document.getElementById('group-links-container');
        
        if (!groupLinksSection || !groupLinksContainer) return;

        groupLinksSection.style.display = 'block';
        groupLinksContainer.innerHTML = '';
        
        // Mostrar enlaces para cada sorteo realizado
        this.results.forEach(result => {
            result.grupos.forEach(grupo => {
                const linkElement = document.createElement('a');
                linkElement.href = grupo.enlace;
                linkElement.target = '_blank';
                linkElement.className = `group-link reunion-${grupo.grupo}`;
                linkElement.innerHTML = `
                    <span class="group-icon">📹</span>
                    <span class="group-text">Reunión ${grupo.grupo}</span>
                    <span class="group-numbers">${grupo.numeros.join(', ')}</span>
                `;
                
                groupLinksContainer.appendChild(linkElement);
            });
        });
    }

    updateSpinButton() {
        const spinBtn = document.getElementById('spin-btn');
        if (!spinBtn) return;

        const counter = spinBtn.querySelector('.btn-counter');
        const btnText = spinBtn.querySelector('.btn-text');
        
        if (counter) {
            counter.textContent = `(${this.spinCount}/${this.maxSpins})`;
        }

        if (this.isSpinning) {
            spinBtn.disabled = true;
            spinBtn.classList.add('spinning');
            if (btnText) btnText.textContent = 'GIRANDO...';
        } else if (this.spinCount >= this.maxSpins) {
            spinBtn.disabled = true;
            spinBtn.classList.add('disabled');
            if (btnText) btnText.textContent = 'COMPLETADO';
        } else {
            spinBtn.disabled = false;
            spinBtn.classList.remove('spinning', 'disabled');
            if (btnText) btnText.textContent = 'SORTEAR';
        }
    }

    updateUI() {
        this.updateSpinButton();
    }

    reset() {
        if (this.isSpinning) return;

        this.spinCount = 0;
        this.results = [];
        
        // Limpiar resultados visuales
        const resultsContainer = document.getElementById('results-container');
        const groupLinksContainer = document.getElementById('group-links-container');
        const lastResult = document.getElementById('last-result');
        const resultsSection = document.getElementById('results-section');
        const groupLinksSection = document.getElementById('group-links');
        
        if (resultsContainer) resultsContainer.innerHTML = '';
        if (groupLinksContainer) groupLinksContainer.innerHTML = '';
        if (lastResult) lastResult.innerHTML = '<span>-</span><span>-</span><span>-</span>';
        if (resultsSection) resultsSection.style.display = 'none';
        if (groupLinksSection) groupLinksSection.style.display = 'none';

        // Resetear posiciones de reels
        this.reels.forEach(reel => {
            const randomPosition = Math.floor(Math.random() * this.numbers.length) * this.symbolHeight;
            reel.element.style.transform = `translateY(-${randomPosition}px)`;
            reel.currentPosition = randomPosition;
        });

        this.saveResults();
        this.updateUI();
        
        console.log('🔄 Tragamonedas reiniciado');
    }

    saveResults() {
        try {
            localStorage.setItem('slotMachineResults', JSON.stringify(this.results));
            localStorage.setItem('slotMachineSpinCount', this.spinCount.toString());
            console.log('💾 Resultados del tragamonedas guardados');
        } catch (error) {
            console.error('Error guardando resultados:', error);
        }
    }

    loadResults() {
        try {
            const savedResults = localStorage.getItem('slotMachineResults');
            const savedSpinCount = localStorage.getItem('slotMachineSpinCount');
            
            if (savedResults) {
                this.results = JSON.parse(savedResults);
                this.results.forEach(result => this.displayResult(result));
            }
            
            if (savedSpinCount) {
                this.spinCount = parseInt(savedSpinCount);
            }
            
            console.log('📂 Resultados del tragamonedas cargados');
        } catch (error) {
            console.error('Error cargando resultados:', error);
        }
    }

    getCurrentResults() {
        return {
            spinCount: this.spinCount,
            maxSpins: this.maxSpins,
            results: this.results,
            isSpinning: this.isSpinning
        };
    }
}

// Inicializar el tragamonedas mejorado cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Reemplazar el tragamonedas anterior
    if (window.slotMachine) {
        window.slotMachine = null;
    }
    
    window.casinoSlotMachine = new CasinoSlotMachine();
    console.log('🎰 Tragamonedas estilo casino inicializado');
});

// Exportar para uso global
window.CasinoSlotMachine = CasinoSlotMachine;

