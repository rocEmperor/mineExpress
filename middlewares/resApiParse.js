let util = require('../util');
let path  = require('path');

/**
 * response对象基本api包装
 */
module.exports = function (req, res) {
    let hasSetContentType = false;
    // 设置响应头Content-Type
    res.type = function (type) {
        if (type) {
            hasSetContentType = true;
            res.setHeader('Content-Type', type);
        }
        return res;
    }
    // 设置响应头，按key，value形式key是响应头类型，value是响应头值
    res.set = function (options) {
        options = options || {};
        for (let k in options) {
            if (k && options[k]) {
                if (k == 'Content-Type') {
                    hasSetContentType = true;
                }
                res.setHeader(k, options[k]);
            }
        }
        return res;
    }
    // 设置响应状态码及报文
    res.status = function (status, depiction) {
        if (status) {
            if (depiction) {
                res.writeHead(status, depiction)
            } else {
                res.writeHead(status)
            }
        }
        return res;
    }
    // 直接向客户端响应json数据
    res.json = function (data) {
        if (data) {
            res.type('application/json; charset=utf-8');
            res.end(JSON.stringify(data))
        }
        return res;
    }
    // 直接向客户端响应html脚本
    res.html = function (data) {
        if (data) {
            res.type('text/html;charset=utf-8');
            res.end(data)
        }
        return res;
    }
    // 直接向客户端响应stream
    res.stream = function (data) {
        if (data) {
            res.type('application/octet-stream');
            res.end(data)
        }
        return res;
    }
    // 作用等同于res.end，参数分为3种情况
    // 1：typeof data == 'object' && data != null 向客户端详情json格式
    // 2：typeof data == 'string' 向客户端响应html脚本
    // 3：是buffer类型，则直接响应流
    // 注意：当hasSetContentType为true时，说明用户已经设置过Content-Type，所以不需要重复设置
    res.send = function (data) {
        if (data) {
            if (typeof data == 'object' && data != null) {
                res.json(data)
            }
            if (typeof data == 'string') {
                res.html(data)
            }
            if (Buffer.isBuffer(data)) {
                res.stream(data) 
            }
        }
        return res;
    }
    // 重定向
    // url参数类型：绝对路径或者相对路径
    // 注意：重定向对ajax请求无效，目前只可以重定向当前域名下的地址
    res.redirect = function (url, status) {
        // 302 临时重定向 301 永久重定向
        status = status || 302;
        // 当前传入为相对路径
        if (util.whichPathType(url) && util.whichPathType(url) == 'relative') {
            url = path.resolve(__dirname, `../${url}`);
        }
        // 这里需要主要注意下，nodejs的writeHead执行完后，再调用setHeader会报错，需要将writeHead放到setHeader的后面执行
        res.set({ Location: url })
        res.status(status)
        res.end('页面重定向了')
        return res;
    }
}