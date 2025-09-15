# Fix emoji encoding issues in services.html
$filePath = "c:\Users\bugsy\Downloads\web-agency\public\services.html"

# Read the file content
$content = Get-Content -Path $filePath -Raw -Encoding UTF8

# Fix emoji encoding issues
$content = $content -replace "ðŸš€", "🚀"
$content = $content -replace "ðŸŽ¯", "🎯"
$content = $content -replace "âœ¨", "✨"
$content = $content -replace "ðŸŽ¨", "🎨"
$content = $content -replace "âš¡", "⚡"
$content = $content -replace "ðŸ"'", "🔒"
$content = $content -replace "ðŸ"±", "📱"
$content = $content -replace "ðŸ'¼", "💼"
$content = $content -replace "â­", "⭐"
$content = $content -replace "ðŸ›ï¸", "🏛️"
$content = $content -replace "ðŸ¤", "🤝"
$content = $content -replace "ðŸŒ", "🌍"
$content = $content -replace "ðŸª", "🏪"
$content = $content -replace "ðŸ¬", "🏬"
$content = $content -replace "ðŸ"", "🔍"
$content = $content -replace "ðŸ"Š", "📊"
$content = $content -replace "ðŸ¢", "🏢"
$content = $content -replace "ðŸ½ï¸", "🍽️"
$content = $content -replace "ðŸšš", "🚚"
$content = $content -replace "âœ"", "✓"
$content = $content -replace "âœ—", "✗"
$content = $content -replace "ðŸŽ", "🎁"
$content = $content -replace "â€"", "—"
$content = $content -replace "â€"", "–"

# Write the fixed content back to the file
Set-Content -Path $filePath -Value $content -Encoding UTF8

Write-Host "Fixed emoji encoding issues in services.html"
