function readcontents(folder, callback) {
  var reading = 0
  var contents = []
  function readsome(reader) {
    reading = reading + 1
    reader.readEntries(function(entries) {
      reading = reading - 1
      for(var entry of entries) {
        if(entry.isDirectory) {
          readsome(entry.createReader())
        } else {
          contents.push(entry)
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
