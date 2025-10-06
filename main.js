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
    const marcosDecorativos = document.querySelectorAll('.marco-decorativo');
    
    // --- CONSTANTES Y VARIABLES ---
    const lyrics = [
        { start: 20.5, end: 24.5, text: "PORQUE ERES UN CIELO LLENO DE ESTRELLAS" },
        { start: 28.5, end: 31, text: "TE DARÉ MI CORAZÓN" },
        { start: 35.5, end: 39.5, text: "PORQUE ERES UN CIELO LLENO DE ESTRELLAS" },
        { start: 43.0, end: 45.5, text: "PORQUE ILUMINAS EL CAMINO" },
        { start: 50.5, end: 54, text: "NO ME IMPORTA, ADELANTE, DESPEDÁZAME" },
        { start: 58.0, end: 60, text: "NO ME IMPORTA SI LO HACES" },
        { start: 65.5, end: 69.5, text: "PORQUE EN UN CIELO LLENO DE ESTRELLAS" },
        { start: 70.5, end: 72.5, text: "CREO QUE TE VI" },
        { start: 104.5, end: 108.5, text: "PORQUE ERES UN CIELO LLENO DE ESTRELLAS" },
        { start: 112.0, end: 115.0, text: "ME QUIERO MORIR EN TUS BRAZOS" },
        { start: 119.5, end: 123.0, text: "PORQUE CUANTO MÁS OSCURECE, MÁS TE ILUMINAS" },
        { start: 126.5, end: 129.5, text: "TE DARÉ MI CORAZÓN" },
        { start: 135.0, end: 138.5, text: "NO ME IMPORTA, ADELANTE, DESPEDÁZAME" },
        { start: 142.5, end: 144.5, text: "NO ME IMPORTA SI LO HACES" },
        { start: 150.0, end: 154.0, text: "PORQUE EN UN CIELO LLENO DE ESTRELLAS" },
        { start: 154.5, end: 157.0, text: "CREO QUE TE VEO" },
        { start: 204.0, end: 208.0, text: "ERES UN CIELO LLENO DE ESTRELLAS" },
        { start: 208.5, end: 211.5, text: "UNA VISIÓN TAN CELESTIAL" }
    ];
    let lyricIndex = 0;
    let audioContext, analyser, dataArray, source;
    let isAudioSetup = false;
    let contadorInterval;

    // --- FUNCIÓN DE CONTADOR PRECISA ---
    function updateContador() {
        const ahora = new Date();
        const inicioRelacion = new Date('2025-04-03T00:00:00');

        if (ahora < inicioRelacion) {
            // Si la fecha de inicio es en el futuro, mostramos un mensaje especial
            // Para la demostración, forzamos el cálculo a 7 meses.
            const mesesAMostrar = 7;
            const diasSimulados = 3; // Un día de ejemplo
            const horas = ahora.getHours().toString().padStart(2, '0');
            const minutos = ahora.getMinutes().toString().padStart(2, '0');
            const segundos = ahora.getSeconds().toString().padStart(2, '0');
            contadorElement.innerHTML = `${mesesAMostrar} Meses, ${diasSimulados} Día <br> ${horas}:${minutos}:${segundos}`;
            return;
        }

        // --- CÁLCULO REAL PARA FECHAS PASADAS ---
        let anos = ahora.getFullYear() - inicioRelacion.getFullYear();
        let meses = ahora.getMonth() - inicioRelacion.getMonth();
        let dias = ahora.getDate() - inicioRelacion.getDate();

        if (dias < 0) {
            meses--;
            const ultimoDiaMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0).getDate();
            dias += ultimoDiaMesAnterior;
        }
        if (meses < 0) {
            anos--;
            meses += 12;
        }
        meses += anos * 12;
        
        const horas = ahora.getHours().toString().padStart(2, '0');
        const minutos = ahora.getMinutes().toString().padStart(2, '0');
        const segundos = ahora.getSeconds().toString().padStart(2, '0');
        
        let textoMes = meses === 1 ? "Mes" : "Meses";
        let textoDia = dias === 1 ? "Día" : "Días";
        
        contadorElement.innerHTML = `${meses} ${textoMes}, ${dias} ${textoDia} <br> ${horas}:${minutos}:${segundos}`;
    }

    function setupPuzzle(){const e=document.getElementById("puzzle-container"),t=document.getElementById("puzzle-pieces"),s=Math.floor(9*Math.random());for(let c=0;c<9;c++){const a=document.createElement("div");a.classList.add("puzzle-slot"),a.dataset.slotId=c;const d=(c%3)*50,i=Math.floor(c/3)*50,l=`${d}% ${i}%`;if(a.style.backgroundPosition=l,c===s){a.classList.add("empty");const s=document.createElement("div");s.classList.add("puzzle-piece"),s.dataset.pieceId=c,s.draggable=!0,s.style.backgroundPosition=l,t.appendChild(s),addDragDropListeners(s,a)}e.appendChild(a)}}
    function addDragDropListeners(e,t){e.addEventListener("dragstart",e=>{e.dataTransfer.setData("text/plain",e.target.dataset.pieceId),setTimeout(()=>e.target.classList.add("dragging"),0)}),e.addEventListener("dragend",e=>e.target.classList.remove("dragging")),t.addEventListener("dragover",e=>e.preventDefault()),t.addEventListener("drop",s=>{s.preventDefault(),s.currentTarget.dataset.slotId===s.dataTransfer.getData("text/plain")&&(s.currentTarget.classList.remove("empty"),s.currentTarget.style.border="none",e.style.display="none",startSurprise())})}
    function startSurprise(){inicioScreen.style.transition="opacity 1.5s ease",inicioScreen.style.opacity="0",setTimeout(()=>{inicioScreen.classList.add("hidden"),sorpresaScreen.classList.remove("hidden"),updateContador(),contadorInterval=setInterval(updateContador,1e3),isAudioSetup||setupAudioAnalysis(),audioContext.resume().then(()=>{audioPlayer.play().catch(e=>console.error("Error al reproducir audio:",e))})},1500)}

    audioPlayer.addEventListener('timeupdate',()=>{const e=audioPlayer.currentTime;if(!(lyricIndex>=lyrics.length||e>lyrics[lyrics.length-1].end+1)){const t=lyrics[lyricIndex];e>=t.start&&e<t.end?!letrasElement.classList.contains("visible")&&(()=>{const s=t.end-t.start-.2;letrasElement.setAttribute("data-text",t.text),letrasElement.style.setProperty("--karaoke-duration",`${s<0?.5:s}s`),letrasElement.classList.add("visible")})():e>=t.end&&(letrasElement.classList.remove("visible"),lyricIndex++)}else letrasElement.classList.contains("visible")&&letrasElement.classList.remove("visible")});
    audioPlayer.addEventListener('ended',()=>{letrasElement.classList.remove("visible"),setTimeout(()=>mensajeFinal.classList.remove("hidden"),1500),clearInterval(contadorInterval)});
    function setupAudioAnalysis(){if(isAudioSetup)return;audioContext=new(window.AudioContext||window.webkitAudioContext),analyser=audioContext.createAnalyser(),analyser.fftSize=256,source=audioContext.createMediaElementSource(audioPlayer),source.connect(analyser),source.connect(audioContext.destination),dataArray=new Uint8Array(analyser.frequencyBinCount),isAudioSetup=!0,updateFrame()}
    
    function updateFrame() {
        if (!isAudioSetup) return;
        analyser.getByteFrequencyData(dataArray);
        const bass = dataArray.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
        const mainPulse=1+(bass/255)*.05,mainShadow=10+(bass/255)*40;marcoPrincipal.style.transform=`scale(${mainPulse})`,marcoPrincipal.style.boxShadow=`0 0 ${mainShadow}px var(--shadow-color)`;
        const infoPulse=1+(bass/255)*.02,infoShadow=(bass/255)*15;infoSuperior.style.transform=`translateX(-50%) scale(${infoPulse})`,infoSuperior.style.textShadow=`0 0 ${infoShadow}px var(--shadow-color)`;
        marcosDecorativos.forEach(e=>{const t=1+(bass/255)*.04,s=5+(bass/255)*20;e.style.transform=`scale(${t})`,e.style.boxShadow=`0 0 ${s}px var(--shadow-color)`});
        requestAnimationFrame(updateFrame);
    }

    const particleCanvas=document.getElementById("particle-canvas"),ctx=particleCanvas.getContext("2d");particleCanvas.width=window.innerWidth,particleCanvas.height=window.innerHeight;let particles=[];class Particle{constructor(){this.x=Math.random()*particleCanvas.width,this.y=Math.random()*particleCanvas.height,this.size=1+2*Math.random(),this.speedX=.5*Math.random()-.25,this.speedY=.5*Math.random()-.25,this.color="rgba(232, 138, 178, 0.5)"}update(){this.x+=this.speedX,this.y+=this.speedY,this.size>.1&&(this.size-=.01)}draw(){ctx.fillStyle=this.color,ctx.beginPath(),ctx.arc(this.x,this.y,this.size,0,2*Math.PI),ctx.fill()}}
    function initParticles(){for(let e=0;e<100;e++)particles.push(new Particle)}
    function animateParticles(){ctx.clearRect(0,0,particleCanvas.width,particleCanvas.height);for(let e=0;e<particles.length;e++)particles[e].update(),particles[e].draw(),particles[e].size<=.1&&(particles.splice(e,1),particles.push(new Particle),e--);requestAnimationFrame(animateParticles)}
    setupPuzzle(),initParticles(),animateParticles();
});
