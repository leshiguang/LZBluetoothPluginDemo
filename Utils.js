// ArrayBuffer转16进度字符串示例
export function ab2hex(buffer, isReversal) {
    if (buffer === null || buffer === undefined) {
        return '';
    }
    if (typeof (buffer) === 'string') {
        return buffer;
    }
    var hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function (bit) {
            return ('00' + bit.toString(16)).slice(-2);
        },
    );
    if (isReversal) {
        let temp = [];
        for (let i = 0; i < hexArr.length; i++) {
            temp.push(hexArr[hexArr.length - 1 - i]);
        }
        return temp.join('');
    }


    return hexArr.join('');
}
/**
    * 根据字符串长度，长度不足在字符串前填充0
    */
export function formatWithZero(content, targetLength) {
    if (content == null) {
        return "";
    }
    let temp = "";
    for (let i = 0; i < (targetLength - content.length); i++) {
        temp += "0";
    }
    temp += content;
    return temp;
}
/**
 * 16进制字符串转Array
 */
export function str2Bytes(str) {
    let pos = 0;
    let len = str.length;
    if (len % 2 !== 0) {
        return null;
    }
    len /= 2;
    let hexA = new Array();
    for (let i = 0; i < len; i++) {
        let s = str.substr(pos, 2);
        let v = parseInt(s, 16);
        hexA.push(v);
        pos += 2;
    }
    return hexA;
}

/**
 * 16进制字符串转ArrayBuffer
 */
export function hex2ArrayBuffer(hexStr) {
    let data = str2Bytes(hexStr);
    let buffer = new ArrayBuffer(data.length);
    let dataView = new DataView(buffer);
    for (let i = 0; i < data.length; i++) {
        dataView.setUint8(i, data[i]);
    }
    return buffer;
}
/**
 * 格式化Map的key,转大写，无符号
 */
export function formatMapKey(key) {
    if (!key) {
        return null;
    }
    let newKey = key.replace(/:/g, '');
    return newKey.toUpperCase();
}

/**
 * format('yyyy-MM-dd hh:mm:ss', 1537174760000) ---> 2018-09-17 16:59:20
 * @param fmt
 * @param timestamp
 * @param type
 * @returns {*|void|string}
 */
export const format = function (fmt, timestamp, type = 1) {
    var t = type === 1 ? timestamp : timestamp + new Date().getTimezoneOffset() * 60000 + 8 * 3600000;
    var date2 = new Date(t);
    // this = new Date(this.getTime()+this.getTimezoneOffset()*60000+8*3600000);
    var o = {
        "M+": date2.getMonth() + 1, //月份
        "d+": date2.getDate(), //日
        "h+": date2.getHours(), //小时
        "m+": date2.getMinutes(), //分
        "s+": date2.getSeconds(), //秒
        "q+": Math.floor((date2.getMonth() + 3) / 3), //季度
        "S": date2.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date2.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))
            );
    return fmt;
}

export function getCRC16(buffer) {

    let crc = 0xFFFF;
    let dataView = new DataView(buffer);
    for (let i = 0; i < dataView.byteLength; i++) {
        crc ^= dataView.getUint8(i);
        for (let j = 0; j < 8; j++) {
            if (crc & 0x0001) {
                crc >>>= 1;
                crc ^= 0xa001;
            } else {
                crc >>>= 1;
            }
        }
    }
    let crcBuffer = new ArrayBuffer(2);
    let bufferView = new DataView(crcBuffer);
    bufferView.setUint16(0, crc, true);
    return crcBuffer;
}
