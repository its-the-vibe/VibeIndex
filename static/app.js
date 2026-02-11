// Single Page Application (SPA) for GitHub Organization Index

class VibeIndexApp {
    constructor() {
        this.config = null;
        this.projectsContainer = document.getElementById('projects-container');
        this.loadingElement = document.getElementById('loading');
        this.errorElement = document.getElementById('error');
        this.orgNameElement = document.getElementById('org-name');
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadConfig();
            this.renderProjects();
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    async loadConfig() {
        try {
            const response = await fetch('config.json');
            if (!response.ok) {
                throw new Error('Failed to load configuration file');
            }
            this.config = await response.json();
            
            // Update organization name if provided
            if (this.config.organizationName) {
                this.orgNameElement.textContent = this.config.organizationName;
            }
        } catch (error) {
            throw new Error(`Configuration error: ${error.message}`);
        }
    }
    
    renderProjects() {
        // Hide loading indicator
        this.loadingElement.style.display = 'none';
        
        // Check if there are projects to display
        if (!this.config.projects || this.config.projects.length === 0) {
            this.showError('No projects found in configuration');
            return;
        }
        
        // Clear container
        this.projectsContainer.innerHTML = '';
        
        // Create a button for each project
        this.config.projects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            this.projectsContainer.appendChild(projectCard);
        });
    }
    
    createProjectCard(project) {
        const card = document.createElement('button');
        card.className = 'project-card';
        card.setAttribute('aria-label', `Open ${project.name}`);
        
        // Add click handler to open URL in new tab
        card.addEventListener('click', () => {
            window.open(project.url, '_blank', 'noopener,noreferrer');
        });
        
        // Create card content
        const nameDiv = document.createElement('div');
        nameDiv.className = 'project-name';
        nameDiv.textContent = project.name;
        
        const descriptionDiv = document.createElement('div');
        descriptionDiv.className = 'project-description';
        descriptionDiv.textContent = project.description || 'No description available';
        
        card.appendChild(nameDiv);
        card.appendChild(descriptionDiv);
        
        return card;
    }
    
    showError(message) {
        this.loadingElement.style.display = 'none';
        this.projectsContainer.style.display = 'none';
        this.errorElement.textContent = message;
        this.errorElement.style.display = 'block';
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new VibeIndexApp();
});
