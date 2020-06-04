const http = require('http');
const reqParamsParse = require('../middlewares/reqParamsParse');
const resApiParse = require('../middlewares/resApiParse');

/**
 * 注册中间件及路由方式总览
 * 1:app.use(function () {}) // 注册中间件
 * 2:app.use('/api', function () {}) // 注册路由
 * 3:app.post('/api', function () {}) // 注册post请求
 * 4:app.get('/api', function () {}) // 注册get请求
  */
class BaseApplication {
    constructor (props) {
        this.app = {}; // 1.http服务实例
        this.stack = []; // 储存路由及中间件的容器
        this.requestListener = this.requestListener.bind(this)

        this.createServer() // 创建一个http服务
    }
    // 注册中间件
    use (pathname, middleware) {
        // 如果pathname时function，说明是中间件注册
        if (typeof pathname == 'function') {
            middleware = pathname;
            this.stack.push({
                type: 'middleware',
                hook: middleware
            })
        } else if (typeof pathname == 'string') { // 如果pathname时string，说明是路由注册
            this.stack.push({
                type: 'route',
                path: pathname,
                hook: middleware
            })
        }
    }
    // 注册post请求
    post (pathname, callback) {
        this.stack.push({
            type: 'route',
            path: pathname,
            hook: callback,
            method: 'POST'
        })
    }
    // 注册post请求
    get (pathname, callback) {
        this.stack.push({
            type: 'route',
            path: pathname,
            hook: callback,
            method: 'GET'
        })
    }
    // http request事件监听器
    requestListener (req, res) {
        // req, res对象封装处理
        reqParamsParse(req, res) // req对象参数解析
        resApiParse(req, res) // res对象基础api封装

        // 批量执行中间件及中间件，按use推入顺序执行，遇到未使用next则停止
        this.runMiddlewares(req, res)
    } 
    // 用于判断当前执行为中间件还是数组，如果是中间件，则直接执行hook，如果是路由，则粗判断路由是命中，如果
    // 未命中，则直接执行next()，如果命中，才执对应的hook
    runing (req, res, next, target) {
        if (target && Object.prototype.toString.call(target) == '[object Object]') {
            if (target.type == 'middleware') { // 中间件
                target.hook(req, res, next)
            } else if (target.type == 'route')  { // 路由
                // 判断注册路由时时候声请求方式
                let hitMethod = target.method ? req.method == target.method : true;
                if (target.path == req.path && hitMethod) {
                    target.hook(req, res, next)
                } else {
                    next()
                }
            }
        }
    }
    // 批量执行中间件及中间件
    runMiddlewares (req, res) {
        // 闭包储存每次http请求，用于消费的路由及中间件容器
        let stackList = [ ...this.stack ]; // copy stack
        let next = () => {
            let middleware = stackList.shift()
            if (middleware) {
                this.runing(req, res, next, middleware)
            }
        }
        let frist = stackList.shift();

        // 从第一个路由或者中间件开始递归执行
        this.runing(req, res, next, frist)
    }
    // 创建http服务
    createServer () {
        this.app = http.createServer(this.requestListener)
    }
    // 监听端口
    listen (port, cb) {
        this.app.listen(port || 3000, cb)
    }
}   
module.exports = BaseApplication;