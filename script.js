
// Rain Effect Animation Class
class RainEffect {
    constructor() {
        // Initialize SVG elements and container bounds
        //Initialize SVG canvas for rain animation
        //  Uses SVG for better performance with multiple animated elements
        //  Manages viewport and container dimensions
         
        this.svg = document.querySelector('.rain-canvas');
        this.raindrops = document.querySelector('.raindrops');
        this.glassContainer = document.querySelector('.glass-container');
        
        // Get container dimensions
        this.containerBounds = this.glassContainer.getBoundingClientRect();
        this.width = this.containerBounds.width;
        this.height = this.containerBounds.height;
        
        // Set SVG viewport
        // Reference: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
        this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
        
        // Initialize raindrop collection and state
        this.activeRaindrops = new Set();
        this.isRaining = true;
        
        this.init(); // Start the rain effect
    }

    // creating multiple raindrops

    init() {
        for (let i = 0; i < 50; i++) { // Create 50 initial raindrops
            this.createRaindrops();
        }
        this.animate(); // Start animation loop
    }

    // Create individual raindrops
    // reference: https://www.youtube.com/watch?v=yiaOQW7k2n8
    // reference： https://codepen.io/arickle/pen/XKjMZY
    //   Reference:  https://codepen.io/arickle/pen/XKjMZY


    createRaindrops() {
        const raindrop = document.createElementNS("http://www.w3.org/2000/svg", "line"); // Create SVG line element for raindrop
        // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS
        const x = Math.random() * this.width;
        const y = -10;
        const length = 8 + Math.random() * 4;
        
        // Set raindrop attributes
        raindrop.setAttribute('x1', x);
        raindrop.setAttribute('y1', y);
        raindrop.setAttribute('x2', x);
        raindrop.setAttribute('y2', y + length);
        
        this.raindrops.appendChild(raindrop);  // Add raindrop to SVG container
        
        // Add to active raindrops collection
        this.activeRaindrops.add({
            element: raindrop,
            x: x,
            y: y,
            speed: 3 + Math.random() * 8, // random speed
            length: length
        });
    }

    // Animate raindrops
    animate() {
        if (this.isRaining) { // check if raining
            this.activeRaindrops.forEach(drop => {
                drop.y += drop.speed;
                
                // Remove raindrops that fall below container
                if (drop.y > this.height) { // Check if the raindrop has fallen below the container
                    this.activeRaindrops.delete(drop);
                    drop.element.remove();
                } else {
                    // Update raindrop position
                    drop.element.setAttribute('y1', drop.y);
                    drop.element.setAttribute('y2', drop.y + drop.length);
                }
            });

            // Maintain constant number (50) of raindrops
            while (this.activeRaindrops.size < 50) {
                this.createRaindrops();
            }
        }
        
        requestAnimationFrame(() => this.animate());
        // Request the next animation frame
         // Reference: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    
    }
}

// Audio Controller Class
// Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement

class AudioController {
    constructor() {
        // Initialize audio elements
        this.rainSound = document.getElementById('rainSound');  // rain sound
        this.thunderSound = document.getElementById('thunderSound'); // thunder sound
        this.rainToggle = document.getElementById('rainToggle');
        this.thunderToggle = document.getElementById('thunderToggle');
        
        // Track audio state
        this.isRainPlaying = false;
        this.isThunderPlaying = false;
        
        if (!this.rainSound || !this.thunderSound) {
            console.error('Audio elements not found');
            return;
        }
        
        this.init();
    }

    // Initialize audio controls
    init() {
        this.rainSound.load(); 
        this.thunderSound.load();
        
        // Event listeners for audio controls
        this.rainToggle.addEventListener('click', () => this.toggleRain());
        this.thunderToggle.addEventListener('click', () => this.toggleThunder());
        
        // Handle thunder sound loop
        this.thunderSound.addEventListener('ended', () => {
            if (this.isThunderPlaying) {
                this.thunderSound.currentTime = 0;
                this.thunderSound.play().catch(e => console.error('Error replaying thunder:', e)); // Play the thunder sound again
            }
        });
    }

    // Toggle Reference: https://www.basedash.com/blog/how-to-create-a-toggle-button-in-javascript
    // Toggle rain sound
    toggleRain() {
        if (!this.isRainPlaying) {
            this.rainSound.play()
                .then(() => {
                    this.isRainPlaying = true;
                    this.rainToggle.classList.add('active'); // add active class to rain toggle button
                })
                .catch(e => console.error('Error playing rain:', e));
        } else {
            this.rainSound.pause();
            this.rainSound.currentTime = 0;
            this.isRainPlaying = false;
            this.rainToggle.classList.remove('active'); // remove active class to rain toggle button
        }
    }

    // Toggle thunder sound
    toggleThunder() {
        if (!this.isThunderPlaying) {
            this.thunderSound.currentTime = 0;
            this.thunderSound.play()
                .then(() => {
                    this.isThunderPlaying = true;
                    this.thunderToggle.classList.add('active');
                })
                .catch(e => console.error('Error playing thunder:', e));
        } else {
            this.thunderSound.pause();
            this.thunderSound.currentTime = 0;
            this.isThunderPlaying = false;
            this.thunderToggle.classList.remove('active');
        }
    }
}

// Initialize on DOM Content Load

document.addEventListener('DOMContentLoaded', () => {
    // Initialize rain effect
    const rainEffect = new RainEffect();

    // Process poetry lines
    const tearsLine = document.querySelector('.poem-line[data-theme="tears"]');
    if (tearsLine && !tearsLine.dataset.processed) {
        const words = tearsLine.textContent.trim().split(' ');
        tearsLine.innerHTML = '';
        words.forEach(word => {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = word;
            tearsLine.appendChild(span);
            if (word !== words[words.length - 1]) {
                tearsLine.appendChild(document.createTextNode(' '));
            }
        });
        tearsLine.dataset.processed = 'true';
    }


    // Initialize audio controller
    const audioController = new AudioController();

    // Design system modal controls
    const designButton = document.querySelector('.design-button');
    const designModal = document.querySelector('.design-modal');
    const closeButton = designModal.querySelector('.close-button');

    // Modal event listeners
    designButton.addEventListener('click', () => designModal.showModal());
    closeButton.addEventListener('click', () => designModal.close());
    designModal.addEventListener('click', (e) => {
        if (e.target === designModal) designModal.close();
    });
});

