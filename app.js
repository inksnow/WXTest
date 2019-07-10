//app.js
var that;
var localList = require("./utils/languages.js")
var WxNotificationCenter = require('./utils/WxNotificationCenter.js')
App({
  onLaunch: function () {

    that = this;
    wx.setKeepScreenOn({
      keepScreenOn: true
    })


    // 国际化
    let lang = wx.getSystemInfoSync().language
    console.log("lang:" + lang)

    if (wx.getStorageSync("lang") == "") {
      wx.setStorageSync("lang", lang)
    } else {
      lang = wx.getStorageSync("lang")
    }


    // if (lang == "zh" || lang == "zh_CN") {
    if (lang == "ko") {
      //韩语
      that.globalData.local = localList.languages["ko"]
      that.globalData.lang = "ko"
    } else if (lang == "en") {
      //英文
      that.globalData.local = localList.languages["en"]
      that.globalData.lang = "en"
    } else {
      //默认 中文
      that.globalData.local = localList.languages["zh"]
      that.globalData.lang = "zh"
    }
    console.log("that.globalData.local:" + that.globalData.local['a'])

    wx.getSystemInfo({
      success: function (res) {
        that.globalData.statusBarHeight = res.statusBarHeight;
        let totalTopHeight = 68
        if (res.model.indexOf('iPhone X') !== -1) {
          totalTopHeight = 88
        } else if (res.model.indexOf('iPhone') !== -1) {
          totalTopHeight = 64
        }
        that.globalData.titleBarHeight = totalTopHeight - res.statusBarHeight
      }
    })


    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("请求完新版本信息")
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: that.globalData.local["UpdateHints"],
        content: that.globalData.local["NewVersion"],
        cancelText: that.globalData.local["cancel"],
        confirmText: that.globalData.local["yes"],
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      console.log("新的版本下载失败")
    })


  },
  globalData: {
    userInfo: null,
    statusBarHeight: 20,
    titleBarHeight: 44,
    isLinked: false,
    local: localList.languages["zh"],
    lang: "zh",
  }
})



// //发送通知（所有注册过'NotificationName'的页面都会接收到通知）
// WxNotificationCenter.postNotificationName('NotificationName')

