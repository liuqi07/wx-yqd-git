// register.js
var app = getApp();
var util = require('../../../utils/util');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputShowed: true,
        clearShow:{
          phoneVal: false,
          authCode: false,
          verifyCode: false,
          invitCode:false
        },
        phoneVal: "", // 手机号
        authCode: "", // 短信验证码
        verifyCode: "", // 验证码
        invitCode: "", // 邀请码
        imgCodeUrl: "",
        imgCodeFlag: true,
        codeFlag: false,
        checkedFlag: true,
        count: 60,
        index:"",
        timesTamp:"",
        buddingFlag:true//登陆按钮
    },
    onShow:function(){

    },
    onLoad: function (options) {
        var index = options.index;
        let getTimestamp = (new Date().getTime())+Math.random()*10000; // 给图片添加时间戳，防止缓存
            this.setData({
                index:index,
                timesTamp: getTimestamp,
                imgCodeUrl: app.globalData.webUrl + "imageCode/getImgCode?boder=false&widths=92&heights=40&fontSize=20&color=true&line=true&isWechatApplet=" + getTimestamp
            });
        
    },
    // 更换验证码图片
    changeImg: function () {
        let getTimestamp = (new Date().getTime()) + Math.random() * 10000; // 给图片添加时间戳，防止缓存
        this.setData({
            timesTamp: getTimestamp,
            imgCodeUrl: app.globalData.webUrl + "imageCode/getImgCode?boder=false&widths=92&heights=40&fontSize=20&color=true&line=true&isWechatApplet=" + getTimestamp
        });
    },
    //清空input输入
    clearInput(ev) {
        const del = ev.currentTarget.dataset.del;
        this.setData({
            [del]: ""
        });
    },
    //input输入
    inputTyping(ev) {
        const value = ev.detail.value;
        const name = ev.currentTarget.dataset.name;
        this.setData({
            [name]: value
        });
    },
    inputFocus(ev){
      // 控制clear图标显示
      const clear = ev.currentTarget.dataset.name;
      let clearShow = {
        phoneVal: false,
        authCode: false,
        verifyCode: false,
        invitCode: false
      };
      clearShow[clear]=true
      this.setData({
        clearShow: clearShow
      });
    },
    inputBlur(ev){
      // 控制clear图标显示
      let clearShow = {
        phoneVal: false,
        authCode: false,
        verifyCode: false,
        invitCode: false
      }
      this.setData({
        clearShow: clearShow
      });
    }, 
    // 验证图形验证码
    checkImgCode() {
        if (this.data.imgCodeFlag) {
            this.setData({
                imgCodeFlag: false
            });
            let data = this.data.verifyCode;
            let url = app.globalData.webUrl + 'wechatApplet/checkVerifyCode?verifyCode=' + data + "&verifyCodeKey=" + this.data.timesTamp;
            util.http(url, this.checkResult);
        }

    },
    checkResult(res) {
        // util.checkResultCode(res, this.getCode);
        if (res.data.state==1){
          this.getCode();
        }else{
          wx.showModal({
            title: res.data.errorInfo,
            showCancel: false,
            confirmColor: "#289fe1"
          });
          this.setData({
            imgCodeFlag: true
          });
          return;
        }
    },
    // 获取短信验证码
    getCode() {
        this.setData({
            codeFlag: true
        });
        var data = this.data.phoneVal;
        var url = app.globalData.webUrl + 'wechatApplet/sendMobileCode?phone=' + data;
        var that = this;
        util.http(url, this.getCodeStyle);
        var timerID = setInterval(function() {
            let newCount = that.data.count - 1;
            that.setData({
                count: newCount
            })
            if (that.data.count <= 0) {
                that.setData({
                    codeFlag: false,
                    count: 60,
                    imgCodeFlag: true
                });
                clearInterval(timerID);
            }
        }, 1000);
    },
    checkboxChange(ev) {
        this.setData({
            checkedFlag: !this.data.checkedFlag
        })
    },
    getCodeStyle(res) {
        if (res.data.state != 1) {
            wx.showModal({
                title: res.data.errorInfo,
                showCancel: false,
                confirmColor: "#289fe1"
            });
            return;
        }else{
            wx.showToast({
                title: '验证码发送成功',
                success(res) {
                }
            });
            this.setData({
                buddingFlag:false
            })
        }
    },
    // 登陆
    register() {
        // 没有发短信验证码时不可用
        if (this.data.buddingFlag){
            return;
        }
        let encryptedData = '',
            iv = '',
            openId = wx.getStorageSync('openId');
        wx.login({
            success (res) {
                if(res.code){
                    wx.getUserInfo({
                        success (res){
                            encryptedData = res.encryptedData;
                            iv = res.iv;
                        }
                    })
                }
            }
        })
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        let dataObj = {
            phoneVal: this.data.phoneVal,
            authCode: this.data.authCode,
            verifyCode: this.data.verifyCode,
            invitCode: this.data.invitCode,
            checkedFlag: this.data.checkedFlag,
            encryptedData: encryptedData,
            iv: iv,
            rd_session: openId
        }
        if (!dataObj.phoneVal) {
            wx.hideLoading();
            wx.showModal({
                title: '手机号不能为空',
                showCancel: false,
                confirmColor: "#289fe1"
            });
            return;
        }
        if (!dataObj.verifyCode) {
            wx.hideLoading();
            wx.showModal({
                title: '图形验证码不能为空',
                showCancel: false,
                confirmColor: "#289fe1"
            });
            return;
        }
        if (!dataObj.authCode) {
            wx.hideLoading();
            wx.showModal({
                title: '短信验证码不能为空',
                showCancel: false,
                confirmColor: "#289fe1"
            });
            return;
        }
        if (!dataObj.checkedFlag) {
            wx.hideLoading();
            wx.showModal({
                title: '请同意用户使用协议',
                showCancel: false,
                confirmColor: "#289fe1"
            });
            return;
        }
        let url = app.globalData.webUrl + 'wechatApplet/register?mobile=' + dataObj.phoneVal + '&validateCode=' + dataObj.authCode + '&recommend=' + dataObj.invitCode + '&verifyCode=' + dataObj.verifyCode + '&rd_session=' + openId;
        util.http(url, this.login);
    },
    login (res) {
        this.setData({
            buddingFlag: true
        })
        // console.log('login ');
        // console.log(res);
        var that = this;
        if (res.data.state == 1 || res.data.state == 200){
            that.setData({
                buddingFlag: false
            });

            wx.setStorageSync('token', res.data.token);
            wx.hideLoading();
            wx.showToast({
                title: '绑定成功',
                success (res) {
                    wx.setStorageSync('session', 2);
                    if (that.data.index){
                        wx.switchTab({
                            url: '../../index/index'
                        })
                    }else{
                        wx.switchTab({
                            url: '../mine'
                        })
                    }
                }
            })
        }else {
            that.setData({
                buddingFlag: false
            });
            wx.showLoading({
                title: res.data.errorInfo
            })
            setTimeout(function(){
                wx.hideLoading();
            },1500);
        }
    }
})