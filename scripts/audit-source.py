"""Read-only inventory of the public Fossil website; caches pages for migration."""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urljoin, urlparse, urldefrag
from concurrent.futures import ThreadPoolExecutor, as_completed
from bs4 import BeautifulSoup
import json, re

ROOT=Path(__file__).resolve().parents[1]
CACHE=ROOT/'output'/'source-audit'
CACHE.mkdir(parents=True,exist_ok=True)
BASE='https://fossilpk.com/'
def normalize(url):
 p=urlparse(url)
 if p.hostname not in ['fossilpk.com','www.fossilpk.com']: return None
 if p.query or any(x in p.path for x in ['/wp-','/feed','/author/','/category/','/tag/']): return None
 if re.search(r'\.[a-zA-Z0-9]{2,5}$',p.path): return None
 return BASE+p.path.strip('/')+'/' if p.path.strip('/') else BASE
def fetch(url):
 slug=urlparse(url).path.strip('/') or 'home'
 file=CACHE/(slug.replace('/','--')+'.html')
 try:
  if file.exists(): html=file.read_text(encoding='utf-8')
  else:
   with urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0 (content migration review)'}),timeout=35) as r: html=r.read().decode('utf-8',errors='replace')
   file.write_text(html,encoding='utf-8')
  s=BeautifulSoup(html,'html.parser')
  links={normalize(urljoin(url,a['href'])) for a in s.select('a[href]')}
  return {'url':url,'slug':slug,'title':s.title.get_text(' ',strip=True) if s.title else slug,'file':str(file),'links':sorted(x for x in links if x),'error':None}
 except Exception as e:return {'url':url,'slug':slug,'error':str(e),'links':[]}
seed=BeautifulSoup((ROOT/'output'/'fossil-source.html').read_text(encoding='utf-8'),'html.parser')
pending={BASE}|{u for a in seed.select('a[href]') if (u:=normalize(urljoin(BASE,a['href'])))}
seen=set(); records=[]
for depth in range(3):
 batch=sorted(pending-seen);seen.update(batch);pending=set()
 if not batch:break
 with ThreadPoolExecutor(max_workers=5) as pool:
  for f in as_completed([pool.submit(fetch,u) for u in batch]):
   r=f.result(); records.append(r); pending.update(r['links']); print(r['slug'],r['error'] or 'OK',flush=True)
(CACHE/'inventory.json').write_text(json.dumps(sorted(records,key=lambda r:r['slug']),indent=2),encoding='utf-8')
print('TOTAL',len(records),'ERRORS',sum(bool(r['error']) for r in records))
