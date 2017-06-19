// register.js
var app = getApp();
var util = require('../../../utils/util');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputShowed: true,
        phoneVal: "",
        authCode: "",
        verifyCode: "",
        invitCode: "",
        imgCodeUrl: app.globalData.webUrl + "//imageCode/getImgCode?boder=false&widths=92&heights=40&fontSize=20&color=true&line=true",
        imgCodeFlag: true,
        codeFlag: false,
        checkedFlag: true,
        count: 60
    },
    changeImg: function () {
        let getTimestamp = new Date().getTime();
        this.setData({
            imgCodeUrl: app.globalData.webUrl + "//imageCode/getImgCode?boder=false&widths=92&heights=40&fontSize=20&color=true&line=true&timestamp=" + getTimestamp
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
    // 验证图形验证码
    checkImgCode() {
        if (this.data.imgCodeFlag) {
            this.setData({
                imgCodeFlag: false
            });
            let data = this.data.verifyCode;
            let url = app.globalData.webUrl + '/wechatApplet/checkVerifyCode?verifyCode=' + data;
            util.http(url, this.checkResult);
        }

    },
    checkResult(res) {
        util.checkResultCode(res, this.getCode)
        // if (res.state==1){
        //   this.getCode();
        // }else{
        //   wx.showModal({
        //     title: '图形验证码输入错误',
        //     showCancel: false,
        //     confirmColor: "#289fe1"
        //   });
        //   this.setData({
        //     imgCodeFlag: true
        //   });
        //   return;
        // }
    },
    // 获取短信验证码
    getCode() {
        this.setData({
            codeFlag: true
        });
        var data = this.data.phoneVal;
        var url = app.globalData.webUrl + '/wechatApplet/sendMobileCode?phone=' + data;
        util.http(url, this.getCodeStyle);
        var timerID = setInterval(() => {
            let newCount = this.data.count - 1;
            this.setData({
                count: newCount
            })
            if (this.data.count <= 0) {
                this.setData({
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
        if (res.data.date != 1) {
            wx.showModal({
                title: '系统异常',
                showCancel: false,
                confirmColor: "#289fe1"
            });
            return;
        }
    },
    // 登陆
    register() {
        let dataObj = {
            phoneVal: this.data.phoneVal,
            authCode: this.data.authCode,
            verifyCode: this.data.verifyCode,
            invitCode: this.data.invitCode,
            checkedFlag: this.data.checkedFlag
        }
        if (!dataObj.phoneVal) {
            wx.showModal({
                title: '手机号不能为空',
                showCancel: false,
                confirmColor: "#289fe1"
            });
            return;
        }
        if (!dataObj.verifyCode) {
            wx.showModal({
                title: '图形验证码不能为空',
                showCancel: false,
                confirmColor: "#289fe1"
            });
            return;
        }
        if (!dataObj.authCode) {
            wx.showModal({
                title: '短信验证码不能为空',
                showCancel: false,
                confirmColor: "#289fe1"
            });
            return;
        }
        if (!dataObj.invitCode) {
            wx.showModal({
                title: '邀请码不能为空',
                showCancel: false,
                confirmColor: "#289fe1"
            });
            return;
        }
        if (!dataObj.checkedFlag) {
            wx.showModal({
                title: '请同意用户使用协议',
                showCancel: false,
                confirmColor: "#289fe1"
            });
            return;
        }
        let url = app.globalData.webUrl + '/wechatApplet/register?mobile=' + dataObj.phoneVal + '&validateCode=' + dataObj.authCode + '&recommend=' + dataObj.invitCode + '&verifyCode=' + dataObj.verifyCode;
        util.http(url, this.checkResult);
    }
})