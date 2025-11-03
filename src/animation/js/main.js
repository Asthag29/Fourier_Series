import AnimationController from './animation_controller.js';

// Function to get Fourier data from backend
async function getFourierDataFromBackend(file, n_circles = 100) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('n_circles', n_circles);

    const response = await fetch('http://localhost:8000/api/fourier-data', {
        method: 'POST',
        body: formData
    });
    const result = await response.json();
    if (result.success) {
        return result.circles;
    } else {
        throw new Error(result.error);
    }
}

let animationController = null;

// Process button handler
document.getElementById('processBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const selectedFile = fileInput.files[0];
    
    if (!selectedFile) {
        alert('Please select an image file first!');
        return;
    }
    
    try {
        const circlesData = await getFourierDataFromBackend(selectedFile, 100);
        animationController = new AnimationController('epicycleCanvas', circlesData);
        animationController.start();
        
        // Update UI
        document.getElementById('circleCount').textContent = 
            animationController.epicycleSystem.circles.length;
    } catch (error) {
        console.error('Error processing image:', error);
        alert('Error processing image: ' + error.message);
    }
});

// Controls
document.getElementById('pauseBtn').addEventListener('click', () => {
    if (animationController) {
        animationController.pause();
        document.getElementById('pauseBtn').textContent = 
            animationController.isRunning ? 'Pause' : 'Resume';
    }
});

document.getElementById('resetBtn').addEventListener('click', () => {
    if (animationController) {
        animationController.reset();
    }
});

document.getElementById('clearPathBtn').addEventListener('click', () => {
    if (animationController) {
        animationController.clearPath();
    }
});