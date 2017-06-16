function http(url, callback, data, method) {
    data = data || {};
    method = method || 'GET';
    wx.request({
        url: url,
        data: data,
        method: method,
        header: { 'content-type': 'application/json' },
        success: function (res) {
            return typeof callback == "function" && callback(res)
        },
        fail: function () {
            return typeof callback == "function" && callback(false)
        }
    })
}  

// 格式化时间
function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}  

module.exports = {
    http, formatTime
}