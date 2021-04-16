var express = require("express");
var articleController = require("../controller/article");
var userController = require("../controller/users");
var commentController = require("../controller/comment");
var { authenticate } = require('../middlewares/authenticate');

var multer = require('multer');
var crypto = require('crypto');
var mime = require('mime');

var storageUser = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.USER_IMAGE_PATH + '/')
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
        });
    }
});
var uploadUserIMG = multer({ storage: storageUser });

var router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

router.post('/profile_update', authenticate, [uploadUserIMG.single('img')], userController.profileUpdate);

router.get('/article_list', articleController.articleList);
router.get('/popular_articles', articleController.popularArticle);
router.get('/related_articles', articleController.relatedArticle);
router.get('/one_block_list', articleController.oneBlockList);
router.get('/second_block_list', articleController.secondBlockList);
router.get('/view_count', articleController.viewCount);


router.post('/comment_add', authenticate, commentController.commentAdd);
router.get('/comment_list', commentController.commentList);


module.exports = router;