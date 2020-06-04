let queryString = require('query-string');
/**
 * post请求时，接口入参解析，将结果注入到req.body中
 */
module.exports = function (req, res, next) {
    if (req.method == 'POST') {
        let data = '';
        req.on('data', function (chunk) {
            // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
            data += chunk;
        })
        req.on('end', function () {
            data = decodeURI(data);
            if (data) {
                data = queryString.parse(data)
                req.body = data;
            }
            next()
        })
    }
}