/**
 * CYBERPUNK MATRIX RAIN
 * Interaktív Canvas Háttér
 */

const canvas = document.createElement('canvas');
canvas.id = 'cyber-bg';
// A body legelejére szúrjuk be, hogy minden mögött legyen
document.body.prepend(canvas);

const ctx = canvas.getContext('2d');

let width, height;
let gradient;

// Egér interakció változói
let mouse = { x: undefined, y: undefined };
const interactionRadius = 150; // Milyen közel kell lenni a színváltáshoz

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseleave', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Vászon méretezése
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    // Oszlopok újraszámolása átméretezéskor
    initColumns();
}

window.addEventListener('resize', resize);

// Karakterkészlet (Katakana + Latin + Számok)
const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
const charArray = chars.split('');

const fontSize = 14;
let columns = []; 
let drops = []; // Y pozíciók tárolása

function initColumns() {
    const columnCount = Math.floor(width / fontSize);
    drops = [];
    for (let i = 0; i < columnCount; i++) {
        // Véletlenszerű kezdőpozíciók, hogy ne egyszerre induljanak
        drops[i] = Math.random() * -100; 
    }
}

resize();
initColumns();

function draw() {
    // Félig átlátszó fekete téglalap a "csíkhúzós" (fade) effekthez
    // Ez adja a jellegzetes elmosódást
    ctx.fillStyle = 'rgba(5, 5, 5, 0.05)'; 
    ctx.fillRect(0, 0, width, height);

    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
        // Véletlenszerű karakter választása
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Pozíciók számolása
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // --- INTERAKTIVITÁS ---
        // Alapértelmezett szín: Neon Cián (#00f3ff)
        let color = '#00f3ff'; 

        // Ha az egér közel van, változzon a szín Neon Pinkre (#ff00ff) vagy Fehérre
        if (mouse.x != undefined) {
            const dx = mouse.x - x;
            const dy = mouse.y - y;
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            if (distance < interactionRadius) {
                // Minél közelebb van, annál világosabb
                if (distance < 50) color = '#ffffff'; // Hot spot
                else color = '#ff00ff'; // Interakciós zóna
            }
        }

        ctx.fillStyle = color;
        ctx.fillText(text, x, y);

        // Vissza a tetejére, ha leért (véletlenszerűséggel fűszerezve)
        if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        // Következő pozíció
        drops[i]++;
    }
    
    requestAnimationFrame(draw);
}

draw();