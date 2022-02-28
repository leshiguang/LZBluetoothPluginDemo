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
    getSetting

} from '../../DeviceManager'

import {
    format
} from '../../Utils'


if (typeof SettingType == "undefined") {
    var SettingType = {
        // 手环
        HeartRateWarning: 1, // M6心率检测
        SleepOximetry: 2, // M6睡眠血氧检测
        SedentaryRemind: 3, // M6久坐提醒

        SleepRemind: 4, // M6睡眠提醒
        EventRemind: 5, // 闹钟
        NightMode: 6, // 夜间模式
        VibrationLevel: 7, // 震动强度
        TimeFormat: 8, // 24小时制
        DialManager: 9, // 表盘管理
        CustomScreen: 10, // 屏幕设置
        Restart: 11, // 重启
        Reset: 12, // 恢复出厂设置
        Unbind: 13, // 解绑
        RighteSwipeDisplay: 14, // 右滑显示屏幕 
        SportHrWarniing: 15, // 运动心率

        Target: 16, // 目标设置
        MsgRemind: 17, // 消息提醒设置
        HeartRateDuration: 18, // 检测间隔
        FemaleHealth: 19, // 女性健康
        PeriodReminder: 20, // 经期提醒
        Peirod2Reminder: 21, // 易孕期提醒
        Weather: 22, // 天气

        SedentaryRemind2: 23, // 手表的勿扰模式
        SportHeartRateSection: 24, // 运动区间设置


        HeartRateSwitch: 26, // 心率开关
        SleepRemind2: 27, // 新的睡眠提醒

        MsgSend: 25, // 消息发送
        CallMsgSend: 28, // 来电提醒

        CallMsgYes: 29, // 接听
        CallMsgNo: 30, // 拒绝接听

        MusiceInfo: 31, // 音乐信息

        NewWeather: 32, // 天气

        CallRemove: 33, // 清除状态

        SyncTime: 34, // 同步时间


        // 跳神
        BeginJump: 0x10001, // 开始跳绳

        // 体脂秤
        ScaleEnableHr: 0x20001, // 体脂秤的心率设置
        ScaleUint: 0x20002, // 体脂秤的单位设置
        ScaleConfigWifi: 0x20003, // 蓝牙配置wifi
        ScaleReset: 0x20004, // 体脂秤的重置

        // common
        Ota: 0xf0001, // Ota
    }
}


Page({

    /**
     * 页面的初始数据
     */
    data: {
        mac: '',
        model: '',
        name: '',
        device: {
            name: '',
            model: '',
            mac: "",
            firmwareVersion: '',
        },
        settings: [{
            name: "demo",
            value: "value",
            settingType: SettingType.Unbind,
        }, ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let obj = JSON.parse(JSON.stringify(options));
        let device = getDeviceInfo(obj.mac);
        this.data.device = device;
        console.debug("设备信息", device);
        let settings = null;
        if (device.model.indexOf("456") >= 0) {
            settings = this.m6DeviceSettings();
        } else if (device.model.indexOf("460") >= 0) {
            settings = this.bigWatchSettings();
        } else if (device.name.indexOf("JC") >= 0) {
            settings = this.mioSettings();
        } else if (device.model.indexOf("GBF-") >= 0) {
            settings = this.scaleSettings();
        } else if (device.model.indexOf("LS818") >= 0) {
            settings = this.bpSettings();
        } else {
            settings = [];
        }
        this.setData({
            mac: obj.mac,
            model: obj.model,
            name: obj.name,
            device,
            settings,
        })
    },

    onClinkSetItem(event) {
        let setting = event.target.dataset.result;
        console.debug("xxxxxxxxxxxx", event, setting)
        let settingInfo = null;
        switch (setting.settingType) {
            case SettingType.HeartRateWarning:
            case SettingType.SportHrWarniing:
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
                settingInfo = new settingFactory.HeartRateWarningSetting(sportHr, generalHr);
                break;
            case SettingType.SleepOximetry:

                let sleepOximetryInfo = {
                    tag: 0x20,
                    value: 2,
                }
                settingInfo = new settingFactory.MultipleSetting([sleepOximetryInfo]);
                break;
            case SettingType.SedentaryRemind:
                settingInfo = new settingFactory.SedentaryReminderSetting()
                break;
            case SettingType.SleepRemind:
                let event = {
                    napEnable: true,
                    lightSleepEnable: true,
                    index: 3,
                    type: 3,
                    desc: "起床闹钟",
                    enable: true,
                    hour: 19,
                    minute: 50,
                    repeatTime: 0,
                    vibrationType: 0,
                    vibrationTime: 0,
                    vibrationLevel1: 0,
                    vibrationLevel2: 0,
                }
                settingInfo = new settingFactory.NewEventRemindSetting([event]);
                break;
            case SettingType.EventRemind:
                {


                    // for (let i = 0; i < 10; i++) {
                    let event = {
                        napEnable: true,
                        lightSleepEnable: true,
                        index: 1,
                        desc: `设置闹钟提醒发发发`,
                        // desc: "fffffff",
                        enable: true,
                        isDelete: false,
                        napAlertTime: 15,
                        lightSleepAlertTime: 15,
                        hour: 16,
                        minute: 10,
                        repeatTime: 0b1111111,
                        vibrationType: 2,
                        vibrationTime: 3,
                        vibrationLevel1: 4,
                        vibrationLevel2: 5,

                    }

                    settingInfo = new settingFactory.EventReminderSetting(Array(event));
                    pushSetting({
                        mac: this.data.mac,
                        setting: settingInfo
                    })
                    // }

                    return

                    break;
                }
            case SettingType.TimeFormat:
                settingInfo = new settingFactory.TimeFormatSetting(0x00);
                break;
            case SettingType.NightMode:
                let nightMode = {
                    tag: 0x13,
                    enable: true,
                    enableImmediately: true,
                    startHour: 23,
                    startMinute: 0,
                    endHour: 7,
                    endMinute: 0,
                }
                settingInfo = new settingFactory.MultipleSetting([nightMode]);
                break;
            case SettingType.VibrationLevel:
                let vibration = {
                    tag: 0x02,
                    value: 0x01,
                }
                break;

            case SettingType.DialManager:
                wx.navigateTo({
                    url: '../dial/dial?mac=' + this.data.mac + '&name=' + this.data.name + '&model=' + this.data.model
                });
                return;
            case SettingType.CustomScreen:
                settingInfo = new settingFactory.CustomPagesSetting([13]);
                break
            case SettingType.RighteSwipeDisplay:
                let value = {
                    tag: 0x04,
                    value: 2
                };
                settingInfo = new settingFactory.MultipleSetting([value])
                break
            case SettingType.HeartRateWarning:
                settingInfo = new settingFactory.HeartRateWarningSetting();
                break;
            case SettingType.Restart:
                settingInfo = new settingFactory.ControlDeviceSetting(0x3);
                break;
            case SettingType.Reset:
                settingInfo = new settingFactory.ControlDeviceSetting(0x4);
                break
            case SettingType.Unbind:
                settingInfo = new settingFactory.ControlDeviceSetting(0x2);
                break;
            case SettingType.BeginJump:
                wx.navigateTo({
                    url: '../jump/jump?mac=' + this.data.mac + '&name=' + this.data.name + '&model=' + this.data.model
                });
                return;
            case SettingType.ScaleEnableHr:
                settingInfo = new settingFactory.A6HeartRateSetting(true);
                break;
            case SettingType.ScaleUint:
                settingInfo = new settingFactory.A6UnitSetting(1);
                break;
            case SettingType.ScaleConfigWifi:
                wx.navigateTo({
                    url: '../wifiConfig/wifiConfig?mac=' + this.data.mac + '&name=' + this.data.name
                })
                return
            case SettingType.ScaleReset:
                settingInfo = new settingFactory.ResetReq();
                break;
            case SettingType.Ota:
                wx.navigateTo({
                    url: '../ota/ota?mac=' + this.data.mac + '&name=' + this.data.name + '&model=' + this.data.model
                })
                return;
            case SettingType.Target:
                settingInfo = new settingFactory.EncourageTargetSetting(true, 1, 3000);
                break;
            case SettingType.MsgRemind:

                let qq = {
                    reminderType: 0xfd,
                    enable: true,
                }
                settingInfo = new settingFactory.MultipleSetting([{ tag: 0x21, list: [qq] }]);
                break;
            case SettingType.HeartRateDuration:
                settingInfo = new settingFactory.HeartRateWarningCycleSetting(true, 5);
                break;
            case SettingType.FemaleHealth:
                value = {
                    /** 经期长度 */
                    length: 5,
                    /** 经期周期 */
                    period: 28,
                    lastBeginYear: 2021,
                    lastBeginMonth: 8,
                    lastBeginDay: 24,
                    lastEndYear: 2021,
                    lastEndMonth: 9,
                    lastEndDay: 10,

                    /** 开关 */
                    enable: false,
                    tag: 0x28,
                }
                settingInfo = new settingFactory.MultipleSetting([value]);
                break;
            case SettingType.PeriodReminder:
                value = {
                    /** 开关 */
                    enable: true,
                    /** 提前提醒天数 */
                    dayOfWarning: 3,
                    /** 提醒时间小时 */
                    hour: 10,
                    /** 提醒时间分钟 */
                    minute: 10,
                    tag: 0x29
                }
                settingInfo = new settingFactory.MultipleSetting([value])
                break;
            case SettingType.Peirod2Reminder:
                value = {
                    /** 开关 */
                    enable: true,
                    /** 提前提醒天数 */
                    dayOfWarning: 3,
                    /** 提醒时间小时 */
                    hour: 14,
                    /** 提醒时间分钟 */
                    minute: 15,
                    tag: 0x2a
                }
                settingInfo = new settingFactory.MultipleSetting([value])
                break;
            case SettingType.Weather:
                settingInfo = new settingFactory.WeatherSetting(1634195542, [{
                    weatherCode: 0x00,
                    aqi: 1,
                    minTemperature: 10,
                    maxTemperature: 12
                }]);
                break;
            case SettingType.SedentaryRemind2:
                let info = {
                    index: 1,

                    // 开关
                    enable: true,

                    // 提醒开始时间
                    startHour: 8,
                    startMinute: 8,

                    // 提醒结束时间
                    endHour: 20,
                    endMinute: 20,

                    // 0x00：定时 0x01：周期
                    reminderMode: 0,
                    reminderHour: 10,
                    reminderMinute: 10,


                    // 周期 每间隔多少分钟提醒一次
                    frequency: 5,

                    // 参考 RepeatTime
                    repeatTime: 127,
                    // 参考 VibrationType
                    vibrationType: 0,
                    // 表示提醒持续总时长，最大值60s
                    vibrationTime: 60,
                    // 共分10 级。0~9
                    vibrationLevel1: 9,
                    // 共分10 级。0~9当震动方式为持续震动时，该字段无效，但需留位
                    vibrationLevel2: 9,

                    // 勿扰开关 
                    noDisturbEnable: true,

                    // 勿扰开始时间
                    noDisturbStartHour: 11,
                    noDisturbStartMinute: 4,

                    // 勿扰结束时间
                    noDisturbEndHour: 16,
                    noDisturbEndMinute: 3,
                }
                settingInfo = new settingFactory.ReminderSetting([info], 1, true);
                break;
            case SettingType.SleepRemind2:
                {


                    let info = {
                        index: 1,

                        // 开关
                        enable: true,

                        // 提醒开始时间
                        startHour: 8,
                        startMinute: 8,

                        // 提醒结束时间
                        endHour: 20,
                        endMinute: 20,

                        // 0x00：定时 0x01：周期
                        reminderMode: 1,


                        // 周期 每间隔多少分钟提醒一次
                        frequency: 5,

                        // 参考 RepeatTime
                        repeatTime: 127,
                        // 参考 VibrationType
                        vibrationType: 0,
                        // 表示提醒持续总时长，最大值60s
                        vibrationTime: 60,
                        // 共分10 级。0~9
                        vibrationLevel1: 9,
                        // 共分10 级。0~9当震动方式为持续震动时，该字段无效，但需留位
                        vibrationLevel2: 9,

                        // 勿扰开关 
                        noDisturbEnable: true,

                        // 勿扰开始时间
                        noDisturbStartHour: 12,
                        noDisturbStartMinute: 0,

                        // 勿扰结束时间
                        noDisturbEndHour: 14,
                        noDisturbEndMinute: 0,
                    }
                    settingInfo = new settingFactory.ReminderSetting([info], 3, true);
                    break;
                }
            case SettingType.MsgSend:
                if (!this.msgIndex) {
                    this.msgIndex = 1;
                } else {
                    this.msgIndex = this.msgIndex + 1;
                }
                let msgInfo = {
                    msgId: 951862498,

                    /**
                     * 消息标题
                     */
                    title: "tanjian",

                    /**
                     * 正文
                     */
                    content: "tanjiannihao" + this.msgIndex,
                }

                settingInfo = new settingFactory.MsgNotifySetting(msgInfo, 1, 0);
                break;
            case SettingType.CallMsgSend:
                settingInfo = new settingFactory.CallNotifySetting("13265792174");
                break;
            case SettingType.CallMsgYes:
                return
            case SettingType.CallMsgNo:
                settingInfo = new settingFactory.CallNotifySetting("13265792174", 2);
                break;
            case SettingType.MusiceInfo:
                settingInfo = new settingFactory.MusicInfoSetting({ volLevel: 90, playStatus: 3, playTime: 10, duration: 100, musicName: "Honey I Love you", author: "Ice Paper", album: "杀手修炼手册", maxVol: 32 })
                break;
            case SettingType.NewWeather:
                {
                    settingInfo = new settingFactory.NewWeatherSetting(1634195542, [{
                        weatherCode: 0x00,
                        aqi: 1,
                        minTemperature: 10,
                        maxTemperature: 12
                    }]);

                    break;
                }
            case SettingType.SyncTime:
                {
                    let value = {
                        utc: 1631863668,
                        timezone: 1,
                        tag: 0x0b
                    }
                    settingInfo = new settingFactory.MultipleSetting([value])
                    break;
                }
            case SettingType.SyncData:
                {
                    settingInfo = new settingFactory.SyncReqSetting(0xfe);
                    break;
                }
            case SettingType.SyncAllData:
                {
                    settingInfo = new settingFactory.SyncReqSetting(0xff);
                    break;
                }
            case SettingType.DrinkEventReminder:

                let a = {
                    index: 1,

                    // 开关
                    enable: true,

                    // 提醒开始时间
                    startHour: 8,
                    startMinute: 8,

                    // 提醒结束时间
                    endHour: 20,
                    endMinute: 20,

                    // 0x00：定时 0x01：周期
                    reminderMode: 1,


                    // 周期 每间隔多少分钟提醒一次
                    frequency: 5,

                    // 参考 RepeatTime
                    repeatTime: 127,
                    // 参考 VibrationType
                    vibrationType: 0,
                    // 表示提醒持续总时长，最大值60s
                    vibrationTime: 60,
                    // 共分10 级。0~9
                    vibrationLevel1: 9,
                    // 共分10 级。0~9当震动方式为持续震动时，该字段无效，但需留位
                    vibrationLevel2: 9,

                    // 勿扰开关 
                    noDisturbEnable: true,

                    // 勿扰开始时间
                    noDisturbStartHour: 19,
                    noDisturbStartMinute: 0,

                    // 勿扰结束时间
                    noDisturbEndHour: 20,
                    noDisturbEndMinute: 0,
                }
                settingInfo = new settingFactory.ReminderSetting([a], 3, true);
                break;
            case SettingType.McuSynData:
                {
                    settingInfo = new settingFactory.SyncBoxData();
                    break;
                }
            case SettingType.ScaleWifiReset:
                {
                    settingInfo = new settingFactory.WifiResetReq();
                    break;
                }
            case SettingType.ScaleWifiStatus:
                {
                    settingInfo = new settingFactory.WifiStatusReq();
                    break;
                }
            case SettingType.RealtimeHROpen:
                {
                    settingInfo = new settingFactory.RealtimeHRSetting(true);
                    break;
                }
            case SettingType.RealtimeHRClose:
                {
                    settingInfo = new settingFactory.RealtimeHRSetting(false);
                    break
                }
        }


        if (settingInfo) {
            pushSetting({
                mac: this.data.mac,
                setting: settingInfo
            })
        } else {
            wx.showToast({ title: "设置未实现", icon: "none", duration: 3000 });

        }
    },

    onClinkGetItem(event) {
        console.warn("onClinkGetItem", event);
        let setting = event.target.dataset.result;
        let settingType = 0;
        switch (setting.settingType) {
            case SettingType.HeartRateWarning:
                settingType = 0;
                break;
            case SettingType.SleepOximetry:
                settingType = 1;
                break;
            case SettingType.SedentaryRemind:
            case SettingType.SedentaryRemind2:
                settingType = 2;
                break;
            case SettingType.SleepRemind:
            case SettingType.SleepRemind2:
                settingType = 3;
                break;
            case SettingType.EventRemind:
                settingType = 4;
                break;
            case SettingType.TimeFormat:
                settingType = 5;
                break;
            case SettingType.DialManager:
                settingType = 6;
                break;
            case SettingType.CustomScreen:
                settingType = 7;
                break
            case SettingType.NightMode:
                settingType = 8;
                break;
            case SettingType.RighteSwipeDisplay:
                settingType = 9;
                break;
            case SettingType.SportHrWarniing:
                settingType = 10;
                break;
            case SettingType.Target:
                settingType = 11;
                break;
            case SettingType.MsgRemind:
                settingType = 12;
                break;
            case SettingType.HeartRateDuration:
                settingType = 13;
                break;
            case SettingType.FemaleHealth:
                settingType = 14;
                break;
            case SettingType.PeriodReminder:
                settingType = 15;
                break;
            case SettingType.Peirod2Reminder:
                settingType = 16;
                break;
            case SettingType.Weather:
                // settingType = 17;
                console.warn("天气不支持");
                break;
            case SettingType.HeartRateSwitch:
                settingType = 18;
                break;

        }

        getSetting({
            mac: this.data.mac,
            settingType
        });
    },


    m6DeviceSettings() {
        return [
            { name: this.name(SettingType.HeartRateWarning), settingType: SettingType.HeartRateWarning, value: "心率检测" },
            { name: this.name(SettingType.SportHrWarniing), settingType: SettingType.SportHrWarniing, value: "运动心率检测" },
            { name: this.name(SettingType.RighteSwipeDisplay), settingType: SettingType.RighteSwipeDisplay, value: "右滑显示按钮" },
            { name: this.name(SettingType.SleepOximetry), settingType: SettingType.SleepOximetry, value: "睡眠血氧检测" },
            { name: this.name(SettingType.SedentaryRemind), settingType: SettingType.SedentaryRemind, value: "久坐提醒" },
            { name: this.name(SettingType.SleepRemind), settingType: SettingType.SleepRemind, value: "睡眠提醒" },
            { name: this.name(SettingType.EventRemind), settingType: SettingType.EventRemind, value: "闹钟提醒" },

            { name: this.name(SettingType.TimeFormat), settingType: SettingType.TimeFormat, value: "24小时制" },
            { name: this.name(SettingType.DialManager), settingType: SettingType.DialManager, value: "表盘管理" },
            { name: this.name(SettingType.CustomScreen), settingType: SettingType.CustomScreen, value: "自定义屏幕" },
            { name: this.name(SettingType.NightMode), settingType: SettingType.NightMode, value: "夜间模式" },
            { name: this.name(SettingType.RighteSwipeDisplay), settingType: SettingType.RighteSwipeDisplay, value: "右滑显示按钮" },

            { name: this.name(SettingType.Target), settingType: SettingType.Target, value: "" },
        ]
    },

    a5DeviceSetting() {

    },

    bigWatchSettings() {
        return [
            { name: this.name(SettingType.HeartRateWarning), settingType: SettingType.HeartRateWarning, value: "心率检测" },
            { name: this.name(SettingType.SportHrWarniing), settingType: SettingType.SportHrWarniing, value: "运动心率检测" },
            { name: this.name(SettingType.SleepOximetry), settingType: SettingType.SleepOximetry, value: "睡眠血氧检测" },
            { name: this.name(SettingType.SedentaryRemind2), settingType: SettingType.SedentaryRemind2, value: "久坐提醒" },
            { name: this.name(SettingType.SleepRemind2), settingType: SettingType.SleepRemind2, value: "睡眠提醒" },
            { name: this.name(SettingType.EventRemind), settingType: SettingType.EventRemind, value: "闹钟提醒" },

            { name: this.name(SettingType.TimeFormat), settingType: SettingType.TimeFormat, value: "24小时制" },
            { name: this.name(SettingType.DialManager), settingType: SettingType.DialManager, value: "表盘管理" },
            { name: this.name(SettingType.CustomScreen), settingType: SettingType.CustomScreen, value: "自定义屏幕" },
            { name: this.name(SettingType.NightMode), settingType: SettingType.NightMode, value: "夜间模式" },

            { name: this.name(SettingType.Target), settingType: SettingType.Target, value: "" },
            { name: this.name(SettingType.MsgRemind), settingType: SettingType.MsgRemind, value: "" },
            { name: this.name(SettingType.HeartRateDuration), settingType: SettingType.HeartRateDuration, value: "" },
            { name: this.name(SettingType.FemaleHealth), settingType: SettingType.FemaleHealth, value: "" },
            { name: this.name(SettingType.PeriodReminder), settingType: SettingType.PeriodReminder, value: "" },
            { name: this.name(SettingType.Peirod2Reminder), settingType: SettingType.Peirod2Reminder, value: "" },
            { name: this.name(SettingType.Weather), settingType: SettingType.Weather, value: "" },
            { name: this.name(SettingType.MsgSend), settingType: SettingType.MsgSend, value: "" },
            { name: this.name(SettingType.HeartRateSwitch), settingType: SettingType.HeartRateSwitch, value: "" },
            { name: this.name(SettingType.CallMsgSend), settingType: SettingType.CallMsgSend, value: "" },
            { name: this.name(SettingType.CallMsgYes), settingType: SettingType.CallMsgYes, value: "" },
            { name: this.name(SettingType.CallMsgNo), settingType: SettingType.CallMsgNo, value: "" },
            { name: this.name(SettingType.MusiceInfo), settingType: SettingType.MusiceInfo, value: "" },
            { name: this.name(SettingType.NewWeather), settingType: SettingType.NewWeather, value: "" },
            { name: this.name(SettingType.CallRemove), settingType: SettingType.CallRemove, value: "" },
            { name: this.name(SettingType.SyncTime), settingType: SettingType.SyncTime, value: "" },
        ]
    },

    scaleSettings() {
        return [
            { name: this.name(SettingType.ScaleEnableHr), settingType: SettingType.ScaleEnableHr, value: "心率开关" },
            { name: this.name(SettingType.ScaleUint), settingType: SettingType.ScaleUint, value: "单位设置" },
            { name: this.name(SettingType.ScaleConfigWifi), settingType: SettingType.ScaleConfigWifi, value: "配置wifi" },
            { name: this.name(SettingType.ScaleReset), settingType: SettingType.ScaleReset, value: "重置" },
            { name: this.name(SettingType.Ota), settingType: SettingType.Ota, value: this.data.device.firmwareVersion },
        ]
    },

    bpSettings() {
        return []
    },

    mioSettings() {
        return [
            { name: this.name(SettingType.BeginJump), settingType: SettingType.BeginJump, value: "跳绳" },
        ]
    },

    name(settingType) {
        switch (settingType) {
            case SettingType.HeartRateWarning:
                return "心率检测";
            case SettingType.SleepOximetry:
                return "睡眠血氧检测";
            case SettingType.SedentaryRemind:
                return "久坐提醒";
            case SettingType.SleepRemind:
                return "睡眠提醒";
            case SettingType.EventRemind:
                return "闹钟";
            case SettingType.NightMode:
                return "夜间模式";
            case SettingType.VibrationLevel:
                return "震动强度";
            case SettingType.TimeFormat:
                return "24小时制";
            case SettingType.DialManager:
                return "表盘管理";
            case SettingType.CustomScreen:
                return "自定义屏幕";
            case SettingType.Restart:
                return "重启";
            case SettingType.Reset:
                return "重置";
            case SettingType.Unbind:
                return "解绑";
            case SettingType.BeginJump:
                return "跳绳"
            case SettingType.ScaleEnableHr:
                return "心率设置";
            case SettingType.ScaleUint:
                return "单位设置";
            case SettingType.ScaleConfigWifi:
                return "配置wifi";
            case SettingType.ScaleReset:
                return "重置";
            case SettingType.Ota:
                return "ota升级";
            case SettingType.RighteSwipeDisplay:
                return "右滑显示屏幕";
            case SettingType.SportHrWarniing:
                return "运动心率";
            case SettingType.Target:
                return "目标设置";
            case SettingType.MsgRemind:
                return "消息提醒";
            case SettingType.HeartRateDuration:
                return "心率检测间隔";
            case SettingType.FemaleHealth:
                return "女性健康";
            case SettingType.PeriodReminder:
                return "经期提醒";
            case SettingType.Peirod2Reminder:
                return "易孕期";
            case SettingType.Weather:
                return "天气设置";
            case SettingType.SedentaryRemind2:
                return "久坐提醒";
            case SettingType.MsgSend:
                return "发送消息";
            case SettingType.HeartRateSwitch:
                return "心率开关";
            case SettingType.SleepRemind2:
                return "新的睡眠提醒";
            case SettingType.CallMsgSend:
                return "来电";
            case SettingType.CallMsgYes:
                return "接听";
            case SettingType.CallMsgNo:
                return "拒绝接听";
            case SettingType.MusiceInfo:
                return "音乐信息";
            case SettingType.NewWeather:
                return "新天气";
            case SettingType.CallRemove:
                return "清除电话状态";
            case SettingType.SyncTime:
                return "同步时间";
        }
    }
})