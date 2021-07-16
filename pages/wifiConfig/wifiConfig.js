
//获取应用实例
import {
  ConnectionStateEventName,
  DataReportEventName,
  settingFactory,
  pushSetting,
  addListener,
  connectStateMsg,
  getConnectionState,

} from "../../DeviceManager";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mac: '',
    name: '',
    deviceImgUrl: null,
    failuresType: 0, //失败类型 1-设备断开连接，退出配置界面  2-设备搜索wifi失败，进行wifi list重试  3- 配置wifi失败，进行重试
    bindFailTitle: "配置失败，请重试",
    bindFailTips: '',
    scanWifiFinish: false,//是否搜索完毕wifi,必须搜索完成后，才能调用connect
    textFocus: true,
    password: '',
    pageType: 0,// 0guide   1wifi列表  2输入wifi 3配置成功 4失败
    selectAp: { ssid: '' },
    apList: [
      {
        bssid: "703a730605fc",
        cmd: 4096,
        connected: 0,
        dataType: "apInfo",
        mode: 4,
        ssid: "aaaaaaa",
        rssi: 20
      }
    ], // wifi列表
    apSsidFilter: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('wifiConfig', 'onload', JSON.stringify(options));
    let obj = JSON.parse(JSON.stringify(options));
    this.setData({
      mac: obj.mac,
      name: obj.name,
    });

    addListener(ConnectionStateEventName, 'wifiConfig', (mac, state) => {
      if (this.data.mac != mac) {
        return;
      }
      // let logText = connectStateMsg(state);
      // that.appendLogText(logText);
    });

    addListener(DataReportEventName, "wifiConfig", (device, dataReport) => {
      console.warn('wifiConfig dataReport', device, dataReport);
      if (dataReport.dataType === 'apInfo' || dataReport.dataType === 'wifiInfo') {
        this.addApToUI(dataReport);
      } else if (dataReport.dataType === 'configStatus') {
        if (!this.data.isStartConnect) return;
        if (this._connectTimeout) clearTimeout(this._connectTimeout);
        //配网结果回包 0 success || fail reason code
        wx.hideLoading();
        console.log('ui配网结果:', dataReport, dataReport.status === 0);
        if (dataReport.status === 0) {
          this.setData({
            pageType: 3,
            isStartConnect: false
          })
        } else {
          this.setData({
            failuresType: 3,
            isStartConnect: false,
          })
          this.showErrorBack('配置Wi-Fi失败');
        }
      }
    });
  },

  onClickRetry() {
    let pageType = 0;
    if (this.failuresType === 1) {
      pageType = 0;
    } else if (this.failuresType === 2) {
      this.onClickStartConfig();
    } else if (this.failuresType === 3) {
      pageType = 2;
    } else {
      pageType = 0;
    }

    this.setData({
      pageType: pageType
    })
  },

  addApToUI(apInfo) {
    this.stopGetWifiListTimeout();
    console.info('add ui', apInfo);
    if (!apInfo || !apInfo.ssid) return;

    let apSsidFilter = this.data.apSsidFilter ?? [];
    let apList = this.data.apList ?? [];
    let index = apSsidFilter.indexOf(apInfo.ssid);
    if (apInfo.ssid.length > 0) {
      apSsidFilter.push(apInfo.ssid);
      apList.push(apInfo);
    }

    this.setData({
      apList,
      apSsidFilter
    })
  },

  showErrorBack(msg) {
    console.info('config error', msg, this.failuresType);
    this.setData({
      pageType: 4,
      isStartConnect: false,
      bindFailTips: msg
    })
  },

  onClickAp(event) {
    let ap = event.target.dataset.result;
    console.debug("xxxxxxxxxxxx", event, ap)

    this.setData({
      isStartConnect: false,
      pageType: 2,
      selectAp: ap,
    })
  },

  onInputPassword(event) {
    console.log("onInputPassword", event);
    this.data.password = event.detail.value;
  },

  onClickConnect() {
    wx.showLoading();
    this.setData({
      isStartConnect: true
    });
    console.info("开始配置WIFI", this.data.selectAp.bssid, this.data.password)
    let deviceSetting = new settingFactory.ConnectWifiReq({ bssid: this.data.selectAp.bssid, password: this.data.password });
    let options = {
      mac: this.data.mac,
      setting: deviceSetting
    };
    pushSetting(options)

    //增加一个超时逻辑
    if (this._connectTimeout) clearTimeout(this._connectTimeout);
    this._connectTimeout = setTimeout(() => {
      wx.hideLoading();
      this.setData({
        isStartConnect: 3,
        bindFailTitle: '配置失败，请重试',
      })

      this.showErrorBack("配置Wi-Fi超时");
    }, 15 * 1000);
  },

  onComplete() {
    wx.navigateBack();
  },

  stopGetWifiListTimeout() {
    if (this._timeoutGetWifiList) clearTimeout(this._timeoutGetWifiList);
    if (this._retryGetWifiList) clearTimeout(this._retryGetWifiList);
    this._retryGetWifiList = null;
    this._timeoutGetWifiList = null;
  },

  onClickStartConfig() {
    let status = getConnectionState({ mac: this.data.mac });
    console.warn('当前状态', status);
    if (status === 4) {
      this.setData({
        pageType: 1,
      });
      this._timeoutGetWifiList = setTimeout(() => {
        //10s超时
        this.setData({
          failuresType: 2,
          failuresType: "未找到附近的WI-FI网络",
        });
        this.showErrorBack("获取WiFi列表失败，请重试");
      }, 10000);
      this._retryGetWifiList = setTimeout(() => {
        this.getWifiList();
      }, 5000);
      this.getWifiList();
    } else {
      wx.showModal({
        content: '设备未连接。请确认手机蓝牙开启，并轻踩设备使屏幕亮起',
        showCancel: false,
        confirmText: '我知道了',
        success: () => { }
      });
    }
  },

  // 获取wifi列表
  getWifiList() {
    let deviceSetting = new settingFactory.ScanWifiReq();
    let options = {
      mac: this.data.mac,
      setting: deviceSetting
    }
    pushSetting(options);
  }
})