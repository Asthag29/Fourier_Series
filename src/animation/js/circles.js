
export default class Circle {


    constructor(radius, frequency, phase, parent = null) {
        this.radius = radius;
        this.frequency = frequency;     // frequency here is treated as a number of rotations per period
        this.startRotation = phase;             // initial phase at the start
        this.parent = parent;
        this.rotation = phase;          // current rotation angle
        this.x = 0;
        this.y = 0;
    }

    moveToParent() {
        this.x = this.parent.endX;
        this.y = this.parent.endY;
    }

    reset() {
        this.rotation = this.startRotation;
        if (this.parent !== null) {
            this.moveToParent();
        }
    }
    setRotationFromTime(t) {
        // t should be in [0, 1]
        this.rotation = 2 * Math.PI * this.frequency * t + this.startRotation;  // ✅ Use existing property        if (this.parent !== null) {
            this.moveToParent();
        }
    }
 

    
    // Update using time increment (legacy method - still works)
    //update rotation at delta time
    update(deltaT) {
        this.rotation += 2 * Math.PI * this.frequency * deltaT;
        if (this.parent !== null) {
            this.moveToParent();
        }
    }
    
    get endX() {
        return this.x + this.radius * Math.cos(this.rotation);      //phase is already included
    }
    
    get endY() {
        return this.y + this.radius * Math.sin(this.rotation);
    }

    get end(){
        return {
            x: this.endX,
            y: this.endY
        };
    }



    get length() {
        return 2 * Math.PI * this.radius * this.radius;
    }
    
//need to know what is scale parameter
    
    render(context, xOffset, yOffset, scale ) {

        context.strokeStyle = 'rgba(100, 150, 255, 0.4)';
        context.lineWidth = 1;

        // Draw circle
        context.beginPath();
        context.arc(
            (this.x + xOffset) * scale, 
            (this.y + yOffset) * scale, 
            this.radius * scale,    //radius 
            0, 2 * Math.PI);        // 0 , 2pi
        context.moveTo(
            (this.x + xOffset) * scale, 
            (this.y + yOffset) * scale);
        context.lineTo(
            (this.endX + xOffset) * scale, 
            (this.endY + yOffset) * scale);
        context.stroke();
    
    }
    //what is amt here?
    // amt is the amount of "length" to draw along the circle's path
    renderAmt(context, xOffset, yOffset, scale, amt) {
            if (amt < 0) {
                // useless
                return;
            }
            context.beginPath();

            // Draw radius
            var radiusAmt = amt / this.radius;        //amt is some sort of length
            if (radiusAmt > 1) {
                radiusAmt = 1;
            }
            context.moveTo(
                scale * (this.x + xOffset),
                scale * (this.y + yOffset));
            context.lineTo(
                scale * ((this.x + this.radius * radiusAmt * Math.cos(this.rotation)) + xOffset),
                scale * ((this.y + this.radius * radiusAmt * Math.sin(this.rotation)) + yOffset));
            amt -= this.radius;
            context.stroke();

            // Draw arc
            var arcAmt = amt / (2 * Math.PI * this.radius);
            // But also only draw if we have enough to draw
            if (arcAmt < 0) {
                // That's ok. That's fine.
                return;
            }

            if (arcAmt > 1) {
                arcAmt = 1;
            }
            context.beginPath();
            context.arc(
                scale * (this.x + xOffset),
                scale * (this.y + yOffset),
                scale * this.radius,
                this.rotation,
                this.rotation + 2 * Math.PI * arcAmt);
            context.stroke();
        }

        getDrawPosition(amt) {
            var radiusAmt = amt / this.radius;
            if (radiusAmt <= 1) {
                return {
                    x: this.x + this.radius * radiusAmt * Math.cos(this.rotation),
                    y: this.y + this.radius * radiusAmt * Math.sin(this.rotation)
                };
            }
            amt -= this.radius;
            var arcAmt = amt / (2 * Math.PI * this.radius);
            return {
                x: this.x + this.radius * Math.cos(this.rotation + 2 * Math.PI * arcAmt),
                y: this.y + this.radius * Math.sin(this.rotation + 2 * Math.PI * arcAmt)
            };
        }
    