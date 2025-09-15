import re

# Read the file
with open('public/services.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Remove corrupted UTF-8 sequences that look like broken emojis
# These are common malformed UTF-8 patterns
content = re.sub(r'ð[^a-zA-Z0-9\s]*', '', content)
content = re.sub(r'â[^a-zA-Z0-9\s]*', '', content)
content = re.sub(r'Å[^a-zA-Z0-9\s]*', '', content)

# Remove any remaining sequences that start with these patterns
content = re.sub(r'Ÿ[^a-zA-Z0-9\s]*', '', content)

# Write the cleaned content back
with open('public/services.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("All corrupted characters removed successfully!")
