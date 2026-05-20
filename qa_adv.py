import urllib.request
BASE = 'http://localhost:8000'

# Test /advanced/
r = urllib.request.urlopen(BASE + '/advanced/')
body = r.read().decode('utf-8', errors='replace')
print('/advanced/: %s (%s bytes)' % (r.status, len(body)))
checks = [
  ('Meta redirect', 'v4=encounter2' in body),
  ('JS redirect', 'window.location.replace' in body),
  ('Clean anchor text', 'Return to main app' in body),
]
for label, result in checks:
  print('  %s: %s' % ('PASS' if result else 'FAIL', label))

# Test ?v4=encounter2
r2 = urllib.request.urlopen(BASE + '/?v4=encounter2')
body2 = r2.read().decode('utf-8', errors='replace')
print('\n/?v4=encounter2: %s (%s bytes)' % (r2.status, len(body2)))
checks2 = [
  ('v4_advanced_encounter.js loads', 'v4_advanced_encounter.js' in body2),
  ('page-advanced-encounter div', 'page-advanced-encounter' in body2),
  ('Step labels (Workflow/History/Exam)', 'Workflow' in body2 and 'History' in body2 and 'Exam' in body2),
  ('Generate Combined Draft button', 'Generate Combined Draft' in body2),
]
for label, result in checks2:
  print('  %s: %s' % ('PASS' if result else 'FAIL', label))
