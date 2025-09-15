// Smart Quote Estimator JavaScript
class SmartQuoteEstimator {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        this.apiBaseUrl = window.location.origin;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeForm();
    }

    bindEvents() {
                    const featureDays = {
                    cms: 3,
                    seo: 2,
                    analytics: 1,
                    contact: 1,
                    social: 2,
                    ecommerce: 12,
                    booking: 6,
                    membership: 8,
                    multilingual: 5
                };
        
        // Form submission
        document.getElementById('quote-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });

        // Radio button changes
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', this.handleInputChange.bind(this));
        });

        // Checkbox changes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', this.handleCheckboxChange.bind(this));
        });

        // Input changes
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('change', this.handleInputChange.bind(this));
        });
    }

    initializeForm() {
        this.updateProgressBar();
        this.updateStepIndicator();
    }

    handleInputChange(e) {
        const { name, value, type } = e.target;
        
        if (type === 'radio') {
            this.formData[name] = value;
            // Update UI for selected radio button
            this.updateRadioSelection(e.target);
        } else {
            this.formData[name] = value;
        }
    }

    handleCheckboxChange(e) {
        const { name, value, checked } = e.target;
        
        if (!this.formData[name]) {
            this.formData[name] = [];
        }
        
        if (checked) {
            this.formData[name].push(value);
        } else {
            this.formData[name] = this.formData[name].filter(item => item !== value);
        }
        
        // Update UI for selected checkbox
        this.updateCheckboxSelection(e.target);
    }

    updateRadioSelection(radio) {
        // Remove selected class from all radio items in the same group
        const group = radio.getAttribute('name');
        document.querySelectorAll(`input[name="${group}"]`).forEach(r => {
            r.closest('.checkbox-item').classList.remove('selected');
        });
        
        // Add selected class to current item
        radio.closest('.checkbox-item').classList.add('selected');
    }

    updateCheckboxSelection(checkbox) {
        const item = checkbox.closest('.checkbox-item');
        if (checkbox.checked) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
        
        // Update feature counter for features section
        if (checkbox.name === 'features') {
            this.updateFeatureCounter();
        }
    }

    updateFeatureCounter() {
        const featureCheckboxes = document.querySelectorAll('input[name="features"]:checked');
        // Exclude the responsive checkbox as it's included by default
        const selectedFeatures = Array.from(featureCheckboxes).filter(cb => cb.value !== 'responsive');
        const count = selectedFeatures.length;
        
        const counter = document.getElementById('feature-counter');
        const countSpan = document.getElementById('selected-count');
        
        if (count > 0) {
            counter.style.display = 'block';
            countSpan.textContent = count;
        } else {
            counter.style.display = 'none';
        }
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateProgressBar();
            this.updateStepIndicator();
        }
    }

    prevStep() {
        this.currentStep--;
        this.showStep(this.currentStep);
        this.updateProgressBar();
        this.updateStepIndicator();
    }

    showStep(step) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(stepElement => {
            stepElement.classList.remove('active');
        });
        
        // Show current step
        const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
    }

    updateProgressBar() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }

    updateStepIndicator() {
        document.querySelectorAll('.step-dot').forEach((dot, index) => {
            const stepNumber = index + 1;
            if (stepNumber <= this.currentStep) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    validateCurrentStep() {
        this.hideError();
        
        switch(this.currentStep) {
            case 1:
                if (!this.formData.projectType) {
                    this.showError('Please select a project type.');
                    return false;
                }
                break;
            case 2:
                // Features are optional, so always valid
                break;
            case 3:
                if (!this.formData.description || !this.formData.timeline || !this.formData.budgetRange) {
                    this.showError('Please fill in all required fields.');
                    return false;
                }
                break;
            case 4:
                if (!this.formData.name || !this.formData.email) {
                    this.showError('Please provide your name and email address.');
                    return false;
                }
                break;
        }
        
        return true;
    }

    showError(message) {
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    hideError() {
        const errorElement = document.getElementById('error-message');
        errorElement.style.display = 'none';
    }

    async submitForm() {
        if (!this.validateCurrentStep()) {
            return;
        }

        // Collect final form data
        this.collectFormData();
        
        // Show loading
        this.showLoading();
        
        try {
            // Generate quote using AI
            const quote = await this.generateQuote();
            
            // Hide loading and show results
            this.hideLoading();
            this.showResults(quote);
            
        } catch (error) {
            console.error('Error generating quote:', error);
            this.hideLoading();
            this.showError('Sorry, there was an error generating your quote. Please try again or contact us directly.');
        }
    }

    collectFormData() {
        // Collect any remaining form data
        const formElements = document.querySelectorAll('#quote-form input, #quote-form select, #quote-form textarea');
        formElements.forEach(element => {
            if (element.type === 'checkbox') {
                if (!this.formData[element.name]) {
                    this.formData[element.name] = [];
                }
                if (element.checked && !this.formData[element.name].includes(element.value)) {
                    this.formData[element.name].push(element.value);
                }
            } else if (element.type === 'radio') {
                if (element.checked) {
                    this.formData[element.name] = element.value;
                }
            } else {
                this.formData[element.name] = element.value;
            }
        });
    }

    async generateQuote() {
        const prompt = this.buildPrompt();
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/generate-quote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formData: this.formData,
                    prompt: prompt
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate quote');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('API Error:', error);
            // Fallback to local calculation if API fails
            return this.generateLocalQuote();
        }
    }

    buildPrompt() {
        const features = this.formData.features ? this.formData.features.join(', ') : 'basic functionality';
        
        return `Generate a detailed project quote for a ${this.formData.projectType} website with the following requirements:

Project Description: ${this.formData.description}
Required Features: ${features}
Timeline: ${this.formData.timeline}
Budget Range: ${this.formData.budgetRange}

Please provide:
1. A detailed cost breakdown with line items
2. A realistic timeline with milestones
3. Suggested additional features that would benefit this project
4. Potential challenges or considerations
5. Technology recommendations

Format the response as a comprehensive quote that demonstrates professional expertise and value.`;
    }

    generateLocalQuote() {
        // Fallback local quote generation with South African Rand pricing
        const baseCosts = {
            business: 25000,      // ~$1,500 USD
            ecommerce: 65000,     // ~$4,000 USD  
            portfolio: 20000,     // ~$1,200 USD
            blog: 16000,          // ~$1,000 USD
            restaurant: 35000,    // ~$2,200 USD
            custom: 50000         // ~$3,000 USD
        };

        const featureCosts = {
            responsive: 0,        // included in base
            cms: 10000,          // ~$600 USD
            seo: 6500,           // ~$400 USD
            analytics: 4000,     // ~$250 USD
            contact: 3200,       // ~$200 USD
            social: 5000,        // ~$300 USD
            ecommerce: 40000,    // ~$2,500 USD
            booking: 16000,      // ~$1,000 USD
            membership: 24000,   // ~$1,500 USD
            multilingual: 12000  // ~$750 USD
        };

        const basePrice = baseCosts[this.formData.projectType] || 40000;
        let totalPrice = basePrice;

        // Add feature costs
        if (this.formData.features) {
            this.formData.features.forEach(feature => {
                totalPrice += featureCosts[feature] || 0;
            });
        }

        // Timeline adjustments
        const timelineMultipliers = {
            rush: 1.6,     // 60% premium for rush jobs
            standard: 1.0,  // standard pricing
            relaxed: 0.9,   // 10% discount for flexible timeline
            flexible: 0.85  // 15% discount for very flexible
        };

        totalPrice *= timelineMultipliers[this.formData.timeline] || 1.0;

        // Budget range validation and adjustment
        const budgetAdjustments = {
            small: { min: 8000, max: 25000, multiplier: 0.8 },
            medium: { min: 25000, max: 80000, multiplier: 1.0 },
            large: { min: 80000, max: 250000, multiplier: 1.2 },
            enterprise: { min: 250000, max: 800000, multiplier: 1.5 }
        };

        if (this.formData.budgetRange && budgetAdjustments[this.formData.budgetRange]) {
            const budget = budgetAdjustments[this.formData.budgetRange];
            totalPrice = Math.max(Math.min(totalPrice * budget.multiplier, budget.max), budget.min);
        }

        const timeline = this.calculateTimeline();
        const features = this.generateFeatureList();
        const suggestions = this.generateSuggestions();

        return {
            success: true,
            quote: {
                totalCost: Math.round(totalPrice),
                breakdown: this.generateCostBreakdown(totalPrice),
                timeline: timeline,
                features: features,
                suggestions: suggestions,
                projectType: this.formData.projectType
            }
        };
    }

    calculateTimeline() {
        const baseTimelines = {
            business: 14,
            ecommerce: 28,
            portfolio: 10,
            blog: 12,
            restaurant: 16,
            custom: 21
        };

        let baseDays = baseTimelines[this.formData.projectType] || 14;
        
        // Add time for features
        if (this.formData.features) {
            this.formData.features.forEach(feature => {
                const featureDays = {
                    cms: 3,
                    seo: 2,
                    analytics: 1,
                    contact: 1,
                    social: 2,
                    ecommerce: 10,
                    booking: 5,
                    membership: 7
                };
                baseDays += featureDays[feature] || 0;
            });
        }

        // Adjust for timeline preference
        if (this.formData.timeline === 'rush') {
            baseDays = Math.ceil(baseDays * 0.7); // Compress timeline
        } else if (this.formData.timeline === 'relaxed') {
            baseDays = Math.ceil(baseDays * 1.3); // Extend timeline
        }

        return this.generateTimelineSteps(baseDays);
    }

    generateTimelineSteps(totalDays) {
        const steps = [
            { phase: 'Planning & Design', days: Math.ceil(totalDays * 0.3), icon: 'fas fa-pencil-ruler' },
            { phase: 'Development', days: Math.ceil(totalDays * 0.5), icon: 'fas fa-code' },
            { phase: 'Testing & Launch', days: Math.ceil(totalDays * 0.2), icon: 'fas fa-rocket' }
        ];

        let currentDay = 0;
        return steps.map(step => {
            const start = currentDay + 1;
            currentDay += step.days;
            return {
                ...step,
                startDay: start,
                endDay: currentDay,
                description: this.getPhaseDescription(step.phase)
            };
        });
    }

    getPhaseDescription(phase) {
        const descriptions = {
            'Planning & Design': 'Wireframes, mockups, and project planning',
            'Development': 'Coding, feature implementation, and content integration',
            'Testing & Launch': 'Quality assurance, final testing, and deployment'
        };
        return descriptions[phase] || '';
    }

    generateFeatureList() {
        const allFeatures = {
            responsive: 'Mobile-responsive design',
            cms: 'Content management system',
            seo: 'Search engine optimization',
            analytics: 'Analytics integration',
            contact: 'Contact forms',
            social: 'Social media integration',
            ecommerce: 'E-commerce functionality',
            booking: 'Booking system',
            membership: 'User accounts and membership'
        };

        const includedFeatures = ['responsive']; // Always included
        
        if (this.formData.features) {
            includedFeatures.push(...this.formData.features);
        }

        return [...new Set(includedFeatures)].map(feature => allFeatures[feature] || feature);
    }

    generateSuggestions() {
        const suggestions = {
            business: [
                'Professional photography for better visual appeal',
                'Blog section for SEO and thought leadership',
                'Client testimonials and case studies',
                'Live chat integration for customer support'
            ],
            ecommerce: [
                'Product review system',
                'Abandoned cart email automation',
                'Inventory management system',
                'Multiple payment gateway options'
            ],
            portfolio: [
                'Before/after project showcases',
                'Client testimonial videos',
                'Downloadable portfolio PDF',
                'Project case study pages'
            ],
            blog: [
                'Newsletter subscription system',
                'Comment system and community features',
                'Social sharing optimization',
                'Related posts recommendations'
            ],
            restaurant: [
                'Online ordering system',
                'Table reservation system',
                'Digital menu with dietary filters',
                'Customer loyalty program'
            ]
        };

        return suggestions[this.formData.projectType] || [
            'SSL certificate for security',
            'Regular backups and maintenance',
            'Performance optimization',
            'Social media integration'
        ];
    }

    generateCostBreakdown(totalCost) {
        const breakdown = [
            { item: 'Design & Planning', cost: Math.round(totalCost * 0.25) },
            { item: 'Development', cost: Math.round(totalCost * 0.45) },
            { item: 'Content Integration', cost: Math.round(totalCost * 0.15) },
            { item: 'Testing & Launch', cost: Math.round(totalCost * 0.10) },
            { item: 'Project Management', cost: Math.round(totalCost * 0.05) }
        ];

        // Adjust last item to match total exactly
        const calculatedTotal = breakdown.reduce((sum, item) => sum + item.cost, 0);
        if (calculatedTotal !== totalCost) {
            breakdown[breakdown.length - 1].cost += (totalCost - calculatedTotal);
        }

        return breakdown;
    }

    showLoading() {
        document.querySelector('.quote-form-section').style.display = 'none';
        document.getElementById('loading-section').style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loading-section').style.display = 'none';
    }

    showResults(quoteData) {
        const resultsSection = document.getElementById('results-section');
        const resultsGrid = document.getElementById('results-grid');
        
        if (quoteData.success) {
            const quote = quoteData.quote;
            
            resultsGrid.innerHTML = `
                <!-- Cost Breakdown Card -->
                <div class="result-card">
                    <h3><i class="fas fa-calculator"></i> Cost Breakdown</h3>
                    <div class="cost-breakdown">
                        ${quote.breakdown.map(item => `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>${item.item}</span>
                                <span style="font-weight: 600;">$${item.cost.toLocaleString()}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="total-cost">
                        Total: $${quote.totalCost.toLocaleString()}
                    </div>
                    <p style="color: var(--text); font-size: 0.9rem; text-align: center; margin-top: 1rem;">
                        *Price may vary based on specific requirements
                    </p>
                </div>

                <!-- Timeline Card -->
                <div class="result-card">
                    <h3><i class="fas fa-clock"></i> Project Timeline</h3>
                    <div style="margin: 1rem 0;">
                        ${quote.timeline.map(phase => `
                            <div class="timeline-item">
                                <div class="timeline-icon">
                                    <i class="${phase.icon}"></i>
                                </div>
                                <div>
                                    <h4 style="color: var(--text-light); margin-bottom: 0.3rem;">${phase.phase}</h4>
                                    <p style="color: var(--text); font-size: 0.9rem;">${phase.description}</p>
                                    <p style="color: var(--sidebar-accent); font-size: 0.8rem; font-weight: 600;">
                                        Days ${phase.startDay}-${phase.endDay} (${phase.days} days)
                                    </p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="background: rgba(56, 189, 248, 0.1); padding: 1rem; border-radius: 8px; text-align: center;">
                        <strong style="color: var(--sidebar-accent);">
                            Total Duration: ${quote.timeline.reduce((sum, phase) => sum + phase.days, 0)} days
                        </strong>
                    </div>
                </div>

                <!-- Features Card -->
                <div class="result-card">
                    <h3><i class="fas fa-check-circle"></i> Included Features</h3>
                    <ul class="feature-list">
                        ${quote.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(16, 185, 129, 0.1); border-radius: 8px;">
                        <h4 style="color: var(--success); margin-bottom: 0.5rem;">
                            <i class="fas fa-gift"></i> Bonus Inclusions
                        </h4>
                        <ul style="list-style: none; margin: 0; color: var(--text);">
                            <li style="padding: 0.2rem 0;"><i class="fas fa-check" style="color: var(--success); margin-right: 0.5rem;"></i>30 days free support</li>
                            <li style="padding: 0.2rem 0;"><i class="fas fa-check" style="color: var(--success); margin-right: 0.5rem;"></i>Training documentation</li>
                            <li style="padding: 0.2rem 0;"><i class="fas fa-check" style="color: var(--success); margin-right: 0.5rem;"></i>Performance optimization</li>
                        </ul>
                    </div>
                </div>

                <!-- Suggestions Card -->
                <div class="result-card">
                    <h3><i class="fas fa-lightbulb"></i> Recommended Additions</h3>
                    <p style="color: var(--text); margin-bottom: 1rem;">
                        Based on your project type, we suggest considering these enhancements:
                    </p>
                    <ul class="feature-list">
                        ${quote.suggestions.map(suggestion => `
                            <li style="color: var(--text);">
                                <i class="fas fa-plus-circle" style="color: var(--warning); margin-right: 0.5rem;"></i>
                                ${suggestion}
                            </li>
                        `).join('')}
                    </ul>
                    <div style="margin-top: 1rem; padding: 1rem; background: rgba(245, 158, 11, 0.1); border-radius: 8px; text-align: center;">
                        <p style="color: var(--warning); font-weight: 600; margin: 0;">
                            💡 These additions can be discussed during your consultation
                        </p>
                    </div>
                </div>
            `;
            
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth' });
            
            // Store quote data for later use
            this.currentQuote = quote;
            
        } else {
            this.showError('Failed to generate quote. Please try again.');
        }
    }

    // Booking and sharing functions
    bookConsultation() {
        // Create a consultation booking URL with pre-filled data
        const params = new URLSearchParams({
            source: 'quote-estimator',
            projectType: this.formData.projectType,
            estimatedCost: this.currentQuote ? this.currentQuote.totalCost : '',
            name: this.formData.name,
            email: this.formData.email,
            phone: this.formData.phone || ''
        });
        
        window.open(`contact.html?${params.toString()}`, '_blank');
    }

    downloadQuote() {
        if (!this.currentQuote) return;
        
        // Generate a detailed quote document
        const quoteText = this.generateQuoteText();
        const blob = new Blob([quoteText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `website-quote-${this.formData.name?.replace(/\s+/g, '-') || 'project'}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    shareQuote() {
        if (navigator.share && this.currentQuote) {
            navigator.share({
                title: 'Website Development Quote - ShadEl Web',
                text: `Check out my website development quote: $${this.currentQuote.totalCost.toLocaleString()} for a ${this.formData.projectType} website`,
                url: window.location.href
            });
        } else {
            // Fallback: Copy to clipboard
            const shareText = `Website Development Quote from ShadEl Web\nProject: ${this.formData.projectType}\nEstimated Cost: $${this.currentQuote.totalCost.toLocaleString()}\nGet your quote: ${window.location.href}`;
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Quote details copied to clipboard!');
            });
        }
    }

    generateQuoteText() {
        if (!this.currentQuote) return '';
        
        const quote = this.currentQuote;
        const date = new Date().toLocaleDateString();
        
        return `
WEBSITE DEVELOPMENT QUOTE
ShadEl Web Agency
Date: ${date}

CLIENT INFORMATION:
Name: ${this.formData.name}
Email: ${this.formData.email}
Phone: ${this.formData.phone || 'Not provided'}
Company: ${this.formData.company || 'Not provided'}

PROJECT DETAILS:
Type: ${this.formData.projectType.charAt(0).toUpperCase() + this.formData.projectType.slice(1)} Website
Description: ${this.formData.description}
Timeline Preference: ${this.formData.timeline}
Budget Range: ${this.formData.budgetRange}

COST BREAKDOWN:
${quote.breakdown.map(item => `${item.item}: $${item.cost.toLocaleString()}`).join('\n')}

TOTAL PROJECT COST: $${quote.totalCost.toLocaleString()}

INCLUDED FEATURES:
${quote.features.map(feature => `• ${feature}`).join('\n')}

PROJECT TIMELINE:
${quote.timeline.map(phase => `${phase.phase}: ${phase.days} days (${phase.description})`).join('\n')}

RECOMMENDED ADDITIONS:
${quote.suggestions.map(suggestion => `• ${suggestion}`).join('\n')}

NEXT STEPS:
1. Book a free consultation to discuss details
2. Finalize project scope and requirements
3. Sign contract and begin development
4. Enjoy your new professional website!

Contact us to get started:
Email: info@shadelweb.com
Phone: (555) 123-4567
Website: ${window.location.origin}

This quote is valid for 30 days.
        `;
    }
}

// Global functions for navigation
function nextStep() {
    window.quoteEstimator.nextStep();
}

function prevStep() {
    window.quoteEstimator.prevStep();
}

function bookConsultation() {
    window.quoteEstimator.bookConsultation();
}

function downloadQuote() {
    window.quoteEstimator.downloadQuote();
}

function shareQuote() {
    window.quoteEstimator.shareQuote();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quoteEstimator = new SmartQuoteEstimator();
});
