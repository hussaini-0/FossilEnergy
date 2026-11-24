from bs4 import BeautifulSoup
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]
catalog={}
for slug in ['lubricants','rtx-lubricants']:
 s=BeautifulSoup((root/'output/source-audit'/f'{slug}.html').read_text(encoding='utf-8'),'html.parser')
 m=s.select_one('[data-elementor-type="wp-page"]');rows=[];seen=set()
 for text in m.find_all(string=lambda t:t and 'Packaging:' in t):
  col=text.find_parent(class_='elementor-column')
  if not col:continue
  heading=col.find(['h2','h3','h4','h5','h6'])
  category=heading.get_text(' ',strip=True) if heading else 'Lubricant'
  value=col.get_text(' ',strip=True)
  if value.count('Packaging:')!=1:continue
  before,pack=value.split('Packaging:');grade=before.removeprefix(category).strip()
  pack=pack.replace('Read More','').strip();key=(category,grade,pack)
  if key not in seen:rows.append(list(key));seen.add(key)
 catalog[slug]=rows
(root/'data/productCatalog.json').write_text(json.dumps(catalog,indent=2,ensure_ascii=False),encoding='utf-8')
print({k:len(v) for k,v in catalog.items()})
