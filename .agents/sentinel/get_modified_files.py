import os

exclude_dirs = {'.git', '.agents', 'node_modules', '.next'}
files = []
for root, dirs, filenames in os.walk('d:\\PROJECT\\AROH'):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for filename in filenames:
        if filename == 'package-lock.json':
            continue
        filepath = os.path.join(root, filename)
        try:
            mtime = os.path.getmtime(filepath)
            files.append((filepath, mtime))
        except OSError:
            pass

files.sort(key=lambda x: x[1], reverse=True)
for filepath, mtime in files[:5]:
    print(filepath)
