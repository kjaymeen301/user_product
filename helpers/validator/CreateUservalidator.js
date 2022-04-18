const Joi = require('joi');

const _validationOptions = {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: true,
};

const createUserSchema = Joi.object().keys({
    name: Joi.string().required().label('Name is required'),
    email: Joi.string().required().email().label('Email is required'),
    password: Joi.string().min(3).max(8).required().label('Password is required'),
    confirm_password: Joi.string().valid(Joi.ref('password')).required().label('Confirm password is required')


});

const loginUserSchema = Joi.object().keys({
    email: Joi.string().email().label('Email is required'),
    password: Joi.string().min(3).max(8).label('Password is required'),
});


const singupValidationjs  =  ((payload, req, res) => {

    let validationResult;
        validationResult = createUserSchema.validate(payload, _validationOptions);

    if (validationResult.error) {
        const error = {};
        var detailsArray = validationResult.error.details;

        const message = "Validation Failed";
        detailsArray.forEach(element => {

            const key = element['context'].key;
            error[`${key}`] = element['context'].label;
        });
        return { status: true, message: message, error: error };
    }
    return { status: false };
});

const loginValidation  =  ((payload, req, res) => {

    let validationResult;
        validationResult = loginUserSchema.validate(payload, _validationOptions);

    if (validationResult.error) {
        const error = {};
        var detailsArray = validationResult.error.details;

        const message = "Validation Failed";
        detailsArray.forEach(element => {

            const key = element['context'].key;
            error[`${key}`] = element['context'].label;
        });
        return { status: true, message: message, error: error };
    }
    return { status: false };
});

module.exports = {
    singupValidationjs,
    loginValidation
};