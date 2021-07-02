const plugin = requirePlugin('lzbluetooth-plugin')

// import plugin from 'plugin'
// const plugin = require('./plugin');

export const AdaptorStateEventName = 'adaptorState';        // 蓝牙开关的回调
export const ConnectionStateEventName = 'connectionState';  // 监听设备的时候设备的回调
export const DataReportEventName = 'dataReport';            // 设备数据的回调

export const BINDSTATE_InputRandomNumber = 0;           // 输入随机数 (A5)
export const BINDSTATE_Successful = 4;                  // 绑定成功
export const BINDSTATE_Failure = 5;                     // 绑定失败
export const BINDSTATE_AuthorizeFailure = 6;            // 鉴权失败
export const BINDSTATE_InputRandomNumberError = 7;      // 输入随机码错误 (报这个错误是可以继续输入正确的随机码)

export const CONNECTSTATE_None = 0;         //初始状态
export const CONNECTSTATE_Scan = 1;         //搜索中
export const CONNECTSTATE_Connecting = 2;   //连接中
export const CONNECTSTATE_Connected = 3;    //蓝牙连接成功，还没有启动数据同步
export const CONNECTSTATE_Syncing = 4;      //已经启动数据同步，这是才能进行收数据，推送设置项等
export const CONNECTSTATE_Disconnected = 5; //设备主动断开了连接，或者系统断开了连接
export const CONNECTSTATE_SyncError = 6;    //发起启动数据同步出现未知异常，和被动设备断开Disconnected区分
export const CONNECTSTATE_StopDataSync = 7; //业务层主动停止了同步。

/**
 * 初始化
 */
export function init() {
  let version = plugin.getVersion();
  console.log('version', version);

  plugin.init({
    appId: "com.leshiguang.saas.rbac.demo.appid",
    logger: null,
  });

  /**
   * AdaptorState = 'adaptorState',//蓝牙状态改变回调
   * ConnectionState = 'connectionState',//连接状态改变回调
   * DataReport = 'dataReport', // 数据接收回调
   */
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
}

/**
 * 扫描设备
 */
export function startScanning(options) {
  plugin.startScanning(options);
}

/**
 * 结束扫描
 */
export function stopScanning() {
  plugin.stopScanning();
}

/**
 * 绑定设备
 * @param { mac, callback } options 
 */
export function bindDevice(options) {
  plugin.bindDevice(options);
}

export function cancelBind(options) {
  plugin.cancelBind(options);
}

/**
 * 向设备发送数据
 * @param { mac, setting } options
 */
export function pushSetting(options) {
  return plugin.pushSetting(options);
}

/**
 * 添加监听设备 可以是数组
 * @param { mac, model } device
 */
export function addMonitorDevice(device) {
  plugin.addMonitorDevice(device);
}

/**
 * 设置所有的监听的设备,相对于 addMonitor 这个是替换 可以是数组
 * @param { mac, model} devices
 */
export function setMonitorDevice(devices) {
  plugin.setMonitorDevice(devices)
}

/**
 * 删除监听的设备
 * @param {*} device 
 */
export function deleteMonitorDevice(device) {
  plugin.deleteMonitorDevice(device);
}

/**
 * 删除所有的监听的设备
 */
export function deleteAllMonitorDevice() {
  plugin.deleteAllMonitorDevice();
}

/**
 * 设备的连接情况
 * @param { mac } options 
 * @returns 根据设备信息得到设备设备的连接情况
 */
export function getConnectionState(options) {
  return plugin.getConnectionState(options);
}

/**
 * 判断蓝牙是否可用
 * @returns boolean 蓝牙是否可用
 */
export function isBluetoothAvailable() {
  return plugin.isBluetoothAvailable();
}

/**
 * 增加监听事件
 * @param string eventName 事件名称
 * @param string eventKey 监听者的标识，去除监听的时候需要使用到这个unikey 找到监听者
 * @param {*} callback 回调
 */
export function addListener(eventName, eventKey, callback) {
  plugin.$on({
    eventName,
    eventKey,
    callback
  });
}

/**
 * 删除监听事件
 * @param string eventName 
 * @param string eventKey 标识，同一标识的监听会被覆盖
 */
export function removeListener(eventName, eventKey) {
  plugin.$off({
    eventName,
    eventKey
  })
}

/** 获取setting对象 */
export const settingFactory = plugin.settingFactory;

export function connectStateMsg(connectState) {
  let msg = '';
  switch (connectState) {
    case CONNECTSTATE_None:
      msg = "初始状态";
      break;
    case CONNECTSTATE_Scan:
      msg = "搜索中";
      break;
    case CONNECTSTATE_Connecting:
      msg = "连接中";
      break;
    case CONNECTSTATE_Connected:
      msg = "已连接";
      break;
    case CONNECTSTATE_Syncing:
      msg = "同步中";
      break;
    case CONNECTSTATE_Disconnected:
      msg = "设备断开连接";
      break;
    case CONNECTSTATE_SyncError:
      msg = "同步数据出错";
      break;
    case CONNECTSTATE_StopDataSync:
      msg = "主动停止同步数据";
      break;
  }
  return msg;
}

export function bindStateMsg(bindState) {
  let statusMsg = "";
  switch (bindState) {
    case BINDSTATE_InputRandomNumber:
      statusMsg = "请输入随机码";
      break;
    case BINDSTATE_Failure:
      statusMsg = "绑定失败";
      break;
    case BINDSTATE_AuthorizeFailure:
      statusMsg = "鉴权失败";
      break;
    case BINDSTATE_InputRandomNumberError:
      statusMsg = "输入验证码错误"
      break;
    case BINDSTATE_Successful:
      statusMsg = "绑定成功";
      break;
  }

  return statusMsg;
} 

// mark test
function onAdaptorState(available) {
  console.warn('app', "onAdaptorState", available);
}

function onConnectionState(mac, connectState) {
  console.warn('app', 'onConnectionState', mac, connectState);
}

function onDataReport(device, dataReport) {
  console.warn('app', 'onDataReport', device, dataReport);
}