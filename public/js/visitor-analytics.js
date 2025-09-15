/**
 * Advanced Visitor Tracking and Analytics System
 * Provides detailed visitor insights and behavior tracking
 */

class VisitorAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.visitorId = this.getOrCreateVisitorId();
    this.init();
  }

  init() {
    this.startSession();
    this.trackPageView();
    this.setupEventListeners();
    this.detectDeviceAndBrowser();
    this.trackReferrer();
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get or create persistent visitor ID
   */
  getOrCreateVisitorId() {
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('visitorId', visitorId);
    }
    return visitorId;
  }

  /**
   * Start tracking session
   */
  startSession() {
    const sessionData = {
      sessionId: this.sessionId,
      visitorId: this.visitorId,
      startTime: Date.now(),
      pageViews: 0,
      events: [],
      referrer: document.referrer || 'direct',
      landingPage: window.location.pathname + window.location.search
    };

    sessionStorage.setItem('currentSession', JSON.stringify(sessionData));
    this.updateVisitorProfile();
  }

  /**
   * Track page view
   */
  trackPageView() {
    const session = this.getCurrentSession();
    if (session) {
      session.pageViews++;
      session.events.push({
        type: 'page_view',
        timestamp: Date.now(),
        page: window.location.pathname,
        url: window.location.href
      });
      sessionStorage.setItem('currentSession', JSON.stringify(session));
    }

    // Track in visitor history
    this.addToVisitorHistory('page_view', {
      page: window.location.pathname,
      url: window.location.href,
      title: document.title
    });
  }

  /**
   * Setup event listeners for user interactions
   */
  setupEventListeners() {
    // Track clicks on important elements
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a, button, .cta, .hero-cta-btn, .btn');
      if (target) {
        this.trackEvent('click', {
          element: target.tagName.toLowerCase(),
          text: target.textContent?.trim().substring(0, 50),
          href: target.href || null,
          className: target.className,
          id: target.id
        });
      }
    });

    // Track form interactions
    document.addEventListener('submit', (e) => {
      this.trackEvent('form_submit', {
        formId: e.target.id,
        formAction: e.target.action,
        formMethod: e.target.method
      });
    });

    // Track scroll depth
    this.setupScrollTracking();

    // Track time on page
    this.setupTimeTracking();

    // Track clicks on specific elements
    this.setupSpecificElementTracking();
  }

  /**
   * Setup scroll depth tracking
   */
  setupScrollTracking() {
    let maxScroll = 0;
    let scrollMilestones = [25, 50, 75, 90, 100];
    let trackedMilestones = new Set();

    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
      }

      // Track milestone scrolls
      scrollMilestones.forEach(milestone => {
        if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
          trackedMilestones.add(milestone);
          this.trackEvent('scroll_milestone', {
            milestone: milestone,
            timestamp: Date.now()
          });
        }
      });
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          trackScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /**
   * Setup time tracking
   */
  setupTimeTracking() {
    const startTime = Date.now();
    const timeIntervals = [10, 30, 60, 120, 300]; // seconds
    const trackedIntervals = new Set();

    setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      
      timeIntervals.forEach(interval => {
        if (timeSpent >= interval && !trackedIntervals.has(interval)) {
          trackedIntervals.add(interval);
          this.trackEvent('time_milestone', {
            seconds: interval,
            timestamp: Date.now()
          });
        }
      });
    }, 5000); // Check every 5 seconds

    // Track when user leaves
    window.addEventListener('beforeunload', () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      this.trackEvent('page_exit', {
        timeSpent: timeSpent,
        timestamp: Date.now()
      });
    });
  }

  /**
   * Track specific element interactions
   */
  setupSpecificElementTracking() {
    // Track chatbot interactions
    const chatbotBtn = document.querySelector('.chatbot-btn');
    if (chatbotBtn) {
      chatbotBtn.addEventListener('click', () => {
        this.trackEvent('chatbot_open', { timestamp: Date.now() });
      });
    }

    // Track quote estimator clicks
    const quoteButtons = document.querySelectorAll('a[href*="quote-estimator"]');
    quoteButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.trackEvent('quote_estimator_click', {
          buttonText: btn.textContent?.trim(),
          location: this.getElementLocation(btn)
        });
      });
    });

    // Track service interest
    const serviceCards = document.querySelectorAll('.service-card, .service');
    serviceCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        this.trackEvent('service_interest', {
          serviceIndex: index,
          serviceName: card.querySelector('h3')?.textContent?.trim()
        });
      });
    });

    // Track portfolio views
    const portfolioLinks = document.querySelectorAll('a[href*="portfolio"]');
    portfolioLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.trackEvent('portfolio_click', { timestamp: Date.now() });
      });
    });
  }

  /**
   * Get element location on page
   */
  getElementLocation(element) {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      section: this.getElementSection(element)
    };
  }

  /**
   * Get the section an element belongs to
   */
  getElementSection(element) {
    const sections = ['hero', 'services', 'features', 'testimonials', 'portfolio', 'cta'];
    let currentSection = 'unknown';
    
    let parent = element;
    while (parent && parent !== document.body) {
      const className = parent.className || '';
      const id = parent.id || '';
      
      for (const section of sections) {
        if (className.includes(section) || id.includes(section)) {
          currentSection = section;
          break;
        }
      }
      
      if (currentSection !== 'unknown') break;
      parent = parent.parentElement;
    }
    
    return currentSection;
  }

  /**
   * Detect device and browser information
   */
  detectDeviceAndBrowser() {
    const userAgent = navigator.userAgent;
    const deviceInfo = {
      isMobile: /Mobile|Android|iPhone|iPad/.test(userAgent),
      isTablet: /iPad|Android(?!.*Mobile)/.test(userAgent),
      isDesktop: !/Mobile|Android|iPhone|iPad/.test(userAgent),
      browser: this.getBrowserName(userAgent),
      os: this.getOSName(userAgent),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    this.trackEvent('device_info', deviceInfo);
    localStorage.setItem('deviceInfo', JSON.stringify(deviceInfo));
  }

  /**
   * Get browser name from user agent
   */
  getBrowserName(userAgent) {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown';
  }

  /**
   * Get OS name from user agent
   */
  getOSName(userAgent) {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  /**
   * Track referrer information
   */
  trackReferrer() {
    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    
    const referrerInfo = {
      referrer: referrer || 'direct',
      isSearch: this.isSearchEngine(referrer),
      isSocial: this.isSocialMedia(referrer),
      campaign: urlParams.get('campaign') || urlParams.get('utm_campaign'),
      source: urlParams.get('source') || urlParams.get('utm_source'),
      medium: urlParams.get('medium') || urlParams.get('utm_medium'),
      searchQuery: this.extractSearchQuery(referrer)
    };

    this.trackEvent('referrer_info', referrerInfo);
    localStorage.setItem('referrerInfo', JSON.stringify(referrerInfo));
  }

  /**
   * Check if referrer is a search engine
   */
  isSearchEngine(referrer) {
    const searchEngines = ['google', 'bing', 'yahoo', 'duckduckgo', 'baidu'];
    return searchEngines.some(engine => referrer.includes(engine));
  }

  /**
   * Check if referrer is social media
   */
  isSocialMedia(referrer) {
    const socialSites = ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'tiktok'];
    return socialSites.some(site => referrer.includes(site));
  }

  /**
   * Extract search query from referrer
   */
  extractSearchQuery(referrer) {
    try {
      const url = new URL(referrer);
      return url.searchParams.get('q') || url.searchParams.get('query') || null;
    } catch {
      return null;
    }
  }

  /**
   * Track custom event
   */
  trackEvent(eventType, data = {}) {
    const event = {
      type: eventType,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      visitorId: this.visitorId,
      page: window.location.pathname,
      data: data
    };

    // Add to current session
    const session = this.getCurrentSession();
    if (session) {
      session.events.push(event);
      sessionStorage.setItem('currentSession', JSON.stringify(session));
    }

    // Add to visitor history
    this.addToVisitorHistory(eventType, data);

    // Log for debugging
    console.log('Analytics Event:', event);
  }

  /**
   * Get current session data
   */
  getCurrentSession() {
    const sessionData = sessionStorage.getItem('currentSession');
    return sessionData ? JSON.parse(sessionData) : null;
  }

  /**
   * Add event to visitor history
   */
  addToVisitorHistory(eventType, data) {
    const history = JSON.parse(localStorage.getItem('visitorHistory') || '[]');
    const event = {
      type: eventType,
      timestamp: Date.now(),
      visitorId: this.visitorId,
      sessionId: this.sessionId,
      data: data
    };

    history.push(event);

    // Keep only last 1000 events
    if (history.length > 1000) {
      history.splice(0, history.length - 1000);
    }

    localStorage.setItem('visitorHistory', JSON.stringify(history));
  }

  /**
   * Update visitor profile
   */
  updateVisitorProfile() {
    const profile = JSON.parse(localStorage.getItem('visitorProfile') || '{}');
    
    // Update visit count
    profile.totalVisits = (profile.totalVisits || 0) + 1;
    profile.lastVisit = Date.now();
    
    // Update first visit if new visitor
    if (!profile.firstVisit) {
      profile.firstVisit = Date.now();
    }

    // Update visit frequency
    if (profile.lastVisit && profile.firstVisit) {
      const daysSinceFirst = (Date.now() - profile.firstVisit) / (1000 * 60 * 60 * 24);
      profile.visitFrequency = profile.totalVisits / Math.max(daysSinceFirst, 1);
    }

    localStorage.setItem('visitorProfile', JSON.stringify(profile));
  }

  /**
   * Get visitor insights for dynamic content
   */
  getVisitorInsights() {
    const profile = JSON.parse(localStorage.getItem('visitorProfile') || '{}');
    const deviceInfo = JSON.parse(localStorage.getItem('deviceInfo') || '{}');
    const referrerInfo = JSON.parse(localStorage.getItem('referrerInfo') || '{}');
    const history = JSON.parse(localStorage.getItem('visitorHistory') || '[]');

    return {
      profile,
      deviceInfo,
      referrerInfo,
      recentEvents: history.slice(-20), // Last 20 events
      totalEvents: history.length,
      isReturning: profile.totalVisits > 1,
      isFrequentVisitor: profile.visitFrequency > 0.1, // More than once per 10 days
      hasHighEngagement: this.calculateEngagementScore() > 0.7
    };
  }

  /**
   * Calculate engagement score
   */
  calculateEngagementScore() {
    const history = JSON.parse(localStorage.getItem('visitorHistory') || '[]');
    const recentEvents = history.slice(-50); // Last 50 events
    
    let score = 0;
    const weights = {
      'page_view': 0.1,
      'click': 0.2,
      'form_submit': 0.5,
      'quote_estimator_click': 0.4,
      'chatbot_open': 0.3,
      'scroll_milestone': 0.1,
      'time_milestone': 0.2
    };

    recentEvents.forEach(event => {
      score += weights[event.type] || 0.05;
    });

    return Math.min(score / 10, 1); // Normalize to 0-1
  }

  /**
   * Send analytics data to server (when available)
   */
  sendAnalyticsData() {
    const session = this.getCurrentSession();
    const insights = this.getVisitorInsights();
    
    const analyticsData = {
      session,
      insights,
      timestamp: Date.now()
    };

    // For now, just log the data
    // In production, send to your analytics endpoint
    console.log('Analytics Data:', analyticsData);
    
    // Example: fetch('/api/analytics', { method: 'POST', body: JSON.stringify(analyticsData) });
  }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.visitorAnalytics = new VisitorAnalytics();
  
  // Send analytics data periodically
  setInterval(() => {
    if (window.visitorAnalytics) {
      window.visitorAnalytics.sendAnalyticsData();
    }
  }, 60000); // Every minute
});

// Export for external use
window.VisitorAnalytics = VisitorAnalytics;
