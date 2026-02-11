# VibeIndex

Index of the sites and repositories contained in the Github organisation

## Overview

VibeIndex is a Single Page Application (SPA) that provides a central index for projects within a GitHub organization. It displays a clean, interactive interface where users can easily navigate to project sites.

## Features

- 🎯 Simple configuration via JSON file
- 🎨 Modern, responsive UI with gradient design
- 🔗 One-click navigation to project sites (opens in new tab)
- 📱 Mobile-friendly responsive layout
- ♿ Accessible with ARIA labels
- ⚡ Fast loading with vanilla JavaScript
- 🛡️ Secure external link handling
- 🐳 Docker support with minimal scratch-based image
- 🚀 High-performance Go web server

## Getting Started

### Running with Docker (Recommended)

1. Clone the repository
2. Run with Docker Compose:

```bash
docker compose up -d
```

3. Open your browser to `http://localhost:8080`

To stop the server:

```bash
docker compose down
```

### Running with Go

1. Clone the repository
2. Build and run the Go server:

```bash
go build -o server .
./server
```

3. Open your browser to `http://localhost:8080`

The server listens on port 8080 by default. You can customize this with the `PORT` environment variable:

```bash
PORT=3000 ./server
```

### Running Locally (Development)

You can also serve the static files directly using any HTTP server:

```bash
# Using Python 3
cd static
python3 -m http.server 8080

# Using Node.js http-server
cd static
npx http-server -p 8080
```

### Configuration

Edit `static/config.json` to customize the projects displayed:

```json
{
  "organizationName": "Your Organization Name",
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief project description",
      "url": "https://your-project-url.com"
    }
  ]
}
```

## Project Structure

- `main.go` - Go web server for serving static files
- `static/` - Static assets directory
  - `index.html` - Main HTML structure
  - `app.js` - Application logic and SPA functionality
  - `styles.css` - Styling and responsive design
  - `config.json` - Project configuration
- `Dockerfile` - Multi-stage Docker build configuration
- `docker-compose.yml` - Docker Compose configuration

## Docker Details

The Docker image is built using a multi-stage build process:
- Build stage: Uses `golang:1.24-alpine` to compile the Go server
- Runtime stage: Uses `scratch` for a minimal final image
- The container runs with a read-only filesystem for enhanced security
- Redis should be hosted externally (not included in docker-compose.yml)

## Future Enhancements

Planned features for future versions:
- List GitHub repositories with search/filter functionality
- Display organization-wide GitHub issues
- Show organization-wide GitHub pull requests
- GitHub API integration for real-time data

## License

Open source - feel free to use and modify!
