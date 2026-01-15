
import subprocess
import re

try:
    # Get the content of the initial commit for src/App.tsx
    content = subprocess.check_output(['git', 'show', '0a8d02a:src/App.tsx'], stderr=subprocess.STDOUT)
    # Decode as UTF-8 or similar
    text = content.decode('utf-8', errors='ignore')
    
    # Find all ASINs (B0 followed by 8 alphanumeric)
    asins = re.findall(r'B0[A-Z0-9]{8}', text)
    print("Found ASINs in 0a8d02a:src/App.tsx:", set(asins))
    
    # Search for any line with getAmazonLink
    links = re.findall(r'getAmazonLink\(.*?\)', text)
    print("Found links in 0a8d02a:src/App.tsx:", set(links))

except Exception as e:
    print(f"Error: {e}")
