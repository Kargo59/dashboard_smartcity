# Sensor Dashboard – Docker Setup

## Requirements
- Docker
- Docker Compose

## Running the Application
After cloning or copying this repo to a local folder, simply run:

```bash
docker compose up --build
```
This will start both backend and frontend:

Backend: http://localhost:8000/

Frontend: http://localhost:3000/

✅ With this setup, a fully functional water level dashboard is provided and ready to use. The containers will automatically create the necessary databases and prepare everything for local development.

🌆 Smart City Dashboard

A full-stack IoT data visualization platform built with Django, React, and MySQL, containerized with Docker Compose.
The system provides real-time insights into urban water levels and sensor analytics across multiple monitoring stations.


(Replace with a real screenshot or GIF from your project.)

📑 Table of Contents

Features

Technologies Used

Installation and Setup

Usage

Testing

Contributing

License

Contact

✨ Features

🌊 Real-time water level monitoring from multiple locations

📊 Interactive dashboard with charts and statistics

⚙️ Full-stack architecture: Django REST API + React frontend

🐳 Containerized environment for fast, reliable setup

🧩 Easily extendable to include new sensor types and datasets

🧱 Technologies Used
Category	Technology	Purpose
Frontend	React, Axios, Recharts, TailwindCSS	Building the user interface
Backend	Django, Django REST Framework	REST API and data handling
Database	MySQL	Persistent data storage
Containerization	Docker, Docker Compose	Unified development environment
Version Control	Git, GitHub	Source code management
⚙️ Installation and Setup

This project is fully containerized using Docker, making setup fast and reliable.

🔧 Prerequisites

You must have Docker and Docker Compose installed on your system.

1️⃣ Clone the Repository

Clone the project to your local machine:

git clone https://github.com/Kargo59/dashboard_smartcity.git
cd dashboard_smartcity

2️⃣ Running the Application

Use Docker Compose to build and start both the frontend and backend services simultaneously:

docker compose up --build

3️⃣ Access the Dashboard

This single command will:

Build the necessary Docker images for the frontend and backend

Start the containers (including databases or services)

Automatically prepare everything for local development

Once running:

🖥️ Frontend (User Interface): http://localhost:3000

⚙️ Backend API: http://localhost:8000

✅ The Smart City Dashboard is now fully functional and ready to use!

🧹 Cleanup (Optional)

To stop and remove the running containers and networks when you’re finished:

docker compose down

🧩 Usage

Access the application in your browser or via API routes:

Web app → http://localhost:3000

API endpoints → http://localhost:8000/api/

Example Output / Interface:

> Request: /api/water-level/kusel
> Response: { "location": "Kusel", "level": 2.31, "unit": "m", "timestamp": "2025-10-14T12:00:00Z" }

🧪 Testing (Optional)

If you’ve written tests, explain how to run them.

# Example for a Python project using unittest
python -m unittest discover

🤝 Contributing

Contributions are welcome!
To contribute, please follow these steps:

Fork the project

Create your Feature Branch

git checkout -b feature/NewFeature


Commit your Changes

git commit -m 'Add new feature'


Push to the Branch

git push origin feature/NewFeature


Open a Pull Request

📜 License

Distributed under the MIT License.
See the LICENSE file for more information.

📬 Contact

Kamil P.
💼 Full-Stack Data Engineer | IoT & Smart Infrastructure Analytics
🔗 GitHub
 • LinkedIn

Project Link: https://github.com/Kargo59/dashboard_smartcity

⭐ If you found this project helpful or interesting, please consider giving it a star!
