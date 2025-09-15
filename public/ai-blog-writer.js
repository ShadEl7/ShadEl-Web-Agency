// AI Blog Writer & Caption Generator
class AIContentGenerator {
    constructor() {
        this.apiBaseUrl = window.location.origin;
        this.currentTool = 'blog';
        this.init();
    }

    init() {
        this.bindEvents();
        this.initCharCounters();
    }

    bindEvents() {
        // Tool navigation
        document.querySelectorAll('.tool-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const tool = item.dataset.tool;
                this.switchTool(tool);
            });
        });

        // Template cards
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => {
                const template = card.dataset.template;
                document.getElementById('blog-type').value = template;
                card.classList.add('active');
                setTimeout(() => card.classList.remove('active'), 200);
            });
        });

        // Platform selection
        document.querySelectorAll('.platform-icon').forEach(icon => {
            icon.addEventListener('click', () => {
                document.querySelectorAll('.platform-icon').forEach(i => i.classList.remove('active'));
                icon.classList.add('active');
            });
        });

        // Generate buttons
        document.getElementById('generate-blog').addEventListener('click', () => this.generateBlog());
        document.getElementById('generate-caption').addEventListener('click', () => this.generateCaption());
        document.getElementById('generate-email').addEventListener('click', () => this.generateEmail());
        document.getElementById('generate-product').addEventListener('click', () => this.generateProduct());

        // Copy buttons (delegated event listener)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-btn')) {
                this.copyToClipboard(e.target);
            }
        });
    }

    initCharCounters() {
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            if (textarea.id === 'caption-content') {
                this.addCharCounter(textarea, 2200); // Instagram limit
            }
        });
    }

    addCharCounter(textarea, limit) {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        textarea.parentNode.appendChild(counter);

        const updateCounter = () => {
            const count = textarea.value.length;
            counter.textContent = `${count}/${limit} characters`;
            
            if (count > limit) {
                counter.className = 'char-counter error';
            } else if (count > limit * 0.8) {
                counter.className = 'char-counter warning';
            } else {
                counter.className = 'char-counter';
            }
        };

        textarea.addEventListener('input', updateCounter);
        updateCounter();
    }

    switchTool(tool) {
        // Update navigation
        document.querySelectorAll('.tool-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tool="${tool}"]`).classList.add('active');

        // Show/hide tool sections
        document.querySelectorAll('.tool-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${tool}-tool`).classList.add('active');

        this.currentTool = tool;
    }

    async generateBlog() {
        const topic = document.getElementById('blog-topic').value;
        const type = document.getElementById('blog-type').value;
        const audience = document.getElementById('blog-audience').value;
        const tone = document.getElementById('blog-tone').value;
        const keywords = document.getElementById('blog-keywords').value;
        const length = document.getElementById('blog-length').value;

        if (!topic.trim()) {
            alert('Please enter a blog topic');
            return;
        }

        this.showLoading('blog');

        try {
            // Simulate API call
            const response = await this.simulateAIGeneration({
                type: 'blog',
                topic,
                articleType: type,
                audience,
                tone,
                keywords,
                length
            });

            this.displayBlogResults(response);
        } catch (error) {
            console.error('Error generating blog:', error);
            alert('Sorry, there was an error generating your blog post. Please try again.');
        } finally {
            this.hideLoading('blog');
        }
    }

    async generateCaption() {
        const content = document.getElementById('caption-content').value;
        const mood = document.getElementById('caption-mood').value;
        const cta = document.getElementById('caption-cta').value;
        const includeHashtags = document.getElementById('include-hashtags').checked;
        const includeEmojis = document.getElementById('include-emojis').checked;
        const platform = document.querySelector('.platform-icon.active').dataset.platform;

        if (!content.trim()) {
            alert('Please describe what your post is about');
            return;
        }

        this.showLoading('caption');

        try {
            const response = await this.simulateAIGeneration({
                type: 'caption',
                content,
                mood,
                cta,
                includeHashtags,
                includeEmojis,
                platform
            });

            this.displayCaptionResults(response);
        } catch (error) {
            console.error('Error generating caption:', error);
            alert('Sorry, there was an error generating your captions. Please try again.');
        } finally {
            this.hideLoading('caption');
        }
    }

    async generateEmail() {
        const type = document.getElementById('email-type').value;
        const subject = document.getElementById('email-subject').value;
        const audience = document.getElementById('email-audience').value;
        const goal = document.getElementById('email-goal').value;

        if (!subject.trim() || !goal.trim()) {
            alert('Please fill in the subject and goal fields');
            return;
        }

        this.showLoading('email');

        try {
            const response = await this.simulateAIGeneration({
                type: 'email',
                emailType: type,
                subject,
                audience,
                goal
            });

            this.displayEmailResults(response);
        } catch (error) {
            console.error('Error generating email:', error);
            alert('Sorry, there was an error generating your email. Please try again.');
        } finally {
            this.hideLoading('email');
        }
    }

    async generateProduct() {
        const name = document.getElementById('product-name').value;
        const category = document.getElementById('product-category').value;
        const features = document.getElementById('product-features').value;
        const audience = document.getElementById('product-audience').value;
        const price = document.getElementById('product-price').value;

        if (!name.trim() || !features.trim()) {
            alert('Please enter product name and features');
            return;
        }

        this.showLoading('product');

        try {
            const response = await this.simulateAIGeneration({
                type: 'product',
                name,
                category,
                features,
                audience,
                price
            });

            this.displayProductResults(response);
        } catch (error) {
            console.error('Error generating product description:', error);
            alert('Sorry, there was an error generating your product description. Please try again.');
        } finally {
            this.hideLoading('product');
        }
    }

    // Simulate AI generation (replace with actual API calls in production)
    async simulateAIGeneration(params) {
        try {
            const endpoint = `/api/generate-${params.type}`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'API request failed');
            }

            const data = await response.json();
            return data.content || data.captions;
            
        } catch (error) {
            console.error('API Error:', error);
            // Fallback to local generation
            return this.generateLocalContent(params);
        }
    }

    // Local fallback content generation
    generateLocalContent(params) {
        switch (params.type) {
            case 'blog':
                return this.generateBlogContent(params);
            case 'caption':
                return this.generateCaptionContent(params);
            case 'email':
                return this.generateEmailContent(params);
            case 'product':
                return this.generateProductContent(params);
            default:
                throw new Error('Unknown content type');
        }
    }

    generateBlogContent(params) {
        const { topic, articleType, audience, tone, length } = params;
        
        const titles = {
            'how-to': `How to ${topic}: A Complete Guide for ${audience || 'Beginners'}`,
            'listicle': `10 Essential Tips for ${topic} That Every ${audience || 'Professional'} Should Know`,
            'review': `${topic} Review: Is It Worth Your Investment?`,
            'news': `Latest Developments in ${topic}: What You Need to Know`,
            'opinion': `Why ${topic} is More Important Than Ever`,
            'case-study': `Case Study: How ${topic} Transformed Our Business`
        };

        const introductions = {
            'professional': `In today's competitive landscape, understanding ${topic} is crucial for success. This comprehensive guide will walk you through everything you need to know.`,
            'casual': `Hey there! Ready to dive into the world of ${topic}? Let's explore this together and make it super easy to understand.`,
            'expert': `Advanced practitioners in ${topic} require sophisticated strategies. This analysis presents cutting-edge methodologies and technical insights.`,
            'conversational': `Let's have a chat about ${topic}. You've probably been wondering about this, and I'm here to share what I've learned.`,
            'formal': `This document provides a systematic examination of ${topic}, presenting evidence-based recommendations and best practices.`
        };

        const sections = [
            {
                heading: "Understanding the Basics",
                content: `Before diving deep into ${topic}, it's important to establish a solid foundation. ${audience || 'Readers'} often overlook the fundamentals, but these basics are what separate successful implementations from failed attempts.`
            },
            {
                heading: "Key Strategies and Best Practices",
                content: `Implementing ${topic} effectively requires a strategic approach. Here are the proven methods that industry leaders use to achieve outstanding results.`
            },
            {
                heading: "Common Mistakes to Avoid",
                content: `Even experienced professionals can fall into these traps when working with ${topic}. By being aware of these pitfalls, you can save time, money, and frustration.`
            },
            {
                heading: "Getting Started: Your Action Plan",
                content: `Now that you understand the theory, let's put it into practice. This step-by-step action plan will help you implement ${topic} in your own situation.`
            }
        ];

        return {
            title: titles[articleType] || titles['how-to'],
            introduction: introductions[tone] || introductions['professional'],
            sections: sections,
            conclusion: `${topic} doesn't have to be overwhelming. By following these guidelines and staying consistent with your efforts, you'll see significant improvements. Remember, success in ${topic} comes from understanding your ${audience || 'audience'} and adapting these strategies to your unique situation.`,
            wordCount: length === 'short' ? '450' : length === 'medium' ? '750' : '1200'
        };
    }

    generateCaptionContent(params) {
        const { content, mood, cta, includeHashtags, includeEmojis, platform } = params;
        
        const emojiMap = {
            'professional': '💼✨📈',
            'funny': '😂🤣😄',
            'inspiring': '✨💪🌟',
            'casual': '😊👋💫',
            'promotional': '🔥💯🎉',
            'educational': '📚💡🎓',
            'storytelling': '📖✨🌈'
        };

        const ctaMap = {
            'like': 'Double tap if you agree! ❤️',
            'comment': 'What do you think? Drop a comment below! 👇',
            'share': 'Share this with someone who needs to see it! 🔄',
            'follow': 'Follow for more content like this! 🔔',
            'visit': 'Link in bio for more details! 🔗',
            'buy': 'Get yours today! Limited time offer! 🛒'
        };

        const hashtags = this.generateHashtags(content, platform);
        const emojis = includeEmojis ? emojiMap[mood] || '✨' : '';
        const ctaText = cta ? ctaMap[cta] || '' : '';

        const captions = [
            {
                version: "Version 1 - Engaging",
                text: `${emojis} ${content} ${ctaText}\n\n${includeHashtags ? hashtags : ''}`.trim()
            },
            {
                version: "Version 2 - Story-focused",
                text: `Here's the thing about ${content.toLowerCase()}... ${emojis}\n\nIt's not just about the moment, it's about the story behind it. ${ctaText}\n\n${includeHashtags ? hashtags : ''}`.trim()
            },
            {
                version: "Version 3 - Question starter",
                text: `Ever wondered about ${content.toLowerCase()}? ${emojis}\n\nHere's my take on it... ${ctaText}\n\n${includeHashtags ? hashtags : ''}`.trim()
            }
        ];

        return { captions, platform, characterCounts: captions.map(c => c.text.length) };
    }

    generateEmailContent(params) {
        const { emailType, subject, audience, goal } = params;
        
        const subjectLines = {
            'newsletter': `Your Weekly Update: ${subject}`,
            'promotional': `🔥 Special Offer: ${subject}`,
            'welcome': `Welcome! Here's everything about ${subject}`,
            'follow-up': `Following up on ${subject}`,
            'announcement': `Big News: ${subject}`,
            'reminder': `Reminder: Don't miss out on ${subject}`
        };

        const openings = {
            'newsletter': `Hi there!\n\nHope you're having a great week! Here's what's new with ${subject}:`,
            'promotional': `Hey ${audience || 'there'}!\n\nWe've got something special for you regarding ${subject}:`,
            'welcome': `Welcome to our community!\n\nWe're thrilled you're interested in ${subject}. Here's what you need to know:`,
            'follow-up': `Hi again!\n\nI wanted to follow up on our previous conversation about ${subject}:`,
            'announcement': `Exciting news!\n\nWe're thrilled to share this update about ${subject}:`,
            'reminder': `Quick reminder!\n\nDon't forget about ${subject}:`
        };

        return {
            subject: subjectLines[emailType],
            opening: openings[emailType],
            body: `${goal}\n\nThis is exactly what you've been looking for to take your ${subject} to the next level. Our ${audience || 'customers'} have seen incredible results, and we know you will too.`,
            cta: `Ready to get started? Click here to learn more about ${subject}!`,
            closing: `Best regards,\nThe Team\n\nP.S. Have questions? Just reply to this email - we'd love to help!`
        };
    }

    generateProductContent(params) {
        const { name, category, features, audience, price } = params;
        
        const descriptions = {
            short: `Discover the ${name} - perfect for ${audience || 'anyone looking for quality'}. ${features.split('.')[0]}.`,
            detailed: `Introducing the ${name}, a premium ${category} product designed specifically for ${audience || 'discerning customers'}.\n\n${features}\n\nCrafted with attention to detail and built to last, this ${price} option delivers exceptional value.`,
            bullets: `• Premium quality ${category} product\n• ${features.split(',').join('\n• ')}\n• Perfect for ${audience || 'everyday use'}\n• ${price} pricing for excellent value`
        };

        const benefits = [
            `Save time and effort with the ${name}`,
            `Enjoy peace of mind with our quality guarantee`,
            `Perfect for ${audience || 'busy professionals'}`,
            `Get ${price} quality without the premium price tag`
        ];

        return {
            shortDescription: descriptions.short,
            detailedDescription: descriptions.detailed,
            bulletPoints: descriptions.bullets,
            benefits: benefits,
            callToAction: `Order your ${name} today and experience the difference quality makes!`
        };
    }

    generateHashtags(content, platform) {
        // Simple hashtag generation based on content
        const words = content.toLowerCase().split(' ');
        const relevantWords = words.filter(word => 
            word.length > 3 && 
            !['this', 'that', 'with', 'from', 'they', 'them', 'were', 'been', 'have', 'your', 'will', 'what', 'when', 'where'].includes(word)
        );
        
        const hashtags = relevantWords.slice(0, 5).map(word => 
            `#${word.replace(/[^a-zA-Z0-9]/g, '')}`
        );
        
        // Add platform-specific hashtags
        const platformTags = {
            'instagram': ['#instagood', '#photooftheday', '#follow'],
            'linkedin': ['#professional', '#business', '#career'],
            'facebook': ['#community', '#share', '#connect'],
            'twitter': ['#trending', '#news', '#update'],
            'tiktok': ['#fyp', '#viral', '#trending']
        };
        
        return [...hashtags, ...(platformTags[platform] || [])].join(' ');
    }

    displayBlogResults(result) {
        const container = document.getElementById('blog-content');
        container.innerHTML = `
            <div class="content-result">
                <h4>Blog Title</h4>
                <p><strong>${result.title}</strong></p>
                <button class="copy-btn" data-copy="${result.title}">Copy Title</button>
            </div>
            
            <div class="content-result">
                <h4>Introduction</h4>
                <p>${result.introduction}</p>
                <button class="copy-btn" data-copy="${result.introduction}">Copy Introduction</button>
            </div>
            
            ${result.sections.map(section => `
                <div class="content-result">
                    <h4>${section.heading}</h4>
                    <p>${section.content}</p>
                    <button class="copy-btn" data-copy="${section.content}">Copy Section</button>
                </div>
            `).join('')}
            
            <div class="content-result">
                <h4>Conclusion</h4>
                <p>${result.conclusion}</p>
                <button class="copy-btn" data-copy="${result.conclusion}">Copy Conclusion</button>
            </div>
            
            <div class="content-result">
                <h4>Full Article</h4>
                <p><em>Estimated word count: ${result.wordCount} words</em></p>
                <button class="copy-btn" data-copy="${this.formatFullArticle(result)}">Copy Full Article</button>
            </div>
        `;
        
        document.getElementById('blog-results').classList.add('show');
    }

    formatFullArticle(result) {
        return `${result.title}\n\n${result.introduction}\n\n${result.sections.map(s => `${s.heading}\n\n${s.content}`).join('\n\n')}\n\n${result.conclusion}`;
    }

    displayCaptionResults(result) {
        const container = document.getElementById('caption-content-results');
        container.innerHTML = result.captions.map((caption, index) => `
            <div class="content-result">
                <h4>${caption.version} (${result.characterCounts[index]} characters)</h4>
                <p style="white-space: pre-line;">${caption.text}</p>
                <button class="copy-btn" data-copy="${caption.text}">Copy Caption</button>
            </div>
        `).join('');
        
        document.getElementById('caption-results').classList.add('show');
    }

    displayEmailResults(result) {
        const container = document.getElementById('email-content-results');
        container.innerHTML = `
            <div class="content-result">
                <h4>Subject Line</h4>
                <p><strong>${result.subject}</strong></p>
                <button class="copy-btn" data-copy="${result.subject}">Copy Subject</button>
            </div>
            
            <div class="content-result">
                <h4>Email Opening</h4>
                <p style="white-space: pre-line;">${result.opening}</p>
                <button class="copy-btn" data-copy="${result.opening}">Copy Opening</button>
            </div>
            
            <div class="content-result">
                <h4>Email Body</h4>
                <p style="white-space: pre-line;">${result.body}</p>
                <button class="copy-btn" data-copy="${result.body}">Copy Body</button>
            </div>
            
            <div class="content-result">
                <h4>Call to Action</h4>
                <p>${result.cta}</p>
                <button class="copy-btn" data-copy="${result.cta}">Copy CTA</button>
            </div>
            
            <div class="content-result">
                <h4>Email Closing</h4>
                <p style="white-space: pre-line;">${result.closing}</p>
                <button class="copy-btn" data-copy="${result.closing}">Copy Closing</button>
            </div>
            
            <div class="content-result">
                <h4>Complete Email</h4>
                <button class="copy-btn" data-copy="${this.formatFullEmail(result)}">Copy Full Email</button>
            </div>
        `;
        
        document.getElementById('email-results').classList.add('show');
    }

    formatFullEmail(result) {
        return `Subject: ${result.subject}\n\n${result.opening}\n\n${result.body}\n\n${result.cta}\n\n${result.closing}`;
    }

    displayProductResults(result) {
        const container = document.getElementById('product-content-results');
        container.innerHTML = `
            <div class="content-result">
                <h4>Short Description</h4>
                <p>${result.shortDescription}</p>
                <button class="copy-btn" data-copy="${result.shortDescription}">Copy Short Description</button>
            </div>
            
            <div class="content-result">
                <h4>Detailed Description</h4>
                <p style="white-space: pre-line;">${result.detailedDescription}</p>
                <button class="copy-btn" data-copy="${result.detailedDescription}">Copy Detailed Description</button>
            </div>
            
            <div class="content-result">
                <h4>Bullet Points</h4>
                <p style="white-space: pre-line;">${result.bulletPoints}</p>
                <button class="copy-btn" data-copy="${result.bulletPoints}">Copy Bullet Points</button>
            </div>
            
            <div class="content-result">
                <h4>Key Benefits</h4>
                <p style="white-space: pre-line;">${result.benefits.join('\n')}</p>
                <button class="copy-btn" data-copy="${result.benefits.join('\n')}">Copy Benefits</button>
            </div>
            
            <div class="content-result">
                <h4>Call to Action</h4>
                <p>${result.callToAction}</p>
                <button class="copy-btn" data-copy="${result.callToAction}">Copy CTA</button>
            </div>
        `;
        
        document.getElementById('product-results').classList.add('show');
    }

    showLoading(tool) {
        document.getElementById(`${tool}-loading`).classList.add('show');
        document.getElementById(`${tool}-results`).classList.remove('show');
        
        // Disable generate button
        const button = document.getElementById(`generate-${tool}`);
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    }

    hideLoading(tool) {
        document.getElementById(`${tool}-loading`).classList.remove('show');
        
        // Re-enable generate button
        const button = document.getElementById(`generate-${tool}`);
        button.disabled = false;
        
        const buttonTexts = {
            'blog': '<i class="fas fa-magic"></i> Generate Blog Post',
            'caption': '<i class="fas fa-hashtag"></i> Generate Captions',
            'email': '<i class="fas fa-envelope-open"></i> Generate Email',
            'product': '<i class="fas fa-magic"></i> Generate Description'
        };
        
        button.innerHTML = buttonTexts[tool];
    }

    async copyToClipboard(button) {
        const textToCopy = button.dataset.copy;
        
        try {
            await navigator.clipboard.writeText(textToCopy);
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.style.background = '#10b981';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        }
    }
}

// Initialize the AI Content Generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AIContentGenerator();
});
