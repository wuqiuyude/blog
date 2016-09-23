'use strict'
var markdown = require('markdown-js') 
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/blog');
var getNewId = function(collection, callback){
  collection.update({"name":'ids'}, {$inc:{'id':1}})
  return collection.find({"name":'ids'})
};


module.exports.getTags = function() {
    var tags = db.get('tagscollection')
    return tags.find({},{'name': 1}).then(function(docs){
      return docs
  })
}
module.exports.getCatagorys = function() {
    var catagorys = db.get('catagorys')
    return catagorys.find({},{'name': 1}).then(function(docs){
      return docs
    })
}
module.exports.getTypes = function(){
    var types = db.get('types')
    return types.find({},{'name': 1}).then(function(docs){
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
    data['time'] = t
    data['id'] = docs[0].id
    console.log(data)
    var collection = db.get('blogs')
    return collection.insert(data).then(function(docs){
      return docs
    }) 
  })
}

