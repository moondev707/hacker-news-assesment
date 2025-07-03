# Hacker News Platform

This project is a full-stack Hacker News clone, featuring:
- **Backend:** ASP.NET Core Web API
- **Frontend:** Angular (served via Nginx)

## Running with Docker

You can run both the backend and frontend using Docker Compose.

### Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.
- [Docker Compose](https://docs.docker.com/compose/) (usually included with Docker Desktop).

### Quick Start

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd hacker-news-platform
   ```

2. **Start the application stack:**

   ```bash
   docker-compose up --build
   ```

   This command will:
   - Build the backend and frontend Docker images.
   - Start both services and the required network.
   - Map the frontend to [http://localhost](http://localhost).

3. **Access the application:**

   - Open your browser and go to: [http://localhost](http://localhost)

   The Angular frontend will be served, and it will communicate with the backend API via the internal Docker network.

### Project Structure

- `hacker-news-api/` — ASP.NET Core backend API
- `hacker-news-ui/` — Angular frontend
- `.docker/` — Custom Nginx and config files for the frontend container
- `docker-compose.yml` — Orchestrates both services

### Stopping the Application

To stop the running containers, press `Ctrl+C` in the terminal where Docker Compose is running, or run:

```bash
docker-compose down
```

### Notes

- The backend runs in `Production` mode by default in Docker.
- The frontend is served via Nginx on port 80.
- Any changes to the code will require rebuilding the containers (`docker-compose up --build`). 