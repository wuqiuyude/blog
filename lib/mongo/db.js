'use strict'
var markdown = require('markdown-js') 
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/blog');
var getNewId = function(collection, callback){
  collection.update({"name":'ids'}, {$inc:{'id':1}})
  return collection.find({"name":'ids'})
};

module.exports.getBlogs = function(bid) {
    var blogs = db.get('blogs')
    return blogs.find({"name":{$ne:"ids"}}).then(function(docs){
        return docs
    })
}
module.exports.getBlogsByTag = function(bid) {
    var blogs = db.get('blogs')
    var tags = db.get('tags')
    return tags.find({"name":{$ne:"ids"},"id": parseInt(bid)},{'name': 1}).then(function(docs){
      console.log(docs[0].name)
      return blogs.find({"name":{$ne:"ids"},"tag":docs[0].name}).then(function(docs){
        console.log(docs)
        return docs
      })
    })
}
module.exports.getBlogsByCatagory = function(bid) {
    var blogs = db.get('blogs')
    var catagorys = db.get('catagorys')
    return catagorys.find({"name":{$ne:"ids"},"id": parseInt(bid)},{'name': 1}).then(function(docs){
      return blogs.find({"name":{$ne:"ids"},"catagory":docs[0].name}).then(function(docs){
        return docs
      })
    })
}
module.exports.getTags = function() {
    var tags = db.get('tags')
    return tags.find({"name":{$ne:"ids"}},{'name': 1}).then(function(docs){
      return docs
  })
}
module.exports.getCatagorys = function() {
    var catagorys = db.get('catagorys')
    return catagorys.find({"name":{$ne:"ids"}},{'name': 1}).then(function(docs){
      return docs
    })
}
module.exports.getTypes = function(){
    var types = db.get('types')
    return types.find({"name":{$ne:"ids"}},{'name': 1}).then(function(docs){
       return docs
    })
}
module.exports.getBlogByID = function(id){
    var blogs = db.get('blogs')
    return blogs.find({"id": parseInt(id)}).then(function(docs){
      if(docs.length>1){
       return docs[1]
      } else {
        return docs[0]
      }
    })
}
module.exports.addBlog = function(data){
  var collection = db.get('blogs')
  return getNewId(collection).then(function(docs){
    var time = new Date()
    var y = time.getFullYear()
    var m = time.getMonth()
    var d = time.getDate()
    var t = y + '-' + m + '-' + d
    data['name'] = 'blog'
    data['time'] = t
    data['timestamp'] =  Date.parse(new Date())
    data['id'] = docs[0].id
    var blogs = db.get('blogs')
    return blogs.insert(data).then(function(docs){
      return docs
    }) 
  })
}
module.exports.getBlog = function(id){
  var collection = db.get('blogs')
  return collection.find({'id': parseInt(id),"name":{$ne:"ids"}}).then(function(docs){
    console.log(docs)
    return docs[0]
  })
}