# Script to remove corrupted UTF-8 characters by replacing them with nothing
$filePath = "public\services.html"
$content = Get-Content -Path $filePath -Raw -Encoding UTF8

# Remove corrupted checkmark characters
$content = $content -replace [char]0x00E2 + [char]0x009C + [char]0x0093, ''

# Remove corrupted mobile phone emoji
$content = $content -replace [char]0x00F0 + [char]0x009F + [char]0x0093 + [char]0x00B1, ''

# Remove corrupted lock emoji  
$content = $content -replace [char]0x00F0 + [char]0x009F + [char]0x0093 + [char]0x0092, ''

# Save the cleaned content
$content | Set-Content -Path $filePath -Encoding UTF8

Write-Host "Corrupted characters removed successfully!"
