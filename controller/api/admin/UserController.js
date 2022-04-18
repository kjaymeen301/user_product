const md5 = require('md5');
const Sequelize = require('sequelize');
const { User, Product, Admin } = require('../../../helpers/DBconnect');
var jwt = require('jsonwebtoken')
const multer = require('multer');
const path = require("path");

const {
    ErrorResponse,
    SuccessResponse,
} = require("../../../helpers/response");

const { loginValidation } = require("../../../helpers/validator/CreateUservalidator");

//update user
const user_update = (async(req, res) => {
    try {
        // const validationResult = loginValidation(req.body, req, res);

        // if (validationResult.status) {
        //     return ErrorResponse(req, res, validationResult.message, validationResult.error, 422);
        // }
        const id = req.body.id;



        let check_data = await User.findOne({ where: { id } });

        if (!check_data) {
            return ErrorResponse(req, res, 'data not found', {}, 500);
        }

        const user_update = await User.update(req.body, {
                where: {
                    id
                }
            })
            .then(async(data) => {

                if (req.body.status) {
                    if (req.body.status != 1) {
                        await Product.update({ status: 2 }, {
                            where: {
                                user_id: req.body.id
                            }
                        });
                    }
                    if (req.body.status == 1) {
                        await Product.update({ status: 1 }, {
                            where: {
                                user_id: req.body.id
                            }
                        });
                    }
                }

                return SuccessResponse(res, "Data Update Successfully", {});
            })
            .catch(err => {
                return ErrorResponse(req, res, 'Invalide record', err, 500);
            });
    } catch (err) {
        console.log(err);
        return ErrorResponse(req, res, 'Internal Server error', err, 501);
    }

})

//delete user
const user_delete = (async(req, res, err) => {

    const id = req.body.id;
    if (!id) {

        return ErrorResponse(req, res, 'Id field is required', err);

    } else {

        await Product.destroy({ where: { user_id: id } });

        await User.destroy({ where: { id } })
            .then(data => {
                return SuccessResponse(res, "User delete Successfully", data);
            })
            .catch(err => {
                return ErrorResponse(req, res, 'Invalide record', err, 400);
            });
    }
})

//user listing

const user_list = (async(req, res) => {
    try {

        const user_list = await User.findAll({ attributes: ['id', 'name', 'email', 'status'] })
        return SuccessResponse(res, "List of data", user_list);
    } catch (err) {
        console.log(err);
        return ErrorResponse(req, res, 'Internal Server error', err, 501);
    }

})




const login = (async(req, res) => {
    try {
        const validationResult = loginValidation(req.body, req, res);
        if (validationResult.status == true) {
            return ErrorResponse(req, res, validationResult.message, validationResult.error, 422);
        }


        let check_email = await Admin.findOne({ where: { email: req.body.email } });

        if (check_email) {
            // console.log(check_email);

            if (check_email.password === md5(req.body.password)) {
                let tokendata = md5(Math.floor(Math.random() * 9000000000) + 1000000000) + md5(new Date(new Date().toUTCString()));
                let token = jwt.sign({
                    tokendata
                }, process.env.secret, {
                    expiresIn: '24h'
                });

                let id = check_email.id;

                let user_update = await Admin.update({ token: tokendata }, {
                    where: {
                        id: id
                    }
                });

                let newdata = {
                    id: check_email.id,
                    name: check_email.name,
                    email: check_email.email,
                    token: token,
                    status: check_email.status,
                }


                return SuccessResponse(res, "Login  Successfully", newdata);

            } else {
                return ErrorResponse(req, res, "The password you entered is incorrect", {}, 422);
            }

        } else {
            return ErrorResponse(req, res, 'email not found', {}, 422);
        }
    } catch (err) {
        console.log(err);
        return ErrorResponse(req, res, 'Internal Server error', err, 501);
    }
})


const refresh_admin_auth_token = (async(req, res) => {


    let olduser = req.decoded;

    let tokendata = md5(Math.floor(Math.random() * 9000000000) + 1000000000) + md5(new Date(new Date().toUTCString()));
    let token = jwt.sign({
        tokendata
    }, process.env.secret, {
        expiresIn: '24h'
    });

    let userupdatdata = {
        token: tokendata,
    }
    let tokenupdate = await Admin.update(userupdatdata, {
        where: {
            id: olduser.id
        }
    });

    return SuccessResponse(res, "Login Successfully", { "token": token });
});


const logout = (async(req, res) => {

    const userInfo = req.decoded;

    var uid = userInfo.id;

    let userupdatdata;
    userupdatdata = {
        token: '',
    }

    userupdatInfo = await Admin.update(userupdatdata, {
        where: {
            id: uid
        }
    });

    return SuccessResponse(res, "Logout Successfully", {});

});

module.exports = {
    user_list,
    user_delete,
    user_update,
    login,
    refresh_admin_auth_token,
    logout
}