"use strict"

function readfolder(folder, types) {
 let promise = new Promise(function(resolve, reject) {
  types = types || "content"
  let reading = 0
  let contents = []
  function readsomeentries(reader) {
   reading = reading + 1
   reader.readEntries(function(entries) {
    reading = reading - 1
    for(let entry of entries) {
     if((entry.isDirectory && types.includes("folder")) || (entry.isFile && types.includes("file"))) {
      contents.push(entry)
     }
     if(entry.isDirectory) {
      readsomeentries(entry.createReader())
    } }
    if(entries.length) {
     readsomeentries(reader)
    } else if(reading == 0) {
     if(types.includes("content")) {
      readfolder(folder, "file").then(function(files) {
       reading = files.length
       for(let entry of files) {
        entry.file(function(file) {
         file.fullpath = entry.fullPath
         contents.push(file)
         reading = reading - 1
         if(reading == 0) {
          resolve(contents)
         }
        }, reject)
       }
      }).catch(reject)
     } else {
      resolve(contents)
    } }
   }, reject)
  }
  readsomeentries(folder.createReader())
 })
 return(promise)
}
