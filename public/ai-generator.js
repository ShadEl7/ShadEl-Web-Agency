// AI Web Design Preview Generator
class AIWebDesignGenerator {
    constructor() {
        this.apiBaseUrl = window.location.origin;
        this.currentDesign = null;
        this.isGenerating = false;
        this.init();
    }

    init() {
        this.createGeneratorSection();
        this.bindEvents();
    }

    createGeneratorSection() {
        // Find a good place to insert the generator (after services section)
        const servicesSection = document.querySelector('#services');
        if (!servicesSection) return;

        const generatorHTML = `
        <section class="ai-generator-section fade-in" id="ai-generator" style="background: linear-gradient(135deg, var(--primary-dark), var(--primary)); padding: 4rem 0; margin: 3rem 0;">
            <div class="container">
                <div style="text-align: center; margin-bottom: 3rem;">
                    <h2 style="color: var(--text-light); font-size: 2.5rem; margin-bottom: 1rem;">
                        <i class="fas fa-magic" style="margin-right: 0.5rem;"></i>
                        AI Web Design Preview Generator
                    </h2>
                    <p style="color: var(--text); font-size: 1.2rem; max-width: 700px; margin: 0 auto;">
                        Describe your dream website in words and watch our AI generate a professional mockup preview instantly!
                    </p>
                </div>

                <div class="ai-generator-container" style="max-width: 800px; margin: 0 auto;">
                    <!-- Input Section -->
                    <div class="generator-input" style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 15px; margin-bottom: 2rem; backdrop-filter: blur(10px);">
                        <div style="margin-bottom: 1.5rem;">
                            <label for="website-description" style="display: block; color: var(--text-light); font-weight: 600; margin-bottom: 0.5rem; font-size: 1.1rem;">
                                Describe Your Website Vision
                            </label>
                            <textarea 
                                id="website-description" 
                                placeholder="Example: I need a website for my bakery with an online ordering system, photo gallery of our cakes, and customer testimonials..."
                                style="width: 100%; min-height: 120px; padding: 1rem; border: 2px solid rgba(255,255,255,0.2); border-radius: 8px; background: rgba(255,255,255,0.9); font-family: 'Times New Roman', serif; font-size: 1rem; resize: vertical;"
                            ></textarea>
                        </div>

                        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
                            <button id="generate-design-btn" class="ai-generate-btn" style="background: var(--sidebar-accent); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3);">
                                <i class="fas fa-wand-magic-sparkles"></i> Generate Design Preview
                            </button>
                            <button id="view-mockup-btn" class="ai-view-btn" style="background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.3s; display: none;">
                                <i class="fas fa-eye"></i> View Full Mockup
                            </button>
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div id="ai-loading" style="display: none; text-align: center; padding: 2rem;">
                        <div style="display: inline-block; width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: var(--sidebar-accent); animation: spin 1s ease-in-out infinite; margin-bottom: 1rem;"></div>
                        <p style="color: var(--text-light); font-size: 1.1rem;">🎨 AI is crafting your website design...</p>
                        <p style="color: var(--text); font-size: 0.9rem; margin-top: 0.5rem;">This may take 10-15 seconds</p>
                    </div>

                    <!-- Results Section -->
                    <div id="ai-results" style="display: none;">
                        <div style="background: rgba(255,255,255,0.95); padding: 2rem; border-radius: 15px; color: var(--primary);">
                            <h3 style="color: var(--primary); margin-bottom: 1.5rem; text-align: center; font-size: 1.8rem;">
                                <i class="fas fa-sparkles"></i> Your AI-Generated Website Design
                            </h3>
                            
                            <!-- Design Overview -->
                            <div id="design-overview" style="margin-bottom: 2rem;"></div>
                            
                            <!-- Features Grid -->
                            <div id="features-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;"></div>
                            
                            <!-- Action Buttons -->
                            <div style="text-align: center; margin-top: 2rem;">
                                <a href="contact.html?source=ai-generator" style="background: var(--primary); color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-right: 1rem; display: inline-block; transition: all 0.3s;">
                                    <i class="fas fa-rocket"></i> Build This Website
                                </a>
                                <button id="try-again-btn" style="background: transparent; color: var(--primary); border: 2px solid var(--primary); padding: 13px 30px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
                                    <i class="fas fa-redo"></i> Try Another Design
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Error State -->
                    <div id="ai-error" style="display: none; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); padding: 1.5rem; border-radius: 8px; text-align: center;">
                        <p style="color: #ef4444; font-weight: 600; margin-bottom: 0.5rem;">
                            <i class="fas fa-exclamation-triangle"></i> Oops! Something went wrong
                        </p>
                        <p style="color: var(--text); font-size: 0.9rem;">Please try again with a different description or contact us for assistance.</p>
                    </div>
                </div>

                <!-- Example Prompts -->
                <div style="margin-top: 3rem; text-align: center;">
                    <p style="color: var(--text-light); margin-bottom: 1rem; font-weight: 600;">Need inspiration? Try these examples:</p>
                    <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">
                        <button class="example-prompt" data-prompt="I need a modern e-commerce website for my clothing boutique with product galleries, shopping cart, and customer reviews">
                            🛍️ Fashion Store
                        </button>
                        <button class="example-prompt" data-prompt="Create a portfolio website for my photography business with image galleries, client testimonials, and booking system">
                            📸 Photography Portfolio
                        </button>
                        <button class="example-prompt" data-prompt="I want a restaurant website with online menu, reservation system, photo gallery, and location map">
                            🍽️ Restaurant
                        </button>
                        <button class="example-prompt" data-prompt="Build a nonprofit website for our animal shelter with donation system, volunteer signup, and pet adoption gallery">
                            🐾 Animal Shelter
                        </button>
                    </div>
                </div>
            </div>
        </section>`;

        // Insert after services section
        servicesSection.insertAdjacentHTML('afterend', generatorHTML);

        // Add CSS animations
        this.addStyles();
    }

    addStyles() {
        const styles = `
        <style>
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .ai-generate-btn:hover {
            background: #0ea5e9 !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(56, 189, 248, 0.4) !important;
        }
        
        .ai-view-btn:hover {
            background: #059669 !important;
            transform: translateY(-2px);
        }
        
        .example-prompt {
            background: rgba(255,255,255,0.1);
            color: var(--text-light);
            border: 1px solid rgba(255,255,255,0.2);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s;
            backdrop-filter: blur(10px);
        }
        
        .example-prompt:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-1px);
        }
        
        .design-card {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            border-left: 4px solid var(--sidebar-accent);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .feature-card {
            background: #f8fafc;
            padding: 1.2rem;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e2e8f0;
        }
        
        .feature-card h4 {
            color: var(--primary);
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
        }
        
        @media (max-width: 768px) {
            .ai-generator-section .container > div:first-child h2 {
                font-size: 2rem !important;
            }
            
            .generator-input {
                padding: 1.5rem !important;
            }
            
            .example-prompt {
                font-size: 0.8rem;
                padding: 6px 12px;
            }
        }
        </style>`;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    bindEvents() {
        // Generate button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'generate-design-btn' || e.target.closest('#generate-design-btn')) {
                this.generateDesign();
            }
            
            if (e.target.id === 'view-mockup-btn' || e.target.closest('#view-mockup-btn')) {
                this.viewMockup();
            }
            
            if (e.target.id === 'try-again-btn' || e.target.closest('#try-again-btn')) {
                this.resetGenerator();
            }
            
            // Example prompts
            if (e.target.classList.contains('example-prompt')) {
                const prompt = e.target.getAttribute('data-prompt');
                document.getElementById('website-description').value = prompt;
                // Auto-generate after a short delay
                setTimeout(() => this.generateDesign(), 500);
            }
        });
    }

    async generateDesign() {
        if (this.isGenerating) return;

        const description = document.getElementById('website-description').value.trim();
        
        if (description.length < 10) {
            alert('Please provide a more detailed description of your website (at least 10 characters).');
            return;
        }

        this.isGenerating = true;
        this.showLoading();

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/generate-design`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description })
            });

            const data = await response.json();

            if (data.success) {
                this.currentDesign = data.design;
                this.displayResults(data.design);
            } else {
                throw new Error(data.error || 'Failed to generate design');
            }
        } catch (error) {
            console.error('Error generating design:', error);
            this.showError(error.message);
        } finally {
            this.isGenerating = false;
            this.hideLoading();
        }
    }

    async viewMockup() {
        if (!this.currentDesign) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/generate-mockup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ design: this.currentDesign })
            });

            const data = await response.json();

            if (data.success) {
                // Open mockup in new window
                const mockupWindow = window.open('', '_blank');
                mockupWindow.document.write(data.mockup);
                mockupWindow.document.close();
            } else {
                throw new Error(data.error || 'Failed to generate mockup');
            }
        } catch (error) {
            console.error('Error generating mockup:', error);
            alert('Sorry, could not generate the mockup preview. Please try again.');
        }
    }

    displayResults(design) {
        const resultsDiv = document.getElementById('ai-results');
        const overviewDiv = document.getElementById('design-overview');
        const featuresDiv = document.getElementById('features-grid');

        // Design Overview
        overviewDiv.innerHTML = `
            <div class="design-card">
                <h4 style="color: var(--sidebar-accent); font-size: 1.3rem; margin-bottom: 1rem;">
                    <i class="fas fa-globe"></i> ${design.siteName}
                </h4>
                <p style="font-size: 1.1rem; margin-bottom: 1rem; font-style: italic;">"${design.tagline}"</p>
                <p style="margin-bottom: 1rem;"><strong>Website Type:</strong> ${design.websiteType.charAt(0).toUpperCase() + design.websiteType.slice(1)}</p>
                <p style="margin-bottom: 1rem;"><strong>Recommended Pages:</strong> ${design.pages.join(', ')}</p>
                <div style="display: flex; gap: 10px; margin-top: 1rem;">
                    <span style="background: ${design.colorScheme.primary}; color: white; padding: 8px 12px; border-radius: 4px; font-size: 0.9rem;">Primary</span>
                    <span style="background: ${design.colorScheme.secondary}; color: white; padding: 8px 12px; border-radius: 4px; font-size: 0.9rem;">Secondary</span>
                    <span style="background: ${design.colorScheme.accent}; color: white; padding: 8px 12px; border-radius: 4px; font-size: 0.9rem;">Accent</span>
                </div>
            </div>
        `;

        // Features
        featuresDiv.innerHTML = design.features.map(feature => `
            <div class="feature-card">
                <h4><i class="fas fa-check-circle" style="color: #10b981;"></i> ${feature}</h4>
                <p style="font-size: 0.9rem; color: #6b7280;">Professional implementation included</p>
            </div>
        `).join('');

        // Show results and view mockup button
        resultsDiv.style.display = 'block';
        document.getElementById('view-mockup-btn').style.display = 'inline-block';

        // Scroll to results
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    showLoading() {
        document.getElementById('ai-loading').style.display = 'block';
        document.getElementById('ai-results').style.display = 'none';
        document.getElementById('ai-error').style.display = 'none';
        document.getElementById('generate-design-btn').disabled = true;
        document.getElementById('generate-design-btn').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    }

    hideLoading() {
        document.getElementById('ai-loading').style.display = 'none';
        document.getElementById('generate-design-btn').disabled = false;
        document.getElementById('generate-design-btn').innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Generate Design Preview';
    }

    showError(message) {
        document.getElementById('ai-error').style.display = 'block';
        document.getElementById('ai-results').style.display = 'none';
        const errorDiv = document.getElementById('ai-error');
        errorDiv.querySelector('p:last-child').textContent = message;
    }

    resetGenerator() {
        document.getElementById('ai-results').style.display = 'none';
        document.getElementById('ai-error').style.display = 'none';
        document.getElementById('view-mockup-btn').style.display = 'none';
        document.getElementById('website-description').value = '';
        document.getElementById('website-description').focus();
    }
}

// Initialize the AI Web Design Generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIWebDesignGenerator();
});

// Add to navigation menu
document.addEventListener('DOMContentLoaded', () => {
    // Update navigation to include AI Generator link
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        const aiNavItem = document.createElement('li');
        aiNavItem.innerHTML = '<a href="#ai-generator"><i class="fas fa-magic"></i> AI Preview</a>';
        navLinks.appendChild(aiNavItem);
    }
});
