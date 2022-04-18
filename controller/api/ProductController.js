const md5 = require("md5");
var jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')
const multer = require('multer');
const path = require("path");

const {
    User,
    Product
} = require('../../helpers/DBconnect');

const {
    ErrorResponse,
    SuccessResponse,
} = require("../../helpers/response");

const { loginValidation, singupValidationjs } = require("../../helpers/validator/CreateUservalidator");

const create_product = (async(req, res) => {
    try {
        // const validationResult = loginValidation(req.body, req, res);
        // if (validationResult.status == true) {
        //     return ErrorResponse(req, res, validationResult.message, validationResult.error, 422);
        // }

        let check_product = await Product.findOne({ where: { title: req.body.title } });

        if (check_product) {
            return ErrorResponse(req, res, 'product already created', {}, 422);
        }
        let productObject = {
            user_id: req.decoded.id,
            title: req.body.title,
            image: req.body.image,
            price: req.body.price,
            status: 1
        }

        let productCreated = await Product.create(productObject);
        return SuccessResponse(res, "Data insert Successfully", productCreated);


    } catch (err) {
        console.log(err);
        return ErrorResponse(req, res, 'Internal Server error', err, 501);
    }
})




const update_product = (async(req, res) => {
    try {

        const user_id = req.decoded.id;

        // check product is user or not
        let check_product = await Product.findOne({ where: { id: req.body.id, user_id: user_id } });

        if (!check_product) {
            return ErrorResponse(req, res, 'Your Produt is not found', {}, 422);
        }


        const user_update = await Product.update(req.body, {
                where: {
                    id: req.body.id
                }
            })
            .then(data => {
                return SuccessResponse(res, "Data Update Successfully", {});
            });

    } catch (err) {
        console.log(err);
        return ErrorResponse(req, res, 'Internal Server error', err, 501);
    }

})


const product_list = (async(req, res) => {


    let check_product = await Product.findAll({ attributes: ['id', 'title', 'image', 'price'], where: { status: 1 } });
    return SuccessResponse(res, "Data get successfully", check_product);
});



const deleted_product = (async(req, res) => {
    try {

        let user_id = req.decoded.id;
        if (!req.body.id) {
            return ErrorResponse(req, res, 'product id is required', {}, 422);
        }


        let check_data = await Product.findOne({ where: { id: req.body.id, user_id: user_id } });
        if (check_data) {
            await Product.destroy({ where: { id: req.body.id } });

            return SuccessResponse(res, "Data deleted Successfully", {});
        } else {
            return ErrorResponse(req, res, 'Data not found', {}, 422);
        }


    } catch (err) {
        console.log(err);
        return ErrorResponse(req, res, 'Internal Server error', err, 501);
    }
})

module.exports = {
    create_product,
    update_product,
    product_list,
    deleted_product
}