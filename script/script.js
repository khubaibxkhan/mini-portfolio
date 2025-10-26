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

// 3D Container Tilt (Desktop and Mobile)
const container = document.getElementById('container');
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function updateTilt(x, y) {
    const rect = container.getBoundingClientRect();
    const tiltX = (y / rect.height) * 10; // Vertical tilt
    const tiltY = -(x / rect.width) * 10;  // Horizontal tilt
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

// Mobile Tilt (Gyroscope-based)
if (isMobile && window.DeviceOrientationEvent) {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', (event) => {
                        const gamma = event.gamma; // Tilt left-right (-90 to 90 degrees)
                        const beta = event.beta;   // Tilt front-back (-180 to 180 degrees)
                        const x = gamma * 0.2;    // Adjust sensitivity
                        const y = beta * 0.2;     // Adjust sensitivity
                        updateTilt(x, y);
                    }, false);
                }
            })
            .catch(console.error);
    } else {
        window.addEventListener('deviceorientation', (event) => {
            const gamma = event.gamma;
            const beta = event.beta;
            const x = gamma * 0.2;
            const y = beta * 0.2;
            updateTilt(x, y);
        }, false);
    }
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