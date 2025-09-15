# Simple script to remove corrupted characters
$content = Get-Content -Path "public\services.html" -Raw -Encoding UTF8

# Remove the specific corrupted characters you mentioned
$content = $content -replace 'ðŸ"±', ''
$content = $content -replace 'âœ"', ''

# Also remove any other common corrupted emoji sequences
$content = $content -replace 'ðŸ"'', ''
$content = $content -replace 'ðŸ'¼', ''
$content = $content -replace 'ðŸ¢', ''
$content = $content -replace 'ðŸ›ï¸', ''
$content = $content -replace 'ðŸ¤', ''

# Save the file
$content | Set-Content -Path "public\services.html" -Encoding UTF8

Write-Host "Corrupted characters removed successfully!"
