function readcontents(folder, type, callback) {
  var reading = 0
  var contents = []
  function readsome(reader) {
    reading = reading + 1
    reader.readEntries(function(entries) {
      reading = reading - 1
      for(var entry of entries) {
        if(type == "all" || (entry.isDirectory && type == "folder") || (entry.isFile && type == "file")) {
          contents.push(entry)
        }
        if(entry.isDirectory) {
          readsome(entry.createReader())
        }
      }
      if(entries.length) {
        readsome(reader)
      } else if(reading == 0) {
        callback(contents)
      }
    })
  }
  readsome(folder.createReader())
}
