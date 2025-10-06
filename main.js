document.addEventListener('DOMContentLoaded', () => {
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

    // --- SINCRONIZACIÓN DE LETRAS (AJUSTADO PARA EL NUEVO EFECTO) ---
    // Cada línea ahora tiene un 'start' y un 'end'
    const lyrics = [
        { start: 20, end: 24.5, text: "POR QUE ERES UN CIELO LLENO DE ESTRELLAS" },
        { start: 28, end: 30.5, text: "VOY A DARTE MI CORAZÓN" },
        { start: 35, end: 39.5, text: "POR QUE ERES UN CIELO LLENO DE ESTRELLAS" },
        { start: 43, end: 45.5, text: "POR QUE ILUMINAS EL CAMINO" },
        { start: 51, end: 55, text: "VAMOS, DESTRÓZAME" },
        { start: 58, end: 60.5, text: "NO ME IMPORTA SI LO HACES" },
        { start: 66, end: 70, text: "POR QUE EN UN CIELO LLENO DE ESTRELLAS" },
        { start: 71, end: 73.5, text: "CREO HABERTE VISTO" },
    ];
    let lyricIndex = 0;
    let audioContext, analyser, dataArray, source;
    let isAudioSetup = false;

    function setupPuzzle(){const e=Math.floor(Math.random()*TOTAL_PIECES);for(let t=0;t<TOTAL_PIECES;t++){const s=document.createElement("div");s.classList.add("puzzle-slot"),s.dataset.slotId=t;const o=`-${t%PUZZLE_DIMENSION*100}px -${Math.floor(t/PUZZLE_DIMENSION)*100}px`;if(s.style.backgroundPosition=o,t===e){s.classList.add("empty");const e=document.createElement("div");e.classList.add("puzzle-piece"),e.dataset.pieceId=t,e.draggable=!0,e.style.backgroundPosition=o,piecesContainer.appendChild(e),addDragDropListeners(e,s)}puzzleContainer.appendChild(s)}}
    function addDragDropListeners(e,t){e.addEventListener("dragstart",e=>{e.dataTransfer.setData("text/plain",e.target.dataset.pieceId),setTimeout(()=>e.target.classList.add("dragging"),0)}),e.addEventListener("dragend",e=>e.target.classList.remove("dragging")),t.addEventListener("dragover",e=>e.preventDefault()),t.addEventListener("drop",s=>{s.preventDefault(),s.currentTarget.dataset.slotId===s.dataTransfer.getData("text/plain")&&(s.currentTarget.classList.remove("empty"),s.currentTarget.style.border="none",e.style.display="none",startSurprise())})}
    function startSurprise(){inicioScreen.style.transition="opacity 1.5s ease",inicioScreen.style.opacity="0",setTimeout(()=>{inicioScreen.classList.add("hidden"),sorpresaScreen.classList.remove("hidden"),isAudioSetup||setupAudioAnalysis(),audioContext.resume().then(()=>{audioPlayer.play().catch(e=>console.error("Error al reproducir audio:",e))})},1500)}
    
    // --- LÓGICA DE LETRAS MODIFICADA ---
    audioPlayer.addEventListener('timeupdate', () => {
        const currentTime = audioPlayer.currentTime;
        // Si la canción termina, o si el tiempo actual ya pasó la última letra
        if (lyricIndex >= lyrics.length || currentTime > lyrics[lyrics.length - 1].end + 1) {
            if (letrasElement.classList.contains('visible')) {
                letrasElement.classList.remove('visible');
            }
            return;
        }

        const currentLyric = lyrics[lyricIndex];

        // Muestra la letra cuando empieza su tiempo
        if (currentTime >= currentLyric.start && currentTime < currentLyric.end) {
            if (!letrasElement.classList.contains('visible')) {
                // Prepara la nueva letra
                const duration = (currentLyric.end - currentLyric.start) - 0.2; // Duración de la animación
                letrasElement.setAttribute('data-text', currentLyric.text);
                // La transición del CSS se ajusta dinámicamente a la duración de la frase
                letrasElement.style.setProperty('--karaoke-duration', `${duration < 0 ? 0.5 : duration}s`);
                letrasElement.classList.add('visible');
            }
        } 
        // Oculta la letra cuando termina su tiempo
        else if (currentTime >= currentLyric.end) {
            letrasElement.classList.remove('visible');
            lyricIndex++;
        }
    });

    audioPlayer.addEventListener('ended', () => {
        letrasElement.classList.remove('visible');
        setTimeout(() => mensajeFinal.classList.remove('hidden'), 1500);
    });

    function setupAudioAnalysis(){if(isAudioSetup)return;audioContext=new(window.AudioContext||window.webkitAudioContext),analyser=audioContext.createAnalyser(),analyser.fftSize=256,source=audioContext.createMediaElementSource(audioPlayer),source.connect(analyser),source.connect(audioContext.destination),dataArray=new Uint8Array(analyser.frequencyBinCount),isAudioSetup=!0,updateFrame()}
    function updateFrame(){if(!isAudioSetup)return;analyser.getByteFrequencyData(dataArray);const e=dataArray.slice(0,5).reduce((e,t)=>e+t,0)/5,t=1+.05*(e/255),s=10+40*(e/255);marcoRitmico.style.transform=`scale(${t})`,marcoRitmico.style.boxShadow=`0 0 ${s}px var(--shadow-color)`,requestAnimationFrame(updateFrame)}
    const ctx=particleCanvas.getContext("2d");particleCanvas.width=window.innerWidth,particleCanvas.height=window.innerHeight;let particles=[];class Particle{constructor(){this.x=Math.random()*particleCanvas.width,this.y=Math.random()*particleCanvas.height,this.size=1+2*Math.random(),this.speedX=.5*Math.random()-.25,this.speedY=.5*Math.random()-.25,this.color="rgba(232, 138, 178, 0.5)"}update(){this.x+=this.speedX,this.y+=this.speedY,this.size>.1&&(this.size-=.01)}draw(){ctx.fillStyle=this.color,ctx.beginPath(),ctx.arc(this.x,this.y,this.size,0,2*Math.PI),ctx.fill()}}
    function initParticles(){for(let e=0;e<100;e++)particles.push(new Particle)}
    function animateParticles(){ctx.clearRect(0,0,particleCanvas.width,particleCanvas.height);for(let e=0;e<particles.length;e++)particles[e].update(),particles[e].draw(),particles[e].size<=.1&&(particles.splice(e,1),particles.push(new Particle),e--);requestAnimationFrame(animateParticles)}
    setupPuzzle(),initParticles(),animateParticles();
});
