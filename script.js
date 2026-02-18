// CONFIGURATION
// AUTOMATICALLY LOADS: 10.jpg, 20.jpg ... up to 430.jpg (AND .JPG)
const PHOTO_COUNT = 43;
const STEP = 10;
const ASSETS = [];

// GENERATE FILENAMES: 10.jpg, 20.jpg ... 430.jpg
// Also tries .png, .jpeg AND UPPERCASE VARIANTS to match your files.
const validExtensions = [
    'jpg', 'png', 'jpeg', 'mp4',
    'JPG', 'PNG', 'JPEG', 'MP4'
];

for (let i = 1; i <= PHOTO_COUNT; i++) {
    const num = i * STEP; // 10, 20, 30...
    validExtensions.forEach(ext => {
        // Try to add potential file paths
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
    if (bgVideo) {
        bgVideo.classList.remove('hidden');
        bgVideo.play().catch(e => console.log("Video autoplay blocked:", e));
    }
    if (audio) {
        audio.play().catch(e => console.log("Audio autoplay blocked:", e));
    }

    // START LOOPS
    startFlashing();
    startSubliminal();
    startGlitchAudio();

    // ESCALATION
    setTimeout(() => {
        intenseMode = true;
        document.body.classList.add('intense');
        if (bgVideo) bgVideo.playbackRate = 1.5; // Speed up video
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
    if (ASSETS.length === 0) return;

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
        if (Math.random() > 0.8 && bgVideo) {
            bgVideo.currentTime -= 0.1; // Stutter back
        }
    }, 500);
}
