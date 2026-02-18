document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const countdown = document.getElementById('countdown');
    const countNum = document.getElementById('countdown-number');
    const cakeSection = document.getElementById('cake-section');
    const blowText = document.getElementById('blow-text');
    const blowTimer = document.getElementById('blow-timer');
    const enterBtn = document.getElementById('enter-btn');
    const audio = document.getElementById('intro-music');
    const flame = document.querySelector('.flame');

    // --- State ---
    let startCount = 5;
    let blowCount = 5;

    // --- Audio Autoplay Strategy ---
    // 1. Try immediately on load (works in some setups)
    audio.volume = 1.0;
    audio.play().catch(() => console.log("Autoplay blocked initially"));

    // 2. Unlock on ANY user interaction (silent and invisible)
    const unlockAudio = () => {
        audio.play().then(() => {
            // Success: Remove listeners
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
            document.removeEventListener('scroll', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
            document.removeEventListener('mousemove', unlockAudio);
        }).catch(() => { });
    };

    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
    document.addEventListener('scroll', unlockAudio);
    document.addEventListener('keydown', unlockAudio);
    document.addEventListener('mousemove', unlockAudio);

    // --- Auto Start Sequence ---
    startCountdown();

    function startCountdown() {
        countdown.classList.remove('hidden');
        countNum.textContent = startCount;

        const countInterval = setInterval(() => {
            startCount--;
            if (startCount > 0) {
                countNum.textContent = startCount;
            } else {
                clearInterval(countInterval);
                countdown.classList.add('hidden');
                showCake();
            }
        }, 1000);
    }

    function showCake() {
        cakeSection.classList.remove('hidden');
        cakeSection.style.animation = 'fadeIn 1s ease forwards';

        const blowInterval = setInterval(() => {
            blowCount--;
            if (blowCount > 0) {
                blowTimer.textContent = blowCount;
            } else {
                clearInterval(blowInterval);
                blowCandle();
            }
        }, 1000);
    }

    function blowCandle() {
        // Fade out the text
        blowText.style.transition = "opacity 1s ease";
        blowText.style.opacity = "0";

        // Extinguish single flame
        if (flame) {
            flame.classList.add('flame-out');
        }

        // Fire Fireworks
        fireFireworks();

        // Ensure music plays at this key moment
        audio.play().catch(() => console.log("Still blocked, waiting for interaction"));

        // Delay Button
        setTimeout(() => {
            enterBtn.classList.remove('hidden');
            enterBtn.style.animation = 'fadeIn 1s ease forwards';
        }, 4000);
    }

    function fireFireworks() {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const random = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    // --- Transitions ---
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    enterBtn.addEventListener('click', () => {
        const currentTime = audio.currentTime;
        window.location.href = `main.html?musicTime=${currentTime}`;
    });
});
