var app = getApp();
var util = require('../../utils/util');
Page({
    data: {
        totalMoney: 1800.00,

        moneyUseable: 198.90,
        allInterest: 120.89,
        payamount: 100.90,

        loginFlag: true,
        inputShowed: true,
        phoneVal: "",
        authCode: "",
        imgCode: "",
        indicatorDots: false,
        autoplay: false,
        interval: 3000,
        duration: 800,
        codeFlag: true,
        count: 60,
        loginStatus: app.globalData.loginStatus_g
    },
    onLoad: function (options) {
        var session = wx.getStorageSync('session');
        // 如果是登陆状态，请求接口加载登陆页用户个人数据
        if(session===2) {
            this.setData({
                loginFlag: false
            });
            var url = app.globalData.webUrl + 'wechatApplet/person';
            util.http(url, this.getData);
        }
    },
    getData(res) {
        if (res.data.state == 1) {
            this.setData({
                totalMoney: res.data.date.totalMoney,
                moneyUseable: res.data.date.moneyUseable,
                allInterest: res.data.date.allInterest,
                payamount: res.data.date.payamount
            })
        } else {
            wx.showModal({
                title: res.data.errorInfo,
                showCancel: false,
                confirmColor: "#289fe1"
            });
            return;
        }

    },
    login(ev) {
        var that = this;
        var session = wx.getStorageSync('session');
        console.log('session' + session);
        // 未授权未注册
        if (!session) {
            // 获取授权
            wx.authorize({
                scope: 'scope.userInfo',
                success() {
                    // 用户已经同意小程序获取用户信息，后续调用 wx.getUserInfo 接口不会弹窗询问
                    var userInfo = util.getUserInfo();
                    wx.setStorageSync('session', 1);
                    // 授权成功后跳转注册页
                    wx.navigateTo({
                        url: '../mine/register/register?userInfo=' + JSON.stringify(userInfo)
                    })
                },
                fail(res) {
                    // 用户点击拒绝授权会进入fail回调
                    console.log('fail');
                    // 首次拒绝不会执行此方法
                    if (that.data.flag) {
                        // 弹窗提示用户手动开启授权
                        function goRegisterPage() {
                            var userInfo = util.getUserInfo();
                            wx.setStorageSync('session', 1);
                            wx.navigateTo({
                                url: '../mine/register/register?userInfo='+JSON.stringify(userInfo)
                            });
                        }
                        util.authorizeConfirm(goRegisterPage);
                    }
                    that.setData({
                        flag: true
                    });
                }
            })
        }
        // 已授权，未注册
        else if (session === 1) {
            var userInfo = util.getUserInfo();
            wx.navigateTo({
                url: '../mine/register/register?userInfo=' + JSON.stringify(userInfo)
            });
        }
        // 已授权，已注册，我的页面不会有此种状态
        else if (session === 2) {
            wx.switchTab({
                url: '../mine/mine'
            });
        }
        // 已退出（已授权、已注册）此时token还在
        else if (session === 3) {
            // 跳转授权假页面
            wx.navigateTo({
                url: '',
            })
        }
    },
    loginOut() {
        var _this = this;
        wx.showModal({
            title: '退出登陆',
            content: '是否退出登陆？',
            showCancel: true,
            cancelText: '取消',
            confirmText: '确定',
            confirmColor: '#3f99e6',
            success: function (res) {
                if (res.confirm) {
                    _this.setData({
                        loginStatus: true
                    });
                    wx.setStorageSync('session', 3);
                } else if (res.cancel) {
                    console.log('用户点击了取消！');
                }
            }
        })
    },
    experience() {
        wx.navigateTo({
            url: 'experience/experience'
        });
    },
    reward() {
        wx.navigateTo({
            url: 'reward/reward'
        });
    },

    info() {
        wx.showModal({
            title: '账号提现',
            content: '请下载APP或登录云钱袋官网进行提现',
            showCancel: false,
            confirmText: '知道了',
            confirmColor: '#3f99e6'
        })
    }
})


