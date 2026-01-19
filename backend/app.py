from flask import Flask, request, jsonify, session, Response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import cv2
import numpy as np
from ultralytics import YOLO
import os
import json
import time
import threading
from queue import Queue
import base64
from collections import defaultdict

# Initialize SQLAlchemy without an app
db = SQLAlchemy()

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

def get_bird_species_names():
    """
    Bird species names from your trained YOLO model (200 species)
    """
    bird_species = {
        0: 'Acadian Flycatcher', 1: 'American Crow', 2: 'American Goldfinch', 3: 'American Pipit', 
        4: 'American Redstart', 5: 'American Three Toed Woodpecker', 6: 'Anna Hummingbird', 7: 'Artic Tern', 
        8: 'Baird Sparrow', 9: 'Baltimore Oriole', 10: 'Bank Swallow', 11: 'Barn Swallow', 
        12: 'Bay Breasted Warbler', 13: 'Belted Kingfisher', 14: 'Bewick Wren', 15: 'Black And White Warbler', 
        16: 'Black Billed Cuckoo', 17: 'Black Capped Vireo', 18: 'Black Footed Albatross', 19: 'Black Tern', 
        20: 'Black Throated Blue Warbler', 21: 'Black Throated Sparrow', 22: 'Blue Grosbeak', 23: 'Blue Headed Vireo', 
        24: 'Blue Jay', 25: 'Blue Winged Warbler', 26: 'Boat Tailed Grackle', 27: 'Bobolink', 
        28: 'Bohemian Waxwing', 29: 'Brandt Cormorant', 30: 'Brewer Blackbird', 31: 'Brewer Sparrow', 
        32: 'Bronzed Cowbird', 33: 'Brown Creeper', 34: 'Brown Pelican', 35: 'Brown Thrasher', 
        36: 'Cactus Wren', 37: 'California Gull', 38: 'Canada Warbler', 39: 'Cape Glossy Starling', 
        40: 'Cape May Warbler', 41: 'Cardinal', 42: 'Carolina Wren', 43: 'Caspian Tern', 
        44: 'Cedar Waxwing', 45: 'Cerulean Warbler', 46: 'Chestnut Sided Warbler', 47: 'Chipping Sparrow', 
        48: 'Chuck Will Widow', 49: 'Clark Nutcracker', 50: 'Clay Colored Sparrow', 51: 'Cliff Swallow', 
        52: 'Common Raven', 53: 'Common Tern', 54: 'Common Yellowthroat', 55: 'Crested Auklet', 
        56: 'Dark Eyed Junco', 57: 'Downy Woodpecker', 58: 'Eared Grebe', 59: 'Eastern Towhee', 
        60: 'Elegant Tern', 61: 'European Goldfinch', 62: 'Evening Grosbeak', 63: 'Field Sparrow', 
        64: 'Fish Crow', 65: 'Florida Jay', 66: 'Forsters Tern', 67: 'Fox Sparrow', 
        68: 'Frigatebird', 69: 'Gadwall', 70: 'Geococcyx', 71: 'Glaucous Winged Gull', 
        72: 'Golden Winged Warbler', 73: 'Grasshopper Sparrow', 74: 'Gray Catbird', 75: 'Gray Crowned Rosy Finch', 
        76: 'Gray Kingbird', 77: 'Great Crested Flycatcher', 78: 'Great Grey Shrike', 79: 'Green Jay', 
        80: 'Green Kingfisher', 81: 'Green Tailed Towhee', 82: 'Green Violetear', 83: 'Groove Billed Ani', 
        84: 'Harris Sparrow', 85: 'Heermann Gull', 86: 'Henslow Sparrow', 87: 'Herring Gull', 
        88: 'Hooded Merganser', 89: 'Hooded Oriole', 90: 'Hooded Warbler', 91: 'Horned Grebe', 
        92: 'Horned Lark', 93: 'Horned Puffin', 94: 'House Sparrow', 95: 'House Wren', 
        96: 'Indigo Bunting', 97: 'Ivory Gull', 98: 'Kentucky Warbler', 99: 'Laysan Albatross', 
        100: 'Lazuli Bunting', 101: 'Le Conte Sparrow', 102: 'Least Auklet', 103: 'Least Flycatcher', 
        104: 'Least Tern', 105: 'Lincoln Sparrow', 106: 'Loggerhead Shrike', 107: 'Long Tailed Jaeger', 
        108: 'Louisiana Waterthrush', 109: 'Magnolia Warbler', 110: 'Mallard', 111: 'Mangrove Cuckoo', 
        112: 'Marsh Wren', 113: 'Mockingbird', 114: 'Mourning Warbler', 115: 'Myrtle Warbler', 
        116: 'Nashville Warbler', 117: 'Nelson Sharp Tailed Sparrow', 118: 'Nighthawk', 119: 'Northern Flicker', 
        120: 'Northern Fulmar', 121: 'Northern Waterthrush', 122: 'Olive Sided Flycatcher', 123: 'Orange Crowned Warbler', 
        124: 'Orchard Oriole', 125: 'Ovenbird', 126: 'Pacific Loon', 127: 'Painted Bunting', 
        128: 'Palm Warbler', 129: 'Parakeet Auklet', 130: 'Pelagic Cormorant', 131: 'Philadelphia Vireo', 
        132: 'Pied Billed Grebe', 133: 'Pied Kingfisher', 134: 'Pigeon Guillemot', 135: 'Pileated Woodpecker', 
        136: 'Pine Grosbeak', 137: 'Pine Warbler', 138: 'Pomarine Jaeger', 139: 'Prairie Warbler', 
        140: 'Prothonotary Warbler', 141: 'Purple Finch', 142: 'Red Bellied Woodpecker', 143: 'Red Breasted Merganser', 
        144: 'Red Cockaded Woodpecker', 145: 'Red Eyed Vireo', 146: 'Red Faced Cormorant', 147: 'Red Headed Woodpecker', 
        148: 'Red Legged Kittiwake', 149: 'Red Winged Blackbird', 150: 'Rhinoceros Auklet', 151: 'Ring Billed Gull', 
        152: 'Ringed Kingfisher', 153: 'Rock Wren', 154: 'Rose Breasted Grosbeak', 155: 'Ruby Throated Hummingbird', 
        156: 'Rufous Hummingbird', 157: 'Rusty Blackbird', 158: 'Sage Thrasher', 159: 'Savannah Sparrow', 
        160: 'Sayornis', 161: 'Scarlet Tanager', 162: 'Scissor Tailed Flycatcher', 163: 'Scott Oriole', 
        164: 'Seaside Sparrow', 165: 'Shiny Cowbird', 166: 'Slaty Backed Gull', 167: 'Song Sparrow', 
        168: 'Sooty Albatross', 169: 'Spotted Catbird', 170: 'Summer Tanager', 171: 'Swainson Warbler', 
        172: 'Tennessee Warbler', 173: 'Tree Sparrow', 174: 'Tree Swallow', 175: 'Tropical Kingbird', 
        176: 'Vermilion Flycatcher', 177: 'Vesper Sparrow', 178: 'Warbling Vireo', 179: 'Western Grebe', 
        180: 'Western Gull', 181: 'Western Meadowlark', 182: 'Western Wood Pewee', 183: 'Whip Poor Will', 
        184: 'White Breasted Kingfisher', 185: 'White Breasted Nuthatch', 186: 'White Crowned Sparrow', 187: 'White Eyed Vireo', 
        188: 'White Necked Raven', 189: 'White Pelican', 190: 'White Throated Sparrow', 191: 'Wilson Warbler', 
        192: 'Winter Wren', 193: 'Worm Eating Warbler', 194: 'Yellow Bellied Flycatcher', 195: 'Yellow Billed Cuckoo', 
        196: 'Yellow Breasted Chat', 197: 'Yellow Headed Blackbird', 198: 'Yellow Throated Vireo', 199: 'Yellow Warbler'
    }
    return bird_species


# Bird Tracker Class
class BirdTracker:
    def __init__(self, max_lost_frames=30, min_iou=0.3):
        self.tracks = {}  # Dictionary to store active tracks
        self.next_track_id = 1
        self.max_lost_frames = max_lost_frames  # Remove track after this many frames without detection
        self.min_iou = min_iou  # Minimum IoU to consider a match
        self.total_unique_birds = 0
        self.species_count = defaultdict(int)  # Count unique birds per species
        
    def calculate_iou(self, box1, box2):
        """Calculate Intersection over Union between two bounding boxes"""
        x1_min, y1_min, x1_max, y1_max = box1
        x2_min, y2_min, x2_max, y2_max = box2
        
        # Calculate intersection area
        intersect_xmin = max(x1_min, x2_min)
        intersect_ymin = max(y1_min, y2_min)
        intersect_xmax = min(x1_max, x2_max)
        intersect_ymax = min(y1_max, y2_max)
        
        if intersect_xmax < intersect_xmin or intersect_ymax < intersect_ymin:
            return 0.0
        
        intersect_area = (intersect_xmax - intersect_xmin) * (intersect_ymax - intersect_ymin)
        
        # Calculate union area
        box1_area = (x1_max - x1_min) * (y1_max - y1_min)
        box2_area = (x2_max - x2_min) * (y2_max - y2_min)
        union_area = box1_area + box2_area - intersect_area
        
        return intersect_area / union_area if union_area > 0 else 0.0
    
    def update_tracks(self, detections):
        """Update tracks with new detections"""
        # Mark all tracks as not updated
        for track_id in self.tracks:
            self.tracks[track_id]['updated'] = False
        
        # Match detections to existing tracks
        matched_detections = set()
        
        for detection in detections:
            best_match_id = None
            best_iou = self.min_iou
            
            # Find best matching track
            for track_id, track in self.tracks.items():
                if track['updated']:  # Skip already updated tracks
                    continue
                    
                iou = self.calculate_iou(detection['bbox'], track['bbox'])
                if iou > best_iou:
                    best_iou = iou
                    best_match_id = track_id
            
            if best_match_id is not None:
                # Update existing track
                self.tracks[best_match_id]['bbox'] = detection['bbox']
                self.tracks[best_match_id]['confidence'] = detection['confidence']
                self.tracks[best_match_id]['lost_frames'] = 0
                self.tracks[best_match_id]['updated'] = True
                self.tracks[best_match_id]['last_seen_frame'] = detection['frame']
                matched_detections.add(detections.index(detection))
            
        # Create new tracks for unmatched detections
        for i, detection in enumerate(detections):
            if i not in matched_detections and detection['confidence'] >= 0.5:  # Only create tracks for confident detections
                self.tracks[self.next_track_id] = {
                    'id': self.next_track_id,
                    'bbox': detection['bbox'],
                    'confidence': detection['confidence'],
                    'species_name': detection['species_name'],
                    'class_id': detection['class_id'],
                    'first_seen_frame': detection['frame'],
                    'last_seen_frame': detection['frame'],
                    'lost_frames': 0,
                    'updated': True
                }
                
                # Increment unique bird count
                self.total_unique_birds += 1
                self.species_count[detection['species_name']] += 1
                
                self.next_track_id += 1
        
        # Update lost frames for tracks not matched
        tracks_to_remove = []
        for track_id, track in self.tracks.items():
            if not track['updated']:
                track['lost_frames'] += 1
                if track['lost_frames'] > self.max_lost_frames:
                    tracks_to_remove.append(track_id)
        
        # Remove lost tracks
        for track_id in tracks_to_remove:
            del self.tracks[track_id]
        
        return len(self.tracks)  # Return number of active tracks

# Global variables for video processing
video_sessions = {}

class VideoProcessor:
    def __init__(self, video_path, model_path, session_id):
        self.video_path = video_path
        self.model_path = model_path
        self.session_id = session_id
        self.cap = None
        self.model = None
        self.bird_species = get_bird_species_names()  # Will be populated by get_bird_species_names()
        self.bird_tracker = BirdTracker(max_lost_frames=30, min_iou=0.3)
        self.detection_results = {
            'totalBirds': 0,
            'birdTypes': {},
            'detections': [],
            'processed_frames': 0,
            'total_frames': 0,
            'progress': 0,
            'completed': False,
            'unique_birds_count': 0,
            'active_tracks': 0
        }
        self.current_frame_data = None
        self.is_processing = False
        self.latest_frame_info = {
            'frame_number': 0,
            'detections': 0,
            'progress': 0,
            'frame_base64': None,
            'active_tracks': 0,
            'unique_birds': 0
        }
        
    def initialize(self):
        """Initialize video capture and YOLO model"""
        try:
            print(f"Loading YOLO model from {self.model_path}...")
            self.model = YOLO(self.model_path)
            self.model.fuse()  # Optimize model for speed
            
            print(f"Opening video {self.video_path}...")
            self.cap = cv2.VideoCapture(self.video_path)
            
            if not self.cap.isOpened():
                raise Exception(f"Could not open video {self.video_path}")
            
            # Get video properties
            self.detection_results['total_frames'] = int(self.cap.get(cv2.CAP_PROP_FRAME_COUNT))
            fps = int(self.cap.get(cv2.CAP_PROP_FPS))
            width = int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            
            print(f"Video initialized: {width}x{height}, {fps} FPS, {self.detection_results['total_frames']} frames")
            return True
            
        except Exception as e:
            print(f"Error initializing video processor: {e}")
            return False
    
    def process_video_turbo(self):
        """Process video in turbo mode with bird tracking"""
        if not self.initialize():
            return
        
        self.is_processing = True
        confidence_threshold = 0.3  # Turbo mode confidence
        skip_frames = 4  # Skip 4 frames for turbo mode
        frame_count = 0
        processed_count = 0
        current_detections = []
        
        print("🚀 Starting TURBO MODE processing with TRACKING...")
        
        try:
            while self.is_processing:
                ret, frame = self.cap.read()
                if not ret:
                    print("End of video reached!")
                    break
                
                frame_count += 1
                
                # Process frame or use cached detections
                if frame_count % (skip_frames + 1) == 0:
                    # Process this frame
                    results = self.model(frame, conf=confidence_threshold, verbose=False, imgsz=640)
                    processed_count += 1
                    
                    # Clear previous detections
                    current_detections = []
                    
                    # Process detections
                    for result in results:
                        boxes = result.boxes
                        if boxes is not None:
                            for box in boxes:
                                # Get bounding box coordinates
                                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
                                confidence = box.conf[0].cpu().numpy()
                                class_id = int(box.cls[0].cpu().numpy())
                                
                                species_name = self.bird_species.get(class_id, f"Bird_Class_{class_id}")
                                
                                # Add to current detections for tracking
                                current_detections.append({
                                    'bbox': [x1, y1, x2, y2],
                                    'confidence': float(confidence),
                                    'class_id': class_id,
                                    'species_name': species_name,
                                    'frame': frame_count
                                })
                    
                    # Update tracker with new detections
                    active_tracks = self.bird_tracker.update_tracks(current_detections)
                    
                    # Update detection results with unique bird counts
                    self.detection_results['unique_birds_count'] = self.bird_tracker.total_unique_birds
                    self.detection_results['active_tracks'] = active_tracks
                    
                    # Update bird types with unique counts
                    self.detection_results['birdTypes'] = dict(self.bird_tracker.species_count)
                    
                    print(f"Frame {frame_count}: {len(current_detections)} detections, "
                          f"{active_tracks} active tracks, "
                          f"{self.bird_tracker.total_unique_birds} unique birds total")
                
                # Draw tracking information on frame
                annotated_frame = self.draw_tracking_info(frame, frame_count, processed_count)
                
                # Convert frame to base64 for streaming (every 10th frame to reduce bandwidth)
                if frame_count % 10 == 0:  # Stream every 10th frame
                    # Resize frame for streaming (reduce bandwidth)
                    stream_frame = cv2.resize(annotated_frame, (640, 360))
                    _, buffer = cv2.imencode('.jpg', stream_frame, [cv2.IMWRITE_JPEG_QUALITY, 70])
                    frame_base64 = base64.b64encode(buffer).decode('utf-8')
                    
                    # Update latest frame info
                    self.latest_frame_info = {
                        'frame_number': frame_count,
                        'detections': self.bird_tracker.total_unique_birds,
                        'progress': (frame_count / self.detection_results['total_frames']) * 100,
                        'frame_base64': frame_base64,
                        'total_species': len(self.detection_results['birdTypes']),
                        'active_tracks': self.detection_results['active_tracks']
                    }
                
                # Update progress
                self.detection_results['processed_frames'] = frame_count
                self.detection_results['progress'] = (frame_count / self.detection_results['total_frames']) * 100
                
                # Print progress every 100 frames
                if frame_count % 100 == 0:
                    print(f"Progress: {self.detection_results['progress']:.1f}% ({frame_count}/{self.detection_results['total_frames']})")
                    print(f"Unique birds so far: {self.bird_tracker.total_unique_birds}")
                
                # Small delay to prevent overwhelming the system
                time.sleep(0.01)
        
        except Exception as e:
            print(f"Error during video processing: {e}")
        
        finally:
            # Finalize results
            self.detection_results['totalBirds'] = self.bird_tracker.total_unique_birds
            self.detection_results['completed'] = True
            self.is_processing = False
            
            if self.cap:
                self.cap.release()
            
            print(f"Processing complete! Total unique birds detected: {self.detection_results['totalBirds']}")
            print(f"Bird species found: {list(self.detection_results['birdTypes'].keys())}")
    
    def draw_tracking_info(self, frame, frame_count, processed_count):
        """Draw tracking information on frame"""
        # Draw bounding boxes for active tracks
        for track_id, track in self.bird_tracker.tracks.items():
            if track['lost_frames'] == 0:  # Only draw recently seen tracks
                x1, y1, x2, y2 = track['bbox']
                species_name = track['species_name']
                confidence = track['confidence']
                
                # Use green color for tracked birds
                color = (0, 255, 0)
                
                # Draw bounding box
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                
                # Prepare label with track ID
                label = f"ID:{track_id} {species_name}: {confidence:.2f}"
                
                # Calculate label background size
                (label_width, label_height), baseline = cv2.getTextSize(
                    label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2)
                
                # Draw label background
                cv2.rectangle(frame, 
                            (x1, y1 - label_height - baseline - 5), 
                            (x1 + label_width, y1), 
                            color, -1)
                
                # Draw label text
                cv2.putText(frame, label, (x1, y1 - baseline - 5), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 2)
        
        # Add info overlay
        info_text = [
            f"🚀 TURBO MODE with TRACKING",
            f"Frame: {frame_count}/{self.detection_results['total_frames']}",
            f"Progress: {self.detection_results['progress']:.1f}%",
            f"Active Tracks: {self.detection_results['active_tracks']}",
            f"Unique Birds Detected: {self.bird_tracker.total_unique_birds}",
            f"Total Species: {len(self.detection_results['birdTypes'])}",
            f"Tracking Parameters: IoU>{self.bird_tracker.min_iou}, Max Lost: {self.bird_tracker.max_lost_frames} frames"
        ]
        
        # Draw info background
        overlay_height = len(info_text) * 25 + 10
        cv2.rectangle(frame, (10, 10), (550, overlay_height), (0, 0, 0), -1)
        cv2.rectangle(frame, (10, 10), (550, overlay_height), (255, 255, 255), 2)
        
        # Draw info text
        for i, text in enumerate(info_text):
            cv2.putText(frame, text, (15, 35 + i * 25), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        
        return frame
    
    def get_latest_frame_info(self):
        """Get latest frame information"""
        return self.latest_frame_info
    
    def stop_processing(self):
        """Stop video processing"""
        self.is_processing = False

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'your-secret-key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    with app.app_context():
        print("Creating tables...")
        db.create_all()
        print("Tables created.")

    CORS(app, supports_credentials=True)
    
    # Signup Endpoint
    @app.route('/signup', methods=['POST'])
    def signup():
        try:
            data = request.get_json()
            if User.query.filter_by(email=data['email']).first():
                return jsonify({'message': 'Email already in use'}), 409

            hashed_password = generate_password_hash(data['password'])
            new_user = User(
                username=data['username'], email=data['email'], password_hash=hashed_password)
            db.session.add(new_user)
            db.session.commit()
            return jsonify({'message': 'Registered successfully'}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # Login Endpoint
    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        if user and check_password_hash(user.password_hash, data['password']):
            session['user_id'] = user.id
            return jsonify({'message': 'Login successful'}), 200
        return jsonify({'message': 'Invalid credentials'}), 401

    # Logout Endpoint
    @app.route('/logout')
    def logout():
        session.pop('user_id', None)
        return jsonify({'message': 'You have been logged out'}), 200

    # Set directories
    UPLOAD_FOLDER = 'uploads'
    MODEL_FOLDER = '.'  # Model is in the backend directory
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config['MODEL_FOLDER'] = MODEL_FOLDER

    # Ensure upload directory exists
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    # Path to your YOLO model
    MODEL_PATH = os.path.join(app.config['MODEL_FOLDER'], 'best.pt')

    @app.route('/upload', methods=['POST'])
    def upload_file():
        global video_sessions
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if file:
            filename = 'uploaded_video.mp4'
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

        try:
            # Create new session ID
            session_id = str(int(time.time()))
            
            # Initialize video processor
            processor = VideoProcessor(file_path, MODEL_PATH, session_id)
            video_sessions[session_id] = processor
            
            # Start processing in a separate thread
            processing_thread = threading.Thread(target=processor.process_video_turbo)
            processing_thread.daemon = True
            processing_thread.start()
            
            return jsonify({
                'message': 'Video processing started',
                'session_id': session_id,
                'streaming': True
            })
            
        except Exception as e:
            app.logger.error(f'Error: {e}')
            return jsonify({'error': 'An unexpected error occurred'}), 500

    @app.route('/get_frame/<session_id>')
    def get_frame(session_id):
        """Get latest frame data via polling"""
        if session_id not in video_sessions:
            return jsonify({'error': 'Session not found'}), 404
        
        processor = video_sessions[session_id]
        frame_info = processor.get_latest_frame_info()
        
        response_data = {
            'frame_number': frame_info['frame_number'],
            'detections': frame_info['detections'],
            'progress': frame_info['progress'],
            'frame_base64': frame_info['frame_base64'],
            'total_species': frame_info.get('total_species', 0),
            'active_tracks': frame_info.get('active_tracks', 0),
            'is_processing': processor.is_processing,
            'completed': processor.detection_results['completed']
        }
        
        return jsonify(response_data)

    @app.route('/get_results/<session_id>')
    def get_results(session_id):
        """Get final detection results"""
        if session_id not in video_sessions:
            return jsonify({'error': 'Session not found'}), 404
        
        processor = video_sessions[session_id]
        results = processor.detection_results
        
        # Format results for frontend
        response_data = {
            'totalBirds': results['totalBirds'],
            'birdTypes': list(results['birdTypes'].keys()),
            'noBirdsDetected': results['totalBirds'] == 0,
            'completed': results['completed'],
            'progress': results['progress'],
            'uniqueBirdsCount': results['unique_birds_count']
        }
        
        return jsonify(response_data)

    @app.route('/stop_processing/<session_id>', methods=['POST'])
    def stop_processing(session_id):
        """Stop video processing"""
        if session_id in video_sessions:
            video_sessions[session_id].stop_processing()
            return jsonify({'message': 'Processing stopped'})
        return jsonify({'error': 'Session not found'}), 404

    return app

if __name__ == '__main__':
    app = create_app()
    if app is not None:
        with app.app_context():
            db.create_all()
        app.run(debug=True, threaded=True)