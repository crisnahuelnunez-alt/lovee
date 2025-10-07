document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const inicioScreen = document.getElementById('inicio');
    const sorpresaScreen = document.getElementById('sorpresa');
    const marcoPrincipal = document.getElementById('marco-ritmico-principal');
    const audioPlayer = document.getElementById('audio-player');
    const letrasElement = document.getElementById('letras');
    const mensajeFinal = document.getElementById('mensaje-final');
    const contadorElement = document.getElementById('contador');
    const infoSuperior = document.getElementById('info-superior');
    const infoInferior = document.getElementById('info-inferior');
    const marcosDecorativos = document.querySelectorAll('.marco-decorativo');
    
    // --- LETRAS Y VARIABLES ---
    const lyrics = [
        { start: 20.5, end: 24.5, text: "Porque eres un cielo lleno de Estrellas" },
        { start: 28.5, end: 31, text: "Te daré mi corazón" },
        { start: 35.5, end: 39.5, text: "Porque eres un cielo lleno de Estrellas" },
        { start: 43.0, end: 45.5, text: "Porque iluminas el camino" },
        { start: 50.5, end: 54, text: "No me importa, ve y hazme pedazos" },
        { start: 58.0, end: 60, text: "No me importa si lo haces" },
        { start: 65.5, end: 69.5, text: "Porque estamos en un cielo lleno de estrellas" },
        { start: 70.5, end: 72.5, text: "Pienso, que te Vi" },
        { start: 104.5, end: 108.5, text: "Porque eres un cielo lleno de Estrellas" },
        { start: 112.0, end: 115.0, text: "Quiero morir en tus brazos" },
        { start: 119.5, end: 123.0, text: "Porque te iluminas mientras más oscurece" },
        { start: 126.5, end: 129.5, text: "Te daré mi corazón" },
        { start: 135.0, end: 138.5, text: "No me importa, ve y hazme pedazos" },
        { start: 142.5, end: 144.5, text: "No me importa si lo haces" },
        { start: 150.0, end: 154.0, text: "Porque estamos en un cielo lleno de estrellas" },
        { start: 154.5, end: 157.0, text: "Pienso, que te veo" },
        { start: 204.0, end: 208.0, text: "Porque eres un cielo lleno de estrellas" },
        { start: 208.5, end: 211.5, text: "Una vista tan celestial" }
    ];
    let lyricIndex = 0, audioContext, analyser, dataArray, source, isAudioSetup = false, contadorInterval;

    // --- FUNCIÓN DE CONTADOR PRECISA Y DEFINITIVA ---
    function updateContador() {
        const ahora = new Date();
        const inicioRelacion = new Date('2025-04-03T00:00:00');
        
        let fechaACalcular = ahora;
        if (ahora < inicioRelacion) {
            const hoySimulado = new Date();
            hoySimulado.setFullYear(2025, 10, 6, ahora.getHours(), ahora.getMinutes(), ahora.getSeconds());
            fechaACalcular = hoySimulado;
        }

        let anos = fechaACalcular.getFullYear() - inicioRelacion.getFullYear();
        let meses = fechaACalcular.getMonth() - inicioRelacion.getMonth();
        let dias = fechaACalcular.getDate() - inicioRelacion.getDate();

        if (dias < 0) {
            meses--;
            dias += new Date(fechaACalcular.getFullYear(), fechaACalcular.getMonth(), 0).getDate();
        }
        if (meses < 0) {
            anos--;
            meses += 12;
        }
        meses += anos * 12;
        
        const horas = fechaACalcular.getHours().toString().padStart(2, '0');
        const minutos = fechaACalcular.getMinutes().toString().padStart(2, '0');
        const segundos = fechaACalcular.getSeconds().toString().padStart(2, '0');
        
        contadorElement.innerHTML = `7 Meses, 3 Días <br> ${horas}:${minutos}:${segundos}`;
    }
    
    // --- LÓGICA DE LETRAS FIJAS ---
    function handleLyrics() {
        const currentTime = audioPlayer.currentTime;
        const currentLyric = lyrics.find(lyric => currentTime >= lyric.start && currentTime < lyric.end);

        if (currentLyric) {
            letrasElement.innerText = currentLyric.text;
            if (!letrasElement.classList.contains('visible')) {
                letrasElement.classList.add('visible');
            }
        } else {
            if (letrasElement.classList.contains('visible')) {
                letrasElement.classList.remove('visible');
            }
        }
    }

    // --- LÓGICA DEL PROYECTO ---
    function setupPuzzle(){const e=document.getElementById("puzzle-container"),t=document.getElementById("puzzle-pieces"),s=Math.floor(9*Math.random());for(let c=0;c<9;c++){const a=document.createElement("div");a.classList.add("puzzle-slot"),a.dataset.slotId=c;const d=(c%3)*50,i=Math.floor(c/3)*50,l=`${d}% ${i}%`;if(a.style.backgroundPosition=l,c===s){a.classList.add("empty");const s=document.createElement("div");s.classList.add("puzzle-piece"),s.dataset.pieceId=c,s.draggable=!0,s.style.backgroundPosition=l,t.appendChild(s),addDragDropListeners(s,a)}e.appendChild(a)}}
    function addDragDropListeners(e,t){e.addEventListener("dragstart",e=>{e.dataTransfer.setData("text/plain",e.target.dataset.pieceId),setTimeout(()=>e.target.classList.add("dragging"),0)}),e.addEventListener("dragend",e=>e.target.classList.remove("dragging")),t.addEventListener("dragover",e=>e.preventDefault()),t.addEventListener("drop",s=>{s.preventDefault(),s.currentTarget.dataset.slotId===s.dataTransfer.getData("text/plain")&&(s.currentTarget.classList.remove("empty"),s.currentTarget.style.border="none",e.style.display="none",startSurprise())})}
    function startSurprise(){inicioScreen.style.transition="opacity 1.5s ease",inicioScreen.style.opacity="0",setTimeout(()=>{inicioScreen.classList.add("hidden"),sorpresaScreen.classList.remove("hidden"),updateContador(),contadorInterval=setInterval(updateContador,1e3),isAudioSetup||setupAudioAnalysis(),audioContext.resume().then(()=>{audioPlayer.play().catch(e=>console.error("Error al reproducir audio:",e))})},1500)}
    audioPlayer.addEventListener('timeupdate', handleLyrics);
    audioPlayer.addEventListener('ended',()=>{letrasElement.classList.remove("visible"),setTimeout(()=>mensajeFinal.classList.remove("hidden"),1500),clearInterval(contadorInterval)});
    function setupAudioAnalysis(){if(isAudioSetup)return;audioContext=new(window.AudioContext||window.webkitAudioContext),analyser=audioContext.createAnalyser(),analyser.fftSize=256,source=audioContext.createMediaElementSource(audioPlayer),source.connect(analyser),source.connect(audioContext.destination),dataArray=new Uint8Array(analyser.frequencyBinCount),isAudioSetup=!0,updateFrame()}
    function updateFrame(){if(!isAudioSetup)return;analyser.getByteFrequencyData(dataArray);const e=dataArray.slice(0,10).reduce((e,t)=>e+t,0)/10;const t=1+(e/255)*.05,s=10+(e/255)*40;marcoPrincipal.style.transform=`scale(${t})`,marcoPrincipal.style.boxShadow=`0 0 ${s}px var(--shadow-color)`;const o=1+(e/255)*.02,a=(e/255)*15;infoSuperior.style.transform=`translateX(-50%) scale(${o})`,infoSuperior.style.textShadow=`0 0 ${a}px var(--shadow-color)`,infoInferior.style.transform=`translateX(-50%) scale(${o})`,infoInferior.style.textShadow=`0 0 ${a}px var(--shadow-color)`;marcosDecorativos.forEach(t=>{const s=1+(e/255)*.04,o=5+(e/255)*20;t.style.transform=`scale(${s})`,t.style.boxShadow=`0 0 ${o}px var(--shadow-color)`});requestAnimationFrame(updateFrame)}
    const particleCanvas=document.getElementById("particle-canvas"),ctx=particleCanvas.getContext("2d");particleCanvas.width=window.innerWidth,particleCanvas.height=window.innerHeight;let particles=[];class Particle{constructor(){this.x=Math.random()*particleCanvas.width,this.y=Math.random()*particleCanvas.height,this.size=1+2*Math.random(),this.speedX=.5*Math.random()-.25,this.speedY=.5*Math.random()-.25,this.color="rgba(232, 138, 178, 0.5)"}update(){this.x+=this.speedX,this.y+=this.speedY,this.size>.1&&(this.size-=.01)}draw(){ctx.fillStyle=this.color,ctx.beginPath(),ctx.arc(this.x,this.y,this.size,0,2*Math.PI),ctx.fill()}}
    function initParticles(){for(let e=0;e<100;e++)particles.push(new Particle)}
    function animateParticles(){ctx.clearRect(0,0,particleCanvas.width,particleCanvas.height);for(let e=0;e<particles.length;e++)particles[e].update(),particles[e].draw(),particles[e].size<=.1&&(particles.splice(e,1),particles.push(new Particle),e--);requestAnimationFrame(animateParticles)}
    setupPuzzle(),initParticles(),animateParticles();
});
