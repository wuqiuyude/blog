'use strict'
var store = require('./mongo/db.js')
var markdown = require('markdown-js') 
var nodemailer = require('nodemailer')
var Paginate = require('./util/Paginate')
const rows = 1
var transporter = nodemailer.createTransport({
    host: "smtp.163.com",
    auth: {
        user: 'wuqiuyu8836@163.com',
        //这里密码不是qq密码，是你设置的smtp密码
        pass: 'wqy123456'
    }
});
var getNewId = function(collection, callback){
  collection.update({"name":'ids'}, {$inc:{'id':1}})
  return collection.find({"name":'ids'})
};
var getPagination = function(paginate) {
  return {
              page: paginate.page,
              first: paginate.first(),
              last: paginate.last(),
              maxpage: paginate.maxpage,
              rows: paginate.rows,
              total: paginate.total,
              prev: paginate.prev(),
              next: paginate.next() 
            }
}
//查看首页
module.exports.getAll = function (req, res, next) {
    const page = req.query.page
    const search = req.query.search
    var q = {}
    if(search) {
      var pattern = new RegExp("^.*"+search+".*$");
      q.title = pattern
    }
    var blogList = []
    var paginate
    store.getBlogs(page, rows, q).then((re) =>{
      paginate = new Paginate(parseInt(re.total/rows), page)
      blogList = re.docs
      blogList.forEach((item) => {
        item['blog'] = markdown.makeHtml(item['blog'].substring(0,250))
      })
    })
    var tagList = []
    store.getTags().then((docs) => {
      tagList = docs
    })
    store.getCatagorys().then((docs) => {
      res.render('index', { title: 'home',
            paginate: getPagination(paginate),
            articles: blogList,
            catagoryList: docs,
            tagList: tagList,
            url: req.url.split("?")[0] + '?',
            search: search ? 'search='+ search+ '&' : ''
        });
    })
}
module.exports.getBlogsByTag = function (req, res, next) { 
    const page = req.query.page 
    const bid = req.params.bId
    var tagList = []
    store.getTags().then((docs) => {
      tagList = docs
    })
    var catagoryList = []
    store.getCatagorys().then((docs) => {
      catagoryList = docs
    })
    var blogList = []
    var paginate
    store.getBlogsByTag(bid, page, rows).then((re) => {
      paginate = new Paginate(parseInt(re.total/rows)+1, page)
      blogList = re.docs
      blogList.forEach((item) => {
        item['blog'] = markdown.makeHtml(item['blog'].substring(0,150))
      })
      return blogList
    }).then((docs) => {
      res.render('index', { title: 'home',
            catagoryList: catagoryList,
            tagList: tagList,
            articles: docs,
            paginate: getPagination(paginate),
            url: req.url.split("?")[0] + '?'
      });
    })
}
module.exports.getBlogsByCatagory = function (req, res, next) {
    const page = req.query.page 
    const bid = req.params.bId
    var tagList = []
    store.getTags().then(function(docs){
      tagList = docs
    })
    var catagoryList = []
    store.getCatagorys().then(function(docs){
      catagoryList = docs
    })
    var blogList = []
    var paginate
    store.getBlogsByCatagory(bid, page, rows).then(function(re){
      blogList = re.docs
      paginate = new Paginate(parseInt(re.total/rows)+1, page)
      blogList.forEach(function(item){
        item['blog'] = markdown.makeHtml(item['blog'].substring(0,150))
      })
      return blogList
    }).then(function(docs){
      res.render('index', { title: 'home',
            catagoryList: catagoryList,
            tagList: tagList,
            articles: docs,
            paginate: getPagination(paginate),
            url: req.url.split("?")[0] + '?'
      });
    })
}
module.exports.about = function (req, res, next) {
  res.render('about', { title: 'about'
        });
}
module.exports.contact = function (req, res, next) {
  var tagList = []
    store.getTags().then(function(docs){
      tagList = docs
    })
    store.getCatagorys().then(function(docs){
      res.render('contact', { title: 'contact',tagList:tagList,
        catagoryList:docs
        });
    })
  
}
module.exports.sendEmail = function (req, res, next) {
  req.body['from'] = 'wuqiuyu8836@163.com'
  req.body['to'] = '963978233@qq.com'
  transporter.sendMail(req.body, function(error, response) {
  if (error) {
    res.sendStatus(500)
  } else {
    res.sendStatus(200)
  }
    transporter.close() // 如果没用，关闭连接池
  })
}
//博客详情
module.exports.getDetail = function (req, res, next) {
    var tagList = []
    store.getTags().then(function(docs){
      tagList = docs
    })
    var catagoryList = []
    store.getCatagorys().then(function(docs){
      catagoryList = docs
    })
  var bid = req.params.bId
  store.getBlog(bid).then(function(docs){
    docs['blog'] =  markdown.makeHtml(docs['blog'])
    return docs
  }).then(function(docs){
     res.render('blog', { title: '详情页',
      article:docs,
      tagList:tagList,
      catagoryList:catagoryList
    })
  })
}

//添加
module.exports.addBlog = function (req, res, next) {
  store.addBlog(req.body).then(function(docs){
    if(docs){
      res.sendStatus(200)
    }else{
      res.sendStatus(500)
    }   
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