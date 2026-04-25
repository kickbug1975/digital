import os
import glob

replacements = {
    'Digital Technology <span class="text-on-surface-variant font-normal">| Humain &amp; IA</span>': 'Humain &amp; IA',
    'Digital Technology <span class="text-[#afc6ff] font-normal">| Humain &amp; IA</span>': 'Humain &amp; IA',
    'Digital Technology présente Humain & IA': 'Humain & IA',
    'Digital Technology présente Humain &amp; IA': 'Humain &amp; IA',
    'Digital Technology - Humain & IA': 'Humain & IA',
    'Humain &amp; IA | Digital Technology': 'Humain &amp; IA',
    'Humain & IA by Digital Technology': 'Humain & IA',
    'L\'Expertise Digital Technology': 'L\'Expertise Humain & IA',
    'L\'équipe Digital Technology': 'L\'équipe Humain & IA',
    'Équipe IT Digital Technology': 'Équipe IT Humain & IA',
    'Logo Digital Technology': 'Logo Humain & IA',
    'Digital Technology': 'Humain & IA'
}

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
