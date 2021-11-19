
import {
  AdaptorStateEventName,
  ConnectionStateEventName,
  DataReportEventName,
  addListener,
  bindDevice,
  settingFactory,
  pushSetting,
  addMonitorDevice,
  deleteMonitorDevice,
  bindStateMsg,
  connectStateMsg
} from '../../DeviceManager'

import {
  format
} from '../../Utils'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mac: '',
    name: '',
    model: '',
    array: [0, 3, 30, 60],
    index: 0,

    jumpMode: ["倒计时跳模式", "倒计数跳模式", "自由跳模式"],
    jumpModeIndex: 0,

    settingContent: [0, 10, 30, 60, 600, 1000, 5000, 9999, 10000, 50000],
    settingContentIndex: 1,

    countdown: [0, 3, 5, 10, 15, 60, 500, 1000, 5000, 9999, 10000, 50000],
    countdownIndex: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('jump', 'onload', JSON.stringify(options));
    let obj = JSON.parse(JSON.stringify(options));
    this.setData({
      mac: obj.mac,
      name: obj.name,
    });

    addListener(DataReportEventName, "bind", (device, data) => {
      if (this.data.mac != device.mac) {
        return;
      }

      let msg = device.mac + '\n' + JSON.stringify(data);
      this.appendLogText(msg);
    });
  },

  countdownSelect: function (event) {
    let countdownIndex = event.detail.value;
    this.setData({
      countdownIndex
    })
  },

  timeCountdownSelect: function (event) {
    let settingContentIndex = event.detail.value;
    this.setData({
      settingContentIndex
    })
  },

  countCountdownSelect: function (event) {
    let settingContentIndex = event.detail.value;
    this.setData({
      settingContentIndex
    })
  },

  jumpModeSelect: function (event) {
    let jumpModeIndex = event.detail.value;
    this.setData({
      jumpModeIndex
    })
  },

  start: function (event) {
    console.debug("start");
    let jumpMode = this.data.jumpModeIndex;
    let settingContent = this.data.settingContent[this.data.settingContentIndex];
    let countdown = this.data.countdown[this.data.countdownIndex];
    let utc = new Date().getTime() / 1000;
    let setting = new settingFactory.BeginToJumpSetting(jumpMode, settingContent, utc, countdown);
    pushSetting({
      mac: this.data.mac,
      setting
    }).then().catch( res => {
      console.debug("设置成功");
    });
  },

  stop: function (event) {
    let setting = new settingFactory.EndToJumpSetting();
    pushSetting({
      mac: this.data.mac,
      setting
    }).then().catch( res => {
      console.debug("设置成功");
    });
  },

  clearLog: function (event) {
    this.setData({
      logText: ""
    })
  },

  // 打印信息
  appendLogText: function (log) {

    let text = '\n' + format('yyyy-MM-dd hh:mm:ss', new Date().getTime()) +
      ':' + '\n' + log + '\n-------------------';
    this.setData({
      logText: text + this.data.logText,
    });

  },

})