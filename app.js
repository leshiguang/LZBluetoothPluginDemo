// app.js
import { init } from "./DeviceManager";
App({
  onLaunch() {

  },


  onShow() {
    wx.authorize({
      scope: 'scope.userLocation',
      success() {
        console.warn("授权成功");
        // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
      },
      fail(error) {
        console.error("授权失败", error);
      }
    })
    init();
  }
})
