# Final comprehensive emoji fix for services.html
$content = Get-Content -Path "public\services.html" -Raw -Encoding UTF8

# Replace all corrupted checkmarks with proper Unicode checkmarks
$content = $content -replace 'âœ"', '✓'

# Replace specific corrupted emojis that are visible in the UI
$content = $content -replace 'ðŸŽ', '🎁'
$content = $content -replace 'ðŸ"', '🔒'
$content = $content -replace 'ðŸ"±', '📱'

# Save the file with proper UTF-8 encoding
$content | Set-Content -Path "public\services.html" -Encoding UTF8

Write-Host "Critical emoji fixes applied successfully!"
