# 乐心蓝牙设备小程序插件接入指南

## 版本更新日志

#### 1.0.11
  * 优化绑定连接接口，绑定连接时增加判断微信 locationEnabled, locationAuthorized 权限是否开启，如果没有开启就直接报错

#### 1.0.10
  * 优化绑定接口，增加绑定失败时的错误码

#### 1.0.6
  * 支持更多设备型号
#### 1.0.5
  * 增加设备列表、设备绑定和设置项等UI模块
#### 1.0.4
  * 优化连接
  * 增加连接失败的状态
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
      onBluetoothDeviceFound: privateOnBluetoothDeviceFound,              
      onBLECharacteristicValueChange: privateOnBLECharacteristicValueChange,
      onBLEConnectionStateChange: privateOnBLEConnectionStateChange,
      onBluetoothAdapterStateChange: privateOnBluetoothAdapterStateChange,
    });
```
请求参数：
| 属性                           |  类型   | 是否必要 | 说明                                                                                                                  |
| :----------------------------- | :-----: | :------: | :-------------------------------------------------------------------------------------------------------------------- |
| appId                          | string  |    是    | 搜索到的设备对象的回调                                                                                                |
| logger                         |   obj   |    否    | 日志打印器，需要实现console的一些打印的方法，                                                                         |
| onBluetoothDeviceFound         |  func   |    否    | 微信发现设备的回调方法，默认使用wx.onBluetoothDeviceFound，如果该方法在其他地方有使用，则需要你自己去避免冲突         |
| onBLECharacteristicValueChange |  func   |    否    | 微信设备特征之的回调， 默认使用wx.onBLECharacteristicValueChange， 如果该方法在其他地方有使用，则需要你自己去避免冲突 |
| onBLEConnectionStateChange     |  func   |    否    | 微信连接回调，默认使用wx.onBLEConnectionStateChange，如果该方法在其他地方有使用，则需要你自己去避免冲突               |
| onBluetoothAdapterStateChange  |  func   |    否    | 微信蓝牙开关回调，默认使用wx.onBluetoothAdapterStateChange，如果该方法在其他地方有使用，则需要你自己去避免冲突        |
| appKey                         | string  |    否    | 与appId一致，只有在使用UI的时候需要                                                                                   |
| tenantName                     | string  |    否    | 租户名称，只有在使用UI的时候需要                                                                                      |
| tenantId                       | number  |    否    | 租户id，只有在使用UI的时候需要                                                                                        |
| subscriptionId                 | number  |    否    | 订阅id，只有在使用UI的时候需要                                                                                        |
| associatedId                   | string  |    否    | 第三方关联userId，只有在使用UI的时候需要                                                                              |
| debug                          | boolean |    否    | 订打开H5的vconsole，只有在使用UI的时候需要                                                                            |
| env                            | string  |    否    | 接口环境：beta测试，online生产，只有在使用UI的时候需要                                                                |

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

| 属性             | 类型  | 说明                   |
| :--------------- | :---: | :--------------------- |
| callback(device) | func  | 搜索到的设备对象的回调 |


`device` 的数据结构

| 属性            |      类型       | 说明                                                   |
| :-------------- | :-------------: | :----------------------------------------------------- |
| name            |     String      | 蓝牙设备名称，某些设备可能没有                         |
| localName       |     String      | 设当前蓝牙设备的广播数据段中的 LocalName 数据段        |
| deviceId        |     string      | 用于区分设备的id，安卓为mac地址，IOS为系统分配的唯一ID |
| RSSI            |     number      | 当前蓝牙设备的信号强度                                 |
| serviceData     |     object      | 当前蓝牙设备的广播数据段中的 ServiceData 数据段        |
| mac             |     String      | 设备mac地址                                            |
| battery         |     number      | 电量                                                   |
| lzDeviceId      |     string      | 乐心id，只有乐心的设备才有                             |
| manufacture     |     string      | 厂商                                                   |
| model           |     string      | 型号                                                   |
| softwareVersion |     string      | 软件版本                                               |
| hardwareVersion |     string      | 硬件版本                                               |
| firmwareVersion |     string      | 固件版本                                               |
| protoName       |     string      | 协议名称                                               |
| sn              |     string      | sn                                                     |
| connectStatus   | ConnectionState | 连接状态                                               |




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
  // 如果是安卓设备，则需要判断位置是否可用，位置权限是否可用 let { locationEnabled, locationAuthorized } = wx.getSystemInfoSync();
  plugin.bindDevice({
    mac: mac,   
    callback: res => {
      // 绑定结果 
      let mac = res.mac;
      let bindState = res.bindState;
      /// 只有在绑定错误的时候才有错误码
      let errorCode = res.errorCode;

    }
  });  
```
请求参数：`Object object`

| 属性            |  类型  | 说明           |
| :-------------- | :----: | :------------- |
| mac             | String | 绑定设备的mac  |
| callback(`res`) |  func  | 绑定设备的回调 |

`res` 的数据结构

| 属性       |  类型  | 说明             |
| :--------- | :----: | :--------------- |
| mac        | String | 绑定设备的mac    |
| bindState  | number | 绑定设备的状态   |
| deviceInfo | Object | 设备信息         |
| errorCode  | number | 绑定失败的错误码 |


`res.bindState` 的可能值

| 枚举              |  值   | 说明                  |
| :---------------- | :---: | :-------------------- |
| InputRandomNumber |   0   | 输入随机数 (手环专用) |
| Successful        |   4   | 绑定成功              |
| Failure           |   5   | 绑定失败              |

`res.errorCode` 的可能值

| 枚举             |  值   | 说明         |
| :--------------- | :---: | :----------- |
| success          |   0   | 成功         |
| disconnect       |   1   | 未连接       |
| nocharactor      |   2   | 没有特征服务 |
| timeout          |   3   | 超时         |
| discard          |   4   | 丢弃         |
| ackError         |   5   | ack错误      |
| bluetoothError   |   6   | 蓝牙错误     |
| workBusy         |   7   | 工作繁忙     |
| fileUnsupported  |   8   | 文件错误     |
| lowBattery       |   9   | 低电量       |
| unsupported      |  10   | 不支持的类型 |
| authorizeError   |  11   | 授权失败     |
| notfind          |  12   | 未找到设备   |
| cancelBind       |  13   | 取消绑定     |
| alreadyBinded    |  14   | 用户已绑定   |
| paramsError      |  15   | 参数错误     |
| noMem            |  16   | 没有内存     |
| tooBig           |  17   | 文件太大     |
| notInit          |  18   | 没有初始化   |
| notFind          |  19   | 未找到设备   |
| notUserLocation  |  20   | 定位权限未开 |
| blueNotAvailible |  21   | 蓝牙授权未开 |

`res.deviceInfo`的数据结构

| 属性            |  类型  | 说明                               |
| :-------------- | :----: | :--------------------------------- |
| deviceId        | String | 设备的广播id                       |
| model           | string | 设备的型号                         |
| lzDeviceId      | string | id（内部使用的id）                 |
| sn              | string | 一般对用户可见（比如手环在表带上） |
| hardwareVersion | string | 硬件版本                           |
| firmwareVersion | string | 固件版本                           |
| softwareVersion | string | 软件版本                           |
| manufacture     | string | 厂家名字                           |
| battery         | number | 电量                               |


### 2.4 取消绑定
当前状态是正在绑定的页面，此时退出绑定页面，则需要需要绑定 调用示例：
```javascript
// 取消绑定
plugin.cancelBind({ mac });
```
请求参数：`Object object`

| 属性 |  类型  | 说明      |
| :--- | :----: | :-------- |
| mac  | String | 设备的mac |

### 2.5 添加用户已经绑定的设备
用户打开app时， 若之前已经绑定过设备， 需要将已经绑定的设备的mac地址添加到sdk，
sdk会自动连接设备，建议您将用户和设备的绑定关系持久化在云端， sdk初始化成功之后立即添加mac地址到sdk， 调用示例：
```javascript
  /// 添加监听
  // 如果是安卓设备，则需要判断位置是否可用，位置权限是否可用 let { locationEnabled, locationAuthorized } = wx.getSystemInfoSync();
  
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

| 属性  |  类型  | 说明          |
| :---- | :----: | :------------ |
| mac   | String | 绑定设备的mac |
| model | String | 设备型号      |


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

| 属性 |  类型  | 说明      |
| :--- | :----: | :-------- |
| mac  | String | 设备的mac |

返回值：`number state`

| 枚举         |  值   | 说明                                               |
| :----------- | :---: | :------------------------------------------------- |
| None         |   0   | 初始状态                                           |
| Scan         |   1   | 扫描中                                             |
| Connecting   |   2   | 连接中                                             |
| Connected    |   3   | 蓝牙连接成功，还没有启动数据同步                   |
| Worked       |   4   | 已经启动数据同步，这是才能进行收数据，推送设置项等 |
| Disconnected |   5   | 设备主动断开了连接，或者系统断开了连接             |

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
小程序向设备获取设置项都是通过`getSetting`
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
  }).catch(resp => {
    wx.showToast({ title: "设置失败，请重试", icon: "none", duration: 3000 });
  });

  // 获取设置项
  plugin.getSetting({
    mac: mac,
    settingType: settingType
  }).then(resp => {
      console.warn('获取设置项成功', resp);
  }).catch(resp => {
      wx.showToast({ title: "获取设置失败，请重试", icon: "none", duration: 1000 });
  });


```
设置项请求参数：`Object object`

| 属性    |  类型  | 说明                                                                                     |
| :------ | :----: | :--------------------------------------------------------------------------------------- |
| mac     | String | 设备的mac                                                                                |
| setting | Object | 设置的对象，这个由 `settingFactory` 产生，不同的设置项，参数也不一样，具体参考各个设置项 |

获取设置项请求参数：
| 属性        |  类型  | 说明              |
| :---------- | :----: | :---------------- |
| mac         | String | 设备的mac         |
| settingType | number | 这个是个枚举 参考 |

`settingType` 的取值
| 枚举                     |  值   | 说明             |
| :----------------------- | :---: | :--------------- |
| HeartRateWarningSetting  |   0   | 心率设置         |
| SleepBloodOxygenSetting  |   1   | 睡眠血氧检测开关 |
| SedentaryReminderSetting |   2   | 久坐提醒         |
| SleepReminderSetting     |   3   | 睡眠提醒         |
| EventReminderSetting     |   4   | 闹钟             |
| TimeFormatSetting        |   5   | 24小时制         |
| DialTypeSetting          |   6   | 表盘信息         |
| CustomPagesSetting       |   7   | 自定义界面       |
| NightModeSetting         |   8   | 夜间模式         |
| RightSwipDisplaySetting  |   9   | 快捷屏幕         |
| SportHrWarnigSetting     |  10   | 运动心率预警     |


catch的 `resp` 的数据结构

| 属性  |   类型   | 说明                   |
| :---- | :------: | :--------------------- |
| code  |  number  | 错误码  是个枚举，参考 |
| msg   | string？ | 错误说明               |
| extra |   any    | 格外的一些参数         |

`resp.code` 的枚举

| 枚举             |  值   | 说明         |
| :--------------- | :---: | :----------- |
| success          |   0   | 成功         |
| disconnect       |   1   | 未连接       |
| nocharactor      |   2   | 没有特征服务 |
| timeout          |   3   | 超时         |
| discard          |   4   | 丢弃         |
| ackError         |   5   | ack错误      |
| bluetoothError   |   6   | 蓝牙错误     |
| workBusy         |   7   | 工作繁忙     |
| fileUnsupported  |   8   | 文件错误     |
| lowBattery       |   9   | 低电量       |
| unsupported      |  10   | 不支持的类型 |
| authorizeError   |  11   | 授权失败     |
| notfind          |  12   | 未找到设备   |
| cancelBind       |  13   | 取消绑定     |
| alreadyBinded    |  14   | 用户已绑定   |
| paramsError      |  15   | 参数错误     |
| noMem            |  16   | 没有内存     |
| tooBig           |  17   | 文件太大     |
| notInit          |  18   | 没有初始化   |
| notFind          |  19   | 未找到设备   |
| notUserLocation  |  20   | 定位权限未开 |
| blueNotAvailible |  21   | 蓝牙授权未开 |

`settingFactory`的方法列表

| 方法名             | 类型  | 说明                                                |
| :----------------- | :---: | :-------------------------------------------------- |
| A6HeartRateSetting | func  | 体脂秤心率开关  参考 [5.1.1](#5.1.1 体脂秤心率开关) |
| A6UnitSetting      | func  | 体脂秤单位设置  参考 [5.1.2](#5.1.2 体脂秤单位设置) |
| ScanWifiReq        | func  | 扫描指令  参考 [5.2.1](#5.2.1 扫描wifi)             |
| ConnectWifiReq     | func  | 连接wifi指令  参考 [5.2.2](#5.2.2 wifi数据)         |


## 4 数据接收
当你监听了dataReport 事件的时候的回调， 一般通过dataType来判断数据是什么类型
下表为数据类型和实例对照表

| 类名         |   dataType    | 说明                                                         |
| :----------- | :-----------: | :----------------------------------------------------------- |
| ApInfo       |    apInfo     | wifi 列表数据    参考 [4.2](#4.2 wifi数据)                   |
| ConfigStatus | configStatus  | 配置wifi的结果  参考 [4.5](#4.5 ConfigStatus的数据结构)      |
| ScaleData    |     scale     | 体重数据       参考 [5.1](#5.1 体重数据结构ScaleData)        |
| BPData       | bloodpressure | 血压数据          参考 [5.2](#5.2 血压数据结构BPData)        |
| WifiInfo     |   wifiInfo    | 当前蓝牙设备配对的wifi   参考 [4.4](#4.4 WifiInfo的数据结构) |


## 5 体脂秤相关数据的发送与接收
### 5.1 体脂秤设置项
#### 5.1.1 体脂秤心率的开关
控制体脂秤测量心率的开关
`A6HeartRateSetting` 的参数

| 属性   |  类型   | 说明     |
| :----- | :-----: | :------- |
| enable | boolean | 开关心率 |

#### 5.1.2 体脂秤单位设置
控制体脂秤单位的显示
`A6UnitSetting` 的参数

| 属性 |  类型  | 说明                         |
| :--- | :----: | :--------------------------- |
| unit | number | 0表示kg 1和2 表示Lb  3表示斤 |

### 5.2 体脂秤蓝牙配网
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

#### 5.2.1 扫描wifi
小程序向体脂秤发起开始扫描指令，体脂秤自动发现附近可用并兼容的Wifi信息，然后回调给小程序。调用参考 [4](#4 蓝牙配网) 中的调用示例.
数据类型 `ScanWifiReq` 没有参数

#### 5.2.2 wifi数据
`ApInfo`的数据结构

| 属性      |  类型  | 说明                                                                                 |
| :-------- | :----: | :----------------------------------------------------------------------------------- |
| cmd       | number | 指令，内部使用                                                                       |
| ssid      | String | wifi名称                                                                             |
| bssid     | String | wifi设备的mac                                                                        |
| mode      | String | Open (0), WEP (1), WPA_PSK (2), WPA2_PSK (3), WPA_WPA_2_PSK(4), WPA2_ENTERPRISE (5). |
| rssi      | String | 信号强度                                                                             |
| connected | String | 是否连接                                                                             |
| dataType  | String | 数据类型 这里固定为 `apInfo`                                                         |

#### 5.2.3 配置wifi
App发送Wifi SSID和密码到设备， 设备自动进行Wifi的连接过程， 并将连接结果回调给APP
数据类型 `ConnectWifiReq` 参数如下:

| 属性     |  类型  | 说明       |
| :------- | :----: | :--------- |
| bssid    | String | 设备的mac  |
| password | String | 输入的密码 |

#### 5.2.4 WifiInfo的数据结构
这个数据是获取当前的配网信息的信息结果（获取配网信息目前没有暴露接口）

| 属性     |  类型  | 说明                                         |
| :------- | :----: | :------------------------------------------- |
| cmd      | number | 指令，内部使用                               |
| ssid     | String | wifi名称                                     |
| bssid    | String | wifi设备的mac                                |
| status   | number | return success (0) or failed reason code (1) |
| rssi     | number | 信号强度                                     |
| ip       | String | ip地址                                       |
| dataType | String | 固定值为 `wifiInfo`                          |

#### 5.2.5 ConfigStatus的数据结构
这个是连接wifi的结果的数据结果

| 属性     |  类型  | 说明                                        |
| :------- | :----: | :------------------------------------------ |
| cmd      | number | 指令，内部使用                              |
| status   | number | eturn success (0) or failed reason code (1) |
| dataType | String | 固定值为 `configStatus`                     |

### 5.3 体制秤数据 ScaleData
| 属性               |  类型   | 说明                              |
| :----------------- | :-----: | :-------------------------------- |
| remainCount        | number  | 剩余测量数据条数                  |
| unit               | number  | 0=kg,1=lb,2=st,3=斤               |
| weight             | number  | 体重 (单位kg)                     |
| utc                | number  | utc                               |
| resistance         | number  | 电阻值                            |
| userNumber         | number  | 用户编号                          |
| timeZone           | number  | 时区 （缺失，使用当前系统的时区） |
| timeStamp          | number  | 测量时间 （请使用utc）            |
| realtimeDataStatus | boolean | 实时测量数据状态                  |
| heartRate          | number  | 心率                              |
| dataType           | String  | 固定值为 `scale`                  |

## 6 血压计相关
### 6.1 血压数据结构BPData
| 属性                    |  类型   | 说明                              |
| :---------------------- | :-----: | :-------------------------------- |
| remainCount             | number  | 剩余测量数据条数                  |
| unit                    | number  | 0=mmkg,1=Kpa (kpa目前没有使用)    |
| systolic                | number  | 高压                              |
| diastolic               | number  | 低压                              |
| meanPressure            | number  | 平均值                            |
| pulseRate               | number  | 心率                              |
| utc                     | number  | utc                               |
| resistance              | number  | 电阻值                            |
| userId `                | number  | 用户编号                          |
| timeZone                | number  | 时区 （缺失，使用当前系统的时区） |
| timeStamp               | number  | 测量时间 （请使用utc）            |
| bodyMovementDetection   | boolean | 体动数据                          |
| cuffFitDetection        | boolean | 袖带检测数据                      |
| irregularPulseDetection | boolean | 心率不齐信息                      |
| pulseOut                | boolean | 心率超量程                        |
| dataType                | String  | 固定值为 `bloodpressure`          |

## 7 手环相关

### 7.1 通用枚举
#### 7.1.1 SportMode
 `SportMode` 的取值
| 枚举                        |  值   | 说明                   |
| :-------------------------- | :---: | :--------------------- |
| run                         |   1   | 跑步                   |
| walk                        |   2   | 健走                   |
| cycling                     |   3   | 骑行                   |
| swimming                    |   4   | 游泳                   |
| keepfit                     |   5   | 力量训练 （旧称 健身） |
| newRun                      |   6   | 新版跑步               |
| runInDoor                   |   7   | 室内跑（旧称 跑步机）  |
| elliptical                  |   8   | 椭圆机                 |
| aerobicworkout              |   9   | 有氧运动               |
| basketball                  | 0x0a  | 篮球                   |
| football                    | 0x0b  | 足球                   |
| badminton                   | 0x0c  | 羽毛球                 |
| volleyball                  | 0x0d  | 排球                   |
| tableTennis                 | 0x0e  | 乒乓球                 |
| yoga                        | 0x0f  | 瑜伽                   |
| game                        | 0x10  | 电竞                   |
| run12minutes                | 0x11  | 12分钟跑               |
| walk6Minutes                | 0x12  | 6分钟走                |
| gymDance                    | 0x13  | 健身舞                 |
| taiji                       | 0x14  | 太极拳                 |
| cricket                     | 0x15  | 板球                   |
| rowingMachine               | 0x16  | 划船机                 |
| spinning                    | 0x17  | 动感单车               |
| cyclingInDoor               | 0x18  | 室内骑行               |
| freeSport                   | 0x19  | 自由运动               |
| skippingRope                | 0x1b  | 跳绳                   |
| mountaineering              | 0x1c  | 登山                   |
| hockey                      | 0x1d  | 曲棍球                 |
| tennis                      | 0x1e  | 网球                   |
| hilt                        | 0x1f  | HILT                   |
| walkIndoor                  | 0x20  | 室内步行               |
| ridingHorse                 | 0x21  | 骑马                   |
| shuttlecock                 | 0x22  | 毽球                   |
| boxing                      | 0x23  | 拳击                   |
| suvs                        | 0x24  | 越野跑                 |
| ski                         | 0x25  | 滑雪                   |
| gymnastics                  | 0x26  | 体操                   |
| icehockey                   | 0x27  | 冰球                   |
| taekwondo                   | 0x28  | 跆拳道                 |
| walkingMachine              | 0x29  | 漫步机                 |
| onFoot                      | 0x2a  | 徒步                   |
| dance                       | 0x2b  | 跳舞                   |
| Athletics                   | 0x2c  | 田径                   |
| LumbarAbdomenTraining       | 0x2d  | 腰腹训练               |
| karate                      | 0x2e  | 空手道                 |
| overallRelaxation           | 0x2f  | 整体放松               |
| CrossTraining               | 0x30  | 交叉训练               |
| Pilates                     | 0x31  | 普拉提                 |
| crossMatch                  | 0x32  | 交叉配合               |
| FunctionalTraining          | 0x33  | 功能性训练             |
| PhysicalRraining            | 0x34  | 体能训练               |
| archery                     | 0x35  | 射箭                   |
| flexibility                 | 0x36  | 柔韧度                 |
| MixedAerobic                | 0x37  | 混合有氧               |
| LatinDance                  | 0x38  | 拉丁舞                 |
| streetDance                 | 0x39  | 街舞                   |
| freeSparring                | 0x3a  | 自由搏击               |
| ballet                      | 0x3b  | 芭蕾舞                 |
| AustralianRulesFootball     | 0x3c  | 澳式足球               |
| MartialArts                 | 0x3d  | 武术                   |
| stairs                      | 0x3e  | 爬楼                   |
| handball                    | 0x3f  | 手球                   |
| baseball                    | 0x40  | 棒球                   |
| bowlingBall                 | 0x41  | 保龄球                 |
| squash                      | 0x42  | 壁球                   |
| curling                     | 0x43  | 冰壶                   |
| Hunting                     | 0x44  | 打猎                   |
| snowboarding                | 0x45  | 单板滑雪               |
| LeisureSports               | 0x46  | 休闲运动               |
| AmericanFootball            | 0x47  | 美式橄榄球             |
| TheKrankcycle               | 0x48  | 手摇车                 |
| fishing                     | 0x49  | 钓鱼                   |
| frisbee                     | 0x4a  | 飞盘运动               |
| rugby                       | 0x4b  | 橄榄球                 |
| golf                        | 0x4c  | 高尔夫                 |
| strength                    | 0x4d  | 民族舞                 |
| AlpineSkiing                | 0x4e  | 高山滑雪               |
| SnowSports                  | 0x4f  | 雪上运动               |
| SoothingMeditationExercises | 0x50  | 舒缓冥想类运动         |
| CoreTraining                | 0x51  | 核心训练               |
| skating                     | 0x52  | 滑冰                   |
| FitnessGame                 | 0x53  | 健身游戏               |
| SettingUpExercise           | 0x54  | 健身操                 |
| groupCallisthenics          | 0x55  | 团体操                 |
| boxingCallisthenics         | 0x56  | 搏击操                 |
| lacrosse                    | 0x57  | 长曲棍球               |
| relaxedfoamedAxis           | 0x58  | 泡沫轴筋膜放松         |
| wrestling                   | 0x59  | 摔跤                   |
| fencing                     | 0x5a  | 击剑                   |
| softball                    | 0x5b  | 垒球                   |
| horizontalBar               | 0x5c  | 单杠                   |
| parallelBars                | 0x5d  | 双杠                   |
| rollerSkating               | 0x5e  | 轮滑                   |
| hulaHoop                    | 0x5f  | 呼啦圈                 |
| darts                       | 0x60  | 飞镖                   |
| peakBall                    | 0x61  | 匹克球                 |
| setUps                      | 0x62  | 仰卧起坐               |
| stepTraining                | 0x63  | 踏步训练               |
| swimmingInDoor              | 0x64  | 室内游泳               |


#### 7.1.2 SportSubMode
`SportSubMode` 的取值
| 枚举                 |  值   | 说明                  |
| :------------------- | :---: | :-------------------- |
| manual               |   0   | 手动进入              |
| automatic            |   1   | 自动识别              |
| trailrunHasGpsNotify |   2   | 轨迹跑，有gps确认通知 |
| trailrunNoGpsNotify  |   3   | 轨迹跑，无gps确认通知 |


### 7.2 手环设置
#### 7.2.1 有个特殊的设置项集合类 获取设置大部分是这个对象，这个对象包含多种设置项，它既是可设置的对象，也是可获取的对象，具体类型具体看对应的指令
`MultipleSetting` 的数据结构
| 属性     |   类型    | 说明         |
| :------- | :-------: | :----------- |
| settings | setting[] | 运动心率检测 |
| dataType |  string   | SettingInfos |

`setting` 的数据结构
| 属性  |  类型  | 说明                                                                  |
| :---- | :----: | :-------------------------------------------------------------------- |
| tag   | number | 不同的tag代表着不同的类型                                             |
| value | number | 如果只有一个参数的情况下，value生效，如果不是，则看具体的设置类型类型 |

实例
```javascript
// 快捷屏幕设置
let value = {
    tag: 0x04,
    value: 2   
  };
  settingInfo = new settingFactory.MultipleSetting([value])
```

#### 7.2.2 心率检测 
456支持获取
`HeartRateWarningSetting`的数据结构
| 属性             |  类型  | 说明         |
| :--------------- | :----: | :----------- |
| sportHrSetting   | object | 运动心率检测 |
| generalHrSetting | object | 常规心率检测 |

`sportHrSetting` 与 `generalHrSetting` 的数据结构
| 属性   |  类型   | 说明                |
| :----- | :-----: | :------------------ |
| max    | number  | 上限 超过这个会提醒 |
| min    | number  | 下限 低于这个会提醒 |
| enable | boolean | 是否开启            |

实例
```javascript
let generalHr = {
    max: 80,
    min: 50,
    enable: true,
  };
  let sportHr = {
    max: 120,
    min: 81,
    enable: true
  }
let setting = new settingFactory.HeartRateWarningSetting(sportHr, generalHr);
```
#### 7.2.3 快捷屏幕 仅456支持
456支持获取
这个使用到了一个设置项的积累类 可以参考 `MultipleSetting`
`setting` 的数据结构
| 属性  |  类型  | 说明         |
| :---- | :----: | :----------- |
| tag   | number | 0x04 固定值  |
| value | number | 参考屏幕枚举 |

实例
```javascript
  let value = {
    tag: 0x04,
    value: 2
  };
  settingInfo = new settingFactory.MultipleSetting([value])
```

#### 7.2.4 睡眠血氧开关 仅456支持
456支持获取
这个使用到了一个设置项的积累类 可以参考 `MultipleSetting`
`setting` 的数据结构
| 属性  |  类型  | 说明            |
| :---- | :----: | :-------------- |
| tag   | number | 0x20 固定值     |
| value | number | 1表示开 0表示关 |

实例
```javascript
  let sleepOximetryInfo = {
    tag: 0x20,
    value: 1,
  }
  settingInfo = new settingFactory.MultipleSetting([sleepOximetryInfo]);
```


#### 7.2.5 久坐提醒
456可支持获取
`SedentaryReminderSetting` 的数据结构
| 属性            |  类型   | 说明                                                                              |
| :-------------- | :-----: | :-------------------------------------------------------------------------------- |
| enable          | boolean | 是否开关                                                                          |
| startHour       | number  | 开始时间 小时                                                                     |
| startMinute     | number  | 开始时间 分钟                                                                     |
| endHour         | number  | 结束时间 小时                                                                     |
| endMinute       | number  | 结束时间 分钟                                                                     |
| frequency       | number  | 间隔多久时间 一般 60分钟 单位分钟                                                 |
| repeatTime      | number  | 第0位表示星期一的开关... 第6bit表示星期日的开关，全0表示不重复                    |
| vibrationType   | number  | 这个一般使用默认 0 0-always 1-interval 2-intervalS2L 3-intervalL2S 4-intervalLoop |
| vibrationTime   | number  | 提醒时长 一般默认5s                                                               |
| vibrationLevel1 | number  | 震动强度 456无效                                                                  |
| vibrationLevel2 | number  | 震动强度 456无效                                                                  |

实例
```javascript
/** 构建函数
  constructor(
        enable = true,
        startHour = 8,
        startMinute = 0,
        endHour = 18,
        endMinute = 0,
        frequency = 60,
        repeatTime = RepeatTime.all,
        vibrationType = VibrationType.always,
        vibrationTime = 5,
        vibrationLevel1 = 9,
        vibrationLevel2 = 9
    )
    */

  settingInfo = new settingFactory.SedentaryReminderSetting()
```
#### 7.2.6 睡眠提醒计划
支持获取，获取的有效值 只有开关与时间
只能支持一次设置一个
`NewEventRemindSetting` 的数据结构
| 属性   |    类型     | 说明     |
| :----- | :---------: | :------- |
| events | EventInfo[] | 是否开关 |

`EventInfo` 的数据结构
| 属性            |  类型   | 说明                                                                                      |
| :-------------- | :-----: | :---------------------------------------------------------------------------------------- |
| enable          | boolean | 是否开关                                                                                  |
| index           | number  | 1～10   暂时只使用1就行                                                                   |
| type            | number  | 1: 喝水  2: 加餐  3: 睡觉                                                                 |
| desc            | string  | 是否开关                                                                                  |
| hour            | number  | 开始时间 小时                                                                             |
| minute          | number  | 开始时间 分钟                                                                             |
| repeatTime      | number  | 第0位表示星期一的开关... 第6bit表示星期日的开关，全0表示不重复 456无效                    |
| vibrationType   | number  | 这个一般使用默认 0 0-always 1-interval 2-intervalS2L 3-intervalL2S 4-intervalLoop 456无效 |
| vibrationTime   | number  | 提醒时长 最大60s                                                                          |
| vibrationLevel1 | number  | 震动强度 456无效                                                                          |
| vibrationLevel2 | number  | 震动强度 456无效                                                                          |

实例
```javascript
  let event = {
    index: 1,
    type: 3,
    desc: "",
    enable: true,
    hour: 23,
    minute: 0,
    repeatTime: 0b1111111,
    vibrationType: 0,
    vibrationTime: 5,
    vibrationLevel1: 9,
    vibrationLevel2: 9,
  }
  settingInfo = new settingFactory.NewEventRemindSetting([event]);
```
#### 7.2.7 事件提醒（闹钟）
支持获取
只能支持一次设置一个
`EventReminderSetting` 的数据结构
| 属性   |    类型     | 说明     |
| :----- | :---------: | :------- |
| events | EventInfo[] | 是否开关 |

`EventInfo` 的数据结构
| 属性                |  类型   | 说明                                                                                      |
| :------------------ | :-----: | :---------------------------------------------------------------------------------------- |
| enable              | boolean | 是否开关                                                                                  |
| index               | number  | 1～10   暂时只使用1就行   membo hr2只支持1～5                                             |
| type                | number  | 1: 喝水  2: 加餐  3: 睡觉                                                                 |
| desc                | string  | 是否开关                                                                                  |
| hour                | number  | 开始时间 小时                                                                             |
| minute              | number  | 开始时间 分钟                                                                             |
| repeatTime          | number  | 第0位表示星期一的开关... 第6bit表示星期日的开关，全0表示不重复 456无效                    |
| vibrationType       | number  | 这个一般使用默认 0 0-always 1-interval 2-intervalS2L 3-intervalL2S 4-intervalLoop 456无效 |
| vibrationTime       | number  | 提醒时长 最大60s                                                                          |
| vibrationLevel1     | number  | 震动强度 456无效                                                                          |
| vibrationLevel2     | number  | 震动强度 456无效                                                                          |
| napEnable           | boolean | 小睡提醒开关 456手环才可能支持                                                            |
| lightSleepEnable    | number  | 浅睡提醒开关 456手环才可能支持 (又名智能唤醒)                                             |
| isDelete            | boolean | 是否删除闹钟，如果设为YES 则表示删除                                                      |
| napAlertTime        | number  | 小睡提醒时长 （分钟）                                                                     |
| lightSleepAlertTime | number  | 浅睡提醒时长 （分钟）                                                                     |

实例
```javascript
  let event = {
    napEnable: true,
    lightSleepEnable: true,
    index: 1,
    desc: `设置闹钟提醒发发发`,
    enable: true,
    isDelete: false,
    napAlertTime: 15,
    lightSleepAlertTime: 15,
    hour: 19,
    minute: 50,
    repeatTime: 1,
    vibrationType: 2,
    vibrationTime: 3,
    vibrationLevel1: 4,
    vibrationLevel2: 5,
  }

  settingInfo = new settingFactory.EventReminderSetting(Array(event));
```
#### 7.2.8 时间格式
`TimeFormatSetting` 的数据格式
| 属性       |  类型  | 说明                         |
| :--------- | :----: | :--------------------------- |
| timeFormat | number | 0表示24小时制  1表示12小时制 |

实例
```javascript
  // 0表示24小时制  1表示12小时制
  settingInfo = new settingFactory.TimeFormatSetting(0x01);
```
#### 7.2.9 表盘推送
456的表盘也不支持切换顺序 index 1、2、3、4表示本地表盘，5表示相册表盘，6与7表示云端表盘
`PushDialSetting`的数据结构
| 属性                |    类型     | 说明                                                                                   |
| :------------------ | :---------: | :------------------------------------------------------------------------------------- |
| dialIndex           |   number    | 0x01～0x07，表示推送表盘的位置，如果该位置非空，则表示替换，否则表示新增。             |
| id                  |   string    | 标识符                                                                                 |
| dailType            |   number    | 表盘类型 0: 在线表盘 1: 相册表盘 2: 本地表盘 255：无表盘                               |
| fileName            |   string    | 文件名 所占用的byte数最大32字节                                                        |
| backgroundImageName |   string    | 背景图名称长度 最大32字节                                                              |
| styleId             |   number    | 样式id，用来描述表盘元素的显示内容和显示方式目前相册表盘有2个固定样式 已经无效 直接填0 |
| colorId             |   number    | 颜色ID，用来秒速表盘上字体的颜色 已经无效直接填0                                       |
| fileBuf             | ArrayBuffer | 文件内容                                                                               |
| onUpgradeProcess    |    func     | 传送文件的进度                                                                         |
| onUpgradeComplete   |    func     | 结果回调                                                                               |

实例
```javascript
  /** 构建函数
  constructor(
        dialIndex: number,
        id: string = "",
        dialType: number = 2,
        fileName: string = "",
        backgroundImageName: string = "",
        styleId: number = 0,
        colorId: number = 0,
        fileBuf: ArrayBuffer = new ArrayBuffer(0),
        onUpgradeProcess?: (process: number) => void,
        onUpgradeComplete?: (code: number, msg: string) => void)
        */

  // 相册表盘
  setting = new settingFactory.PushDialSetting(dailIndex, id, 1, "test", "test", 0, 0, buf);

  // 云端表盘
  setting = new settingFactory.PushDialSetting(dailIndex, id, 0, "test", "test", 0, 0, buf);
```

#### 7.2.10 表盘选择
表盘位置上必须有表盘表盘选择才能成功
`DialEnableSetting` 的数据结构
| 属性       |   类型   | 说明                       |
| :--------- | :------: | :------------------------- |
| dailIndex  |  number  | 0x01～0x07，表示表盘的位置 |
| dailNoList | number[] | 表盘的排序        456无效  |

实例
```javascript
  let setting = new settingFactory.DialEnableSetting(dialIndex, [1, 2, 3, 4, 5, 6, 7]);
```

#### 7.2.11 表盘删除
这个使用到了一个设置项的积累类 可以参考 `MultipleSetting`
`setting` 的数据结构
| 属性 |    类型    | 说明                                                                                  |
| :--- | :--------: | :------------------------------------------------------------------------------------ |
| tag  |   number   | 0x34 固定值                                                                           |
| list | DialInfo[] | 删除表盘的列表，目前只支持一个一个的删除，456只支持删除相册表盘与云端表盘， 即5、6、7 |

`DialInfo` 的数据结构
| 属性     |  类型   | 说明                                         |
| :------- | :-----: | :------------------------------------------- |
| index    | number  | 0x01～0x07，表示表盘的位置                   |
| dialType | numnber | 表盘类型 0: 在线表盘 1: 相册表盘 2: 本地表盘 |

实例
```javascript
  let setting = new settingFactory.MultipleSetting([{ tag: 0x34, list: [{ index: 7, dailType: 0 }] }]);
```

#### 7.2.12 目标设置 
`EncourageTargetSetting` 的数据结构
| 属性       |  类型  | 说明                                                                                                                                   |
| :--------- | :----: | :------------------------------------------------------------------------------------------------------------------------------------- |
| enable     | number | 开关                                                                                                                                   |
| targetType | number | // 步数 step = 1, 卡路里 calories = 2, distance = 3,/// 深睡眠 deepSleep = 4, /// 站立时长 standingTime = 5, /// 运动时长sportTime = 6 |
| value      | number | 步数 卡路里 单位：kcal 距离 单位：m 深睡眠 站立时长 单位：小时 运动时长 单位：分钟                                                     |

实例
```javascript
  settingInfo = new settingFactory.EncourageTargetSetting(true, 6, 10);
```

#### 7.2.13 天气设置 
`WeatherSetting` 的数据结构
| 属性       |   类型    | 说明                          |
| :--------- | :-------: | :---------------------------- |
| updateTime |  number   | 天气更新时间戳                |
| weathers   | Weather[] | 今天，明天，后天...的天气信息 |

`Weather` 的数据结构
| 属性           |  类型  | 说明         |
| :------------- | :----: | :----------- |
| weatherCode    | number | 天气气象代码 |
| minTemperature | number | 最低气温     |
| maxTemperature | number | 最高气温     |
| aqi            | number | 空气质量     |

实例
```javascript
let weather = {
    weatherCode: 22,
    minTemperature: 10,
    maxTemperature: 20,
    aqi: 10,
  }
  settingInfo = new settingFactory.WeatherSetting(166666666, [weather]);
```

#### 7.2.14 新天气设置 456 支持
`NewWeatherSetting` 的数据结构
| 属性     |   类型    | 说明                          |
| :------- | :-------: | :---------------------------- |
| utc      |  number   | 天气更新时间戳                |
| weathers | Weather[] | 今天，明天，后天...的天气信息 |
| cityName |  string   | 城市名                        |

`Weather` 的数据结构
| 属性               |  类型  | 说明         |
| :----------------- | :----: | :----------- |
| weatherCode        | number | 天气气象代码 |
| minTemperature     | number | 最低气温     |
| maxTemperature     | number | 最高气温     |
| currentTemperature | number | 当前温度     |
| windSpeed          | number | 风速         |
| humidity           | number | 相对湿度     |
| uvIndex            | number | uv指数       |
| aqi                | number | 空气质量     |
| sunriseHour        | number | 日出时间     |
| sunriseMinute      | number | 日出时间     |
| sunsetHour         | number | 日落时间     |
| sunsetMinute       | number | 日落时间     |

实例
```javascript
//0x00 晴(白天);
//0x01 晴(夜晚);
//0x02 多云;
//0x03 晴间多云(白天);
//0x04 晴间多云(夜晚);
//0x05 大部多云(白天);
//0x06 大部多云(夜晚);
//0x07 阴;
//0x08 阵雨;
//0x09 雷阵雨;
//0x0A 冰雹或雷阵雨伴有冰雹;
//0x0B 小雨;
//0x0C 中雨;
//0x0D 大雨;
//0x0E 暴雨;
//0x0F 大暴雨;
//0x10 特大暴雨;
//0x11 冻雨;
//0x12 雨夹雪;
//0x13 阵雪;
//0x14 小雪;
//0x15 中雪;
//0x16 大雪;
//0x17 暴雪;
//0x18 浮尘;
//0x19 扬沙;
//0x1A 沙尘暴;
//0x1B 强沙尘暴;
//0x1C 雾;
//0x1D 霾;
//0x1E 风;
//0x1F 大风;
//0x20 飓风;
//0x21 热带风暴;
//0x22 龙卷风;
  let weather = {
    weatherCode: 22,
    minTemperature: 10,
    maxTemperature: 20,
    currentTemperature: 5,
    windSpeed: 10,
    humidity: 11,
    uvIndex: 11,
    aqi: 10,
    sunriseHour: 6,
    sunriseMinute: 0,
    sunsetHour: 18,
    sunsetMinute: 9,
  }
  settingInfo = new settingFactory.NewWeatherSetting(166666666, [weather]);
```

#### 7.2.14 旧的表盘设置
`DialTypeSetting` 的数据结构
| 属性     |  类型  | 说明          |
| :------- | :----: | :------------ |
| dialType | number | 1～6 六种样式 |

实例
```javascript
  settingInfo = new settingFactory.DialTypeSetting(1);
```
#### 7.2.15 自定义一级屏幕设置
`CustomPagesSetting`
| 属性  |   类型   | 说明       |
| :---- | :------: | :--------- |
| pages | number[] | 屏幕的枚举 |

旧版的屏幕比如 memboHR2 LSBand5s LSBand 的取值
| 枚举              |  值   | 说明                  |
| :---------------- | :---: | :-------------------- |
| Time              | 0x00  | 时间                  |
| Step              | 0x01  | 步数                  |
| Calories          | 0x02  | 卡路里                |
| Distance          | 0x03  | 距离                  |
| HeartRate         | 0x04  | 心率                  |
| Running           | 0x05  | 跑步                  |
| Walking           | 0x06  | 健走                  |
| Cycling           | 0x07  | 骑行                  |
| Swimming          | 0x08  | 游泳                  |
| BodyBuilding      | 0x09  | 健身/力量训练         |
| Climbing          | 0x0A  | 登山                  |
| DailyData         | 0x0B  | 日常数据              |
| Stopwatch         | 0x0C  | 秒表                  |
| Weather           | 0x0D  | 天气                  |
| Battery           | 0x0E  | 电量                  |
| IndoorRunning     | 0x0F  | 跑步机运动            |
| Elliptical        | 0x10  | 椭圆机                |
| AerobicSport      | 0x11  | 有氧运动              |
| Basketball        | 0x12  | 篮球                  |
| Football          | 0x13  | 足球                  |
| Badminton         | 0x14  | 羽毛球                |
| Volleyball        | 0x15  | 排球                  |
| PingPong          | 0x16  | 乒乓球                |
| Yoga              | 0x17  | 瑜伽                  |
| Gaming            | 0x18  | 电竞                  |
| AerobicExercise12 | 0x19  | 有氧能力运动-12分钟跑 |
| AerobicExercise6  | 0x1A  | 有氧能力运动-6分钟走  |
| Alipay            | 0x1B  | 支付宝页面            |
| FitnessDance      | 0x1C  | 健身舞                |
| TaiChi            | 0x1D  | 太极                  |

456等屏幕的取值 
| 枚举          |  值   | 说明         |
| :------------ | :---: | :----------- |
| sport         |   0   | 运动         |
| bloodO2       |   1   | 血氧         |
| heartRate     |   2   | 心率         |
| sportReport   |   3   | 运动记录     |
| findPhone     |   4   | 找手机       |
| alarm         |   5   | 闹钟         |
| photo         |   6   | 拍照         |
| thinking      |   7   | 冥想（呼吸） |
| sleepReport   |   8   | 睡眠记录     |
| weather       |   9   | 天气         |
| stopwatch     |  10   | 秒表         |
| music         |  11   | 音乐         |
| countdown     |  12   | 倒计时       |
| setting       |  13   | 设置         |
| realmeLink    |  14   | LoT          |
| msg           |  15   | 消息         |
| tool          |  16   | 工具         |
| preasure      |  17   | 压力         |
| femaleHeathy  |  18   | 女性健康     |
| eventReminder |  19   | 事件提醒     |
| flashlight    |  20   | 手电筒       |
| todayOverview |  255  | 今日概览     |

### 7.3 手环接收的数据结构
#### 7.3.1 总结数据 DailyData
`DailyData`的数据结构
| 属性     |  类型   | 说明                               |
| :------- | :-----: | :--------------------------------- |
| list     | Daily[] | 数据列表                           |
| type     | number  | 数据类型(0：实时数据、1：小时数据) |
| dataType | String  | a5Daily  固定值                    |

`Daily` 的数据结构
| 属性             |  类型   | 说明                            |
| :--------------- | :-----: | :------------------------------ |
| isSilenceExist   | boolean | 静息心率是否存在                |
| step             | number  | 步数                            |
| utc              | number  | 测量时间                        |
| examount         | number  | 运动量                          |
| calories         | number  | 卡路里（千卡）                  |
| exerciseTime     | number  | 运动时间（460上为活动时长）分钟 |
| distance         | number  | 距离(米)                        |
| status           | number  | 电量、运动等级                  |
| batteryVoltage   | number  | 电量电压等级                    |
| silenceHeartRate | number  | 静息心率（可能不存在）          |

#### 7.3.2 心率数据 HeartRateData
`HeartRateData` 的数据结构
| 属性       |   类型   | 说明                                                                   |
| :--------- | :------: | :--------------------------------------------------------------------- |
| type       |  number  | 心率类型（0:一般心率、1:实时心率、2:运动心率, 3 当天常规心率明细上传） |
| sportMode  |  number  | 运动类型 参考 7.1.1                                                    |
| subMode    |  number  | 参考 7.1.2                                                             |
| utc        |  number  | 测量时长                                                               |
| reside     |  number  | 计步器中数据剩余条数 例如：547 表示设备中有547条数据未发送             |
| utcOffset  |  number  | 每笔值间隔 单位：s                                                     |
| heartRates | number[] | 心率列表，每笔间隔时间为 utcOffset                                     |
| status     |  number  | 实时心率才使用到 0、1:不支持该功能 2:未检测到心率 3:检测到心率         |
| dataType   |  string  | 固定值 a5HR                                                            |


#### 7.3.3 睡眠原始数据 SleepData
`SleepData` 的数据结构
| 属性      |   类型   | 说明                                                       |
| :-------- | :------: | :--------------------------------------------------------- |
| utc       |  number  | 测量时长                                                   |
| reside    |  number  | 计步器中数据剩余条数 例如：547 表示设备中有547条数据未发送 |
| utcOffset |  number  | 每笔值间隔 单位：s                                         |
| levelSet  | number[] | 睡眠原始数据列表，每笔间隔时间为 utcOffset                 |
| dataType  |  string  | 固定值 a5Sleep                                             |

#### 7.3.4 睡眠报告 SleepReportData 456支持
`SleepReportData` 的数据结构
| 属性                   |    类型     | 说明                                                           |
| :--------------------- | :---------: | :------------------------------------------------------------- |
| sleepUtc               |   number    | 睡眠时间 Bed time                                              |
| awakeUtc               |   number    | 醒来时间 Get-up time.                                          |
| durationOfAwake        |   number    | 清醒时长 （分钟）                                              |
| numberOfAwake          |   number    | 醒来次数                                                       |
| numberOfEyeMovement    |   number    | 眼动次数                                                       |
| timeOfLightSleep       |   number    | 浅睡时长 （分钟）                                              |
| timeOfDeepSleep        |   number    | 深睡时长 （分钟）                                              |
| characteristicsOfSleep |   number    | 睡眠特征个数                                                   |
| reside                 |   number    | 待上传睡眠报告个数                                             |
| offsetOfSleepReport    |   number    | 睡眠报告偏移                                                   |
| extFlag                |   number    | 扩展标志                                                       |
| totalOfSleepStruct     |   number    | 本次睡眠结构总数                                               |
| offsetOfSleepStruct    |   number    | 明细睡眠结构偏移                                               |
| breathScore            |   number    | 睡眠呼吸评分      暂不支持                                     |
| breathLevel            |   number    | 睡眠呼吸等级    暂不支持                                       |
| sleepScore             |   number    | 睡眠评分       暂不支持                                        |
| sleepList              | SleepInfo[] | 实时心率才使用到 0、1:不支持该功能 2:未检测到心率 3:检测到心率 |
| dataType               |   string    | 固定值 sleepReport                                             |

`SleepInfo` 的数据结构
| 属性     |  类型  | 说明                               |
| :------- | :----: | :--------------------------------- |
| startUtc | number | 开始时间                           |
| endUtc   | number | 结束utc                            |
| deep     | number | 4 : 眼动 1 : 清醒2 : 浅睡 3 : 深睡 |
| duration | number | 分钟                               |

#### 7.3.5 运动卡路里 SportCaloriesData
`SportCaloriesData` 的数据结构
| 属性      |   类型   | 说明                                                                   |
| :-------- | :------: | :--------------------------------------------------------------------- |
| isNew     |  number  | 心率类型（0:一般心率、1:实时心率、2:运动心率, 3 当天常规心率明细上传） |
| sportMode |  number  | 运动类型 参考 7.1.1                                                    |
| subMode   |  number  | 参考 7.1.2                                                             |
| utc       |  number  | 测量时长                                                               |
| reside    |  number  | 计步器中数据剩余条数 例如：547 表示设备中有547条数据未发送             |
| utcOffset |  number  | 每笔心率值间隔 单位：s                                                 |
| calories  | number[] | 卡路里列表，每笔间隔时间为 utcOffset                                   |
| dataType  |  string  | 固定值 a5SportCalories                                                 |

#### 7.3.6 运动记录 SportReportData
`SportReportData` 的数据结构
| 属性                |    类型     | 说明                                                      |
| :------------------ | :---------: | :-------------------------------------------------------- |
| sportMode           |   number    | 运动类型 参考 7.1.1                                       |
| subMode             |   number    | 参考 7.1.2                                                |
| suspendTimes        |   number    | 暂停次数 包括结束，所以默认就为1                          |
| start               |   number    | 开始时间                                                  |
| end                 |   number    | 结束时间                                                  |
| states              | TimeState[] | 时间中间暂停的状态                                        |
| sportTime           |   number    | 运动总时长 单位（秒）                                     |
| step                |   number    | 总步数，在游泳运动模式总步数代表 游泳圈数  laps           |
| calories            |   number    | 消耗卡路里 单位（Kcal）                                   |
| maxHr               |   number    | 最大心率 次/分                                            |
| avgHr               |   number    | 平均心率 次/分                                            |
| maxStepFreq         |   number    | 最大步频                                                  |
| avgStepFreq         |   number    | 平均步频                                                  |
| maxSpeed            |   number    | 最大速度 单位 Km/h                                        |
| avgSpeed            |   number    | 平均速度 单位 km/h                                        |
| distance            |   number    | 距离 单位 米                                              |
| avgStepOfFloating   |   number    | 平均步幅 （cm） 456新增                                   |
| avgPace             |   number    | 平均配速 单位 秒/公里 456 新增                            |
| infoOfTarget        |   number    | 运动目标达成情况， 0无目标，1目标达成，2目标未达成 不支持 |
| targetType          |   number    | 运动目标类型 不支持                                       |
| hrSection1TimeRatio |   number    | 占比 % 456 新增                                           |
| hrSection2TimeRatio |   number    | 占比 % 456 新增                                           |
| hrSection3TimeRatio |   number    | 占比 % 456 新增                                           |
| hrSection4TimeRatio |   number    | 占比 % 456 新增                                           |
| hrSection5TimeRatio |   number    | 占比 % 456 新增                                           |
| dataType            |   string    | 固定值 a5SportReport                                      |

`TimeState` 的数据结构
| 属性       |  类型  | 说明         |
| :--------- | :----: | :----------- |
| pauseUtc   | number | 暂停时间     |
| reStartUtc | number | 重新开始时间 |


#### 7.3.7 血氧数据与晨脉 BloodOxygenData 456支持
`BloodOxygenData` 的数据结构
| 属性     |       类型        | 说明                                                       |
| :------- | :---------------: | :--------------------------------------------------------- |
| reside   |      number       | 计步器中数据剩余条数 例如：547 表示设备中有547条数据未发送 |
| offset   |      number       | 每笔心率值间隔 单位：s                                     |
| list     | BloodOxygenInfo[] | 心率列表，每笔间隔时间为 utcOffset                         |
| dataType |      string       | 固定值 bloodOxygen                                         |

`BloodOxygenInfo` 的数据结构
| 属性             |  类型  | 说明                                  |
| :--------------- | :----: | :------------------------------------ |
| utc              | number | 测量时间                              |
| bloodOxygenValue | number | 血氧数据                              |
| heartRate        | number | 静息心率数据                          |
| state            | string | 0x00：普通血氧数据 0x01：异常血氧数据 |

#### 7.3.8 运动状态 SportStatusData（发起运动） 
`SportStatusData` 的数据结构
| 属性        |  类型  | 说明                                                                                                                                                                   |
| :---------- | :----: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| function    | number | 心率类型（0:一般心率、1:实时心率、2:运动心率, 3 当天常规心率明细上传）                                                                                                 |
| sportStatus | number | 当function为0x01时 0x00：开始（app需开启GPS）0x01 : 开启GPS 0x02 : 运动开始（通知app手表已开启运动） 0x03 : 关闭GPS 当function为0x02时 x01：结束 0x03：暂停 0x04：重启 |
| sportMode   | number | 运动类型 参考 7.1.1                                                                                                                                                    |
| dataType    | string | 固定值 a5SportStatus                                                                                                                                                   |

#### 7.3.9 闹钟开关 AlarmClockSwitchData 456支持
`AlarmClockSwitchData` 的数据结构
| 属性     |  类型  | 说明                    |
| :------- | :----: | :---------------------- |
| index    | number | 闹钟序号                |
| enable   | number | 闹钟开关                |
| dataType | string | 固定值 AlarmClockSwitch |

#### 7.3.10 表盘变更数据 DailReportData 456支持
`DailReportData` 的数据结构
| 属性     |   类型   | 说明              |
| :------- | :------: | :---------------- |
| index    |  number  | 当前表盘号        |
| count    |  number  | 表盘个数          |
| list     | number[] | 表盘顺序          |
| dataType |  string  | 固定值 dailReport |

#### 7.3.11 表盘详情数据 DialDetailData 456 支持
`DialDetailData` 的数据结构
| 属性                |  类型  | 说明                                         |
| :------------------ | :----: | :------------------------------------------- |
| dialIndex           | number | 当前表盘号   0x01～0x07                      |
| id                  | number | 表盘唯一id 用ASCII表示 最大32字节            |
| dailType            | number | 表盘类型 0: 在线表盘 1: 相册表盘 2: 本地表盘 |
| fileName            | string | 文件名 所占用的byte数最大32字节              |
| backgroundImageName | string | 背景图名称长度 最大32字节                    |
## 8 跳绳相关
### 8.1 跳绳设置
### 8.2 跳绳

## 9.Device UI 接入
为了提高设备对接效率，降低对接成本，我们在原来的sdk接入的基础上，提供了更便利的的界面接入  

提供的界面有：
* 产品列表页
* 设备绑定页
* 我的设备列表页
* 设备详情页
* 设备配网页
* 设备升级页

### 9.1 插件声明
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

### 9.2 插件引入
```javascript
const lsPlugin = requirePlugin("lzbluetooth");
```

### 9.3 插件初始化页面
[申请乐心AppKey](https://docs.leshiguang.com/develop-native/apply)
```javascript
  lsPlugin.initUI({
    appKey: 'lx5fba3922fbdb9c76',
    appSecret: '6ae36b99b772cfc8d0e56a57ba76688337877b29',
    associatedId: '18679213307', // 第三方关联userId
    env: 'online' // 接口环境：beta测试，online生产
  });
```

### 9.4 设备页面功能介绍

设备界面功能介绍（按照绑定设备的页面流程顺序）

#### 9.4.1 产品列表页
* 产品列表可以选择需要绑定的设备
* 产品列表展示的设备需要由乐智工作人员进行配置
* 页面跳转
```javascript
wx.navigateTo({
    url: `plugin-private://wxe3d2a6ab8dd5b49b/pages/device/product/index`
})
```
* 页面预览
![image](https://files.lifesense.com/other/20210830/11aa67944e214c9a9f087b0166e0c3ae.jpg)

#### 9.4.2 设备绑定页
* 在产品列表页中选择设备，会根据设备的绑定类型（蓝牙/扫码/输入sn等方式）进行不同的跳转
* 扫码类型的设备则直接唤起二维码扫描，蓝牙设备会跳转到设备绑定页进行扫描设备
* 扫描到对应设备后可以点击绑定按钮进行设备绑定
* 页面跳转
```javascript
wx.navigateTo({
    url: `plugin-private://wxe3d2a6ab8dd5b49b/pages/device/bind/index`
})
```
* 页面预览
![image](https://files.lifesense.com/other/20210830/f7a8257470994e138cde25ccd0aba66f.jpg)

#### 9.4.3 我的列表页
* 设备绑定完成后，已绑定的设备会在我的列表页面展示
* 点击我的列表中的设备，可以跳转到对应设备的详情页
* 页面跳转
```javascript
wx.navigateTo({
    url: `plugin-private://wxe3d2a6ab8dd5b49b/pages/device/mylist/index`
})
```
* 页面预览
![image](https://files.lifesense.com/other/20210830/7617ad3bc28440a6af77f6e2a22ba849.jpg)


#### 9.4.4 设备详情页
* 设备详情展示设备的sn等信息，同时根据不同的设备所支持的功能提供删除设备、设备配网、设备升级等功能
* 设备配网目前只有特定型号血压计和特定型号体脂秤支持
* 设备升级目前只有特定型号体脂秤和特定型号手环支持
* 页面跳转（url上携带设备id参数）
```
wx.navigateTo({
    url: `plugin-private://wxe3d2a6ab8dd5b49b/pages/device/setting/index?deviceId=${device.id}`
})
```
* 页面预览（体脂秤S20为例）
![image](https://files.lifesense.com/other/20210830/109dccf5b0a0433eb95ba968893214bf.jpg)


#### 9.4.5 体脂秤配网
* 体脂秤配网是体脂秤的配网界面，通过手机让体脂秤和Wi-Fi建立关联，体脂秤的数据可以通过Wi-Fi发送到服务器
* 进行配网页面之前，设备必须要先建立蓝牙连接。点击开始配网会先拉取搜索到的Wi-Fi列表，点击需要设置的Wi-Fi输入Wi-Fi密码，则可进行Wi-Fi配网
* 配网结果会对应的展示出来
* 页面跳转（url上携带设备id参数）
```
wx.navigateTo({
    url: `plugin-private://wxe3d2a6ab8dd5b49b/pages/device/config/index?deviceId=${device.id}`
})
```
* 页面预览
![image](https://files.lifesense.com/other/20210830/5ea2f781eb6a4ebbb3e32fa7a7684b3c.jpg)

#### 9.4.6 设备升级（ota）
* 设备升级是指当云端的固件版本有更新，则会拉取云端最新的固件版本，将该固件版本信息更新到设备中
* 若云端没有最新版本，则会显示最新的固件版本号
* 页面跳转（url上携带设备id参数）
```
wx.navigateTo({
    url: `plugin-private://wxe3d2a6ab8dd5b49b/pages/device/ota/index?deviceId=${device.id}`
})
```
* 页面预览
![image](https://files.lifesense.com/other/20210830/4b75d04f4a30427f9975ce18c7043acb.jpg)
