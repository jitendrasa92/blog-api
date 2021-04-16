var config = require("../../config/config");
var Admin = require("../../models/adminModel");
const { adminMessages } = config;

var jwt = require('../../utils/jwt');
/**
 * Create Admin session for valid Admin login.
 */
// exports.login = async (req, res) => {

//     const { email, password } = req;
//     const admin = await Admin.findOne({ where: { email } });
//     if (admin) {
//         console.log(admin.password);
//         logger.log('debug', 'Login: Fetched admin by email -', admin.email);
//         logger.log('debug', 'Login: Comparing password');
//         const isSame = await bcrypt.compare(password, admin.password);

//         logger.log('debug', 'Login: Password match status - %s', isSame);
//         if (isSame) {
//             const { id: adminId } = admin;
//             const loggedInUser = { adminId };
//             const refreshToken = jwt.generateRefreshToken(loggedInUser);
//             //const userSessionPayload = { userId, token: refreshToken };
//             //const session = await sessionService.create(userSessionPayload);
//             const accessToken = jwt.generateAccessToken({ ...loggedInUser });

//             return [admin, { refreshToken, accessToken }];
//             //return { accessToken };
//         }
//     } else {

//     }
//     throw new UnauthorizedError(errors.invalidCredentials);
// }

// exports.verifyForgotOTPToken = async (req, res) => {
//     try {
//         var finaldata = ''
//         console.log(req.forgotToken);
//         if (!req.forgotToken) {
//             return false;
//         }
//         logger.log('info', 'JWT: Verifying forgot password OTP token - %s', req.forgotToken);
//         const response = jwt.verifyForgotOTPToken(req.forgotToken);
//         finaldata = response.data;
//         logger.log('debug', 'JWT: forgot password OTP token verified -', finaldata);
//         return finaldata;
//     } catch (err) {
//         logger.log('error', 'JWT: forgot password OTP token failed - %s', err.message);
//     }
// }