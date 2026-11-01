from pathlib import Path
import json
root=Path(__file__).resolve().parent.parent
manifest=json.loads((root/'manifest.webmanifest').read_text(encoding='utf-8'))
assert manifest['display']=='standalone'
assert manifest['start_url'].startswith('./')
assert len(manifest['icons'])>=2
for item in manifest['icons']:
    assert (root/item['src']).is_file()
for path in ['src/main.js','src/content/episode01.js','src/core/engine.js','src/core/storage.js','src/core/audio.js','src/ui/app.js','src/styles/main.css','assets/scene.webp','sw.js']:
    assert (root/path).is_file(), path
sw=(root/'sw.js').read_text()
for path in ['src/main.js','src/ui/app.js','assets/scene.webp','manifest.webmanifest']:
    assert path in sw
assert (root/'assets/scene.webp').stat().st_size>10000
assert json.loads((root/'vercel.json').read_text())
print('PASS: manifest, service worker assets, Vercel configuration')
