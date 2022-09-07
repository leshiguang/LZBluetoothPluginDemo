const plugin = require("sg-ble");
const scale = require("sg-scale");
const bloodpressure = require("sg-bloodpressure");
const skip = require("sg-skip");
const box = require('sg-box');
const bracelet = require('sg-bracelet');
const dumbbell = require('sg-dumbbell');
const cavo = require('sg-cavosmart');

plugin.regist(scale);
plugin.regist(bloodpressure);
plugin.regist(skip);
plugin.regist(box);
plugin.regist(bracelet);
plugin.regist(dumbbell);
plugin.regist(cavo);

/** 获取setting对象 */
export const settingFactory = {
    ...scale.settingFactory,
    ...bloodpressure.settingFactory,
    ...skip.settingFactory,
    ...box.settingFactory,
    ...bracelet.settingFactory,
    ...cavo.settingFactory,
}

console.debug("体脂秤协议", scale.proto);
console.debug("一些类", cavo.settingFactory);

console.info("=========================================")

// import plugin from 'plugin'
// const plugin = require('./plugin');

export const AdaptorStateEventName = 'adaptorState'; // 蓝牙开关的回调
export const ConnectionStateEventName = 'connectionState'; // 监听设备的时候设备的回调   弃用
export const DataReportEventName = 'dataReport'; // 设备数据的回调
export const DeviceStateChangedName = 'deviceStateChange'; // 设备的工作状态发生变化的回调

export const BINDSTATE_InputRandomNumber = 0; // 输入随机数 (A5)
export const BINDSTATE_Successful = 4; // 绑定成功
export const BINDSTATE_Failure = 5; // 绑定失败

export const CONNECTSTATE_None = 0; //初始状态
export const CONNECTSTATE_Scan = 1; //搜索中
export const CONNECTSTATE_Connecting = 2; //连接中
export const CONNECTSTATE_Connected = 3; //蓝牙连接成功，还没有启动数据同步
export const CONNECTSTATE_Syncing = 4; //已经启动数据同步，这是才能进行收数据，推送设置项等
export const CONNECTSTATE_Disconnected = 5; //设备主动断开了连接，或者系统断开了连接
export const CONNECTSTATE_SyncError = 6; //发起启动数据同步出现未知异常，和被动设备断开Disconnected区分
export const CONNECTSTATE_StopDataSync = 7; //业务层主动停止了同步。
// WorkerBusy = 8,   // 工作繁忙，重复发送指令
//   NotFound = 9,     // 未找到设备
//   AuthorizeFailure = 10, // 鉴权失败
export const CONNECTSTATE_WorkerBusy = 8;

export const CONNECTSTATE_NotFound = 9;
export const CONNECTSTATE_AuthorizeFailure = 10;

function privateOnBluetoothDeviceFound(obj) {
    console.warn("privateOnBluetoothDeviceFound");
    wx.onBluetoothDeviceFound(res => {
        console.warn("privateOnBluetoothDeviceFound", res);
        obj(res);
    });
}

function privateOnBLECharacteristicValueChange(obj) {
    console.warn("privateOnBLECharacteristicValueChange");
    wx.onBLECharacteristicValueChange(res => {
        console.warn("privateOnBLECharacteristicValueChange", res);
        obj(res);
    })
}

function privateOnBLEConnectionStateChange(obj) {
    console.warn("privateOnBLEConnectionStateChange");
    wx.onBLEConnectionStateChange(res => {
        console.warn("privateOnBLEConnectionStateChange", res);
        obj(res);
    })
}

function privateOnBluetoothAdapterStateChange(obj) {
    console.warn("privateOnBluetoothAdapterStateChange");
    wx.onBluetoothAdapterStateChange(res => {
        console.warn("privateOnBluetoothAdapterStateChange", res);
        obj(res);
    })
}

function privateStartBluetoothDevicesDiscovery(obj) {
    let unikey = obj.unikey;
    console.warn("privateStartBluetoothDevicesDiscovery", unikey);
    wx.startBluetoothDevicesDiscovery(obj);
}

function privateStopBluetoothDevicesDiscovery(obj) {
    let unikey = obj.unikey;
    console.warn("privateStopBluetoothDevicesDiscovery", unikey);
    wx.stopBluetoothDevicesDiscovery(obj);
}

/**
 * 初始化
 */
export function init() {
    let version = plugin.getVersion();
    console.log('version', version);

    plugin.init({
        appId: 'com.leshiguang.saas.rbac.demo.appid',
        debug: true
    }).then(res => {
        console.debug("初始化成功 ", res);
    }).catch(err => {
        console.error("初始化失败", err);
    })

    /**
     * AdaptorState = 'adaptorState',//蓝牙状态改变回调
     * ConnectionState = 'connectionState',//连接状态改变回调
     * DataReport = 'dataReport', // 数据接收回调
     */
    plugin.$on({
        eventName: AdaptorStateEventName,
        eventKey: 'wo', /// 唯一标识，同一标识的监听会被覆盖
        callback: onAdaptorState,
    });

    plugin.$on({
        eventName: ConnectionStateEventName,
        eventKey: 'shi', /// 唯一标识，同一标识的监听会被覆盖
        callback: onConnectionState,
    });

    plugin.$on({
        eventName: DataReportEventName,
        eventKey: 'shi', /// 唯一标识，同一标识的监听会被覆盖
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
    return plugin.bindDevice(options);
}

/**
 * 取消绑定
 * @param { mac } options 
 */
export function cancelBind(options) {
    plugin.cancelBind(options);
}

/**
 * 开始ota
 * @param { mac, fileBuffer, model, onUpgradeProcess, onUpgradeComplete } options 
 * @returns 
 */
export function ota(options) {
    return plugin.ota(options);
}

export function cancelOta(options) {
    return plugin.cancelOta(options);
}

/**
 * 向设备发送数据
 * @param { mac, setting } options
 */
export function pushSetting(options) {
    return new Promise((resolve, reject) => {
        plugin.pushSetting(options).then(_ => {
            console.warn('设置成功');
            wx.showToast({ title: "设置成功", icon: "none", duration: 1000 });
            resolve();
        }).catch(error => {
            console.warn("设置失败", error)
            wx.showToast({ title: "设置失败，请重试", icon: "none", duration: 1000 });
            reject();
        });
    })
}

/**
 * 获取设备的当前状态
 * @param {mac, settingType} options 
 */
export function getSetting(options) {
    return new Promise((resolve, reject) => {
        plugin.getSetting(options).then(resp => {
            console.warn('获取设置项成功', resp);
            wx.showToast({ title: "获取设置成功", icon: "none", duration: 1000 });
            resolve(resp);
        }).catch(error => {
            console.warn("获取设置失败", error);
            wx.showToast({ title: "获取设置失败，请重试", icon: "none", duration: 1000 });
            reject(error);
        });
    });
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

export function getDeviceInfo(mac) {
    return plugin.getDeviceInfo(mac);
}

/**
 * 判断蓝牙是否可用 (这里会有个问题，要初始化之后调用才正确，否则会返回false)
 * @returns boolean 蓝牙是否可用
 */
export function isBluetoothAvailable() {
    return plugin.isBluetoothAvailable();
}

export function cancelSetting(mac) {
    return plugin.cancelSetting(mac);
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
        case CONNECTSTATE_WorkerBusy:
            msg = "重复发起";
            break;
        case CONNECTSTATE_NotFound:
            msg = "未发现设备";
            break;
        case CONNECTSTATE_AuthorizeFailure:
            msg = "鉴权失败";
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
        case BINDSTATE_Successful:
            statusMsg = "绑定成功";
            break;
    }

    return statusMsg;
}

// mark test
function onAdaptorState(available) {
    // console.warn('app', "onAdaptorState", available);
}

function onConnectionState(mac, connectState) {
    // console.warn('app', 'onConnectionState', mac, connectState);
}

function onDataReport(device, dataReport) {
    // console.warn('app', 'onDataReport', device, dataReport);
}