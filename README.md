# 乐心蓝牙设备小程序插件接入指南
demo地址:https://github.com/leshiguang/LZBluetoothPluginDemo.git

## 版本更新日志
#### 1.0.3
  * 增加体脂秤的心率开关
  * 增加体脂秤的单位设置
  * 增加体脂秤绑定时的设备数据 电量
#### 1.0.2
  * 优化连接问题
#### 1.0.1
  * 解决安卓手机无法连接的问题
#### 1.0.0
  * 完成小程序插件的接入

   ---
 
## 1 插件使用说明
### 1.1 插件声明
在app.json中声明插件的引用及小程序的appId:wxe3d2a6ab8dd5b49b，此时如果你之前没有使用过该插件，则会在console中报错“插件未授权 [添加插件](https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wxe3d2a6ab8dd5b49b&lang=zh_CN)”
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

### 1.2 插件引入
```javascript
const lsPlugin = requirePlugin("lzbluetooth");
```
### 1.3 插件初始化
[申请乐心AppKey](https://docs.leshiguang.com/develop-native/apply)
```javascript
  plugin.init({
    //用邮件乐心分配的appId替换掉下面字符串
      appId: "你申请的appkey",
      logger: null,
    });
```
## 2 设备相关
### 2.1 搜索&发现设备
蓝牙设备在绑定前，需要先通过扫描获得需要绑定的设备信息，
首先需要调用`startScanning`接口获取`device`对象，
您可能需要自己去判断释放有重复的蓝牙设备信号上报并做过滤，在实际应用过程中，
您可能需要经过多个扫描周期才能获得蓝牙搜索结果，调用示例：
   
```javascript
// 开始扫描设备
  plugin.startScanning(device => {
    // 将扫描到的设备保存，具体参数参考具体接口
    scanResults.push(device);
    // 刷新UI
    this.setData({
      scanResults
    })
  }) 
```
请求参数：

| 属性            |  类型  | 说明                                                         |
| :-------------  | :---:  | :--------------------------------------------------------- |
| callback(device) | func | 搜索到的设备对象的回调                                        |

`device` 的数据结构

| 属性           |    类型     | 说明                                                     |
| :--------------- | :---------: | :----------------------------------------------------- |
| name             |   String    | 蓝牙设备名称，某些设备可能没有                               |
| localName        |   String    | 设当前蓝牙设备的广播数据段中的 LocalName 数据段              |
| deviceId         |   string    | 用于区分设备的id，安卓为mac地址，IOS为系统分配的唯一ID       |
| manufacturerData | ArrayBuffer | 广播服务                                               |
| serviceUUIDs     |    Array<String> | 当前蓝牙设备的广播数据段中的 ServiceUUIDs                |
| RSSI             |   number    | 当前蓝牙设备的信号强度                                   |
| serviceData      |   object    | 当前蓝牙设备的广播数据段中的 ServiceData 数据段            |
| mac              |   String    | 设备mac地址                                            |
| isSystemPaired   |   Boolean   | 是否已在系统的配对列表中 （手环专用）                      |
| timestamp        |    Date     | 扫描回调信息                                           |

### 2.2 停止搜索
强制中断蓝牙搜索，执行搜索过程中中断搜索或页面销毁时，请务必调用停止搜索接口，否则会影响正常的连接流程：
```javascript
  // 关闭搜索
  plugin.stopScanning();
```

### 2.3 绑定设备
搜索完成后， 向用户展示搜索到的设备列表信息， 用户选择目标设备后， 进行设备绑定操作（绑定设备是为了获取你选择设备的信息， 绑定不是必须的，如果您知道用户当前使用的设备信息， 可以不经过绑定直接调用`plugin.addMonitorDevice`去连接设备并同步数据）调用示例：
```javascript
  // 用户选择某个设备绑定
  plugin.bindDevice({
    mac: mac,   
    callback: res => {
      // 绑定结果 
      let mac = res.mac;
      let bindState = res.bindState;

    }
  });  
```
请求参数：`Object object`

| 属性            |  类型  | 说明                                                    |
| :-------------  | :---:  | :--------------------------------------------------------- |
| mac             |   String | 绑定设备的mac                                    |
| callback(`res`) |   func | 绑定设备的回调                                    |

`res` 的数据结构

| 属性            |  类型  | 说明                                                    |
| :------------- | :---:  | :--------------------------------------------------------- |
| mac           |   String | 绑定设备的mac                                    |
| bindState      |   number | 绑定设备的状态                                    |
| deviceInfo      |   Object | 设备信息                                    |

`res.bindState` 的可能值

| 枚举                   |  值   | 说明                                                  |
| :--------------------- | :---: | :---------------------------------------------------- |
| InputRandomNumber      |   0   | 输入随机数 (手环专用)                                 |
| Successful             |   4   | 绑定成功                                              |
| Failure                |   5   | 绑定失败                                              |
| AuthorizeFailure       |   6   | 鉴权失败                                              |
| InputRandomNumberError |   7   | 输入随机码错误 (报这个错误是可以继续输入正确的随机码) |

`res.deviceInfo`的数据结构

| 属性            |  类型  | 说明                                                    |
| :------------- | :---:  | :--------------------------------------------------------- |
| deviceId       |   String | 设备的广播id                                   |
| model           |   string | 设备的型号                                      |
| lzDeviceId      |   string | id（内部使用的id）                                    |
| sn              |   string |  一般对用户可见（比如手环在表带上）                    |
| hardwareVersion |   string |  硬件版本                                        |
| firmwareVersion |   string |  固件版本                                        |
| softwareVersion |   string |  软件版本                                        |
| manufacture     |   string |  厂家名字                                   |
| battery         |   number |  电量                                   |


### 2.4 取消绑定
当前状态是正在绑定的页面，此时退出绑定页面，则需要需要绑定 调用示例：
```javascript
// 取消绑定
plugin.cancelBind({ mac });
```
请求参数：`Object object`

| 属性            |  类型  | 说明                                                    |
| :-------------  | :---:  | :--------------------------------------------------------- |
| mac             |   String | 设备的mac                                        |

### 2.5 添加用户已经绑定的设备
用户打开app时， 若之前已经绑定过设备， 需要将已经绑定的设备的mac地址添加到sdk，
sdk会自动连接设备，建议您将用户和设备的绑定关系持久化在云端， sdk初始化成功之后立即添加mac地址到sdk， 调用示例：
```javascript
  /// 添加监听
  plugin.addMonitorDevice({ 
    mac: this.data.mac,
    model: this.data.model,
  })

  // 替换目前已监听的
  plugin.setMonitroDevice({ 
    mac: this.data.mac,
    model: this.data.model,
  })
```

请求参数：`Object object ｜ Object object[]`

| 属性            |  类型  | 说明                                                    |
| :-------------  | :---:  | :--------------------------------------------------------- |
| mac             |   String | 绑定设备的mac                                        |
| model           |   String | 设备型号                                             |


### 2.6 删除用户正在连接或者同步的设备
当用户需要解除监听设备或正在绑定中断绑定时，解绑后会删除SDK中的缓存的设备信息并断开蓝牙连接，建议您在解绑成功后，清除您App本地或者云端存储的设备信息，并删除和用户的绑定关系， 调用示例：
```javascript
  /// 删除某个正在监听的设备
  plugin.deleteMonitorDevice({ 
    mac: this.data.mac,
  })

  // 删除全部正在监听的设备
  plugin.deleteAllMonitorDevice({ 
    mac: this.data.mac,
    model: this.data.model,
  })
```
### 2.7 设备状态的获取
如果你想获取某个设备的连接状态，可以通过`getConnectionState`方法获取，如果你想蓝牙的可用状态可以调用`isBluetoothAvailable`判断是否可用，调用示例：
```javascript
// 当前蓝牙是否可用
  let bluetoothAvalible = plugin.isBluetoothAvailable();
  // mac 设备的唯一标识
  let state = plugin.getConnectionState({mac}});
```

请求参数：`Object object`

| 属性            |  类型  | 说明                                                    |
| :-------------  | :---:  | :--------------------------------------------------------- |
| mac             |   String | 设备的mac                                        |

返回值：`number state`

| 枚举         |  值   | 说明                                                         |
| :----------- | :---: | :--------------------------------------------------------- |
| None         |   0   | 初始状态                                                    |
| Scan         |   1   | 扫描中                                                      |
| Connecting   |   2   | 连接中                                                      |
| Connected    |   3   | 蓝牙连接成功，还没有启动数据同步                                |
| Syncing      |   4   | 已经启动数据同步，这是才能进行收数据，推送设置项等                 |
| Disconnected |   5   | 设备主动断开了连接，或者系统断开了连接                           |
| SyncError    |   6   | 发起启动数据同步出现未知异常，和被动设备断开Disconnected区分       |
| StopDataSync |   7   | 业务层主动停止了同步                                          |

### 2.8 设备数据或状态的监听
如果你想监听手机蓝牙是否开启，设备的连接状态，及设备同步过来的数据，则可以使用 `plugin.$on` 监听某个事件，目前支持三个事件
1. 手机蓝牙的开关 eventName = "adaptorState", 
2. 蓝牙设备的连接状态 eventName = "connectionState",
3. 蓝牙设备发送给小程序的数据 eventName = "dataReport"

事件是通过 eventKey，同一事件的同一eventKey 回调会被覆盖
取消监听则使用 `plugin.$off` 参数
调用示例：
```javascript
  // 监听蓝牙是否可用
  plugin.$on({
    eventName: "adaptorState",
    eventKey: "wo",   // 唯一标识，同一标识的监听会被覆盖
    callback: res => {
      // 蓝牙是否可用
      let bluetoothAvalible = res.available
    },
  });

  // 监听设备的连接状态
  plugin.$on({
    eventName: "connectionState",
    eventKey: 'wo',   // 唯一标识，同一标识的监听会被覆盖
    callback: (mac, state) => {
      // 设备mac，连接状态， 参考2.7 的连接状态
    },
  });

  // 监听数据上报
  plugin.$on({
    eventName: "dataReport",
    eventKey: 'wo',  // 唯一标识，同一标识的监听会被覆盖
    callback: (device, data) => {
      // 设备信息， 数据信息
      // 一般mac用来设备设备
      let mac = device.mac;
      // dataType 识别数据类型
      let dataType = data.dataType;
    },
  });

  // 取消监听
  plugin.$off({
    eventname: "adaptorState",
    eventKey: "wo"
  })

  plugin.$off({
    eventname: "connectionState",
    eventKey: "wo"
  })

  plugin.$off({
    eventname: "dataReport",
    eventKey: "wo"
  })

``` 

## 3 设置项
小程序向设备发送指令都是通过`pushSetting`
包括手环绑定时候输入随机码，蓝牙配网的时候 发送扫描指令， 发送wifi连接指令，以及一些手设备的设置项等等
调用示例：
```javascript
  // 生产设置项的对象
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
请求参数：`Object object`

| 属性            |  类型  | 说明                                                    |
| :-------------  | :---:  | :--------------------------------------------------------- |
| mac             |   String | 设备的mac                                        |
| setting         |   Object | 设置的对象，这个由 `settingFactory` 产生，不同的设置项，参数也不一样，具体参考各个设置项 |

`settingFactory`的方法列表

| 方法名           |  类型      | 说明                                                    |
| :-------------  | :---:     | :--------------------------------------------------------- |
| ScanWifiReq     |   func    | 扫描指令  参考 [4.1](#4.1 扫描wifi)                           |
| ConnectWifiReq  |   func    | 连接wifi指令  参考 [4.2](#4.2 wifi数据)                           |
| A6HeartRateSetting  |   func    | 体脂秤心率开关  参考 [3.1](#3.1 体脂秤心率开关)                           |
| A6UnitSetting  |   func    | 体脂秤单位设置  参考 [3.2](#3.2 体脂秤单位设置)                           |

### 3.1 体脂秤心率开关
控制体脂秤测量心率的开关
`A6HeartRateSetting` 的参数

| 属性            |  类型  | 说明                                                    |
| :------------- | :---:  | :--------------------------------------------------------- |
| enable       |   boolean | 开关心率                                               |

### 3.2 体脂秤单位设置
控制体脂秤单位的显示
`A6UnitSetting` 的参数

| 属性            |  类型  | 说明                                                    |
| :------------- | :---:  | :--------------------------------------------------------- |
| unit         |   number | 0表示kg 1和2 表示Lb  3表示斤                                  |

## 4 蓝牙配网
蓝牙配网一般流程
1. 监听数据的接收
2. 向蓝牙设备发送扫描wifi指令 （扫描wifi这个动作是蓝牙设备完成的，因为手机不能扫描附近的wifi设备）
3. 通过监听的数据得到扫描到的wifi列表 
4. 选中某个wifi 并输入密码， 然后向蓝牙设备发送指定wifi的连接指令 
调用示例：

```javascript
  let settingFactory = plugin.settingFactory;

  // 监听设备向小程序同步数据
   plugin.$on("dataReport", "wifiConfig", (device, dataReport) => {
      if (dataReport.dataType === 'apInfo' || dataReport.dataType === 'wifiInfo') {
        // 这里收到的的是wifi数据
        this.addApToUI(dataReport);
      } else if (dataReport.dataType === 'configStatus') {
        // 这里收到的是连接wifi的状态结果
        // 需要注意的是只需要认第一个回调为准，因为有可能返回多个状态
        //配网结果回包 0 success || fail reason code
        wx.hideLoading();
        console.log('ui配网结果:', dataReport, dataReport.status === 0);
        if (dataReport.status === 0) {
          this.showErrorBack('配置Wi-Fi成功');
        } else {
          this.showErrorBack('配置Wi-Fi失败');
        }
      }
    });

  let scanWifiSetting = new settingFactory.ScanWifiReq();
  // 向设备发送搜索wifi指令
  plugin.pushSetting({
    mac: mac,
    setting: scanWifiSetting
  }).then((value) => {
    console.info('发送指令获取wifi列表', value)
  }).catch(_ => {
    wx.showToast({ title: "设置失败，请重试", icon: "none", duration: 3000 });
  });

  // 选中某个wifi 并输入密码，然后向设备发送指令
  let deviceSetting = new settingFactory.ConnectWifiReq({ bssid: this.data.selectAp.bssid, password: this.data.password });
    let options = {
      mac: this.data.mac,
      setting: deviceSetting
    };
    pushSetting(options).then(res => {
      // 这里只能说明发送成功，具体是否成功则需要看dataReport.dataType === 'configStatus'的结果
    }).catch(_ => {
      wx.showToast({ title: "设置失败，请重试", icon: "none", duration: 3000 });
    });

```
### 4.1 扫描wifi
小程序向体脂秤发起开始扫描指令，体脂秤自动发现附近可用并兼容的Wifi信息，然后回调给小程序。调用参考 [4](#4 蓝牙配网) 中的调用示例.
数据类型 `ScanWifiReq` 没有参数

### 4.2 wifi数据
`ApInfo`的数据结构

| 属性            |  类型   | 说明                                                    |
| :-------------  | :---:  | :--------------------------------------------------------- |
| cmd             |   number | 指令，内部使用                                        |
| ssid         |   String | wifi名称                                              |
| bssid         |   String | wifi设备的mac                                         |
| mode         |   String |  Open (0), WEP (1), WPA_PSK (2), WPA2_PSK (3), WPA_WPA_2_PSK(4), WPA2_ENTERPRISE (5).  |
| rssi         |   String | 信号强度                                              |
| connected         |   String | 是否连接                                          |
| dataType         |   String | 数据类型 这里固定为 `apInfo`                         |

### 4.3 配置wifi
App发送Wifi SSID和密码到设备， 设备自动进行Wifi的连接过程， 并将连接结果回调给APP
数据类型 `ConnectWifiReq` 参数如下:

| 属性            |  类型  | 说明                                                    |
| :-------------  | :---:  | :--------------------------------------------------------- |
| bssid             |   String | 设备的mac                                        |
| password         |   String | 输入的密码                                          |

### 4.4 WifiInfo的数据结构
这个数据是获取当前的配网信息的信息结果（获取配网信息目前没有暴露接口）

| 属性            |  类型  | 说明                                                    |
| :-------------  | :---:  | :--------------------------------------------------------- |
| cmd             |   number | 指令，内部使用                                        |
| ssid            |   String | wifi名称                                              |
| bssid           |   String | wifi设备的mac                                         |
| status         |   number | return success (0) or failed reason code (1)       |
| rssi           |   number | 信号强度                                              |
| ip             |   String | ip地址                                                |
| dataType       |   String | 固定值为 `wifiInfo`                                |

### 4.5 ConfigStatus的数据结构
这个是连接wifi的结果的数据结果

| 属性            |  类型  | 说明                                                    |
|:-------------  |:---:|:--------------------------------------------------------- |
| cmd             |   number | 指令，内部使用                                        |
| status            |   number |  eturn success (0) or failed reason code (1)        |
| dataType       |   String | 固定值为 `configStatus`                              |

## 5 数据接收
当你监听了dataReport 事件的时候的回调
下表为数据类型和实例对照表

| 类名             |  dataType  | 说明                                                    |
| :-------------  |:---:|:--------------------------------------------------------- |
| ApInfo          |   apInfo |  wifi 列表数据    参考 [4.2](#4.2 wifi数据)                              |
| ConfigStatus    |   configStatus | 配置wifi的结果  参考 [4.5](#4.5 ConfigStatus的数据结构)                            |
| ScaleData       |   scale | 体重数据       参考 [5.1](#5.1 体重数据结构ScaleData)                                         |
| BPData     |   bloodpressure | 血压数据          参考 [5.2](#5.2 血压数据结构BPData)                            |
| WifiInfo        |   wifiInfo | 当前蓝牙设备配对的wifi   参考 [4.4](#4.4 WifiInfo的数据结构)                     |

### 5.1 体重数据结构ScaleData
| 属性            |  类型  | 说明                                                    |
| :-------------  | :---:  | :--------------------------------------------------------- |
| remainCount     |   number | 剩余测量数据条数                                        |
| unit            |   number | 0=kg,1=lb,2=st,3=斤                                              |
| weight           |   number | 体重 (单位kg)                                |
| utc            |   number  |    utc                                 |
| resistance    |   number | 电阻值                                           |
| userNumber    |   number | 用户编号                                                |
| timeZone      |   number | 时区 （缺失，使用当前系统的时区）                                           |
| timeStamp     |   number | 测量时间 （请使用utc）                                              |
| realtimeDataStatus  |   boolean | 实时测量数据状态                                                |
| heartRate  |   number | 心率                                               |
| dataType       |   String | 固定值为 `scale`                                |

### 5.2 血压数据结构BPData
| 属性            |  类型  | 说明                                                    |
| :-------------  | :---:  | :--------------------------------------------------------- |
| remainCount     |   number | 剩余测量数据条数                                        |
| unit            |   number | 0=mmkg,1=Kpa (kpa目前没有使用)                                           |
| systolic        |   number | 高压                               |
| diastolic       |   number | 低压                              |
| meanPressure       |   number | 平均值                              |
| pulseRate       |   number | 心率                              |
| utc            |   number  |    utc                                 |
| resistance    |   number | 电阻值                                           |
| userId    |   number | 用户编号                                                |
| timeZone      |   number | 时区 （缺失，使用当前系统的时区）                                           |
| timeStamp     |   number | 测量时间 （请使用utc）                                              |
| bodyMovementDetection  |   boolean | 体动数据                                                |
| cuffFitDetection  |   boolean | 袖带检测数据                                                |
| irregularPulseDetection  |   boolean | 心率不齐信息                                               |
| pulseOut  |   boolean | 心率超量程                                               |
| dataType       |   String | 固定值为 `bloodpressure`                                |


