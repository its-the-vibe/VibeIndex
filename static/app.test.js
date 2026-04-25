/**
 * @jest-environment jsdom
 */

'use strict';

// Set up minimal DOM required by VibeIndexApp before requiring the module
function setupDOM() {
    document.body.innerHTML = `
        <div id="org-name">GitHub Organization Index</div>
        <div id="projects-container"></div>
        <div id="repositories-container"></div>
        <section id="repositories-panel" style="display: none;"></section>
        <input id="repo-search" type="text" />
        <div id="loading">Loading projects...</div>
        <div id="error" style="display: none;"></div>
    `;
}

// Mock fetch globally
global.fetch = jest.fn();
// Mock window.open
global.open = jest.fn();

const { VibeIndexApp } = require('./app');

describe('VibeIndexApp', () => {
    beforeEach(() => {
        setupDOM();
        jest.clearAllMocks();
    });

    describe('fuzzyMatch', () => {
        let app;

        beforeEach(() => {
            // Construct without triggering init (fetch not set up yet)
            global.fetch.mockResolvedValue({
                ok: false,
                json: jest.fn()
            });
            app = Object.create(VibeIndexApp.prototype);
        });

        it('returns true when search term is empty', () => {
            expect(app.fuzzyMatch('', 'my-repo')).toBe(true);
        });

        it('returns true when search term exactly matches target', () => {
            expect(app.fuzzyMatch('repo', 'repo')).toBe(true);
        });

        it('returns true when characters appear in order (fuzzy)', () => {
            expect(app.fuzzyMatch('repo', 'my-repository')).toBe(true);
        });

        it('returns true for partial prefix match', () => {
            expect(app.fuzzyMatch('vibe', 'vibeindex')).toBe(true);
        });

        it('returns false when characters are not in order', () => {
            expect(app.fuzzyMatch('ba', 'ab')).toBe(false);
        });

        it('returns false when search term has characters not in target', () => {
            expect(app.fuzzyMatch('xyz', 'abcdef')).toBe(false);
        });

        it('returns false when search term is longer than target', () => {
            expect(app.fuzzyMatch('toolongterm', 'hi')).toBe(false);
        });
    });

    describe('createProjectCard', () => {
        let app;

        beforeEach(() => {
            global.fetch.mockResolvedValue({ ok: false, json: jest.fn() });
            app = Object.create(VibeIndexApp.prototype);
        });

        it('creates a button element with the project name and description', () => {
            const project = { name: 'My Project', description: 'A test project', url: 'https://example.com' };
            const card = app.createProjectCard(project);

            expect(card.tagName).toBe('BUTTON');
            expect(card.className).toBe('project-card');
            expect(card.getAttribute('aria-label')).toBe('Open My Project');
            expect(card.querySelector('.project-name').textContent).toBe('My Project');
            expect(card.querySelector('.project-description').textContent).toBe('A test project');
        });

        it('shows default description when none is provided', () => {
            const project = { name: 'No Desc', url: 'https://example.com' };
            const card = app.createProjectCard(project);

            expect(card.querySelector('.project-description').textContent).toBe('No description available');
        });

        it('opens the project URL in a new tab on click', () => {
            const project = { name: 'Click Me', description: 'desc', url: 'https://click.example.com' };
            const card = app.createProjectCard(project);

            card.click();

            expect(global.open).toHaveBeenCalledWith('https://click.example.com', '_blank', 'noopener,noreferrer');
        });
    });

    describe('createRepositoryItem', () => {
        let app;

        beforeEach(() => {
            global.fetch.mockResolvedValue({ ok: false, json: jest.fn() });
            app = Object.create(VibeIndexApp.prototype);
        });

        it('creates an anchor element with the repository name and URL', () => {
            const repo = { name: 'my-repo', url: 'https://github.com/org/my-repo' };
            const item = app.createRepositoryItem(repo);

            expect(item.tagName).toBe('A');
            expect(item.className).toBe('repo-item');
            expect(item.href).toBe('https://github.com/org/my-repo');
            expect(item.target).toBe('_blank');
            expect(item.rel).toBe('noopener noreferrer');
            expect(item.getAttribute('aria-label')).toBe('Open my-repo repository on GitHub');
            expect(item.dataset.repoName).toBe('my-repo');
            expect(item.querySelector('.repo-name').textContent).toBe('my-repo');
        });

        it('stores the repository name in lowercase as a data attribute', () => {
            const repo = { name: 'MyRepo', url: 'https://github.com/org/MyRepo' };
            const item = app.createRepositoryItem(repo);

            expect(item.dataset.repoName).toBe('myrepo');
        });
    });

    describe('filterRepositories', () => {
        let app;

        beforeEach(() => {
            setupDOM();
            global.fetch.mockResolvedValue({ ok: false, json: jest.fn() });
            app = Object.create(VibeIndexApp.prototype);
            app.repositoriesContainer = document.getElementById('repositories-container');

            // Populate some repository items
            const repos = ['vibeindex', 'my-project', 'foobar'];
            repos.forEach(name => {
                const a = document.createElement('a');
                a.className = 'repo-item';
                a.dataset.repoName = name;
                app.repositoriesContainer.appendChild(a);
            });
        });

        it('shows all repositories when search term is empty', () => {
            app.filterRepositories('');

            const items = app.repositoriesContainer.querySelectorAll('.repo-item');
            items.forEach(item => {
                expect(item.classList.contains('hidden')).toBe(false);
            });
        });

        it('hides repositories that do not match the search term', () => {
            app.filterRepositories('vibe');

            const items = app.repositoriesContainer.querySelectorAll('.repo-item');
            const visible = Array.from(items).filter(i => !i.classList.contains('hidden'));
            const hidden = Array.from(items).filter(i => i.classList.contains('hidden'));

            expect(visible.map(i => i.dataset.repoName)).toEqual(['vibeindex']);
            expect(hidden.length).toBe(2);
        });

        it('is case-insensitive when filtering', () => {
            app.filterRepositories('FOO');

            const items = app.repositoriesContainer.querySelectorAll('.repo-item');
            const visible = Array.from(items).filter(i => !i.classList.contains('hidden'));
            expect(visible.map(i => i.dataset.repoName)).toEqual(['foobar']);
        });
    });

    describe('showError', () => {
        let app;

        beforeEach(() => {
            setupDOM();
            global.fetch.mockResolvedValue({ ok: false, json: jest.fn() });
            app = Object.create(VibeIndexApp.prototype);
            app.loadingElement = document.getElementById('loading');
            app.projectsContainer = document.getElementById('projects-container');
            app.errorElement = document.getElementById('error');
        });

        it('hides loading and projects container, and shows error message', () => {
            app.showError('Something went wrong');

            expect(app.loadingElement.style.display).toBe('none');
            expect(app.projectsContainer.style.display).toBe('none');
            expect(app.errorElement.textContent).toBe('Something went wrong');
            expect(app.errorElement.style.display).toBe('block');
        });
    });

    describe('renderProjects', () => {
        let app;

        beforeEach(() => {
            setupDOM();
            global.fetch.mockResolvedValue({ ok: false, json: jest.fn() });
            app = Object.create(VibeIndexApp.prototype);
            app.loadingElement = document.getElementById('loading');
            app.projectsContainer = document.getElementById('projects-container');
            app.errorElement = document.getElementById('error');
            app.repositoriesContainer = document.getElementById('repositories-container');
        });

        it('renders a card for each project in the config', () => {
            app.config = {
                projects: [
                    { name: 'Alpha', description: 'desc1', url: 'https://alpha.example.com' },
                    { name: 'Beta', description: 'desc2', url: 'https://beta.example.com' }
                ]
            };

            app.renderProjects();

            const cards = app.projectsContainer.querySelectorAll('.project-card');
            expect(cards.length).toBe(2);
            expect(cards[0].querySelector('.project-name').textContent).toBe('Alpha');
            expect(cards[1].querySelector('.project-name').textContent).toBe('Beta');
        });

        it('shows error when config has no projects', () => {
            app.config = { projects: [] };

            app.renderProjects();

            expect(app.errorElement.textContent).toBe('No projects found in configuration');
            expect(app.errorElement.style.display).toBe('block');
        });
    });

    describe('renderRepositories', () => {
        let app;

        beforeEach(() => {
            setupDOM();
            global.fetch.mockResolvedValue({ ok: false, json: jest.fn() });
            app = Object.create(VibeIndexApp.prototype);
            app.repositoriesContainer = document.getElementById('repositories-container');
            app.repositoriesPanel = document.getElementById('repositories-panel');
            app.allRepositories = [];
        });

        it('shows the panel and renders repository items', () => {
            app.config = {
                githubRepositories: [
                    { name: 'repo-one', url: 'https://github.com/org/repo-one' },
                    { name: 'repo-two', url: 'https://github.com/org/repo-two' }
                ]
            };

            app.renderRepositories();

            expect(app.repositoriesPanel.style.display).toBe('block');
            const items = app.repositoriesContainer.querySelectorAll('.repo-item');
            expect(items.length).toBe(2);
        });

        it('does not show the panel when there are no repositories', () => {
            app.config = { githubRepositories: [] };

            app.renderRepositories();

            expect(app.repositoriesPanel.style.display).not.toBe('block');
        });
    });
});
