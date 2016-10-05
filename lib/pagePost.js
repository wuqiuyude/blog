'use strict'
var store = require('./mongo/db.js')
var markdown = require('markdown-js') 
var getNewId = function(collection, callback){
  collection.update({"name":'ids'}, {$inc:{'id':1}})
  return collection.find({"name":'ids'})
};
//查看首页
module.exports.getAll = function (req, res, next) {
    var blogList = []
    store.getBlogs().then(function(docs){
      blogList = docs
      blogList.forEach(function(item){
        item['blog'] = markdown.makeHtml(item['blog'])
      })
    })
    var tagList = []
    store.getTags().then(function(docs){
      tagList = docs
    })
    store.getCatagorys().then(function(docs){
      res.render('index', { title: 'home',
            articles: blogList,
            catagoryList: docs,
            tagList: tagList
        });
    })
}
module.exports.getBlogsByTag = function (req, res, next) {  
    var bid = req.params.bId
    var blogList = []
    store.getBlogsByTag(bid).then(function(docs){
      console.log(blogList)
      blogList = docs
      blogList.forEach(function(item){
        item['blog'] = markdown.makeHtml(item['blog'])
      })
    })
    var tagList = []
    store.getTags().then(function(docs){
      tagList = docs
    })
    store.getCatagorys().then(function(docs){
      res.render('index', { title: 'home',
            articles: blogList,
            catagoryList: docs,
            tagList: tagList
        });
    })
}
module.exports.getBlogsByCatagory = function (req, res, next) {  
    var bid = req.params.bId  
    var blogList = []
    store.getBlogsByCatagory(bid).then(function(docs){
      blogList = docs
      blogList.forEach(function(item){
        item['blog'] = markdown.makeHtml(item['blog'])
      })
    })
    var tagList = []
    store.getTags().then(function(docs){
      tagList = docs
    })
    store.getCatagorys().then(function(docs){
      res.render('index', { title: 'home',
            articles: blogList,
            catagoryList: docs,
            tagList: tagList
        });
    })
}
module.exports.about = function (req, res, next) {
  res.render('about', { title: 'home'
        });
}
//博客详情
module.exports.getDetail = function (req, res, next) {
  var bid = req.params.bId
  store.getBlog(bid).then(function(docs){
    docs['blog'] =  markdown.makeHtml(docs['blog'])
    return docs
  }).then(function(docs){
     res.render('blog', { title: '详情页','article':docs })
  })
}

//添加
module.exports.addBlog = function (req, res, next) {
  store.addBlog(req.body).then(function(docs){
    res.sendStatus(docs)
  })
}
//删除
module.exports.remove = function (req, res, next) {
  res.send('ok')
}
//修改
module.exports.update = function (req, res, next) {
  var tagList = []
  store.getTags().then(function(docs){
    tagList = docs
  })
  var typeList = []
  store.getTypes().then(function(docs){
    typeList = docs
  })
  var catagoryList = []
  store.getCatagorys().then(function(docs){
    catagoryList = docs
  })
  store.getBlogByID(req.params.bid).then(function(docs){
    blog = docs
  }).then(function(){
    res.render('editor', { title: 'editor',
      catagoryList: catagoryList,
      tagList: tagList,
      typeList: typeList,
      blog: blog,
    })
  })
}
//编辑
module.exports.editor = function (req, res, next) {
  var tagList = []
  store.getTags().then(function(docs){
    tagList = docs
  })
  var typeList = []
  store.getTypes().then(function(docs){
    typeList = docs
  })
  var blog = {}
  var bid = req.params.bId
  if(bid) {
    store.getBlogByID(bid).then(function(docs){
      blog = docs
    })
  }
  var catagoryList = []
    store.getCatagorys().then(function(docs){
    catagoryList = docs
  }).then(function(){
    res.render('editor', { title: 'editor',
        catagoryList: catagoryList,
        tagList: tagList,
        typeList: typeList,
        blog: blog,
      })
  })
}