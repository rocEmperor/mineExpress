$.ajax('/api', {
    type: 'post',
    data: {
        key: '我是post请求参数'
    },
    success: function (data) {
        console.log(data, '响应数据')
    }
})