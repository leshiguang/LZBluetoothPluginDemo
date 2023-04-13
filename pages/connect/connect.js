//获取应用实例
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
  connectStateMsg,
  setMonitorDevice

} from '../../DeviceManager'

import {
  format
} from '../../Utils'


Page({
  data: {
    mac: '',
    name: '',
    model: '',
    statusMsg: '',
    connectState: 0,  // 连接状态
    code: '',
    logText: '',
    focus: false,
    model: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('bind', 'onload', JSON.stringify(options));
    let obj = JSON.parse(JSON.stringify(options));
    this.setData({
      mac: obj.mac,
      name: obj.name,
      model: obj.model,
    });

    let that = this;

    addListener(DataReportEventName, "connect", (device, data) => {
      let msg = device.mac + '\n' + JSON.stringify(data);
      that.appendLogText(msg);
    });

    addListener(ConnectionStateEventName, 'connect', (mac, state) => {
      if (this.data.mac != mac) {
        return;
      }

      let logText = connectStateMsg(state);
      that.appendLogText(logText);
      that.setData({
        statusMsg: logText,
      })

    });

    this.setData({
      isBinding: true
    })

    // 添加监听
    setMonitorDevice({ 
      mac: this.data.mac,
      model: this.data.model,
    })

  },

  onUnload: function () {
    // cancelBind({ 
    //   mac: this.data.mac
    // })
  },

  restartReceiveData: function () {
    console.log('重新开始接收数据', this.data.mac, this.data.model);
    /// 添加监听
    addMonitorDevice({ 
      mac: this.data.mac,
      model: this.data.model,
    })
  },

  stopReceiveData: function () {
    console.log('停止接收数据');
    deleteMonitorDevice({
      mac: this.data.mac,
    })
  },

  configWifi: function () {
    console.log('wifi 配网');
    wx.navigateTo({
      url: '../wifiConfig/wifiConfig?mac=' + this.data.mac + '&name=' + this.data.name
    })
  },

  bindKeyInput: function (e) {
    console.log('bindkeyInput', e.detail.value);
    let code = e.detail.value;
    if (code.length === 6) {
      this.sendRandomCode(code);
      this.setData({
        focus: false,
      })
    }
  },

  sendRandomCode: function (code) {
    let setting = new settingFactory.RandomNumSetting(code);
    let options = {
      mac: this.data.mac,
      setting
    }
    pushSetting(options);
  },

  // 打印信息
  appendLogText: function (log) {

    let text = '\n' + format('yyyy-MM-dd hh:mm:ss', new Date().getTime()) +
      ':' + '\n' + log + '\n-------------------';
    this.setData({
      logText: text + this.data.logText,
    });

  },


});