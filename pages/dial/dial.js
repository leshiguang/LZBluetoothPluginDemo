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
  DeviceStateChangedName,
  getDeviceInfo,
  getSetting,
  cancelSetting

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
    filePath: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let obj = JSON.parse(JSON.stringify(options));
    this.setData({
      mac: obj.mac,
      name: obj.name,
    });

    wx.setKeepScreenOn({
      keepScreenOn: true
    })


  },

  pushPhotoDial: function (event) {
    let url = "https://media.githubusercontent.com/media/malai520/OtaFile/main/456/WatchFace-Custom-lzo.lsf";
    let spUrl = url.split('/');
    let lastName = spUrl[spUrl.length - 1];
    let otaFilePath = wx.env.USER_DATA_PATH + '/' + lastName;
    try {
      wx.getFileSystemManager().accessSync(otaFilePath);
      this.readFile(otaFilePath, 0x01, 0x05);
    } catch (e) {
      wx.downloadFile({
        url: url,
        success: res => {
          let tempFilePath = res.tempFilePath;
          wx.getFileSystemManager().saveFile({
            tempFilePath: tempFilePath,
            filePath: otaFilePath,
            success: (res) => {
              const savedFilePath = res.savedFilePath;
              console.log('savedFilePath', savedFilePath);
              this.readFile(otaFilePath, 0x01, 0x05, '5');
            },
          });
          console.log('tempFilePath:', tempFilePath);
        },
      });
    }
  },

  deletePhotoDial() {
    let setting = new settingFactory.MultipleSetting([{ tag: 0x34, list: [{ index: 5, dialType: 0x01 }] }]);

    pushSetting({
      mac: this.data.mac,
      setting: setting,
    })
  },

  pushYunDial() {
    let url = "https://media.githubusercontent.com/media/malai520/OtaFile/main/456/WatchFace124.lzo.lsf";
    let spUrl = url.split('/');
    let lastName = spUrl[spUrl.length - 1];
    let otaFilePath = wx.env.USER_DATA_PATH + '/' + lastName;
    try {
      wx.getFileSystemManager().accessSync(otaFilePath);
      this.readFile(otaFilePath, 0x00, 0x06);
    } catch (e) {
      wx.downloadFile({
        url: url,
        success: res => {
          let tempFilePath = res.tempFilePath;
          wx.getFileSystemManager().saveFile({
            tempFilePath: tempFilePath,
            filePath: otaFilePath,
            success: (res) => {
              const savedFilePath = res.savedFilePath;
              this.readFile(savedFilePath, 0x00, 0x6, '4');
            },
          });
        },
      });
    }
  },

  pushYunDial2() {
    let url = "https://media.githubusercontent.com/media/malai520/OtaFile/main/456/WatchFace123.lzo.lsf";
    let spUrl = url.split('/');
    let lastName = spUrl[spUrl.length - 1];
    let otaFilePath = wx.env.USER_DATA_PATH + '/' + lastName;
    try {
      wx.getFileSystemManager().accessSync(otaFilePath);
      this.readFile(otaFilePath, 0x00, 0x7);
    } catch (e) {
      wx.downloadFile({
        url: url,
        success: res => {
          let tempFilePath = res.tempFilePath;
          wx.getFileSystemManager().saveFile({
            tempFilePath: tempFilePath,
            filePath: otaFilePath,
            success: (res) => {
              const savedFilePath = res.savedFilePath;
              this.readFile(savedFilePath, 0x00, 0x7, "3");
            },
          });
        },
      });
    }
  },

  deleteYunDial() {
    let setting = new settingFactory.MultipleSetting([{ tag: 0x34, list: [{ index: 6, dailType: 0 }] }]);

    pushSetting({
      mac: this.data.mac,
      setting: setting,
    })

    // let setting = new settingFactory.PushDialSetting(dailIndex, id, dialType, "test", "test", 0, 0, buf);

    // pushSetting({
    //   mac: this.data.mac,
    //   setting: setting,
    // })
  },

  deleteYunDial2() {
    let setting = new settingFactory.MultipleSetting([{ tag: 0x34, list: [{ index: 7, dailType: 0 }] }]);

    pushSetting({
      mac: this.data.mac,
      setting: setting,
    })
  },

  clearLog: function (event) {
    this.setData({
      logText: ""
    })
  },

  cancelSetting() {
    cancelSetting(this.data.mac);
  },

  checkCal(buf) {

    let device = getDeviceInfo(this.data.mac);
    let imageData = new Uint8ClampedArray(buf);
    let retbuf = settingFactory.packingWatchFaceFile(imageData, 120, 240, imageData, 90, 180, device)
    console.debug("retBuf", retbuf.byteLength);
    this.pushDialFilePath(retbuf, 1, 4);
  },

  checkCalReadFile(filePath) {
    wx.getFileSystemManager().readFile({
      filePath: filePath,
      success: res => {
        this.appendLogText("读取文件成功", res.data.byteLength);
        this.checkCal(res.data);
      },
    });
  },

  readFile(filePath, dialType, dailIndex) {

    wx.getFileSystemManager().readFile({
      filePath: filePath,
      success: res => {
        this.appendLogText("读取文件成功", res.data.byteLength);
        this.pushDialFilePath(res.data, dialType, dailIndex);
      },
    });
  },

  pushDialFilePath(buf, dialType, dailIndex, id) {

    // dialIndex: number,
    //     id: string = "",
    //     dialType: number = 2,
    //     fileName: string = "",
    //     backgroundImageName?: string,
    //     styleId?: number,
    //     colorId?: number,
    //     fileBuf?: ArrayBuffer,
    let setting = new settingFactory.PushDialSetting(dailIndex, id, dialType, "test", "test", 0, 0, buf);

    pushSetting({
      mac: this.data.mac,
      setting: setting,
    })

  },

  dialIndexClick1() {
    let setting = new settingFactory.DialEnableSetting(1, [1, 2, 3, 4, 5, 6, 7]);
    pushSetting({
      mac: this.data.mac,
      setting: setting,
    })
  },
  dialIndexClick2() {
    let setting = new settingFactory.DialEnableSetting(2, [1, 2, 3, 4, 5, 6, 7]);
    pushSetting({
      mac: this.data.mac,
      setting: setting,
    })
  },
  dialIndexClick3() {
    let setting = new settingFactory.DialEnableSetting(3, [1, 2, 3, 4, 5, 6, 7]);
    pushSetting({
      mac: this.data.mac,
      setting: setting,
    })
  },
  dialIndexClick4() {
    let setting = new settingFactory.DialEnableSetting(4, [1, 2, 3, 4, 5, 6, 7]);
    pushSetting({
      mac: this.data.mac,
      setting: setting,
    })
  },
  dialIndexClick5() {
    let setting = new settingFactory.DialEnableSetting(5, [1, 2, 3, 4, 5, 6, 7]);
    pushSetting({
      mac: this.data.mac,
      setting: setting,
    })
  },
  dialIndexClick6() {
    let setting = new settingFactory.DialEnableSetting(6, [1, 2, 3, 4, 5, 6, 7]);
    pushSetting({
      mac: this.data.mac,
      setting: setting,
    })
  },
  dialIndexClick7() {
    let setting = new settingFactory.DialEnableSetting(7, [1, 2, 3, 4, 5, 6, 7]);
    pushSetting({
      mac: this.data.mac,
      setting: setting,
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