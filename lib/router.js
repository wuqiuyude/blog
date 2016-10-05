var express = require('express');
var router = express.Router();
var pagePost = require('./pagePost')

/* GET home page. */
router.get('/', pagePost.getAll);
/* GET home page. */
router.get('/about', pagePost.about);
/* 添加博客 */
router.post('/blog/add', pagePost.addBlog);
/* 详情页 */
router.get('/blog/:bId', pagePost.getDetail);
/* 删除博客 */
router.get('/blog/:bId/remove', pagePost.remove);
/* 修改博客 */
router.get('/blog/:bId/update', pagePost.update);
/* 编辑 */
router.get('/editor', pagePost.editor);
router.get('/editor/:bId', pagePost.editor);
module.exports = router;
