
/**
 * * @param {Object} params
 * @returns {Response}
 */
 const createResponse = params => {
    const { response, code, success, message, data = {}, error = {} } = params;
    // console.log(data);
    // const data1 = encrypt(data.toString());
    // console.log(data1);
    // const data = (data1);
    // return  response.send(decrypt("1d39793bb90929cf879828ca94e4f190:37459abf10ec19584150ac758f322ae5"));
    // console.log(data);
    if (code == 422 || code == 501 || code == 401) {
        return response.status(code).json({
            success,
            message,
            error,
        });
    } else {
        return response.status(code).json({
            success,
            message,
            data,
        });
    }
};
const SuccessResponse = (
    response,
    message = 'Success',
    data = {},
    code = 200,
) => response.status(code).json({ message:message,data});

/**
 * @param {Request} request
 * @param {Response} response
 * @param {string} message
 * @param {*} error
 * @param {string|number} 
 * @returns {Response}
 */
const ErrorResponse = (
    request,
    response,
    message = 'Server Internal Error',
    error = {},
    code = 422,
) => {
    // console.log(error);
    return createResponse({
        response,
        code,
        message,
        error,
    });
};
/**
 * @param {Request} request
 * @param {Response} response
 * @param {*} error
 * @param {string} message
 * @param {string|number} code
 * @returns {Response}
 */
module.exports = {
    
    SuccessResponse,
    ErrorResponse,
    createResponse,
   
};