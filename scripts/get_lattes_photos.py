import os
import glob
import re
import urllib.request

TEAM_DIR = "src/content/team"
IMG_DIR = "public/images/team"

os.makedirs(IMG_DIR, exist_ok=True)

for md_path in glob.glob(os.path.join(TEAM_DIR, "*.md")):
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    has_valid_photo = False
    
    if "\nfoto:" in content:
        foto_match = re.search(r'foto:\s*"([^"]+)"', content)
        if foto_match:
            img_path = "public" + foto_match.group(1)
            if os.path.exists(img_path):
                has_valid_photo = True

    if has_valid_photo:
        continue
                
    lattes_match = re.search(r'http://lattes\.cnpq\.br/(\d{16})', content)
    if not lattes_match:
        print(f"Skipping {os.path.basename(md_path)} - no valid Lattes ID found")
        continue
    
    lattes_id = lattes_match.group(1)
    basename = os.path.basename(md_path).replace('.md', '')
    img_dest = os.path.join(IMG_DIR, f"{basename}.jpg")
    
    url = f"http://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?id={lattes_id}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(img_dest, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        
        if os.path.getsize(img_dest) > 1000: # ensure it is not a 1kb empty image
            print(f"Downloaded photo for {basename} from {url}")
            
            if "\nfoto:" not in content:
                # Add foto property
                if "\nbio:" in content:
                    new_content = re.sub(r'(\nbio:\s*".*?"\n)', r'\1foto: "/images/team/' + basename + '.jpg"\n', content)
                elif "\ncargo:" in content:
                    new_content = re.sub(r'(\ncargo:\s*".*?"\n)', r'\1foto: "/images/team/' + basename + '.jpg"\n', content)
                else:
                    new_content = content # Fallback (should not happen)
                    
                if new_content != content:
                    with open(md_path, "w", encoding="utf-8") as f:
                        f.write(new_content)
        else:
            print(f"Photo too small for {basename}, removing.")
            os.remove(img_dest)
            
    except Exception as e:
        print(f"Failed to download for {basename}: {e}")
