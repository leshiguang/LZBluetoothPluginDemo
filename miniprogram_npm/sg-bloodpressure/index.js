module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1646653978716, function(require, module, exports) {
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).RollupLearn=t()}(this,(function(){const e="0000A610-0000-1000-8000-00805F9B34FB",t="0000A640-0000-1000-8000-00805F9B34FB",i="00001880-0000-1000-8000-00805F9B34FB",s="00001530-1212-EFDE-1523-785FEABCD123";function n(e,t){if(!e)return"";if("string"==typeof e)return e;let i=Array.prototype.map.call(new Uint8Array(e),(function(e){return("00"+e.toString(16)).slice(-2)}));if(t){let e=[];for(let t=0;t<i.length;t++)e.push(i[i.length-1-t]);return e.join("")}return i.join("")}function r(e){let t=e.toString(2);if(e<128)return e.toString(16);if(e<2048){t=("00000000000000000"+t).slice(-11);const e=parseInt("110"+t.substring(0,5),2),i=parseInt("10"+t.substring(5),2);return e.toString(16)+","+i.toString(16)}{t=("00000000000000000"+t).slice(-16);const e=parseInt("1110"+t.substring(0,4),2),i=parseInt("10"+t.substring(4,10),2),s=parseInt("10"+t.substring(10),2);return e.toString(16)+","+i.toString(16)+","+s.toString(16)}}let a=wx.getSystemInfoSync();function o(){return a.platform.toLowerCase().indexOf("ios")>-1}function c(e){return e.length>16?e:`0000${e}-0000-1000-8000-00805F9B34FB`}function h(e,t){return 1==(1&e>>t)}function d(e){return function(e){if(!e)return"";let t=new Uint8Array(e);var i,s,n,r,a,o;i="",n=t.length,s=0;for(;s<n;)switch((r=t[s++])>>4){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:i+=String.fromCharCode(r);break;case 12:case 13:a=t[s++],i+=String.fromCharCode((31&r)<<6|63&a);break;case 14:a=t[s++],o=t[s++],i+=String.fromCharCode((15&r)<<12|(63&a)<<6|(63&o)<<0)}return i}(e)}class u{constructor(e,t){if(this.dataType="bloodpressure",this.cmd=t,!e)return;let i=0,s=new DataView(e);this.remainCount=s.getUint16(i),i+=2;let r=s.getUint32(i);i+=4,this.unit=1&r,this.systolic=s.getUint16(i),i+=2,this.diastolic=s.getUint16(i),i+=2,this.meanPressure=s.getUint16(i),i+=2;let a=s.getUint16(i);if(i+=2,r>>=1,h(r,0)&&(this.pulseRate=s.getUint16(i),i+=2),h(r,1)&&(this.userId=s.getUint8(i)<0?s.getUint8(i)+256:s.getUint8(i),i++),h(r,2)&&(this.utc=12622752e5+1e3*s.getUint32(i),i+=4),h(r,3)&&(this.bodyMovementDetection=h(a,0)),h(r,4)&&(this.cuffFitDetection=h(a,1)),h(r,5)&&(this.irregularPulseDetection=h(a,2)),this.pulseOut=h(a,3),h(r,6)&&(this.measurementPositionDetection=h(a,4)),this.rebind=h(a,5),this.hsd=h(a,6),h(r,7)&&(this.timeZone=s.getUint8(i),i++),h(r,8)){let t=e.slice(i,i+7);this.timeStamp=n(t),i+=7}}}var l,f=Object.freeze({__proto__:null,ResetReq:class{constructor(){this.tag=65535,this.serviceId=i}getBytes(){let e=new ArrayBuffer(6),t=new DataView(e);t.setUint8(0,241),t.setUint8(1,0),t.setUint8(2,9),t.setUint8(3,0);let i=new ArrayBuffer(2);new DataView(i).setUint8(0,9);let s=this.getA6CRC16(i),n=new DataView(s);return t.setUint8(4,n.getUint8(0)),t.setUint8(5,n.getUint8(1)),e}getA6CRC16(e){let t=65535,i=new DataView(e);for(let e=0;e<i.byteLength;e++){t^=i.getUint8(e);for(let e=0;e<8;e++)1&t?(t>>>=1,t^=40961):t>>>=1}let s=new ArrayBuffer(2);return new DataView(s).setUint16(0,t,!0),s}},BPScaleData:u});var g={errorCode:function(e,t,i,s){return l.errorCode(e,t,i,s)},getDeviceInfo:function(e){return l.getDeviceInfo(e)},Logger:{debug:function(...e){l.Logger.debug(...e)},info:function(...e){l.Logger.info(...e)},warn:function(...e){l.Logger.warn(...e)},error:function(...e){l.Logger.error(...e)}}};class p{constructor(){this.size=0,this.values=[]}build(){let e=new ArrayBuffer(this.size),t=new DataView(e);return this.values.forEach((({byteOffset:e,method:i,value:s,littleEndian:n,limitSize:r})=>{if("setBuffer"===i){let i=new DataView(s),n=i.byteLength;r&&(n=Math.min(r,n));for(let s=0;s<n;s++)t.setUint8(e+s,i.getUint8(s))}else"setUint8"===i?t[i](e,s):"setInt8"===i?s>0?t.setUint8(e,255&s):t.setUint8(e,s+256&255):"setUint24"===i?n?t.setUint32(e,s):t.setUint32(e,s<<8,!1):t[i](e,s,n)})),e}appendUint8(e){return this.values.push({byteOffset:this.size,method:"setUint8",value:e}),this.size++,this}appendUint16(e,t){return this.values.push({byteOffset:this.size,method:"setUint16",value:e,littleEndian:t}),this.size+=2,this}appendUint32(e,t){return this.values.push({byteOffset:this.size,method:"setUint32",value:e,littleEndian:t}),this.size+=4,this}appendBuffer(e,t){return this.values.push({byteOffset:this.size,method:"setBuffer",value:e,limitSize:t}),this.size+=t||e.byteLength,this}appendUint24(e,t){return this.values.push({byteOffset:this.size,method:"setUint24",value:e,littleEndian:t}),this.size+=3,this}appendInt8(e){return this.values.push({byteOffset:this.size,method:"setInt8",value:e}),this.size++,this}appendInt16(e,t){return this.values.push({byteOffset:this.size,method:"setInt16",value:e,littleEndian:t}),this.size+=2,this}appendFloat32(e,t){return this.values.push({byteOffset:this.size,method:"setFloat32",value:e,littleEndian:t}),this.size+=4,this}}const m=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117];function v(e,t){if(6==e.byteLength&&6==t.byteLength){let i=new DataView(e),s=new DataView(t),n="";for(let t=0;t<e.byteLength;t++){n+=(255&(s.getUint8(t)^i.getUint8(t))).toString(16).padStart(2,"0")}return n.toLowerCase()}return""}function y(e){if(!e||e.length<12)return"";let t=w(e),i=new DataView(t),s=(i.getUint8(0)<<16)+(i.getUint8(1)<<8)+i.getUint8(2),n=(i.getUint8(3)<<16)+(i.getUint8(4)<<8)+i.getUint8(5);return s.toString(10).padStart(8,"0")+n.toString(10).padStart(8,"0")}function w(e){if(!e||0===e.length)return new ArrayBuffer(0);let t=e.length/2;if(t<1)return new ArrayBuffer(0);let i=new ArrayBuffer(t),s=new DataView(i);for(let i=0;i<t;i++){let t=e.substr(2*i,2),n=parseInt(t,16);s.setUint8(i,n)}return s.buffer}function U(e){if(!e||0===e.byteLength)return"";let t=new DataView(e),i="";for(let e=0;e<t.byteLength;e++)i+=t.getUint8(e).toString(16).padStart(2,"0").toUpperCase();return i}class b{constructor(e){this.tag=1,this.deviceId=e}getBytes(){let e=(new p).appendUint16(this.tag),t=w(this.deviceId);return e.appendBuffer(t),e.appendUint8(1),e.build()}}class I{constructor(e,t){this.dataType="RegisterResp";let i=new DataView(e);this.isSuccess=1===i.getUint8(0)}}class S{constructor(e,t){this.tag=3,this.userNumber=e,this.result=t}getBytes(){return(new p).appendUint16(this.tag).appendUint8(this.userNumber).appendUint8(this.result).build()}}class B{constructor(e,t){this.dataType="BindResp";let i=new DataView(e);this.isSuccess=1===i.getUint8(0)}}function D(e,t,i){return e?(t.getUint8(i+2)<<16)+(t.getUint8(i+1)<<8)+t.getUint8(i):(t.getUint8(i)<<16)+(t.getUint8(i+1)<<8)+t.getUint8(i+2)}class F{constructor(e,t=0){this.values=[],this.parseSize=0,this.originalBuffer=e,this.index=t,this.parseSize=0,this.dataView=new DataView(e),this.index=t}build(e){if(!this.originalBuffer||this.originalBuffer.byteLength<=0)return null;e||(e={});let t=this.dataView;return this.values.forEach((({byteOffset:i,method:s,key:r,size:a,parseKey:o,littleEndian:c})=>{i+=this.parseSize;try{if("getHexString"===s)e[r]=n(this.originalBuffer.slice(i,i+a));else if("getStringByParse"===s){let t=e[o];this.parseSize+=t,e[r]=d(this.originalBuffer.slice(i,i+t))}else if("getString"===s)e[r]=d(this.originalBuffer.slice(i,i+a));else if("getBuffer"===s)e[r]=this.originalBuffer.slice(i,i+a);else if("getUint8"===s)e[r]=t.getUint8(i);else if("Uint24"===s)e[r]=D(c,t,i);else if("Uint8Array"===s)e[r]=[].slice.call(new Uint8Array(this.originalBuffer.slice(i,i+a)));else if("Uint16Array"===s){let t=[].slice.call(new Uint16Array(this.originalBuffer.slice(i,i+a)));e[r]=c?t:function(e){if(e&&e.length>0){let t=[];for(let i=0;i<e.length;i++){let s=e[i];s=((255&s)<<8)+(s>>8&255),t.push(s)}return t}return[]}(t)}else if("SFloat"===s){let s=t.getUint8(i),n=((15&s)<<8)+t.getUint8(i+1),a=(240&s)>>>4,o=a;(8&a)>0&&(o=a-16);let c=Math.pow(10,o);e[r]=n*c}else if("Float"===s){let s=t.getUint8(i),n=D(c,t,i+1),a=Math.pow(10,(15&s)-16);e[r]=n*a}else e[r]=t[s](i,c)}catch(e){}})),e}getUint24(e,t=!1){return this.values.push({byteOffset:this.index,method:"Uint24",key:e,littleEndian:t}),this.index+=3,this}getSFloat(e){return this.values.push({byteOffset:this.index,method:"SFloat",key:e}),this.index+=2,this}getFloat(e,t=!1){return this.values.push({byteOffset:this.index,method:"Float",key:e,littleEndian:t}),this.index+=4,this}getUint8Array(e,t){return this.values.push({byteOffset:this.index,size:t,method:"Uint8Array",key:e}),this.index+=t,this}getUint16Array(e,t,i=!1){return this.values.push({byteOffset:this.index,size:t,method:"Uint16Array",key:e,littleEndian:i}),this.index+=t,this}getUint8(e){return this.values.push({byteOffset:this.index,method:"getUint8",key:e}),this.index++,this}getUint16(e,t=!1){return this.values.push({byteOffset:this.index,method:"getUint16",key:e,littleEndian:t}),this.index+=2,this}getUint32(e,t=!1){return this.values.push({byteOffset:this.index,method:"getUint32",key:e,littleEndian:t}),this.index+=4,this}getBuffer(e,t){return this.values.push({byteOffset:this.index,size:t,method:"getBuffer",key:e}),this.index+=t,this}getByteOffset(){return this.index}getString(e,t){return this.values.push({byteOffset:this.index,size:t,method:"getString",key:e}),this.index+=t,this}getHexString(e,t){return this.values.push({byteOffset:this.index,size:t,method:"getHexString",key:e}),this.index+=t,this}getStringSizeByParse(e,t){return this.values.push({byteOffset:this.index,parseKey:t,method:"getStringByParse",key:e}),this}getIndex(){return this.index}readUint8(){let e=this.index;return this.index+=1,this.dataView.getUint8(e)}readUint16(e=!1){let t=this.index;return this.index+=2,this.dataView.getUint16(t,e)}readInt16(e=!1){let t=this.index;return this.index+=2,this.dataView.getInt16(t,e)}readUint24(e=!1){let t=this.index;return this.index+=3,D(e,this.dataView,t)}readUint32(e=!1){let t=this.index;return this.index+=4,this.dataView.getUint32(t,e)}readInt32(e=!1){let t=this.index;return this.index+=4,this.dataView.getInt32(t,e)}readSfloat(){let e=this.index,t=this.dataView;this.index+=2;let i=t.getUint8(e),s=(240&i)>>>4,n=s;return(8&s)>0&&(n=s-16),(((15&i)<<8)+t.getUint8(e+1))*Math.pow(10,n)}readFloat(e=!1){let t=this.index;this.index+=4;let i=this.dataView.getUint8(t);return D(e,this.dataView,t+1)*Math.pow(10,(15&i)-16)}readString(e){return d(this.readBuffer(e))}readBuffer(e){let t=this.index;return this.index+=e,this.dataView.buffer.slice(t,t+e)}}class R{constructor(e,t){this.dataType="LoginReq";let i=new F(e);this.code=i.readBuffer(6),this.userNumber=i.readUint8(),this.battery=i.readUint8()}}class C{constructor(e,t,i,s){this.tag=8,this.isSuccess=e,this.code=t,this.workType=i,this.platform=s}getBytes(){return(new p).appendUint16(this.tag).appendUint8(this.isSuccess?1:0).appendBuffer(this.code).appendUint8(this.workType).appendUint8(this.platform).build()}}class x extends class{constructor(e,t,i,s){this.tag=4098,this.flag=e,this.utc=t,this.timezone=i,s&&(this.timeStamp=s)}getBytes(){let e=(new p).appendUint16(this.tag).appendUint8(this.flag);return(1&this.flag)>0&&e.appendUint32(this.utc),(2&this.flag)>0&&e.appendUint8(this.timezone),(4&this.flag)>0&&e.appendBuffer(this.timeStamp),e.build()}}{constructor(){super(...arguments),this.tag=4354}}function T(){return((new Date).getTime()-12622752e5)/1e3}function A(e){return new Promise(((t,i)=>{setTimeout((()=>{t(null)}),e)}))}var L=function(e,t,i,s){return new(i||(i=Promise))((function(n,r){function a(e){try{c(s.next(e))}catch(e){r(e)}}function o(e){try{c(s.throw(e))}catch(e){r(e)}}function c(e){var t;e.done?n(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(a,o)}c((s=s.apply(e,t||[])).next())}))},k=[{name:"DisableCharacteristic",serviceId:c("A610"),characteristicId:c("A621"),actionType:3},{name:"EnableCharacteristic",serviceId:c("A610"),characteristicId:c("A620"),actionType:2},{name:"EnableCharacteristic",serviceId:c("A610"),characteristicId:c("A625"),actionType:2},{name:"EnableCharacteristic",serviceId:c("A610"),characteristicId:c("A621"),actionType:2,when:e=>!e.deviceInfo.isRegister},{name:"RegisterReq",actionType:1,when:e=>!e.deviceInfo.isRegister,pushData(e){return L(this,void 0,void 0,(function*(){yield A(300);let t=yield e.listeners.onApplyRegisterId(Object.assign({},e));g.Logger.info("申请registerId",t);let i=new b(t);return t&&(e.deviceInfo.lzDeviceId=t,e.deviceInfo.id=t,e.deviceInfo.sn=y(t)),i}))},await:{dataType:"RegisterResp",timeout:15e3,didReceive(e,t){if("RegisterResp"===e.dataType){return e.isSuccess?g.errorCode(0):g.errorCode(5)}return!0}}},{name:"WaitLoginReq",when:e=>!e.deviceInfo.isRegister,actionType:0,await:{dataType:"LoginReq",didReceive(e,t){if("LoginReq"===e.dataType){let i=e;t.loginReq=i;let s=t.deviceInfo.mac,n=v(i.code,w(s));return n&&(t.deviceInfo.lzDeviceId=n,t.deviceInfo.id=n,t.deviceInfo.sn=y(n)),t.userNumber=i.userNumber,t.listeners&&t.listeners.onReadDeviceId&&t.listeners.onReadDeviceId(n),g.errorCode(0)}return!0}}},{name:"EnableCharacteristic",serviceId:c("A610"),characteristicId:c("A621"),actionType:2,when:e=>e.deviceInfo.isRegister,await:{dataType:"LoginReq",didReceive(e,t){if("LoginReq"===e.dataType){let i=e;t.loginReq=i;let s=t.deviceInfo.mac,n=v(i.code,w(s));return n&&(t.deviceInfo.lzDeviceId=n,t.deviceInfo.id=n,t.deviceInfo.sn=y(n)),t.deviceInfo.battery=i.battery,t.userNumber=i.userNumber,t.listeners&&t.listeners.onReadDeviceId&&t.listeners.onReadDeviceId(n),g.errorCode(0)}return!0}}},{name:"LoginResp",actionType:1,pushData:e=>(e.deviceInfo.isRegister=!0,new C(!0,e.loginReq.code,1,o()?1:2))},{name:"SyncTime",actionType:1,pushData:e=>new x(1,T())},{name:"BindResult",actionType:1,pushData:e=>new S(1,1),await:{dataType:"BindResp",didReceive(e,t){if("BindResp"===e.dataType){return e.isSuccess?g.errorCode(0):g.errorCode(5)}return!0}}}];class z extends class{constructor(e,t=1){this.tag=18433,this.userNumber=e,this.result=t}getBytes(){return(new p).appendUint16(this.tag).appendUint8(this.userNumber).appendUint8(this.result).build()}}{constructor(){super(...arguments),this.tag=18689}}var O=[{name:"DisableCharacteristic",serviceId:e,characteristicId:c("A621"),actionType:3},{name:"EnableCharacteristic",serviceId:e,characteristicId:c("A620"),actionType:2},{name:"EnableCharacteristic",serviceId:e,characteristicId:c("A625"),actionType:2},{name:"EnableCharacteristic",serviceId:e,characteristicId:c("A621"),actionType:2,when:e=>e.deviceInfo.isRegister,await:{dataType:"LoginReq",didReceive(e,t){if("LoginReq"===e.dataType){let i=e;t.loginReq=i;let s=t.deviceInfo.mac,n=v(i.code,w(s));return t.deviceInfo.deviceId=n,t.deviceInfo.id=n,t.userNumber=i.userNumber,t.listeners&&t.listeners.onReadDeviceId&&t.listeners.onReadDeviceId(n),g.errorCode(0)}}}},{name:"LoginResp",actionType:1,pushData:e=>new C(!0,e.loginReq.code,0,o()?1:2)},{name:"SyncTime",actionType:1,pushData:e=>new x(1,T())},{name:"SyncData",actionType:1,pushData:e=>new z(e.userNumber)},{name:"获取电量",actionType:4,serviceId:e,characteristicId:t,await:{didReceive:(e,t)=>"Battery"!==e.dataType||g.errorCode(0)}}];const V="00002A29-0000-1000-8000-00805F9B34FB",P="00002A24-0000-1000-8000-00805F9B34FB",E="00002A25-0000-1000-8000-00805F9B34FB",N="00002A27-0000-1000-8000-00805F9B34FB",q="00002A26-0000-1000-8000-00805F9B34FB",M="00002A28-0000-1000-8000-00805F9B34FB",$="00002A23-0000-1000-8000-00805F9B34FB";class j{parseAdvertisementData(e,t){return{name:e.name,localName:t.localName,deviceId:e.deviceId,manufacturerData:t.advertisData,serviceUUIDs:t.advertisServiceUUIDs,serviceData:t.serviceData,RSSI:t.RSSI,mac:undefined,isSystemPaired:!1,timestamp:new Date,isRegister:!0}}parseDeviceInfo(e,t){let i={};return i.deviceId=e.deviceId,i.name=e.name,t&&t.size>0&&t.forEach(((e,t)=>{switch(t){case E:e&&e.byteLength>=12&&(i.mac=d(e.slice(0,12)));break;case q:i.firmwareVersion=d(e);break;case N:i.hardwareVersion=d(e);break;case V:i.manufacture=d(e);break;case M:i.softwareVersion=d(e);break;case P:i.model=d(e);break;case $:e&&e.byteLength>=6&&(i.lzDeviceId=U(e.slice(0,6)))}})),i}}class W{constructor(e,t,i=1001,s=100){this.actions=e,this.context=t,this.priority=i,this.id=s}}class _{constructor(e,t,i=1e3,s=200){this.priority=1e3;let n=[];this.priority=i,this.context=t,this.id=s,e.forEach((e=>{let t={name:"push",actionType:1,pushData:()=>e};n.push(t)})),this.actions=n}}class H{constructor(e,t){this.priority=2e3,this.id=255,this.serviceId=e;let i=this;this.actions=[{name:"获取设置项",actionType:4,serviceId:e,characteristicId:t,await:{timeout:3e3,didReceive:(e,t)=>"Battery"!==e.dataType||(i.responseData=g.errorCode(0,e),i.responseData)}}]}}class K{constructor(e,t){this.dataType="InitReq";let i=new F(e);this.flag=i.readUint8(),1&this.flag&&(this.mtu=i.readUint8()),2&this.flag&&(this.slaveLatency=i.readUint8()),4&this.flag&&(this.supervisoryTimeout=i.readUint8())}}var Z=function(e,t,i,s){return new(i||(i=Promise))((function(n,r){function a(e){try{c(s.next(e))}catch(e){r(e)}}function o(e){try{c(s.throw(e))}catch(e){r(e)}}function c(e){var t;e.done?n(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(a,o)}c((s=s.apply(e,t||[])).next())}))};class G{constructor(e,t){this.buf=e,this.isClear=!1,this.timeout=5e3,this.sid=t||Math.random(),this.trySender=(e,t)=>Z(this,void 0,void 0,(function*(){try{return this.sender(e,t)}catch(e){if(this.isClear)return g.errorCode(4);this.callback(e)}}))}didReceiveData(e){}start(){}resetTimeout(){this.timeoutId&&(clearTimeout(this.timeoutId),this.timeoutId=null),this.timeoutId=setTimeout((()=>{this.callback(g.errorCode(3,this.tag))}),this.timeout)}clear(){this.isClear=!0,this.timeoutId&&(clearTimeout(this.timeoutId),this.timeoutId=null),this.callback(g.errorCode(4))}callback(e){this.timeoutId&&(clearTimeout(this.timeoutId),this.timeoutId=null),e.success?g.Logger.debug("session 会话结束了",e.data.toString(16),U(e.value)):g.Logger.warn("会话失败了",e),this.completion&&(e.sid=this.sid,this.completion(e),this.completion=null)}}class J extends G{constructor(e,t){super(e),this.needAck=!1,this.tag=t}start(){return Z(this,void 0,void 0,(function*(){let e=this.decodeToFrames(this.buf);if(e&&e.length<1)return void this.callback(g.errorCode(4,this.tag));this.resetTimeout();let t=this.sendChar;for(let i=0;i<e.length;i++){let s=e[i];try{yield this.trySender(s,t)}catch(e){return void this.callback(g.errorCode(1,this.tag))}}this.needAck||this.callback(g.errorCode(0,this.tag))}))}decodeToFrames(e){let t=e.byteLength,i=Math.ceil(t/this.mtu),s=[];for(let t=0;t<i;t++){let i=t*this.mtu;s.push(e.slice(i,i+this.mtu))}return s}}class Q extends G{didReceiveData(e){this.receiveBuf=e.value,this.callback(g.errorCode(0,this.tag,this.receiveBuf))}start(){this.didReceiveData({value:this.buf})}checkFinished(){if(!this.receiveBuf)return!1;if(this.firstFrame.len&&this.firstFrame.len<=this.receiveBuf.byteLength)return!0;if(this.firstFrame.totalFrames){if(1==this.firstFrame.totalFrames)return!0;if(this.preFrame&&this.preFrame.index===this.firstFrame.totalFrames-1)return!0}return!1}decodeFirstFrame(e){throw new Error("如果使用默认的逻辑，则需要实现这个逻辑")}decodeOtherFrame(e){throw new Error("如果使用默认的逻辑，则需要实现这个逻辑")}}class X{constructor(e){this.sendSessions=[],this.filterServiceIds=[],this.mtu=20,this.context=e}sendData(e,t,i,s){let n=this.createSenderSession(e,t,i);return n.sender=this.sender,n.mtu=this.mtu,n.tag=t,new Promise(((e,t)=>{n.completion=i=>{this.sendingSession=null,s&&s(i),this.tryToDispatchSession(),i.success?e(i):t(i)},this.sendSessions.push(n),this.tryToDispatchSession()}))}clear(){try{this.sendSessions.forEach((e=>{e.clear()})),this.sendSessions.length=0,this.sendingSession&&(this.sendingSession.clear(),this.sendingSession=null)}catch(e){}}updateMtu(e){this.mtu=e}didReceiveData(e){if(this.receiveringSession)this.receiveringSession.didReceiveData(e);else{this.receiveringSession=this.createReceiveSession(e.value),this.receiveringSession.mtu=this.mtu,this.receiveringSession.sender=this.sender;let t=this;this.receiveringSession.completion=e=>{t.receiveringSession&&t.receiveringSession.sid===e.sid&&(t.receiveringSession=null),t.tryToDispatchSession(),t.listener&&t.listener(e)},this.receiveringSession.start()}}createSenderSession(e,t,i){return new J(e,t)}createReceiveSession(e){return new Q(e)}tryToDispatchSession(){if(this.sendingSession||0===this.sendSessions.length||this.receiveringSession)return;let e=this.sendSessions.shift();e&&(this.sendingSession=e,e.start())}}var Y=function(e,t,i,s){return new(i||(i=Promise))((function(n,r){function a(e){try{c(s.next(e))}catch(e){r(e)}}function o(e){try{c(s.throw(e))}catch(e){r(e)}}function c(e){var t;e.done?n(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(a,o)}c((s=s.apply(e,t||[])).next())}))};class ee extends Q{didReceiveData(e){let t=new DataView(e.value);if(this.checkIsFirstFrame(t))this.firstFrame=this.decodeFirstFrame(t),this.receiveBuf=this.firstFrame.buf;else{let e=this.decodeOtherFrame(t);if(this.preFrame){if(this.preFrame.index!==e.index-1)return void this.callback(g.errorCode(5,this.tag));this.preFrame=e}else this.preFrame=e;this.receiveBuf=function(...e){if(!e)return new ArrayBuffer(0);let t=0;for(let i=0;i<e.length;i++)t+=e[i].byteLength;let i=new ArrayBuffer(t),s=new DataView(i),n=0;for(let i=0;i<e.length;i++){let r=e[i],a=new DataView(r);for(let e=0;e<r.byteLength&&n<t;e++)s.setUint8(n,a.getUint8(e)),n+=1}return i}(this.receiveBuf,e.buf)}this.checkFinished()?this.sendAck():this.resetTimeout()}checkIsFirstFrame(e){return 0==(15&e.getUint8(0))}decodeFirstFrame(e){let t=new F(e.buffer),i=t.readUint8()>>4&15;t.readUint8();let s=t.readUint16(),n=t.readBuffer(this.mtu-3);return this.tag=s,{cmd:s,totalFrames:i,buf:n}}decodeOtherFrame(e){let t=new F(e.buffer),i=15&t.readUint8();return t.readUint8(),{index:i,buf:t.readBuffer(this.mtu-2)}}sendAck(){return Y(this,void 0,void 0,(function*(){try{let e=(new p).appendUint8(0).appendUint8(1).appendUint8(1);yield this.trySender(e.build(),this.sendChar)}catch(e){return void this.callback(g.errorCode(1,this.tag))}let e=g.errorCode(0,this.tag,this.receiveBuf);this.callback(e)}))}}class te extends J{constructor(){super(...arguments),this.needSettingResultConfirm=!1,this.needAck=!0}didReceiveData(e){1===new DataView(e.value).getUint8(2)&&(this.needSettingResultConfirm?g.Logger.warn("需要等待设置的确认回包，不需要处理",this.tag):this.callback(g.errorCode(0,this.tag)))}didReceiveSettingConfrim(e){let t=new DataView(e),i=t.getUint16(0),s=t.getUint8(2);i===this.tag?1==s?this.callback(g.errorCode(0,this.tag)):this.callback(g.errorCode(5,this.tag)):g.Logger.warn("设置项命令不一致",i,this.tag)}decodeToFrames(e){let t=this.mtu-2,i=e.byteLength;if(i<=t){let t=16,i=new p;return i.appendUint8(t),i.appendUint8(e.byteLength),i.appendBuffer(e),[i.build()]}{let t=[],s=this.mtu-2,n=Math.ceil((i+4)/s),r=function(e,t=0){let i=0,s=4294967295&t;if(null==e)return s;let n=new Uint8Array(e);for(i=0;i<e.byteLength;i++){let e=255&(s^n[i]);s=m[e]^s>>>8}return(4294967295&s)>>>0}(e),a=new p;a.appendBuffer(e).appendUint32(r),a.build();for(let r=0;r<n;r++){let a=new p,o=Math.min(i+4-this.mtu*r,this.mtu),c=s*r;a.appendUint8(n<<4+r),a.appendUint8(o),a.appendBuffer(e.slice(c,c+o)),t.push(a.build())}return t}}}class ie extends X{didReceiveData(e){if("0000A625-0000-1000-8000-00805F9B34FB"==e.characteristicId)this.sendingSession?this.sendingSession.didReceiveData(e):g.Logger.warn("cValue数据丢弃",e);else if("0000A621-0000-1000-8000-00805F9B34FB"==e.characteristicId||"0000A620-0000-1000-8000-00805F9B34FB"==e.characteristicId){0==(15&new DataView(e.value).getUint8(0))?(this.receiveringSession=this.createReceiveSession(e.value),this.receiveringSession.mtu=this.mtu,this.receiveringSession.sender=this.sender,this.receiveringSession.completion=e=>{if(g.Logger.warn("sessionManager ",e),this.receiveringSession&&this.receiveringSession.sid===e.sid&&(this.receiveringSession=null),4096===e.data||4352===e.data){if(this.sendingSession){let t=this.sendingSession;e&&e.value&&t.needSettingResultConfirm&&t.didReceiveSettingConfrim(e.value)}this.tryToDispatchSession()}else this.tryToDispatchSession(),this.listener&&e.success&&this.listener(e)},this.receiveringSession.start()):this.receiveringSession&&this.receiveringSession.didReceiveData(e)}else e.characteristicId===t&&this.listener&&this.listener(g.errorCode(0,e.characteristicId,e.value))}}class se extends ee{constructor(){super(...arguments),this.sendChar={serviceId:e,charId:"0000A622-0000-1000-8000-00805F9B34FB",writeType:0}}}class ne extends te{constructor(){super(...arguments),this.sendChar={serviceId:e,charId:"0000A624-0000-1000-8000-00805F9B34FB",writeType:1}}}class re extends ie{constructor(){super(...arguments),this.settings=[4354]}createSenderSession(e,t){let i=new ne(e),s=!1;return this.settings&&this.settings.indexOf(t)>=0&&(s=!0),i.needSettingResultConfirm=s,i}createReceiveSession(e){return new se(e)}}class ae extends J{constructor(){super(...arguments),this.sendChar={serviceId:i,charId:"00001881-0000-1000-8000-00805F9B34FB",writeType:1}}}class oe extends X{createSenderSession(e,t){return new ae(e)}}var ce=function(e,t,i,s){return new(i||(i=Promise))((function(n,r){function a(e){try{c(s.next(e))}catch(e){r(e)}}function o(e){try{c(s.throw(e))}catch(e){r(e)}}function c(e){var t;e.done?n(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(a,o)}c((s=s.apply(e,t||[])).next())}))};class he extends J{constructor(){super(...arguments),this.sendChar={serviceId:s,charId:"00001531-1212-EFDE-1523-785FEABCD123",writeType:0},this.sendPackageChar={serviceId:s,charId:"00001532-1212-EFDE-1523-785FEABCD123",writeType:0},this.numberOfpacket=6,this.tag=255}start(){return ce(this,void 0,void 0,(function*(){this.sendOpCode(1)}))}didReceiveData(e){let t=new F(e.value),i=t.readUint8();if(17===i){let e=t.readUint32(!0);this.currentBinInfo.sendOffset=e;let i=this.otaParse.getUpgradeProgress(this.currentBinInfo.sendOffset);this.otaParse.onUpgradeProcess&&this.otaParse.onUpgradeProcess(100*i),this.currentBinInfo.sendOffset<this.currentBinInfo.frameSize&&this.sendPackage()}else if(16===i){let e=t.readUint8();if(1!=t.readUint8())return void this.callback(g.errorCode(5,this.tag));switch(e){case 1:this.sendOpCode(8);break;case 3:this.otaParse.addDoneSize(this.currentBinInfo.frameSize),this.sendOpCode(4);break;case 4:this.sendOpCode(1)}}}callback(e){this.timeoutId&&clearTimeout(this.timeoutId),this.completion&&(this.otaParse.onUpgradeComplete&&this.otaParse.onUpgradeComplete(e.code,e.msg),this.completion(e),this.completion=null)}sendStartBin(){return ce(this,void 0,void 0,(function*(){if(this.currentBinInfo=this.otaParse.getNextBinInfo(),this.currentBinInfo){let e=(new p).appendUint8(1).appendUint8(this.currentBinInfo.code).build();yield this.trySender(e,this.sendChar),yield A(1),this.sendImageSize()}else this.sendOpCode(5),this.callback(g.errorCode(0,this.tag))}))}sendImageSize(){return ce(this,void 0,void 0,(function*(){let e=this.currentBinInfo,t=new ArrayBuffer(14),i=new DataView(t),s=0;i.setUint32(s,e.upgradeFileSize,!0),s+=4;let n=this.otaParse.model;for(let e=n.length;e<8;e++)n+=" ";n=n.substring(0,8);let a=function(e){if(!e||0==e.length)return new ArrayBuffer(0);let t="";for(let i=0;i<e.length;i++)t+=","+r(e.charCodeAt(i));return new Uint8Array(t.match(/[\da-f]{2}/gi).map((function(e){return parseInt(e,16)}))).buffer}(n),o=new DataView(a);for(let e=0;e<4;e++)i.setUint8(e+s,o[e]);s+=4;let c=new DataView(e.version);for(let e=0;e<4;e++)i.setUint8(e+s,c.getUint8(e));s+=4,i.setUint16(s,e.crcBuffer,!0),s+=2,yield this.trySender(t,this.sendPackageChar),this.resetTimeout()}))}sendOpCode(e){return ce(this,void 0,void 0,(function*(){switch(e){case 1:yield this.sendStartBin();break;case 8:yield this.receiptNotificationReq(),yield this.sendOpCode(3),this.sendPackage();break;default:let t=(new p).appendUint8(e).build();yield this.trySender(t,this.sendChar)}}))}receiptNotificationReq(){let e=(new p).appendUint8(8).appendUint16(this.numberOfpacket,!0).build();return this.trySender(e,this.sendChar)}sendPackage(){return ce(this,void 0,void 0,(function*(){let e=this.currentBinInfo.sendOffset;for(let t=e;t<e+this.numberOfpacket;t++){let e=this.currentBinInfo.imageList[t];e&&(this.currentBinInfo.sendOffset+=1,yield this.trySender(e,this.sendPackageChar))}this.currentBinInfo.sendOffset+=e,this.resetTimeout()}))}}class de extends X{didReceiveData(e){this.sendingSession&&this.sendingSession.didReceiveData(e)}createSenderSession(e,t,i){let s=new he(e);return s.otaParse=t,s}}const ue=[{binInfoOffset:32,code:4},{binInfoOffset:64,code:8},{binInfoOffset:96,code:9}];class le{constructor(e){this.onUpgradeComplete=e.onUpgradeComplete,this.onUpgradeProcess=e.onUpgradeProcess,this.model=e.model;let t=e.fileBuffer;this.binIndex=-1,this.doneFrameSize=0;let i=new DataView(t),s=0,r=t.slice(s,s+4);s+=4;let a=t.slice(s,s+4);s+=4;let o=i.getUint32(s,!1);s+=4;let c=i.getUint32(s,!1);s+=4;let h=t.slice(s,s+16),d=0,u=[];for(let e=0;e<ue.length;e++){let i=this.createBinInfo(t,ue[e]);i&&(u.push(i),d+=i.upgradeFileSize)}this.magic=r,this.version=a,this.size=o,this.binWithCrc12Size=d,this.binInfoList=u,this.md5=h,this.binWithCrc12FrameSize=d/20,g.Logger.info(`OTA总大小:${o} binWithCrc12Size${d} version:${n(a)} utc:${c} binInfoList size:${u.length}`)}addDoneSize(e){this.doneFrameSize+=e}getNextBinInfo(){return this.binIndex++,g.Logger.info("获取下一个固件包",this.binIndex),this.binInfoList[this.binIndex]}getUpgradeProgress(e){return(this.doneFrameSize+e)/this.binWithCrc12FrameSize}createBinInfo(e,t){let i=t.binInfoOffset,s=t.code,r=new DataView(e),a=e.slice(i,i+4),o=r.getUint32(i+4,!1),c=r.getUint32(i+8,!1);if(0===c||0===o)return g.Logger.info(`固件类型:${s} 无数据 `),null;let h=r.getUint32(i+12,!1);e.slice(i+12,i+12+4);let d=e.slice(i+16,i+16+1),u=e.slice(c,c+o),l=new ArrayBuffer(4);new DataView(l).setUint32(0,h,!0);let f=function(e,t){let i=new Uint8Array(e.byteLength+t.byteLength);return i.set(new Uint8Array(e),0),i.set(new Uint8Array(t),e.byteLength),i.buffer}(u,l);g.Logger.info("crc16小端"+n(l));let p=f.byteLength,m=[],v=0;for(;v<p-20;)m.push(f.slice(v,v+=20));p!==v&&m.push(f.slice(v,p));let y={imageList:m,upgradeFileSize:u.byteLength,sendOffset:0,frameSize:m.length,crcBuffer:h,version:a,md5:d,code:s,buf:f};return g.Logger.info(`固件类型:${s} 大小(包括crc4字节):${y.upgradeFileSize} 地址：${c}  crc:${h} frameSize: ${m.length}`),y}}class fe{constructor(e,t){this.tag=e,this.serviceId=t}getBytes(){return(new p).build()}}class ge{constructor(e,t,i){if(this.dataType="Battery",this.cmd=t,e.byteLength>=1){let t=new DataView(e);this.battery=t.getUint8(0),i.battery=this.battery}}}var pe=[{name:"EnableCharacteristic",serviceId:e,characteristicId:c("A621"),actionType:2,when:e=>e.deviceInfo.isRegister,await:{dataType:"LoginReq",didReceive(e,t){if("LoginReq"===e.dataType){let i=e;t.loginReq=i;let s=t.deviceInfo.mac,n=v(i.code,w(s));return n&&(t.deviceInfo.lzDeviceId=n,t.deviceInfo.id=n,t.deviceInfo.sn=y(n)),t.userNumber=i.userNumber,t.listeners&&t.listeners.onReadDeviceId&&t.listeners.onReadDeviceId(n),g.errorCode(0)}}}},{name:"LoginResp",actionType:1,pushData:e=>new C(!0,e.loginReq.code,0,o()?1:2)},{name:"SyncTime",actionType:1,pushData:e=>new x(1,T())},{name:"SyncData",actionType:1,pushData:e=>new z(e.userNumber)},{name:"获取电量",actionType:4,serviceId:e,characteristicId:t,await:{didReceive:(e,t)=>"Battery"!==e.dataType||g.errorCode(0)}}];const me={uuid:e,name:"bloodpressure",bind:{protocolType:0,actions:k},sync:{protocolType:1,actions:O},parser:new class{constructor(){this.normalParser=new j}parseAdvertisementData(e,t){let i,s=e.name,n=t.localName,r=e.deviceId,a=!1,o=t.advertisData;if(o&&o.byteLength>=6){let e=new DataView(o),t=o.byteLength;i=U(o.slice(t-6,t)).toUpperCase(),a=1===e.getUint8(t-7)}return{name:s,localName:n,deviceId:r,manufacturerData:o,serviceUUIDs:t.advertisServiceUUIDs,serviceData:t.serviceData,RSSI:t.RSSI,mac:i,isSystemPaired:!1,timestamp:new Date,isRegister:a,model:n}}parseDeviceInfo(e,t){let i=this.normalParser.parseDeviceInfo(e,t),s=t.get(c("2A25"));return s.byteLength>=6&&(s=function(e){if(!e||0===e.byteLength)return;let t=new DataView(e),i=new ArrayBuffer(e.byteLength),s=new DataView(i);for(let i=0;i<e.byteLength;i++){let n=e.byteLength-i-1;s.setUint8(i,t.getUint8(n))}return s.buffer}(s.slice(0,6)),i.mac=U(s)),i}},dataParser:new class{parseData(e,i,s){let n=e.data,r=e.value;switch(n){case 18690:return new u(r,n);case 2:return new I(r,n);case 4:return new B(r,n);case 7:return new R(r,n);case 9:return new K(r,n);case 8198:return null;case t:return new ge(r,n,s.deviceInfo);default:return g.Logger.warn("未知数据, 没有处理"+n),null}}createSession(t){return t===e?new re:t===i?new oe:t===s?new de:void 0}otaAction(e,t){t.model=e.deviceInfo.model;let i=new le(t),n=new fe(i,s);return new _([n],e,1100)}reStartSyncAction(e){return new W(pe,e,1250)}getSettingMutipleAction(i,s){if(255===s)return new H(e,t);g.Logger.error("为实现")}bindSuccessShouldDisconnect(e){return!0}},setUtils:function(e){l=e}};var ve={settingFactory:f,proto:me};return module.exports={proto:me,settingFactory:f},ve}));

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1646653978716);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map