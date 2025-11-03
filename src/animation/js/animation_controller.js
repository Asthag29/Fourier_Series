import EpicycleSystem from './epicycle_system.js';

export default class AnimationController {
    constructor(canvasId, epicycleData) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.epicycleSystem = new EpicycleSystem(epicycleData);
        this.isRunning = true;
        
        // NEW: Normalized time system
        this.totalSteps = 500;           // Total number of discrete steps in one period
        this.currentStep = 0;            // Current step [0, totalSteps)
        this.stepsPerFrame = 1;          // How many steps to advance per frame (speed control)
        
        // Alternative: You can also use continuous time
        // this.time = 0;
        // this.speed = 0.002;  // Speed of traversal through [0, 1]
        
        this.xOffset = this.width * 0.25;
        this.yOffset = this.height * 0.5;
    }
    
    update() {
        if (this.isRunning) {
            // Discrete stepping approach (like the reference code)
            this.currentStep += this.stepsPerFrame;
            
            // Wrap around when we complete one period
            if (this.currentStep >= this.totalSteps) {
                this.currentStep = this.currentStep % this.totalSteps;
                // Optionally clear path for clean restart
                // this.epicycleSystem.clearPath();
            }
            
            // Calculate normalized time t ∈ [0, 1]
            const t = this.currentStep / this.totalSteps;
            
            // Update system with normalized time
            this.epicycleSystem.updateWithNormalizedTime(t);
            
            /* Alternative: Continuous time approach
            this.time += this.speed;
            if (this.time >= 1.0) {
                this.time = this.time % 1.0;
            }
            this.epicycleSystem.updateWithNormalizedTime(this.time);
            */
        }
    }
    
    render() {
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, this.width, this.height);
        this.epicycleSystem.render(this.context, this.xOffset, this.yOffset, 100);
        
        // Optional: Display current time for debugging
        this.context.fillStyle = '#fff';
        this.context.font = '14px monospace';
        const t = (this.currentStep / this.totalSteps).toFixed(3);
        this.context.fillText(`t = ${t}`, 10, 20);
    }
    
    loop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.loop());
    }
    
    pause() {
        this.isRunning = !this.isRunning;
    }
    
    reset() {
        this.epicycleSystem.reset();
        this.currentStep = 0;
        // this.time = 0;  // If using continuous time
    }
    
    clearPath() {
        this.epicycleSystem.clearPath();
    }
    
    // NEW: Jump to specific time
    seekTo(t) {
        // t should be in [0, 1]
        this.currentStep = Math.floor(t * this.totalSteps);
        this.epicycleSystem.clearPath();
        this.epicycleSystem.updateWithNormalizedTime(t);
    }
    
    // NEW: Control speed
    setSpeed(stepsPerFrame) {
        this.stepsPerFrame = stepsPerFrame;
    }
    
    start() {
        this.loop();
    }
}