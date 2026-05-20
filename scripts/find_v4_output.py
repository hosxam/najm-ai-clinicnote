"""Find V4 output rendering functions."""
with open('v4_advanced_encounter.js', 'r', encoding='latin-1') as f:
    js = f.read()

# Find where the note model is populated with data
idx = js.find('buildV4NoteModel')
print(f"buildV4NoteModel at {idx}")
# Show context
print(js[max(0,idx-200):idx+500])
print("---")

# Find all function names
indices = []
start = 0
while True:
    idx = js.find('function ', start)
    if idx < 0:
        break
    end = js.find('(', idx)
    fn_name = js[idx+9:end].strip()
    if fn_name and not fn_name.startswith('_'):
        indices.append((idx, fn_name))
    start = idx + 1

print(f"\nAll top-level functions ({len(indices)}):")
for idx, name in indices:
    if any(k in name.lower() for k in ['render','display','output','format','publish','build','generate','compose','emr','soap','draft']):
        print(f"  {name} at {idx}")
