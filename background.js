/**
 * CYBERPUNK 2077 - NETRUNNER BACKGROUND
 * Reaktív Canvas Animáció
 */

const canvas = document.createElement('canvas');
canvas.id = 'cyber-bg';
document.body.prepend(canvas); // A body elejére szúrjuk be

const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = 120; // Részecskék száma (mobilon kevesebb lehet)
const connectionDistance = 120; // Milyen közel kell lenni a vonalhoz
const mouseDistance = 180; // Egér interakció távolsága

// Cyberpunk Színpaletta
const colors = [
    '#fcee0a', // CP77 Sárga
    '#00f3ff', // Neon Cián
    '#ff00ff'  // Neon Pink
];

// Egér pozíció
let mouse = { x: null, y: null };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Vászon méretezése
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

// Részecske osztály
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.5; // Sebesség X
        this.vy = (Math.random() - 0.5) * 1.5; // Sebesség Y
        this.size = Math.random() * 2 + 1; // Méret
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Visszapattanás a falról
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Egér interakció (Kitérés)
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseDistance) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouseDistance - distance) / mouseDistance;
                
                // Ha közel van az egér, lökjük el kicsit (vagy vonzzuk)
                // Itt most finom kitérés effekt van:
                const directionX = forceDirectionX * force * 2;
                const directionY = forceDirectionY * force * 2;

                this.x -= directionX;
                this.y -= directionY;
            }
        }
    }

    draw() {
        ctx.beginPath();
        // Négyzetek a cyberpunk stílus miatt (kör helyett)
        ctx.rect(this.x, this.y, this.size * 2, this.size * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Inicializálás
function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Animációs hurok
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    // Hálózat rajzolása
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Vonalak a részecskék között
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 243, 255, ${1 - distance / connectionDistance})`; // Átlátszó cián
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }

        // Vonalak az egérhez (NETRUNNER LINK)
        if (mouse.x != null) {
            let dx = particles[i].x - mouse.x;
            let dy = particles[i].y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(252, 238, 10, ${1 - distance / mouseDistance})`; // Sárga kapcsolat
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
}

init();
animate();