// Configuration
const API_URL = 'http://localhost:8000';

// Get DOM elements
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageInput = document.getElementById('imageInput');
const processBtn = document.getElementById('processBtn');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const loader = document.getElementById('loader');
const status = document.getElementById('status');
const uploadLabel = document.getElementById('uploadLabel');

// State
let fourierData = null;
let time = 0;
let isAnimating = false;
let path = [];
let animationId = null;
let uploadedFile = null;

// Helper function
function setStatus(type, message) {
    status.className = `status ${type}`;
    status.textContent = message;
}

// Update value displays
document.getElementById('nCircles').addEventListener('input', (e) => {
    document.getElementById('nCirclesValue').textContent = e.target.value;
});

document.getElementById('speed').addEventListener('input', (e) => {
    document.getElementById('speedValue').textContent = e.target.value + 'x';
});

document.getElementById('threshold').addEventListener('input', (e) => {
    document.getElementById('thresholdValue').textContent = e.target.value;
});

// Handle file selection
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        uploadedFile = file;
        processBtn.disabled = false;
        uploadLabel.textContent = `📁 ${file.name}`;
        setStatus('ready', 'Image loaded. Click "Process Image" to continue.');
    }
});

// Process image through Python backend
processBtn.addEventListener('click', async () => {
    if (!uploadedFile) return;
    
    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('n_circles', document.getElementById('nCircles').value);
    formData.append('edge_threshold', document.getElementById('threshold').value);
    
    setStatus('processing', 'Processing image...');
    loader.classList.add('active');
    processBtn.disabled = true;
    
    try {
        // FIX 1: Change backticks to parentheses
        const response = await fetch(`${API_URL}/process-image/`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Processing failed');
        }
        
        fourierData = await response.json();
        console.log('Received fourierData:', fourierData);
        
        setStatus('ready', `✅ Processed! Found ${fourierData.num_circles} circles from ${fourierData.num_points} edge points.`);
        startBtn.disabled = false;
        resetBtn.disabled = false;
        
    } catch (error) {
        setStatus('error', `❌ Error: ${error.message}`);
        console.error('Processing error:', error);
        // FIX 2: Change backticks to parentheses
        alert(`Error: ${error.message}\n\nMake sure backend is running: cd backend && python app.py`);
    } finally {
        loader.classList.remove('active');
        processBtn.disabled = false;
    }
});

// Draw epicycles
function drawEpicycles(time) {
    if (!fourierData) return null;
    
    const { frequencies, amplitudes, phases } = fourierData;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const showCircles = document.getElementById('showCircles').checked;
    const scale = Math.min(canvas.width, canvas.height) * 0.3;
    
    let x = centerX;
    let y = centerY;
    
    for (let i = 0; i < frequencies.length; i++) {
        const prevX = x;
        const prevY = y;
        
        const freq = frequencies[i];
        const amp = amplitudes[i] * scale;
        const phase = phases[i];
        const angle = 2 * Math.PI * freq * time + phase;
        
        x += amp * Math.cos(angle);
        y += amp * Math.sin(angle);
        
        if (showCircles && amp > 0.5) {
            // Draw circle
            ctx.beginPath();
            ctx.arc(prevX, prevY, amp, 0, 2 * Math.PI);
            ctx.strokeStyle = `rgba(100, 150, 255, ${Math.max(0.1, 0.5 / Math.sqrt(i + 1))})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Draw radius
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw dot
            if (i > 0) {
                ctx.beginPath();
                ctx.arc(prevX, prevY, 3, 0, 2 * Math.PI);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fill();
            }
        }
    }
    
    // Draw tip
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffff00';
    ctx.fill();
    
    return { x, y };
}

// Animation loop
function animate() {
    if (!isAnimating) return;
    
    const speed = parseFloat(document.getElementById('speed').value);
    time += 0.005 * speed;
    
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw epicycles
    const tip = drawEpicycles(time);
    
    if (tip) {
        path.push(tip);
        
        // Draw path
        if (path.length > 1) {
            ctx.beginPath();
            ctx.moveTo(path[0].x, path[0].y);
            for (let i = 1; i < path.length; i++) {
                ctx.lineTo(path[i].x, path[i].y);
            }
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        
        // Limit path length
        if (path.length > 3000) path.shift();
    }
    
    // Reset after full cycle
    if (time >= 1) time = 0;
    
    animationId = requestAnimationFrame(animate);
}

// Control buttons
startBtn.addEventListener('click', () => {
    if (!fourierData) {
        alert('Please process an image first!');
        return;
    }
    isAnimating = true;
    pauseBtn.disabled = false;
    animate();
    setStatus('', '');
});

pauseBtn.addEventListener('click', () => {
    isAnimating = false;
    pauseBtn.disabled = true;
    if (animationId) cancelAnimationFrame(animationId);
});

resetBtn.addEventListener('click', () => {
    isAnimating = false;
    pauseBtn.disabled = true;
    if (animationId) cancelAnimationFrame(animationId);
    time = 0;
    path = [];
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setStatus('ready', 'Reset complete. Click Start to animate again.');
});

// Initialize canvas
ctx.fillStyle = '#1a1a2e';
ctx.fillRect(0, 0, canvas.width, canvas.height);