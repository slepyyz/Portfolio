/**
 * CYBERPUNK BOOT SEQUENCE V2.1 (Automata Jelszó)
 * Rendszerindító animáció automatikus jelszóbeírással
 */

// ================= BEÁLLÍTÁSOK =================
const BIZTONSAGI_ELLENORZES = true; // true = fusson le a jelszó animáció
const HELYES_JELSZO = "netrunner";  // A jelszó, amit a gép "begépel"
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
    // Ellenőrizzük, hogy futott-e már a boot ebben a munkamenetben
    if (sessionStorage.getItem('systemBooted')) {
        const bootScreen = document.getElementById('boot-screen');
        if (bootScreen) bootScreen.style.display = 'none';
        return;
    }

    initBootSequence();
});

function initBootSequence() {
    // Boot képernyő létrehozása
    const bootScreen = document.createElement('div');
    bootScreen.id = 'boot-screen';
    
    const terminal = document.createElement('div');
    terminal.id = 'boot-terminal';
    
    bootScreen.appendChild(terminal);
    document.body.prepend(bootScreen);

    // Görgetés tiltása
    document.body.style.overflow = 'hidden';

    // 1. SZAKASZ: Induló üzenetek
    const bootPhase1 = [
        { text: "INITIALIZING BIOS...", delay: 200 },
        { text: "CHECKING MEMORY INTEGRITY... [OK]", delay: 400 },
        { text: "LOADING KERNEL V.2.0.77...", delay: 400 },
        { text: "MOUNTING FILE SYSTEM...", delay: 600 },
        { text: "> CONNECTING TO NEURAL NET...", delay: 800 },
    ];

    runSequence(terminal, bootPhase1, () => {
        // Ha lefutott az első szakasz, jön a jelszó rész
        if (BIZTONSAGI_ELLENORZES) {
            autoTypePassword(terminal, bootScreen);
        } else {
            finishBootSequence(terminal, bootScreen);
        }
    });
}

// Automatikus jelszó beíró logika
function autoTypePassword(terminal, bootScreen) {
    const p = document.createElement('p');
    // Kezdő szöveg kurzorral
    p.innerHTML = "SECURITY CHECK REQUIRED. ENTER PASSCODE: <span id='input-cursor'>_</span>";
    p.style.color = "#fcee0a"; // Sárga figyelmeztetés
    terminal.appendChild(p);
    terminal.scrollTop = terminal.scrollHeight;

    let currentText = "";
    let charIndex = 0;

    // A "gépelés" funkció
    function typeNextChar() {
        if (charIndex < HELYES_JELSZO.length) {
            currentText += HELYES_JELSZO.charAt(charIndex);
            
            // Frissítjük a szöveget, a kurzor marad a végén
            p.innerHTML = `SECURITY CHECK REQUIRED. ENTER PASSCODE: ${currentText}<span id='input-cursor'>_</span>`;
            
            charIndex++;
            // Véletlenszerű késleltetés a gépelés érzéséért (50ms - 150ms között)
            const randomTypingDelay = Math.floor(Math.random() * 100) + 50;
            setTimeout(typeNextChar, randomTypingDelay);
        } else {
            // Ha végzett a gépeléssel
            setTimeout(() => {
                // SIKERES JELSZÓ ÜZENET
                addLine(terminal, "ACCESS GRANTED.", "color: #00ff00; font-weight: bold; text-shadow: 0 0 10px #00ff00;");
                
                // Folytatás
                setTimeout(() => {
                    finishBootSequence(terminal, bootScreen);
                }, 800);
            }, 500); // Kis szünet a gépelés vége és az elfogadás között
        }
    }

    // Indítás 1 másodperc késleltetéssel
    setTimeout(typeNextChar, 1000);
}

// 2. SZAKASZ: Befejezés
function finishBootSequence(terminal, bootScreen) {
    const bootPhase2 = [
        { text: "> ESTABLISHING SECURE UPLINK...", delay: 400 },
        { text: "USER IDENTITY VERIFIED: [SZONTAGH_A]", delay: 600 },
        { text: "LOADING INTERFACE ASSETS...", delay: 400 },
        { text: "SYSTEM ONLINE. WELCOME, NETRUNNER.", delay: 800, style: "color: #fcee0a; font-weight: bold;" }
    ];

    runSequence(terminal, bootPhase2, () => {
        setTimeout(() => {
            // "Kikapcsolás" animáció
            bootScreen.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-in';
            bootScreen.style.opacity = '0';
            bootScreen.style.transform = 'scale(1.1)';
            
            document.body.style.overflow = 'auto';
            sessionStorage.setItem('systemBooted', 'true');

            setTimeout(() => {
                bootScreen.remove();
            }, 500);
        }, 1500);
    });
}

// Segédfüggvény sorok kiírására
function runSequence(container, lines, onComplete) {
    let totalDelay = 0;

    lines.forEach((line, index) => {
        totalDelay += line.delay;
        
        setTimeout(() => {
            addLine(container, line.text, line.style);
            
            // Ha ez volt az utolsó sor, hívjuk meg a befejező függvényt
            if (index === lines.length - 1) {
                if (onComplete) onComplete();
            }
        }, totalDelay);
    });
}

function addLine(container, text, style) {
    const p = document.createElement('p');
    p.innerHTML = text;
    if (style) p.style.cssText = style;
    container.appendChild(p);
    container.scrollTop = container.scrollHeight;
}