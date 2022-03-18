import {
    AdaptorStateEventName,
    init,
    isBluetoothAvailable,
    startScanning,
    stopScanning,
    addListener,
    removeListener,
    connectStateMsg
} from '../../DeviceManager'

Page({
    data: {
        isBluetoothEnable: false,
        isScanning: false,
        currentItem: 0,
        inputMacString: '6876270C5097',
        macs: [],
        scanResults: [{
            name: "demo",
            mac: "AAAAAAAA",
            deviceId: "aaaaaaa",
            RSSI: -76,
        }, ],
        webviewList: [{
            title: '步数',
            type: 'step'
        }, {
            title: '睡眠',
            type: 'sleep'
        }, {
            title: '体重',
            type: 'weight'
        }, {
            title: '心率',
            type: 'heartrate'
        }, {
            title: '血压',
            type: 'bloodpressure'
        }, {
            title: '血糖',
            type: 'bloodsugar'
        }, {
            title: '运动记录',
            type: 'exercise'
        }, {
            title: '设置步数',
            type: 'goal'
        }]
    },

    onLoad() {
        console.log('app', 'onLoad', 'init');

        /** 监听蓝牙连接的事件 */
        addListener(AdaptorStateEventName, 'bind', res => {
            this.setData({
                isBluetoothEnable: res.available,
            })
        });

        this.setData({
            isBluetoothEnable: true
        })
        
    },

    onShow() {
        
    },

    onHide() {

    },

    onReady() {
        // let isBluetoothEnable = isBluetoothAvailable();
        // this.setData({
        //     isBluetoothEnable
        // });
    },

    startSearch() {
        /** 更新UI */
        this.setData({
            scanResults: [],
            macs: [],
            isScanning: true
        });

        let scanResults = [];
        let macs = [];
        /** 开始搜索设备 */
        startScanning(res => {
            // let localName = res.localName;
            // if (localName.indexOf('GBF') < 0) {
            //   return;
            // }

            let index = macs.indexOf(res.mac);
            if (index < 0) {
                scanResults.push(res);
                macs.push(res.mac);
            } else {
                let obj = scanResults[index];
                if (obj.RSSI < res.RSSI || !obj.RSSI) {
                    obj.RSSI = res.RSSI;
                }
            }

            // 排序 大->小
            scanResults.sort(function(a, b) { return b.RSSI - a.RSSI });

            /** 更新UI */
            this.setData({
                scanResults,
                macs
            })
        });
    },

    stopSearch() {
        this.setData({
            isScanning: false
        });
        stopScanning();
    },

    selectDevice: function(event) {
        stopScanning();
        let target = event.target;
        let index = parseInt(event.currentTarget.dataset.text);
        let device = this.data.scanResults[index];
        this.jumpToBind(device);
    },


    jumpToBind: function(device) {
        wx.navigateTo({
            url: '../bind/bind?mac=' + device.mac + '&name=' + device.name
        })
    },

    goMylist: function(event) {
        console.debug("goMylist");
        wx.navigateTo({
            url: '../mylist/mylist'
        })
    },

    goProduct: function(event) {
        console.debug("goProduct");
        wx.navigateTo({
            url: '../product/product'
        })
    },

    jumpToDetail: function(event) {
        let index = parseInt(event.currentTarget.dataset.text);
        console.debug("detail", index);
    }


})