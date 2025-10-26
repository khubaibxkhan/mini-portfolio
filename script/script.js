// Matrix Background
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
const fontSize = 10;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f0';
    ctx.font = fontSize + 'px monospace';
    drops.forEach((y, i) => {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}
setInterval(drawMatrix, 50);

// 3D Container Tilt (Desktop, Mobile Gyro, and Touch Fallback)
const container = document.getElementById('container');
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let startX, startY; // For touch fallback

function updateTilt(x, y) {
    const rect = container.getBoundingClientRect();
    const tiltX = (y / rect.height) * 8; // Slightly reduced sensitivity for smoother feel
    const tiltY = -(x / rect.width) * 8;
    container.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
}

// Desktop Tilt (Cursor-based)
if (!isMobile) {
    document.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        updateTilt(x, y);
    });
}

// Mobile Gyro Tilt
if (isMobile && window.DeviceOrientationEvent) {
    console.log('Gyroscope detected—requesting permission...');
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    console.log('Gyro permission granted');
                    window.addEventListener('deviceorientation', handleOrientation, false);
                } else {
                    console.log('Gyro permission denied—falling back to touch');
                    setupTouchTilt();
                }
            })
            .catch(error => {
                console.log('Gyro permission error:', error);
                setupTouchTilt();
            });
    } else {
        window.addEventListener('deviceorientation', handleOrientation, false);
    }
}

function handleOrientation(event) {
    const gamma = event.gamma || 0; // Left-right tilt
    const beta = event.beta || 0;   // Front-back tilt
    const x = gamma * 0.15;         // Reduced sensitivity for Samsung A25
    const y = beta * 0.15;
    updateTilt(x, y);
}

// Touch Fallback for Non-Gyro Devices (e.g., A14)
function setupTouchTilt() {
    console.log('Setting up touch tilt fallback');
    let touchStartX, touchStartY;
    container.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    container.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touchX = e.touches[0].clientX - touchStartX;
        const touchY = e.touches[0].clientY - touchStartY;
        const x = (touchX / window.innerWidth) * 20; // Simulate tilt based on swipe
        const y = (touchY / window.innerHeight) * 20;
        updateTilt(x, y);
    }, { passive: false });
}

// Modal Control
const modal = document.getElementById('warning-modal');
function closeModal() {
    modal.style.display = 'none';
}
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Bio Animation End
const bio = document.querySelector('.bio');
bio.addEventListener('animationend', () => {
    bio.style.borderRight = 'none'; // Remove blinking caret after animation
});

// Resize Canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drops.length = Math.floor(canvas.width / fontSize);
    drops.fill(1);
});