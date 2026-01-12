document.addEventListener('DOMContentLoaded', () => {
    // Létrehozzuk a kurzor elemeit dinamikusan
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.classList.add('custom-cursor-dot');
    document.body.appendChild(cursorDot);

    // Egér pozíció változók
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Egér mozgás követése
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // A pötty azonnal követi
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Animációs hurok a "csúszó" (lag) effekthez a gyűrűn
    function animateCursor() {
        // Lineáris interpoláció (LERP) a sima mozgásért
        const speed = 0.15; // 0.1 lassabb, 0.2 gyorsabb
        
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Interakciók (Hover effektek)
    const interactiveElements = document.querySelectorAll('a, button, .gomb, .projekt-kartya, input, textarea');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover-active');
            cursorDot.classList.add('hover-active');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover-active');
            cursorDot.classList.remove('hover-active');
        });
    });

    // Kattintás effekt
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click-active');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click-active');
    });
});