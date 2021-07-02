# 乐心蓝牙设备小程序插件接入指南
demo地址:https://github.com/leshiguang/LZBluetoothPluginDemo.git


## 0、升级记录（显示最新的两个版本）
#### 1.0.0
    完成小程序插件的接入
 
## 1、插件使用说明
#### 1.0 插件使用申请

请查看微信小程序插件使用官方文档：https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html 当前小程序插件appId: wxe3d2a6ab8dd5b49b 需要申请并等待通过审核后方可使用本插件。

#### 1.1 插件声明

在app.json中声明插件的引用及appId:
```json
{
  "plugins": {
    "lzbluetooth": {
        "version": "{{最新版本}}",
        "provider": "wxe3d2a6ab8dd5b49b"
    }
  }
}
```

#### 1.2 插件引入

```javascript
const lsPlugin = requirePlugin("lzbluetooth")
// 打印插件的版本信息
let version = plugin.getVersion();
```

#### 1.3 插件初始化

建议在app.js的onLaunch方法中初始化插件，避免因系统的差异或系统蓝牙初始化延时，导致的接口功能异常。
如果需要进行设备数据同步，还需要初始化插件鉴权信息(请看1.4)。
```javascript
const plugin = requirePlugin("lzbluetooth")

App({
  onLaunch: function () {
    plugin.init({
      appId: "com.leshiguang.saas.rbac.demo.appid",
      logger: null,
    });
  }
})
```
#### 1.4 插件鉴权初始化(v2.0.0及以上版本)
> 发送邮件到以下邮箱申请appId。
> 
> 收件人：hezuo@leshiguang.com
> 主题：【乐智健康服务准入申请】-（xx 企业/组织/个人）
> 邮件正文：
> 1、接入目的：（示例：（xx企业/组织/个人）-申请接入乐心服务，目的是借助xx（硬件型号）的数据能力帮助（xx企业/组织/个人）的用户完成健康管理）
> 2、企业全称：
> 3、联系人：
> 4、联系人邮箱：
> 5、联系人电话：
> 6、联系人职位：
> 7、接入应用：（小程序/app）
> 8、应用名称：
> 9、设备型号+工厂型号：如体脂称A20，GBF-2008-BF；（若为双模设备，如A20/S20/S30，则需在邮件中写明设备的sn码）
> 本次接入硬件数量：如体脂秤5台
> 10、接入的产品服务：【蓝牙SDK】，【体脂、睡眠算法】，【UI级SDK】，【乐智云Api服务】
> 11、本次期望采购的硬件设备数量（多款设备分别陈述）：

> 邮件发送后， 我们会在一个工作日内完成企业信息、订阅设备的初始化工作，并将申请的appId等信息通过邮件的形式回复给您
> 申请成功将会收到乐心的回复，回复内容中会包含一下信息：
> 1.appKey（appid）:对应一个应用
> 2.appSecret:私钥
> 3.tenantName：租户名缩写（用于h5页面版本管理）
> 4.api权限表

申请成功后，请通过下面代码初始化鉴权信息
```javascript
  plugin.init({
    //用邮件乐心分配的appId替换掉下面字符串
      appId: "com.leshiguang.saas.rbac.demo.appid",
      logger: null,
    });
```


## 2、接口定义

#### 2.1 init
  插件初始化
```javascript
  plugin.init({
    //用邮件乐心分配的appId替换掉下面字符串
      appId: "com.leshiguang.saas.rbac.demo.appid",
      logger: null,
    });
```
#### 2.2 getVersion
  获取插件版本信息。
```javascript
  let version = plugin.getVersion();
```
#### 2.3 getConnectionState
  获取当前设备的工作状态
| 枚举         |  值   | 说明                                                         |
| :----------- | :---: | :----------------------------------------------------------- |
| None         |   0   | 初始状态                                                     |
| Scan         |   1   | 扫描中                                                       |
| Connecting   |   2   | 连接中                                                       |
| Connected    |   3   | 蓝牙连接成功，还没有启动数据同步                             |
| Syncing      |   4   | 已经启动数据同步，这是才能进行收数据，推送设置项等           |
| Disconnected |   5   | 设备主动断开了连接，或者系统断开了连接                       |
| SyncError    |   6   | 发起启动数据同步出现未知异常，和被动设备断开Disconnected区分 |
| StopDataSync |   7   | 业务层主动停止了同步                                         |

```javascript
  // mac 设备的唯一标识
  let state = plugin.getConnectionState({mac}});
```

#### 2.4 startScanning
  启动蓝牙扫描。
```javascript
  plugin.startScanning(res => {
  });
```

扫描回调信息

| 字段名           |    类型     | 说明                                                   |
| :--------------- | :---------: | :----------------------------------------------------- |
| name             |   String    | 蓝牙设备名称，某些设备可能没有                         |
| localName        |   String    | 设当前蓝牙设备的广播数据段中的 LocalName 数据段        |
| deviceId         |   string    | 用于区分设备的id，安卓为mac地址，IOS为系统分配的唯一ID |
| manufacturerData | ArrayBuffer | 广播服务                                               |
| serviceUUIDs     |    Array    | 当前蓝牙设备的广播数据段中的 ServiceUUIDs              |
| RSSI             |   number    | 当前蓝牙设备的信号强度                                 |
| serviceData      |   object    | 当前蓝牙设备的广播数据段中的 ServiceData 数据段        |
| mac              |   String    | 设备mac地址                                            |
| isSystemPaired   |   Boolean   | 是否已在系统的配对列表中 （手环专用）                  |
| timestamp        |    Date     | 扫描回调信息                                           |



#### 2.5 stopScanning
  停止蓝牙扫描。
```javascript
  plugin.stopScanning();
```

#### 2.6 bindDevice
  绑定设备
```javascript

  plugin.bindDevice({
    mac: mac,
    callback: res => {
      // 绑定状态， 如下表
      let bindState = res.bindState;
    }
  });
```
当前设备绑定状态枚举
| 枚举                   |  值   | 说明                                                  |
| :--------------------- | :---: | :---------------------------------------------------- |
| InputRandomNumber      |   0   | 输入随机数 (手环专用)                                 |
| Successful             |   4   | 绑定成功                                              |
| Failure                |   5   | 绑定失败                                              |
| AuthorizeFailure       |   6   | 鉴权失败                                              |
| InputRandomNumberError |   7   | 输入随机码错误 (报这个错误是可以继续输入正确的随机码) |

#### 2.7 cancelBind
  取消设备的绑定
  
```javascript
  plugin.cancelBind({ mac });
```

#### 2.8 addMonitorDevice
  添加监听的设备

```javascript
// 参数也可以是数组
  plugin.addMonitorDevice({
    mac: mac,
    model: "设备型号"  // 绑定成功后可获取这个型号
  }});
```
  
#### 2.9 setMonitorDevice
  设置监听的设备，与addMonitorDevice相比，这个方法会替换
```javascript
// 参数也可以是数组
  plugin.setMonitorDevice({
    mac: mac,
    model: "设备型号"  // 绑定成功后可获取这个型号
  })
```

#### 2.10 deleteMonitorDevice
  删除监听的设备

```javascript
  plugin.deleteMonitorDevice({ mac });
```

#### 2.11 deleteAllMonitorDevice
  删除所有监听的设备

```javascript
  plugin.deleteAllMonitorDevice();
```

#### 2.12 isBluetoothAvailable
  获取当前蓝牙是否可用

```javascript
  let available = plugin.isBluetoothAvailable();
```
#### 2.13 $on
  监听事件
```javascript
  export const AdaptorStateEventName = 'adaptorState';        // 蓝牙开关的回调
  export const ConnectionStateEventName = 'connectionState';  // 监听设备的时候设备的回调
  export const DataReportEventName = 'dataReport';            // 设备数据的回调
  /**
   * AdaptorState = 'adaptorState',//蓝牙状态改变回调
   * ConnectionState = 'connectionState',//连接状态改变回调
   * DataReport = 'dataReport', // 数据接收回调
   */
  /// 监听
  plugin.$on({
    eventName: AdaptorStateEventName,
    eventKey: 'wo',   /// 唯一标识，同一标识的监听会被覆盖
    callback: onAdaptorState,
  });

  plugin.$on({
    eventName: ConnectionStateEventName,
    eventKey: 'shi',   /// 唯一标识，同一标识的监听会被覆盖
    callback: onConnectionState,
  });

  plugin.$on({
    eventName: DataReportEventName,
    eventKey: 'shi',  /// 唯一标识，同一标识的监听会被覆盖
    callback: onDataReport,
  });

function onAdaptorState(available) {
  console.warn('app', "onAdaptorState", available);
}

function onConnectionState(mac, connectState) {
  console.warn('app', 'onConnectionState', mac, connectState);
}

function onDataReport(device, dataReport) {
  console.warn('app', 'onDataReport', device, dataReport);
}
```    
#### 2.14 $off
   取消监听事件

```javascript
  plugin.$off({
    eventName,  // 事件名称
    eventKey    // 唯一标识，同一标识的监听会被覆盖
  })
```
#### 2.15 pushSetting
  向设备发送数据 数据的`setting`参数都是由`plugin.settingFactory`产生的
  
```javascript
  /// settingFactory
  let settingFactory = plugin.settingFactory;
  let scanWifiSetting = new settingFactory.ScanWifiReq();
  plugin.pushSetting({
    mac: mac,
    setting: scanWifiSetting
  }).then((value) => {
    console.info('发送指令获取wifi列表', value)
  }).catch(_ => {
    wx.showToast({ title: "设置失败，请重试", icon: "none", duration: 3000 });
  });
```
#### 2.16 settingFactory
  设置工厂方法，所有的设置项都需要通过这个方法调用
```javascript
  let settingFactory = plugin.settingFactory;

  /// wifi扫描请求
  let deviceSetting = new settingFactory.ScanWifiReq();

  /// 配置wifi请求
  let deviceSetting = new settingFactory.ConnectWifiReq({ 
    bssid: bssid,   // wifi设备mac
    password: password  //wifi 密码
    });
```


#### 2.17 数据结构
  参考代码注释
```javascript
/// 扫描wifi
class ApInfo implements Data {
  // 命令字
  cmd: number;
  // wifi广播名
  ssid: string;
  // wifi设备mac
  bssid: string;
  // 模式
  mode: number;
  // 型号强度
  rssi: number;
  // 是否已连接
  connected: number;
  // 数据类型
  dataType: string = 'apInfo';
}

// 体脂秤的测量数据
class ScaleData implements Data{
  // 数据类型
  dataType: string = "scale";
  // 剩余测量数据条数
  remainCount: number;
  // 0=kg,1=lb,2=st,3=斤
  unit: number;
  // 体重
  weight: number;
  // utc
  utc: number;
  // 电阻值
  resistance: number;
  // 用户编号
  userNumber: string | number;
  // 时区
  timeZone: any;
  // 测量时间
  timeStamp: string;
  // 实时测量数据状态 (一般的秤没有这个值，主要用与秤的过程值)
  realtimeDataStatus: boolean;
}

class ConfigStatus implements Data {
  // 设备类型
  dataType: string = 'configStatus';
  // 设备id
  deviceId: string;
  // 0表示成功 1表示失败
  status: number 
}
```

## 3、设备绑定流程说明
1. 先扫描到设备`plugin.startScanning`，
2. 然后绑定某个设备`plugin.bindDevice`
3. 监听连接同步状态`addListener(ConnectionStateEventName, 'bind', (mac, state) => { }`
4. 监听数据上报回调`addListener(DataReportEventName, "bind", (device, data) => { }`

```javascript
// 监听设备
  plugin.startScanning(res => {

  })

// 绑定设备
  plugin.bindDevice({
    mac: mac,
    callback: res => {
      let bindState = res.bindState;
    }
  });

  // 监听数据的上报

  plugin.$on(DataReportEventName, "bind", (device, data) => {
    let msg = device.mac + '\n' + JSON.stringify(data);
    that.appendLogText(msg);
  });

  // 监听设备的连接同步状态

  plugin.$on(ConnectionStateEventName, 'bind', (mac, state) => {
    // 设备的状态发生改变
  })  
```

## 4、设备数据同步流程说明
1. 调用`plugin.addMonitorDevice`，
2. 监听连接同步状态`plugin.$on(ConnectionStateEventName, 'bind', (mac, state) => { }`
3. 监听数据上报回调`plugin.$on(DataReportEventName, "bind", (device, data) => { }`

```javascript

  // 监听数据的上报
  plugin.$on(DataReportEventName, "bind", (device, data) => {
    let msg = device.mac + '\n' + JSON.stringify(data);
    that.appendLogText(msg);
  });

  // 监听设备的连接同步状态
  plugin.$on(ConnectionStateEventName, 'bind', (mac, state) => {
    // 设备的状态发生改变
  })  

  /// 添加监听
  plugin.addMonitorDevice({ 
    mac: this.data.mac,
    model: this.data.model,
  })
```
