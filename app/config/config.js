var dotenv = require('dotenv');
var app = require('../../package.json');
var errors = require('../resources/lang/errors.json')
var messages = require('../resources/lang/messages.json');
var adminMessages = require('../resources/lang/admin_messages.json');

dotenv.config();
const isTestEnvironment = process.env.NODE_ENV === 'test';
var config = {
    errors,
    messages,
    adminMessages,
    name: app.name,
    version: app.version,
    host: process.env.APP_HOST || '127.0.0.1',
    environment: process.env.NODE_ENV || 'development',
    appUrl: process.env.APP_URL || 'http://localhost:8888',
    port: (isTestEnvironment ? process.env.TEST_APP_PORT : process.env.APP_PORT) || '8000',
    pagination: {
        page: 1,
        maxRows: 20
    },
    auth: {
        saltRounds: process.env.SALT_ROUNDS || 11,
        accessTokenDuration: process.env.ACCESS_TOKEN_DURATION || '10m',
        refreshTokenDuration: process.env.REFRESH_TOKEN_DURATION || '24h',
        forgotOtpDuration: process.env.FORGOT_OTP_TOKEN_DURATION || '24h',
        smsOtpDuration: process.env.SMS_OTP_TOKEN_DURATION || '24h',
        emailVerificationDuration: process.env.EMAIL_VERIFICATION_DURATION || 24,
        accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY || '<ACCESS_TOKEN_SECRET_KEY>',
        refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY || '<REFRESH_TOKEN_SECRET_KEY>',
        forgotOtpTokenSecretKey: process.env.FORGOT_OTP_TOKEN_SECRET_KEY || '<FORGOT_OTP_TOKEN_SECRET_KEY>',
        smsOtpTokenSecretKey: process.env.SMS_OTP_TOKEN_SECRET_KEY || '<FORGOT_OTP_TOKEN_SECRET_KEY>'
    },
    logging: {
        dir: process.env.LOGGING_DIR || 'logs',
        level: process.env.LOGGING_LEVEL || 'debug',
        maxSize: process.env.LOGGING_MAX_SIZE || '20m',
        maxFiles: process.env.LOGGING_MAX_FILES || '7d',
        datePattern: process.env.LOGGING_DATE_PATTERN || 'YYYY-MM-DD'
    },
    NotificationType: {
        General: 'General'
    },

};

module.exports = config;