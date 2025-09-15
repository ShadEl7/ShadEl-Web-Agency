$file = "public\services.html"
$encoding = [System.Text.Encoding]::UTF8

# Read the file as bytes first, then decode as UTF-8
$bytes = [System.IO.File]::ReadAllBytes($file)
$content = $encoding.GetString($bytes)

# Try various encoding fixes
$content = $content -replace [char]0x201C + [char]0x0153 + [char]0x201D, [char]0x2713  # Fix checkmark
$content = $content -replace 'âœ"', '✓'
$content = $content -replace 'âœ—', '✗'

# Write back with UTF-8 encoding
[System.IO.File]::WriteAllText($file, $content, $encoding)

Write-Host "Fixed encoding issues"
