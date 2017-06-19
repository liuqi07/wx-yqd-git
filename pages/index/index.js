// index.js
var app = getApp();
var util = require('../../utils/util');
var investData = require('../../data/invest-data.js');
Page({

    data: {
        // investList: [], 散标
        // xinshouObj: {} 新手标
        flag: false
    },

    // 品牌介绍
    onIntrTap() {
        wx.navigateTo({
            url: 'introduce/introduce'
        });
    },
    // 去领取页面
    onGetTap(ev) {
        var that = this;
        var session = wx.getStorageSync('session');
        console.log('session'+session);
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
                        function goRegisterPage () {
                            wx.setStorageSync('session', 1);
                            wx.navigateTo({
                                url: '../mine/register/register'
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
        else if(session===1) {
            wx.navigateTo({
                url: '../mine/register/register'
            });
        }
        // 已授权，已注册
        else if(session===2){
            wx.switchTab({
                url: '../mine/mine'
            });
        }
        // 已退出（已授权、已注册）此时token还在
        else if(session===3){
            // 跳转授权假页面
            wx.navigateTo({
                url: '',
            })
        }

    },

    // 跳转详情页
    onDetailTap(ev) {
        var proCode = ev.currentTarget.dataset.procode,
            proSource = ev.currentTarget.dataset.prosource,
            projectName = ev.currentTarget.dataset.projectname;
        wx.navigateTo({
            url: 'invest-detail/invest-detail?proCode=' + proCode + '&proSource=' + proSource + '&projectName=' + projectName
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        var url = app.globalData.webUrl + 'wechatApplet/homepage1';
        // util.http(url, this.getData);

        this.getMockData();
    },

    // 获取并整理数据
    getData(res) {
        console.log(res)
        if (res.data.returnCode == 200 && res.data.sanbiaoList) {
            var sanbiaoList = res.data.sanbiaoList ? res.data.sanbiaoList : [];
            var xinshouList = res.data.xinshouList;
            var tempSanbiaoList = [], tempXinshouObj = {};
            // 整理散标数据
            sanbiaoList.forEach(function (item, i) {
                tempSanbiaoList[i] = {
                    ProjectName: item.ProjectName, // 标的名称
                    InvestmentProportion: item.InvestmentProportion.toFixed(2), // 抢购百分比
                    InterestRateOfYear: item.InterestRateOfYear.toFixed(2), // 年化收益率  如果是月计划则为最小收益率
                    ProCode: item.ProCode, // 产品编号
                    ProSource: item.ProSource, // 标的来源
                    projectSubList: {
                        ProjectPeriod: item.ProjectPeriod + ((item.ProjectPeriodUnit == '月') ? '个月' : '天'), // 期限
                        ProjectAmount: parseInt(item.ProjectAmount / 10000) + '万元', // 发标金额
                        MinimumInvestAmount: !isNaN(item.MinimumInvestAmount) ? item.MinimumInvestAmount + '起投' : item.MinimumInvestAmount // 起投金额
                    }
                }
            });
            console.log(tempSanbiaoList)
            // 整理新手标数据
            tempXinshouObj = {
                ProjectName: xinshouList[0].ProjectName, // 标的名称
                ProCode: xinshouList[0].ProCode, // 产品编号
                ProSource: xinshouList[0].ProSource, // 标的来源
                InvestmentProportion: xinshouList[0].InvestmentProportion.toFixed(2) + '%', // 抢购百分比
                InterestRateOfYear: xinshouList[0].InterestRateOfYear.toFixed(2), //年化收益率  如果是月计划则为最小收益率
                projectSubList: {
                    ProjectPeriod: xinshouList[0].ProjectPeriod + (xinshouList[0].ProjectPeriodUnit == '月' ? '个月' : '天'), // 期限
                    ProjectAmount: Math.floor(xinshouList[0].ProjectAmount / 10000) + '万元', // 发标金额
                    MinimumInvestAmount: !isNaN(xinshouList[0].MinimumInvestAmount) ? xinshouList[0].MinimumInvestAmount + '起投' : xinshouList[0].MinimumInvestAmount // 起投金额
                }
            }

            this.setData({
                investList: tempSanbiaoList,
                xinshouObj: tempXinshouObj
            });
        }
    },


    getMockData() {
        // 本地数据
        var data = investData.investData;
        var sanbiaoList = data.sanbiaoList;
        var xinshouList = data.xinshouList;
        var tempSanbiaoList = [], tempXinshouObj = {};
        // 整理散标数据
        sanbiaoList.forEach(function (item, i) {
            tempSanbiaoList[i] = {
                ProjectName: item.ProjectName, // 标的名称
                InvestmentProportion: item.InvestmentProportion, // 抢购百分比
                InterestRateOfYear: item.InterestRateOfYear.toFixed(2), // 年化收益率  如果是月计划则为最小收益率
                ProCode: item.ProCode, // 产品编号
                ProSource: item.ProSource, // 标的来源
                projectSubList: {
                    ProjectAmount: parseInt(item.ProjectAmount) + '万元', // 发标金额
                    ProjectPeriod: item.ProjectPeriod + '月', // 期限
                    MinimumInvestAmount: !isNaN(item.MinimumInvestAmount) ? item.MinimumInvestAmount + '起投' : item.MinimumInvestAmount // 起投金额
                }
            }
        });
        this.setData({
            investList: tempSanbiaoList
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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