export default class Circle {
    constructor(radius, frequency, phase, parent = null) {
        this.radius = radius;
        this.frequency = frequency;
        this.phase = phase;
        this.parent = parent;
        this.rotation = phase;
        this.x = 0;  // Center x
        this.y = 0;  // Center y
    }

    reset() {
        this.rotation = this.phase;
    }

    setRotationFromTime(t) {
        this.rotation = this.phase + 2 * Math.PI * this.frequency * t;
        console.log(`Circle freq: ${this.frequency}, time: ${t.toFixed(3)}, rotation: ${this.rotation.toFixed(3)}`);
    }

    get endX() {
        return this.x + this.radius * Math.cos(this.rotation);
    }

    get endY() {
        return this.y + this.radius * Math.sin(this.rotation);
    }

    render(context, xOffset, yOffset, scale) {
        context.strokeStyle = 'rgba(100, 150, 255, 0.4)';
        context.lineWidth = 1;

        // Draw circle centered at (x, y)
        context.beginPath();
        context.arc(
            this.x * scale + xOffset,
            this.y * scale + yOffset,
            this.radius * scale,
            0, 2 * Math.PI
        );
        context.stroke();

        // Draw radius line from center to endpoint
        context.strokeStyle = 'rgba(255, 100, 100, 0.6)';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(
            this.x * scale + xOffset,
            this.y * scale + yOffset
        );
        context.lineTo(
            this.endX * scale + xOffset,
            this.endY * scale + yOffset
        );
        context.stroke();
    }
}