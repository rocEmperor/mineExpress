module.exports = {
    // 判断当前路径类型(相对路径或者绝对路径)
    whichPathType: (url) => {
        let res = undefined;
        if (url) {
            let flag1 = url.indexOf('http') != -1;
            let flag2 = url.indexOf('./') != -1;
            if (flag1 && !flag2) { // 绝对路径
                res = 'absolutely'
            }
            if (!flag1 && flag2) { // 相对路径
                res = 'relative'
            }
        }
        return res;
    }
}