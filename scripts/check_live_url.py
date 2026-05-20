"""Check live URL for current version markers."""
import urllib.request

try:
    r = urllib.request.urlopen('https://hosxam.github.io/najm-ai-clinicnote/', timeout=15)
    html = r.read().decode('latin-1')
    
    checks = [
        ('deploy marker', 'deploy-current-version-v5d'),
        ('150 workflows in content', '150'),
        ('Advanced Mode', 'v4=encounter2'),
        ('Autofill', 'Autofill'),
        ('Speed Mode', 'speed'),
        ('Medical Report', 'report'),
        ('Calculator', 'calc'),
        ('Beta wording', 'Beta'),
        ('No stale 80', '80 workflows' not in html.lower()),
        ('No stale 7+', '7+ specialties' not in html.lower()),
        ('No business-system', 'business-system' not in html.lower()),
    ]
    
    print("=== Live URL Check ===")
    all_pass = True
    for label, check in checks:
        if isinstance(check, bool):
            status = 'PASS' if check else 'FAIL'
            if not check:
                all_pass = False
        else:
            found = check in html
            status = 'PASS' if found else 'FAIL'
            if not found:
                all_pass = False
        print(f"  [{status}] {label}")
    
    # Check page size
    print(f"\n  Page size: {len(html)} bytes")
    print(f"  Response code: {r.status}")
    
    if all_pass:
        print("\n  ✅ All checks pass - live URL serves current version")
    else:
        print("\n  ⚠️  Some checks failed")
        
except Exception as e:
    print(f"  Could not reach live URL: {e}")
    print("  (This may be transient - try again in a few minutes)")
