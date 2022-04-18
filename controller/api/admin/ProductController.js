const md5 = require("md5");
var jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')
const multer = require('multer');
const path = require("path");

const {
    User,
    Product
} = require('../../../helpers/DBconnect');

const {
    ErrorResponse,
    SuccessResponse,
} = require("../../../helpers/response");

const { loginValidation, singupValidationjs } = require("../../../helpers/validator/CreateUservalidator");


const update_product = (async(req, res) => {
    try {

        let check_product = await Product.findOne({ where: { id: req.body.id, user_id: req.body.user_id } });

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


const deleted_product = (async(req, res) => {
    try {
        if (!req.body.id) {
            return ErrorResponse(req, res, 'product id is required', {}, 422);
        }


        let check_data = await Product.findOne({ where: { id: req.body.id } });
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
    update_product,
    deleted_product,
}