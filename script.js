class Boid {
    constructor(x, y, char) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.char = char;
        this.size = 16;
        this.maxSpeed = 100; // Further increased for much faster movement
        this.maxForce = 10000; // Further increased for quicker turning
        this.separationDistance = 30;
        this.alignmentDistance = 50;
        this.cohesionDistance = 50;
    }

    update(boids) {
        // Apply flocking behaviors
        const separation = this.separate(boids);
        const alignment = this.align(boids);
        const cohesion = this.cohere(boids);

        // Weight the behaviors
        separation.x *= 1.5;
        separation.y *= 1.5;
        alignment.x *= 1.0;
        alignment.y *= 1.0;
        cohesion.x *= 1.0;
        cohesion.y *= 1.0;

        // Apply forces
        this.applyForce(separation);
        this.applyForce(alignment);
        this.applyForce(cohesion);

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Limit speed
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > this.maxSpeed) {
            this.vx = (this.vx / speed) * this.maxSpeed;
            this.vy = (this.vy / speed) * this.maxSpeed;
        }
    }

    separate(boids) {
        const desiredSeparation = this.separationDistance;
        const steer = { x: 0, y: 0 };
        let count = 0;

        for (let other of boids) {
            const d = this.distance(other);
            if (d > 0 && d < desiredSeparation) {
                const diff = {
                    x: this.x - other.x,
                    y: this.y - other.y
                };
                diff.x /= d;
                diff.y /= d;
                steer.x += diff.x;
                steer.y += diff.y;
                count++;
            }
        }

        if (count > 0) {
            steer.x /= count;
            steer.y /= count;
            this.normalize(steer);
            steer.x *= this.maxSpeed;
            steer.y *= this.maxSpeed;
            steer.x -= this.vx;
            steer.y -= this.vy;
            this.limit(steer, this.maxForce);
        }

        return steer;
    }

    align(boids) {
        const neighborDist = this.alignmentDistance;
        const sum = { x: 0, y: 0 };
        let count = 0;

        for (let other of boids) {
            const d = this.distance(other);
            if (d > 0 && d < neighborDist) {
                sum.x += other.vx;
                sum.y += other.vy;
                count++;
            }
        }

        if (count > 0) {
            sum.x /= count;
            sum.y /= count;
            this.normalize(sum);
            sum.x *= this.maxSpeed;
            sum.y *= this.maxSpeed;
            const steer = {
                x: sum.x - this.vx,
                y: sum.y - this.vy
            };
            this.limit(steer, this.maxForce);
            return steer;
        }
        return { x: 0, y: 0 };
    }

    cohere(boids) {
        const neighborDist = this.cohesionDistance;
        const sum = { x: 0, y: 0 };
        let count = 0;

        for (let other of boids) {
            const d = this.distance(other);
            if (d > 0 && d < neighborDist) {
                sum.x += other.x;
                sum.y += other.y;
                count++;
            }
        }

        if (count > 0) {
            sum.x /= count;
            sum.y /= count;
            return this.seek(sum);
        }
        return { x: 0, y: 0 };
    }

    seek(target) {
        const desired = {
            x: target.x - this.x,
            y: target.y - this.y
        };
        this.normalize(desired);
        desired.x *= this.maxSpeed;
        desired.y *= this.maxSpeed;
        const steer = {
            x: desired.x - this.vx,
            y: desired.y - this.vy
        };
        this.limit(steer, this.maxForce);
        return steer;
    }

    applyForce(force) {
        this.vx += force.x;
        this.vy += force.y;
    }

    distance(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    normalize(vector) {
        const mag = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        if (mag > 0) {
            vector.x /= mag;
            vector.y /= mag;
        }
    }

    limit(vector, max) {
        const mag = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        if (mag > max) {
            vector.x = (vector.x / mag) * max;
            vector.y = (vector.y / mag) * max;
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.font = `${this.size}px 'Courier New', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.char, this.x, this.y);
    }

    // Get nearby boids for network visualization
    getNearbyBoids(boids, maxDistance = 80) {
        const nearby = [];
        for (let other of boids) {
            if (other !== this) {
                const d = this.distance(other);
                if (d < maxDistance) {
                    nearby.push({ boid: other, distance: d });
                }
            }
        }
        return nearby;
    }
}

// Canvas setup
const canvas = document.getElementById('boidsCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Time display
const timeDisplay = document.getElementById('timeDisplay');

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    timeDisplay.textContent = timeString;
}

// Initialize boids with time characters
let boids = [];

function initializeBoids() {
    boids = [];
    const timeString = new Date().toLocaleTimeString();
    const chars = timeString.split('');
    
    for (let i = 0; i < chars.length; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        boids.push(new Boid(x, y, chars[i]));
    }
}

// Animation loop
// For trail effect
let lastResetTime = Date.now();
const TRAIL_FRAMES = 20;
// Calculate alpha so that after 20 frames, opacity is ~0.05 (almost gone): alpha = 1 - (0.05)^(1/20)
const TRAIL_ALPHA = 1 - Math.pow(0.05, 1 / TRAIL_FRAMES); // ≈ 0.146

// For 10fps animation
const FPS = 10;
const FRAME_INTERVAL = 1000 / FPS;
let lastFrameTime = 0;

function animate10fps(now) {
    if (!lastFrameTime) lastFrameTime = now;
    const elapsed = now - lastFrameTime;
    if (elapsed >= FRAME_INTERVAL) {
        lastFrameTime = now;
        // Draw a semi-transparent white rectangle to fade previous frames
        ctx.fillStyle = `rgba(255,255,255,${TRAIL_ALPHA})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw network connections first (behind boids)
        drawNetworkConnections();

        // Update and draw boids
        for (let boid of boids) {
            boid.update(boids);
            boid.draw(ctx);
        }
    }
    requestAnimationFrame(animate10fps);
}

// Draw network connections between nearby boids
function drawNetworkConnections() {
    const maxDistance = 500;
    // Set higher minimums for visibility
    const maxThickness = 3;
    const minThickness = 1;
    const minOpacity = 0.35;

    // Draw every interaction (unique pairs)
    for (let i = 0; i < boids.length; i++) {
        for (let j = i + 1; j < boids.length; j++) {
            const boidA = boids[i];
            const boidB = boids[j];
            const dx = boidA.x - boidB.x;
            const dy = boidA.y - boidB.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < maxDistance) {
                // Calculate line thickness based on distance (closer = thicker)
                let thickness = maxThickness - ((distance / maxDistance) * (maxThickness - minThickness));
                if (thickness < minThickness) thickness = minThickness;

                // Calculate opacity based on distance (closer = more opaque)
                let opacity = 1 - (distance / maxDistance);
                if (opacity < minOpacity) opacity = minOpacity;

                // Draw the connection line
                ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
                ctx.lineWidth = thickness;
                ctx.beginPath();
                ctx.moveTo(boidA.x, boidA.y);
                ctx.lineTo(boidB.x, boidB.y);
                ctx.stroke();
            }
        }
    }
}

// Initialize and start
initializeBoids();
updateTime();
requestAnimationFrame(animate10fps);

// Update time every second

setInterval(() => {
    updateTime();
    // Reinitialize boids with new time characters
    initializeBoids();
    // Fully clear the canvas to remove all trails
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lastResetTime = Date.now();
}, 1000);