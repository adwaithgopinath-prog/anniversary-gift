document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Custom Cursor Logic --- */
    const cursor = document.querySelector('.cursor');
    const dot = document.querySelector('.cursor-dot');

    if (cursor && dot) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Add a slight delay for the dot for a fluid feel
            setTimeout(() => {
                dot.style.left = e.clientX + 'px';
                dot.style.top = e.clientY + 'px';
            }, 50);

            // Create Sparkle Trail
            createSparkle(e.clientX, e.clientY);
        });
    }

    /* --- 9. Dynamic UI Enhancements (Header, CTAs, Lightbox, To-Top, Timeline) --- */
    const rootContainer = document.querySelector('.container');
    const audioEl = document.getElementById('bg-music');
    // 9a. Assign IDs to existing sections for navigation
    const heroSection = document.querySelector('section.hero');
    if (heroSection && !heroSection.id) heroSection.id = 'hero';
    const gallerySection = document.querySelector('section.gallery-section');
    if (gallerySection && !gallerySection.id) gallerySection.id = 'gallery';
    const letterSection = document.querySelector('section.letter-section');
    if (letterSection && !letterSection.id) letterSection.id = 'letter';

    // 9b. Inject Header / Navigation with audio + theme toggle
    const header = document.createElement('header');
    header.className = 'site-header';
    header.setAttribute('role', 'banner');
    header.innerHTML = `
        <a href="home.html" class="logo" aria-label="Go to home">✨ Our 2nd</a>
        <nav aria-label="Primary">
            <a href="home.html">Home</a>
            <a href="memories.html">Memories</a>
            <a href="letter.html">Letter</a>
            <a href="puzzle.html">Puzzle</a>
        </nav>
        <div class="header-actions">
            <button id="audio-toggle" class="icon-btn" aria-label="Toggle music" title="Toggle music">🔊</button>
            <button id="theme-toggle" class="icon-btn" aria-label="Toggle theme" title="Toggle theme">🎨</button>
        </div>`;
    document.body.appendChild(header);
    // Remove audio toggle if no audio element present
    if (!audioEl) {
        const btn = document.getElementById('audio-toggle');
        if (btn) btn.remove();
    }

    // 9c. Add CTAs to hero
    const heroText = document.querySelector('.hero .hero-text');
    if (heroText && !heroText.querySelector('.hero-ctas')) {
        const ctas = document.createElement('div');
        ctas.className = 'hero-ctas';
        ctas.innerHTML = `
            <a href="memories.html" class="btn primary">View Memories</a>
            <a href="letter.html" class="btn ghost">Open Letter</a>`;
        heroText.appendChild(ctas);
    }

    // 9d. Lightbox and Back-to-top elements
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image viewer');
    lightbox.hidden = true;
    lightbox.innerHTML = `<button class="lightbox-close" aria-label="Close">✖</button><img alt="Expanded memory">`;
    document.body.appendChild(lightbox);

    const toTop = document.createElement('button');
    toTop.id = 'to-top';
    toTop.className = 'to-top';
    toTop.setAttribute('aria-label', 'Back to top');
    toTop.textContent = '⬆';
    document.body.appendChild(toTop);

    // Footer
    if (!document.querySelector('.site-footer')) {
        const footer = document.createElement('footer');
        footer.className = 'site-footer';
        footer.setAttribute('role', 'contentinfo');
        footer.innerHTML = `<small><a href="home.html">Home</a></small>`;
        document.body.appendChild(footer);
    }

    // Removed auto-injection of timeline; separate page will host it

    // 9f. Lightbox behavior for gallery images
    const galleryImages = document.querySelectorAll('.polaroid img');
    galleryImages.forEach(img => {
        // Performance: lazy-load if not already
        if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            const lbImg = lightbox.querySelector('img');
            lbImg.src = img.src;
            lbImg.alt = img.alt || 'Expanded memory';
            lightbox.hidden = false;
        });
    });
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
            lightbox.hidden = true;
        }
    });

    // 9g. Audio toggle
    const audioToggle = document.getElementById('audio-toggle');
    if (audioToggle && audioEl) {
        const updateIcon = () => { audioToggle.textContent = audioEl.paused ? '🔇' : '🔊'; };
        updateIcon();
        audioToggle.addEventListener('click', async () => {
            try {
                if (audioEl.paused) { await audioEl.play(); } else { audioEl.pause(); }
            } catch (e) {
                console.log('Audio toggle failed', e);
            }
            updateIcon();
        });
    }

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const applyTheme = () => {
            const pastel = localStorage.getItem('theme') === 'pastel';
            document.body.classList.toggle('theme-pastel', pastel);
            themeToggle.textContent = pastel ? '🌙' : '🎨';
        };
        applyTheme();
        themeToggle.addEventListener('click', () => {
            const pastel = !(localStorage.getItem('theme') === 'pastel');
            localStorage.setItem('theme', pastel ? 'pastel' : 'default');
            applyTheme();
        });
    }

    // 9h. Back-to-top behavior
    const onScroll = () => {
        if (window.scrollY > 300) {
            toTop.classList.add('show');
        } else {
            toTop.classList.remove('show');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // 9i. Reveal on scroll
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
    }, { threshold: 0.15 });

    // Mark elements to reveal
    document.querySelectorAll('.polaroid, .section-title, .milestone, .letter-section .envelope-wrapper, .hero .hero-text').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    function createSparkle(x, y) {
        if(Math.random() < 0.8) return; // Limit sparkles

        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.width = Math.random() * 4 + 2 + 'px';
        sparkle.style.height = sparkle.style.width;
        sparkle.style.background = `hsl(${Math.random() * 60 + 320}, 100%, 70%)`; // Pinks/Reds
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9998';
        document.body.appendChild(sparkle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 20 + 10;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;

        sparkle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 }
        ], {
            duration: 800,
            easing: 'linear'
        }).onfinish = () => sparkle.remove();
    }


    /* --- 2. Entrance Sequence --- */
    const overlay = document.getElementById('entrance-overlay');
    const pixelBox = document.querySelector('.pixel-intro');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');

    if (yesBtn && noBtn && pixelBox) {
        // Yes button - go to riddle page
        yesBtn.addEventListener('click', () => {
            window.location.href = 'riddle.html';
        });

        // No button - playful teasing
        let teaseCount = 0;
        noBtn.addEventListener('click', () => {
            pixelBox.classList.remove('shake');
            const msg = pixelBox.querySelector('.msg');
            const variants = [
                'Are you sure? 😉',
                'Pleaaase? 🥺',
                'Pretty please? 💖',
                'You know you want to! ✨'
            ];
            msg.textContent = variants[teaseCount % variants.length];
            teaseCount++;
            requestAnimationFrame(() => pixelBox.classList.add('shake'));
        });
    }


    /* --- 3. Hero Parallax Effect --- */
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        
        const heroTitle = document.querySelector('.hero h1');
        if(heroTitle) {
            heroTitle.style.transform = `translate(${x}px, ${y}px)`;
        }
    });


    /* --- 4. Star Generation --- */
    const starsContainer = document.querySelector('.stars');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.setProperty('--duration', Math.random() * 3 + 2 + 's');
        if(starsContainer) starsContainer.appendChild(star);
    }


    /* --- 5. Polaroid Random Rotation --- */
    const polaroids = document.querySelectorAll('.polaroid');
    polaroids.forEach(card => {
        const randomRotation = Math.random() * 20 - 10; // -10 to 10 deg
        card.style.setProperty('--rotation', randomRotation + 'deg');
    });


    /* --- 6. Envelope Interaction --- */
    const envelope = document.querySelector('.envelope-wrapper');
    if (envelope) {
        envelope.addEventListener('click', () => {
            envelope.querySelector('.envelope').classList.toggle('open');
        });
    }

    /* --- 7. Typewriter Effect --- */
    const textToType = "You are my favorite notification.";
    const element = document.getElementById('typed-text');
    let i = 0;

    function typeWriter() {
        if (element && i < textToType.length) {
            element.innerHTML += textToType.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    if (element) typeWriter();

    /* --- 8. Floating Words Generator --- */
    const words = ["Love", "Forever", "Us", "Magic", "Two Months", "My Heart", "Destiny"];
    const container = document.querySelector('.floating-elements');
    
    if (container) {
        setInterval(() => {
            const word = document.createElement('div');
            word.classList.add('floating-word');
            word.innerText = words[Math.floor(Math.random() * words.length)];
            word.style.top = Math.random() * 100 + 'vh';
            word.style.left = '-100px';
            word.style.fontSize = Math.random() * 2 + 1 + 'rem';
            word.style.animationDuration = Math.random() * 10 + 15 + 's';
            container.appendChild(word);

            setTimeout(() => { word.remove() }, 30000);
        }, 2000);
    }
    /* --- 10. Real-Time Relationship Timer --- */
    const timerContainer = document.getElementById('love-timer');
    if (timerContainer) {
        // Set Start Date: Dec 4, 2025 (2 months ago from Feb 4, 2026)
        const startDate = new Date('2025-12-04T00:00:00'); 
        
        function updateLifeTimer() {
            const now = new Date();
            const diff = now - startDate;
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            
            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        }
        
        setInterval(updateLifeTimer, 1000);
        updateLifeTimer();
    }
});
