let url = require('url');
let queryString = require('query-string');

/**
 * request对象基本参数解析
 */
module.exports = function (req, res) {
    let { host } = req.headers;
    host = host.split(':');
    req.method = req.method; // 请求方式GET || POST and so on
    req.path = url.parse(req.url).pathname; // 请求路由
    req.pathArray = req.path.split('/');
    let pathArr = req.path.split('.');
    req.suffix = pathArr[pathArr.length - 1]; // 当前路由后缀，如.html类型会有真值
    req.hostname = host[0]; // 当前客户访问域名
    req.port = host[1] || undefined; // 当前访问客户端端口
    req.query = {}; // get请求时参数储存位置
    if (req.method == 'GET') {
        req.query = queryString.parse(url.parse(req.url).search);
    }
    req.body = {}; // post请求时参数储存位置，通过body-parsing中间件进行解析，默认为空

}