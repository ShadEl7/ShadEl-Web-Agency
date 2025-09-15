# PowerShell script to update remaining pages with enhanced sidebar, footer, and chatbot

$pages = @("services.html", "portfolio.html", "contact.html", "pricing.html")
$publicPath = "c:\Users\bugsy\Downloads\web-agency\public\"

foreach ($page in $pages) {
    $fullPath = Join-Path $publicPath $page
    
    if (Test-Path $fullPath) {
        Write-Host "Processing $page..." -ForegroundColor Green
        
        # Create backup
        Copy-Item $fullPath "$fullPath.backup"
        
        # Read content
        $content = Get-Content $fullPath -Raw
        
        # Update sidebar references - change "2020" to "2025" if found
        $content = $content -replace "Since 2020", "Since 2025"
        
        # Update social links - replace Twitter with Instagram if found
        $content = $content -replace "fab fa-twitter", "fab fa-instagram"
        $content = $content -replace "Twitter", "Instagram"
        
        Write-Output $content | Out-File $fullPath -Encoding UTF8
        
        Write-Host "Updated $page" -ForegroundColor Cyan
    } else {
        Write-Host "File not found: $page" -ForegroundColor Red
    }
}

Write-Host "`nSummary of changes made:" -ForegroundColor Yellow
Write-Host "- Changed 'Since 2020' to 'Since 2025'" -ForegroundColor White
Write-Host "- Replaced Twitter with Instagram in social links" -ForegroundColor White
Write-Host "- Backup files created with .backup extension" -ForegroundColor White
Write-Host "`nNote: Full sidebar/footer/chatbot integration requires manual CSS and HTML updates" -ForegroundColor Yellow
