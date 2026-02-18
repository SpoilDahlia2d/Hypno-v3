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

function initShrine() {
    // UI TRANSITION
    const intro = document.getElementById('intro-overlay');
    intro.style.opacity = 0;
    setTimeout(() => {
        intro.classList.add('hidden');
        document.getElementById('worship-hud').classList.remove('hidden');
    }, 2000);

    isRunning = true;

    // FULLSCREEN
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(e => console.log(e));
    }

    // MEDIA
    if (bgVideo) {
        bgVideo.classList.remove('hidden');
        bgVideo.play();
    }
    if (audio) {
        audio.play();
        audio.volume = 0.5;
    }

    // START LOOPS
    loopImages();
    startLogic();

    // ACTIVATE PAYWALL AFTER 45 SECONDS
    setTimeout(activatePaywall, 45000);
}

// INTERACTION: CLICK TO WORSHIP
document.addEventListener('click', () => {
    if (!isRunning || paywallActive) return;

    worshipLevel += 10;
    if (worshipLevel > 100) worshipLevel = 100;
    updateBar();

    // VISUAL FEEDBACK
    if (bgVideo) bgVideo.style.filter = "brightness(0.8) grayscale(0%)";
    setTimeout(() => {
        if (bgVideo) bgVideo.style.filter = "brightness(0.4) grayscale(100%)";
    }, 200);
});

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
    bar.style.height = "100%";
    bar.style.width = `${worshipLevel}%`;
}

// IMAGE LOOP (ELEGANT)
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
    if (ASSETS.length === 0) return;
    const imgUrl = ASSETS[Math.floor(Math.random() * ASSETS.length)];
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

    img.onerror = () => img.remove();

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
    requestAnimationFrame(() => pw.classList.add('visible'));

    // STOP MEDIA
    if (bgVideo) bgVideo.pause();
    if (audio) audio.pause();
}

function unlockShrine() {
    // REALISTICALLY, we can't detect if they paid on throne via static site easily.
    // So we just unlock it when they click the link, assuming they did it.
    // Or we keep it locked. But usually 'click to unlock' is the best UX for this fake wall.

    window.open("https://throne.com/dahlia_star", "_blank");

    // UNLOCK AFTER DELAY (Simulating verification)
    setTimeout(() => {
        paywallActive = false;
        document.getElementById('paywall-overlay').classList.remove('visible');
        setTimeout(() => document.getElementById('paywall-overlay').classList.add('hidden'), 2000);

        if (bgVideo) bgVideo.play();
        if (audio) audio.play();
        loopImages();
        startLogic();
    }, 5000);
}
