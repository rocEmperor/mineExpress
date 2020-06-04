const express = require('express');
const bodyParser = require('body-parser')
const mineExpress = require('./mineExpress/index');
const mineBodyParser = require('./middlewares/bodyParser');

const app = express();
const mineApp = mineExpress();

// 静态文件
app.use(express.static('public'));
mineApp.use(mineExpress.static('public'))

// 解析post请求body
app.use(bodyParser.urlencoded({ extended: true })); 
mineApp.use(mineBodyParser)

app.post('/api', (req, res) => { 
    console.log('/api post请求来了');
    console.log('入参：', req.body)
    res.json({
        result: true,
        data: {
            valueL: '22333'
        }
    })
})
mineApp.post('/api', (req, res) => { 
    console.log('/api post请求来了');
    console.log('入参：', req.body)
    res.json({
        result: true,
        data: {
            valueL: '22333'
        }
    })
})

app.listen(8888, () => console.log('server start at 127.0.0.1:8888'));
mineApp.listen(9999, () => console.log('server start at 127.0.0.1:9999'))