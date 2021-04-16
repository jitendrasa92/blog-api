const jwbt = require("jsonwebtoken");
var logger = require("./logger");
var config = require("../config/config");
const { accessTokenDuration, accessTokenSecretKey, refreshTokenDuration, refreshTokenSecretKey, forgotOtpDuration, forgotOtpTokenSecretKey } = config.auth;

/**
 * Generate access token from given data
 *
 */
//exports function generateAccessToken(data) {
exports.generateAccessToken = async (data, res) => {
    logger.log('info', 'JWT: Generating access token -', { data, expiresIn: accessTokenDuration });

    let accessToken = jwbt.sign({ data }, accessTokenSecretKey, { expiresIn: accessTokenDuration });
    return accessToken;

}

/**
 * Generate refresh token from given data
 *
 */
exports.generateRefreshToken = async (data, res) => {
    logger.log('info', 'JWT: Generating refresh token -', { data, expiresIn: refreshTokenDuration });

    let refreshToken = jwbt.sign({ data }, refreshTokenSecretKey, { expiresIn: refreshTokenDuration });
    return refreshToken;
}

exports.generateForgotOTPToken = async (data, res) => {
    logger.log('info', 'JWT: Generating forgot OTP token -', { data, expiresIn: forgotOtpDuration });

    return jwbt.sign({ data }, forgotOtpTokenSecretKey, { expiresIn: forgotOtpDuration });
}

exports.verifyAccessToken = async (token, res) => {
    return await jwbt.verify(token, accessTokenSecretKey);

}

/**
 * Verify Forgot OTP token.
 *
 */
exports.verifyForgotOTPToken = async (token, res) => {
    return jwbt.verify(token, forgotOtpTokenSecretKey);
}