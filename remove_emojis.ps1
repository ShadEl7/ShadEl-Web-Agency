# PowerShell script to remove emojis from HTML files

$htmlFiles = @("public\index.html", "public\about.html", "public\services.html", "public\contact.html", "public\portfolio.html", "public\pricing.html")

foreach ($file in $htmlFiles) {
    if (Test-Path $file) {
        Write-Host "Processing $file..."
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Remove specific emojis found in the files
        $content = $content -replace "🚀", ""
        $content = $content -replace "🎯", ""
        $content = $content -replace "✨", ""
        $content = $content -replace "🎨", ""
        $content = $content -replace "⚡", ""
        $content = $content -replace "ðŸ'¼", ""
        $content = $content -replace "â­", ""
        $content = $content -replace "💬", ""
        $content = $content -replace "✕", "×"
        $content = $content -replace "👋", ""
        $content = $content -replace "🤔", ""
        $content = $content -replace "📞", ""
        $content = $content -replace "💰", ""
        $content = $content -replace "📱", ""
        $content = $content -replace "⛪", ""
        $content = $content -replace "🛒", ""
        $content = $content -replace "âœ"", "✓"
        
        # Remove any remaining Unicode emojis using regex
        $content = $content -replace "[\u{1F600}-\u{1F64F}]", ""  # Emoticons
        $content = $content -replace "[\u{1F300}-\u{1F5FF}]", ""  # Misc Symbols and Pictographs
        $content = $content -replace "[\u{1F680}-\u{1F6FF}]", ""  # Transport and Map
        $content = $content -replace "[\u{1F1E0}-\u{1F1FF}]", ""  # Regional indicators
        $content = $content -replace "[\u{2600}-\u{26FF}]", ""   # Misc symbols
        $content = $content -replace "[\u{2700}-\u{27BF}]", ""   # Dingbats
        $content = $content -replace "[\u{1F900}-\u{1F9FF}]", ""  # Supplemental Symbols and Pictographs
        $content = $content -replace "[\u{1FA00}-\u{1FA6F}]", ""  # Chess Symbols
        $content = $content -replace "[\u{1FA70}-\u{1FAFF}]", ""  # Symbols and Pictographs Extended-A
        
        Set-Content $file $content -Encoding UTF8
        Write-Host "Completed $file"
    }
}

Write-Host "All emojis removed successfully!"
