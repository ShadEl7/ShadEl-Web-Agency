// Client Dashboard JavaScript
class ClientDashboard {
    constructor() {
        this.currentUser = null;
        this.projectData = null;
        this.init();
    }

    init() {
        this.loadUserData();
        this.loadProjectData();
        this.setupEventListeners();
        this.startRealTimeUpdates();
    }

    loadUserData() {
        // In a real app, this would come from authentication
        this.currentUser = {
            id: 'client_001',
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: 'JD',
            projectId: 'proj_001'
        };
        
        this.updateUserDisplay();
    }

    loadProjectData() {
        // In a real app, this would come from your database
        this.projectData = {
            id: 'proj_001',
            name: 'E-commerce Website Redesign',
            status: 'in-progress',
            progress: 65,
            budget: '$15,000',
            deadline: 'September 15, 2025',
            team: [
                { name: 'Sarah Chen', role: 'Project Manager' },
                { name: 'Mike Torres', role: 'Developer' },
                { name: 'Lisa Wang', role: 'Designer' }
            ],
            milestones: [
                { date: 'Aug 20, 2025', title: 'Project Kickoff', status: 'completed', description: 'Initial requirements gathering and project planning completed' },
                { date: 'Aug 22, 2025', title: 'Design Mockups', status: 'completed', description: 'UI/UX designs approved by client' },
                { date: 'Aug 25, 2025', title: 'Development Phase', status: 'in-progress', description: 'Frontend development in progress, backend API implementation underway' },
                { date: 'Sep 1, 2025', title: 'Testing Phase', status: 'pending', description: 'Quality assurance and user testing' },
                { date: 'Sep 15, 2025', title: 'Launch', status: 'pending', description: 'Final deployment and go-live' }
            ]
        };
        
        this.updateProjectDisplay();
    }

    updateUserDisplay() {
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('userAvatar').textContent = this.currentUser.avatar;
    }

    updateProjectDisplay() {
        document.getElementById('projectName').textContent = this.projectData.name;
        document.getElementById('projectProgress').style.width = `${this.projectData.progress}%`;
        document.getElementById('progressText').textContent = `${this.projectData.progress}% Complete`;
        document.getElementById('projectDeadline').textContent = this.projectData.deadline;
        document.getElementById('projectBudget').textContent = this.projectData.budget;
        
        // Update status badge
        const statusBadge = document.getElementById('projectStatus');
        statusBadge.className = `status-badge status-${this.projectData.status}`;
        statusBadge.textContent = this.formatStatus(this.projectData.status);
    }

    formatStatus(status) {
        return status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    async generateUpdate() {
        const updateButton = document.querySelector('[onclick="generateUpdate()"]');
        updateButton.disabled = true;
        updateButton.innerHTML = '🔄 Generating...';

        try {
            // Simulate AI update generation
            const updates = await this.fetchAIUpdate();
            this.displayAIUpdate(updates);
        } catch (error) {
            console.error('Error generating update:', error);
            this.showNotification('Error generating update. Please try again.', 'error');
        } finally {
            updateButton.disabled = false;
            updateButton.innerHTML = '🔄 Generate New Update';
        }
    }

    async fetchAIUpdate() {
        try {
            const response = await fetch('/api/client/ai-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectId: this.currentUser.projectId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch AI update');
            }

            const data = await response.json();
            return data.update;
        } catch (error) {
            console.error('Error fetching AI update:', error);
            
            // Fallback to local updates if API fails
            return new Promise((resolve) => {
                setTimeout(() => {
                    const updates = [
                        "Excellent progress on your website! The responsive design implementation is now 90% complete. Our team has successfully optimized the mobile experience and implemented the new navigation system. User testing shows a 40% improvement in navigation efficiency.",
                        "Great news! The database migration has been completed successfully. All your product data has been transferred to the new system with zero data loss. The search functionality is now 3x faster than before.",
                        "Security implementation is ahead of schedule! We've integrated SSL certificates, implemented two-factor authentication, and added GDPR compliance features. Your website now meets all industry security standards.",
                        "Performance optimization complete! Your website now loads 60% faster than before. We've implemented image compression, code minification, and CDN integration. Google PageSpeed score improved from 72 to 94.",
                        "Content management system setup is finalized! You can now easily update products, blog posts, and pages through the intuitive admin panel. Training materials have been prepared for your team."
                    ];
                    
                    const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
                    resolve({
                        message: randomUpdate,
                        timestamp: new Date(),
                        confidence: Math.floor(Math.random() * 20) + 80 // 80-100%
                    });
                }, 1000);
            });
        }
    }

    displayAIUpdate(update) {
        const aiUpdatesContainer = document.getElementById('aiUpdates');
        const timeAgo = this.getTimeAgo(update.timestamp);
        
        const updateHTML = `
            <div class="ai-update">
                <div class="ai-update-header">
                    <div class="ai-icon">AI</div>
                    <strong>New AI Update</strong>
                    <span style="margin-left: auto; font-size: 12px; color: #6b7280;">${timeAgo}</span>
                </div>
                <p>${update.message}</p>
                <div style="margin-top: 10px; font-size: 12px; color: #6b7280;">
                    Confidence Level: ${update.confidence}%
                </div>
            </div>
        `;
        
        aiUpdatesContainer.insertAdjacentHTML('afterbegin', updateHTML);
        
        // Keep only the last 3 updates
        const updates = aiUpdatesContainer.querySelectorAll('.ai-update');
        if (updates.length > 3) {
            updates[updates.length - 1].remove();
        }
        
        this.showNotification('New AI update generated!', 'success');
    }

    async sendFeedback() {
        const input = document.getElementById('feedbackInput');
        const feedback = input.value.trim();
        
        if (!feedback) {
            this.showNotification('Please enter your feedback', 'warning');
            return;
        }
        
        try {
            // Send feedback to server
            const response = await fetch('/api/client/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectId: this.currentUser.projectId,
                    clientId: this.currentUser.id,
                    message: feedback
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send feedback');
            }

            // Add feedback to messages
            this.addMessage(this.currentUser.name, feedback, new Date(), 'client');
            
            // Clear input
            input.value = '';
            
            // Simulate response from team
            setTimeout(() => {
                const responses = [
                    "Thank you for your feedback! We'll review this and get back to you within 24 hours.",
                    "Great suggestion! We'll implement this in the next iteration.",
                    "Thanks for pointing this out. Our team will address this immediately.",
                    "We appreciate your input! This feedback helps us improve the project."
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                this.addMessage('Project Team', randomResponse, new Date(), 'team');
            }, 3000);
            
            this.showNotification('Feedback sent successfully!', 'success');
        } catch (error) {
            console.error('Error sending feedback:', error);
            this.showNotification('Failed to send feedback. Please try again.', 'error');
        }
    }

    addMessage(author, content, timestamp, type = 'team') {
        const messagesList = document.getElementById('messagesList');
        const timeAgo = this.getTimeAgo(timestamp);
        
        const messageHTML = `
            <div class="message">
                <div class="message-header">
                    <span class="message-author">${author}</span>
                    <span class="message-date">${timeAgo}</span>
                </div>
                <p>${content}</p>
            </div>
        `;
        
        messagesList.insertAdjacentHTML('afterbegin', messageHTML);
        
        // Keep only the last 5 messages visible
        const messages = messagesList.querySelectorAll('.message');
        if (messages.length > 5) {
            messages[messages.length - 1].remove();
        }
        
        // Scroll to top of messages
        messagesList.scrollTop = 0;
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const diffMs = now - timestamp;
        const diffMinutes = Math.floor(diffMs / 60000);
        
        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
        
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours} hours ago`;
        
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} days ago`;
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
            z-index: 1000;
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

    setupEventListeners() {
        // Enter key for feedback
        document.getElementById('feedbackInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendFeedback();
            }
        });
        
        // Progress updates
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('timeline-item')) {
                this.showMilestoneDetails(e.target);
            }
        });
    }

    startRealTimeUpdates() {
        // Simulate real-time progress updates
        setInterval(() => {
            this.simulateProgressUpdate();
        }, 30000); // Update every 30 seconds
        
        // Simulate new messages
        setInterval(() => {
            this.simulateNewMessage();
        }, 120000); // New message every 2 minutes
    }

    simulateProgressUpdate() {
        // Small random progress increments
        if (this.projectData.progress < 95) {
            const increment = Math.random() * 2; // 0-2% increment
            this.projectData.progress = Math.min(95, this.projectData.progress + increment);
            
            document.getElementById('projectProgress').style.width = `${this.projectData.progress}%`;
            document.getElementById('progressText').textContent = `${Math.floor(this.projectData.progress)}% Complete`;
        }
    }

    simulateNewMessage() {
        const teamMessages = [
            "Quick update: The mobile responsiveness testing is complete and looking great!",
            "We've just pushed the latest changes to the staging environment for your review.",
            "The performance optimizations have been implemented. Page load time improved by 40%!",
            "Security audit completed successfully. All vulnerabilities have been addressed.",
            "Content migration is 90% complete. We'll have everything ready by tomorrow."
        ];
        
        const teamMembers = ['Sarah Chen (PM)', 'Mike Torres (Dev)', 'Lisa Wang (Designer)'];
        const randomMessage = teamMessages[Math.floor(Math.random() * teamMessages.length)];
        const randomMember = teamMembers[Math.floor(Math.random() * teamMembers.length)];
        
        // Only add if it's been a while since last message
        const lastMessage = document.querySelector('#messagesList .message');
        if (!lastMessage || Math.random() > 0.7) { // 30% chance
            this.addMessage(randomMember, randomMessage, new Date(), 'team');
        }
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            // In a real app, this would clear authentication tokens
            window.location.href = 'client-login.html';
        }
    }
}

// Global functions for HTML onclick events
function sendFeedback() {
    dashboard.sendFeedback();
}

function generateUpdate() {
    dashboard.generateUpdate();
}

function logout() {
    dashboard.logout();
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
    
    .dashboard-card {
        transition: all 0.3s ease;
    }
    
    .message {
        animation: fadeIn 0.5s ease;
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
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new ClientDashboard();
});
