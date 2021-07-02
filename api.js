import { hex_md5 } from "./MD5";

/** 需要加到你们小程序的受信任列表 */
const baseUrl = "https://api.leshiguang.com";

/** 需要申请 */
const appKey = "lxxxxxxxxxxxxx";
/** 需要申请 */
const appSecret = "xxxxxxxxxxxxxxxxxx";

/**
 * 体脂18项计算
 * @param {
 * weight,      // 体重 kg
 * age,         // 年龄
 * sex,         // 1-男 2-女
 * height,      // 身高 单位米
 * resistance 阻抗必须要大于0才行，否则会报‘请求参数有误’
 *  
 * } options 
 */
export function getWeightIndexCalculateResult(options) {
    if (options.resistance && options.resistance > 0) {
        return requestPost({
            path: "/api/weight/algorithm/v1.0/getWeightIndexCalculateResult",
            data: options,
        });
    } else {
        return Promise.reject('resistance 必须要大于0');
    }


}

/**
 * 指标解读
 * @param {
 * weight,      // 体重   根据体重单位传值
 * age,         // 年龄
 * sex,         // 1-男 2-女
 * height,      // 单位米
 * resistance?, // 阻抗必须要大于0才行，否则会报‘请求参数有误’
 * weightUnit?  // 1-kg 2-斤 3-磅 4-英石
 * } options
 */
export function getWeightIndexCalculateAndAnalysisResult(options) {
    if (options.resistance && options.resistance > 0) {
        console.debug('getWeightIndexCalculateAndAnalysisResult', options);
        return requestPost({
            path: "/api/weight/algorithm/v1.0/getWeightIndexCalculateAndAnalysisResult",
            data: options,
        });
    } else {
        return Promise.reject('resistance 必须要大于0');
    }
}

/**
 * 体脂海外FDA算法计算
 * @param {
 * weight,      // 体重   根据体重单位传值
 * age,         // 年龄
 * sex,         // 1-男 2-女
 * height,      // 单位米
 * resistance?, // 阻抗必须要大于0才行，否则会报‘请求参数有误’
 * weightUnit?  // 1-kg 2-斤 3-磅 4-英石
 * } options
 */
export function getforeignWeightAlgorithmResult(options) {
    if (options.resistance && options.resistance > 0) {
        console.debug('getforeignWeightAlgorithmResult', options);
        return requestPost({
            path: "/api/weight/algorithm/v1.0/getforeignWeightAlgorithmResult",
            data: options,
        });
    } else {
        return Promise.reject('resistance 必须要大于0');
    }
}

/**
 * post请求
 * @param { path, data} options 
 */
function requestPost(options) {
    return new Promise((resove, reject) => {

        let timeStamp = new Date().getTime();
        let array = new Array(timeStamp, appKey, appSecret, "1.0");
        let sign = generateSign(array)
        let url = `${baseUrl}${options.path}?api_appKey=${appKey}&api_sign=${sign}&api_timestamp=${timeStamp}&api_version=1.0`
        console.debug(url, "POST", options.data);
        wx.request({
            url: url,
            method: "POST",
            data: options.data,
            header: {
                'content-type': 'application/json',
                'Accept-Encoding': "gzip, deflate"
            },
            success(res) {
                console.debug('请求成功', res.data)
                resove(res.data);
            },
            fail(error) {
                console.error('请求失败', error);
                reject(error);

            }
        })
    })
}

function generateSign(contents) {
    contents.sort();
    let string = contents.join("");
    return hex_md5(string).toUpperCase();
}
