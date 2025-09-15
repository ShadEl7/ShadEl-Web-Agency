// Invoice Generator JavaScript
let invoiceCounter = 1;
let savedInvoices = JSON.parse(localStorage.getItem('savedInvoices')) || [];

// Currency symbols
const currencySymbols = {
    'ZAR': 'R',
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
};

// Initialize the form
document.addEventListener('DOMContentLoaded', function() {
    generateInvoiceNumber();
    setTodaysDate();
    updateInvoice();
    loadSavedInvoices();
});

// Generate unique invoice number
function generateInvoiceNumber() {
    const lastNumber = localStorage.getItem('lastInvoiceNumber') || 0;
    const newNumber = parseInt(lastNumber) + 1;
    document.getElementById('invoiceNumber').value = `INV-${String(newNumber).padStart(3, '0')}`;
    localStorage.setItem('lastInvoiceNumber', newNumber);
}

// Set today's date
function setTodaysDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invoiceDate').value = today;
    
    // Set due date to 30 days from today
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];
}

// Handle logo upload
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const logoPreview = document.getElementById('logoPreview');
            logoPreview.src = e.target.result;
            logoPreview.style.display = 'block';
            updateInvoice();
        };
        reader.readAsDataURL(file);
    }
}

// Add new item row
function addItem() {
    const container = document.getElementById('itemsContainer');
    const itemRow = document.createElement('div');
    itemRow.className = 'item-row';
    itemRow.innerHTML = `
        <div class="form-group">
            <label>Description:</label>
            <input type="text" class="item-description" placeholder="Item or service description" oninput="updateInvoice()">
        </div>
        <div class="form-group">
            <label>Quantity:</label>
            <input type="number" class="item-quantity" min="1" value="1" oninput="updateInvoice()">
        </div>
        <div class="form-group">
            <label>Rate:</label>
            <input type="number" class="item-rate" min="0" step="0.01" placeholder="0.00" oninput="updateInvoice()">
        </div>
        <div class="form-group">
            <label>Amount:</label>
            <input type="text" class="item-amount" readonly>
        </div>
        <div class="form-group">
            <label>&nbsp;</label>
            <button type="button" class="btn btn-danger" onclick="removeItem(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    container.appendChild(itemRow);
    updateInvoice();
}

// Remove item row
function removeItem(button) {
    const container = document.getElementById('itemsContainer');
    if (container.children.length > 1) {
        button.closest('.item-row').remove();
        updateInvoice();
    } else {
        alert('You must have at least one item.');
    }
}

// Update invoice preview
function updateInvoice() {
    updateCompanyInfo();
    updateClientInfo();
    updateInvoiceDetails();
    updateItems();
    updateTotals();
    updatePaymentInfo();
    updateStats();
}

// Update company information in preview
function updateCompanyInfo() {
    const companyName = document.getElementById('companyName').value || 'Your Company Name';
    const companyEmail = document.getElementById('companyEmail').value;
    const companyPhone = document.getElementById('companyPhone').value;
    const companyAddress = document.getElementById('companyAddress').value;
    
    document.getElementById('previewCompanyName').textContent = companyName;
    document.getElementById('previewCompanyEmail').textContent = companyEmail;
    document.getElementById('previewCompanyPhone').textContent = companyPhone;
    document.getElementById('previewCompanyAddress').textContent = companyAddress;
    
    // Update logo
    const logoPreview = document.getElementById('logoPreview');
    const previewLogo = document.getElementById('previewCompanyLogo');
    if (logoPreview.style.display !== 'none' && logoPreview.src) {
        previewLogo.innerHTML = `<img src="${logoPreview.src}" style="max-width: 150px; max-height: 80px; border-radius: 5px;">`;
    } else {
        previewLogo.innerHTML = '';
    }
}

// Update client information in preview
function updateClientInfo() {
    const clientName = document.getElementById('clientName').value || 'Client Name';
    const clientEmail = document.getElementById('clientEmail').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const clientAddress = document.getElementById('clientAddress').value;
    
    document.getElementById('previewClientName').textContent = clientName;
    document.getElementById('previewClientEmail').textContent = clientEmail;
    document.getElementById('previewClientPhone').textContent = clientPhone;
    document.getElementById('previewClientAddress').textContent = clientAddress;
}

// Update invoice details in preview
function updateInvoiceDetails() {
    const invoiceNumber = document.getElementById('invoiceNumber').value || 'INV-001';
    const invoiceDate = document.getElementById('invoiceDate').value;
    const dueDate = document.getElementById('dueDate').value;
    const paymentTerms = document.getElementById('paymentTerms').value;
    
    document.getElementById('previewInvoiceNumber').textContent = `#${invoiceNumber}`;
    document.getElementById('previewInvoiceDate').textContent = formatDate(invoiceDate);
    document.getElementById('previewDueDate').textContent = formatDate(dueDate);
    document.getElementById('previewPaymentTerms').textContent = paymentTerms;
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Update items in preview
function updateItems() {
    const itemRows = document.querySelectorAll('.item-row');
    const tableBody = document.getElementById('previewItemsTable');
    const currency = getCurrencySymbol();
    
    tableBody.innerHTML = '';
    
    itemRows.forEach(row => {
        const description = row.querySelector('.item-description').value || 'Sample Service';
        const quantity = parseFloat(row.querySelector('.item-quantity').value) || 1;
        const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
        const amount = quantity * rate;
        
        // Update amount field
        row.querySelector('.item-amount').value = formatCurrency(amount);
        
        // Add to preview table
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${description}</td>
            <td style="text-align: center;">${quantity}</td>
            <td style="text-align: right;">${formatCurrency(rate)}</td>
            <td style="text-align: right;">${formatCurrency(amount)}</td>
        `;
        tableBody.appendChild(tr);
    });
}

// Update totals
function updateTotals() {
    const itemRows = document.querySelectorAll('.item-row');
    let subtotal = 0;
    
    itemRows.forEach(row => {
        const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
        subtotal += quantity * rate;
    });
    
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + tax;
    
    document.getElementById('previewSubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('previewTax').textContent = formatCurrency(tax);
    document.getElementById('previewTotal').textContent = formatCurrency(total);
    document.getElementById('previewTaxRate').textContent = taxRate;
}

// Update payment information
function updatePaymentInfo() {
    const paymentLink = document.getElementById('paymentLink').value;
    const paymentLinkSection = document.getElementById('previewPaymentLink');
    
    if (paymentLink) {
        document.getElementById('paymentLinkUrl').href = paymentLink;
        paymentLinkSection.style.display = 'block';
    } else {
        paymentLinkSection.style.display = 'none';
    }
}

// Get currency symbol
function getCurrencySymbol() {
    const currency = document.getElementById('currency').value;
    return currencySymbols[currency] || 'R';
}

// Format currency
function formatCurrency(amount) {
    const symbol = getCurrencySymbol();
    return `${symbol} ${amount.toFixed(2)}`;
}

// Download PDF
async function downloadPDF() {
    try {
        // Show loading message
        const originalText = event.target.innerHTML;
        event.target.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
        event.target.disabled = true;
        
        const invoice = document.getElementById('invoicePreview');
        const canvas = await html2canvas(invoice, {
            scale: 2,
            useCORS: true,
            allowTaint: true
        });
        
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        const invoiceNumber = document.getElementById('invoiceNumber').value || 'INV-001';
        pdf.save(`${invoiceNumber}.pdf`);
        
        // Reset button
        event.target.innerHTML = originalText;
        event.target.disabled = false;
        
        showNotification('PDF downloaded successfully!', 'success');
    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('Error generating PDF. Please try again.', 'error');
        
        // Reset button
        event.target.innerHTML = originalText;
        event.target.disabled = false;
    }
}

// Save invoice to localStorage
function saveInvoice() {
    const invoiceData = {
        id: Date.now(),
        invoiceNumber: document.getElementById('invoiceNumber').value,
        date: new Date().toISOString(),
        companyName: document.getElementById('companyName').value,
        clientName: document.getElementById('clientName').value,
        total: calculateTotal(),
        currency: document.getElementById('currency').value,
        data: gatherFormData()
    };
    
    savedInvoices.push(invoiceData);
    localStorage.setItem('savedInvoices', JSON.stringify(savedInvoices));
    loadSavedInvoices();
    showNotification('Invoice saved successfully!', 'success');
}

// Gather all form data
function gatherFormData() {
    const formData = {
        // Company info
        companyName: document.getElementById('companyName').value,
        companyEmail: document.getElementById('companyEmail').value,
        companyPhone: document.getElementById('companyPhone').value,
        companyAddress: document.getElementById('companyAddress').value,
        
        // Client info
        clientName: document.getElementById('clientName').value,
        clientEmail: document.getElementById('clientEmail').value,
        clientPhone: document.getElementById('clientPhone').value,
        clientAddress: document.getElementById('clientAddress').value,
        
        // Invoice details
        invoiceNumber: document.getElementById('invoiceNumber').value,
        invoiceDate: document.getElementById('invoiceDate').value,
        dueDate: document.getElementById('dueDate').value,
        currency: document.getElementById('currency').value,
        taxRate: document.getElementById('taxRate').value,
        paymentTerms: document.getElementById('paymentTerms').value,
        paymentLink: document.getElementById('paymentLink').value,
        
        // Items
        items: []
    };
    
    const itemRows = document.querySelectorAll('.item-row');
    itemRows.forEach(row => {
        const item = {
            description: row.querySelector('.item-description').value,
            quantity: parseFloat(row.querySelector('.item-quantity').value) || 0,
            rate: parseFloat(row.querySelector('.item-rate').value) || 0
        };
        formData.items.push(item);
    });
    
    return formData;
}

// Calculate total
function calculateTotal() {
    const itemRows = document.querySelectorAll('.item-row');
    let subtotal = 0;
    
    itemRows.forEach(row => {
        const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
        subtotal += quantity * rate;
    });
    
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const tax = (subtotal * taxRate) / 100;
    return subtotal + tax;
}

// Load saved invoices
function loadSavedInvoices() {
    const container = document.getElementById('savedInvoicesList');
    
    if (savedInvoices.length === 0) {
        container.innerHTML = '<p style="color: #64748b; text-align: center; padding: 20px;">No saved invoices yet</p>';
        updateStats();
        return;
    }
    
    container.innerHTML = '';
    
    savedInvoices.reverse().forEach(invoice => {
        const item = document.createElement('div');
        item.className = 'saved-invoice-item';
        item.innerHTML = `
            <div>
                <strong>${invoice.invoiceNumber}</strong><br>
                <small>${invoice.clientName} - ${currencySymbols[invoice.currency] || 'R'} ${invoice.total.toFixed(2)}</small><br>
                <small>${new Date(invoice.date).toLocaleDateString()}</small>
            </div>
            <div>
                <button class="btn btn-primary" style="margin-right: 10px; padding: 5px 10px; font-size: 12px;" onclick="loadInvoice(${invoice.id})">
                    <i class="fas fa-edit"></i> Load
                </button>
                <button class="btn btn-danger" style="padding: 5px 10px; font-size: 12px;" onclick="deleteInvoice(${invoice.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(item);
    });
    
    savedInvoices.reverse(); // Restore original order
    updateStats();
}

// Load saved invoice
function loadInvoice(id) {
    const invoice = savedInvoices.find(inv => inv.id === id);
    if (!invoice) return;
    
    const data = invoice.data;
    
    // Load company info
    document.getElementById('companyName').value = data.companyName || '';
    document.getElementById('companyEmail').value = data.companyEmail || '';
    document.getElementById('companyPhone').value = data.companyPhone || '';
    document.getElementById('companyAddress').value = data.companyAddress || '';
    
    // Load client info
    document.getElementById('clientName').value = data.clientName || '';
    document.getElementById('clientEmail').value = data.clientEmail || '';
    document.getElementById('clientPhone').value = data.clientPhone || '';
    document.getElementById('clientAddress').value = data.clientAddress || '';
    
    // Load invoice details
    document.getElementById('invoiceNumber').value = data.invoiceNumber || '';
    document.getElementById('invoiceDate').value = data.invoiceDate || '';
    document.getElementById('dueDate').value = data.dueDate || '';
    document.getElementById('currency').value = data.currency || 'ZAR';
    document.getElementById('taxRate').value = data.taxRate || 15;
    document.getElementById('paymentTerms').value = data.paymentTerms || '';
    document.getElementById('paymentLink').value = data.paymentLink || '';
    
    // Clear existing items
    const container = document.getElementById('itemsContainer');
    container.innerHTML = '';
    
    // Load items
    if (data.items && data.items.length > 0) {
        data.items.forEach(item => {
            addItem();
            const lastRow = container.lastElementChild;
            lastRow.querySelector('.item-description').value = item.description || '';
            lastRow.querySelector('.item-quantity').value = item.quantity || 1;
            lastRow.querySelector('.item-rate').value = item.rate || 0;
        });
    } else {
        addItem(); // Add at least one item
    }
    
    updateInvoice();
    showNotification('Invoice loaded successfully!', 'success');
}

// Delete saved invoice
function deleteInvoice(id) {
    if (confirm('Are you sure you want to delete this invoice?')) {
        savedInvoices = savedInvoices.filter(inv => inv.id !== id);
        localStorage.setItem('savedInvoices', JSON.stringify(savedInvoices));
        loadSavedInvoices();
        showNotification('Invoice deleted successfully!', 'success');
    }
}

// Email invoice
async function emailInvoice() {
    const clientEmail = document.getElementById('clientEmail').value;
    const invoiceNumber = document.getElementById('invoiceNumber').value;
    const companyName = document.getElementById('companyName').value;
    
    if (!clientEmail) {
        showNotification('Please enter client email address.', 'error');
        return;
    }
    
    const subject = document.getElementById('emailSubject').value || `Invoice ${invoiceNumber} from ${companyName}`;
    const message = document.getElementById('emailMessage').value || `Dear Client,\n\nPlease find attached your invoice ${invoiceNumber}.\n\nThank you for your business!\n\nBest regards,\n${companyName}`;
    
    // Show loading message
    const originalText = event.target.innerHTML;
    event.target.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Email...';
    event.target.disabled = true;
    
    try {
        // Try to send via server backend first
        const response = await fetch('send_invoice.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: clientEmail,
                subject: subject,
                message: message,
                company_name: companyName,
                invoice_number: invoiceNumber
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                showNotification('Invoice email sent successfully!', 'success');
            } else {
                throw new Error(result.message);
            }
        } else {
            throw new Error('Server error');
        }
    } catch (error) {
        console.log('Server email failed, falling back to mailto:', error);
        
        // Fallback to mailto
        const mailtoLink = `mailto:${clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        
        // Open default email client
        window.location.href = mailtoLink;
        
        showNotification('Email client opened. Please attach the PDF manually.', 'info');
    } finally {
        // Reset button
        event.target.innerHTML = originalText;
        event.target.disabled = false;
    }
}

// Clear form
function clearForm() {
    if (confirm('Are you sure you want to clear all form data?')) {
        document.querySelectorAll('input, textarea, select').forEach(field => {
            if (field.type !== 'file') {
                field.value = '';
            }
        });
        
        // Reset to defaults
        document.getElementById('currency').value = 'ZAR';
        document.getElementById('taxRate').value = '15';
        
        // Clear logo
        const logoPreview = document.getElementById('logoPreview');
        logoPreview.style.display = 'none';
        logoPreview.src = '';
        
        // Reset items to one row
        const container = document.getElementById('itemsContainer');
        container.innerHTML = '';
        addItem();
        
        generateInvoiceNumber();
        setTodaysDate();
        updateInvoice();
        
        showNotification('Form cleared successfully!', 'success');
    }
}

// Show notification
function showNotification(message, type = 'info') {
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
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    `;
    
    // Set color based on type
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            break;
        case 'info':
            notification.style.background = 'linear-gradient(135deg, #38bdf8, #0ea5e9)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #64748b, #475569)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Auto-save functionality
let autoSaveTimer;
function autoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        const formData = gatherFormData();
        localStorage.setItem('invoiceAutoSave', JSON.stringify(formData));
    }, 2000);
}

// Load auto-saved data on page load
function loadAutoSave() {
    const autoSaved = localStorage.getItem('invoiceAutoSave');
    if (autoSaved && confirm('Restore previously entered data?')) {
        const data = JSON.parse(autoSaved);
        loadInvoiceData(data);
    }
}

// Load invoice data into form
function loadInvoiceData(data) {
    Object.keys(data).forEach(key => {
        const element = document.getElementById(key);
        if (element && key !== 'items') {
            element.value = data[key] || '';
        }
    });
    
    // Load items if present
    if (data.items && data.items.length > 0) {
        const container = document.getElementById('itemsContainer');
        container.innerHTML = '';
        
        data.items.forEach(item => {
            addItem();
            const lastRow = container.lastElementChild;
            lastRow.querySelector('.item-description').value = item.description || '';
            lastRow.querySelector('.item-quantity').value = item.quantity || 1;
            lastRow.querySelector('.item-rate').value = item.rate || 0;
        });
    }
    
    updateInvoice();
}

// Add event listeners for auto-save
document.addEventListener('DOMContentLoaded', function() {
    // Add input event listeners for auto-save
    document.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('input', autoSave);
    });
    
    // Load auto-saved data
    setTimeout(loadAutoSave, 1000);
});

// Export functions for global access
window.handleLogoUpload = handleLogoUpload;
window.addItem = addItem;
window.removeItem = removeItem;
window.updateInvoice = updateInvoice;
window.downloadPDF = downloadPDF;
window.saveInvoice = saveInvoice;
window.loadInvoice = loadInvoice;
window.deleteInvoice = deleteInvoice;
window.emailInvoice = emailInvoice;
window.clearForm = clearForm;

// Quick action functions
window.fillSampleData = fillSampleData;
window.duplicateLastInvoice = duplicateLastInvoice;
window.generateNewNumber = generateNewNumber;
window.exportData = exportData;

// Quick Actions Implementation
function fillSampleData() {
    if (confirm('This will replace current data with sample data. Continue?')) {
        // Company data
        document.getElementById('companyName').value = 'ShadEl Web Design';
        document.getElementById('companyEmail').value = 'hello@shadelweb.com';
        document.getElementById('companyPhone').value = '+27 12 345 6789';
        document.getElementById('companyAddress').value = 'Cape Town, South Africa\nProfessional Web Development Services';
        
        // Client data
        document.getElementById('clientName').value = 'ABC Marketing Solutions';
        document.getElementById('clientEmail').value = 'accounts@abcmarketing.co.za';
        document.getElementById('clientPhone').value = '+27 11 987 6543';
        document.getElementById('clientAddress').value = 'Johannesburg, South Africa\nBusiness District';
        
        // Invoice details
        document.getElementById('currency').value = 'ZAR';
        document.getElementById('taxRate').value = '15';
        document.getElementById('paymentTerms').value = 'Net 30 days';
        
        // Clear existing items and add sample items
        const container = document.getElementById('itemsContainer');
        container.innerHTML = '';
        
        // Add sample items
        addItem();
        let lastRow = container.lastElementChild;
        lastRow.querySelector('.item-description').value = 'Website Development - Business Website';
        lastRow.querySelector('.item-quantity').value = '1';
        lastRow.querySelector('.item-rate').value = '15000';
        
        addItem();
        lastRow = container.lastElementChild;
        lastRow.querySelector('.item-description').value = 'SEO Optimization Package';
        lastRow.querySelector('.item-quantity').value = '1';
        lastRow.querySelector('.item-rate').value = '2500';
        
        addItem();
        lastRow = container.lastElementChild;
        lastRow.querySelector('.item-description').value = 'Logo Design & Branding';
        lastRow.querySelector('.item-quantity').value = '1';
        lastRow.querySelector('.item-rate').value = '3500';
        
        updateInvoice();
        showNotification('Sample data loaded successfully!', 'success');
    }
}

function duplicateLastInvoice() {
    if (savedInvoices.length === 0) {
        showNotification('No saved invoices to duplicate.', 'error');
        return;
    }
    
    const lastInvoice = savedInvoices[savedInvoices.length - 1];
    loadInvoiceData(lastInvoice.data);
    
    // Generate new invoice number and reset dates
    generateInvoiceNumber();
    setTodaysDate();
    
    updateInvoice();
    showNotification('Last invoice duplicated successfully!', 'success');
}

function generateNewNumber() {
    generateInvoiceNumber();
    updateInvoice();
    showNotification('New invoice number generated!', 'info');
}

function exportData() {
    const data = {
        invoiceData: gatherFormData(),
        savedInvoices: savedInvoices,
        exportDate: new Date().toISOString(),
        appVersion: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Invoice data exported successfully!', 'success');
}

// Update stats display
function updateStats() {
    document.getElementById('totalInvoicesCount').textContent = savedInvoices.length;
    
    const total = calculateTotal();
    const currency = getCurrencySymbol();
    document.getElementById('currentTotal').textContent = `${currency} ${total.toFixed(2)}`;
    
    // Update auto-save status
    const statusEl = document.getElementById('autoSaveStatus');
    const indicator = statusEl.querySelector('.status-indicator');
    
    if (localStorage.getItem('invoiceAutoSave')) {
        indicator.className = 'status-indicator status-auto-saved';
        statusEl.innerHTML = '<span class="status-indicator status-auto-saved"></span> Auto-Saved';
    } else {
        indicator.className = 'status-indicator status-saved';
        statusEl.innerHTML = '<span class="status-indicator status-saved"></span> Ready';
    }
}
