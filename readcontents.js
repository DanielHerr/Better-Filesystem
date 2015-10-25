function readfolder(folder, types, callback) {
 if(typeof(types) == "function") {
  callback = types
  types = ["folder", "file", "content"]
 }
 var reading = 0
 var contents = []
 function readsomeentries(reader) {
  reading = reading + 1
  reader.readEntries(function(entries) {
   reading = reading - 1
   for(var entry of entries) {
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
     readfolder(folder, "file", function(files) {
      function readcontent() {
       if(reading < files.length) {
        files[reading].file(function(file) {
         file.fullPath = files[reading].fullPath
         contents.push(file)
         reading = reading + 1
         readcontent()
        })
       } else {
        callback(contents)
       }
      }
      readcontent()
     })
    } else {
     callback(contents)
 } } }) }
 readsomeentries(folder.createReader())
}
