
import sys

try:
    with open('old_App.tsx', 'rb') as f:
        content = f.read()
    
    # Try different encodings
    for encoding in ['utf-16', 'utf-16le', 'utf-16be', 'utf-8']:
        try:
            decoded = content.decode(encoding)
            with open('old_App_fixed.tsx', 'w', encoding='utf-8') as f:
                f.write(decoded)
            print(f"Successfully decoded using {encoding}")
            sys.exit(0)
        except Exception:
            continue
    print("Failed to decode using standard encodings")
    sys.exit(1)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
