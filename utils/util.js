function http(url, callback, data, method) {
    data = data || {};
    method = method || 'GET';
    var session_id = wx.getStorageSync('sessionId');//本地取存储的sessionID  
    if (session_id != "" && session_id != null) {
        var header = { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': session_id }
    } else {
        var header = { 'content-type': 'application/x-www-form-urlencoded' }
    }  
    wx.request({
        url: url,
        data: data,
        method: method,
        header: header,
        success: function (res) {
            console.log(res);
            if (session_id == "" || session_id == null) {
                wx.setStorageSync('sessionId', res.header['Set-Cookie']) //如果本地没有就说明第一次请求 把返回的session id 存入本地  
            }  
            return typeof callback == "function" && callback(res);
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

// 获取用户信息
function getUserInfo(){
    var info = {};
    // 用户已经同意小程序获取用户信息，后续调用 wx.getUserInfo 接口不会弹窗询问
    wx.getUserInfo({
        success: function (res) {
            var userInfo = res.userInfo;
            info = {
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl,
                gender: userInfo.gender, //性别 0：未知、1：男、2：女
                province: userInfo.province,
                city: userInfo.city,
                country: userInfo.country
            }
            console.log(info);
        }
    });
    return info;
}

// 确认授权提示框
function authorizeConfirm(callback) {
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
                        console.log(res);
                        callback && callback();
                    }
                });
            } else if (res.cancel) {
                console.log('取消授权');
            }
        }
    });
}

// 获取随机数
function getRandomNum (){
    return (new Date().getTime()) + '' + Math.floor(Math.random()*1000000);
}

module.exports = {
    http, formatTime, authorizeConfirm, getUserInfo, getRandomNum
}

