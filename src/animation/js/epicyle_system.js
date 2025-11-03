import Circle from './circles.js';

export default class EpicycleSystem {
    constructor(data) {
        this.circles = [];
        this.path = [];
        //need to look into what is this

        // this.maxPathLength = 500;
        this.createCircles(data);
    }
    
    createCircles(data) {
        let parent = null;
        for (let i = 0; i < data.length; i++) {
            const [radius, frequency, phase] = data[i];
            const circle = new Circle(radius, frequency, phase, parent);
            this.circles.push(circle);
            parent = circle;
        }
    }
    
    // Legacy update method using deltaT
    update(deltaT) {
        for (let circle of this.circles) {
            circle.update(deltaT);
        }
        this.addPathPoint();
    }
    
    // NEW: Update using normalized time t ∈ [0, 1]
    updateWithNormalizedTime(t) {
        for (let circle of this.circles) {
            circle.setRotationFromTime(t);
        }
        this.addPathPoint();
    }
    
    addPathPoint() {
        const lastCircle = this.circles[this.circles.length - 1];
        this.path.push(
            { x: lastCircle.endX, 
            y: lastCircle.endY }
        );
        // if (this.path.length > this.maxPathLength) {
        //     this.path.shift();
        // }
    }
    
    reset() {
        for (let circle of this.circles) {
            circle.reset();
        }
        this.path = [];
    }
    
    clearPath() {
        this.path = [];
    }

    render(context, xOffset, yOffset, scale) {
        // Draw all circles
        for (let circle of this.circles) {
            circle.render(context, xOffset, yOffset, scale);
        }
        // Draw the path
        if (this.path.length > 1) {
            context.strokeStyle = '#00ff88';
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(
                (this.path[0].x + xOffset) * scale, 
                (this.path[0].y + yOffset) * scale);

            for (let i = 1; i < this.path.length; i++) {

                context.lineTo((this.path[i].x + xOffset) * scale, 
                (this.path[i].y + yOffset) * scale);
            }
            context.stroke();
        }
        // Draw tip point
        const lastCircle = this.circles[this.circles.length - 1];
        context.fillStyle = '#ff0088';
        context.beginPath();
        context.arc(lastCircle.endX + xOffset, lastCircle.endY + yOffset, 4, 0, 2 * Math.PI);
        context.fill();
    }
}