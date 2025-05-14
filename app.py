from flask import Flask, render_template, request, jsonify, flash, redirect, url_for, session
from firebase_admin import credentials, initialize_app, firestore, auth
import os
from dotenv import load_dotenv
from functools import wraps
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'dev-secret-key')

# Initialize Firebase
cred = credentials.Certificate('firebase-key.json')
initialize_app(cred)
db = firestore.client()

# Login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/studio')
@login_required
def studio():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if 'id_token' in request.form:
            try:
                # Verify Firebase ID token
                token = request.form.get('id_token')
                decoded_token = auth.verify_id_token(token)
                user_id = decoded_token['uid']
                
                # Get user data
                user = auth.get_user(user_id)
                
                # Store user data
                user_data = {
                    'name': user.display_name,
                    'email': user.email,
                    'photo_url': user.photo_url,
                    'last_login': firestore.SERVER_TIMESTAMP
                }
                db.collection('users').document(user_id).set(user_data, merge=True)
                
                session['user_id'] = user_id
                flash('Successfully logged in!', 'success')
                return redirect(url_for('studio'))
            except Exception as e:
                flash(f'Authentication failed: {str(e)}', 'danger')
                return redirect(url_for('login'))
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        try:
            user = auth.create_user(
                email=email,
                password=password,
                display_name=name
            )
            # Store user data in Firestore
            user_data = {
                'name': name,
                'email': email,
                'created_at': firestore.SERVER_TIMESTAMP
            }
            db.collection('users').document(user.uid).set(user_data)
            flash('Account created successfully! Please log in.', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            flash(f'Error creating account: {str(e)}', 'danger')
    return render_template('register.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('home'))

@app.route('/save-project', methods=['POST'])
def save_project():
    try:
        data = request.get_json()
        project_ref = db.collection('projects').document()
        project_ref.set(data)
        return jsonify({'success': True, 'id': project_ref.id})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)