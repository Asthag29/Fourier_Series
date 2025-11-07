import AnimationController from './animation_controller.js';

let animationController = null;

document.getElementById('processBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const nCirclesInput = document.getElementById('nCirclesInput');
    const statusText = document.getElementById('statusText');
    
    if (!fileInput.files.length) {
        statusText.textContent = 'Please select an image';
        return;
    }

    if (!nCirclesInput.value) {
        statusText.textContent = 'Please enter the number of circles';
        return;
    }
    
    // ✅ Get n_circles value from input
    const nCircles = parseInt(nCirclesInput.value);
    if (isNaN(nCircles) || nCircles < 1) {
        statusText.textContent = 'Please enter a valid number of circles';
        return;
    }
    
    statusText.textContent = 'Processing image...';
    
    try {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('n_circles', nCircles);  // ✅ Add n_circles to form data
        
        const response = await fetch('http://localhost:8000/api/fourier-data', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (!data.success) {
            statusText.textContent = `Error: ${data.error}`;
            return;
        }
        
        // ✅ Update circle count display
        document.getElementById('circleCount').textContent = data.circles.length;
        statusText.textContent = `Successfully processed ${data.circles.length} circles!`;

        // Initialize animation with received data
        animationController = new AnimationController('epicycleCanvas', data.circles);
        animationController.start();
        
    } catch (error) {
        statusText.textContent = `Error: ${error.message}`;
        console.error('Error:', error);
    }
});

document.getElementById('pauseBtn').addEventListener('click', () => {
    if (animationController) {
        animationController.pause();
        document.getElementById('statusText').textContent = 'Animation paused';
    }
});

document.getElementById('resetBtn').addEventListener('click', () => {
    if (animationController) {
        animationController.reset();
        document.getElementById('statusText').textContent = 'Animation reset';
    }
});

document.getElementById('clearPathBtn').addEventListener('click', () => {
    if (animationController) {
        animationController.clearPath();
    }
});