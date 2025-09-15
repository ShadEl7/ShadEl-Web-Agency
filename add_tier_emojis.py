import re

# Read the file
with open('public/services.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add emojis to pricing tiers that don't have them
replacements = [
    # Community/Organization tiers
    ('<div class="tier"> <strong>Community:</strong>', '<div class="tier">🏛️ <strong>Community:</strong>'),
    ('<div class="tier"> <strong>Organization:</strong>', '<div class="tier">🤝 <strong>Organization:</strong>'),
    ('<div class="tier"> <strong>Network:</strong>', '<div class="tier">🌍 <strong>Network:</strong>'),
    
    # E-commerce tiers
    ('<div class="tier"> <strong>Starter Store:</strong>', '<div class="tier">🏪 <strong>Starter Store:</strong>'),
    ('<div class="tier"> <strong>Business Store:</strong>', '<div class="tier">🏬 <strong>Business Store:</strong>'),
    ('<div class="tier"> <strong>Enterprise Store:</strong>', '<div class="tier">🏢 <strong>Enterprise Store:</strong>'),
    
    # Job portal tiers
    ('<div class="tier"> <strong>Basic:</strong>', '<div class="tier">📋 <strong>Basic:</strong>'),
    ('<div class="tier"> <strong>Pro:</strong>', '<div class="tier">📊 <strong>Pro:</strong>'),
    ('<div class="tier"> <strong>Enterprise:</strong>', '<div class="tier">🏢 <strong>Enterprise:</strong>'),
    
    # Restaurant tiers
    ('<div class="tier"> <strong>Menu:</strong>', '<div class="tier">🍽️ <strong>Menu:</strong>'),
    ('<div class="tier"> <strong>Delivery:</strong>', '<div class="tier">🚚 <strong>Delivery:</strong>'),
    ('<div class="tier"> <strong>Full Restaurant:</strong>', '<div class="tier">🏢 <strong>Full Restaurant:</strong>'),
]

for old, new in replacements:
    content = content.replace(old, new)

# Write the cleaned content back
with open('public/services.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("All pricing tiers updated with emojis!")
