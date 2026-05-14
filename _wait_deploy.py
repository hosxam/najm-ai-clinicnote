import urllib.request, re, time
url = 'https://hosxam.github.io/najm-ai-clinicnote/'
for i in range(18):
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode('utf-8')
            m = re.search(r'Version ([a-f0-9]{7})', body)
            if m:
                ver = m.group(1)
                print(f'Attempt {i+1}: Version {ver}')
                if ver in ('6fbc1f3', 'de6e43a'):
                    print('LIVE DEPLOYED!')
                    if 'speedSearch' in body or 'filterChips' in body:
                        print('WARNING: Search still present!')
                    else:
                        print('Search removed: CONFIRMED')
                    break
            else:
                print(f'Attempt {i+1}: No version found')
    except Exception as e:
        print(f'Attempt {i+1}: {e}')
    time.sleep(10)
else:
    print('TIMEOUT - GitHub Pages still not deployed')
