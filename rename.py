import os

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content.replace('Fileverse', 'fileverze').replace('FILEVERSE', 'FILEVERZE').replace('FileVerse', 'fileverze').replace('fileverse', 'fileverze')
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        pass

for root, _, files in os.walk('frontend'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.html') or file.endswith('.js') or file.endswith('.md'):
            replace_in_file(os.path.join(root, file))
