import os
import glob
import re
import time
import urllib.request
import urllib.parse

TEAM_DIR = "src/content/team"

for md_path in glob.glob(os.path.join(TEAM_DIR, "*.md")):
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Skip if already has Lattes
    if "lattes.cnpq.br" in content:
        continue
        
    name_match = re.search(r'nome:\s*"(?:Prof\.\s*|Dr\.\s*|Prof\.\s*Dr\.\s*|Prof\.ª\s*Dr\.ª\s*|Dr\.ª\s*)*([^"]+)"', content)
    if not name_match:
        name_match = re.search(r'nome:\s*"([^"]+)"', content)
        if not name_match:
            continue
    name = name_match.group(1).replace("Prof.", "").replace("Dr.", "").replace("ª", "").strip()
    
    q = urllib.parse.quote(f"{name} lattes cnpq")
    url = f"https://html.duckduckgo.com/html/?q={q}"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        res = urllib.request.urlopen(req)
        html = res.read().decode('utf-8')
        
        l_match = re.search(r'http://lattes\.cnpq\.br/(\d{16})', html)
        if l_match:
            lattes_id = l_match.group(1)
            print(f"[{os.path.basename(md_path)}] Found Lattes: {lattes_id} for {name}")
            
            if "links:" not in content:
                new_content = content.replace("---\n\n", f"links:\n  - rotulo: \"Lattes\"\n    url: \"http://lattes.cnpq.br/{lattes_id}\"\n---\n\n")
                if new_content == content:
                     new_content = content.replace("\n---", f"\nlinks:\n  - rotulo: \"Lattes\"\n    url: \"http://lattes.cnpq.br/{lattes_id}\"\n---", 1)
            else:
                new_content = content.replace("links:\n", f"links:\n  - rotulo: \"Lattes\"\n    url: \"http://lattes.cnpq.br/{lattes_id}\"\n")
            
            with open(md_path, "w", encoding="utf-8") as w:
                w.write(new_content)
        else:
            print(f"[{os.path.basename(md_path)}] No Lattes found for {name}")
    except Exception as e:
        print(f"Error for {name}: {e}")
        
    time.sleep(1.5)
