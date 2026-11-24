"""Preserve source illustrations, galleries, and document links without embedding source HTML."""
from pathlib import Path
from urllib.parse import urljoin,urlparse,unquote
from urllib.request import Request,urlopen
from concurrent.futures import ThreadPoolExecutor,as_completed
from bs4 import BeautifulSoup
import re,json,hashlib,base64
ROOT=Path(__file__).resolve().parents[1]
CACHE=ROOT/'output/source-audit'; DEST=ROOT/'public/source-media';DEST.mkdir(exist_ok=True)
pages={};assets={}
for file in CACHE.glob('*.html'):
 s=BeautifulSoup(file.read_text(encoding='utf-8'),'html.parser')
 main=s.select_one('[data-elementor-type="wp-page"]')
 if not main:
  roots=s.select('[data-elementor-type="wp-post"]')
  main=max(roots,key=lambda e:len(e.get_text()),default=s)
 images=[];documents=[];seen=set()
 for img in main.select('img'):
  src=img.get('data-lazyload') or img.get('data-src') or img.get('src','')
  src=urljoin('https://fossilpk.com/',src).replace('http://fossilpk.com','https://fossilpk.com')
  if '/wp-content/uploads/' not in src or src in seen:continue
  if any(x in src.lower() for x in ['communications.svg','image-20.jpg','banner','logo']):continue
  seen.add(src);images.append({'url':src,'alt':img.get('alt','') or img.get('title','') or 'Fossil Energy source photograph'})
 for a in main.select('a[href]'):
  href=urljoin('https://fossilpk.com/',a['href'])
  if '.pdf' in href.lower():
   href=href.replace('fossilpk.globaladvertising.io','fossilpk.com')
   if href not in seen:documents.append({'url':href,'label':a.get_text(' ',strip=True) or 'Source document'});seen.add(href)
 # Preserve full-resolution product specification sheets behind source lightboxes.
 for a in main.select('a[href*="settings"]'):
  try:
   settings=unquote(a['href']).split('settings=')[1];obj=json.loads(base64.b64decode(settings));src=obj.get('url','')
   if '/wp-content/uploads/' in src and src not in seen:images.append({'url':src,'alt':obj.get('title','Product specification sheet')});seen.add(src)
  except Exception:pass
 if file.stem=='home':documents.append({'url':'https://fossilpk.com/wp-content/uploads/2023/08/Privacy-Policy.pdf','label':'Privacy policy'})
 for item in images+documents:
  ext=Path(urlparse(item['url']).path).suffix.lower();name=hashlib.sha256(item['url'].encode()).hexdigest()[:14]+ext
  item['local']='/source-media/'+name;assets[item['url']]=name
 pages[file.stem.replace('--','/')]={'images':images,'documents':documents}
def download(pair):
 url,name=pair;f=DEST/name
 try:
  if not f.exists():
   with urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=30) as r:data=r.read()
   if name.endswith('.pdf') and not data.startswith(b'%PDF'):raise ValueError('Not a PDF')
   f.write_bytes(data)
  return url,None
 except Exception as e:return url,str(e)
failed={}
with ThreadPoolExecutor(max_workers=6) as pool:
 for i,f in enumerate(as_completed([pool.submit(download,p) for p in assets.items()])):
  url,err=f.result()
  if err:failed[url]=err
  if i%25==0:print('Downloaded',i+1,'/',len(assets),flush=True)
for page in pages.values():
 for item in page['images']+page['documents']:
  if item['url'] in failed:item['local']=item['url'];item['downloadError']=failed[item['url']]
(ROOT/'data/sourceMedia.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2),encoding='utf-8')
(CACHE/'media-errors.json').write_text(json.dumps(failed,indent=2),encoding='utf-8')
print('ASSETS',len(assets),'FAILED',len(failed),flush=True)
