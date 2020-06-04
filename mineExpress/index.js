const BaseApplication = require('./baseApplication');
const static = require('../middlewares/static');

function createApplication () {
    return new BaseApplication()
}
exports = module.exports = createApplication;
// 静态资源中间件
exports.static = static;