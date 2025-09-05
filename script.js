// Elementos del DOM
const heart = document.getElementById('heart');
const vaultPanel = document.getElementById('vaultPanel');
const passwordInput = document.getElementById('passwordInput');
const submitBtn = document.getElementById('submitBtn');
const numpad = document.getElementById('numpad');
const loveLetter = document.getElementById('loveLetter');
const closeBtn = document.getElementById('closeBtn');
const fallingContainer = document.getElementById('fallingContainer');

// Contraseña correcta (puedes cambiarla por la que quieras)
const correctPassword = '2007';

// Evento para hacer clic en el corazón
heart.addEventListener('click', function() {
    // Efecto de pulso extra al hacer clic
    heart.style.animation = 'none';
    heart.offsetHeight; // Trigger reflow
    heart.style.animation = 'heartBeat 0.5s ease-in-out';
    
    // Mostrar el panel de la bóvida
    vaultPanel.style.display = 'block';
    
    // Efecto de aparición suave
    vaultPanel.style.opacity = '0';
    vaultPanel.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        vaultPanel.style.transition = 'all 0.5s ease';
        vaultPanel.style.opacity = '1';
        vaultPanel.style.transform = 'scale(1)';
    }, 100);
    
    // Enfocar el input de contraseña
    setTimeout(() => {
        passwordInput.focus();
    }, 600);
});

// Evento para el botón de envío
submitBtn.addEventListener('click', validatePassword);

// Evento para la tecla Enter en el input
passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        validatePassword();
    }
});

// Clicks en el numpad
numpad.addEventListener('click', function(e) {
    const target = e.target;
    if (!target.classList.contains('key')) return;
    triggerFeedback();
    const key = target.getAttribute('data-key');
    const action = target.getAttribute('data-action');
    
    if (key) {
        if (passwordInput.value.length < 4) {
            passwordInput.value += key;
        }
        if (passwordInput.value.length === 4) {
            validatePassword();
        }
        return;
    }
    
    if (action === 'clear') {
        passwordInput.value = '';
        return;
    }
    
    if (action === 'back') {
        passwordInput.value = passwordInput.value.slice(0, -1);
        return;
    }
});

// Feedback háptico y sonoro para teclas
let audioCtx;
function triggerFeedback() {
    // Vibración (si está disponible)
    if (navigator.vibrate) {
        navigator.vibrate(15);
    }
    // Sonido corto (click suave)
    try {
        if (!audioCtx) {
            // Crear contexto de audio en la primera interacción del usuario
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        const duration = 0.06; // 60ms
        const oscillator = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(900, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        oscillator.connect(gain).connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    } catch (err) {
        // Ignorar errores de audio (p. ej., políticas del navegador)
    }
}

// Función para validar la contraseña
function validatePassword() {
    const inputPassword = passwordInput.value;
    
    if (inputPassword === correctPassword) {
        // Contraseña correcta - mostrar la carta
        showLoveLetter();
        
        // Ocultar el panel de la bóvida
        vaultPanel.style.opacity = '0';
        vaultPanel.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            vaultPanel.style.display = 'none';
            passwordInput.value = '';
        }, 500);
        
    } else {
        // Contraseña incorrecta - efecto de error
        passwordInput.style.borderColor = '#e74c3c';
        passwordInput.style.animation = 'shake 0.5s ease-in-out';
        
        // Limpiar el input
        passwordInput.value = '';
        passwordInput.focus();
        
        // Restaurar el borde después de la animación
        setTimeout(() => {
            passwordInput.style.borderColor = '#e74c3c';
            passwordInput.style.animation = '';
        }, 500);
    }
}

// Función para mostrar la carta de amor
function showLoveLetter() {
    loveLetter.style.display = 'flex';
    
    // Efecto de aparición suave
    loveLetter.style.opacity = '0';
    
    setTimeout(() => {
        loveLetter.style.transition = 'opacity 1s ease';
        loveLetter.style.opacity = '1';
    }, 100);
    
    // Efecto especial para los corazones flotantes
    const floatingHearts = document.querySelectorAll('.floating-heart');
    floatingHearts.forEach((heart, index) => {
        heart.style.animationDelay = `${index * 0.2}s`;
    });
}

// Evento para cerrar la carta
closeBtn.addEventListener('click', function() {
    loveLetter.style.opacity = '0';
    
    setTimeout(() => {
        loveLetter.style.display = 'none';
    }, 1000);
});

// Cerrar la carta con la tecla Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && loveLetter.style.display === 'flex') {
        closeBtn.click();
    }
});

// Cerrar la carta haciendo clic fuera de ella
loveLetter.addEventListener('click', function(e) {
    if (e.target === loveLetter) {
        closeBtn.click();
    }
});

// Efectos adicionales para el corazón
heart.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.05)';
    this.style.transition = 'transform 0.3s ease';
});

heart.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
});

// Efecto de partículas cuando se hace clic en el corazón
function createHeartParticle() {
    const particle = document.createElement('div');
    particle.innerHTML = '❤️';
    particle.style.position = 'fixed';
    particle.style.left = heart.offsetLeft + heart.offsetWidth / 2 + 'px';
    particle.style.top = heart.offsetTop + heart.offsetHeight / 2 + 'px';
    particle.style.fontSize = '20px';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1000';
    particle.style.transition = 'all 1s ease';
    
    document.body.appendChild(particle);
    
    // Animación de la partícula
    setTimeout(() => {
        particle.style.transform = 'translateY(-100px) scale(0)';
        particle.style.opacity = '0';
    }, 100);
    
    // Remover la partícula después de la animación
    setTimeout(() => {
        document.body.removeChild(particle);
    }, 1100);
}

// Crear partículas al hacer clic en el corazón
heart.addEventListener('click', function() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createHeartParticle();
        }, i * 100);
    }
});

// Emojis cayendo (corazones y flores) con pulso suave
const fallingEmojis = ['💖','💘','💝','🌸','🌺','🌹','💗','❤️'];

function spawnFallingEmoji() {
    const el = document.createElement('div');
    el.className = 'falling-emoji';
    const inner = document.createElement('span');
    inner.className = 'pulse';
    inner.textContent = fallingEmojis[Math.floor(Math.random() * fallingEmojis.length)];
    el.appendChild(inner);

    const startLeftPercent = Math.random() * 100; // 0-100vw
    const driftPx = (Math.random() * 120 - 60).toFixed(0); // -60 to 60px
    const duration = (10 + Math.random() * 10).toFixed(1); // 10s - 20s
    const size = 18 + Math.random() * 18; // 18px - 36px

    el.style.left = `${startLeftPercent}vw`;
    el.style.setProperty('--drift', `${driftPx}px`);
    el.style.setProperty('--fall-duration', `${duration}s`);
    el.style.fontSize = `${size}px`;

    fallingContainer.appendChild(el);

    // Remover al terminar
    const totalLifetime = parseFloat(duration) * 1000 + 2000;
    setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
    }, totalLifetime);
}

// Flujo continuo y lento
let fallingIntervalId;
function startFallingEmojis() {
    if (fallingIntervalId) return;
    // Lanzamiento inmediato para que no tarden en aparecer
    for (let i = 0; i < 4; i++) spawnFallingEmoji();
    
    fallingIntervalId = setInterval(() => {
        // Spawnea 1-2 por tick para fluidez
        const count = Math.random() < 0.4 ? 2 : 1;
        for (let i = 0; i < count; i++) spawnFallingEmoji();
    }, 500);
}

function stopFallingEmojis() {
    clearInterval(fallingIntervalId);
    fallingIntervalId = null;
}

// Iniciar al cargar
startFallingEmojis();

// Efecto de brillo en el panel de la bóvida
function addVaultGlow() {
    vaultPanel.style.boxShadow = `
        0 20px 40px rgba(0, 0, 0, 0.3),
        inset 0 0 20px rgba(231, 76, 60, 0.2),
        0 0 30px rgba(231, 76, 60, 0.5)
    `;
}

// Aplicar brillo cuando se muestra el panel
heart.addEventListener('click', addVaultGlow);

// Función para agregar efecto de escritura en la carta
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Aplicar efecto de escritura cuando se muestra la carta
function showLoveLetterWithTypewriter() {
    originalShowLoveLetter();
    
    // Aplicar efecto de escritura al título
    const title = document.querySelector('.letter-text h1');
    const originalTitle = title.textContent;
    
    setTimeout(() => {
        typeWriter(title, originalTitle, 100);
    }, 500);
}

// Reemplazar la función original
const originalShowLoveLetter = showLoveLetter;
showLoveLetter = showLoveLetterWithTypewriter;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Agregar estilos CSS dinámicos para la animación de shake
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
    
    // Mensaje de bienvenida en la consola
    console.log('💖 Proyecto de amor para Allison cargado con éxito! 💖');
    console.log('💝 Contraseña: ' + correctPassword + ' 💝');
});
