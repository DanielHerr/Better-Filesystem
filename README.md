# Folder Reader
Gets the contents of a directory entry.

Usage:
```javascript
readfolder(directoryentry, "content" || "folder" || "file" || []).then(function(contents) {
 console.log(contents)
}).catch(function() {
 console.log("Error reading folder.")
})
```
