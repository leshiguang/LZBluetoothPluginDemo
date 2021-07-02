import {
  AdaptorStateEventName,
  init,
  isBluetoothAvailable,
  startScanning,
  stopScanning,
  addListener,
  removeListener,
  settingFactory,
  connectStateMsg
} from '../../DeviceManager'

Page({
  data: {
    isBluetoothEnable: false,
    isScanning: false,
    currentItem: 0,
    inputMacString: '6876270C5097',
    deviceIds: [],
    scanResults: [
      {
        name: "demo",
        mac: "AAAAAAAA",
        deviceId: "aaaaaaa",
        RSSI: -76,
      },
    ]
  },

  onLoad() {
    console.log('app', 'onLoad', 'init');
    init();
    this.setData({})
  },

  onShow() {
    addListener(AdaptorStateEventName, 'index', res => {
      this.setData({
        isBluetoothEnable: res.available,
        isScanning: res.discovering,
      })
    });
  },

  onHide() {
    removeListener(AdaptorStateEventName, 'index');
  },


  onReady() {
    let isBluetoothEnable = isBluetoothAvailable();
    this.setData({
      isBluetoothEnable
    });
  },

  startSearch() {
    /** 更新UI */
    this.setData({
      scanResults: [],
      deviceIds: [],
    });

    let scanResults = [];
    let deviceIds = [];
    /** 开始搜索设备 */
    startScanning(res => {
      // let localName = res.localName;
      // if (localName.indexOf('GBF') < 0) {
      //   return;
      // }

      let index = deviceIds.indexOf(res.deviceId);
      if (index < 0) {
        scanResults.push(res);
        deviceIds.push(res.deviceId);
      } else {
        let obj = scanResults[index];
        if (obj.RSSI < res.RSSI || !obj.RSSI) {
          obj.RSSI = res.RSSI;
        }
      }

      // 排序 大->小
      scanResults.sort(function (a, b) { return b.RSSI - a.RSSI });

      /** 更新UI */
      this.setData({
        scanResults,
        deviceIds
      })
    });
  },

  stopSearch() {
    this.setData({
      isScanning: false
    });
    stopScanning();
  },

  inputMacString: function (e) {
    var value = e.detail.value + ''
    if (value.length > 12) {
      value = value.slice(0, 12);
    }

    var pos = e.detail.cursor
    // 直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
    return {
      value: value,
      cursor: pos
    }
  },

  jump: function () {
    /// 在已知mac 与 model 的情况下
    let mac = this.data.inputMacString;
    let name = "GBF-2008-BF1";
    let model = "GBF-2008-BF1";

    this.jumpToConnect({
      mac,
      name,
      deviceId,
      model
    })
  },

  selectDevice: function (event) {
    stopScanning();
    let target = event.target;
    let index = parseInt(event.currentTarget.dataset.text);
    let device = this.data.scanResults[index];
    this.jumpToBind(device);
  },

  jumpToBind: function (device) {
    wx.navigateTo({
      url: '../bind/bind?mac=' + device.mac + '&name=' + device.name
    })
  },

  jumpToConnect: function (device) {
    wx.navigateTo({
      url: '../connect/connect?mac=' + device.mac + '&name=' + device.name + '&model=' + device.model
    })
  }
})
