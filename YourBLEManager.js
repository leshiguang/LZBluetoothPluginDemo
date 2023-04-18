import { ab2hex } from "./Utils";
// let callbackList = {
//     'functionName': {
//         'key': callback
//     }
// };

// 类型参考上面
let callbackList = {}



// 添加监听
function addListener(functionName, key, callback) {
    let obj = callbackList[functionName];
    if (!obj) {
        obj = {};
        callbackList[functionName] = obj;
    }
    obj[key] = callback;
}

// 触发事件
function emit(functionName, ...params) {
    let obj = callbackList[functionName];
    if (obj) {
        Object.keys(obj).forEach(key => {
            let callback = obj[key];
            if (callback) {
                callback(...params);
            }
        })

    }
}


// 重写微信的方法，方便适配uniapp
const getSystemInfoSync = () => {
    return {
        locationEnabled: true,
        locationAuthorized: true,
        platform: "android"
    }
}

function onBluetoothDeviceFound(res) {
    addListener('onBluetoothDeviceFound', 'sg', res);
}

function onBLEConnectionStateChange(res) {
    addListener('onBLEConnectionStateChange', 'sg', res);
}

function onBLECharacteristicValueChange(res) {
    addListener('onBLECharacteristicValueChange', 'sg', res);
}

function onBluetoothAdapterStateChange(res) {
    addListener('onBluetoothAdapterStateChange', 'sg', res);
}

// 搜索缓存
let cache = {};
function getBluetoothDevices(res) {
    let set = new Set();
    Object.keys(cache).forEach(key => {
        set.add(cache[key]);
    })
    return wx.getBluetoothDevices({
        fail: (failRes) => {
            res.success && res.success({ devices: set.values() });
        },
        success: (successRes) => {
            successRes?.devices.forEach(device => {
                set.add(device);
            });
            res.success && res.success({ devices: set.values() });
        }
    });
}



// 初始化的时候监听这四个状态 
export function init() {
    wx.onBluetoothDeviceFound(res => {
        res.devices?.forEach(device => {
            cache[device.deviceId] = device;
        });
        emit('onBluetoothDeviceFound', res);
    });
    wx.onBLEConnectionStateChange(res => {
        emit('onBLEConnectionStateChange', res);
    });

    wx.onBLECharacteristicValueChange(res => {
        emit('onBLECharacteristicValueChange', res);
    });
    wx.onBluetoothAdapterStateChange(res => {
        emit('onBluetoothAdapterStateChange', res);
    })
}

// 你自己的搜索
export function startScan(callback) {
    addListener('onBluetoothDeviceFound', 'startScan', res => {
        // 做一些你自己的解析 
        res.devices?.forEach(device => {
            if (device.localName && (device.localName.indexOf('Glucose') > -1 || device.localName.indexOf('GBF') > -1)) {
                console.warn('test', device);
                const advertiseData = device.advertisData;
                if (advertiseData && advertiseData.byteLength >= 6) {
                    const length = advertiseData.byteLength;
                    const macBytes = advertiseData.slice(length - 6, length);
                    let mac = ab2hex(macBytes).toUpperCase();
                    console.warn('length', length)
                    callback({
                        ...device,
                        mac,
                        model: 'Glucose-xxx'
                    })
                }
            }
        })
    });

    // 增加从缓存中读取
    getBluetoothDevices({
        success: (res) => {
            // 做一些你自己的解析 
            res.devices?.forEach(device => {
                if (device.localName && (device.localName.indexOf('Glucose') > -1 || device.localName.indexOf('GBF') > -1)) {
                    console.warn('test', device);
                    const advertiseData = device.advertisData;
                    if (advertiseData && advertiseData.byteLength >= 6) {
                        const length = advertiseData.byteLength;
                        const macBytes = advertiseData.slice(length - 6, length);
                        let mac = ab2hex(macBytes).toUpperCase();
                        console.warn('length', length)
                        callback({
                            ...device,
                            mac,
                            model: 'Glucose-xxx'
                        })
                    }
                }
            })
        }
    })

    return wx.startBluetoothDevicesDiscovery();
}

// 你自己的停止搜索
export function stopScan() {
    return wx.stopBluetoothDevicesDiscovery();
}

// ...

// 理论上可以重写wx的任何方法
export const ble = {
    onBLEConnectionStateChange,
    onBLECharacteristicValueChange,
    onBluetoothDeviceFound,
    onBluetoothAdapterStateChange,
    getSystemInfoSync,
    getBluetoothDevices
}