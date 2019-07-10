// pages/login/login.js
const app = getApp()
var localList = require("../../utils/languages.js")
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js")
var that;
var windowHeight;
var ratio;

//上次按钮点击时间
var lasttime = 0;
//按键防抖时间
var clickTime = 200;
//键盘收起后延时100毫秒重新布局（定时器）
var input_bottom_time;
//输入的手机号
var input_tel;
//输入的验证码
var input_code;

var popupIndex = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    local: app.globalData.local,
    statusBarHeight: app.globalData.statusBarHeight,
    titleBarHeight: app.globalData.titleBarHeight,
    title: app.globalData.local["test"],
    languageColor1: app.globalData.lang == "zh" ? "#e74b63" : "#555555",
    languageColor2: app.globalData.lang == "ko" ? "#e74b63" : "#555555",
    languageColor3: app.globalData.lang == "en" ? "#e74b63" : "#555555",
    input_bottom: "0rpx",
    getCodeColor: "#c2c2c2",
    getCodeAble: "none",
    userInfo: {},
    authorization: "hidden",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    popupDisplay: "hidden",
    sh: "100%",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.getSystemInfo({
      success: function (res) {
        // 获取可使用窗口宽度
        let clientHeight = res.windowHeight;
        // 获取可使用窗口高度
        let clientWidth = res.windowWidth;
        // 算出比例
        ratio = 750 / clientWidth;
        // 算出高度(单位rpx)
        windowHeight = clientHeight * ratio;
        console.log('windowHeight:' + windowHeight)
        that.setData({
          sh: clientHeight - app.globalData.titleBarHeight - app.globalData.statusBarHeight,
        })
      }
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
    WxNotificationCenter.addNotification('NotificationName', that.didNotification, that)
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    WxNotificationCenter.removeNotification('NotificationName', that)
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

  },
  onGotUserInfo(e) {
    if (typeof (e.detail.userInfo) == "undefined") {
      console.log("失败")
    } else {
      console.log("成功")
      app.globalData.userInfo = e.detail.userInfo
      that.setData({
        authorization: "hidden",
      });
      wx.navigateTo({
        url: '../scan/scan'
      })
    }

  },
  click: function (e) {
    let d = new Date();
    let nowtime = d.getTime();
    if (nowtime - lasttime > clickTime) {
      lasttime = nowtime;
      switch (e.currentTarget.id) {
        case "language_1":
          if (app.globalData.lang != "zh") {
            console.log("中文")
            //切换为中文
            wx.setStorageSync("lang", "zh")
            app.globalData.lang = "zh"
            app.globalData.local = localList.languages["zh"]
            upUI()
          }
          break;
        case "language_2":
          if (app.globalData.lang != "ko") {
            console.log("韩文")
            //切换为韩文
            wx.setStorageSync("lang", "ko")
            app.globalData.lang = "ko"
            app.globalData.local = localList.languages["ko"]
            upUI()
          }
          break;
        case "language_3":
          if (app.globalData.lang != "en") {
            console.log("英文")
            //切换为韩文
            wx.setStorageSync("lang", "en")
            app.globalData.lang = "en"
            app.globalData.local = localList.languages["en"]
            upUI()
          }
          break;
        case "getCode":
        case "login":
          showMgs(app.globalData.local['Prompt'], app.globalData.local['NotOpen'], false)

          break;
           case "login2":
          showMgs(app.globalData.local['Prompt'], app.globalData.local['NotOpen'], true)

          break;
        case "login3":
          showMgs(app.globalData.local['Prompt'], app.globalData.local['aaa'], true,0,true)
          break;
        case "wx":
          showMgs(app.globalData.local['Prompt'], "你点击了微信登录", false)
          break;
      }
    }
  },
  //输入
  bindReplaceInput: function (e) {
    var value = e.detail.value
    switch (e.currentTarget.id) {
      case "input_1":
        input_tel = value;
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (!myreg.test(value)) {
          that.setData({
            getCodeColor: "#c2c2c2",
            getCodeAble: "none",
          });
        } else {
          that.setData({
            getCodeColor: "#FFFFFF",
            getCodeAble: "auto",
          });
        }
        break;
      case "input_2":
        input_code = value;
        break;
    }
    return value
  },

  inputFocus(e) {
    console.log('键盘弹起')
    // clearTimeout(input_bottom_time);
    // var inputHeight = 0
    // if (e.detail.height) {
    //   inputHeight = e.detail.height * ratio;
    // }
    // if ((windowHeight - 1050) >= inputHeight) {
    //   that.setData({
    //     input_bottom: "0rpx",
    //   });
    // } else {
    //   that.setData({
    //     input_bottom: (inputHeight - (windowHeight - 1050)) + "rpx",
    //   });

    // }
  },
  inputBlur() {
    console.log('键盘收起')
    // that.setData({
    //   input_bottom: "0rpx",
    // });
    // input_bottom_time = setTimeout(
    //   function() {
    //     that.setData({
    //       input_bottom: "0rpx",
    //     });
    //   },
    //   400
    // )
  },

  popupClick: function (e) {
    switch (e.currentTarget.id) {
      case "popupCancel":
        that.setData({
          popupDisplay: "hidden",
        });

        break;
      case "popupOk":
        that.setData({
          popupDisplay: "hidden",
        });

        switch (popupIndex) {
          case 999:

            var pages = getCurrentPages();
            if (pages.length > 2) {
              wx.navigateBack({
                delta: pages.length - 2
              })
            }

            break;
        }
        break;
    }
  },
  //通知处理
  didNotification: function () {
    showMgs(app.globalData.local["Prompt"], app.globalData.local["BTDisconnection"], false, 999);

  },

})

function upUI() {
  that.setData({
    local: app.globalData.local,
    languageColor1: app.globalData.lang == "zh" ? "#e74b63" : "#555555",
    languageColor2: app.globalData.lang == "ko" ? "#e74b63" : "#555555",
    languageColor3: app.globalData.lang == "en" ? "#e74b63" : "#555555",
    input_bottom: "0rpx",
    getCodeColor: "#c2c2c2",
    getCodeAble: "none",
    userInfo: {},
    authorization: "hidden",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  });
}

// 提示信息
function showMgs(title, mgs, showCancel, index, alignLeft) {
  popupIndex = index;
  let cancel;
  let mgsAlign;
  let okWidth;
  if (showCancel) {
    cancel = false
    okWidth = "250rpx";
  } else {
    cancel = true
    okWidth = "500rpx";
  }
  if (alignLeft) {
    mgsAlign = "left"
  } else {
    mgsAlign = "center"
  }

  that.setData({
    popupTitel: title,
    popupMgs: mgs,
    hiddenCancel: cancel,
    mgsAlign: mgsAlign,
    popupDisplay: "visible",
    popupOkWidth: okWidth,
  });
}



// /**
//  *蓝牙连接状态监听 
//  */
// wx.onBLEConnectionStateChange(function (res) {
//   // 该方法回调中可以用于处理连接意外断开等异常情况
//   // console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
//   // showLoading(true, "连接中...")
//   console.log('login页面蓝牙连接监听, now is', res)
//   // console.log(res.connected)
//   // console.log(self.globalData.isLinked)
//   // self.globalData.isLinked = res.connected
//   // console.log(self.globalData.isLinked)

// })
/**
 *蓝牙连接状态监听 
 */
// wx.onBLEConnectionStateChange(function (res) {
//   // 该方法回调中可以用于处理连接意外断开等异常情况
//   // console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
//   // showLoading(true, "连接中...")
//   app.globalData.isLinked = res.connected
//   console.log('login蓝牙连接状态监听, now is', res)
//   if (!res.connected) {
//     //断开连接
//     showMgs(app.globalData.local["Prompt"], app.globalData.local["BTDisconnection"], false, 999);
//   }
// })