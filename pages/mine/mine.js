var app = getApp();
var util = require('../../utils/util');
Page({
    data: {
        totalMoney: 0.00,
        moneyUseable: 0.00,
        allInterest: 0.00,
        payamount: 0.00,
        userCode: "",
        // loginFlag: true,
        inputShowed: true,
        phoneVal: "",
        authCode: "",
        imgCode: "",
        userInfo: "",
        codeFlag: true,
        count: 60,
        dialogFlag: false, // 假的授权弹窗状态
        disableLogin: false//登陆按钮的可点击状态
    },

    onShow: function (option) {
        var token = wx.getStorageSync('token');
        var openId = wx.getStorageSync("openId");

        this.setData({
            token: token,
            openId: openId
        });
        var session = wx.getStorageSync('session');
        // 如果是登陆状态，请求接口加载登陆页用户个人数据
        if (session === 2) {
            //调用登录接口
            var that = this;
            wx.getUserInfo({
                withCredentials: false,
                success: function (res) {
                    that.setData({
                        userInfo: res.userInfo
                    })
                }
            });
            this.setData({
                // loginFlag: false,
                loginStatus: false
            });
            var url = app.globalData.webUrl + 'wechatApplet/person?token=' + this.data.token;
            util.http(url, this.getData);
        } else {
            this.setData({
                loginStatus: true
            });
        };
    },
    onLoad: function (options) {
       
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
        var that = this;
        if (!session) {
            wx.openSetting({
                success: (res) => {
                    // console.log(res);
                    this.setData({
                        dialogFlag: false,
                        disableLogin: true//登陆按钮不可以点击
                    });
                    var info = {};
                    // 用户已经同意小程序获取用户信息，后续调用 wx.getUserInfo 接口不会弹窗询问
                    wx.getUserInfo({
                        success: function (res) {
                            var code = wx.getStorageSync('code');
                            var data = {
                                code: code,
                                encryptedData: res.encryptedData,
                                iv: res.iv
                            };
                            //发起网络请求
                            var url = app.globalData.webUrl + 'wechatApplet/authorization';
                            // 获取用户唯一标识openid
                            util.http(url, that.getStatus, data, 'POST');
                        }
                    });
                },
                fail: (res) => {
                    console.log('openSetting fail');
                }
            });
        }
        // 退出状态
        else {
            var url = app.globalData.webUrl + 'wechatApplet/login?3rd_session=' + that.data.openId;
            util.http(url, function (res) {
                if (res.data.state == 1) {
                    wx.setStorageSync('token', res.data.token);
                    wx.setStorageSync('session', 2);
                    that.setData({
                        loginStatus: false,
                        dialogFlag: false
                    });
                    wx.switchTab({
                        url: '../mine/mine',
                    })
                }
            });
        }
    },

    //wx.setting后判断是否是已注册用户
    getStatus(res) {
        wx.setStorageSync('openId', res.data['3rd_session']);
        if (res.data.token) {//注册刷新本页
            wx.setStorageSync('token', res.data['token']);
            wx.setStorageSync('session', 2);
            this.onShow();
        } else {//未注册跳转注册页面
            wx.setStorageSync('session', 1);
            wx.navigateTo({
                url: '../mine/register/register'
            });
        }
    },

    // 登陆后获取用户个人相关数据
    getData(res) {
        if (res.data.state == 1) {
            this.setData({
                totalMoney: res.data.data.totalMoney,
                moneyUseable: res.data.data.moneyUseable,
                allInterest: res.data.data.allInterest,
                payamount: res.data.data.payamount,
                userCode: res.data.user.usercode
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
        if (this.data.disableLogin) {
            return;
        }
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
                    // if (app.globalData.firstFlag_g) {
                    // 弹窗提示用户手动开启授权
                    that.setData({
                        dialogFlag: true
                    });
                    // }
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
        var url = app.globalData.webUrl + 'wechatApplet/logout?token=' + this.data.token + "&3rd_session=" + this.data.openId;
        wx.showModal({
            title: '退出登陆',
            content: '是否退出登陆？',
            showCancel: true,
            cancelText: '取消',
            confirmText: '确定',
            confirmColor: '#3f99e6',
            success: function (res) {
                if (res.confirm) {
                    util.http(url, function (res) {
                        if (res.data.state == 1) {
                            _this.setData({
                                loginStatus: true,
                                disableLogin: false//登陆按钮可点击
                            });
                            wx.removeStorageSync('token');
                            wx.setStorageSync('session', 3);
                        } else {
                            console.log(res.data.errInfo);
                        }
                    });

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


