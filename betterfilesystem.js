"use strict"

function betterfilesystem(entries = []) {
 let multiple = true
 if(Array.isArray(entries) == false) {
  entries = [ entries ]
  multiple = false
 }
 for(let entry of entries) {
  if(entry.isFile) {
   entry.read = function(type = "Text") {
    let file = this
    return(new Promise(function(resolve, reject) {
     file.file(function(file) {
      let reader = new FileReader()
      reader.addEventListener("load", function() {
       resolve(reader.result)
      })
      reader.addEventListener("error", reject)
      reader["readAs" + type](file)
   }, reject) })) }
   entry.write = function(data = new Blob) {
    let file = this
    return(new Promise(function(resolve, reject) {
     if(typeof(data) == "string") {
      data = new Blob([data])
     }
     file.createWriter(function(writer) {
      writer.addEventListener("write", function() {
       file.createWriter(function(writer) {
        writer.addEventListener("write", resolve)
        writer.addEventListener("error", reject)
        writer.write(data)
      }) })
      writer.addEventListener("error", reject)
      writer.truncate(0)
     }, reject)
   })) }
   entry.remove = promisify(entry.remove)
  } else {
   entry.file = async(function*(path = "", options = {}) {
    let file = yield(promisify(entry.getFile).call(entry, path, options))
    return(betterfilesystem(file))
   })
   entry.folder = async(function*(path = "", options = {}) {
    let folder = yield(promisify(entry.getDirectory).call(entry, path, options))
    return(betterfilesystem(folder))
   })
   entry.get = async(function*(path = "", options = {}) {
    let childentry = yield(Promise.any([entry.file(path, options), entry.folder(path, options)]))
    return(betterfilesystem(childentry))
   })
   entry.remove = promisify(entry.removeRecursively)
   entry.read = async(function*(recursive = true) {
    let folder = this
    let contents = []
    var reading = async(function*(reader) {
     let entries = yield(reader.readsome())
     if(recursive) {
      for(let entry of entries) {
       if(entry.isDirectory) {
        let reader = entry.createReader()
        reader.readsome = promisify(reader.readEntries)
        yield(reading(reader))
     } } }
     if(entries.length) {
      contents.push(...entries)
      yield(reading(reader))
    } })
    let reader = folder.createReader()
    reader.readsome = promisify(reader.readEntries)
    yield(reading(reader))
    contents = betterfilesystem(contents)
    return(contents)
  }) }
  entry.parent = promisify(entry.getParent)
  entry.move = promisify(entry.moveTo)
  entry.copy = promisify(entry.copyTo)
  entry.rename = async(function*(name = "") {
   let parent = yield(entry.parent())
   return(entry.move(parent, name))
  })
  entry.metadata = promisify(entry.getMetadata)
  entry.date = async(function*() {
   let metadata = yield(entry.metadata())
   return(metadata.modificationTime)
  })
  entry.size = async(function*() {
   if(entry.isFile) {
    let metadata = yield(entry.metadata())
    return(metadata.size)
   } else {
    let size = 0
    let contents = yield(entry.read())
    for(let entry of contents) {
     if(entry.isFile) {
      size = size + (yield(entry.size()))
    } }
    return(size)
 } }) }
 if(multiple) {
  return(entries)
 } else {
  return(entries[0])
} }