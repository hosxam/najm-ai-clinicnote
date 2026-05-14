with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

print('=== FINAL AUDIT ===')
print('Search:', 'speedSearch' in c or 'filterChips' in c)
print('Size:', len(c))
print()

checks = [
    ('_activeSpeedTab set in switchSpeedTab', 'window._activeSpeedTab = tab'),
    ('renderSpeedOutput called from switchSpeedTab', 'renderSpeedOutput(tab)'),
    ('renderSpeedOutput defined', 'function renderSpeedOutput'),
    ('reads from _speedOutputs[tab]', 'window._speedOutputs[tab]'),
    ('clearSpeedOutput defined', 'function clearSpeedOutput'),
    ('generateAllOutputs triggers EMR tab', 'switchSpeedTab("emr")'),
    ('addCustom exported 1x', 'window.addCustom = addCustom'),
    ('filterChips export removed', 'window.filterChips'),
    ('renderSpeedOutput exported', 'window.renderSpeedOutput'),
    ('clearSpeedOutput exported', 'window.clearSpeedOutput'),
]

for label, check in checks:
    result = check in c
    if check == 'window.filterChips':
        result = check not in c
    status = 'OK' if result else 'FAIL'
    print(f'{status}: {label}')

print()
fn_count = c.count('function ')
print('Function count:', fn_count)
print('Window exports:', len([l for l in c.split('\n') if 'window.' in l and '=' in l]))
