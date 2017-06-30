// invest-detail.js
let util = require('../../../utils/util.js');
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navigateTitle: '', // 动态设置导航栏标题
        currentPage: 0,
        prospectiveEarnings: 0, // 预期收益
        dialogFlag: false,
        subSwiperFlag: false, // proSource=1?false:true => 2,3,4
        productInfoDetail: [], // 三列，项目介绍
        investRecords: [], // 三列：出借记录
        productList: [], // 三列，项目列表
        proInfoList: [], // proSource==1
        winctrInfolist: [], // proSource==1
        productDetail: {}, // proSource==1
        arrowFlag: true,
    },
    
    onLoad: function (options) {
        var proCode = options.proCode,
            proSource = options.proSource,
            projectName = options.projectName;
        // this.getWindowHeight();
        var subSwiperFlag = (proSource==1)?false:true; // 1 两列 2、3、4 三列
        if(proSource==1){
            let url = app.globalData.webUrl + 'wechatApplet/getProductDetail/CPSB112170427581996' // + this.data.proCode;
            util.http(url, this.getDetailData);
        }else {
            let url = app.globalData.webUrl + 'wechatApplet/getProductDetailYJS/' + proCode + '?proSource=' + proSource;
            util.http(url, this.getCurrData);
        }

        this.setData({
            navigateTitle: projectName, // 设置标题栏
            proCode: options.proCode,
            proSource: options.proSource,
            subSwiperFlag: subSwiperFlag
        });

    },


    // 获取当前页面数据
    getCurrData(res) {
        this.setData({
            investList: res.data.data.productInfoDetail
        });
    },

    // 输入框点击完成时
    onDoneTap(ev) {

    },
    // 获取屏幕高度
    getWindowHeight(ev) {
        try {
            var res = wx.getSystemInfoSync();
            this.setData({
                windowHeight: res.windowHeight
            });
        } catch (ev) {
            console.log('error');
        }
    },
    onChangeArrowTap () {
        this.setData({
            arrowFlag: !this.data.arrowFlag
        });
    },
    // swiper切换时触发
    swiperChange (ev) {
        let currentPage = ev.detail.current;
        // 切换到详情页面的时候触发
        if(currentPage==1 && this.data.proSource!=1){
            let proInfoUrl = app.globalData.webUrl + 'wechatApplet/getProductDetailYJS/'+this.data.proCode+'?proSource='+this.data.proSource;
            let proListUrl = app.globalData.webUrl + 'product/subProjectList?proCode='+this.data.proCode+'&substationId=1&pageIndex=1';
            let proRecordUrl = app.globalData.webUrl + 'product/getInvestmentRecordsYjs/'+this.data.proCode+'/1/?proSource='+this.data.proSource;
            util.http(proInfoUrl, this.getProInfoData);
            util.http(proListUrl, this.getProListData);
            util.http(proRecordUrl, this.getProRecordData);
        }
       if(currentPage==1 && this.data.proSource==1){
            let url = app.globalData.webUrl + 'wechatApplet/getProductDetail/CPSB112170427581996' // + this.data.proCode;
            util.http(url, this.getDetailData);
        }
    },
    // 获取proSource==1的标的数据
    getDetailData(res){
        let proInfoList = res.data.getProInfolist;
        let winctrInfolist = res.data.winctrInfolist;
        let productDetail = res.data.productDetail;
        this.setData({
            proInfoList: proInfoList,
            winctrInfolist: winctrInfolist,
            productDetail: productDetail
        });
    },
    // 获取项目介绍数据
    getProInfoData (res) {
        let productInfoDetail = res.data.data.productInfoDetail;
        this.setData({
            productInfoDetail: productInfoDetail // 项目介绍
        });
    },
    getProListData (res) {
        var productList = res.data.data.data;
        this.setData({
            productList: productList
        });
    },
    getProRecordData(res) {
        let investRecords = res.data.data.investRecords; // []
        this.setData({
            investRecords: investRecords
        });
    },
    // 子swiper发生切换时
    subSwiperChange(ev) {
        this.setData({
            currentPage: ev.detail.current
        });
    },
    // 手动切换swpier
    onChangeTap(ev) {
        this.setData({
            currentPage: ev.currentTarget.dataset.id
        });
    },

    // 去投资
    onInvestTap(ev) {
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
                        url: '../../mine/register/register?userInfo=' + JSON.stringify(userInfo)
                    });
                },
                fail() {
                    // 用户点击拒绝授权会进入fail回调
                    console.log('fail');
                    // 首次拒绝不会执行此方法
                    // 弹窗提示用户手动开启授权
                    function goRegisterPage() {
                        var userInfo = util.getUserInfo();
                        if (userInfo.nickName){
                            wx.setStorageSync('session', 1);
                            wx.navigateTo({
                                url: '../mine/register/register?userInfo=' + JSON.stringify(userInfo)
                            });
                        }
                    }
                    // if(app.globalData.firstFlag_g){
                        util.authorizeConfirm(goRegisterPage);
                    // }
                    app.globalData.firstFlag_g = true;
                }
            })
        }
        // 已授权，未注册 session===1
        else if (session === 1) {
            var userInfo = util.getUserInfo();
            wx.navigateTo({
                url: '../../mine/register/register?userInfo=' + JSON.stringify(userInfo)
            });
        }
        // 已授权，已注册 session===2
        else if (session === 2) {
            // 弹出去下载提示框
            that.showTips();
        }
        // 已退出（已授权、已注册）此时token还在 session===3
        else if (session === 3) {
            // 跳转授权假页面
            wx.navigateTo({
                url: '',
            })
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
        let session = wx.getStorageSync('session');
        if (!session) {
            wx.openSetting({
                success: (res) => {
                    var info = {};
                    // 用户已经同意小程序获取用户信息，后续调用 wx.getUserInfo 接口不会弹窗询问
                    wx.getUserInfo({
                        success: function (res) {
                            var code = wx.getStorageSync('code');
                            // var userInfo = res.userInfo;
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
        else if (session === 3) {
            this.showTips();
        }
    },

    //wx.setting后判断是否是已注册用户
    getStatus(res) {
        wx.setStorageSync('openId', res.data['3rd_session']);
        if (res.data.token) {//注册刷新本页
            wx.setStorageSync('token', res.data['token']);
            wx.setStorageSync('session', 2);
            this.showTips();
        } else {//未注册跳转注册页面
            wx.setStorageSync('session', 1);
            wx.navigateTo({
                url: '../mine/register/register'
            });
        }
    },

    // 输入框内容改变时触发
    onInputChange(ev) {
        console.log(ev);
        let ProjectPeriodUnit = this.data.investList.ProjectPeriodUnit, //期限单位：年 or 月
            ProjectPeriod = this.data.investList.ProjectPeriod, // 期限
            InterestRateOfYear = this.data.investList.InterestRateOfYear; // 收益
        var prospectiveEarnings = ((ev.detail.value * InterestRateOfYear / 100) * ((ProjectPeriodUnit == '天') ? ProjectPeriod / 365 : ProjectPeriod / 12)).toFixed(2)
        if (prospectiveEarnings > (this.data.proSource == 1 ? this.data.productDetail.surplus : this.data.investList.NotInvestedAmount)){
            wx.showToast({
                title: '超出剩余可投金额',
                icon: 'success',
                duration: 2000
            });
            prospectiveEarnings = prospectiveEarnings.substr(0, prospectiveEarnings.length-1);
        }
        this.setData({
            prospectiveEarnings: prospectiveEarnings
        });
    },

    // 提示下载
    showTips() {
        wx.showModal({
            title: '温馨提示',
            content: '小程序暂不支持出借功能\n请下载APP或到云钱袋官网进行出借',
            showCancel: true,
            cancelText: '不去',
            confirmText: '去下载',
            confirmColor: '#3f99e6',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击了确认！');
                } else if (res.cancel) {
                    console.log('用户点击了取消！');
                }
            }
        })
    },

    onTouchStart(ev) {
        console.log(ev);
        var pageY = ev.touches[0].pageY;
        this.setData({
            pageY: pageY
        });
    },

    onTouchMove(ev) {
        //   console.log(ev);
        var top = ev.changedTouches[0].pageY - this.data.pageY;
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: "ease",
            transformOrigin: 'left top 0'
        });
        this.animation = animation;
        animation.top(top).step();
        this.setData({
            animationData: animation.export()
        });
    },

    onTouchEnd(ev) {

        //   console.log(ev);
        var currPageY = ev.changedTouches[0].pageY - this.data.pageY;
        console.log(currPageY)
        if (currPageY < -50) {
            console.log('跳下一页');
            var animation = wx.createAnimation({
                duration: 1000,
                timingFunction: "ease",
                transformOrigin: 'left top 0'
            });
            var contentAnimation = wx.createAnimation({
                duration: 1000,
                timingFunction: "ease",
                transformOrigin: 'left top 0'
            });
            animation.top(-this.data.windowHeight).step();

            this.setData({
                animationData: animation.export()
            });
            contentAnimation.top(this.data.windowHeight).step();
            this.setData({
                contentAnimationData: contentAnimation.export()
            });
        } else {
            console.log('不跳')
            var animation = wx.createAnimation({
                duration: 1000,
                timingFunction: "ease",
                transformOrigin: 'left top 0'
            });
            //   this.animation = animation;
            animation.top(0).step();
            this.setData({
                animationData: animation.export()
            });
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        // 动态设置标题栏内容
        wx.setNavigationBarTitle({
            title: this.data.navigateTitle,
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})