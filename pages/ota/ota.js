
import { cancelOta, ota } from "../../DeviceManager";
import {
  format
} from '../../Utils'

// miniprogram/pages/ota/ota.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mac: '',
    name: '',
    model: '',
    // filePath: "https://files.lifesense.com/firmware/20201124/GBF-2008-BF1_JIN_Combine_OTA_V1.4.0.24_HRC_0xFCD1_20201113.bin",
    // filePath: "https://media.githubusercontent.com/media/malai520/OtaFile/main/JC-1/bk3432_ble_app_app.bin",
    // filePath: "https://media.githubusercontent.com/media/malai520/OtaFile/main/JC-1/LSJC-01_V1.0.5_RC.zip",
    filePath: "http://sports-qa-files.lifesense.com/firmware/20191114/431B3H1004_1010T311_000A3.1.0_0.0.0D150_000_994E57A4.lsf",
    // filePath: "https://media.githubusercontent.com/media/malai520/OtaFile/main/456/456B1H1003_1003T015_015A0.0.0_3.4.51D232_232_345FFE50.lzo.lsf",

    list: [
      {
        name: "cavo ota",
        path: "https://file-report.leshiguang.com/reportfs/2023/03/31/cc54e1a96535415d876bf8921e0973f0.bin",
      },


    ]
  },

  onLoad: function (options) {
    console.log('ota', 'onload', JSON.stringify(options));
    let obj = JSON.parse(JSON.stringify(options));
    this.setData({
      mac: obj.mac,
      name: obj.name,
    });

    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },

  start: function (event) {
    let url = this.data.filePath;
    this.startOta(url);
  },

  stop: function (event) {
    cancelOta({ mac: this.data.mac })
  },

  clearLog: function (event) {
    this.setData({
      logText: ""
    })
  },


  readFile(filePath, name) {
    wx.showLoading({
      title: "读取文件"
    })
    if (filePath.indexOf('.zip') >= 0) {
      this.readZip(filePath, name);
    } else {
      wx.getFileSystemManager().readFile({
        filePath: filePath,
        success: res => {
          this.appendLogText("读取文件成功", res.data.byteLength);
          this.startUpgrade(res.data);
        },
      });
    }
  },

  readZip(filePath, name) {
    let realName = "example";
    let targetPath = `${wx.env.USER_DATA_PATH}/${realName}`;
    let that = this;
    wx.getFileSystemManager().unzip({
      zipFilePath: filePath,
      targetPath: targetPath,
      success(res) {
        console.log("wwwwwwww", res);
        wx.getFileSystemManager().readdir({
          dirPath: targetPath,
          success: res => {
            console.warn("读取文件成功", res.files);

            that.readFileList(res.files, targetPath);
          },
          fail: res => {
            console.error("wwwww", res);
          }
        });
      },
      fail(res) {
        console.error("wwwwwwwww", res);
      }
    });
  },

  readFileList(listPaths, targetPath) {
    let binPath = null;
    let jsonPath = null;
    for (let i = 0; i < listPaths.length; i++) {
      let path = listPaths[i];
      if (path.indexOf(".bin") >= 0) {
        binPath = path;
      } else if (path.indexOf(".json") >= 0) {
        jsonPath = path;
      }
    }

    try {
      let json = wx.getFileSystemManager().readFileSync(`${targetPath}/${jsonPath}`, "utf8");
      let binBuffer = wx.getFileSystemManager().readFileSync(`${targetPath}/${binPath}`);
      let jsonObj = JSON.parse(json);
      console.log("fffffff", json, json.manifest, jsonObj, jsonObj.manifest.dfu_version, binBuffer.byteLength);
      this.startUpgrade(binBuffer, jsonObj);
    } catch (error) {
      console.error("读取文件失败", error);
    }
    

    
  },

  startUpgrade(fileBuffer, fileInfo) {
    let mac = this.data.mac;
    let onUpgradeProcess = res => {
      this.appendLogText(res)
    };
    wx.showLoading({
      title: "开始ota"
    })
    let onUpgradeComplete = (code, msg) => {
      wx.showToast({
                title: "ota结束" + msg,
                duration: 1
              })
      this.appendLogText(`${code}: ${msg}`)
    }

    ota({
      mac,
      fileBuffer,
      fileInfo,
      onUpgradeProcess,
      onUpgradeComplete,
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

  selectFilePath: function (event) {
    let target = event.target;
    
    let index = parseInt(event.currentTarget.dataset.text);
    let item = this.data.list[index];
    console.debug("event", event, event.target, event.currentTarget, item);
    this.startOta(item.path);
  },


  startOta(url) {
    let spUrl = url.split('/');
    let lastName = spUrl[spUrl.length - 1];
    let otaFilePath = wx.env.USER_DATA_PATH + '/' + lastName;
    try {
      wx.getFileSystemManager().accessSync(otaFilePath);
      this.readFile(otaFilePath, lastName);
    } catch (e) {
      wx.showLoading({
        title: "下载文件"
      })
      wx.downloadFile({
        url: url,
        success: res => {
          let tempFilePath = res.tempFilePath;
          
          wx.showLoading({
            title: "存储文件"
          })
          wx.getFileSystemManager().saveFile({
            tempFilePath: tempFilePath,
            filePath: otaFilePath,
            success: (res) => {
              
              const savedFilePath = res.savedFilePath;
              console.log('savedFilePath', savedFilePath);
              this.readFile(savedFilePath, lastName);
            },
          });
          console.log('tempFilePath:', tempFilePath);
        },
      });
    }
  }

})