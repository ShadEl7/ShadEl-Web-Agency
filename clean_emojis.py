import re

# Read the file
with open('public/services.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove all the corrupted emoji patterns
patterns_to_remove = [
    'ðŸ"±',
    'ðŸ"'',
    'ðŸ'¼', 
    'ðŸ¢',
    'ðŸ›ï¸',
    'ðŸ¤',
    'âœ"'
]

for pattern in patterns_to_remove:
    content = content.replace(pattern, '')

# Also remove any remaining corrupted patterns starting with those sequences
content = re.sub(r'ðŸ[^\w\s]*', '', content)
content = re.sub(r'âœ[^\w\s]*', '', content)

# Write the cleaned content back
with open('public/services.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("All corrupted characters removed successfully!")
