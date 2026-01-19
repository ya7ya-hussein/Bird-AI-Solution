# 🐦 Bird AI Solution

An AI-powered web application for real-time bird detection and species identification, designed for aviation hangar safety management.

## Overview

Bird AI Solution uses computer vision to monitor video footage from hangars, detecting and tracking birds in real-time. The system identifies **200+ bird species** and provides actionable insights to help maintain safe hangar operations.

## Features

- **Real-time Detection** — Live video processing with YOLO object detection
- **Species Identification** — Recognizes 200 different bird species
- **Bird Tracking** — Counts unique birds across video frames using IoU tracking
- **Live Streaming** — Watch detection results as the video processes
- **User Authentication** — Secure signup/login system
- **Results Dashboard** — Summary of detected species and recommendations

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, React Router, Axios, Tailwind CSS |
| **Backend** | Flask, SQLAlchemy, OpenCV |
| **AI/ML** | Ultralytics YOLO |
| **Database** | SQLite |

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- YOLO model file (`best.pt`)

### Backend Setup

```bash
cd backend
pip install flask flask-cors flask-sqlalchemy ultralytics opencv-python
python app.py
```

### Frontend Setup

```bash
cd my-app
npm install
npm start
```

The app will be available at `http://localhost:3000`

## Usage

1. **Sign up** for an account
2. **Log in** to access the upload page
3. **Enter hangar details** (name, size, operation type)
4. **Upload a video** of your hangar
5. **Watch real-time detection** as birds are identified
6. **View results** with species breakdown and recommendations

## Author
**Yahya Hussein**

**LinkedIn:** https://www.linkedin.com/in/ya7ya-hussein
**GitHub:** https://github.com/ya7ya-hussein
**Email:** ya7ya-hussein@outlook.com
