class ArtBoard {
    constructor() {
        this.canvas = document.getElementById('artboard');
        this.ctx = this.canvas.getContext('2d');
        
        // Load saved state or use defaults
        const savedState = JSON.parse(localStorage.getItem('artboardState')) || {};
        this.currentTool = savedState.currentTool || 'brush';
        this.isDrawing = false;
        this.color = savedState.color || '#000000';
        this.brushSize = savedState.brushSize || 5;
        this.layers = [];
        this.currentLayer = 0;
        
        // Shape properties
        this.startX = 0;
        this.startY = 0;
        this.isDrawingShape = false;

        this.initializeCanvas();
        this.setupEventListeners();
        this.loadSavedCanvas();
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
                this.saveToLocalStorage();
            });
        });

        // Color picker
        document.getElementById('colorPicker').addEventListener('change', (e) => {
            this.color = e.target.value;
            this.saveToLocalStorage();
        });

        // Brush size
        document.getElementById('brushSize').addEventListener('input', (e) => {
            this.brushSize = parseInt(e.target.value);
            this.saveToLocalStorage();
        });

        // Drawing events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

        // Canvas controls
        document.getElementById('clearBtn').addEventListener('click', () => this.clearCanvas());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveProject());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportAsPNG());

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
        
        // For shape tools, store the starting position
        if (['rectangle', 'circle', 'line'].includes(this.currentTool)) {
            this.startX = this.lastX;
            this.startY = this.lastY;
        }
    }

    draw(e) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        switch(this.currentTool) {
            case 'brush':
            case 'eraser':
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(x, y);
                this.ctx.strokeStyle = this.currentTool === 'brush' ? this.color : '#ffffff';
                this.ctx.lineWidth = this.brushSize;
                this.ctx.lineCap = 'round';
                this.ctx.stroke();
                this.lastX = x;
                this.lastY = y;
                
                // Update layer data for continuous tools
                this.layers[this.currentLayer].data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                break;

            case 'rectangle':
            case 'circle':
            case 'line':
                // Restore the original state before drawing the preview
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.putImageData(this.layers[this.currentLayer].data, 0, 0);

                // Draw current shape preview
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.color;
                this.ctx.lineWidth = this.brushSize;

                if (this.currentTool === 'rectangle') {
                    const width = x - this.startX;
                    const height = y - this.startY;
                    this.ctx.rect(this.startX, this.startY, width, height);
                } else if (this.currentTool === 'circle') {
                    const radius = Math.sqrt(Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2));
                    this.ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
                } else if (this.currentTool === 'line') {
                    this.ctx.moveTo(this.startX, this.startY);
                    this.ctx.lineTo(x, y);
                }

                this.ctx.stroke();
                break;
        }
        
        // Save canvas state after each draw
        this.saveToLocalStorage();
    }

    stopDrawing() {
        if (!this.isDrawing) return;
        this.isDrawing = false;

        // When finishing a shape, save the final state to the current layer
        if (['rectangle', 'circle', 'line'].includes(this.currentTool)) {
            const finalState = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.layers[this.currentLayer].data = finalState;
            // Ensure the shape is properly rendered
            this.ctx.putImageData(finalState, 0, 0);
        }
    }

    clearCanvas() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Clear all layers
        this.layers = [];
        this.addLayer();
        
        // Clear the saved state in local storage
        localStorage.removeItem('artboardState');
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

    saveToLocalStorage() {
        const state = {
            currentTool: this.currentTool,
            color: this.color,
            brushSize: this.brushSize,
            canvasData: this.canvas.toDataURL()
        };
        localStorage.setItem('artboardState', JSON.stringify(state));
    }

    exportAsPNG() {
        // Create a temporary canvas with white background
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');

        // Fill with white background
        tempCtx.fillStyle = '#ffffff';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw the original canvas content on top
        tempCtx.drawImage(this.canvas, 0, 0);

        // Create a temporary link element
        const link = document.createElement('a');
        link.download = 'artboard-drawing.png';
        link.href = tempCanvas.toDataURL('image/png');
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    loadSavedCanvas() {
        const savedState = JSON.parse(localStorage.getItem('artboardState'));
        if (savedState && savedState.canvasData) {
            const img = new Image();
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0);
            };
            img.src = savedState.canvasData;

            // Restore tool settings
            if (savedState.currentTool) {
                document.querySelector(`[data-tool="${savedState.currentTool}"]`)?.classList.add('active');
            }
            if (savedState.color) {
                document.getElementById('colorPicker').value = savedState.color;
            }
            if (savedState.brushSize) {
                document.getElementById('brushSize').value = savedState.brushSize;
            }
        }
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