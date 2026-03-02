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

    # Skip if already has LinkedIn or Lattes
    if "linkedin.com" in content or "lattes.cnpq.br" in content:
        continue
        
    name_match = re.search(r'nome:\s*"(?:Prof\.\s*|Dr\.\s*|Prof\.\s*Dr\.\s*|Prof\.ª\s*Dr\.ª\s*|Dr\.ª\s*)*([^"]+)"', content)
    if not name_match:
        name_match = re.search(r'nome:\s*"([^"]+)"', content)
        if not name_match:
            continue
            
    name = name_match.group(1).replace("Prof.", "").replace("Dr.", "").replace("ª", "").strip()
    
    q = urllib.parse.quote(f'"{name}" linkedin LAPAN OR UFMG OR PUC')
    url = f"https://html.duckduckgo.com/html/?q={q}"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        res = urllib.request.urlopen(req)
        html = res.read().decode('utf-8')
        
        l_match = re.search(r'https?://(br\.)?linkedin\.com/in/([a-zA-Z0-9_-]+)', html)
        if l_match:
            linkedin_url = l_match.group(0)
            print(f"[{os.path.basename(md_path)}] Found LinkedIn: {linkedin_url} for {name}")
            
            if "links:" not in content:
                new_content = content.replace("---\n\n", f"links:\n  - rotulo: \"LinkedIn\"\n    url: \"{linkedin_url}\"\n---\n\n")
                if new_content == content:
                     new_content = content.replace("\n---", f"\nlinks:\n  - rotulo: \"LinkedIn\"\n    url: \"{linkedin_url}\"\n---", 1)
            else:
                new_content = content.replace("links:\n", f"links:\n  - rotulo: \"LinkedIn\"\n    url: \"{linkedin_url}\"\n")
            
            with open(md_path, "w", encoding="utf-8") as w:
                w.write(new_content)
        else:
            print(f"[{os.path.basename(md_path)}] No LinkedIn found for {name}")
    except Exception as e:
        print(f"Error for {name}: {e}")
        
    time.sleep(1.5)
