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

function getUserInfo(){
    // 用户已经同意小程序获取用户信息，后续调用 wx.getUserInfo 接口不会弹窗询问
    wx.getUserInfo({
        success: function (res) {
            var userInfo = res.userInfo;
            var info = {
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl,
                gender: userInfo.gender, //性别 0：未知、1：男、2：女
                province: userInfo.province,
                city: userInfo.city,
                country: userInfo.country
            }
            console.log(info);
            wx.setStorageSync('session', 1); // 此时是授权未注册状态
        }
    })
}

// 确认授权提示框
function authorizeConfirm() {
    wx.showModal({
        title: '确认授权？',
        showCancel: true,
        cancelText: '不',
        confirmText: '好吧',
        confirmColor: '#1371bc',
        success(res) {
            if (res.confirm) {
                wx.openSetting({
                    success: (res) => {
                        console.log(res)
                    }
                });
            } else if (res.cancel) {
                console.log('取消授权');
            }
        }
    });
}

module.exports = {
    http, formatTime, authorizeConfirm, getUserInfo
}