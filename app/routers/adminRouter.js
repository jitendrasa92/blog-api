var express = require('express');
var router = express.Router();
var multer = require('multer');
var crypto = require('crypto');
var mime = require('mime');
var adminController = require('../controller/admin/admin');
var articleController = require('../controller/admin/article');
var subAdminController = require('../controller/admin/subAdmin');
var pageController = require('../controller/admin/content');
var settingController = require('../controller/admin/setting');
var notificationController = require('../controller/admin/notification');
var userController = require('../controller/admin/user');
var categoryController = require('../controller/admin/category');

var { authenticate } = require('../middlewares/authenticate');



var storageAricle = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.ARTICLE_IMAGE_PATH + '/')
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
        });
    }
});
var uploadArticleIMG = multer({ storage: storageAricle });

var storageSubAdmin = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.SUBADMIN_IMAGE_PATH + '/')
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
        });
    }
});
var uploadSubAdminIMG = multer({ storage: storageSubAdmin });

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

router.post('/login', adminController.login);
router.post('/forgot_password', adminController.forgotPassword);
router.post('/forgot_otp_verify', adminController.forgotOtpVerify);

//router.post('/password_change', authenticate, adminController.changePassword);
router.post('/password_change', adminController.changePassword);

router.get('/subadmin_list', authenticate, subAdminController.subAdminList);
router.post('/subadmin_add', authenticate, [uploadSubAdminIMG.single('img')], subAdminController.subAdminAdd);
router.put('/subadmin_edit', authenticate, [uploadSubAdminIMG.single('img')], subAdminController.subAdminEdit);

router.get('/article_list', authenticate, articleController.articleList);
router.post('/article_add', authenticate, [uploadArticleIMG.single('img')], articleController.articleAdd);
router.put('/article_edit', authenticate, [uploadArticleIMG.single('img')], articleController.articleEdit);
router.get('/article_delete', authenticate, [uploadArticleIMG.single('img')], articleController.articleDelete);

router.get('/category_list', authenticate, categoryController.categoryList);
router.post('/category_add', authenticate, categoryController.categoryAdd);
router.put('/category_edit', authenticate, categoryController.categoryEdit);
router.get('/category_list_all', authenticate, categoryController.categoryListAll);

router.get('/page_list', authenticate, pageController.pageList);
router.post('/page_add', authenticate, pageController.pageAdd);
router.put('/page_edit', authenticate, pageController.pageEdit);
//router.get('/page_delete', authenticate, pageController.pageDelete);


router.get('/users_list', authenticate, userController.userList);
router.post('/user_add', authenticate, [uploadUserIMG.single('img')], userController.userAdd);
router.put('/user_edit', authenticate, [uploadUserIMG.single('img')], userController.userEdit);

router.get('/get_settings', authenticate, settingController.getSetting);
router.put('/edit_settings', authenticate, settingController.editSetting);

router.get('/notification_list', authenticate, notificationController.notificationList);
router.post('/notification_send', authenticate, notificationController.sendNotification);

module.exports = router;