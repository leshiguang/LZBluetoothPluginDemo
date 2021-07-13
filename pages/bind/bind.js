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
  connectStateMsg

} from '../../DeviceManager'

import {
  format
} from '../../Utils'

import {
  getWeightIndexCalculateResult,
  getWeightIndexCalculateAndAnalysisResult,
  getforeignWeightAlgorithmResult,
} from '../../api'


Page({
  data: {
    mac: '',
    name: '',
    statusMsg: '',
    connectState: 0,  // 连接状态
    isBinding: false, // 是否正在绑定
    bindState: 4,     // 绑定状态
    code: '',
    logText: '',
    focus: false,
    model: '',
    heartRateEnable: true,
    deviceInfo: {},
    array: ["Kg", "Lb", "St", "Jin"],
    index: 0,
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
    });

    let that = this;

    /** 监听蓝牙连接的事件 */
    addListener(AdaptorStateEventName, 'bind', res => {
      that.setData({
        isBluetoothEnable: res.available,
      })
    });

    addListener(DataReportEventName, "bind", (device, data) => {
      if (this.data.mac != device.mac) {
        return;
      }

      let msg = device.mac + '\n' + JSON.stringify(data);
      that.appendLogText(msg);

      if (data.dataType === 'scale') {
        console.info('收到了体重数据');

        /** 只有在有电阻的情况下才调用算法 */ 
        if (data.resistance && data.resistance > 0) {
          getWeightIndexCalculateResult({
            weight: data.weight,
            age: 20,
            sex: 1, // 1男 2女
            height: 1.70,
            resistance: data.resistance
          }).then((value) => {
            that.appendLogText(JSON.stringify(value));
          }).catch(e => {
            that.appendLogText(JSON.stringify(e));
          });

          getWeightIndexCalculateAndAnalysisResult({
            weight: data.weight,
            age: 20,
            sex: 1, // 1男 2女
            height: 1.70,
            resistance: data.resistance
          }).then((value) => {
            that.appendLogText(JSON.stringify(value));
          }).catch(e => {
            that.appendLogText(JSON.stringify(e));
          });
        }
      }
    });

    addListener(ConnectionStateEventName, 'bind', (mac, state) => {
      if (this.data.mac != mac) {
        return;
      }

      let logText = connectStateMsg(state);
      that.appendLogText(logText);
      that.setData({
        statusMsg: logText,
        connectState: state,
      })
    });


  },

  onUnload: function () {
    // cancelBind({ 
    //   mac: this.data.mac
    // })
  },

  bindDevice: function () {
    this.appendLogText("绑定中");
    this.setData({
      isBinding: true
    })
    let that = this;
    /// 绑定设备
    bindDevice({
      mac: this.data.mac,
      callback(res) {
        // 回调
        console.debug('bind', 'bindDevice', res);

        let bindState = res.bindState;
        let statusMsg = bindStateMsg(bindState);
        let model = null;

        if (bindState === 4) {
          model = res.deviceInfo.model;
          that.setData({
            model: model,
          })
        }

        let isBinding = false;
        if (bindState == 0 || bindState == 7 ) {
          isBinding = true;
        }

        if (res.deviceInfo) {
          that.setData({
            bindState,
            statusMsg,
            isBinding,
            deviceInfo: res.deviceInfo,
          });
          that.appendLogText(statusMsg + '\n' + JSON.stringify(res.deviceInfo));
        } else {
          that.setData({
            bindState,
            statusMsg,
            isBinding,
          });
          that.appendLogText(statusMsg);
        }

      }
    })
  },

  restartReceiveData() {
    console.debug('重新开始接收数据', this.data.mac, this.data.model);
    /// 添加监听
    addMonitorDevice({
      mac: this.data.mac,
      model: this.data.model,
    })
  },

  stopReceiveData() {
    console.debug('停止接收数据');
    deleteMonitorDevice({
      mac: this.data.mac,
    })
  },

  configWifi: function () {
    console.debug('wifi 配网');
    wx.navigateTo({
      url: '../wifiConfig/wifiConfig?mac=' + this.data.mac + '&name=' + this.data.name
    })
  },

  bindKeyInput: function (e) {
    console.debug('bindkeyInput', e.detail.value);
    let code = e.detail.value;
    if (code.length === 6) {
      this.sendRandomCode(code);
      this.setData({
        focus: false,
      })
    }
  },

  sendRandomCode: function (code) {
    console.debug("发送随机码")
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

  heartRateSwitch: function (event) {
    let enable = event.detail.value;
    let setting = new settingFactory.A6HeartRateSetting(enable);
    console.debug("event", enable, setting);
    pushSetting({
      mac: this.data.mac,
      setting
    }).then().catch( res => {
      this.setData({
        heartRateEnable: !enable
      })
    });
  },

  bindPickerChange(event) {
    console.log('picker发送选择改变，携带值为', event.detail.value)   
    let index = event.detail.value; 
    let setting = new settingFactory.A6UnitSetting(event.detail.value);
    pushSetting({
      mac: this.data.mac,
      setting
    }).then(_ => {
      this.setData({
        index
      })
    })
  }




});