
import Taro from "@tarojs/taro";

import { try_Taro_showModal } from "../try_catch";


// 监听搜索到新设备的事件
// onBluetoothDeviceFound
// https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.onBluetoothDeviceFound.html

// 移除搜索到新设备的事件的全部监听函数
// offBluetoothDeviceFound
// https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.offBluetoothDeviceFound.html


// 移除蓝牙适配器状态变化事件的全部监听函数
// offBluetoothAdapterStateChange
// https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.offBluetoothDeviceFound.html

// xx蓝牙配对接口，仅安卓支持。
// makeBluetoothPair
// 通常情况下（需要指定 pin 码或者密码时）系统会接管配对流程，直接调用 wx.createBLEConnection 即可。该接口只应当在开发者不想让用户手动输入 pin 码且真机验证确认可以正常生效情况下用
// https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.makeBluetoothPair.html

// xx查询蓝牙设备是否配对，仅安卓支持。
// isBluetoothDevicePaired
// https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.isBluetoothDevicePaired.html


/** 获取本机蓝牙适配器状态。
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.getBluetoothAdapterState.html
 */
export async function Blue_getBluetoothAdapterState() {
  try {
    const res = await Taro.getBluetoothAdapterState();
    if (res.errMsg === "getBluetoothAdapterState:ok") {
      return res;
    } else {
      throw new Error(res.errMsg);
    }
  } catch (err) {
    throw err;
  }
}

/** 监听蓝牙适配器状态变化事件
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.onBluetoothAdapterStateChange.html
 */
export function Blue_onBluetoothAdapterStateChange(cb: Taro.onBluetoothAdapterStateChange.Callback) {
  Taro.onBluetoothAdapterStateChange(cb);
}

/** 根据主服务 UUID 获取已连接的蓝牙设备。
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.getConnectedBluetoothDevices.html
 */
export async function Blue_getConnectedBluetoothDevices(blue_services: string[]): Promise<Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice[]> {
  try {
    const res = await Taro.getConnectedBluetoothDevices({
      services: blue_services
    });
    if (res.errMsg === "getConnectedBluetoothDevices:ok") {
      return res.devices as Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice[];
    } else {
      throw new Error("失败_获取已连接的蓝牙设备");
    }
  } catch (err) {
    throw err;
  }
}

/** 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
 *
 * **注意事项**
 * - 该接口获取到的设备列表为**蓝牙模块生效期间所有搜索到的蓝牙设备**，若在蓝牙模块使用流程结束后未及时调用 Taro.closeBluetoothAdapter 释放资源，会存在调用该接口会返回之前的蓝牙使用流程中搜索到的蓝牙设备，可能设备已经不在用户身边，无法连接。
 * - 蓝牙设备在被搜索到时，系统返回的 name 字段一般为广播包中的 LocalName 字段中的设备名称，而如果与蓝牙设备建立连接，系统返回的 name 字段会改为从蓝牙设备上获取到的 `GattName`。若需要动态改变设备名称并展示，建议使用 `localName` 字段。
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.getBluetoothDevices.html
 */
export async function Blue_getBluetoothDevices() {
  try {
    const res = await Taro.getBluetoothDevices();
    if (res.errMsg === "getBluetoothDevices:ok") {
      return res.devices;
    } else {
      throw new Error("失败_获取已发现蓝牙设备列表");
    }
  } catch (err) {
    throw err;
  }
}

/** 开始搜寻附近的蓝牙外围设备。**此操作比较耗费系统资源，请在搜索并连接到设备后调用 Taro.stopBluetoothDevicesDiscovery 方法停止搜索。**
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.startBluetoothDevicesDiscovery.html
 */
export async function Blue_startBluetoothDevicesDiscovery(blue_services: string[]) {
  try {
    const res = await Taro.startBluetoothDevicesDiscovery({
      services: blue_services,
      allowDuplicatesKey: false,
    });
    if (res.errMsg === "startBluetoothDevicesDiscovery:ok") {
      return;
    } else {
      throw new Error("失败_开始搜寻附近的蓝牙外围设备");
    }
  } catch (err) {
    if (err?.errMsg.includes("fail Starting discovery failed")) {
      throw new Error("请打开手机蓝牙");
    } else if (err?.errMsg.includes("fail already discovering devices")) {
      return;
    } else if (err.errno === 1509008) {
      throw new Error("请打开手机定位");
    } else {
      throw err;
    }
  }
}

/** 停止搜寻附近的蓝牙外围设备。若已经找到需要的蓝牙设备并不需要继续搜索时，建议调用该接口停止蓝牙搜索。
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.stopBluetoothDevicesDiscovery.html
 */
export async function Blue_stopBluetoothDevicesDiscovery() {
  try {
    const res = await Taro.stopBluetoothDevicesDiscovery();
    if (res.errMsg !== "stopBluetoothDevicesDiscovery:ok") {
      throw new Error("停止发现附近蓝牙设备失败");
    }
  } catch (err) {
    throw new Error("蓝牙设备已关闭");
  }
}

/** 初始化蓝牙模块
 *
 * **注意**
 * - 其他蓝牙相关 API 必须在 Taro.openBluetoothAdapter 调用之后使用。否则 API 会返回错误（errCode=10000）。
 * - 在用户蓝牙开关未开启或者手机不支持蓝牙功能的情况下，调用 Taro.openBluetoothAdapter 监听手机蓝牙状态的改变，也可以调用蓝牙模块的所有API。
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.openBluetoothAdapter.html
 */
export async function Blue___openBluetoothAdapter() {
  try {
    const res = await Taro.openBluetoothAdapter();
    if (res.errMsg !== "openBluetoothAdapter:ok") {
      throw new Error("蓝牙模块初始化失败");
    }
  } catch (err) {
    if (err && err.errMsg === "openBluetoothAdapter:fail already opened") {
    } else if (err.errMsg === "openBluetoothAdapter:fail auth deny") {
      throw new Error("蓝牙授权失败");
    } else if (err.errCode === 10001) {
      if (await try_Taro_showModal({ title: "提示", content: "连接失败：手机蓝牙未打开", showCancel: false, })) {
        throw new Error("手机蓝牙未打开");
      } else {
        throw new Error("手机蓝牙未打开");
      }
    } else if (err.errno === 3) {
      throw new Error("附近设备权限未授权");
    } else {
      throw err;
    }
  }
}

/** 关闭蓝牙模块。调用该方法将断开所有已建立的连接并释放系统资源。建议在使用蓝牙流程后，与 Taro.openBluetoothAdapter 成对调用。
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.closeBluetoothAdapter.html
 */
export async function Blue___closeBluetoothAdapter() {
  try {
    const res = await Taro.closeBluetoothAdapter();
    if (res.errMsg !== "closeBluetoothAdapter:ok") {
      throw new Error("蓝牙模块关闭失败");
    }
  } catch (err) {
    throw err;
  }
}

/** 连接低功耗蓝牙设备。
 *
 * 若小程序在之前已有搜索过某个蓝牙设备，并成功建立连接，可直接传入之前搜索获取的 deviceId 直接尝试连接该设备，无需进行搜索操作。
 *
 * **注意**
 * - 请保证尽量成对的调用 `createBLEConnection` 和 `closeBLEConnection` 接口。安卓如果多次调用 `createBLEConnection` 创建连接，有可能导致系统持有同一设备多个连接的实例，导致调用 `closeBLEConnection` 的时候并不能真正的断开与设备的连接。
 * - 蓝牙连接随时可能断开，建议监听 Taro.onBLEConnectionStateChange 回调事件，当蓝牙设备断开时按需执行重连操作
 * - 若对未连接的设备或已断开连接的设备调用数据读写操作的接口，会返回 10006 错误，建议进行重连操作。
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.createBLEConnection.html
 */
export async function Blue_connect_createBLEConnection(device: Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice) {
  try {
    const res = await Taro.createBLEConnection({
      deviceId: device.deviceId
    });
    if (res.errMsg.includes("ok") && res.errCode === 0) {
      return device;
    } else {
      throw new Error(`连接低功耗蓝牙设备_失败_${res.errMsg}_${res.errCode}`);
    }
  } catch (err) {
    if (err.errCode === -1) {
      return device;
    } else if (err.errCode === 10003) {
      if (await try_Taro_showModal({
        title: "提示",
        content: "连接失败：打印机连接失败！请检查打印机是否打开，部分手机需要开启定位",
        showCancel: false,
      })) {
        throw new Error("打印机连接失败");
      } else {
        throw new Error("打印机连接失败");
      }
    } else if (err.errCode === 10012) {
      if (await try_Taro_showModal({
        title: "提示",
        content: "部分机型受微信版本限制，需授权”附近设备”才能使用小程序连接蓝牙",
        showCancel: false,
      })) {
        throw new Error("打印机连接失败");
      } else {
        throw new Error("打印机连接失败");
      }
    } else {
      throw err;
    }
  }
}

// closeBLEConnection
export async function Blue_connect_closeBLEConnection(device: Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice) {
  try {
    const res = await Taro.closeBLEConnection({
      deviceId: device.deviceId
    });
    if (res.errMsg.includes("ok") && res.errCode === 0) {
      return device;
    } else {
      throw new Error(`断开低功耗蓝牙设备_失败_${res.errMsg}_${res.errCode}`);
    }
  } catch (err) {
    throw err;
  }
}

/** 获取蓝牙设备所有服务(service)。
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.getBLEDeviceServices.html
 */
export async function Blue_connect_getBLEDeviceServices(device: Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice, uuid: string) {
  try {
    const res = await Taro.getBLEDeviceServices({ deviceId: device.deviceId });
    if (res.errMsg === "getBLEDeviceServices:ok" && res.errCode === 0) {
      const service = res.services.reduce((obj: Taro.getBLEDeviceServices.BLEService | null, e) => e.uuid === uuid ? obj = e : obj, null);
      if (service) {
        return service;
      } else {
        throw new Error("没有找到可用的蓝牙服务");
      }
    } else {
      throw new Error(`获取蓝牙设备所有服务_失败_${res.errMsg}_${res.errCode}`);
    }
  } catch (err) {
    throw err;
  }
}

/** 获取蓝牙设备某个服务中所有特征值(characteristic)。
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.getBLEDeviceCharacteristics.html
 */
export async function Blue_connect_getBLEDeviceCharacteristics(device: Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice, service: Taro.getBLEDeviceServices.BLEService, uuid: string) {
  try {

    const res = await Taro.getBLEDeviceCharacteristics({ deviceId: device.deviceId, serviceId: service!.uuid });
    if (res.errMsg === "getBLEDeviceCharacteristics:ok" && res.errCode === 0) {
      const characteristic = res.characteristics.reduce((obj: Taro.getBLEDeviceCharacteristics.BLECharacteristic | null, e) => e.uuid === uuid ? obj = e : obj, null);
      if (characteristic) {
        return characteristic;
      } else {
        throw new Error(`没有找到可用的蓝牙特征值`);
      }
    } else {
      throw new Error(`获取蓝牙设备某个服务中所有特征值_失败_${res.errMsg}_${res.errCode}`);
    }
  } catch (err) {
    throw err;
  }
}

/** 向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持 write 才可以成功调用。
 *
 * **注意**
 * - 并行调用多次会存在写失败的可能性。
 * - 小程序不会对写入数据包大小做限制，但系统与蓝牙设备会限制蓝牙4.0单次传输的数据大小，超过最大字节数后会发生写入错误，建议每次写入不超过20字节。
 * - 若单次写入数据过长，iOS 上存在系统不会有任何回调的情况（包括错误回调）。
 * - 安卓平台上，在调用 `notifyBLECharacteristicValueChange` 成功后立即调用 `writeBLECharacteristicValue` 接口，在部分机型上会发生 10008 系统错误
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.writeBLECharacteristicValue.html
 */
export async function Blue_connect_writeBLECharacteristicValue(
  { device, service, characteristic, value }: {
    device: Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice,
    service: Taro.getBLEDeviceServices.BLEService,
    characteristic: Taro.getBLEDeviceCharacteristics.BLECharacteristic,
    value: ArrayBuffer;
  }
) {
  try {
    const res = await Taro.writeBLECharacteristicValue({
      deviceId: device.deviceId,
      serviceId: service.uuid,
      characteristicId: characteristic.uuid,
      value: value,
    });
    return res;
  } catch (err) {
    throw err;
  }
}
