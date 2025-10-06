document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURACIÓN Y CONSTANTES ---
    const inicioScreen = document.getElementById('inicio');
    const sorpresaScreen = document.getElementById('sorpresa');
    const puzzleContainer = document.getElementById('puzzle-container');
    const piecesContainer = document.getElementById('puzzle-pieces');
    const marcoRitmico = document.getElementById('marco-ritmico');
    const audioPlayer = document.getElementById('audio-player');
    const letrasElement = document.getElementById('letras');
    const mensajeFinal = document.getElementById('mensaje-final');
    const particleCanvas = document.getElementById('particle-canvas');

    const PUZZLE_DIMENSION = 3;
    const TOTAL_PIECES = PUZZLE_DIMENSION * PUZZLE_DIMENSION;

    // --- SINCRONIZACIÓN DE LETRAS ---
    const lyrics = [
        { time: 3, text: "Y apareciste con tu luz..." },
        { time: 7, text: "No necesité más que un par de besos" },
        { time: 11, text: "Y me robaste el corazón" },
        { time: 15, text: "No necesité más que escuchar tu voz" },
        { time: 20, text: "Y tu forma de ver la vida" },
        { time: 24, text: "Me enamoró" },
        { time: 28, text: "Y ahora que estás aquí..." },
        { time: 31, text: "Veo el mundo de otro modo" }
    ];
    let lyricIndex = 0;
    
    // --- MODIFICACIÓN CLAVE: Inicialización del AudioContext ---
    // Creamos el contexto de audio aquí, pero estará "suspendido" hasta que el usuario interactúe.
    let audioContext, analyser, dataArray, source;
    let isAudioSetup = false; // Bandera para asegurar que se configure una sola vez

    // --- LÓGICA DEL ROMPECABEZAS ---
    function setupPuzzle() {
        const missingPieceIndex = Math.floor(Math.random() * TOTAL_PIECES);
        for (let i = 0; i < TOTAL_PIECES; i++) {
            const slot = document.createElement('div');
            slot.classList.add('puzzle-slot');
            slot.dataset.slotId = i;
            const bgPosX = `-${(i % PUZZLE_DIMENSION) * 100}px`;
            const bgPosY = `-${Math.floor(i / PUZZLE_DIMENSION) * 100}px`;
            slot.style.backgroundPosition = `${bgPosX} ${bgPosY}`;
            if (i === missingPieceIndex) {
                slot.classList.add('empty');
                const draggablePiece = document.createElement('div');
                draggablePiece.classList.add('puzzle-piece');
                draggablePiece.dataset.pieceId = i;
                draggablePiece.draggable = true;
                draggablePiece.style.backgroundPosition = `${bgPosX} ${bgPosY}`;
                piecesContainer.appendChild(draggablePiece);
                addDragDropListeners(draggablePiece, slot);
            }
            puzzleContainer.appendChild(slot);
        }
    }

    function addDragDropListeners(piece, emptySlot) {
        piece.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.pieceId);
            setTimeout(() => e.target.classList.add('dragging'), 0);
        });
        piece.addEventListener('dragend', (e) => e.target.classList.remove('dragging'));
        emptySlot.addEventListener('dragover', (e) => e.preventDefault());
        emptySlot.addEventListener('drop', (e) => {
            e.preventDefault();
            const pieceId = e.dataTransfer.getData('text/plain');
            if (e.currentTarget.dataset.slotId === pieceId) {
                e.currentTarget.classList.remove('empty');
                e.currentTarget.style.border = 'none';
                piece.style.display = 'none';
                startSurprise(); // Inicia la sorpresa al resolver
            }
        });
    }

    // --- FUNCIÓN PARA INICIAR LA SORPRESA ---
    function startSurprise() {
        inicioScreen.style.transition = 'opacity 1.5s ease';
        inicioScreen.style.opacity = '0';
        setTimeout(() => {
            inicioScreen.classList.add('hidden');
            sorpresaScreen.classList.remove('hidden');
            
            // --- CORRECCIÓN IMPORTANTE ---
            // Activamos el audio y el análisis DESPUÉS de la interacción del usuario.
            if (!isAudioSetup) {
                setupAudioAnalysis();
            }
            
            // Reanudamos el contexto de audio (si estaba suspendido) y reproducimos.
            audioContext.resume().then(() => {
                audioPlayer.play().catch(e => console.error("Error al reproducir audio:", e));
            });

        }, 1500);
    }

    // --- ANÁLISIS DE AUDIO PARA MARCO RÍTMICO ---
    function setupAudioAnalysis() {
        if (isAudioSetup) return;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source = audioContext.createMediaElementSource(audioPlayer);
        source.connect(analyser);
        source.connect(audioContext.destination);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        isAudioSetup = true; // Marcamos como configurado
        updateFrame(); // Iniciamos el bucle de animación del marco
    }

    function updateFrame() {
        if (!isAudioSetup) return;
        
        analyser.getByteFrequencyData(dataArray);
        const bass = dataArray.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
        const scale = 1 + (bass / 255) * 0.05;
        const shadowIntensity = 10 + (bass / 255) * 40;
        
        marcoRitmico.style.transform = `scale(${scale})`;
        marcoRitmico.style.boxShadow = `0 0 ${shadowIntensity}px var(--shadow-color)`;
        
        requestAnimationFrame(updateFrame); // Mantiene el efecto funcionando
    }

    // --- MANEJO DE LETRAS Y MENSAJE FINAL ---
    audioPlayer.addEventListener('timeupdate', () => {
        if (lyricIndex < lyrics.length && audioPlayer.currentTime > lyrics[lyricIndex].time) {
            letrasElement.classList.remove('visible');
            setTimeout(() => {
                letrasElement.innerText = lyrics[lyricIndex].text;
                letrasElement.classList.add('visible');
                lyricIndex++;
            }, 100);
        }
    });

    audioPlayer.addEventListener('ended', () => {
        letrasElement.classList.remove('visible');
        setTimeout(() => mensajeFinal.classList.remove('hidden'), 1500);
    });

    // --- EFECTO DE PARTÍCULAS EN EL CANVAS ---
    const ctx = particleCanvas.getContext('2d');
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    let particles = [];
    class Particle {
        constructor() { this.x = Math.random() * particleCanvas.width; this.y = Math.random() * particleCanvas.height; this.size = Math.random() * 2 + 1; this.speedX = Math.random() * 0.5 - 0.25; this.speedY = Math.random() * 0.5 - 0.25; this.color = 'rgba(232, 138, 178, 0.5)'; }
        update() { this.x += this.speedX; this.y += this.speedY; if (this.size > 0.1) this.size -= 0.01; }
        draw() { ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
    }
    function initParticles() { for (let i = 0; i < 100; i++) particles.push(new Particle()); }
    function animateParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].size <= 0.1) { particles.splice(i, 1); particles.push(new Particle()); i--; }
        }
        requestAnimationFrame(animateParticles);
    }

    // --- INICIALIZACIÓN ---
    setupPuzzle();
    initParticles();
    animateParticles();
});