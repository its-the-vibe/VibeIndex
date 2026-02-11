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

## Getting Started

### Running Locally

1. Clone the repository
2. Serve the files using any HTTP server. For example:

```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js http-server
npx http-server -p 8080

# Using PHP
php -S localhost:8080
```

3. Open your browser to `http://localhost:8080`

### Configuration

Edit `config.json` to customize the projects displayed:

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

- `index.html` - Main HTML structure
- `app.js` - Application logic and SPA functionality
- `styles.css` - Styling and responsive design
- `config.json` - Project configuration

## Future Enhancements

Planned features for future versions:
- List GitHub repositories with search/filter functionality
- Display organization-wide GitHub issues
- Show organization-wide GitHub pull requests
- GitHub API integration for real-time data

## License

Open source - feel free to use and modify!
