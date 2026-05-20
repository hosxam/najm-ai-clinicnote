"""Add deployment marker to index.html."""
with open('index.html', 'rb') as f:
    raw = f.read()

marker = b'<!-- deploy-current-version-v5d -->\n'
raw = raw.replace(b'<html lang="en">', b'<html lang="en">\n' + marker, 1)

with open('index.html', 'wb') as f:
    f.write(raw)
print("Deployment marker added")
