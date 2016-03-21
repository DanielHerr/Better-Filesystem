# Better Filesystem
Improves the sandboxed filesystem api with promises and simplified methods.

Usage:
```
entry = betterfilesystem(entry)
entries = betterfilesystem(...entries)
```

Entry: parent(), move(parent, name), copy(parent, name), rename(name), remove(), size(), date()

File: read(type = "Text"), write(data)

Folder: get(path, options), file(path, options), folder(path, options), read(recursive = true)

Requires: <a href="https://github.com/DanielHerr/Async-Await">Async Await</a>, <a href="https://github.com/DanielHerr/Promisify">Promisify</a>, <a href="https://github.com/DanielHerr/Any-Promise">Any Promise</a>
