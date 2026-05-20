"""Exact byte search for replacement targets."""
with open('index.html', 'rb') as f:
    raw = f.read()

# Find var map=
for search in [b'var map={', b'<select id="specialty"']:
    idx = raw.find(search)
    if idx >= 0:
        # Show raw bytes
        chunk = raw[idx:idx+500]
        print(f"Found '{search.decode()}' at offset {idx}")
        print(repr(chunk))
        print()
