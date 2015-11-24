# Read Folder Contents
Gets the contents of a directory entry. Requires an array includes polyfill for muliple types.

Usage:
```javascript
readfolder(directoryentry, "content" || "folder" || "file" || []).then(function(contents) {
 console.log(contents)
}).catch(function() {
 console.log("Error reading folder.")
})
```
