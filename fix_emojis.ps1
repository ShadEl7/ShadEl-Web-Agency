# PowerShell script to fix emoji encoding issues in services.html

$filePath = "public\services.html"

# Read the file content
$content = Get-Content -Path $filePath -Encoding UTF8 -Raw

# Replace corrupted emojis with proper Unicode characters
$content = $content -replace 'âœ""', '✓'
$content = $content -replace 'âœ"', '✓'
$content = $content -replace 'âœ—', '✗'
$content = $content -replace 'ðŸ'', '🔒'
$content = $content -replace 'ðŸ"±', '📱'
$content = $content -replace 'ï¿½', '📦'
$content = $content -replace 'â­', '⭐'
$content = $content -replace 'â°', '⏰'
$content = $content -replace 'ðŸ'¼', '💼'
$content = $content -replace 'ðŸš€', '🚀'
$content = $content -replace 'ðŸ¢', '🏢'
$content = $content -replace 'ðŸŽ"', '🎓'
$content = $content -replace 'ðŸ›ï¸', '🏛️'
$content = $content -replace 'ðŸ¤', '🤝'
$content = $content -replace 'ðŸŒ', '🌍'
$content = $content -replace 'ðŸ½ï¸', '🍽️'
$content = $content -replace 'ðŸšš', '🚚'
$content = $content -replace 'ðŸª', '🏪'
$content = $content -replace 'ðŸ"', '🔍'
$content = $content -replace 'ðŸ"Š', '📊'
$content = $content -replace 'ðŸ'°', '💰'
$content = $content -replace 'ðŸŽ', '🎁'

# Write the corrected content back to the file
$content | Set-Content -Path $filePath -Encoding UTF8

Write-Host "Emoji encoding issues fixed in $filePath"
