/**
 * Dynamic Homepage Adaptation System
 * Adapts content based on visitor type and behavior
 */

class DynamicHomepage {
  constructor() {
    this.visitorData = this.getVisitorData();
    this.init();
  }

  init() {
    this.detectVisitorType();
    this.adaptContent();
    this.trackVisitor();
  }

  /**
   * Detect visitor type based on various factors
   */
  detectVisitorType() {
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = document.referrer;
    const visitCount = this.getVisitCount();
    const lastVisit = this.getLastVisit();
    
    // Check for LinkedIn traffic
    if (referrer.includes('linkedin.com') || urlParams.get('source') === 'linkedin') {
      this.visitorData.type = 'linkedin-prospect';
      this.visitorData.source = 'LinkedIn';
    }
    // Check for returning visitor
    else if (visitCount > 1 && lastVisit) {
      this.visitorData.type = 'returning-visitor';
      this.visitorData.visitCount = visitCount;
    }
    // First-time visitor
    else {
      this.visitorData.type = 'first-time-visitor';
    }

    // Check for specific campaign parameters
    const campaign = urlParams.get('campaign');
    if (campaign) {
      this.visitorData.campaign = campaign;
    }

    // Store visitor type
    localStorage.setItem('visitorType', this.visitorData.type);
    localStorage.setItem('visitorData', JSON.stringify(this.visitorData));
  }

  /**
   * Adapt content based on visitor type
   */
  adaptContent() {
    switch (this.visitorData.type) {
      case 'first-time-visitor':
        this.showFirstTimeVisitorContent();
        break;
      case 'returning-visitor':
        this.showReturningVisitorContent();
        break;
      case 'linkedin-prospect':
        this.showLinkedInProspectContent();
        break;
      default:
        this.showDefaultContent();
    }
  }

  /**
   * Content for first-time visitors
   */
  showFirstTimeVisitorContent() {
    // Update hero section
    this.updateHeroSection({
      headline: 'Welcome to Professional Web Development',
      subtext: 'Discover how we create stunning websites that help businesses grow online.',
      ctaText: 'Explore Our Services',
      ctaLink: '#services'
    });

    // Show service introduction
    this.highlightServices();
    
    // Add welcome banner
    this.addWelcomeBanner();
    
    // Track as first-time visitor
    this.trackEvent('first_time_visitor_view');
  }

  /**
   * Content for returning visitors
   */
  showReturningVisitorContent() {
    // Update hero section with personalized message
    this.updateHeroSection({
      headline: 'Welcome Back! Ready for Your Next Project?',
      subtext: 'Check out our latest offers and see how we can help you expand your online presence.',
      ctaText: 'View Current Offers',
      ctaLink: '#offers'
    });

    // Show special offers
    this.showSpecialOffers();
    
    // Add returning visitor banner
    this.addReturningVisitorBanner();
    
    // Track returning visitor
    this.trackEvent('returning_visitor_view', { visitCount: this.visitorData.visitCount });
  }

  /**
   * Content for LinkedIn prospects
   */
  showLinkedInProspectContent() {
    // Update hero section with business-focused content
    this.updateHeroSection({
      headline: 'Professional Web Solutions for Growing Businesses',
      subtext: 'Transform your business with enterprise-grade websites that drive results and ROI.',
      ctaText: 'Schedule Business Consultation',
      ctaLink: 'contact.html?type=business'
    });

    // Show business-focused services
    this.showBusinessServices();
    
    // Add LinkedIn prospect banner
    this.addLinkedInBanner();
    
    // Track LinkedIn prospect
    this.trackEvent('linkedin_prospect_view');
  }

  /**
   * Update hero section content
   */
  updateHeroSection({ headline, subtext, ctaText, ctaLink }) {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const heroHeadline = heroSection.querySelector('h2');
    const heroSubtext = heroSection.querySelector('p');
    const heroCTA = heroSection.querySelector('.hero-cta-btn');

    if (heroHeadline) {
      heroHeadline.innerHTML = headline;
      heroHeadline.classList.add('dynamic-content');
    }

    if (heroSubtext) {
      heroSubtext.innerHTML = subtext;
      heroSubtext.classList.add('dynamic-content');
    }

    if (heroCTA && ctaText) {
      heroCTA.innerHTML = `<i class="fas fa-arrow-right"></i> ${ctaText}`;
      heroCTA.href = ctaLink;
      heroCTA.classList.add('dynamic-content');
    }
  }

  /**
   * Add welcome banner for first-time visitors
   */
  addWelcomeBanner() {
    const banner = this.createBanner({
      type: 'welcome',
      icon: 'fas fa-hand-wave',
      title: 'Welcome to ShadEl Web!',
      message: 'New here? Get 20% off your first project. Let us show you what we can do.',
      ctaText: 'Claim Welcome Offer',
      ctaLink: 'quote-estimator.html?discount=welcome20',
      bgColor: '#10b981'
    });
    
    this.insertBanner(banner);
  }

  /**
   * Add returning visitor banner
   */
  addReturningVisitorBanner() {
    const lastVisit = this.getLastVisit();
    const daysSinceLastVisit = lastVisit ? Math.floor((Date.now() - lastVisit) / (1000 * 60 * 60 * 24)) : 0;
    
    let message = 'Great to see you again! ';
    if (daysSinceLastVisit > 30) {
      message += 'It\'s been a while - check out our new features and services.';
    } else if (daysSinceLastVisit > 7) {
      message += 'Ready to start that project we discussed?';
    } else {
      message += 'Still thinking it over? We have new offers available.';
    }

    const banner = this.createBanner({
      type: 'returning',
      icon: 'fas fa-star',
      title: 'Welcome Back!',
      message: message,
      ctaText: 'View Special Offers',
      ctaLink: '#offers',
      bgColor: '#667eea'
    });
    
    this.insertBanner(banner);
  }

  /**
   * Add LinkedIn prospect banner
   */
  addLinkedInBanner() {
    const banner = this.createBanner({
      type: 'linkedin',
      icon: 'fab fa-linkedin',
      title: 'LinkedIn Exclusive Offer',
      message: 'Professional websites for business growth. Schedule a consultation and get enterprise features at startup prices.',
      ctaText: 'Schedule Business Call',
      ctaLink: 'contact.html?source=linkedin&type=business',
      bgColor: '#0077b5'
    });
    
    this.insertBanner(banner);
  }

  /**
   * Create a dynamic banner
   */
  createBanner({ type, icon, title, message, ctaText, ctaLink, bgColor }) {
    const banner = document.createElement('div');
    banner.className = `dynamic-banner dynamic-banner-${type}`;
    banner.style.cssText = `
      background: linear-gradient(135deg, ${bgColor}, ${this.adjustColor(bgColor, -20)});
      color: white;
      padding: 1rem 2rem;
      margin: 1rem 0;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      animation: slideInFromTop 0.5s ease-out;
      position: relative;
      overflow: hidden;
    `;

    banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem; flex: 1;">
        <i class="${icon}" style="font-size: 1.5rem; color: rgba(255,255,255,0.9);"></i>
        <div>
          <h3 style="margin: 0; font-size: 1.1rem; font-weight: 600;">${title}</h3>
          <p style="margin: 0.2rem 0 0 0; font-size: 0.9rem; opacity: 0.9;">${message}</p>
        </div>
      </div>
      <a href="${ctaLink}" class="banner-cta" style="
        background: rgba(255,255,255,0.2);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        text-decoration: none;
        font-weight: 600;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        border: 1px solid rgba(255,255,255,0.3);
        backdrop-filter: blur(10px);
      ">${ctaText}</a>
      <button class="banner-close" style="
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        color: rgba(255,255,255,0.7);
        font-size: 1.2rem;
        cursor: pointer;
        transition: color 0.3s ease;
      " onclick="this.parentElement.remove()">×</button>
    `;

    // Add hover effects
    const cta = banner.querySelector('.banner-cta');
    cta.addEventListener('mouseenter', () => {
      cta.style.background = 'rgba(255,255,255,0.3)';
      cta.style.transform = 'translateY(-1px)';
    });
    cta.addEventListener('mouseleave', () => {
      cta.style.background = 'rgba(255,255,255,0.2)';
      cta.style.transform = 'translateY(0)';
    });

    const closeBtn = banner.querySelector('.banner-close');
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.color = 'white';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.color = 'rgba(255,255,255,0.7)';
    });

    return banner;
  }

  /**
   * Insert banner into page
   */
  insertBanner(banner) {
    const header = document.querySelector('header.main-header');
    if (header && header.nextElementSibling) {
      header.parentNode.insertBefore(banner, header.nextElementSibling);
    }
  }

  /**
   * Show special offers section
   */
  showSpecialOffers() {
    const offersSection = this.createOffersSection();
    const servicesSection = document.querySelector('#services');
    if (servicesSection) {
      servicesSection.parentNode.insertBefore(offersSection, servicesSection);
    }
  }

  /**
   * Create special offers section
   */
  createOffersSection() {
    const section = document.createElement('section');
    section.id = 'offers';
    section.className = 'special-offers fade-in';
    section.innerHTML = `
      <div class="container">
        <h2 style="text-align: center; color: var(--primary); margin-bottom: 2rem;">
          <i class="fas fa-fire"></i> Special Offers Just for You
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
          <div class="offer-card" style="background: var(--surface-alt); padding: 2rem; border-radius: 15px; border: 2px solid #ff6b6b; position: relative;">
            <div style="position: absolute; top: -10px; right: 20px; background: #ff6b6b; color: white; padding: 0.3rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">LIMITED TIME</div>
            <h3 style="color: var(--text-light); margin-bottom: 1rem;">
              <i class="fas fa-bolt"></i> Quick Turnaround Special
            </h3>
            <p style="color: var(--text); margin-bottom: 1.5rem;">Need your website fast? Get priority development with 50% faster delivery.</p>
            <div style="background: #ff6b6b; color: white; padding: 1rem; border-radius: 10px; text-align: center; margin-bottom: 1rem;">
              <span style="font-size: 1.8rem; font-weight: 700;">+R500</span>
              <div style="font-size: 0.9rem; opacity: 0.9;">Express delivery</div>
            </div>
            <a href="quote-estimator.html?offer=express" style="background: #ff6b6b; color: white; padding: 0.8rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Claim Offer</a>
          </div>
          
          <div class="offer-card" style="background: var(--surface-alt); padding: 2rem; border-radius: 15px; border: 2px solid #10b981; position: relative;">
            <div style="position: absolute; top: -10px; right: 20px; background: #10b981; color: white; padding: 0.3rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">POPULAR</div>
            <h3 style="color: var(--text-light); margin-bottom: 1rem;">
              <i class="fas fa-gift"></i> Bundle & Save
            </h3>
            <p style="color: var(--text); margin-bottom: 1.5rem;">Website + Logo + 3 months maintenance. Everything you need to get started.</p>
            <div style="background: #10b981; color: white; padding: 1rem; border-radius: 10px; text-align: center; margin-bottom: 1rem;">
              <span style="font-size: 1.8rem; font-weight: 700;">30% OFF</span>
              <div style="font-size: 0.9rem; opacity: 0.9;">Complete package</div>
            </div>
            <a href="quote-estimator.html?offer=bundle" style="background: #10b981; color: white; padding: 0.8rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Get Bundle</a>
          </div>
        </div>
      </div>
    `;

    // Add styles
    if (!document.querySelector('#offers-styles')) {
      const styles = document.createElement('style');
      styles.id = 'offers-styles';
      styles.textContent = `
        .special-offers {
          background: var(--surface);
          padding: 3rem 0;
          margin: 2rem 0;
        }
        .offer-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .offer-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(styles);
    }

    return section;
  }

  /**
   * Show business-focused services for LinkedIn prospects
   */
  showBusinessServices() {
    const businessSection = this.createBusinessSection();
    const servicesSection = document.querySelector('#services');
    if (servicesSection) {
      servicesSection.parentNode.insertBefore(businessSection, servicesSection);
    }
  }

  /**
   * Create business-focused section
   */
  createBusinessSection() {
    const section = document.createElement('section');
    section.className = 'business-focus fade-in';
    section.innerHTML = `
      <div class="container">
        <h2 style="text-align: center; color: var(--primary); margin-bottom: 3rem;">
          <i class="fas fa-building"></i> Enterprise Solutions for Growing Businesses
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
          <div style="background: var(--surface-alt); padding: 2rem; border-radius: 15px; text-align: center;">
            <i class="fas fa-chart-line" style="font-size: 2.5rem; color: #10b981; margin-bottom: 1rem;"></i>
            <h3 style="color: var(--text-light); margin-bottom: 1rem;">ROI-Focused Development</h3>
            <p style="color: var(--text);">Websites built to convert visitors into customers and drive measurable business growth.</p>
          </div>
          <div style="background: var(--surface-alt); padding: 2rem; border-radius: 15px; text-align: center;">
            <i class="fas fa-shield-alt" style="font-size: 2.5rem; color: #667eea; margin-bottom: 1rem;"></i>
            <h3 style="color: var(--text-light); margin-bottom: 1rem;">Enterprise Security</h3>
            <p style="color: var(--text);">Advanced security features, SSL certificates, and regular security audits included.</p>
          </div>
          <div style="background: var(--surface-alt); padding: 2rem; border-radius: 15px; text-align: center;">
            <i class="fas fa-cogs" style="font-size: 2.5rem; color: #ff6b6b; margin-bottom: 1rem;"></i>
            <h3 style="color: var(--text-light); margin-bottom: 1rem;">Custom Integrations</h3>
            <p style="color: var(--text);">Seamless integration with your existing business tools and workflows.</p>
          </div>
        </div>
        <div style="text-align: center; background: linear-gradient(135deg, var(--primary), var(--primary-light)); padding: 3rem; border-radius: 20px; color: white;">
          <h3 style="margin-bottom: 1rem; font-size: 1.8rem;">Ready to Scale Your Business Online?</h3>
          <p style="margin-bottom: 2rem; font-size: 1.1rem; opacity: 0.9;">Let's discuss how a professional website can drive your business forward.</p>
          <a href="contact.html?type=business&source=linkedin" style="background: white; color: var(--primary); padding: 1rem 2rem; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 1.1rem; display: inline-flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-calendar-alt"></i>
            Schedule Business Consultation
          </a>
        </div>
      </div>
    `;

    // Add styles for business section
    if (!document.querySelector('#business-styles')) {
      const styles = document.createElement('style');
      styles.id = 'business-styles';
      styles.textContent = `
        .business-focus {
          background: var(--bg);
          padding: 3rem 0;
          margin: 2rem 0;
        }
      `;
      document.head.appendChild(styles);
    }

    return section;
  }

  /**
   * Highlight services for first-time visitors
   */
  highlightServices() {
    const serviceCards = document.querySelectorAll('.service-card, .service');
    serviceCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.animation = 'highlightPulse 2s ease-in-out';
        card.style.border = '2px solid #38bdf8';
        setTimeout(() => {
          card.style.border = '';
          card.style.animation = '';
        }, 2000);
      }, index * 300);
    });

    // Add highlight animation
    if (!document.querySelector('#highlight-styles')) {
      const styles = document.createElement('style');
      styles.id = 'highlight-styles';
      styles.textContent = `
        @keyframes highlightPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(56, 189, 248, 0); }
        }
        .dynamic-content {
          animation: fadeInContent 0.8s ease-out;
        }
        @keyframes fadeInContent {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(styles);
    }
  }

  /**
   * Get visitor data from localStorage
   */
  getVisitorData() {
    const stored = localStorage.getItem('visitorData');
    return stored ? JSON.parse(stored) : {
      type: 'unknown',
      firstVisit: Date.now(),
      source: 'direct'
    };
  }

  /**
   * Get visit count
   */
  getVisitCount() {
    const count = localStorage.getItem('visitCount');
    return count ? parseInt(count) : 0;
  }

  /**
   * Get last visit timestamp
   */
  getLastVisit() {
    const lastVisit = localStorage.getItem('lastVisit');
    return lastVisit ? parseInt(lastVisit) : null;
  }

  /**
   * Track visitor data
   */
  trackVisitor() {
    const visitCount = this.getVisitCount() + 1;
    localStorage.setItem('visitCount', visitCount.toString());
    localStorage.setItem('lastVisit', Date.now().toString());
    
    // Update visitor data
    this.visitorData.visitCount = visitCount;
    this.visitorData.lastVisit = Date.now();
    localStorage.setItem('visitorData', JSON.stringify(this.visitorData));
  }

  /**
   * Track events for analytics
   */
  trackEvent(eventName, data = {}) {
    // Store event data
    const events = JSON.parse(localStorage.getItem('visitorEvents') || '[]');
    events.push({
      event: eventName,
      timestamp: Date.now(),
      data: data,
      visitorType: this.visitorData.type
    });
    
    // Keep only last 50 events
    if (events.length > 50) {
      events.splice(0, events.length - 50);
    }
    
    localStorage.setItem('visitorEvents', JSON.stringify(events));

    // You can send this to your analytics service
    console.log('Event tracked:', eventName, data);
  }

  /**
   * Utility function to adjust color brightness
   */
  adjustColor(color, amount) {
    const usePound = color[0] === '#';
    const col = usePound ? color.slice(1) : color;
    const num = parseInt(col, 16);
    let r = (num >> 16) + amount;
    let g = (num >> 8 & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
  }

  /**
   * Show default content
   */
  showDefaultContent() {
    // Keep existing content as default
    this.trackEvent('default_visitor_view');
  }
}

// Initialize dynamic homepage when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DynamicHomepage();
});

// Export for potential external use
window.DynamicHomepage = DynamicHomepage;
