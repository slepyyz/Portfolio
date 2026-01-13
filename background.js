/**
 * CYBERPUNK "DEEP NET" BACKGROUND
 * Lassú, elegáns, hálózatos animáció
 */

const canvas = document.createElement('canvas');
canvas.id = 'cyber-bg';
// Ha van már ilyen, cseréljük, ha nincs, beszúrjuk
const existingCanvas = document.getElementById('cyber-bg');
if (existingCanvas) {
    existingCanvas.replaceWith(canvas);
} else {
    document.body.prepend(canvas);
}

const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
// Kevesebb részecske a tisztább hatásért
const particleCount = window.innerWidth < 768 ? 30 : 50; 
const connectionDistance = 150; // Milyen messziről kössön össze

// Egér
let mouse = { x: null, y: null };
const mouseRadius = 200; // Ekkora körben reagál az egérre

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Nagyon lassú mozgás a nyugodt hatáshoz
        this.vx = (Math.random() - 0.5) * 0.3; 
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5 + 0.5; // Apró pöttyök
        
        // Sötétebb alapszín (szürke/kék), csak interakciónál lesz fényes
        this.baseColor = 'rgba(100, 116, 139, 0.5)'; 
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Visszapattanás a falakról
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Egér interakció
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseRadius) {
                // Ha közel van az egér, kicsit nagyobbra nő
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouseRadius - distance) / mouseRadius;
                
                // Enyhe taszítás, hogy "utat törj" az adatok közt
                const directionX = forceDirectionX * force * 0.6;
                const directionY = forceDirectionY * force * 0.6;

                this.x -= directionX;
                this.y -= directionY;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.baseColor;
        ctx.fill();
    }
}

function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Kapcsolatok rajzolása
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                
                // Alapból nagyon halvány vonal
                let opacity = 1 - (distance / connectionDistance);
                let strokeColor = `rgba(100, 116, 139, ${opacity * 0.1})`; // Alig látható

                // Ha az egér közel van, a vonalak felizzanak (Neon Cián)
                if (mouse.x != null) {
                    let mouseDx = mouse.x - particles[i].x;
                    let mouseDy = mouse.y - particles[i].y;
                    let mouseDist = Math.sqrt(mouseDx*mouseDx + mouseDy*mouseDy);

                    if (mouseDist < mouseRadius) {
                        // Fényesebb és ciánkék lesz
                        strokeColor = `rgba(0, 243, 255, ${opacity * 0.6})`;
                    }
                }

                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

init();
animate();