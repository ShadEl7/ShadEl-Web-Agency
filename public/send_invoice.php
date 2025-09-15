<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

// Validate required fields
$required_fields = ['to', 'subject', 'message', 'company_name'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
        exit;
    }
}

$to = filter_var($input['to'], FILTER_VALIDATE_EMAIL);
$subject = filter_var($input['subject'], FILTER_SANITIZE_STRING);
$message = filter_var($input['message'], FILTER_SANITIZE_STRING);
$company_name = filter_var($input['company_name'], FILTER_SANITIZE_STRING);
$invoice_number = filter_var($input['invoice_number'] ?? 'N/A', FILTER_SANITIZE_STRING);

if (!$to) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Set the sender email (you should configure this)
$from = 'noreply@yourdomain.com'; // Change this to your domain
$headers = [
    'From: ' . $company_name . ' <' . $from . '>',
    'Reply-To: ' . $from,
    'Content-Type: text/html; charset=UTF-8',
    'MIME-Version: 1.0'
];

// Create HTML email template
$html_message = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>' . htmlspecialchars($subject) . '</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e293b, #334155); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f8f9fa; }
        .footer { padding: 15px; text-align: center; color: #666; font-size: 12px; }
        .invoice-info { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>' . htmlspecialchars($company_name) . '</h1>
            <h2>Invoice ' . htmlspecialchars($invoice_number) . '</h2>
        </div>
        <div class="content">
            <div class="invoice-info">
                <p>' . nl2br(htmlspecialchars($message)) . '</p>
            </div>
        </div>
        <div class="footer">
            <p>This is an automated message from ' . htmlspecialchars($company_name) . '</p>
            <p>Thank you for your business!</p>
        </div>
    </div>
</body>
</html>';

// Send the email
$success = mail($to, $subject, $html_message, implode("\r\n", $headers));

if ($success) {
    // Log the email (optional)
    $log_entry = date('Y-m-d H:i:s') . " - Email sent to: $to, Subject: $subject, Invoice: $invoice_number\n";
    file_put_contents('email_log.txt', $log_entry, FILE_APPEND | LOCK_EX);
    
    echo json_encode([
        'success' => true, 
        'message' => 'Invoice email sent successfully!'
    ]);
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to send email. Please check your server mail configuration.'
    ]);
}
?>
