"""Refresh the attributed local community snapshot; run from this repository. Requires Pillow.
Review source changes before committing generated files. No live-site writes.
"""
import urllib.request,json,pathlib,concurrent.futures
from PIL import Image
root=pathlib.Path.cwd()
if not (root/'src/lib/player-state.ts').is_file(): raise SystemExit('Run from the Taish Gaming repository root.')
(root/'tmp').mkdir(exist_ok=True)
base='https://raw.githubusercontent.com/rolux/gtadb.org/'
meta=json.load(urllib.request.urlopen('https://api.github.com/repos/rolux/gtadb.org/commits/main',timeout=30));sha=meta['sha'];base+=sha+'/'
out=root/'public/maps/gtadb-yanis17';out.mkdir(parents=True,exist_ok=True)
raw=urllib.request.urlopen(base+'map/data/6/landmarks.json',timeout=30).read(); data=json.loads(raw)
(root/'tmp/gtadb-landmarks-source.json').write_bytes(raw)
(out/'LICENSE-DATA.txt').write_bytes(urllib.request.urlopen(base+'LICENSE-DATA',timeout=30).read())
items=[]
for key,row in data.items():
 if not isinstance(row,list) or len(row)<7: continue
 address=row[0] if isinstance(row[0],str) else ''
 name=address.split(',')[0].strip();types=row[6] if isinstance(row[6],list) else []
 coordinates=row[1];pos=None
 if isinstance(coordinates,list) and len(coordinates)==2 and all(isinstance(n,(float,int)) and -16384<=n<=16384 for n in coordinates):
  pos={'top':round((16384-coordinates[1])/32768*100,6),'left':round((coordinates[0]+16384)/32768*100,6)}
 items.append({'id':'gtadb-'+key,'name':name if name and name!='?' else 'Unnamed '+(types[0] if types else 'landmark')+' ('+key+')','area':', '.join(p.strip() for p in address.split(',')[1:] if p.strip() and p.strip()!='?'),'types':types,'position':pos,'counterpart':row[3].split(',')[0] if isinstance(row[3],str) else '', 'reference':'https://map.gtadb.org/#VI,'+key})
(root/'src/lib/community-map-data.json').write_text(json.dumps(items,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
bounds={0:(0,0,3,3),1:(1,1,6,6),2:(2,2,12,12),3:(5,5,25,24)}
jobs=[(z,x,y) for z,(x0,y0,x1,y1) in bounds.items() for x in range(x0,x1+1) for y in range(y0,y1+1)]
def download(job):
 z,x,y=job;relative=f'maps/tiles/6/yanis,17/{z}/{z},{y},{x}.jpg';dest=out/f'tiles/{z}/{z},{y},{x}.jpg';dest.parent.mkdir(parents=True,exist_ok=True)
 if dest.exists(): return
 for attempt in range(3):
  try:dest.write_bytes(urllib.request.urlopen(base+relative,timeout=30).read());return
  except Exception:
   if attempt==2:raise
print('Pinned source',sha,'landmarks',len(items),'positioned',sum(i['position'] is not None for i in items),'tiles',len(jobs),flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
 for count,_ in enumerate(pool.map(download,jobs),1):
  if count%100==0: print('Downloaded',count,flush=True)
canvas=Image.new('RGB',(4096,4096),(99,151,172))
for z,x,y in jobs:
 if z==2:
  with Image.open(out/f'tiles/{z}/{z},{y},{x}.jpg') as tile:canvas.paste(tile,(x*256,y*256))
canvas.resize((1536,1536)).save(out/'overview.webp',quality=75)
manifest={'sourceRepository':'https://github.com/rolux/gtadb.org','commit':sha,'license':'CC BY 4.0','licenseUrl':'https://creativecommons.org/licenses/by/4.0/','map':'Yanis Community Map v17, via GTADB contributors','landmarks':len(items),'positioned':sum(i['position'] is not None for i in items),'importedAt':'2026-11-02','changes':'Filtered fields, stable ID prefix, normalized coordinates, recompressed overview. Community estimates, not official geography.'}
(out/'source.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print('Complete. Local map bytes:',sum(p.stat().st_size for p in out.rglob('*') if p.is_file()),flush=True)
