"use strict"

function betterfilesystem(...entries) {
 for(let entry of entries) {
  if(entry.isFile) {
   entry.read = function(type) {
    let file = this
    type = type || "Text"
    return(new Promise(function(resolve, reject) {
     file.file(function(file) {
      let reader = new FileReader()
      reader.on("load", function() {
       resolve(reader.result)
      })
      reader.on("error", reject)
      reader["readAs" + type](file)
   }, reject) })) }
   entry.write = function(data) {
    let file = this
    return(new Promise(function(resolve, reject) {
     file.createWriter(function(writer) {
      writer.on("write", function() {
       file.createWriter(function(writer) {
        writer.on("write", resolve)
        writer.on("error", reject)
        writer.write(data)
      }) })
      writer.on("error", reject)
      writer.truncate(0)
     }, reject)
   })) }
   entry.remove = promisify(entry.remove)
  } else {
   entry.file = function(path, options) {
    return(new Promise(enableawait(function*(resolve, reject) {
     let file = yield(promisify(entry.getFile)(path, options))
     resolve(betterfilesystem(file))
   }))) }
   entry.folder = function(path, options) {
    return(new Promise(enableawait(function*(resolve, reject) {
     let folder = yield(promisify(entry.getDirectory)(path, options))
     resolve(betterfilesystem(folder))
   }))) }
   entry.remove = promisify(entry.removeRecursively)
   entry.read = function(recursive) {
    let folder = this
    return(new Promise(enableawait(function*(resolve, reject) {
     let contents = []
     function reading(reader) {
      return(new Promise(enableawait(function*(resolve, reject) {
       let entries = yield(reader.readsome())
       if(recursive != false) {
        for(let entry of entries) {
         if(entry.isDirectory) {
          let reader = entry.createReader()
          reader.readsome = promisify(reader.readEntries)
          yield(reading(reader))
       } } }
       if(entries.length) {
        contents.push(...entries)
        yield(reading(reader))
       }
       resolve()
     }))) }
     let reader = folder.createReader()
     reader.readsome = promisify(reader.readEntries)
     yield(reading(reader))
     contents = betterfilesystem(...contents)
     resolve(contents)
  }))) } }
  entry.parent = promisify(entry.getParent)
  entry.move = promisify(entry.moveTo)
  entry.copy = promisify(entry.copyTo)
  entry.metadata = promisify(entry.getMetadata)
  entry.rename = function(name) {
   return(new Promise(enableawait(function*(resolve, reject) {
    resolve(entry.move((yield(entry.parent())), name))
  }))) }
  entry.size = function() {
   return(new Promise(enableawait(function*(resolve, reject) {
    if(entry.isFile) {
     resolve((yield(entry.metadata())).size)
    } else {
     let size = 0
     let contents = yield(entry.read())
     for(let entry of contents) {
      if(entry.isFile) {
       size = size + (yield(entry.size()))
     } }
     resolve(size)
  } }))) }
 }
 if(entries.length == 1) {
  entries = entries[0]
 }
 return(entries)
}
