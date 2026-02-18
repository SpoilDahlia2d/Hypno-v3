// CONFIGURATION
const PHOTO_COUNT = 43;
const STEP = 10;
const ASSETS = [];

// GENERATE IMAGE LIST
const validExtensions = ['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG'];
for (let i = 1; i <= PHOTO_COUNT; i++) {
    const num = i * STEP;
    validExtensions.forEach(ext => {
        ASSETS.push(`assets/${num}.${ext}`);
    });
}

// SETUP
let isRunning = false;
let worshipLevel = 50; // Starts at 50%
let paywallActive = false;
const bgVideo = document.getElementById('bg-video');
const audio = document.getElementById('hypno-audio');
const flashContainer = document.getElementById('flash-container');
const bar = document.getElementById('worship-bar');

// PRELOADER
const loadedImages = [];
let loadedCount = 0;

function preloadAssets() {
    console.log("Starting preload of " + ASSETS.length + " potential images...");
    ASSETS.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            loadedImages.push(src);
            loadedCount++;
            updateLoadingStatus();
        };
        img.onerror = () => {
            // File doesn't exist, just skip
            loadedCount++;
            updateLoadingStatus();
        }
    });
}

function updateLoadingStatus() {
    const btn = document.getElementById('enter-btn');
    if (!btn) return;

    const pct = Math.floor((loadedCount / ASSETS.length) * 100);

    if (pct < 100) {
        btn.innerText = `LOADING... ${pct}%`;
        btn.disabled = true;
        btn.style.opacity = 0.5;
    } else {
        btn.innerText = "ENTER THE TEMPLE";
        btn.disabled = false;
        btn.style.opacity = 1;
    }
}

// Start preloading immediately
preloadAssets();

function initShrine() {
    // UI TRANSITION
    const intro = document.getElementById('intro-overlay');
    intro.style.transition = "opacity 2s";
    intro.style.opacity = 0;

    setTimeout(() => {
        intro.classList.add('hidden');
        document.getElementById('worship-hud').classList.remove('hidden');
        document.body.classList.add('vignette-pulse');
        initParticles();
    }, 2000);

    isRunning = true;

    // FULLSCREEN
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(e => console.log(e));
    }

    // MEDIA
    if (bgVideo) {
        bgVideo.classList.remove('hidden');
        bgVideo.play().catch(e => console.log("Video autostart failed", e));
    }
    if (audio) {
        audio.play().catch(e => console.log("Audio autostart failed", e));
        audio.volume = 0.5;
    }

    // START LOOPS
    loopImages();
    startLogic();

    // ACTIVATE PAYWALL AFTER 45 SECONDS
    setTimeout(activatePaywall, 45000);
}

// PARTICLES
function initParticles() {
    for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = Math.random() * 5 + 5 + 's';
        p.style.animationDelay = Math.random() * 5 + 's';
        document.body.appendChild(p);
    }
}

// CODE GATE CONFIGURATION
const SECRET_CODE = "OBEY"; // <--- CHANGE THIS CODE TO WHATEVER YOU WANT
let totalClicks = 0;
const CLICK_GOAL = 500;
let rewardClaimed = false;

// INTERACTION: CLICK TO WORSHIP
document.addEventListener('click', (e) => {
    // Ignore clicks on buttons/inputs
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'A') return;

    if (!isRunning || paywallActive) return;

    worshipLevel += 10;
    if (worshipLevel > 100) worshipLevel = 100;

    // CLICK COUNTER LOGIC
    totalClicks++;
    document.getElementById('click-counter').innerText = `CLICKS: ${totalClicks} / ${CLICK_GOAL}`;

    if (totalClicks >= CLICK_GOAL && !rewardClaimed) {
        unlockReward();
    }

    updateBar();

    // VISUAL FEEDBACK
    if (bgVideo) bgVideo.style.filter = "brightness(0.8) grayscale(0%)";
    setTimeout(() => {
        if (bgVideo) bgVideo.style.filter = "brightness(0.4) grayscale(100%)";
    }, 200);
});

function checkCode() {
    const input = document.getElementById('code-input');
    const error = document.getElementById('error-msg');

    // Case insensitive check
    if (input.value.toUpperCase().trim() === SECRET_CODE) {
        // SUCCESS
        paywallActive = false;
        document.getElementById('paywall-overlay').classList.add('hidden');
        document.getElementById('paywall-overlay').classList.remove('visible');

        // Resume
        if (bgVideo) bgVideo.play();
        if (audio) audio.play();
        startLogic();
        loopImages();

    } else {
        // FAIL
        error.classList.remove('hidden');
        input.style.borderColor = "red";
        setTimeout(() => {
            error.classList.add('hidden');
            input.style.borderColor = "#d4af37";
        }, 2000);
    }
}

function unlockReward() {
    rewardClaimed = true;
    const modal = document.getElementById('reward-overlay');
    modal.classList.remove('hidden');

    // PAUSE FOR MOMENT
    if (bgVideo) bgVideo.pause();
}

function closeReward() {
    document.getElementById('reward-overlay').classList.add('hidden');
    if (bgVideo) bgVideo.play();
}

// LOGIC LOOP (DRAINS METER)
function startLogic() {
    setInterval(() => {
        if (!isRunning || paywallActive) return;

        worshipLevel -= 1; // Decay
        if (worshipLevel < 0) worshipLevel = 0;
        updateBar();

        if (worshipLevel < 20) {
            document.getElementById('instruction-text').style.color = "red";
            document.getElementById('instruction-text').innerText = "PRAY HARDER";
        } else {
            document.getElementById('instruction-text').style.color = "#fff";
            document.getElementById('instruction-text').innerText = "TAP SCREEN TO PRAY";
        }

    }, 100);
}

function updateBar() {
    if (!bar) return;
    bar.style.height = "100%";
    bar.style.width = `${worshipLevel}%`;
}

// IMAGE LOOP (PRELOADED ONLY)
function loopImages() {
    if (!isRunning || paywallActive) return;

    let timeout = Math.random() * 2000 + 1000;

    // If worship is high, show more images (reward)
    if (worshipLevel > 80) timeout = 800;

    setTimeout(() => {
        spawnImage();
        loopImages();
    }, timeout);
}

function spawnImage() {
    // USE ONLY LOADED IMAGES
    if (loadedImages.length === 0) return;

    const imgUrl = loadedImages[Math.floor(Math.random() * loadedImages.length)];
    const img = document.createElement('img');
    img.src = imgUrl;
    img.classList.add('flash-img');

    // CENTERED ELEGANCE
    img.style.left = '50%';
    img.style.top = '50%';
    img.style.transform = `translate(-50%, -50%) scale(0.8)`;
    img.style.opacity = 0;

    flashContainer.appendChild(img);

    // ANIMATE IN
    requestAnimationFrame(() => {
        img.style.opacity = 1;
        img.style.transform = `translate(-50%, -50%) scale(1) rotate(${Math.random() * 4 - 2}deg)`;
    });

    // REMOVE
    setTimeout(() => {
        img.style.opacity = 0;
        img.style.transform = `translate(-50%, -50%) scale(1.1)`;
        setTimeout(() => img.remove(), 1000);
    }, 4000);
}

// PAYWALL LOGIC
function activatePaywall() {
    paywallActive = true;
    const pw = document.getElementById('paywall-overlay');
    pw.classList.remove('hidden');
    // Force reflow
    void pw.offsetWidth;
    pw.classList.add('visible');

    // STOP MEDIA
    if (bgVideo) bgVideo.pause();
    if (audio) audio.pause();
}
