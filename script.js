// CONFIGURATION
// RENAME YOUR FILES IN THE 'assets' FOLDER TO:
// 1.jpg, 2.jpg, 3.jpg ... up to 100.jpg
// or .png, .gif, .mp4
const MAX_FILES = 50;
const ASSETS = [];

// AUTO-DISCOVER ASSETS (1 to 50)
const validExtensions = ['jpg', 'png', 'gif', 'jpeg', 'webp', 'mp4'];

for (let i = 1; i <= MAX_FILES; i++) {
    validExtensions.forEach(ext => {
        // Try to add potential file paths
        // The browser will try to load them; if they don't exist, they just won't show.
        ASSETS.push(`assets/${num}.${ext}`);
    });
}

// FALLBACK
if (ASSETS.length === 0) {
    ASSETS.push("https://files.catbox.moe/bb56sw.JPG");
}

const WORDS = ["LOOK", "OBEY", "MINE", "DATA", "EMPTY", "GOOD", "SUBMIT", "FOREVER", "NO CHOICE"];

const bgVideo = document.getElementById('bg-video');
const audio = document.getElementById('hypno-audio');
const flashContainer = document.getElementById('flash-container');
const subText = document.getElementById('subliminal-text');

let isRunning = false;
let intenseMode = false;

function startExperience() {
    // UI TRANSITION
    const overlay = document.getElementById('overlay');
    overlay.style.transition = "opacity 2s";
    overlay.style.opacity = 0;
    setTimeout(() => overlay.remove(), 2000);

    isRunning = true;

    // FULLSCREEN
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }

    // START MEDIA
    bgVideo.classList.remove('hidden');
    bgVideo.play();
    audio.play();

    // START LOOPS
    startFlashing();
    startSubliminal();
    startGlitchAudio();

    // ESCALATION
    setTimeout(() => {
        intenseMode = true;
        document.body.classList.add('intense');
        bgVideo.playbackRate = 1.5; // Speed up video
    }, 10000); // After 10 seconds, go crazy
}

function startFlashing() {
    if (!isRunning) return;

    // RANDOM INTERVAL (Rapid Fire)
    // In intense mode, it's faster
    const timeout = intenseMode ? Math.random() * 200 + 50 : Math.random() * 800 + 200;

    setTimeout(() => {
        spawnImage();
        startFlashing();
    }, timeout);
}

function spawnImage() {
    const imgUrl = ASSETS[Math.floor(Math.random() * ASSETS.length)];
    const img = document.createElement('img');
    img.src = imgUrl;
    img.className = 'flash-img flashing';

    // ERROR HANDLING: If 10.png doesn't exist but 10.jpg does, 
    // the png error will trigger this and remove it from the list silently.
    img.onerror = () => {
        img.remove();
        const index = ASSETS.indexOf(imgUrl);
        if (index > -1) {
            ASSETS.splice(index, 1);
        }
    };

    // RANDOM POSITION OFFSET
    const xOff = (Math.random() - 0.5) * 50;
    const yOff = (Math.random() - 0.5) * 50;
    img.style.left = `calc(50% + ${xOff}px)`; // Centered but jittery
    img.style.top = `calc(50% + ${yOff}px)`;
    img.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 20 - 10}deg)`;

    flashContainer.appendChild(img);

    // CLEANUP
    setTimeout(() => {
        img.remove();
    }, 500); // Remove after animation
}

function startSubliminal() {
    setInterval(() => {
        subText.innerText = WORDS[Math.floor(Math.random() * WORDS.length)];
        subText.style.opacity = Math.random() * 0.5;
        setTimeout(() => subText.style.opacity = 0, 100);
    }, 2000);
}

function startGlitchAudio() {
    // Randomly chop video playback for glitch effect
    setInterval(() => {
        if (Math.random() > 0.8) {
            bgVideo.currentTime -= 0.1; // Stutter back
        }
    }, 500);
}
