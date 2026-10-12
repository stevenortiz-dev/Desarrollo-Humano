document.addEventListener('DOMContentLoaded', () => {

    // --- Intro Video Logic ---
    const startOverlay = document.getElementById('start-overlay');
    const btnStartIntro = document.getElementById('btn-start-intro');
    const introVideoContainer = document.getElementById('intro-video-container');
    const introVideo = document.getElementById('intro-video');
    const skipBtn = document.getElementById('skip-intro');
    const appContent = document.getElementById('app-content');

    const startPresentation = () => {
        if (startOverlay) {
            startOverlay.classList.add('fade-out');
            setTimeout(() => startOverlay.remove(), 500);
        }
        if (introVideoContainer) {
            introVideoContainer.style.display = 'flex';
        }
        if (introVideo) {
            introVideo.play().catch(e => {
                console.error("Video play failed:", e);
                endIntro();
            });
        }
    };

    if (btnStartIntro) {
        btnStartIntro.addEventListener('click', startPresentation);
    }

    const endIntro = () => {
        if (introVideoContainer && !introVideoContainer.classList.contains('fade-out')) {
            introVideoContainer.classList.add('fade-out');
            if (appContent) appContent.classList.add('show');
            setTimeout(() => {
                introVideoContainer.remove();
            }, 1000); // 1s matches CSS transition
        }
    };

    if (introVideoContainer && introVideo) {
        introVideo.addEventListener('ended', endIntro);
        if (skipBtn) skipBtn.addEventListener('click', endIntro);
        introVideo.addEventListener('error', endIntro); // Fallback
    } else {
        if (appContent) appContent.classList.add('show');
    }

    // --- Anti-Inspect (F12, Right Click, etc.) ---
    const showWarning = () => {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>¡Acceso denegado! Función deshabilitada por seguridad.</span>`;
        
        container.appendChild(toast);
        
        // Trigger reflow to animate
        void toast.offsetWidth;
        toast.classList.add('show');
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400); // Wait for transition
        }, 3000);
    };

    document.addEventListener('contextmenu', event => {
        event.preventDefault();
        showWarning();
    });

    document.addEventListener('keydown', (e) => {
        // F12
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            showWarning();
            return false;
        }
        // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
            e.preventDefault();
            showWarning();
            return false;
        }
        // Ctrl+U (View Source)
        if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
            e.preventDefault();
            showWarning();
            return false;
        }
    });

    // --- Stardust Particles Background ---
    const canvas = document.createElement('canvas');
    canvas.id = 'stardust-bg';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-2';
    canvas.style.pointerEvents = 'none';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    const initParticles = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        const count = Math.floor(window.innerWidth / 15);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2 - 0.2,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    };
    
    const drawParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.y < 0) p.y = canvas.height;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            ctx.fill();
        });
        requestAnimationFrame(drawParticles);
    };
    initParticles();
    drawParticles();
    window.addEventListener('resize', initParticles);

    // --- Scroll Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.8s ease forwards ${entry.target.dataset.delay || '0s'}`;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('main .card, main .glass-card, main .pillar-card, main .impact-item, main .step').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.dataset.delay = `${(index % 3) * 0.1}s`;

        if (!document.getElementById('scroll-keyframes')) {
            const style = document.createElement('style');
            style.id = 'scroll-keyframes';
            style.innerHTML = `@keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }`;
            document.head.appendChild(style);
        }

        observer.observe(el);
    });

    // --- Interactive Spotlight Effect on Cards ---
    document.querySelectorAll('.card, .glass-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- Modal Logic ---
    const modal = document.getElementById('login-modal');
    const btnAccess = document.getElementById('btn-leader-access');
    const btnCloseModal = document.querySelector('.close-modal');
    const btnLogin = document.getElementById('btn-login');
    const inputSelect = document.getElementById('leader-select');
    const inputId = document.getElementById('leader-id');
    const errorMsg = document.getElementById('login-error');
    const rouletteArea = document.getElementById('roulette-area');
    const btnExit = document.getElementById('btn-exit');

    const leaderIds = {
        "MARCO ANTONIO PAPA FERNANDEZ": "1689707",
        "JOSE JIMENEZ CHIVIGORRE": "1661088",
        "JESSICA SHANTAL VALENZUELA RUIZ": "1673872",
        "JERIKO AHMED CUTIMANCO ATAO": "1608695"
    };

    let currentLeader = "";

    btnAccess.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    btnCloseModal.addEventListener('click', () => {
        modal.style.display = 'none';
        errorMsg.textContent = '';
        inputSelect.value = '';
        inputId.value = '';
    });

    // --- Audio Logic ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playTone(freq = 400, type = 'sine', duration = 0.05, vol = 0.1) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    }

    function playTick() { playTone(800, 'square', 0.03, 0.02); }
    function playWin() {
        playTone(440, 'triangle', 0.3, 0.1);
        setTimeout(() => playTone(554, 'triangle', 0.3, 0.1), 100);
        setTimeout(() => playTone(659, 'triangle', 0.5, 0.1), 200);
    }
    function playTimerTick() { playTone(1000, 'sine', 0.1, 0.05); }
    function playTimerEnd() { playTone(300, 'sawtooth', 0.5, 0.2); }
    function playHover() { playTone(1200, 'sine', 0.03, 0.005); }

    // Enlazar sonido hover a elementos interactivos, solo si el contexto está activo
    document.querySelectorAll('.card, .glass-card, .btn-primary, .btn-secondary, .btn-extra').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (audioCtx.state === 'running') playHover();
        });
    });

    // Iniciar contexto de audio en primer click del usuario
    window.addEventListener('click', () => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }, { once: true });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    const attemptLogin = () => {
        const selected = inputSelect.value;
        const enteredId = inputId.value.trim();

        if (!selected) {
            errorMsg.textContent = 'Por favor selecciona tu nombre.';
            return;
        }

        if (leaderIds[selected] === enteredId) {
            currentLeader = selected;
            modal.style.display = 'none';
            rouletteArea.classList.remove('hidden');
            rouletteArea.classList.add('roulette-enter');
            setTimeout(() => rouletteArea.classList.remove('roulette-enter'), 600);
            document.body.style.overflow = 'hidden';
            errorMsg.textContent = '';
            inputId.value = '';
        } else {
            errorMsg.textContent = 'El ID no es correcto para el líder seleccionado.';
            inputId.classList.add('shake');
            setTimeout(() => inputId.classList.remove('shake'), 400);
        }
    };

    btnLogin.addEventListener('click', attemptLogin);
    inputId.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') attemptLogin();
    });

    btnExit.addEventListener('click', () => {
        rouletteArea.classList.add('hidden');
        document.body.style.overflow = 'auto';
        resetTimer();
        document.getElementById('timer-area').classList.add('hidden');
        document.getElementById('response-form-area').classList.add('hidden');
    });

    // --- Roulette Logic ---
    const topics = [
        {
            title: "Autoconciencia",
            case: "Faltan 20 minutos para la entrega final del proyecto y el servidor sufre una falla crítica. Comienzas a sentir ira, palpitaciones intensas y una fuerte tentación de culpar al compañero que subió el último archivo.",
            questions: [
                "¿Cómo identificas y gestionas físicamente esas emociones antes de actuar por impulso?",
                "¿Qué diálogo interno consciente utilizas para transformar la culpa en enfoque hacia la solución técnica?"
            ],
            color: "#7c3aed"
        },
        {
            title: "Autorregulación",
            case: "En plena reunión con directivos y clientes, un colega desacredita públicamente tu propuesta con comentarios sarcásticos e injustos frente a todos los presentes.",
            questions: [
                "¿Qué técnica de autocontrol aplicas en los primeros 10 segundos para no reaccionar a la defensiva?",
                "¿Cómo respondes con serenidad, asertividad y profesionalismo sin perder la compostura ni validar la agresión?"
            ],
            color: "#0ea5e9"
        },
        {
            title: "Motivación",
            case: "Tras 4 semanas de esfuerzo colectivo continuo, la dirección decide cancelar el proyecto en el que tu equipo depositó todo su entusiasmo. El desánimo y la frustración invaden al grupo.",
            questions: [
                "¿Cómo encuentras automotivación interna cuando los factores y recompensas externas fallan?",
                "¿Qué mensaje y estrategia concreta le transmites a tu equipo para reactivar el optimismo y canalizar la energía en la siguiente meta?"
            ],
            color: "#f59e0b"
        },
        {
            title: "Empatía",
            case: "Un compañero que siempre fue muy productivo y proactivo lleva dos semanas llegando tarde, desanimado y con errores constantes en sus entregas, pero se cierra y afirma que 'todo está bien'.",
            questions: [
                "¿Cómo creas un espacio seguro de confianza para acercarte a dialogar sin juzgar ni invadir su privacidad?",
                "¿Cómo equilibras la comprensión hacia su situación personal con la responsabilidad de cumplir con las metas del equipo?"
            ],
            color: "#10b981"
        },
        {
            title: "Habilidades Sociales",
            case: "Dos integrantes clave de tu equipo tienen un desacuerdo frontal sobre la arquitectura del proyecto y rehúsan hablarse directamente, paralizando el avance de todo el equipo a pocos días del cierre.",
            questions: [
                "¿Cómo ejerces un liderazgo mediador para que ambas partes se sientan escuchadas y depongan posturas rígidas?",
                "¿Qué dinámica o acuerdo de colaboración propones para restaurar la confianza y lograr un consenso funcional?"
            ],
            color: "#ef4444"
        }
    ];

    const wheel = document.getElementById('wheel');
    const btnSpin = document.getElementById('btn-spin');
    const timerArea = document.getElementById('timer-area');
    const resultTopic = document.getElementById('result-topic');
    const resultDesc = document.getElementById('result-desc');
    const resultBadge = document.getElementById('result-badge');
    const resultQuestions = document.getElementById('result-questions');

    let currentRotation = 0;
    let isSpinning = false;
    const slices = topics.length;
    const sliceAngle = 360 / slices;
    let usedTopics = JSON.parse(localStorage.getItem('ie_used_topics')) || [];

    function getAvailableTopics() {
        const available = topics.filter(t => !usedTopics.includes(t.title));
        return available.length > 0 ? available : topics; // reset if all used
    }

    function markTopicUsed(title) {
        if (!usedTopics.includes(title)) {
            usedTopics.push(title);
            localStorage.setItem('ie_used_topics', JSON.stringify(usedTopics));
        }
    }

    function updateSpinButton() {
        const allUsed = usedTopics.length >= topics.length;
        btnSpin.textContent = allUsed ? '🔄 TODOS USADOS — REINICIAR RULETA' : 'GIRAR LA RULETA';
    }

    function updateUsedBadges() {
        document.querySelectorAll('.topic-badge').forEach(badge => {
            if (usedTopics.includes(badge.dataset.topic)) {
                badge.classList.add('used');
            }
        });
        updateResponseCounter();
    }

    // Draw wheel slices
    topics.forEach((topic, i) => {
        const slice = document.createElement('div');
        slice.className = 'slice';
        const skewY = 90 - sliceAngle;
        slice.style.transform = `rotate(${i * sliceAngle}deg) skewY(${skewY}deg)`;
        slice.style.backgroundColor = topic.color;

        const text = document.createElement('div');
        text.className = 'slice-text';
        text.style.transform = `skewY(${-skewY}deg) rotate(${sliceAngle / 2}deg) translateY(-120px)`;
        text.textContent = topic.title;

        slice.appendChild(text);
        wheel.appendChild(slice);
    });

    btnSpin.addEventListener('click', () => {
        if (isSpinning) return;
        isSpinning = true;

        // Hide previous timer/result/form
        timerArea.classList.add('hidden');
        document.getElementById('response-form-area').classList.add('hidden');
        resetTimer();

        // Spin logic — only land on available (unused) topics
        const available = getAvailableTopics();
        const targetTopic = available[Math.floor(Math.random() * available.length)];
        const targetIndex = topics.findIndex(t => t.title === targetTopic.title);

        const spins = 5 + Math.floor(Math.random() * 5);
        const targetDeg = 360 - (targetIndex * sliceAngle) - (sliceAngle / 2);
        const totalRotation = currentRotation + (spins * 360) + targetDeg - (currentRotation % 360);

        wheel.style.transform = `rotate(${totalRotation}deg)`;
        currentRotation = totalRotation;
        wheel.classList.add('spinning');

        // Ticking sound — fast then slowing down
        let tickInterval = setInterval(playTick, 150);
        setTimeout(() => {
            clearInterval(tickInterval);
            tickInterval = setInterval(playTick, 400);
        }, 2000);

        // Show result after spin finishes (3.5s matches CSS transition)
        setTimeout(() => {
            clearInterval(tickInterval);
            playWin();
            wheel.classList.remove('spinning');
            markTopicUsed(targetTopic.title);
            updateUsedBadges();

            resultTopic.textContent = targetTopic.title;
            resultDesc.textContent = targetTopic.case;

            if (resultBadge) {
                resultBadge.textContent = targetTopic.title;
                resultBadge.style.background = `${targetTopic.color}25`;
                resultBadge.style.borderColor = `${targetTopic.color}60`;
                resultBadge.style.color = targetTopic.color;
            }

            if (resultQuestions && targetTopic.questions) {
                resultQuestions.innerHTML = '';
                targetTopic.questions.forEach(q => {
                    const li = document.createElement('li');
                    li.textContent = q;
                    resultQuestions.appendChild(li);
                });
            }

            timerArea.classList.remove('hidden');

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ffffff', '#aaaaaa', '#555555']
            });

            isSpinning = false;
            updateSpinButton();
        }, 3500);
    });

    updateSpinButton();
    updateUsedBadges();

    // --- Timer Logic ---
    const timeDisplay = document.getElementById('time-display');
    const timerProgress = document.getElementById('timer-progress');
    const btnStartTimer = document.getElementById('btn-start-timer');
    const btnResetTimer = document.getElementById('btn-reset-timer');

    const totalTime = 3 * 60;
    let timeRemaining = totalTime;
    let timerInterval = null;
    let timerRunning = false;

    function updateTimeDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const percentage = (timeRemaining / totalTime) * 100;
        if (timerProgress) {
            timerProgress.style.width = `${percentage}%`;
            if (timeRemaining <= 30) {
                timerProgress.classList.add('danger');
            } else {
                timerProgress.classList.remove('danger');
            }
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timeRemaining = totalTime;
        timerRunning = false;
        btnStartTimer.textContent = 'Iniciar Debate';
        updateTimeDisplay();
        timeDisplay.style.color = '#fff';
    }

    btnStartTimer.addEventListener('click', () => {
        if (timerRunning) {
            clearInterval(timerInterval);
            timerRunning = false;
            btnStartTimer.textContent = 'Reanudar';
        } else {
            timerRunning = true;
            btnStartTimer.textContent = 'Pausar';

            timerInterval = setInterval(() => {
                timeRemaining--;
                updateTimeDisplay();

                if (timeRemaining <= 60) {
                    timeDisplay.style.color = '#ffaa00';
                }
                if (timeRemaining <= 10 && timeRemaining > 0) {
                    timeDisplay.style.color = '#ff5555';
                    playTimerTick();
                }
                if (timeRemaining <= 0) {
                    clearInterval(timerInterval);
                    timerRunning = false;
                    timeDisplay.style.color = '#ff5555';
                    btnStartTimer.textContent = 'Tiempo Terminado';
                    btnStartTimer.disabled = true;
                    playTimerEnd();
                    confetti({
                        particleCount: 50,
                        spread: 60,
                        origin: { y: 0.8 },
                        colors: ['#ff0000']
                    });
                    document.getElementById('response-form-area').classList.remove('hidden');
                }
            }, 1000);
        }
    });

    btnResetTimer.addEventListener('click', () => {
        resetTimer();
        btnStartTimer.disabled = false;
        document.getElementById('response-form-area').classList.add('hidden');
    });

    document.getElementById('btn-extra-time').addEventListener('click', () => {
        timeRemaining += 60;
        updateTimeDisplay();
        if (btnStartTimer.disabled) {
            btnStartTimer.disabled = false;
            btnStartTimer.textContent = 'Reanudar';
            timeDisplay.style.color = '#fff';
        }
        timeDisplay.style.transform = 'scale(1.15)';
        setTimeout(() => timeDisplay.style.transform = 'scale(1)', 200);
    });

    // --- Responses Logic ---
    const btnSubmitResponse = document.getElementById('btn-submit-response');
    const responseText = document.getElementById('leader-response-text');
    const responsesGrid = document.getElementById('responses-grid');

    // --- Live Sync Logic (Cross-tab / Cross-window Realtime) ---
    const syncChannel = ('BroadcastChannel' in window) ? new BroadcastChannel('ie_sync_hub') : null;

    function broadcastSyncMessage(msg) {
        if (syncChannel) {
            try { syncChannel.postMessage(msg); } catch (e) { console.warn(e); }
        }
    }

    function handleIncomingSync(msg) {
        if (!msg) return;
        if (msg.type === 'NEW_RESPONSE' && msg.response) {
            renderResponses(msg.response.id);
            updateResponseCounter();
            if (typeof renderAdminDashboard === 'function') renderAdminDashboard();
            playWin();
            showCustomToast(`🔔 ¡Nueva respuesta recibida de ${msg.response.leader}! (${msg.response.topic})`, 'fa-bell', '#10b981');
            confetti({
                particleCount: 75,
                spread: 70,
                origin: { y: 0.7 },
                colors: ['#10b981', '#ffffff', '#38bdf8', '#f59e0b']
            });
        } else if (msg.type === 'WALL_CLEARED') {
            usedTopics = [];
            renderResponses();
            updateResponseCounter();
            updateUsedBadges();
            updateSpinButton();
            document.querySelectorAll('.topic-badge').forEach(b => b.classList.remove('used'));
            if (typeof renderAdminDashboard === 'function') renderAdminDashboard();
            showCustomToast('Muro reiniciado en tiempo real.', 'fa-rotate-right', '#f59e0b');
        } else if (msg.type === 'EVAL_UPDATED') {
            renderResponses();
            if (typeof renderAdminDashboard === 'function') renderAdminDashboard();
        }
    }

    if (syncChannel) {
        syncChannel.onmessage = (event) => {
            handleIncomingSync(event.data);
        };
    }

    // Native storage event listener fallback for browsers or different windows
    window.addEventListener('storage', (e) => {
        if (e.key === 'ie_responses') {
            const list = getResponses();
            const latest = list[list.length - 1];
            renderResponses(latest ? latest.id : null);
            updateResponseCounter();
            if (typeof renderAdminDashboard === 'function') renderAdminDashboard();
            if (latest) {
                playWin();
                showCustomToast(`🔔 ¡Nueva respuesta de: ${latest.leader}!`, 'fa-bell', '#10b981');
            }
        } else if (e.key === 'ie_used_topics') {
            usedTopics = JSON.parse(localStorage.getItem('ie_used_topics')) || [];
            updateUsedBadges();
            updateSpinButton();
        }
    });

    function getResponses() {
        return JSON.parse(localStorage.getItem('ie_responses')) || [];
    }

    function saveResponses(list) {
        localStorage.setItem('ie_responses', JSON.stringify(list));
    }

    function renderResponses(highlightId = null) {
        responsesGrid.innerHTML = '';
        const savedResponses = getResponses();

        if (savedResponses.length === 0) {
            responsesGrid.innerHTML = '<p class="text-muted" style="grid-column: 1/-1; text-align: center;">Aún no hay respuestas registradas. Realiza la dinámica para verlas aquí.</p>';
            return;
        }

        savedResponses.forEach(res => {
            const card = document.createElement('div');
            const isNew = highlightId && (res.id === highlightId);
            card.className = `card response-card animate-up ${isNew ? 'card-new-sync' : ''}`;
            
            // Rating and feedback badge if admin evaluated
            let evalHtml = '';
            if (res.rating && res.rating > 0) {
                const stars = '★'.repeat(res.rating) + '☆'.repeat(5 - res.rating);
                evalHtml += `
                    <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed rgba(255,255,255,0.1); font-size: 0.85rem;">
                        <span style="color: #f59e0b; font-size: 1rem; letter-spacing: 2px;">${stars}</span>
                        ${res.feedback ? `<p style="color: #a0a0a0; font-style: italic; margin-top: 4px; font-size: 0.82rem;"><i class="fa-solid fa-comment-dots" style="color: #8b5cf6;"></i> Feedback: "${res.feedback}"</p>` : ''}
                    </div>
                `;
            }

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <h4>${res.leader}</h4>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${res.timestamp || ''}</span>
                </div>
                <div class="topic">Tema: ${res.topic}</div>
                <p>${res.text}</p>
                ${evalHtml}
            `;
            responsesGrid.appendChild(card);
        });
    }

    btnSubmitResponse.addEventListener('click', () => {
        const text = responseText.value.trim();
        if (!text) {
            alert('Por favor, escribe una respuesta antes de publicar.');
            return;
        }

        const now = new Date();
        const formattedDate = now.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }) + ' ' + 
                              now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

        const newResponse = {
            id: 'resp_' + Date.now(),
            leader: currentLeader,
            topic: resultTopic.textContent,
            text: text,
            timestamp: formattedDate,
            rating: 0,
            feedback: ''
        };

        const savedResponses = getResponses();
        savedResponses.push(newResponse);
        saveResponses(savedResponses);

        renderResponses(newResponse.id);
        if (typeof renderAdminDashboard === 'function') renderAdminDashboard();
        
        // Broadcast in real-time to other tabs/projector
        broadcastSyncMessage({
            type: 'NEW_RESPONSE',
            response: newResponse
        });

        responseText.value = '';
        document.getElementById('response-form-area').classList.add('hidden');
        rouletteArea.classList.add('hidden');
        document.body.style.overflow = 'auto';
        resetTimer();
        document.getElementById('timer-area').classList.add('hidden');
        updateResponseCounter();

        setTimeout(() => {
            document.getElementById('respuestas-section').scrollIntoView({ behavior: 'smooth' });
        }, 100);
    });

    // --- Counter Logic ---
    function updateResponseCounter() {
        const savedResponses = getResponses();
        const count = savedResponses.length;
        const total = 4;
        const counterEl = document.getElementById('response-counter');
        const counterBar = document.getElementById('counter-progress');
        const counterText = document.getElementById('counter-text');
        if (!counterEl) return;
        counterEl.style.display = 'block';
        const pct = Math.min((count / total) * 100, 100);
        counterBar.style.width = `${pct}%`;
        counterText.textContent = `${count} de ${total} grupos han respondido`;
        if (count >= total) {
            counterEl.classList.add('complete');
            counterText.textContent = '✅ ¡Todos los grupos han respondido!';
        } else {
            counterEl.classList.remove('complete');
        }
    }

    // Initial render
    renderResponses();
    updateResponseCounter();

    // --- Clean Wall Button ---
    const btnClearWall = document.getElementById('btn-clear-wall');
    if (btnClearWall) {
        btnClearWall.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas borrar TODAS las respuestas y reiniciar los temas de la ruleta?')) {
                localStorage.removeItem('ie_responses');
                localStorage.removeItem('ie_used_topics');
                usedTopics = [];
                renderResponses();
                if (typeof renderAdminDashboard === 'function') renderAdminDashboard();
                updateResponseCounter();
                updateUsedBadges();
                updateSpinButton();
                document.querySelectorAll('.topic-badge').forEach(b => b.classList.remove('used'));
                broadcastSyncMessage({ type: 'WALL_CLEARED' });
            }
        });
    }

    // ==========================================================================
    // --- ADMIN PANEL & EVALUATION LOGIC ---
    // ==========================================================================

    const btnAdminTrigger = document.getElementById('btn-admin-trigger');
    const btnSwitchToAdmin = document.getElementById('btn-switch-to-admin');
    const adminLoginModal = document.getElementById('admin-login-modal');
    const adminDashboardModal = document.getElementById('admin-dashboard-modal');
    const closeAdminLogin = document.getElementById('close-admin-login');
    const closeAdminDash = document.getElementById('close-admin-dash');
    const btnAdminLogin = document.getElementById('btn-admin-login');
    const adminPasswordInput = document.getElementById('admin-password');
    const adminLoginError = document.getElementById('admin-login-error');
    const btnToggleAdminPass = document.getElementById('btn-toggle-admin-pass');
    const btnAdminLogout = document.getElementById('btn-admin-logout');
    const btnExportReport = document.getElementById('btn-export-report');
    const btnCopySummary = document.getElementById('btn-copy-summary');
    const adminSearchInput = document.getElementById('admin-search-responses');
    const adminResponsesList = document.getElementById('admin-responses-list');

    let isAdminLoggedIn = sessionStorage.getItem('ie_admin_active') === 'true';

    const ADMIN_PASSWORD = '1671172';
    function getAdminPassword() {
        return ADMIN_PASSWORD;
    }

    function showCustomToast(message, icon = 'fa-circle-check', color = '#10b981') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid ${icon}" style="color: ${color};"></i> <span>${message}</span>`;
        container.appendChild(toast);
        void toast.offsetWidth;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    function openAdminPanel() {
        if (isAdminLoggedIn) {
            renderAdminDashboard();
            adminDashboardModal.style.display = 'flex';
        } else {
            adminLoginModal.style.display = 'flex';
            adminPasswordInput.value = '';
            adminLoginError.textContent = '';
            adminPasswordInput.focus();
        }
    }

    if (btnAdminTrigger) {
        btnAdminTrigger.addEventListener('click', openAdminPanel);
    }

    if (btnSwitchToAdmin) {
        btnSwitchToAdmin.addEventListener('click', () => {
            modal.style.display = 'none';
            openAdminPanel();
        });
    }

    if (closeAdminLogin) {
        closeAdminLogin.addEventListener('click', () => {
            adminLoginModal.style.display = 'none';
        });
    }

    if (closeAdminDash) {
        closeAdminDash.addEventListener('click', () => {
            adminDashboardModal.style.display = 'none';
        });
    }

    if (btnToggleAdminPass) {
        btnToggleAdminPass.addEventListener('click', () => {
            const isPass = adminPasswordInput.type === 'password';
            adminPasswordInput.type = isPass ? 'text' : 'password';
            btnToggleAdminPass.innerHTML = isPass ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
        });
    }

    function attemptAdminLogin() {
        const entered = adminPasswordInput.value.trim();
        const correct = getAdminPassword();
        if (entered === correct) {
            isAdminLoggedIn = true;
            sessionStorage.setItem('ie_admin_active', 'true');
            adminLoginModal.style.display = 'none';
            renderAdminDashboard();
            adminDashboardModal.style.display = 'flex';
            showCustomToast('¡Bienvenido, Administrador!', 'fa-shield-halved', '#10b981');
        } else {
            adminLoginError.textContent = 'Contraseña de administrador incorrecta.';
            adminPasswordInput.classList.add('shake');
            setTimeout(() => adminPasswordInput.classList.remove('shake'), 400);
        }
    }

    if (btnAdminLogin) btnAdminLogin.addEventListener('click', attemptAdminLogin);
    if (adminPasswordInput) {
        adminPasswordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') attemptAdminLogin();
        });
    }

    if (btnAdminLogout) {
        btnAdminLogout.addEventListener('click', () => {
            isAdminLoggedIn = false;
            sessionStorage.removeItem('ie_admin_active');
            adminDashboardModal.style.display = 'none';
            showCustomToast('Sesión de administrador cerrada.', 'fa-arrow-right-from-bracket', '#f59e0b');
        });
    }

    if (btnExportReport) {
        btnExportReport.addEventListener('click', () => {
            window.print();
        });
    }

    if (btnCopySummary) {
        btnCopySummary.addEventListener('click', () => {
            const list = getResponses();
            if (list.length === 0) {
                alert('No hay respuestas registradas para copiar.');
                return;
            }
            let summary = `📋 INFORME DE DINÁMICA - INTELIGENCIA EMOCIONAL\n`;
            summary += `Desarrollo Humano | Equipo: Steven Ortíz, Justin Siesquen, Manuel Gutarra, Joao Piñas, Milton Chupillón\n`;
            summary += `Total de respuestas: ${list.length}\n`;
            summary += `--------------------------------------------------\n\n`;

            list.forEach((r, idx) => {
                summary += `[Grupo ${idx + 1}] Líder: ${r.leader}\n`;
                summary += `Tema: ${r.topic} | Fecha: ${r.timestamp || 'N/A'}\n`;
                summary += `Respuesta: ${r.text}\n`;
                if (r.rating) summary += `Calificación: ${r.rating}/5 estrellas\n`;
                if (r.feedback) summary += `Feedback: ${r.feedback}\n`;
                summary += `\n--------------------------------------------------\n\n`;
            });

            navigator.clipboard.writeText(summary).then(() => {
                showCustomToast('Resumen copiado al portapapeles con éxito.', 'fa-clipboard-check', '#10b981');
            }).catch(() => {
                alert('No se pudo copiar automáticamente. Por favor permite los permisos de portapapeles.');
            });
        });
    }

    if (adminSearchInput) {
        adminSearchInput.addEventListener('input', () => {
            renderAdminDashboard();
        });
    }

    // Render Admin Dashboard
    function renderAdminDashboard() {
        if (!adminResponsesList) return;
        const allResponses = getResponses();
        const searchQuery = (adminSearchInput ? adminSearchInput.value.toLowerCase().trim() : '');

        // Update KPIs
        const statTotal = document.getElementById('stat-total-responses');
        const statAvg = document.getElementById('stat-avg-rating');
        const statLeaders = document.getElementById('stat-participating-leaders');

        if (statTotal) statTotal.textContent = allResponses.length;

        const ratedResponses = allResponses.filter(r => r.rating && r.rating > 0);
        if (statAvg) {
            if (ratedResponses.length > 0) {
                const sum = ratedResponses.reduce((acc, r) => acc + r.rating, 0);
                statAvg.textContent = `${(sum / ratedResponses.length).toFixed(1)} ★`;
            } else {
                statAvg.textContent = '-';
            }
        }

        const uniqueLeaders = new Set(allResponses.map(r => r.leader));
        if (statLeaders) statLeaders.textContent = `${uniqueLeaders.size} / 4`;

        // Filter responses
        const filtered = allResponses.filter(r => {
            if (!searchQuery) return true;
            return (r.leader && r.leader.toLowerCase().includes(searchQuery)) ||
                   (r.topic && r.topic.toLowerCase().includes(searchQuery)) ||
                   (r.text && r.text.toLowerCase().includes(searchQuery));
        });

        adminResponsesList.innerHTML = '';

        if (filtered.length === 0) {
            adminResponsesList.innerHTML = `
                <div style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
                    <i class="fa-solid fa-inbox" style="font-size: 2.5rem; margin-bottom: 0.8rem; opacity: 0.5;"></i>
                    <p>No se encontraron respuestas registradas.</p>
                </div>
            `;
            return;
        }

        filtered.forEach((res, index) => {
            const card = document.createElement('div');
            card.className = 'admin-response-card';
            
            // Topic color mapping
            const topicColors = {
                "Autoconciencia": "#7c3aed",
                "Autorregulación": "#0ea5e9",
                "Motivación": "#f59e0b",
                "Empatía": "#10b981",
                "Habilidades Sociales": "#ef4444"
            };
            const tColor = topicColors[res.topic] || '#8b5cf6';

            const cardId = res.id || ('resp_' + index);

            // Stars HTML
            const curRating = res.rating || 0;
            let starsHtml = '';
            for (let s = 1; s <= 5; s++) {
                const activeClass = s <= curRating ? 'active' : '';
                starsHtml += `<i class="fa-solid fa-star admin-star ${activeClass}" data-card-id="${cardId}" data-star="${s}"></i>`;
            }

            card.innerHTML = `
                <div class="admin-card-top">
                    <div>
                        <div class="admin-leader-name">
                            <i class="fa-solid fa-user-tie" style="color: #f59e0b;"></i>
                            <span>${res.leader}</span>
                        </div>
                        <div style="margin-top: 6px; display: flex; align-items: center; gap: 8px;">
                            <span class="admin-topic-tag" style="background: ${tColor}25; border: 1px solid ${tColor}60; color: ${tColor};">
                                ${res.topic}
                            </span>
                            <span class="admin-timestamp"><i class="fa-regular fa-clock"></i> ${res.timestamp || 'Fecha no registrada'}</span>
                        </div>
                    </div>
                    <button class="btn-delete-response" data-id="${cardId}" title="Eliminar respuesta">
                        <i class="fa-solid fa-trash"></i> Eliminar
                    </button>
                </div>
                <div class="admin-card-text">
                    "${res.text}"
                </div>
                <div class="admin-eval-box">
                    <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted);">Calificación:</span>
                    <div class="admin-stars" id="stars-${cardId}">
                        ${starsHtml}
                    </div>
                    <input type="text" class="admin-feedback-input" id="feedback-${cardId}" placeholder="Comentario o retroalimentación del admin..." value="${res.feedback || ''}">
                    <button class="btn-save-eval" data-id="${cardId}">
                        <i class="fa-solid fa-floppy-disk"></i> Guardar
                    </button>
                </div>
            `;

            adminResponsesList.appendChild(card);
        });

        // Attach Star Rating events
        document.querySelectorAll('.admin-star').forEach(starEl => {
            starEl.addEventListener('click', (e) => {
                const cid = e.target.dataset.cardId;
                const starVal = parseInt(e.target.dataset.star, 10);
                const starsContainer = document.getElementById('stars-' + cid);
                if (!starsContainer) return;

                starsContainer.querySelectorAll('.admin-star').forEach(s => {
                    const val = parseInt(s.dataset.star, 10);
                    if (val <= starVal) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
                starsContainer.dataset.selectedRating = starVal;
            });
        });

        // Attach Save Eval events
        document.querySelectorAll('.btn-save-eval').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.currentTarget;
                const cid = targetBtn.dataset.id;
                const starsContainer = document.getElementById('stars-' + cid);
                const feedbackInput = document.getElementById('feedback-' + cid);
                
                let selectedRating = starsContainer && starsContainer.dataset.selectedRating ? 
                    parseInt(starsContainer.dataset.selectedRating, 10) : null;
                const feedbackText = feedbackInput ? feedbackInput.value.trim() : '';

                const list = getResponses();
                const itemIndex = list.findIndex(r => (r.id === cid) || ('resp_' + list.indexOf(r) === cid));

                if (itemIndex !== -1) {
                    if (selectedRating !== null) list[itemIndex].rating = selectedRating;
                    list[itemIndex].feedback = feedbackText;
                    saveResponses(list);
                    renderResponses();
                    renderAdminDashboard();
                    broadcastSyncMessage({ type: 'EVAL_UPDATED' });
                    showCustomToast('Evaluación guardada con éxito.', 'fa-floppy-disk', '#8b5cf6');
                }
            });
        });

        // Attach Delete events
        document.querySelectorAll('.btn-delete-response').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cid = e.currentTarget.dataset.id;
                if (confirm('¿Deseas eliminar esta respuesta de forma permanente?')) {
                    let list = getResponses();
                    list = list.filter((r, idx) => (r.id !== cid) && ('resp_' + idx !== cid));
                    saveResponses(list);
                    renderResponses();
                    renderAdminDashboard();
                    updateResponseCounter();
                    broadcastSyncMessage({ type: 'EVAL_UPDATED' });
                    showCustomToast('Respuesta eliminada.', 'fa-trash', '#ef4444');
                }
            });
        });
    }

    // ==========================================================================
    // --- AUTOTEST INTERACTIVO DE INTELIGENCIA EMOCIONAL ---
    // ==========================================================================

    const autotestQuestions = [
        {
            pillar: "Autoconciencia",
            color: "#7c3aed",
            question: "¿Reconozco con claridad qué emoción estoy experimentando ante momentos de tensión o presión?"
        },
        {
            pillar: "Autorregulación",
            color: "#0ea5e9",
            question: "¿Mantengo la calma y reflexiono conscientemente antes de reaccionar cuando recibo una crítica o situación frustrante?"
        },
        {
            pillar: "Motivación",
            color: "#f59e0b",
            question: "¿Encuentro entusiasmo y determinación interna para perseverar en mis objetivos incluso ante los fracasos?"
        },
        {
            pillar: "Empatía",
            color: "#10b981",
            question: "¿Percibo con facilidad las necesidades, preocupaciones y estados anímicos de mis compañeros al trabajar en equipo?"
        },
        {
            pillar: "Habilidades Sociales",
            color: "#ef4444",
            question: "¿Tengo facilidad para dialogar constructivamente, mediar desacuerdos y motivar a las personas que me rodean?"
        }
    ];

    let currentQuizIndex = 0;
    let quizScores = [];

    const quizContainer = document.getElementById('quiz-container');
    const quizResultContainer = document.getElementById('quiz-result-container');
    const quizStepText = document.getElementById('quiz-step-text');
    const quizPillarBadge = document.getElementById('quiz-pillar-badge');
    const quizProgressBar = document.getElementById('quiz-progress-bar');
    const quizQuestionTitle = document.getElementById('quiz-question-title');
    const quizOptionsContainer = document.getElementById('quiz-options');
    const btnRestartQuiz = document.getElementById('btn-restart-quiz');

    function loadQuizQuestion(index) {
        if (!quizQuestionTitle) return;
        const q = autotestQuestions[index];
        quizStepText.textContent = `Pregunta ${index + 1} de ${autotestQuestions.length}`;
        quizPillarBadge.textContent = q.pillar;
        quizPillarBadge.style.borderColor = `${q.color}60`;
        quizPillarBadge.style.background = `${q.color}25`;
        quizPillarBadge.style.color = q.color;

        const pct = ((index + 1) / autotestQuestions.length) * 100;
        quizProgressBar.style.width = `${pct}%`;

        quizQuestionTitle.textContent = q.question;

        // Reset option buttons state
        if (quizOptionsContainer) {
            quizOptionsContainer.querySelectorAll('.quiz-option-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
        }
    }

    if (quizOptionsContainer) {
        quizOptionsContainer.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.currentTarget;
                const scoreVal = parseInt(targetBtn.dataset.value, 10);
                
                targetBtn.classList.add('selected');
                playTick();
                quizScores[currentQuizIndex] = scoreVal;

                setTimeout(() => {
                    currentQuizIndex++;
                    if (currentQuizIndex < autotestQuestions.length) {
                        loadQuizQuestion(currentQuizIndex);
                    } else {
                        showQuizResults();
                    }
                }, 300);
            });
        });
    }

    function showQuizResults() {
        if (!quizContainer || !quizResultContainer) return;
        quizContainer.classList.add('hidden');
        quizResultContainer.classList.remove('hidden');

        const totalScore = quizScores.reduce((a, b) => a + b, 0);
        const scoreNumberEl = document.getElementById('quiz-score-number');
        const titleEl = document.getElementById('quiz-result-title');
        const descEl = document.getElementById('quiz-result-description');
        const breakdownEl = document.getElementById('pillars-breakdown');

        if (scoreNumberEl) scoreNumberEl.textContent = totalScore;

        let profileTitle = '';
        let profileDesc = '';

        if (totalScore >= 22) {
            profileTitle = '👑 Líder Resiliente y Empático (Nivel Sobresaliente)';
            profileDesc = 'Tienes un dominio excepcional de tus estados emocionales. Transformas la adversidad en aprendizaje, inspiras confianza en tu equipo y te comunicas de manera asertiva y consciente.';
        } else if (totalScore >= 18) {
            profileTitle = '🌟 Alta Madurez Emocional (Nivel Destacado)';
            profileDesc = 'Posees un gran equilibrio interno y empatía con los demás. Mantienes el autocontrol en la mayoría de situaciones de presión y eres un pilar de estabilidad para tu entorno.';
        } else if (totalScore >= 14) {
            profileTitle = '🌱 Equilibrio Emocional en Crecimiento (Nivel Promedio)';
            profileDesc = 'Cuentas con buenas bases de autoconocimiento. Con prácticas cotidianas de autorregulación y escucha activa, puedes potenciar significativamente tu impacto como líder.';
        } else {
            profileTitle = '🔍 Despertar Emocional (Oportunidad de Evolución)';
            profileDesc = 'Identificar tus emociones es el primer gran paso hacia la maestría personal. Trabajar en técnicas de respiración y comunicación asertiva te brindará herramientas muy valiosas.';
        }

        if (titleEl) titleEl.textContent = profileTitle;
        if (descEl) descEl.textContent = profileDesc;

        // Breakdown items
        if (breakdownEl) {
            breakdownEl.innerHTML = '';
            autotestQuestions.forEach((q, idx) => {
                const s = quizScores[idx] || 3;
                const pct = (s / 5) * 100;
                const stat = document.createElement('div');
                stat.className = 'pillar-mini-stat';
                stat.innerHTML = `
                    <div class="title">
                        <span>${q.pillar}</span>
                        <span style="color: ${q.color};">${s}/5</span>
                    </div>
                    <div class="progress-bar-bg" style="height: 6px;">
                        <div class="progress-bar-fill" style="width: ${pct}%; background: ${q.color};"></div>
                    </div>
                `;
                breakdownEl.appendChild(stat);
            });
        }

        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#7c3aed', '#0ea5e9', '#f59e0b', '#10b981', '#ffffff']
        });
    }

    if (btnRestartQuiz) {
        btnRestartQuiz.addEventListener('click', () => {
            currentQuizIndex = 0;
            quizScores = [];
            quizResultContainer.classList.add('hidden');
            quizContainer.classList.remove('hidden');
            loadQuizQuestion(0);
        });
    }

    // Initialize Quiz
    loadQuizQuestion(0);

    // Close admin modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === adminLoginModal) adminLoginModal.style.display = 'none';
        if (e.target === adminDashboardModal) adminDashboardModal.style.display = 'none';
    });

}); // END DOMContentLoaded

