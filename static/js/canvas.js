class ArtBoard {
    constructor() {
        this.canvas = document.getElementById('artboard');
        this.ctx = this.canvas.getContext('2d');
        this.currentTool = 'brush';
        this.isDrawing = false;
        this.color = '#000000';
        this.brushSize = 5;
        this.layers = [];
        this.currentLayer = 0;

        this.initializeCanvas();
        this.setupEventListeners();
    }

    initializeCanvas() {
        // Set canvas size to match container
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;

        // Create initial layer
        this.addLayer();
    }

    setupEventListeners() {
        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentTool = e.target.dataset.tool;
            });
        });

        // Color picker
        document.getElementById('colorPicker').addEventListener('change', (e) => {
            this.color = e.target.value;
        });

        // Brush size
        document.getElementById('brushSize').addEventListener('input', (e) => {
            this.brushSize = parseInt(e.target.value);
        });

        // Drawing events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

        // Canvas controls
        document.getElementById('clearBtn').addEventListener('click', () => this.clearCanvas());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveProject());

        // Handle window resize
        window.addEventListener('resize', () => {
            this.canvas.width = this.canvas.parentElement.clientWidth;
            this.canvas.height = this.canvas.parentElement.clientHeight;
            this.redrawLayers();
        });
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;
    }

    draw(e) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(x, y);
        this.ctx.strokeStyle = this.currentTool === 'eraser' ? '#ffffff' : this.color;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();

        this.lastX = x;
        this.lastY = y;
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    addLayer() {
        const layer = {
            id: this.layers.length,
            data: new ImageData(this.canvas.width, this.canvas.height)
        };
        this.layers.push(layer);
        this.currentLayer = layer.id;
    }

    redrawLayers() {
        this.clearCanvas();
        this.layers.forEach(layer => {
            this.ctx.putImageData(layer.data, 0, 0);
        });
    }

    async saveProject() {
        try {
            const projectData = {
                name: 'Untitled Project',
                timestamp: new Date().toISOString(),
                canvasData: this.canvas.toDataURL(),
                layers: this.layers
            };

            const response = await fetch('/save-project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectData)
            });

            const result = await response.json();
            if (result.success) {
                alert('Project saved successfully!');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Failed to save project. Please try again.');
        }
    }
}

// Initialize ArtBoard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ArtBoard();
});