"""Refresh the attributed local community snapshot; run from this repository. Requires Pillow.
Review source changes before committing generated files. No live-site writes.

Tiles are the Yanis Community Map via GTADB (CC BY 4.0), self-hosted.
Set MAP_IMPORT_TILES_ONLY=1 to refresh tiles only and leave the landmark
data file (src/lib/community-map-data.json) untouched.

The v18 z5 grid starts at (21,21). Outside the tile ranges the renderer
shows the ocean background.
"""
import os,urllib.request,urllib.error,json,pathlib,concurrent.futures
from PIL import Image
root=pathlib.Path.cwd()
if not (root/'src/lib/player-state.ts').is_file(): raise SystemExit('Run from the Taish Gaming repository root.')
tiles_only=os.environ.get('MAP_IMPORT_TILES_ONLY')=='1'
(root/'tmp').mkdir(exist_ok=True)
# Pinned commit, verified via `git ls-remote https://github.com/rolux/gtadb.org.git HEAD`
# on 2026-11-20. The unauthenticated GitHub API is rate-limited, so fall
# back to the pin when the API call fails.
PINNED_SHA='d406fea099e1df2bce42fd6b87eed04bce646629'
try:
 meta=json.load(urllib.request.urlopen('https://api.github.com/repos/rolux/gtadb.org/commits/main',timeout=30));sha=meta['sha']
except Exception:
 sha=PINNED_SHA;print('GitHub API unavailable; using pinned SHA',sha,flush=True)
base='https://raw.githubusercontent.com/rolux/gtadb.org/'+sha+'/'
out=root/'public/maps/gtadb-yanis17';out.mkdir(parents=True,exist_ok=True)
if tiles_only:
 print('Tiles-only mode: landmark data file left untouched.',flush=True)
 old_manifest=json.loads((out/'source.json').read_text(encoding='utf-8')) if (out/'source.json').is_file() else {}
 landmarks_count=old_manifest.get('landmarks',3401);positioned_count=old_manifest.get('positioned',3307)
else:
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
 landmarks_count=len(items);positioned_count=sum(i['position'] is not None for i in items)
# Bounds match the renderer's YANIS_RANGES in src/components/community-map-tiles.tsx.
# z4/z5 are REAL v18 tiles now (2026-11-20); the old z4/z5 were Lanczos
# upscales of z3 made by ~/workspace/your_files/gta6-map-rebuild/generate_tiles.py.
bounds={0:(0,0,3,3),1:(1,1,6,6),2:(2,2,12,12),3:(5,5,25,24),4:(10,10,51,49),5:(21,21,103,99)}
jobs=[(z,x,y) for z,(x0,y0,x1,y1) in bounds.items() for x in range(x0,x1+1) for y in range(y0,y1+1)]
def download(job):
 z,x,y=job;relative=f'maps/tiles/6/yanis,18/{z}/{z},{y},{x}.jpg';dest=out/f'tiles/{z}/{z},{y},{x}.jpg';dest.parent.mkdir(parents=True,exist_ok=True)
 if dest.exists(): return True
 for attempt in range(3):
  try:dest.write_bytes(urllib.request.urlopen(base+relative,timeout=30).read());return True
  except urllib.error.HTTPError as e:
   if e.code==404: return False
   if attempt==2: raise
  except Exception:
   if attempt==2: raise
 return False
print('Pinned source',sha,'landmarks',landmarks_count,'positioned',positioned_count,'tiles',len(jobs),flush=True)
downloaded=0;skipped=0
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
 for count,ok in enumerate(pool.map(download,jobs),1):
  if ok: downloaded+=1
  else: skipped+=1
  if count%1000==0: print('Processed',count,'downloaded',downloaded,'skipped',skipped,flush=True)
print('Tiles downloaded',downloaded,'skipped (404 upstream)',skipped,flush=True)
canvas=Image.new('RGB',(4096,4096),(99,151,172))
for z,x,y in jobs:
 if z==2:
  with Image.open(out/f'tiles/{z}/{z},{y},{x}.jpg') as tile:canvas.paste(tile,(x*256,y*256))
canvas.resize((1536,1536)).save(out/'overview.webp',quality=75)
manifest={'sourceRepository':'https://github.com/rolux/gtadb.org','commit':sha,'license':'CC BY 4.0','licenseUrl':'https://creativecommons.org/licenses/by/4.0/','map':'Yanis Community Map v18, via GTADB contributors','landmarks':landmarks_count,'positioned':positioned_count,'importedAt':'2026-11-20','changes':'Real v18 tiles z0-z5 (z4/z5 replace Lanczos-upscaled z3 copies); overview regenerated from v18 z2. Landmarks not refreshed in this run. Community estimates, not official geography.'}
(out/'source.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print('Complete. Local map bytes:',sum(p.stat().st_size for p in out.rglob('*') if p.is_file()),flush=True)
