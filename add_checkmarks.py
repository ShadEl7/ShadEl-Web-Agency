import re

# Read the file
with open('public/services.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all list items that start with just a space with checkmark
content = re.sub(r'<li> ', '<li>✓ ', content)

# Write the cleaned content back
with open('public/services.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("All list items updated with checkmarks!")
