/**
 * CYBERPUNK PORTFOLIO SCRIPT
 * Szerző: Szontagh Ágoston (AI asszisztenciával)
 * Verzió: 2.1 (Fix: Gombok & Egyszeri Cím Animáció)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Először elmentjük az eredeti szövegeket mindenhez, ami animálódni fog
    prepareHackerElements();
    
    initScrollAnimations(); // Itt kezeljük a H1/H2 automatikus megjelenését
    initHackerHoverEffect(); // Itt kezeljük a Gombok/Linkek egér interakcióját
    initActiveNav();
    initSmoothScroll();
    initFormHandler();
    injectCustomStyles();
});

/* =========================================
   0. SEGÉDFÜGGVÉNYEK (HACKER EFFEKT MOTOR)
   ========================================= */

// Elmentjük az eredeti szöveget data-attribútumba, hogy vissza tudjuk állítani
function prepareHackerElements() {
    // Minden címsor, link és gomb
    const targets = document.querySelectorAll('h1, h2, .nav-linkek a, .gomb');
    targets.forEach(target => {
        if (!target.dataset.value) {
            target.dataset.value = target.innerText;
        }
    });
}

// Ez végzi a konkrét betűkeverést egy adott elemen
function hackTheText(element) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
    let iterations = 0;
    
    // Ha épp fut egy animáció ezen az elemen, állítsuk le, hogy ne akadjanak össze
    if (element.interval) clearInterval(element.interval);

    element.interval = setInterval(() => {
        element.innerText = element.innerText
            .split("")
            .map((letter, index) => {
                if (index < iterations) {
                    return element.dataset.value[index];
                }
                return letters[Math.floor(Math.random() * letters.length)];
            })
            .join("");

        if (iterations >= element.dataset.value.length) {
            clearInterval(element.interval);
            element.innerText = element.dataset.value; // Biztosítjuk a tiszta végállapotot
        }

        iterations += 1 / 3; // Sebesség
    }, 30);
}

/* =========================================
   1. DINAMIKUS STÍLUSOK (CSS INJEKTÁLÁS)
   ========================================= */
function injectCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .reveal-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
        }

        .reveal-on-scroll.is-visible {
            opacity: 1;
            transform: translateY(0);
        }

        .stagger-1 { transition-delay: 100ms; }
        .stagger-2 { transition-delay: 200ms; }
        .stagger-3 { transition-delay: 300ms; }

        .hacker-text {
            font-family: 'Share Tech Mono', monospace;
            display: inline-block;
        }
    `;
    document.head.appendChild(style);
}

/* =========================================
   2. GÖRGETÉSI ANIMÁCIÓK + CÍMSOR EFFEKT
   ========================================= */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                target.classList.add('is-visible');
                
                // HA CÍMSOR (H1 vagy H2): Indítsuk el a hacker effektet MOST (egyszer)
                if (target.tagName === 'H1' || target.tagName === 'H2') {
                    hackTheText(target);
                }

                observer.unobserve(target); // Többet nem figyeljük -> csak egyszer fut le
            }
        });
    }, observerOptions);

    // Kijelöljük az elemeket (H1-et is hozzáadtam a listához!)
    const elementsToAnimate = document.querySelectorAll('h1, h2, article, .bemutatkozas, .skill-category, .urlap-csoport');
    
    elementsToAnimate.forEach((el, index) => {
        el.classList.add('reveal-on-scroll');
        
        if (el.tagName === 'ARTICLE') {
            const delayClass = `stagger-${(index % 3) + 1}`;
            el.classList.add(delayClass);
        }
        observer.observe(el);
    });
}

/* =========================================
   3. "HACKER" HOVER EFFEKT (CSAK GOMBOK ÉS LINKEK)
   ========================================= */
function initHackerHoverEffect() {
    // Most már a .gomb osztályú elemeket is kijelöljük!
    const targets = document.querySelectorAll('.nav-linkek a, .gomb');

    targets.forEach(target => {
        target.addEventListener('mouseenter', event => {
            hackTheText(event.target);
        });
    });
}

/* =========================================
   4. AKTÍV NAVIGÁCIÓ KIEMELÉS
   ========================================= */
function initActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-linkek a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('aktiv');
            link.style.color = '#e0e0e0';
            link.style.textShadow = 'none';

            if (link.getAttribute('href').includes(current) && current !== '') {
                link.style.color = '#00f3ff';
                link.style.textShadow = '0 0 8px #00f3ff';
            }
        });
    });
}

/* =========================================
   5. SIMA GÖRGETÉS
   ========================================= */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* =========================================
   6. ŰRLAP KEZELÉS
   ========================================= */
function initFormHandler() {
    const form = document.querySelector('.kapcsolat-urlap');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        const btn = form.querySelector('button');
        btn.innerText = "KÜLDÉS FOLYAMATBAN... [INITIALIZING]";
        btn.style.backgroundColor = "#fcee0a";
        btn.style.color = "#000";
        btn.style.border = "1px solid #fcee0a";
    });
}