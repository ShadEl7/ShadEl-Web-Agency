const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here'
});

// Website templates and components
const websiteTemplates = {
  business: {
    layout: 'header-nav-hero-services-about-contact-footer',
    colors: ['#1e293b', '#38bdf8', '#ffffff', '#f8fafc'],
    sections: ['hero', 'services', 'about', 'testimonials', 'contact']
  },
  ecommerce: {
    layout: 'header-nav-hero-featured-products-categories-footer',
    colors: ['#059669', '#10b981', '#ffffff', '#f0fdf4'],
    sections: ['hero', 'featured-products', 'categories', 'reviews', 'cart']
  },
  portfolio: {
    layout: 'header-nav-hero-gallery-about-skills-contact-footer',
    colors: ['#7c3aed', '#a855f7', '#ffffff', '#faf5ff'],
    sections: ['hero', 'gallery', 'about', 'skills', 'contact']
  },
  restaurant: {
    layout: 'header-nav-hero-menu-about-location-footer',
    colors: ['#dc2626', '#ef4444', '#ffffff', '#fef2f2'],
    sections: ['hero', 'menu', 'about', 'location', 'reservations']
  },
  nonprofit: {
    layout: 'header-nav-hero-mission-programs-donate-footer',
    colors: ['#2563eb', '#3b82f6', '#ffffff', '#eff6ff'],
    sections: ['hero', 'mission', 'programs', 'volunteer', 'donate']
  },
  blog: {
    layout: 'header-nav-hero-posts-categories-sidebar-footer',
    colors: ['#374151', '#6b7280', '#ffffff', '#f9fafb'],
    sections: ['hero', 'recent-posts', 'categories', 'about-author', 'newsletter']
  }
};

// AI prompt for generating website suggestions
async function generateWebsiteDesign(description) {
  try {
    const prompt = `
    Based on this website description: "${description}"
    
    Analyze the requirements and generate a JSON response with:
    1. Recommended website type (business, ecommerce, portfolio, restaurant, nonprofit, blog)
    2. Suggested sections/pages
    3. Color scheme (primary, secondary, accent colors)
    4. Key features needed
    5. Content suggestions for each section
    6. Technical requirements
    
    Return a valid JSON object with this structure:
    {
      "websiteType": "business|ecommerce|portfolio|restaurant|nonprofit|blog",
      "siteName": "suggested site name",
      "tagline": "catchy tagline",
      "sections": [
        {
          "name": "section name",
          "title": "section title",
          "content": "suggested content description",
          "features": ["feature1", "feature2"]
        }
      ],
      "colorScheme": {
        "primary": "#hex",
        "secondary": "#hex",
        "accent": "#hex",
        "background": "#hex",
        "text": "#hex"
      },
      "features": ["list of required features"],
      "pages": ["list of pages needed"],
      "technicalRequirements": ["requirements"],
      "contentSuggestions": {
        "hero": "hero section content",
        "about": "about section content"
      }
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a professional web designer and UX expert. Generate practical, modern website designs based on user requirements. Always respond with valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error generating website design:', error);
    
    // Fallback design if API fails
    return generateFallbackDesign(description);
  }
}

// Fallback design generator for when API is not available
function generateFallbackDesign(description) {
  const keywords = description.toLowerCase();
  let websiteType = 'business';
  
  if (keywords.includes('shop') || keywords.includes('store') || keywords.includes('ecommerce') || keywords.includes('sell')) {
    websiteType = 'ecommerce';
  } else if (keywords.includes('portfolio') || keywords.includes('designer') || keywords.includes('artist') || keywords.includes('photography')) {
    websiteType = 'portfolio';
  } else if (keywords.includes('restaurant') || keywords.includes('cafe') || keywords.includes('food') || keywords.includes('bakery')) {
    websiteType = 'restaurant';
  } else if (keywords.includes('nonprofit') || keywords.includes('charity') || keywords.includes('foundation')) {
    websiteType = 'nonprofit';
  } else if (keywords.includes('blog') || keywords.includes('news') || keywords.includes('magazine')) {
    websiteType = 'blog';
  }

  const template = websiteTemplates[websiteType];
  
  return {
    websiteType,
    siteName: extractBusinessName(description) || "Your Business",
    tagline: generateTagline(websiteType),
    sections: generateSections(websiteType),
    colorScheme: {
      primary: template.colors[0],
      secondary: template.colors[1],
      accent: template.colors[1],
      background: template.colors[2],
      text: template.colors[0]
    },
    features: generateFeatures(websiteType),
    pages: generatePages(websiteType),
    technicalRequirements: generateTechRequirements(websiteType),
    contentSuggestions: generateContentSuggestions(websiteType, description)
  };
}

function extractBusinessName(description) {
  const patterns = [
    /for my (.+?) with/i,
    /for (.+?) business/i,
    /(.+?) website/i,
    /(.+?) needs/i
  ];
  
  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

function generateTagline(type) {
  const taglines = {
    business: "Your Success, Our Priority",
    ecommerce: "Shop Smart, Shop With Us",
    portfolio: "Showcasing Excellence",
    restaurant: "Taste the Difference",
    nonprofit: "Making a Difference Together",
    blog: "Stories That Matter"
  };
  return taglines[type];
}

function generateSections(type) {
  const sectionTemplates = {
    business: [
      { name: "hero", title: "Welcome", content: "Compelling hero section with value proposition", features: ["Call-to-action", "Trust indicators"] },
      { name: "services", title: "Our Services", content: "Showcase your key services", features: ["Service cards", "Pricing"] },
      { name: "about", title: "About Us", content: "Your company story and values", features: ["Team photos", "Mission statement"] },
      { name: "contact", title: "Contact", content: "Get in touch section", features: ["Contact form", "Location map"] }
    ],
    ecommerce: [
      { name: "hero", title: "Shop Now", content: "Featured products and promotions", features: ["Product carousel", "Search bar"] },
      { name: "categories", title: "Categories", content: "Product categories", features: ["Category grid", "Filters"] },
      { name: "featured", title: "Featured Products", content: "Best sellers and recommendations", features: ["Product cards", "Reviews"] }
    ],
    // Add more section templates for other types...
  };
  
  return sectionTemplates[type] || sectionTemplates.business;
}

// Client Dashboard Database (In-memory for demo - use real database in production)
const clientsDB = {
  'client_001': {
    id: 'client_001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'demo123', // In production, hash passwords!
    projectId: 'proj_001',
    avatar: 'JD'
  },
  'client_002': {
    id: 'client_002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'demo456',
    projectId: 'proj_002',
    avatar: 'JS'
  }
};

const projectsDB = {
  'proj_001': {
    id: 'proj_001',
    clientId: 'client_001',
    name: 'E-commerce Website Redesign',
    status: 'in-progress',
    progress: 65,
    budget: '$15,000',
    deadline: 'September 15, 2025',
    createdAt: '2025-08-20',
    team: [
      { name: 'Sarah Chen', role: 'Project Manager', email: 'sarah@webagency.com' },
      { name: 'Mike Torres', role: 'Developer', email: 'mike@webagency.com' },
      { name: 'Lisa Wang', role: 'Designer', email: 'lisa@webagency.com' }
    ],
    milestones: [
      { 
        id: 'm1',
        date: '2025-08-20', 
        title: 'Project Kickoff', 
        status: 'completed', 
        description: 'Initial requirements gathering and project planning completed' 
      },
      { 
        id: 'm2',
        date: '2025-08-22', 
        title: 'Design Mockups', 
        status: 'completed', 
        description: 'UI/UX designs approved by client' 
      },
      { 
        id: 'm3',
        date: '2025-08-25', 
        title: 'Development Phase', 
        status: 'in-progress', 
        description: 'Frontend development in progress, backend API implementation underway' 
      },
      { 
        id: 'm4',
        date: '2025-09-01', 
        title: 'Testing Phase', 
        status: 'pending', 
        description: 'Quality assurance and user testing' 
      },
      { 
        id: 'm5',
        date: '2025-09-15', 
        title: 'Launch', 
        status: 'pending', 
        description: 'Final deployment and go-live' 
      }
    ],
    messages: [
      {
        id: 'msg1',
        author: 'Sarah Chen (Project Manager)',
        content: 'Hi John! The shopping cart feature is ready for your review. Please check the staging environment and let us know your feedback.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        type: 'team'
      },
      {
        id: 'msg2',
        author: 'Mike Torres (Developer)',
        content: 'Payment integration is progressing well. We\'ll have Stripe and PayPal options ready by Friday.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        type: 'team'
      }
    ],
    files: [
      {
        id: 'file1',
        name: 'Project Requirements Document.pdf',
        type: 'document',
        uploadDate: '2025-08-20',
        size: '2.3 MB'
      },
      {
        id: 'file2',
        name: 'UI Mockups - Final Version.figma',
        type: 'design',
        uploadDate: '2025-08-22',
        size: '5.1 MB'
      },
      {
        id: 'file3',
        name: 'Staging Environment Link',
        type: 'link',
        uploadDate: '2025-08-25',
        url: 'https://staging.johndoe-ecommerce.com'
      }
    ]
  }
};

const feedbackDB = [];

// Client Dashboard API Routes
app.post('/api/client/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find client by email
    const client = Object.values(clientsDB).find(c => c.email === email);
    
    if (!client || client.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    // In production, use JWT tokens
    const token = `demo_token_${client.id}`;
    
    res.json({
      success: true,
      token,
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        avatar: client.avatar,
        projectId: client.projectId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/client/project/:projectId', (req, res) => {
  try {
    const { projectId } = req.params;
    const project = projectsDB[projectId];
    
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }
    
    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Project fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/client/feedback', (req, res) => {
  try {
    const { projectId, clientId, message } = req.body;
    
    const feedback = {
      id: `feedback_${Date.now()}`,
      projectId,
      clientId,
      message,
      timestamp: new Date(),
      status: 'new'
    };
    
    feedbackDB.push(feedback);
    
    // Add to project messages
    if (projectsDB[projectId]) {
      const client = clientsDB[clientId];
      projectsDB[projectId].messages.unshift({
        id: `msg_${Date.now()}`,
        author: client ? client.name : 'Client',
        content: message,
        timestamp: new Date(),
        type: 'client'
      });
    }
    
    res.json({
      success: true,
      feedback
    });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/client/ai-update', async (req, res) => {
  try {
    const { projectId } = req.body;
    const project = projectsDB[projectId];
    
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }
    
    // Generate AI update using OpenAI
    const aiUpdate = await generateProjectUpdate(project);
    
    res.json({
      success: true,
      update: aiUpdate
    });
  } catch (error) {
    console.error('AI update error:', error);
    
    // Fallback update if API fails
    const fallbackUpdates = [
      "Excellent progress on your website! The responsive design implementation is now 90% complete. Our team has successfully optimized the mobile experience and implemented the new navigation system.",
      "Great news! The database migration has been completed successfully. All your product data has been transferred to the new system with zero data loss.",
      "Security implementation is ahead of schedule! We've integrated SSL certificates, implemented two-factor authentication, and added GDPR compliance features.",
      "Performance optimization complete! Your website now loads 60% faster than before. We've implemented image compression, code minification, and CDN integration.",
      "Content management system setup is finalized! You can now easily update products, blog posts, and pages through the intuitive admin panel."
    ];
    
    const randomUpdate = fallbackUpdates[Math.floor(Math.random() * fallbackUpdates.length)];
    
    res.json({
      success: true,
      update: {
        message: randomUpdate,
        timestamp: new Date(),
        confidence: Math.floor(Math.random() * 20) + 80
      }
    });
  }
});

// Generate AI-powered project updates
async function generateProjectUpdate(project) {
  try {
    const prompt = `
    Generate a personalized project update for a client based on the following project details:
    
    Project: ${project.name}
    Status: ${project.status}
    Progress: ${project.progress}%
    Timeline: ${project.deadline}
    
    Recent milestones:
    ${project.milestones.filter(m => m.status === 'completed').slice(-2).map(m => `- ${m.title}: ${m.description}`).join('\n')}
    
    Current milestone:
    ${project.milestones.find(m => m.status === 'in-progress')?.description || 'Development in progress'}
    
    Generate a brief, encouraging update in plain language that:
    1. Acknowledges recent progress
    2. Mentions specific achievements
    3. Provides next steps
    4. Maintains a positive, professional tone
    5. Is 2-3 sentences long
    
    Respond with just the update text, no additional formatting.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a professional project manager providing client updates. Be encouraging, specific, and professional." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    return {
      message: response.choices[0].message.content.trim(),
      timestamp: new Date(),
      confidence: 95
    };
  } catch (error) {
    throw error;
  }
}

function generateFeatures(type) {
  const featureMap = {
    business: ["Contact forms", "Service pages", "Testimonials", "SEO optimization"],
    ecommerce: ["Shopping cart", "Payment processing", "Inventory management", "Customer accounts"],
    portfolio: ["Image galleries", "Project showcase", "Client testimonials", "Contact forms"],
    restaurant: ["Online menu", "Reservation system", "Location maps", "Photo gallery"],
    nonprofit: ["Donation system", "Volunteer signup", "Event calendar", "Mission statement"],
    blog: ["Content management", "Categories", "Comments", "Newsletter signup"]
  };
  
  return featureMap[type] || featureMap.business;
}

function generatePages(type) {
  const pageMap = {
    business: ["Home", "Services", "About", "Contact", "Blog"],
    ecommerce: ["Home", "Shop", "Product Pages", "Cart", "Checkout", "Account"],
    portfolio: ["Home", "Portfolio", "About", "Services", "Contact"],
    restaurant: ["Home", "Menu", "About", "Reservations", "Contact"],
    nonprofit: ["Home", "About", "Programs", "Volunteer", "Donate"],
    blog: ["Home", "Blog", "Categories", "About", "Contact"]
  };
  
  return pageMap[type] || pageMap.business;
}

function generateTechRequirements(type) {
  const techMap = {
    business: ["Responsive design", "SEO optimization", "Contact forms", "CMS"],
    ecommerce: ["Payment gateway", "SSL certificate", "Inventory system", "Customer management"],
    portfolio: ["Image optimization", "Gallery system", "Responsive design", "Fast loading"],
    restaurant: ["Reservation system", "Menu management", "Location services", "Mobile optimization"],
    nonprofit: ["Donation processing", "Event management", "Volunteer system", "Social integration"],
    blog: ["Content management", "SEO tools", "Comment system", "Social sharing"]
  };
  
  return techMap[type] || techMap.business;
}

function generateContentSuggestions(type, description) {
  return {
    hero: `Create a compelling headline that addresses your target audience's main need. Include a clear call-to-action button.`,
    about: `Tell your unique story - what makes you different? Include your mission, values, and what drives you.`,
    services: `Highlight your key offerings with clear benefits for customers. Use specific examples and results.`,
    contact: `Make it easy for customers to reach you. Include multiple contact methods and response time expectations.`
  };
}

// API Routes
app.post('/api/generate-design', async (req, res) => {
  try {
    const { description } = req.body;
    
    if (!description || description.trim().length < 10) {
      return res.status(400).json({ 
        error: 'Please provide a more detailed description of your website needs (at least 10 characters)' 
      });
    }

    const design = await generateWebsiteDesign(description);
    
    res.json({
      success: true,
      design,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in /api/generate-design:', error);
    res.status(500).json({ 
      error: 'Failed to generate website design. Please try again.',
      details: error.message 
    });
  }
});

// Generate wireframe/mockup HTML
app.post('/api/generate-mockup', async (req, res) => {
  try {
    const { design } = req.body;
    
    const mockupHTML = generateMockupHTML(design);
    
    res.json({
      success: true,
      mockup: mockupHTML,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error generating mockup:', error);
    res.status(500).json({ 
      error: 'Failed to generate mockup',
      details: error.message 
    });
  }
});

function generateMockupHTML(design) {
  const { siteName, tagline, sections, colorScheme } = design;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteName} - Mockup Preview</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Times New Roman', serif; 
            line-height: 1.6; 
            color: ${colorScheme.text};
            background: ${colorScheme.background};
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        /* Header */
        .header {
            background: ${colorScheme.primary};
            color: white;
            padding: 1rem 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .nav { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.5rem; font-weight: bold; }
        .nav-links { display: flex; list-style: none; gap: 2rem; }
        .nav-links a { color: white; text-decoration: none; }
        
        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secondary});
            color: white;
            text-align: center;
            padding: 4rem 0;
        }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.2rem; margin-bottom: 2rem; }
        .cta-button {
            background: ${colorScheme.accent};
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            font-size: 1.1rem;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        
        /* Sections */
        .section {
            padding: 3rem 0;
            border-bottom: 1px solid #eee;
        }
        .section h2 {
            text-align: center;
            margin-bottom: 2rem;
            color: ${colorScheme.primary};
            font-size: 2.5rem;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        .card {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            text-align: center;
        }
        .card h3 { 
            color: ${colorScheme.primary}; 
            margin-bottom: 1rem; 
            font-size: 1.5rem;
        }
        
        /* Footer */
        .footer {
            background: ${colorScheme.primary};
            color: white;
            text-align: center;
            padding: 2rem 0;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .hero h1 { font-size: 2rem; }
            .nav { flex-direction: column; gap: 1rem; }
            .nav-links { flex-direction: column; gap: 1rem; }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <nav class="nav">
                <div class="logo">${siteName}</div>
                <ul class="nav-links">
                    ${design.pages.slice(0, 5).map(page => `<li><a href="#${page.toLowerCase()}">${page}</a></li>`).join('')}
                </ul>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <h1>${siteName}</h1>
            <p>${tagline}</p>
            <a href="#contact" class="cta-button">Get Started</a>
        </div>
    </section>

    <!-- Dynamic Sections -->
    ${sections.map(section => `
    <section class="section" id="${section.name}">
        <div class="container">
            <h2>${section.title}</h2>
            <p style="text-align: center; max-width: 600px; margin: 0 auto;">${section.content}</p>
            
            ${section.name === 'services' ? `
            <div class="grid">
                ${section.features.map(feature => `
                <div class="card">
                    <h3>${feature}</h3>
                    <p>Professional ${feature.toLowerCase()} solution tailored to your needs.</p>
                </div>
                `).join('')}
            </div>
            ` : ''}
        </div>
    </section>
    `).join('')}

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${siteName}. All rights reserved. | Generated by ShadEl Web AI Design Preview</p>
        </div>
    </footer>
</body>
</html>`;
}

// Quote generation endpoint
app.post('/api/generate-quote', async (req, res) => {
  try {
    const { formData, prompt } = req.body;
    
    // Generate AI-powered quote
    const quote = await generateIntelligentQuote(formData, prompt);
    
    res.json({
      success: true,
      quote: quote
    });
  } catch (error) {
    console.error('Error generating quote:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate quote'
    });
  }
});

// AI-powered quote generation function
async function generateIntelligentQuote(formData, prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: `You are an expert web development project manager and cost estimator. 
          Generate detailed, accurate project quotes based on client requirements. 
          Consider industry standards, complexity factors, and provide realistic timelines.
          Always respond with valid JSON containing: totalCost, breakdown, timeline, features, suggestions.` 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.3, // Lower temperature for more consistent pricing
      max_tokens: 2000
    });

    const aiQuote = JSON.parse(response.choices[0].message.content);
    
    // Enhance with additional calculations
    return enhanceQuoteWithCalculations(aiQuote, formData);
    
  } catch (error) {
    console.error('AI quote generation failed:', error);
    // Fallback to rule-based quote generation
    return generateRuleBasedQuote(formData);
  }
}

// Enhanced quote calculation with business logic
function enhanceQuoteWithCalculations(aiQuote, formData) {
  // Apply business rules and adjustments
  const baseCost = aiQuote.totalCost || calculateBaseCost(formData);
  const adjustedCost = applyBusinessAdjustments(baseCost, formData);
  
  return {
    totalCost: adjustedCost,
    breakdown: aiQuote.breakdown || generateCostBreakdown(adjustedCost),
    timeline: aiQuote.timeline || calculateProjectTimeline(formData),
    features: aiQuote.features || generateFeatureList(formData),
    suggestions: aiQuote.suggestions || generateSmartSuggestions(formData),
    projectType: formData.projectType,
    confidence: 'high',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
  };
}

// Rule-based quote generation (fallback)
function generateRuleBasedQuote(formData) {
  const baseCosts = {
    business: 1500,
    ecommerce: 4000,
    portfolio: 1200,
    blog: 1000,
    restaurant: 2200,
    custom: 3000
  };

  const featureCosts = {
    responsive: 0, // included in base
    cms: 600,
    seo: 400,
    analytics: 250,
    contact: 200,
    social: 300,
    ecommerce: 2500,
    booking: 1000,
    membership: 1500
  };

  let totalCost = baseCosts[formData.projectType] || 2500;

  // Add feature costs
  if (formData.features && Array.isArray(formData.features)) {
    formData.features.forEach(feature => {
      totalCost += featureCosts[feature] || 0;
    });
  }

  // Timeline adjustments
  const timelineMultipliers = {
    rush: 1.6,     // 60% premium for rush jobs
    standard: 1.0,  // standard pricing
    relaxed: 0.9,   // 10% discount for flexible timeline
    flexible: 0.85  // 15% discount for very flexible
  };

  totalCost *= timelineMultipliers[formData.timeline] || 1.0;

  // Budget range validation and adjustment
  const budgetAdjustments = {
    small: { min: 500, max: 1500, multiplier: 0.8 },
    medium: { min: 1500, max: 5000, multiplier: 1.0 },
    large: { min: 5000, max: 15000, multiplier: 1.2 },
    enterprise: { min: 15000, max: 50000, multiplier: 1.5 }
  };

  if (formData.budgetRange && budgetAdjustments[formData.budgetRange]) {
    const budget = budgetAdjustments[formData.budgetRange];
    totalCost = Math.max(Math.min(totalCost * budget.multiplier, budget.max), budget.min);
  }

  return {
    totalCost: Math.round(totalCost),
    breakdown: generateCostBreakdown(totalCost),
    timeline: calculateProjectTimeline(formData),
    features: generateFeatureList(formData),
    suggestions: generateSmartSuggestions(formData),
    projectType: formData.projectType,
    confidence: 'medium'
  };
}

function calculateBaseCost(formData) {
  // Enhanced base cost calculation
  const complexityFactors = {
    description: formData.description ? formData.description.length / 100 : 1,
    features: formData.features ? formData.features.length : 0
  };
  
  const baseCosts = {
    business: 1500,
    ecommerce: 4000,
    portfolio: 1200,
    blog: 1000,
    restaurant: 2200,
    custom: 3000
  };
  
  const baseCost = baseCosts[formData.projectType] || 2500;
  return baseCost * (1 + complexityFactors.description * 0.1 + complexityFactors.features * 0.05);
}

function applyBusinessAdjustments(cost, formData) {
  // Apply any business-specific adjustments
  if (formData.timeline === 'rush') {
    cost *= 1.5;
  }
  
  // Round to nearest 50
  return Math.round(cost / 50) * 50;
}

function generateCostBreakdown(totalCost) {
  return [
    { item: 'Design & Planning', cost: Math.round(totalCost * 0.25) },
    { item: 'Development & Coding', cost: Math.round(totalCost * 0.45) },
    { item: 'Content Integration', cost: Math.round(totalCost * 0.15) },
    { item: 'Testing & Quality Assurance', cost: Math.round(totalCost * 0.10) },
    { item: 'Project Management', cost: Math.round(totalCost * 0.05) }
  ];
}

function calculateProjectTimeline(formData) {
  const baseTimelines = {
    business: 14,
    ecommerce: 28,
    portfolio: 10,
    blog: 12,
    restaurant: 18,
    custom: 21
  };

  let baseDays = baseTimelines[formData.projectType] || 14;
  
  // Add time for features
  if (formData.features) {
    const featureDays = {
      cms: 3, seo: 2, analytics: 1, contact: 1,
      social: 2, ecommerce: 12, booking: 6, membership: 8
    };
    
    formData.features.forEach(feature => {
      baseDays += featureDays[feature] || 0;
    });
  }

  // Adjust for timeline preference
  if (formData.timeline === 'rush') {
    baseDays = Math.ceil(baseDays * 0.7);
  } else if (formData.timeline === 'relaxed') {
    baseDays = Math.ceil(baseDays * 1.4);
  }

  return [
    { 
      phase: 'Planning & Design', 
      days: Math.ceil(baseDays * 0.3), 
      icon: 'fas fa-pencil-ruler',
      description: 'Wireframes, mockups, and project planning'
    },
    { 
      phase: 'Development', 
      days: Math.ceil(baseDays * 0.5), 
      icon: 'fas fa-code',
      description: 'Coding, feature implementation, and content integration'
    },
    { 
      phase: 'Testing & Launch', 
      days: Math.ceil(baseDays * 0.2), 
      icon: 'fas fa-rocket',
      description: 'Quality assurance, final testing, and deployment'
    }
  ].map((phase, index, array) => ({
    ...phase,
    startDay: index === 0 ? 1 : array.slice(0, index).reduce((sum, p) => sum + p.days, 1),
    endDay: array.slice(0, index + 1).reduce((sum, p) => sum + p.days, 0)
  }));
}

function generateFeatureList(formData) {
  const allFeatures = {
    responsive: 'Mobile-responsive design',
    cms: 'Content management system',
    seo: 'Search engine optimization',
    analytics: 'Analytics and tracking',
    contact: 'Contact forms and lead capture',
    social: 'Social media integration',
    ecommerce: 'E-commerce functionality',
    booking: 'Appointment/booking system',
    membership: 'User accounts and membership area'
  };

  const features = ['responsive']; // Always included
  
  if (formData.features) {
    features.push(...formData.features);
  }

  // Add project-type specific features
  const typeSpecific = {
    business: ['seo', 'contact'],
    ecommerce: ['analytics', 'seo'],
    portfolio: ['seo'],
    blog: ['cms', 'seo'],
    restaurant: ['contact', 'seo']
  };

  if (typeSpecific[formData.projectType]) {
    features.push(...typeSpecific[formData.projectType]);
  }

  return [...new Set(features)].map(feature => allFeatures[feature] || feature);
}

function generateSmartSuggestions(formData) {
  const suggestions = {
    business: [
      'Professional photography package',
      'Blog section for SEO and thought leadership',
      'Client testimonials and case studies page',
      'Live chat integration for customer support',
      'Google My Business optimization'
    ],
    ecommerce: [
      'Product review and rating system',
      'Abandoned cart email automation',
      'Advanced inventory management',
      'Multiple payment gateway options',
      'Wishlist and comparison features'
    ],
    portfolio: [
      'Before/after project showcase galleries',
      'Client testimonial video integration',
      'Downloadable portfolio PDF',
      'Detailed project case study pages',
      'Skills and expertise timeline'
    ],
    blog: [
      'Email newsletter subscription system',
      'Comment system and community features',
      'Social sharing optimization',
      'Related posts recommendation engine',
      'Advanced search and filtering'
    ],
    restaurant: [
      'Online ordering and delivery system',
      'Table reservation management',
      'Digital menu with dietary filters',
      'Customer loyalty program',
      'Event booking and catering requests'
    ],
    custom: [
      'Advanced security features',
      'API integrations with third-party services',
      'Custom reporting dashboard',
      'Automated workflow systems',
      'Multi-language support'
    ]
  };

  return suggestions[formData.projectType] || [
    'SSL certificate and security enhancements',
    'Regular maintenance and backup service',
    'Performance optimization package',
    'Advanced analytics and reporting',
    'Social media marketing integration'
  ];
}

// AI Content Generation Endpoints
app.post('/api/generate-blog', async (req, res) => {
  try {
    const { topic, articleType, audience, tone, keywords, length } = req.body;
    
    if (!topic || topic.trim().length < 5) {
      return res.status(400).json({ 
        error: 'Please provide a more detailed blog topic (at least 5 characters)' 
      });
    }

    const blogContent = await generateBlogContent({
      topic, articleType, audience, tone, keywords, length
    });
    
    res.json({
      success: true,
      content: blogContent,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error generating blog content:', error);
    res.status(500).json({ 
      error: 'Failed to generate blog content. Please try again.',
      details: error.message 
    });
  }
});

app.post('/api/generate-caption', async (req, res) => {
  try {
    const { content, mood, cta, includeHashtags, includeEmojis, platform } = req.body;
    
    if (!content || content.trim().length < 5) {
      return res.status(400).json({ 
        error: 'Please describe what your post is about (at least 5 characters)' 
      });
    }

    const captions = await generateSocialCaption({
      content, mood, cta, includeHashtags, includeEmojis, platform
    });
    
    res.json({
      success: true,
      captions: captions,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error generating social caption:', error);
    res.status(500).json({ 
      error: 'Failed to generate captions. Please try again.',
      details: error.message 
    });
  }
});

app.post('/api/generate-email', async (req, res) => {
  try {
    const { emailType, subject, audience, goal } = req.body;
    
    if (!subject || !goal) {
      return res.status(400).json({ 
        error: 'Please provide both subject and goal for the email' 
      });
    }

    const emailContent = await generateEmailContent({
      emailType, subject, audience, goal
    });
    
    res.json({
      success: true,
      content: emailContent,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error generating email content:', error);
    res.status(500).json({ 
      error: 'Failed to generate email content. Please try again.',
      details: error.message 
    });
  }
});

app.post('/api/generate-product', async (req, res) => {
  try {
    const { name, category, features, audience, price } = req.body;
    
    if (!name || !features) {
      return res.status(400).json({ 
        error: 'Please provide both product name and features' 
      });
    }

    const productContent = await generateProductDescription({
      name, category, features, audience, price
    });
    
    res.json({
      success: true,
      content: productContent,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error generating product description:', error);
    res.status(500).json({ 
      error: 'Failed to generate product description. Please try again.',
      details: error.message 
    });
  }
});

// AI Content Generation Functions
async function generateBlogContent(params) {
  try {
    const { topic, articleType, audience, tone, keywords, length } = params;
    
    const keywordText = keywords ? `Keywords to include: ${keywords}` : '';
    const audienceText = audience ? `Target audience: ${audience}` : '';
    
    const prompt = `Write a ${articleType} blog post about "${topic}".
    ${audienceText}
    Writing tone: ${tone}
    Length: ${length} (short=300-500 words, medium=500-1000 words, long=1000+ words)
    ${keywordText}
    
    Return a JSON object with:
    - title: compelling headline
    - introduction: engaging opening paragraph
    - sections: array of {heading, content} objects for main sections
    - conclusion: strong closing paragraph
    - wordCount: estimated word count
    
    Make it engaging, informative, and optimized for SEO.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert content writer and SEO specialist. Create engaging, well-structured blog content that ranks well and engages readers. Always respond with valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('AI blog generation failed:', error);
    // Return fallback content
    return generateFallbackBlogContent(params);
  }
}

async function generateSocialCaption(params) {
  try {
    const { content, mood, cta, includeHashtags, includeEmojis, platform } = params;
    
    const platformLimits = {
      instagram: 2200,
      twitter: 280,
      facebook: 500,
      linkedin: 700,
      tiktok: 150
    };
    
    const limit = platformLimits[platform] || 500;
    
    const prompt = `Create 3 different social media captions for ${platform} about: "${content}"
    
    Mood/Tone: ${mood}
    ${cta ? `Call to action: ${cta}` : ''}
    ${includeHashtags ? 'Include relevant hashtags' : 'No hashtags needed'}
    ${includeEmojis ? 'Include appropriate emojis' : 'No emojis needed'}
    Character limit: ${limit}
    
    Return a JSON object with:
    - captions: array of {version, text} objects
    - platform: the target platform
    - characterCounts: array of character counts for each caption
    
    Make them engaging and platform-appropriate.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a social media expert who creates viral, engaging content for different platforms. Always respond with valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 1500
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('AI caption generation failed:', error);
    return generateFallbackCaption(params);
  }
}

async function generateEmailContent(params) {
  try {
    const { emailType, subject, audience, goal } = params;
    
    const prompt = `Create a ${emailType} email about "${subject}".
    Target audience: ${audience}
    Goal: ${goal}
    
    Return a JSON object with:
    - subject: compelling subject line
    - opening: email greeting and opening
    - body: main email content
    - cta: call to action
    - closing: professional closing
    
    Make it professional, engaging, and action-oriented.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert email marketer who creates high-converting email campaigns. Always respond with valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('AI email generation failed:', error);
    return generateFallbackEmail(params);
  }
}

async function generateProductDescription(params) {
  try {
    const { name, category, features, audience, price } = params;
    
    const prompt = `Create product descriptions for "${name}" - a ${category} product.
    Features: ${features}
    Target customer: ${audience}
    Price range: ${price}
    
    Return a JSON object with:
    - shortDescription: brief 1-sentence description
    - detailedDescription: comprehensive description
    - bulletPoints: key features as bullet points
    - benefits: array of customer benefits
    - callToAction: compelling purchase prompt
    
    Focus on benefits, not just features. Make it persuasive and conversion-focused.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert copywriter who creates compelling product descriptions that convert browsers into buyers. Always respond with valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('AI product description generation failed:', error);
    return generateFallbackProduct(params);
  }
}

// Fallback content generators (when AI is unavailable)
function generateFallbackBlogContent(params) {
  const { topic, articleType, tone } = params;
  
  return {
    title: `${articleType === 'how-to' ? 'How to' : 'The Ultimate Guide to'} ${topic}`,
    introduction: `In this comprehensive guide, we'll explore ${topic} and provide you with actionable insights.`,
    sections: [
      {
        heading: "Getting Started",
        content: `Understanding ${topic} is crucial for success in today's competitive landscape.`
      },
      {
        heading: "Best Practices",
        content: `Here are the proven strategies that work best for ${topic}.`
      },
      {
        heading: "Common Mistakes",
        content: `Avoid these common pitfalls when working with ${topic}.`
      }
    ],
    conclusion: `By following these guidelines, you'll be well on your way to mastering ${topic}.`,
    wordCount: "750"
  };
}

function generateFallbackCaption(params) {
  const { content, platform } = params;
  
  return {
    captions: [
      {
        version: "Version 1",
        text: `✨ ${content} ✨\n\n#inspiration #motivation #life`
      },
      {
        version: "Version 2", 
        text: `Here's something amazing: ${content}\n\nWhat do you think? 💭`
      },
      {
        version: "Version 3",
        text: `${content} 🌟\n\nDouble tap if you agree! ❤️`
      }
    ],
    platform,
    characterCounts: [65, 85, 55]
  };
}

function generateFallbackEmail(params) {
  const { subject, goal } = params;
  
  return {
    subject: `Important Update: ${subject}`,
    opening: "Hi there!\n\nI hope this email finds you well.",
    body: `I wanted to reach out regarding ${subject}. ${goal}`,
    cta: "Click here to learn more!",
    closing: "Best regards,\nThe Team"
  };
}

function generateFallbackProduct(params) {
  const { name, features } = params;
  
  return {
    shortDescription: `Discover the ${name} - ${features.split('.')[0]}.`,
    detailedDescription: `The ${name} is designed to meet your needs with ${features}`,
    bulletPoints: `• High-quality construction\n• ${features}\n• Great value for money`,
    benefits: [
      "Save time and effort",
      "Professional results",
      "Excellent value"
    ],
    callToAction: `Get your ${name} today!`
  };
}

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 AI Web Design Preview Generator running on http://localhost:${PORT}`);
  console.log(`📝 Make sure to set your OPENAI_API_KEY in the .env file`);
  console.log(`💰 Smart Quote Estimator available at /quote-estimator.html`);
});

module.exports = app;
