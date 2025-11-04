import Circle from './circles.js';

export default class EpicycleSystem {
    constructor(data) {
        this.circles = [];
        this.path = [];
        this.createCircles(data);
    }

    createCircles(data) {
        let parent = null;
        for (let i = 0; i < data.length; i++) {
            const [amplitude, frequency, phase] = data[i];
            const circle = new Circle(amplitude, frequency, phase, parent);
            this.circles.push(circle);
            parent = circle;
        }
    }

    updateWithNormalizedTime(t) {
        // ✅ First circle center ALWAYS at origin
        this.circles[0].x = 0;
        this.circles[0].y = 0;
        this.circles[0].setRotationFromTime(t);

        // ✅ Each subsequent circle's center moves to parent's endpoint
        for (let i = 1; i < this.circles.length; i++) {
            const prevCircle = this.circles[i - 1];
            this.circles[i].x = prevCircle.endX;  // Position at parent's endpoint
            this.circles[i].y = prevCircle.endY;
            this.circles[i].setRotationFromTime(t);
        }

        this.addPathPoint();
    }

    addPathPoint() {
        const lastCircle = this.circles[this.circles.length - 1];
        this.path.push({
            x: lastCircle.endX,
            y: lastCircle.endY
        });
    }

    reset() {
        this.path = [];
        for (let circle of this.circles) {
            circle.reset();
        }
        this.circles[0].x = 0;
        this.circles[0].y = 0;
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
                this.path[0].x * scale + xOffset,
                this.path[0].y * scale + yOffset
            );

            for (let i = 1; i < this.path.length; i++) {
                context.lineTo(
                    this.path[i].x * scale + xOffset,
                    this.path[i].y * scale + yOffset
                );
            }
            context.stroke();
        }

        // Draw tip point
        const lastCircle = this.circles[this.circles.length - 1];
        context.fillStyle = '#ff0088';
        context.beginPath();
        context.arc(
            lastCircle.endX * scale + xOffset,
            lastCircle.endY * scale + yOffset,
            4, 0, 2 * Math.PI
        );
        context.fill();
    }
}