# Smart City Dashboard

A full-stack IoT analytics platform  with LLM-powered natural language queries, automated alerting, and real-time dashboards. Built with Django and React. The system provides real-time environmental monitoring with a focus on water level tracking stations, and also includes weather stations and soil moisture monitoring.


<img src="https://github.com/user-attachments/assets/938b183e-761e-4963-b47b-e984fb098c85" 
     alt="Dashboard Preview" 
     width="500"
     style="border: 1px solid #d3d3d3; border-radius: 6px; padding: 4px;" />


## Features

- Real-time monitoring of LoRaWAN and NB-IoT sensors 
- Interactive dashboards
- AI-powered chatbot for data analytics and insights (OpenAI API)
- Automated alerting system
- Full-stack architecture: Django + React
- Containerized environment for fast, reliable setup

## Installation and Setup

This project is fully containerized using Docker, making setup fast and reliable.

### Prerequisites

You must have **Docker** and **Docker Compose** installed on your system.

### 1. Clone the Repository

Clone the project to your local machine:

```bash
git clone https://github.com/Kargo59/dashboard_smartcity.git
cd dashboard_smartcity
```

### 2. Running the Application

Use Docker Compose to build and start both the frontend and backend services simultaneously:

```bash
docker compose up --build
```

### 3. Access the Dashboard

This single command will:
- Build the necessary Docker images for the frontend and backend
- Start the containers (including databases or services)
- Automatically prepare everything for local development

Once running:
- **Frontend (User Interface)**: http://localhost:3000
- **Backend API**: http://localhost:8000

The Smart City Dashboard is now fully functional and ready to use!

### Cleanup (Optional)

To stop and remove the running containers and networks when you're finished:

```bash
docker compose down
```

## License

Distributed under the MIT License. 
