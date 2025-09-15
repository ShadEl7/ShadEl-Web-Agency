# AI Web Design Preview Generator - Setup Guide

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
1. Copy `.env.example` to `.env`
2. Get your OpenAI API key from https://platform.openai.com/api-keys
3. Add your API key to `.env`:
```
OPENAI_API_KEY=your-actual-openai-api-key-here
```

### 3. Start the Server
```bash
npm run dev
```

Visit http://localhost:3000 to see your AI-powered website!

## 🎯 Features

✅ **AI-Powered Design Generation** - Users describe their needs, AI creates website mockups
✅ **Real-time Preview** - Instant HTML mockup generation
✅ **Multiple Website Types** - Business, E-commerce, Portfolio, Restaurant, etc.
✅ **Mobile Responsive** - Works perfectly on all devices
✅ **Professional Templates** - Built-in design systems and color schemes
✅ **Lead Generation** - Converts visitors into potential clients

## 🛠️ How It Works

1. **User Input**: Visitor describes their website needs in natural language
2. **AI Analysis**: OpenAI analyzes requirements and generates design recommendations
3. **Mockup Creation**: System creates HTML preview with suggested layout, colors, and features
4. **Lead Capture**: Interested users contact you to build the actual website

## 📖 Usage Examples

**Example Prompts:**
- "I need a website for my bakery with an online ordering system"
- "Create a portfolio site for my photography business"
- "Build an e-commerce store for handmade jewelry"
- "I want a restaurant website with reservations and menu"

## 🎨 Customization

### Adding New Website Types
Edit `server.js` and add new templates to the `websiteTemplates` object:

```javascript
newType: {
  layout: 'header-nav-hero-custom-footer',
  colors: ['#primary', '#secondary', '#white', '#background'],
  sections: ['hero', 'custom', 'contact']
}
```

### Styling
- Main styles are in the AI generator script (`public/ai-generator.js`)
- Matches your existing website color scheme automatically
- Fully responsive design

## 🔧 Technical Details

### API Endpoints
- `POST /api/generate-design` - Generate AI design recommendations
- `POST /api/generate-mockup` - Create HTML mockup preview

### Dependencies
- **Express.js** - Web server
- **OpenAI** - AI design generation
- **CORS** - Cross-origin requests
- **dotenv** - Environment configuration

### File Structure
```
├── server.js              # Main server and AI logic
├── public/
│   ├── index.html         # Your main website
│   ├── ai-generator.js    # Frontend AI generator
│   └── ...               # Your existing files
├── package.json           # Dependencies
└── .env                  # Configuration (create from .env.example)
```

## 💡 Business Benefits

1. **Lead Generation** - Captures potential clients interested in websites
2. **Differentiation** - Unique AI feature sets you apart from competitors
3. **Client Education** - Helps clients understand what they need
4. **Increased Engagement** - Interactive tool keeps visitors on your site longer
5. **Higher Conversions** - Visual previews increase likelihood of purchase

## 🔒 Security & Best Practices

- API keys stored in environment variables
- Input validation on all user inputs
- CORS properly configured
- Error handling for AI service failures
- Fallback designs when AI is unavailable

## 📈 Analytics & Tracking

Track these metrics to measure success:
- AI generator usage rate
- Generated designs per session
- Conversion from AI preview to contact form
- Most popular website types requested

## 🆘 Troubleshooting

**Common Issues:**

1. **"AI generation failed"**
   - Check your OpenAI API key in `.env`
   - Ensure you have API credits
   - Check internet connection

2. **Server won't start**
   - Run `npm install` first
   - Check port 3000 isn't already in use
   - Verify Node.js version (14+ recommended)

3. **Mockup not displaying**
   - Check browser console for errors
   - Ensure all scripts are loaded
   - Try different browser

## 📞 Support

If you need help setting this up:
1. Check the troubleshooting section above
2. Review the console logs for errors
3. Contact us through your website's contact form

---

**🎉 Your AI Web Design Preview Generator is ready to impress visitors and generate leads!**
