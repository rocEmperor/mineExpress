let path  = require('path');
let fs = require("fs");

// json数据的contentType application/json; charset=utf-8
const contentTypeMap = {
    html: 'text/html;charset=utf-8',
    htm: 'text/html;charset=utf-8',
    jpeg: 'image/jpeg',
    jpg: 'image/jpg',
    png: 'image/png',
    js: 'application/javascript;charset=utf-8',
    css: 'text/css; charset=UTF-8'
}
/**
 * 静态资源中间件
 */
module.exports = function static (staticPath, options) {
    if (!options) {
        options = {
            extensions: [ 'htm', 'html', 'jpeg', 'jpg', 'png', 'js', 'css' ],
        }
    }
    let { extensions } = options;
    extensions = extensions || [];
    return function (req, res, next, app) {
        let has = false;
        extensions.forEach((item) => {
            if (req.suffix == item) {
                has = true;
            }
        })
        if (has) {
            let fileName = req.pathArray[req.pathArray.length - 1]
            let targetPath = path.resolve(__dirname, `../${staticPath}/${fileName}`);
            fs.readFile(targetPath, (err, data) => {
                if (err) { return console.error(err) }
                
                res.setHeader('Content-Type', contentTypeMap[req.suffix]);
                res.end(data)
            })
        } else {
            next()
        }
    }
}