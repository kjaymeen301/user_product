const express = require('express');

const router = express.Router();
require("../helpers/DBconnect");

// // authentication Middle Ware 
const verifyToken = require('../middelewares/index');
const adminVerifyToken = require('../middelewares/admin');

const UserController = require('../controller/api/UserController');
const ProductController = require('../controller/api/ProductController');
const AdminControllerAPI = require('../controller/api/admin/UserController');
const ProductControllerAPI = require('../controller/api/admin/ProductController');


//api routes
router.prefix('/api/user', (route) => {
    route.post('/register', UserController.register);
    route.patch('/update', verifyToken, UserController.user_update);
    route.post('/add-product', verifyToken, ProductController.create_product);
    route.patch('/update-product', verifyToken, ProductController.update_product);
    route.get('/product-list', verifyToken, ProductController.product_list);
    route.get('/user-refresh-token', verifyToken, UserController.refresh_user_auth_token);
    route.delete('/product-delete', verifyToken, ProductController.deleted_product);

    route.get('/logout', verifyToken, UserController.logout);
});

router.post('/api/upload_image', UserController.upload_image);

router.prefix('/api/admin', (route) => {
    route.post('/login', AdminControllerAPI.login);
    route.get('/user_list', adminVerifyToken, AdminControllerAPI.user_list);
    route.delete('/user_delete', adminVerifyToken, AdminControllerAPI.user_delete);
    route.patch('/user_update', adminVerifyToken, AdminControllerAPI.user_update);

    route.delete('/product_delete', adminVerifyToken, ProductControllerAPI.deleted_product);
    route.patch('/product_update', adminVerifyToken, ProductControllerAPI.update_product);


    route.get('/admin-refresh-token', adminVerifyToken, AdminControllerAPI.refresh_admin_auth_token);
    route.get('/logout', adminVerifyToken, AdminControllerAPI.logout);

});


module.exports = router;