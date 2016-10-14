'use strict'
var markdown = require('markdown-js') 
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/blog');
var getNewId = function(collection){
  return collection.findOneAndUpdate({"name":'ids'}, {$inc:{'id':1}})
};
var getTotalCount = function(collection, query=''){
  if (query){
    return collection.count({"name":{$ne:"ids"}, query})
  }
  return collection.count({"name":{$ne:"ids"}})
};

module.exports.getBlogs = function(page=1, rows=10) {
    var blogs = db.get('blogs')
    var total
    getTotalCount(blogs).then((count) => {
      total = count
    })
    return blogs.find({"name":{$ne:"ids"}},
      {sort:{id:-1},skip: (page-1)*rows,limit: rows}).then((docs) => {
        return {total, docs}
    })
}
module.exports.getBlogsByTag = function(bid, page=1, rows=10) {
    var blogs = db.get('blogs')
    var tags = db.get('tags')
    return tags.findOne({"name":{$ne:"ids"},"id": parseInt(bid)},{'name': 1}).then((docs) => {
      var total
      getTotalCount(blogs, {"tag":docs.name}).then((count) => {
        total = count
      })
      return blogs.find({"name":{$ne:"ids"},"tag":docs.name},
        {sort:{id:-1},skip: (page-1)*rows,limit: rows}).then((docs) => {
        return {total, docs}
      })
    })
}
module.exports.getBlogsByCatagory = function(bid, page=1, rows=10) {
    var blogs = db.get('blogs')
    var catagorys = db.get('catagorys')
    return catagorys.findOne({"name":{$ne:"ids"},"id": parseInt(bid)},{'name': 1})
      .then((docs) => {
        var total
        getTotalCount(blogs, {"tag":docs.name}).then((count) => {
          total = count
        })
        return blogs.find({"name":{$ne:"ids"},"catagory":docs.name},
          {sort:{id:-1},skip: (page-1)*rows,limit: rows})
      .then((docs) =>{
        return {total, docs}
      })
    })
}
module.exports.getTags = function() {
    var tags = db.get('tags')
    return tags.find({"name":{$ne:"ids"}},{'name': 1}).then((docs) => {
      return docs
  })
}
module.exports.getCatagorys = function() {
    var catagorys = db.get('catagorys')
    return catagorys.find({"name":{$ne:"ids"}},{'name': 1}).then((docs) => {
      return docs
    })
}
module.exports.getTypes = function(){
    var types = db.get('types')
    return types.find({"name":{$ne:"ids"}},{'name': 1}).then((docs) => {
       return docs
    })
}
module.exports.getBlogByID = function(id){
    var blogs = db.get('blogs')
    blogs.findOneAndUpdate({"id": parseInt(id)},{$inc:{'watch_count':1}})
    return blogs.findOne({"id": parseInt(id),"name":{$ne:"ids"}}).then((docs) => {
       return docs
    })
}
module.exports.addBlog = function(data){
  var collection = db.get('blogs')
  return getNewId(collection).then((docs) => {
    var time = new Date()
    var y = time.getFullYear()
    var m = time.getMonth()
    var d = time.getDate()
    var t = y + '-' + m + '-' + d
    data['watch_count'] = 0
    data['name'] = 'blog'
    data['time'] = t
    data['timestamp'] =  Date.parse(new Date())
    data['id'] = docs.id
    var blogs = db.get('blogs')
    return blogs.insert(data).then(function(docs){
      var catagorys = db.get('catagorys')
      catagorys.update({"name":data['catagory']},{$inc:{'count':1}}).then((docs) => {
      return docs
      }) 
    })
  })
}
module.exports.getBlog = function(id){
  var collection = db.get('blogs')
  return collection.findOneAndUpdate({'id': parseInt(id),"name":{$ne:"ids"}}).then((docs) => {
    return docs
  })
}
module.exports.addTag = function(data){
  var collection = db.get('tags')
  return getNewId(collection).then((docs) => {
    data['id'] = docs[0].id
    var tags = db.get('tags')
    return collection.insert(data).then((docs) => {
      return docs[0]
    })
  })
}
module.exports.addCatagory = function(data){
  var collection = db.get('catagorys')
  return getNewId(collection).then((docs) => {
    data['id'] = docs[0].id
    var tags = db.get('catagorys')
    return collection.insert(data).then((docs) => {
      return docs[0]
    })
  })
}
module.exports.addCatagory = function(data){
  var collection = db.get('catagorys')
  return getNewId(collection).then((docs) => {
    data['id'] = docs[0].id
    var tags = db.get('catagorys')
    return collection.insert(data).then((docs) => {
      return docs[0]
    })
  })
}