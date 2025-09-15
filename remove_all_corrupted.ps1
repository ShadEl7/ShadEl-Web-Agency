# Comprehensive script to remove all corrupted UTF-8 emoji characters
$filePath = "public\services.html"
$content = Get-Content -Path $filePath -Raw -Encoding UTF8

# Remove all occurrences that start with corrupted emoji patterns
$content = $content -replace 'ðŸ[^a-zA-Z0-9\s]*', ''
$content = $content -replace 'âœ[^a-zA-Z0-9\s]*', ''

# Also remove specific patterns we know are problematic
$patterns = @(
    'ðŸ"±',
    'ðŸ"'',
    'ðŸ'¼',
    'ðŸ¢',
    'ðŸ›ï¸',
    'ðŸ¤',
    'âœ"'
)

foreach ($pattern in $patterns) {
    $content = $content -replace [regex]::Escape($pattern), ''
}

# Save the cleaned content
$content | Set-Content -Path $filePath -Encoding UTF8

Write-Host "All corrupted emoji characters removed successfully!"
