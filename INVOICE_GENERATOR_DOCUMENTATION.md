# Invoice Generator

A professional, feature-rich invoice generator built with HTML, CSS, and JavaScript. Create branded invoices with automatic calculations, PDF downloads, and email functionality.

## Features

### ✨ Core Functionality
- **Professional Invoice Creation**: Clean, branded invoice templates
- **Auto-Calculations**: Automatically calculates subtotals, taxes, and totals
- **Multi-Currency Support**: ZAR, USD, EUR, GBP with proper symbols
- **Responsive Design**: Works perfectly on desktop and mobile devices

### 💰 Business Features
- **Company Branding**: Upload logo and customize company information
- **Client Management**: Store and manage client details
- **Tax Calculations**: Configurable tax rates (default 15% for South Africa)
- **Payment Terms**: Customizable payment terms and conditions
- **Payment Links**: Add payment links for online payments

### 📄 Export & Sharing
- **PDF Download**: High-quality PDF generation using jsPDF and html2canvas
- **Email Integration**: Send invoices directly via email (server backend + mailto fallback)
- **Save & Load**: Local storage for saving and retrieving invoices
- **Auto-Save**: Automatic saving of form data to prevent data loss

### 🔧 Advanced Features
- **Multiple Items**: Add unlimited items with descriptions, quantities, and rates
- **Unique Invoice Numbers**: Auto-generated sequential invoice numbers
- **Date Management**: Automatic date setting with customizable due dates
- **Preview Mode**: Real-time preview of the invoice as you type
- **Data Persistence**: All data saved locally for privacy and convenience

## How to Use

### 1. Company Setup
1. Upload your company logo (optional)
2. Enter your company name, email, phone, and address
3. This information will appear on all your invoices

### 2. Client Information
1. Enter client name, email, phone, and address
2. This creates the "Bill To" section of your invoice

### 3. Invoice Details
1. Invoice number is auto-generated (customizable)
2. Set invoice date and due date
3. Choose currency (ZAR, USD, EUR, GBP)
4. Set tax rate (default 15%)

### 4. Add Items/Services
1. Click "Add Item" to add more lines
2. Enter description, quantity, and rate for each item
3. Amounts are calculated automatically
4. Use the trash icon to remove items

### 5. Payment Information
1. Add payment terms (e.g., "Net 30 days")
2. Add payment link for online payments (optional)

### 6. Actions
- **Download PDF**: Generate and download a professional PDF
- **Save Invoice**: Save for future reference or editing
- **Email Invoice**: Send directly to client (requires server setup or uses default email client)
- **Clear Form**: Reset all fields

## Technical Features

### PDF Generation
- Uses jsPDF library for PDF creation
- html2canvas for high-quality rendering
- Maintains formatting and styling
- Optimized for A4 paper size

### Email Functionality
- Server-side PHP backend for direct email sending
- Fallback to mailto for universal compatibility
- HTML email templates with company branding
- Automatic email logging

### Data Storage
- LocalStorage for saving invoices
- Auto-save functionality
- No server dependency for basic functionality
- Privacy-focused (data stays on your device)

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement
- Graceful fallbacks

## Installation

### Basic Setup (Client-side only)
1. Copy `invoice-generator.html` and `invoice-generator.js` to your web server
2. Ensure CDN links are accessible (jsPDF, html2canvas, FontAwesome)
3. Open `invoice-generator.html` in your browser

### Advanced Setup (With Email Backend)
1. Upload files to a PHP-enabled web server
2. Configure email settings in `send_invoice.php`
3. Set up proper SMTP configuration on your server
4. Update the sender email address in the PHP file

## File Structure
```
├── invoice-generator.html      # Main HTML file
├── invoice-generator.js        # JavaScript functionality
└── send_invoice.php           # Email backend (optional)
```

## Configuration

### Currency Settings
Edit the `currencySymbols` object in `invoice-generator.js`:
```javascript
const currencySymbols = {
    'ZAR': 'R',
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
    // Add more currencies as needed
};
```

### Default Tax Rate
Change the default tax rate by modifying the HTML:
```html
<input type="number" id="taxRate" min="0" max="100" step="0.01" value="15">
```

### Email Configuration
Update `send_invoice.php` with your email settings:
```php
$from = 'noreply@yourdomain.com'; // Change to your domain
```

## Security Notes

### Client-Side Security
- All data processed client-side first
- No sensitive data sent to servers unnecessarily
- LocalStorage used for data persistence

### Server-Side Security (PHP Backend)
- Input validation and sanitization
- Email header injection prevention
- CSRF protection recommended for production
- Rate limiting recommended

## Browser Storage

The application uses localStorage to save:
- Invoice drafts (auto-save)
- Saved invoices
- Last invoice number
- Form preferences

## Troubleshooting

### PDF Generation Issues
- Ensure internet connection for CDN libraries
- Check browser console for JavaScript errors
- Try refreshing the page
- Verify all form fields are filled

### Email Issues
- Check PHP mail configuration on server
- Verify SMTP settings
- Check spam folders
- Fallback to mailto if server email fails

### Mobile Issues
- Use latest mobile browsers
- Ensure adequate screen size for form
- Touch-friendly interface provided

## Customization

### Styling
- Modify CSS variables in the HTML head
- Customize colors, fonts, and layout
- Add company-specific branding

### Functionality
- Add more currency support
- Customize email templates
- Add more invoice fields
- Integrate with accounting systems

## Support

For technical support or feature requests:
1. Check browser console for errors
2. Verify all dependencies are loaded
3. Test with different browsers
4. Contact your web developer for customizations

## License

This invoice generator is part of the ShadEl Web agency toolkit. 
Use freely for business purposes.

---

*Built with ❤️ for small businesses and freelancers*
