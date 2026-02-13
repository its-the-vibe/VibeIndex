# VibeIndex

Index of the sites and repositories contained in the Github organisation

## Overview

VibeIndex is a Single Page Application (SPA) that provides a central index for projects within a GitHub organization. It displays a clean, interactive interface where users can easily navigate to project sites.

## Features

- 🎯 Simple configuration via JSON file
- 🎨 Modern, responsive UI with gradient design
- 🔗 One-click navigation to project sites (opens in new tab)
- 🔍 GitHub repositories panel with fuzzy search filter
- 📱 Mobile-friendly responsive layout
- ♿ Accessible with ARIA labels
- ⚡ Fast loading with vanilla JavaScript
- 🛡️ Secure external link handling
- 🐳 Docker support with minimal scratch-based image
- 🚀 High-performance Go web server

## Getting Started

### Initial Setup

Before running the application, you need to create your configuration file:

1. Copy the example configuration:
```bash
cp static/config.json.example static/config.json
```

2. Edit `static/config.json` to customize your organization and projects

### Running with Docker (Recommended)

1. Clone the repository
2. Create your config file (see Initial Setup above)
3. Run with Docker Compose:

```bash
docker compose up -d
```

4. Open your browser to `http://localhost:8080`

To stop the server:

```bash
docker compose down
```

### Running with Go

1. Clone the repository
2. Create your config file (see Initial Setup above)
3. Build and run the Go server:

```bash
go build -o server .
./server
```

4. Open your browser to `http://localhost:8080`

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

The `static/config.json` file is not included in source control. Use `static/config.json.example` as a template:

```json
{
  "organizationName": "Your Organization Name",
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief project description",
      "url": "https://your-project-url.com"
    }
  ],
  "githubRepositories": [
    {
      "name": "Repository Name",
      "url": "https://github.com/your-org/your-repo"
    }
  ]
}
```

**Configuration Fields:**
- `organizationName` (required): The name of your organization displayed at the top of the page
- `projects` (optional): Array of deployed projects with name, description, and URL
- `githubRepositories` (optional): Array of GitHub repositories with name and URL. When provided, displays a searchable panel with direct links to repositories.

**Note:** The `config.json` file should be created from the example template and customized for your environment. It is excluded from version control to allow different configurations per deployment.

## Project Structure

- `main.go` - Go web server for serving static files
- `static/` - Static assets directory
  - `index.html` - Main HTML structure
  - `app.js` - Application logic and SPA functionality
  - `styles.css` - Styling and responsive design
  - `config.json.example` - Example project configuration (copy to `config.json` and customize)
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
- Display organization-wide GitHub issues
- Show organization-wide GitHub pull requests
- GitHub API integration for real-time data

## License

Open source - feel free to use and modify!
