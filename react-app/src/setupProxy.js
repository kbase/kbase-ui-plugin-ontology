const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');

module.exports = function (app) {
    // app.use(proxy('/services/service_wizard', { target: 'http://localhost:3001', changeOrigin: true }));
    app.use(createProxyMiddleware('/services/', { target: 'https://kbase.us', changeOrigin: true, secure: false }));
    app.use(createProxyMiddleware('/dynserv/', { target: 'https://kbase.us', changeOrigin: true, secure: false }));
    app.use(morgan('combined'));
};
