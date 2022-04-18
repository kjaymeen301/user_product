const md5 = require("md5");
var jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')
const multer = require('multer');

const {
    User,
} = require('../../helpers/DBconnect');

const {
    ErrorResponse,
    SuccessResponse,
} = require("../../helpers/response");

const { loginValidation, singupValidationjs } = require("../../helpers/validator/CreateUservalidator");
const path = require("path");

//user register
const register = (async(req, res) => {
    try {
        const validationResult = loginValidation(req.body, req, res);
        if (validationResult.status == true) {
            return ErrorResponse(req, res, validationResult.message, validationResult.error, 422);
        }


        let check_email = await User.findOne({ where: { email: req.body.email } });

        if (check_email) {
            // console.log(check_email);

            if (check_email.password === md5(req.body.password)) {
                let tokendata = md5(Math.floor(Math.random() * 9000000000) + 1000000000) + md5(new Date(new Date().toUTCString()));
                let token = jwt.sign({
                    tokendata
                }, process.env.secret, {
                    expiresIn: '24h'
                });
                console.log(check_email.id);

                let id = check_email.id;

                let user_update = await User.update({ token: tokendata }, {
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


                return SuccessResponse(res, "Login Successfully", newdata);

            } else {
                return ErrorResponse(req, res, "The password you entered is incorrect", {}, 422);
            }

        } else {

            const validationResult = singupValidationjs(req.body, req, res);
            if (validationResult.status == true) {
                return ErrorResponse(req, res, validationResult.message, validationResult.error, 422);
            }



            let password = req.body.password;
            let confirm_password = req.body.confirm_password;

            //password and conconfirmpassword check
            if (password === confirm_password) {


                let tokendata = md5(Math.floor(Math.random() * 9000000000) + 1000000000) + md5(new Date(new Date().toUTCString()));
                let token = jwt.sign({
                    tokendata
                }, process.env.secret, {
                    expiresIn: '24h'
                });


                // var user = new User;
                let userobject = {
                    name: req.body.name,
                    email: req.body.email,
                    password: md5(password),
                    token: tokendata
                }

                let user = await User.create(userobject);

                // user.token = token;

                let newdata = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    token: token,
                    status: user.status,
                }
                return SuccessResponse(res, "Register Successfully", newdata);

            } else {

                return ErrorResponse(req, res, "password are not maching", {}, 422);

            }
        }
    } catch (err) {
        console.log(err);
        return ErrorResponse(req, res, 'Internal Server error', err, 501);
    }
})



const user_update = (async(req, res) => {
    try {

        const id = req.decoded.id;

        const user_update = await User.update(req.body, {
                where: {
                    id
                }
            })
            .then(data => {
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



const upload_image = (async(req, res) => {

    const userInfo = req.decoded;

    let filename;
    const storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, './public/uploads/product/');
            // const destdir = './public/uploads/restaurant/';
            // mkdirp('./public/uploads/restaurant/');

            // const made = mkdirp.sync('./public/uploads/restaurant/')
            // console.log(`made directories, starting with ${made}`)
        },
        filename: function(req, file, callback) {
            callback(null, md5(Date.now()) + path.extname(file.originalname));
        }
    });
    const uploaFiles = multer({
        storage: storage,
        // fileFilter: imageFilter
    }).single('avatar');
    uploaFiles(req, res, async(err) => {
        if (!req.file) {
            return ErrorResponse(req, res, 'Please select a image', {
                avatar: "Please select a image"
            }, 422);
        } else if (err) {
            console.error(err);
            return ErrorResponse(req, res, err, err, 422);
        } else {
            // const {
            //     restaurant_id,
            //     type
            // } = req.body;

            try {
                return SuccessResponse(res, "Image Updated Successfully", {
                    filename: req.file.filename,
                });
            } catch (err) {
                console.log(err);
                return ErrorResponse(req, res, 'Internal Server error', err, 501);
            }
        }
    });
});



const refresh_user_auth_token = (async(req, res) => {


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
    let tokenupdate = await User.update(userupdatdata, {
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

    userupdatInfo = await User.update(userupdatdata, {
        where: {
            id: uid
        }
    });

    return SuccessResponse(res, "Logout Successfully", {});

});


module.exports = {
    register,
    user_update,
    upload_image,
    refresh_user_auth_token,
    logout
}