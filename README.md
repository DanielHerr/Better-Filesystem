# Better Filesystem
Improves the sandboxed filesystem api with promises and simplified methods.

Usage:
```javascript
entry = betterfilesystem(entry)
entries = betterfilesystem(...entries)
```

Entry: parent(), move(parent, name), copy(parent, name), remove(), rename(name), size(), metadata()

File: read(type), write(data)

Folder: file(path, options), folder(path, options), read(recursive)

Requires: <a href="https://github.com/DanielHerr/Enable-Await">Enable Await</a>, <a href="https://github.com/DanielHerr/Promisify">Promisify</a>
