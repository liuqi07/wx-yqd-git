var app = getApp();
var util = require('../../utils/util');
Page({
    data: {
        totalMoney: 1,

        moneyUseable: 2,
        allInterest: 3,
        payamount: 4,

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
        dialogFlag: false // 假的授权弹窗状态
    },
    onLoad: function (options) {
        var session = wx.getStorageSync('session');
        // 如果是登陆状态，请求接口加载登陆页用户个人数据
        if(session===2) {
            this.setData({
                loginFlag: false,
                loginStatus: false
            });
            var url = app.globalData.webUrl + 'wechatApplet/person';
            util.http(url, this.getData);
        }else {
            this.setData({
                loginStatus: true
            });
        }
    },
    // 弹框点击拒绝授权
    onRefuseTap() {
        this.setData({
            dialogFlag: false
        });
    },

    // 弹框点击允许授权
    onAllowTap(ev) {
        var session = wx.getStorageSync('session');
        if(!session) {
            wx.openSetting({
                success: (res) => {
                    // console.log(res);
                    this.setData({
                        dialogFlag: false
                    });
                    var userInfo = util.getUserInfo();
                    console.log(userInfo);
                    if (userInfo.nickName) {
                        wx.setStorageSync('session', 1);
                        wx.navigateTo({
                            url: '../mine/register/register?userInfo=' + JSON.stringify(userInfo)
                        });
                    }
                },
                fail: (res) => {
                    console.log('openSetting fail');
                }
            });
        }
        // 退出状态
        else{
            wx.setStorageSync('session', 2);
            this.setData({
                loginStatus: false,
                dialogFlag: false
            });
            wx.switchTab({
                url: '../mine/mine',
            })
        }
    },
    // 登陆后获取用户个人相关数据
    getData(res) {
        if (res.data.state == 1) {
            this.setData({
                totalMoney: res.data.data.totalMoney,
                moneyUseable: res.data.data.moneyUseable,
                allInterest: res.data.data.allInterest,
                payamount: res.data.data.payamount
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
                    console.log('拒绝授权');
                    // 首次拒绝不会执行此方法
                    if (app.globalData.firstFlag_g) {
                        // 弹窗提示用户手动开启授权
                        that.setData({
                            dialogFlag: true
                        });
                    }
                    app.globalData.firstFlag_g = true;
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
            that.setData({
                dialogFlag: true
            });
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


