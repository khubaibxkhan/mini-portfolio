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

// Particles
const particlesCanvas = document.createElement('canvas');
particlesCanvas.style.position = 'fixed';
particlesCanvas.style.top = '0';
particlesCanvas.style.left = '0';
particlesCanvas.style.zIndex = '-1';
document.body.appendChild(particlesCanvas);
particlesCanvas.width = window.innerWidth;
particlesCanvas.height = window.innerHeight;
const pCtx = particlesCanvas.getContext('2d');
const particles = [];
for (let i = 0; i < 50; i++) {
    particles.push({
        x: Math.random() * particlesCanvas.width,
        y: Math.random() * particlesCanvas.height,
        z: Math.random() * 500,
        speed: Math.random() * 0.5 + 0.2
    });
}
function drawParticles() {
    pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    particles.forEach(p => {
        p.y += p.speed;
        if (p.y > particlesCanvas.height) p.y = 0;
        const scale = 500 / (500 - p.z);
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, scale * 2, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(0, 255, 0, ${scale / 5})`;
        pCtx.fill();
    });
    requestAnimationFrame(drawParticles);
}
drawParticles();

// 3D Container Tilt
const container = document.getElementById('container');
document.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = (y / rect.height) * 10;
    const tiltY = -(x / rect.width) * 10;
    container.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
});

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
    bio.style.borderRight = 'none';
});

// Resize Canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
    drops.length = Math.floor(canvas.width / fontSize);
    drops.fill(1);
});