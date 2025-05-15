# Pixel-Muse

Pixel-Muse is a powerful web-based drawing application that combines the flexibility of Flask with the robust backend capabilities of Firebase. This application provides artists and designers with a comprehensive canvas-based interface featuring multiple drawing tools and advanced layer management.

## 🎨 Features

- **Interactive Canvas Drawing**
  - Smooth brush strokes with pressure sensitivity
  - Real-time drawing preview
  - Responsive canvas that adapts to window size

- **Professional Drawing Tools**
  - Brush tool with customizable settings
  - Precision eraser with adjustable size
  - Text tool with font customization
  - Shape tools (rectangle, circle, line)
  - Color picker with RGB/HEX support

- **Advanced Features**
  - Multiple layer support for complex compositions
  - Layer opacity and visibility controls
  - Project saving and loading functionality
  - Undo/Redo functionality
  - Export options for your artwork

## 🚀 Getting Started

### Prerequisites
- Python 3.7 or higher
- Git
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Firebase account (free tier available)

### Installation

1. **Clone the Repository**
   ```bash
   # Clone the repository to your local machine
   git clone https://github.com/yourusername/ArtBoard-Studio.git
   
   # Navigate to the project directory
   cd ArtBoard-Studio
   ```

2. **Set Up Virtual Environment**
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   # Install all required Python packages
   pip install -r requirements.txt
   ```

4. **Firebase Configuration**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project (or use existing)
   - Navigate to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the downloaded JSON file as `firebase-key.json` in the project root
   - Enable Firebase Authentication and Firestore in your project

## 💻 Running the Application

1. **Start the Server**
   ```bash
   # Ensure you're in the project directory and virtual environment is activated
   python app.py
   ```

2. **Access the Application**
   - Open your web browser
   - Navigate to `http://localhost:5000`
   - The application should now be running

## 🔄 Development Workflow

### Updating Your Local Repository
```bash
# Fetch and merge changes from the remote repository
git pull origin main
```

### Making Changes
```bash
# Stage all changes
git add .

# Commit your changes with a descriptive message
git commit -m "Description of your changes"

# Push changes to the remote repository
git push origin main
```

## 📁 Project Structure

```
Pixel-Muse/
├── app.py                 # Main Flask application and routes
├── requirements.txt       # Python package dependencies
├── .env                  # Environment variables
├── .gitignore           # Git ignore file
├── firebase-key.json    # Firebase service account credentials
├── static/
│   ├── css/
│   │   └── style.css    # Application styles and themes
│   └── js/
│       ├── canvas.js    # Canvas drawing functionality
│       └── firebase-config.js  # Firebase configuration
└── templates/
    └── index.html       # Main application interface
```

## 🛠️ Technologies Used

- **Backend**
  - Flask (Python web framework)
  - Firebase (Authentication and data storage)
  - Python 3.7+

- **Frontend**
  - HTML5 Canvas
  - Bootstrap 5 (UI framework)
  - JavaScript (ES6+)
  - Modern CSS3

## 🔧 Troubleshooting

### Common Issues and Solutions

1. **Dependencies Issues**
   - Ensure all packages are installed: `pip install -r requirements.txt`
   - Check Python version: `python --version`
   - Verify virtual environment is activated

2. **Firebase Configuration**
   - Verify `firebase-key.json` is in the correct location
   - Check Firebase project settings
   - Ensure Firebase services are enabled

3. **Application Not Starting**
   - Check if port 5000 is available
   - Verify all environment variables are set
   - Check application logs for errors

4. **Drawing Issues**
   - Clear browser cache
   - Update to latest browser version
   - Check browser console for errors

5. **Firebase Configuration Issues**
   - Verify `firebase-config.js` is properly loaded in your HTML
   - Check if Firebase services are properly initialized
   - Ensure all Firebase configuration values are correct
   - Verify Firebase service account has proper permissions
   - Check browser console for Firebase-related errors

6. **Authentication Issues**
   - Clear browser cache and cookies
   - Verify email/password authentication is enabled
   - Check if user is properly signed in
   - Verify Firebase Authentication rules

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support, please:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue if needed