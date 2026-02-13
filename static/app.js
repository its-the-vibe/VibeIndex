// Single Page Application (SPA) for GitHub Organization Index

class VibeIndexApp {
    constructor() {
        this.config = null;
        this.projectsContainer = document.getElementById('projects-container');
        this.repositoriesContainer = document.getElementById('repositories-container');
        this.repositoriesPanel = document.getElementById('repositories-panel');
        this.repoSearchInput = document.getElementById('repo-search');
        this.loadingElement = document.getElementById('loading');
        this.errorElement = document.getElementById('error');
        this.orgNameElement = document.getElementById('org-name');
        this.allRepositories = [];
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadConfig();
            this.renderProjects();
            this.renderRepositories();
            this.setupSearch();
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
    
    renderRepositories() {
        // Check if there are repositories to display
        if (!this.config.githubRepositories || this.config.githubRepositories.length === 0) {
            // Don't show the panel if there are no repositories
            return;
        }
        
        // Show the repositories panel
        this.repositoriesPanel.style.display = 'block';
        
        // Store all repositories for search
        this.allRepositories = this.config.githubRepositories;
        
        // Clear container
        this.repositoriesContainer.innerHTML = '';
        
        // Create a link for each repository
        this.allRepositories.forEach(repo => {
            const repoItem = this.createRepositoryItem(repo);
            this.repositoriesContainer.appendChild(repoItem);
        });
    }
    
    createRepositoryItem(repo) {
        const item = document.createElement('a');
        item.className = 'repo-item';
        item.href = repo.url;
        item.target = '_blank';
        item.rel = 'noopener noreferrer';
        item.setAttribute('aria-label', `Open ${repo.name} repository on GitHub`);
        item.dataset.repoName = repo.name.toLowerCase();
        
        // Add GitHub icon (using SVG)
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('class', 'repo-icon');
        icon.setAttribute('viewBox', '0 0 16 16');
        icon.setAttribute('fill', 'currentColor');
        icon.innerHTML = '<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>';
        
        // Add repository name
        const name = document.createElement('span');
        name.className = 'repo-name';
        name.textContent = repo.name;
        
        item.appendChild(icon);
        item.appendChild(name);
        
        return item;
    }
    
    setupSearch() {
        if (!this.repoSearchInput) return;
        
        this.repoSearchInput.addEventListener('input', (e) => {
            this.filterRepositories(e.target.value);
        });
    }
    
    filterRepositories(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        // Get all repository items
        const repoItems = this.repositoriesContainer.querySelectorAll('.repo-item');
        
        repoItems.forEach(item => {
            const repoName = item.dataset.repoName;
            
            if (term === '') {
                // Show all if search is empty
                item.classList.remove('hidden');
            } else {
                // Fuzzy search: check if all characters in search term appear in order in the repo name
                const matches = this.fuzzyMatch(term, repoName);
                
                if (matches) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            }
        });
    }
    
    fuzzyMatch(search, target) {
        // Simple fuzzy matching: all characters from search must appear in order in target
        let searchIndex = 0;
        let targetIndex = 0;
        
        while (searchIndex < search.length && targetIndex < target.length) {
            if (search[searchIndex] === target[targetIndex]) {
                searchIndex++;
            }
            targetIndex++;
        }
        
        return searchIndex === search.length;
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
