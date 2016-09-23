'use strict'
var store = require('./mongo/db.js')
var markdown = require('markdown-js') 
var getNewId = function(collection, callback){
  collection.update({"name":'ids'}, {$inc:{'id':1}})
  return collection.find({"name":'ids'})
};
//查看首页
module.exports.getAll = function (req, res, next) {
    var collection = db.get('tagscollection');
    var html = markdown.makeHtml("#### 1111依赖的库(Linux)");
    var tagList = []
    collection.find({},{'name': 1}).then(function(docs){
        tagList = docs;
    }).then(function(){
        res.render('index', { title: 'home',
            articles:[
                {
                   title: 'title',
                   time: '2016-09-05 08:40:20',
                   tag: 'html',
                   'category': 'jade',
                   'content': html

                }
            ],
            tagList: tagList
        });
    });
    
}

//博客详情
module.exports.getDetail = function (req, res, next) {
  res.render('index', { title: '详情页' });
}

//添加
module.exports.addBlog = function (req, res, next) {
  store.addBlog(req.body).then(function(){
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