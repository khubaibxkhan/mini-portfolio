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
    drops.length = Math.floor(canvas.width / fontSize);
    drops.fill(1);
});