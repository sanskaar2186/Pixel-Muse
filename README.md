# ArtBoard Studio

ArtBoard Studio is a web-based drawing application built with Flask and Firebase, featuring a canvas-based interface with multiple drawing tools and layer support.

## Features

- Interactive canvas drawing
- Multiple drawing tools (Brush, Eraser, Text, Shape)
- Color picker
- Adjustable brush size
- Layer support
- Project saving capability

## Setup Instructions

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Create a Firebase project and download the service account key:
   - Go to Firebase Console
   - Create a new project
   - Go to Project Settings > Service Accounts
   - Generate a new private key
   - Save the key as `firebase-key.json` in the project root

3. Run the application:
   ```bash
   python app.py
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Project Structure

```
.
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css     # Application styles
│   └── js/
│       └── canvas.js     # Canvas functionality
└── templates/
    └── index.html        # Main application template
```

## Technologies Used

- Flask (Python web framework)
- Firebase (Backend and data storage)
- HTML5 Canvas
- Bootstrap 5
- JavaScript (ES6+)