// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.projects = [];
        this.clients = [];
        this.activities = [];
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.startRealTimeUpdates();
    }

    loadData() {
        // Load projects data
        this.projects = [
            {
                id: 'proj_001',
                name: 'E-commerce Website Redesign',
                clientId: 'client_001',
                clientName: 'John Doe',
                type: 'ecommerce',
                status: 'in-progress',
                progress: 65,
                budget: 15000,
                deadline: '2025-09-15',
                createdAt: '2025-08-20'
            },
            {
                id: 'proj_002',
                name: 'Portfolio Website',
                clientId: 'client_002',
                clientName: 'Jane Smith',
                type: 'portfolio',
                status: 'in-progress',
                progress: 90,
                budget: 8000,
                deadline: '2025-08-30',
                createdAt: '2025-08-15'
            },
            {
                id: 'proj_003',
                name: 'Restaurant Website',
                clientId: 'client_003',
                clientName: 'Mike Johnson',
                type: 'business',
                status: 'completed',
                progress: 100,
                budget: 12000,
                deadline: '2025-08-20',
                createdAt: '2025-07-25'
            }
        ];

        // Load clients data
        this.clients = [
            {
                id: 'client_001',
                name: 'John Doe',
                email: 'john.doe@example.com',
                company: 'Doe Enterprises',
                avatar: 'JD',
                joinDate: '2025-08-20',
                status: 'active',
                totalProjects: 1,
                totalSpent: 15000
            },
            {
                id: 'client_002',
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                company: 'Smith Design Co',
                avatar: 'JS',
                joinDate: '2025-08-15',
                status: 'active',
                totalProjects: 1,
                totalSpent: 8000
            },
            {
                id: 'client_003',
                name: 'Mike Johnson',
                email: 'mike.johnson@example.com',
                company: 'Johnson\'s Restaurant',
                avatar: 'MJ',
                joinDate: '2025-07-25',
                status: 'completed',
                totalProjects: 1,
                totalSpent: 12000
            }
        ];

        this.updateDashboardStats();
        this.updateProjectsTable();
        this.updateActivityFeed();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(item.dataset.section);
            });
        });

        // New project form
        document.getElementById('newProjectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createNewProject();
        });

        // Modal controls
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });
    }

    switchSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content based on section
        this.currentSection = section;
        this.updateSectionContent(section);
    }

    updateSectionContent(section) {
        const headerTitle = document.querySelector('.header-title');
        
        switch(section) {
            case 'dashboard':
                headerTitle.textContent = 'Dashboard Overview';
                break;
            case 'projects':
                headerTitle.textContent = 'Project Management';
                this.showProjectManagement();
                break;
            case 'clients':
                headerTitle.textContent = 'Client Management';
                this.showClientManagement();
                break;
            case 'team':
                headerTitle.textContent = 'Team Management';
                this.showTeamManagement();
                break;
            case 'analytics':
                headerTitle.textContent = 'Analytics & Reports';
                this.showAnalytics();
                break;
            case 'settings':
                headerTitle.textContent = 'Settings';
                this.showSettings();
                break;
        }
    }

    updateDashboardStats() {
        const activeProjects = this.projects.filter(p => p.status === 'in-progress').length;
        const totalClients = this.clients.length;
        const monthlyRevenue = this.projects.reduce((sum, p) => sum + p.budget, 0);
        const avgCompletion = Math.round(
            this.projects.reduce((sum, p) => sum + p.progress, 0) / this.projects.length
        );

        document.getElementById('activeProjects').textContent = activeProjects;
        document.getElementById('totalClients').textContent = totalClients;
        document.getElementById('monthlyRevenue').textContent = `$${monthlyRevenue.toLocaleString()}`;
        document.getElementById('avgCompletion').textContent = `${avgCompletion}%`;
    }

    updateProjectsTable() {
        const tbody = document.getElementById('projectsTable');
        tbody.innerHTML = '';

        this.projects.forEach(project => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${project.name}</td>
                <td>${project.clientName}</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${project.progress}%"></div>
                    </div>
                    ${project.progress}%
                </td>
                <td><span class="status-badge status-${project.status}">${this.formatStatus(project.status)}</span></td>
                <td>${this.formatDate(project.deadline)}</td>
                <td>
                    <button class="action-btn btn-primary" onclick="adminDashboard.viewProject('${project.id}')">View</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateActivityFeed() {
        const activities = [
            {
                type: 'update',
                icon: 'fas fa-sync',
                text: '<strong>John Doe</strong> project updated to 65%',
                time: '2h ago'
            },
            {
                type: 'message',
                icon: 'fas fa-comment',
                text: 'New feedback from <strong>Jane Smith</strong>',
                time: '4h ago'
            },
            {
                type: 'milestone',
                icon: 'fas fa-flag',
                text: '<strong>Mike Johnson</strong> project completed',
                time: '1d ago'
            },
            {
                type: 'update',
                icon: 'fas fa-plus',
                text: 'New project created for <strong>Sarah Wilson</strong>',
                time: '2d ago'
            }
        ];

        const activityFeed = document.getElementById('activityFeed');
        activityFeed.innerHTML = '';

        activities.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <div class="activity-icon ${activity.type}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-text">
                    ${activity.text}
                </div>
                <div class="activity-time">${activity.time}</div>
            `;
            activityFeed.appendChild(item);
        });
    }

    formatStatus(status) {
        return status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }

    viewProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            // In a real application, this would navigate to a detailed project view
            this.showNotification(`Opening project: ${project.name}`, 'info');
            
            // For demo, we'll show project details in an alert
            const details = `
Project: ${project.name}
Client: ${project.clientName}
Status: ${this.formatStatus(project.status)}
Progress: ${project.progress}%
Budget: $${project.budget.toLocaleString()}
Deadline: ${this.formatDate(project.deadline)}
            `;
            alert(details);
        }
    }

    createNewProject() {
        const formData = {
            name: document.getElementById('projectName').value,
            clientId: document.getElementById('projectClient').value,
            type: document.getElementById('projectType').value,
            budget: parseInt(document.getElementById('projectBudget').value),
            deadline: document.getElementById('projectDeadline').value,
            description: document.getElementById('projectDescription').value
        };

        if (!formData.name || !formData.clientId || !formData.type || !formData.budget || !formData.deadline) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Generate new project ID
        const projectId = 'proj_' + Date.now();
        const client = this.clients.find(c => c.id === formData.clientId);

        const newProject = {
            id: projectId,
            name: formData.name,
            clientId: formData.clientId,
            clientName: client ? client.name : 'Unknown',
            type: formData.type,
            status: 'pending',
            progress: 0,
            budget: formData.budget,
            deadline: formData.deadline,
            description: formData.description,
            createdAt: new Date().toISOString().split('T')[0]
        };

        this.projects.unshift(newProject);
        this.updateDashboardStats();
        this.updateProjectsTable();
        this.hideModal('newProjectModal');
        this.showNotification('Project created successfully!', 'success');

        // Clear form
        document.getElementById('newProjectForm').reset();
    }

    showModal(modalId) {
        document.getElementById(modalId).classList.add('show');
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 1100;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;

        // Set color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;

        // Add to DOM
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    startRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            this.simulateProgressUpdate();
        }, 60000); // Update every minute

        setInterval(() => {
            this.simulateNewActivity();
        }, 120000); // New activity every 2 minutes
    }

    simulateProgressUpdate() {
        const activeProjects = this.projects.filter(p => p.status === 'in-progress');
        if (activeProjects.length > 0) {
            const randomProject = activeProjects[Math.floor(Math.random() * activeProjects.length)];
            if (randomProject.progress < 95) {
                randomProject.progress += Math.floor(Math.random() * 5) + 1;
                randomProject.progress = Math.min(100, randomProject.progress);
                
                if (randomProject.progress === 100) {
                    randomProject.status = 'completed';
                }
                
                this.updateProjectsTable();
                this.updateDashboardStats();
                
                // Add activity
                this.addActivity('update', `<strong>${randomProject.clientName}</strong> project updated to ${randomProject.progress}%`);
            }
        }
    }

    simulateNewActivity() {
        const activities = [
            'New client inquiry received',
            'Team member completed milestone',
            'Client provided feedback',
            'Payment received for project',
            'Design review scheduled'
        ];

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        this.addActivity('message', randomActivity);
    }

    addActivity(type, text) {
        const activityFeed = document.getElementById('activityFeed');
        const newActivity = document.createElement('div');
        newActivity.className = 'activity-item';
        newActivity.style.animation = 'fadeIn 0.5s ease';
        
        const iconMap = {
            'update': 'fas fa-sync',
            'message': 'fas fa-comment',
            'milestone': 'fas fa-flag'
        };

        newActivity.innerHTML = `
            <div class="activity-icon ${type}">
                <i class="${iconMap[type] || 'fas fa-info'}"></i>
            </div>
            <div class="activity-text">
                ${text}
            </div>
            <div class="activity-time">Just now</div>
        `;

        activityFeed.insertBefore(newActivity, activityFeed.firstChild);

        // Keep only the last 10 activities
        const activities = activityFeed.querySelectorAll('.activity-item');
        if (activities.length > 10) {
            activities[activities.length - 1].remove();
        }
    }

    showProjectManagement() {
        // This would show a detailed project management interface
        this.showNotification('Project Management interface loaded', 'info');
    }

    showClientManagement() {
        // This would show a detailed client management interface
        this.showNotification('Client Management interface loaded', 'info');
    }

    showTeamManagement() {
        // This would show team management interface
        this.showNotification('Team Management interface loaded', 'info');
    }

    showAnalytics() {
        // This would show analytics dashboard
        this.showNotification('Analytics dashboard loaded', 'info');
    }

    showSettings() {
        // This would show settings interface
        this.showNotification('Settings interface loaded', 'info');
    }
}

// Global functions for HTML onclick events
function showModal(modalId) {
    adminDashboard.showModal(modalId);
}

function hideModal(modalId) {
    adminDashboard.hideModal(modalId);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize dashboard when page loads
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
});
