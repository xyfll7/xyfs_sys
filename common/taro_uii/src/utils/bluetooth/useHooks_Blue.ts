import Taro from "@tarojs/taro";
import GBK from "@xyfs/utils/gbk";
import { coo___JSON_str_code, coo___async_sleep, coo___divide_array_to_n_parts, coo___ios_date, coo___privacy_phone } from "@xyfs/utils/util";
import { format } from "date-fns";
import { useEffect, useState, useSyncExternalStore } from "react";
import { PreBarCodeDryclean } from "../../../types/type_index";
import { OrderInfo, Product_Dryclean, Product_Express } from "../../../types/type_product";
import { BaseUserInfo } from "../../../types/type_user";
import { Api_order_print_ctn } from "../../api/api__orders";
import { getMyEnv } from "../../env";
import { useSTBlueDevices, useSTSelf } from "../../store/store";
import { try_Taro_navigateTo, try_Taro_showActionSheet, try_Taro_showModal } from "../try_catch";
import { utils_addressInfoToString, utils_get_cloud_printer, utils_str_includes } from "../util";
import { Blue___closeBluetoothAdapter, Blue___openBluetoothAdapter, Blue_connect_closeBLEConnection, Blue_connect_createBLEConnection, Blue_connect_getBLEDeviceCharacteristics, Blue_connect_getBLEDeviceServices, Blue_connect_writeBLECharacteristicValue, Blue_getBluetoothDevices, Blue_getConnectedBluetoothDevices, Blue_onBluetoothAdapterStateChange, Blue_startBluetoothDevicesDiscovery, Blue_stopBluetoothDevicesDiscovery } from "./bluetooth";

/**
 * @汉印 https://www.docin.com/p-2160105026.html?docfrom=rrela
 * @斑马 https://www.docin.com/p-1728308804.html?docfrom=rrela
 * @智能 https://www.docin.com/p-2143593378.html?docfrom=rrela
 * @启锐 https://landing-fly.kahub.in/psdk/
 */
// 搜索打印机列表
const SERVICE_UUIDs: string[] = [
  "000018F0-0000-1000-8000-00805F9B34FB", //tspl Printer_"(佳博水洗布打印机) // 快麦
  "0000FEE7-0000-1000-8000-00805F9B34FB", //cpcl QR-386A-4B9A-LE"(手持打印机)  汉印
  "0000FCE7-0000-1000-8000-00805F9B34FB" //cpcl 快递100云打印机
];
const SERVICE_UUID = "49535343-FE7D-4AE5-8FA9-9FAFD205E455";
const CHARACTERISTIC_UUID = "49535343-8841-43F4-A8D4-ECBE34729BB3";


const bluetoothAdapterState_Store = {
  status: {
    available: false,
    discovering: false,
  } as Taro.onBluetoothAdapterStateChange.CallbackResult,
  sub(cb: () => void) {
    // (async () => {
    //   const res = await Blue_getBluetoothAdapterState();
    //   bluetoothAdapterState_Store.status = {
    //     available: res.available,
    //     discovering: res.discovering
    //   };
    //   cb();
    // })();

    Blue_onBluetoothAdapterStateChange(e => {
      bluetoothAdapterState_Store.status = {
        available: e.available,
        discovering: e.discovering
      };
      cb();
    });

    return () => { };
  },
};

export function useINHooks_Blue_devices() {
  const [devices, setDevices] = useState<Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice[]>();
  const state = useSyncExternalStore(bluetoothAdapterState_Store.sub, () => bluetoothAdapterState_Store.status);
  console.log("查找到的蓝牙设备列表:", devices);
  const startBlue = async () => {
    setDevices(undefined);
    // 启动蓝牙模块
    await Blue___openBluetoothAdapter();
    console.info("1_蓝牙模块初始化成功");
    const res_devices0 = await Blue_getConnectedBluetoothDevices(SERVICE_UUIDs);
    console.info("2_获取已连接的蓝牙设备", res_devices0);
    setDevices((_devices) => ___device_filter([...(_devices ?? []), ...res_devices0]));
    const res_devices1 = await Blue_getBluetoothDevices();
    console.info("3_获取在蓝牙模块生效期间所有搜索到的蓝牙设备,包括已经和本机处于连接状态的设备", res_devices1);
    setDevices((_devices) => ___device_filter([...(_devices ?? []), ...res_devices1]));
    await Blue_startBluetoothDevicesDiscovery(SERVICE_UUIDs);
    console.info("4_开始搜索蓝牙");
    Taro.onBluetoothDeviceFound(({ devices: res_devices }) => {  // 监听搜索到新设备的事件
      setDevices((_devices) => ___device_filter([...(_devices ?? []), ...res_devices]));
    });

    function ___device_filter(__devices: Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice[]) {
      const ___arr = __devices.filter(e => Boolean(e.advertisServiceUUIDs?.length)).reduce((_arr: Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice[], item) => {
        if (_arr.find((e) => e.deviceId === item.deviceId)) {
          return _arr;
        } else if (item.name.includes("未知")) {
          return _arr;
        } else if (item.localName || item.name) {
          return [..._arr, item];
        } else {
          return _arr;
        }
      }, [])?.map(e => ({ ...e }));
      return ___arr;
    }
  };
  useEffect(() => {
    startBlue();
    return () => {
      (async () => {
        await Blue_stopBluetoothDevicesDiscovery();   // 停止搜寻附近的蓝牙外围设备
        await Blue___closeBluetoothAdapter();         // 关闭蓝牙模块
      })();
    };
  }, []);
  async function addPrinter(e: Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice) {
    try {
      Taro.showLoading({ mask: true, title: "连接中..." });
      const res_device = await Blue_connect_createBLEConnection(e);
      Taro.showToast({ icon: "none", title: "添加成功", });
      return res_device;
    } finally {

      // 断开蓝牙连接
      await Blue_connect_closeBLEConnection(e);
    }
  }
  async function stopBlue() {
    await Blue_stopBluetoothDevicesDiscovery();    // 停止搜寻附近的蓝牙外围设备
  }
  return { devices, state, startBlue, stopBlue, addPrinter };
}





export async function on_start_print(___cb: (blue_device: Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice) => { cpcl: string[], tspl?: string[]; }, options?: { orderId?: string, selfInfo_S?: BaseUserInfo | null; }): Promise<void> {

  const tapIndex = await (async () => {
    if (options?.selfInfo_S && options.selfInfo_S.printers && options.selfInfo_S.printers.length && options.orderId) {
      const [res_index] = await try_Taro_showActionSheet({
        alertText: "请选择打印方式", itemList: ["蓝牙打印(免费)", "云打印(每单扣费0.057元)"]
      });
      return res_index;
    } else {
      return 0;
    }
  })();

  // 选择打印机 蓝牙打印 云打印
  if (tapIndex === 0) {

    const _blue_device = await ___get_blue_device();
    Taro.showLoading({ mask: true, title: "蓝牙打印..." });


    Taro.showLoading({ mask: true, title: "打印中...", });
    const reporter = await ___startBluePrinterPrint(_blue_device, ___cb(_blue_device).cpcl);

    if (reporter?.errMsg.includes("ok")) {
      Taro.showToast({ icon: "none", title: "打印完成", });
      return;
    } else {
      throw new Error("打印错误");
    }
  } else if (tapIndex === 1 && options?.orderId) { // 云打印
    //选择云打印机
    const res_cloud_printer = await utils_get_cloud_printer(useSTSelf.getState().selfInfo!);
    if (res_cloud_printer) {
      Taro.showLoading({ mask: true, title: "打印中...", });
      await Api_order_print_ctn({ orderId: options?.orderId, printerId: res_cloud_printer.id, });
      Taro.showToast({ icon: "none", title: "打印任务提交成功", });
    }
    return;
  }
  // 选择蓝牙打印机
  async function ___get_blue_device(): Promise<Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice> {
    const { blueDevices } = useSTBlueDevices.getState();
    if (blueDevices.length === 0) {
      //  没有蓝牙打印机 - 弹窗提示用户去配置蓝牙打印机
      if (Taro.getCurrentPages().slice(-1)?.[0]?.route === "pages_comm/icomm_printer") {
        throw new Error("请添加蓝牙打印机");
      } else {
        if (await try_Taro_showModal({ title: "提示", content: "您还没有配置蓝牙打印机", showCancel: false, confirmText: "去配置", })) {
          await try_Taro_navigateTo({ url: "/pages_comm/icomm_printer" });
          throw new Error("没有蓝牙打印机，去配置打印机");
        } else {
          throw new Error("没有蓝牙打印机，去配置打印机");
        }
      }

    } else if (blueDevices.length === 1) {
      return blueDevices[0]!; // 只有一个蓝牙打印机 直接返回这个蓝牙打印机
    } else {
      // 有多个蓝牙打印机 让用户选择一个蓝牙打印机，并返回这个选择的蓝牙打印机
      const [res_index] = await try_Taro_showActionSheet({ alertText: "请选择蓝牙打印机", itemList: [...blueDevices.map((ee) => ee.name)] });
      return blueDevices[res_index]!;
    }
  }

  // 开始蓝牙打印
  async function ___startBluePrinterPrint(blue_device: Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice, cpcl_strs: string[]) {

    try {
      // 启动蓝牙模块
      await Blue___openBluetoothAdapter();
      // 连接打印机
      Taro.showLoading({ mask: true, title: "连接打印机...", });
      const res_device = await Blue_connect_createBLEConnection(blue_device);
      // 获取打印机服务
      Taro.showLoading({ mask: true, title: "获取服务...", });
      const res_service = await Blue_connect_getBLEDeviceServices(res_device, SERVICE_UUID);
      // 获取打印机服务特征码
      Taro.showLoading({ mask: true, title: "获取特征码...", });
      const res_characteristic = await Blue_connect_getBLEDeviceCharacteristics(res_device, res_service, CHARACTERISTIC_UUID);
      // 打印中...
      Taro.showLoading({ mask: true, title: "传输中...", });

      // https://blog.csdn.net/qq_38322527/article/details/87726249  BLE 4.0 中发送一个数据包只能包含 20 字节的数据，大于 20 字节只能分包发送
      let reporter: Taro.writeBLECharacteristicValue.Promised | undefined;
      for (const cpcl_str of cpcl_strs) {
        const uint8Array = new Uint8Array(GBK.encode(`${cpcl_str}\r\n`));
        const parts = coo___divide_array_to_n_parts(Array.from(uint8Array), 20);
        for (const part of parts) {
          const res = await Blue_connect_writeBLECharacteristicValue({
            device: res_device,
            service: res_service,
            characteristic: res_characteristic,
            value: new Uint8Array(part).buffer,
          });
          reporter = res;
          await coo___async_sleep(10);
        }
      }
      Taro.showToast({ icon: "none", title: "传输完成", });
      return reporter;
    } finally {
      setTimeout(async () => {
        await Blue_connect_closeBLEConnection(blue_device);
        await Blue___closeBluetoothAdapter(); // 关闭蓝牙模块
        Taro.showToast({ icon: "none", title: "断开蓝牙连接0", });
      }, 3000);
    }
  }
}

export function on_get_cpcl_str_test(blue_device: Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice) {
  if (utils_str_includes(["Printer_"], blue_device.name)) { // TSPL打印语法
    return [
      // `CLS`, // 清除缓冲区数据
      `SIZE 110 mm,30 mm`,
      `GAP 0 mm,0 mm`,  //
      `SET CUTTER BATCH`, // 在 PRINT 命令结束后切纸
      `FEED 10`, // 该指令用于将标签纸向前推送指定的长度
      `CLS`, // 清除缓冲区数据
      `BAR 10,75,455,5`, // 该指令用于在标签上画线 BAR x,y,width,height 单位 dot  1 mm = 8 dots
      `TEXT 10,20,"TSS24.BF2",0,2,2,"打印测试TSPL"`,
      `PRINT 1,1`,
    ].reduce((str, e) => `${str}\r\n${e}`);
  }
  if (blue_device.advertisServiceUUIDs?.some(e => utils_str_includes(["0000FEE7", "0000FCE7"], e))) { // CPCL打印语法
    return [
      `! 0 200 200 1000 1`,
      `PAGE-WIDTH 560`,  //
      `LEFT 530`,
      `TEXT 7 0 10 250 打印机测试CPCL`,
      `FORM`,
      `PRINT`,
    ].reduce((str, e) => `${str}\r\n${e}`);
  }
  throw new Error("不支持该打印机2");
}

export function on_get_printer_str_order_express(_order: OrderInfo<Product_Express>, blue_device: Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice, type: "cpcl" | "tspl") {
  _order = JSON.parse(JSON.stringify(_order, coo___JSON_str_code));
  const recAddr = `${_order.__product?.recMan?.province} ${_order.__product?.recMan?.city} ${_order.__product?.recMan?.area} ${_order.__product?.recMan?.address}`;
  const sendAddr = `${_order.__product?.sendMan?.province} ${_order.__product?.sendMan?.city} ${_order.__product?.sendMan?.area} ${_order.__product?.sendMan?.address}`;
  const sendManName = `${_order.__product?.sendMan?.realName?.charAt(0)}* ${_order.__product?.sendMan?.mobile?.slice(0, 3)}****${_order.__product?.sendMan?.mobile?.slice(-4)}`.slice(0, 20);

  if (type === "cpcl") {
    const T_0 = utils_str_includes(["快递100"], blue_device.name) ? "TEXT 0" : "TEXT 1";
    const L_H = 3;
    const X0 = 5;
    let Y_ = 0;
    const P_w = ((76 - 5) * 8);
    const P_h = (130 - 5) * 8;
    const arr_page = [`! 0 200 200 ${P_h} 1`];
    const arr_content = [
      `PW ${P_w}`,
      `CONTRAST 3`,

      `LEFT`,
      `${T_0} 0 ${X0} ${Y_ = 60} ${format(coo___ios_date(_order?.lastPrintTime ?? coo___ios_date().getTime()), "yyyy-MM-dd HH:mm:ss")}`,
      `LINE ${X0} ${Y_ += 26} ${P_w} ${Y_} ${L_H}`, // -----------

      `CENTER`,
      `BARCODE 128 2 2 80 ${X0} ${Y_ += 10} ${_order.__product?.waybillId}`,
      `${T_0} 0 ${X0} ${Y_ += 80 + 10} ${_order.__product?.waybillId}`,
      `LINE ${X0} ${Y_ += 40} ${P_w} ${Y_} ${L_H}`, // -----------

      `SETMAG 2 2`,
      `${T_0} 0 ${X0} ${Y_ += 10} ${_order.__product?.bigWord ?? ""}`,
      `LINE ${X0} ${Y_ += 60} ${P_w} ${Y_} ${L_H}`, // -----------

      `LEFT ${P_w}`,
      `${T_0} 0 ${X0} ${Y_ += 10} 集`,
      `${T_0} 0 ${X0 + 60} ${Y_} ${_order.__product?.packagePlace ?? ""}`,
      `SETMAG 0 0`,
      `LINE ${X0} ${Y_ += 60} ${P_w} ${Y_} ${L_H}`, // -----------

      `SETMAG 2 2`,
      `${T_0} 0 ${X0} ${Y_ += 10} 收`,
      `SETMAG 0 0`,
      `${T_0} 0 ${X0 + 60} ${Y_} ${_order.__product?.recMan?.name} ${coo___privacy_phone(_order.__product?.recMan?.mobile)}`,
      ...(() => coo___divide_array_to_n_parts(recAddr.split(""), 20)
        .map(e => e.join(""))
        .map(e => `${T_0} 0 ${X0 + 60} ${Y_ += 30} ${e}`)
      )(),
      `LINE ${X0} ${Y_ += 40} ${P_w} ${Y_} ${L_H}`, // -----------

      `SETMAG 2 2`,
      `${T_0} 0 ${X0} ${Y_ += 10} 寄`,
      `SETMAG 0 0`,
      `${T_0} 0 ${X0 + 60} ${Y_} ${sendManName}`,
      ...(() => coo___divide_array_to_n_parts(sendAddr.split(""), 20)
        .map(e => e.join(""))
        .map(e => `${T_0} 0 ${X0 + 60} ${Y_ += 30} ${e}`)
      )(),
      `LINE ${X0} ${Y_ += 40} ${P_w} ${Y_} ${L_H}`, // -----------

      `CENTER`,
      `BARCODE 128 2 2 80 ${X0} ${Y_ += 10} ${_order.__product?.waybillId}`,
      `${T_0} 0 ${X0} ${Y_ += 80 + 10} ${_order.__product?.waybillId}`,

      `LEFT ${P_w}`,
      `SETMAG 2 2`,
      `${T_0} 0 ${X0} ${Y_ += 40} 重量：${_order.__product?.weight} 公斤`,
      `SETMAG 0 0`,
      `LEFT ${P_w}`,
      `${T_0} 0 ${X0} ${Y_ += 60} 团长：${_order.regimentName ?? '无'}`,
      `${T_0} 0 ${X0} ${Y_ += 40} 品名：${_order.__product?.itemType}`,
      `${T_0} 0 ${X0} ${Y_ += 40} 备注：${_order.__product?.itemNotes ?? "无"}`,
      `FORM`,
      `PRINT`,
    ];
    return [...arr_page, ...arr_content].reduce((str, e) => `${str}\r\n${e}`);
  } else if (type === "tspl") {
    return [
      `SIZE 72 mm, 127 mm`,
      `CODEPAGE 437`, // 该指令用于选择对应的国际代码页  437:UnitedStates
      `DENSITY 8`, // 该指令用于控制打印时的浓度
      `CLS`, // 该指令用于清除图像缓冲区（image buffer)的数据
      `CODEPAGE 936`, // 该指令用于选择对应的国际代码页  936:Chinese
      `DIRECTION  0`, // 该指令用于定义打印时出纸和打印字体的方向
      `TEXT 206,12,"0",0,1,1,"验证码 啊哈哈哈"`,
      `PRINT 1,1` //该指令用于打印出存储于影像缓冲区内的数据
    ].join("\r\n");
  } else {
    throw new Error("不支持该打机语法");
  }


}

export function on_get_printer_str_order_bing_goods(_order: OrderInfo<Product_Dryclean>, blue_device: Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice) {
  _order = JSON.parse(JSON.stringify(_order, coo___JSON_str_code));
  const T_0 = utils_str_includes(["快递100"], blue_device.name) ? "TEXT 0" : "TEXT 1";
  const L_H = 3;
  const X0 = 5;
  let Y_ = 0;
  const P_w = ((76 - 5) * 8);
  const P_h = (130 - 5) * 8;


  const ___rec = _order.userAddress; // 用户地址
  const recName = `${___rec?.name} ${coo___privacy_phone(___rec?.mobile)}`.slice(0, 20);
  const recAddr = utils_addressInfoToString(___rec);
  const ___regiment = _order.regimentAddress; // 团长地址

  const ___merchant = _order.__product?.merchantAddress; // 商家地址
  const merchantName = `${___merchant?.name} ${___merchant?.mobile}`.slice(0, 20);
  const merchantAddr = utils_addressInfoToString(___merchant, true);

  const ___intro = _order.__product?.intro ?? ""; // 商品简介

  const arr_content = [
    `PW ${P_w}`,
    `CONTRAST 3`,

    `LEFT`,
    `${T_0} 0 ${X0} ${Y_ = 60} ${format(coo___ios_date(_order?.lastPrintTime ?? coo___ios_date().getTime()), "yyyy-MM-dd HH:mm:ss")}`,
    `LINE ${X0} ${Y_ += 26} ${P_w} ${Y_} ${L_H}`, // -----------

    `BARCODE 128 1 1 80 ${X0 + 30} ${Y_ += 10} ${_order.outTradeNo?.toUpperCase()}`,
    `${T_0} 0 ${X0 + 60} ${Y_ += 80 + 10} ${_order.outTradeNo?.toUpperCase()}`,
    `LINE ${X0} ${Y_ += 30} ${P_w} ${Y_} ${L_H}`, // -----------
    `SETMAG 2 2`,
    `${T_0} 0 ${X0} ${Y_ += 10} 收`,
    `SETMAG 0 0`,
    `${T_0} 0 ${X0 + 60} ${Y_} ${recName}`,
    ...(() => coo___divide_array_to_n_parts(recAddr?.split(""), 20)
      .map(e => e.join(""))
      .map(e => `${T_0} 0 ${X0 + 60} ${Y_ += 30} ${e}`)
    )(),
    `LINE ${X0} ${Y_ += 30} ${P_w} ${Y_} ${L_H}`, // -----------

    `SETMAG 2 2`,
    `${T_0} 0 ${X0} ${Y_ += 10} 商`,
    `SETMAG 0 0`,
    `${T_0} 0 ${X0 + 60} ${Y_} ${merchantName}`,
    ...(() => coo___divide_array_to_n_parts(merchantAddr?.split(""), 20)
      .map(e => e.join(""))
      .map(e => `${T_0} 0 ${X0 + 60} ${Y_ += 30} ${e}`)
    )(),
    `LINE ${X0} ${Y_ += 30} ${P_w} ${Y_} ${L_H}`, // -----------

    `BARCODE 128 1 1 80 ${X0 + 30} ${Y_ += 10} ${_order.outTradeNo?.toUpperCase()}`,
    `${T_0} 0 ${X0 + 60} ${Y_ += 80 + 10} ${_order.outTradeNo?.toUpperCase()}`,

    `${T_0} 0 ${X0} ${Y_ += 30} 团长：${___regiment?.name?.slice(0, 10)}  ${___regiment?.mobile}`,
    `${T_0} 0 ${X0} ${Y_ += 30} 品名：${_order.__product?.name}`,
    `${T_0} 0 ${X0} ${Y_ += 30} 商品总数量 共${_order.__count}件`,
    ...(() => coo___divide_array_to_n_parts(___intro?.split(""), 20)
      .map(e => e.join(""))
      .map(e => `${T_0} 0 ${X0} ${Y_ += 30} ${e}`)
    )(),
    `FORM`,
    `PRINT`,
  ];
  const arr_page = [`! 0 200 200 ${P_h} 1`];
  return [...arr_page, ...arr_content].reduce((str, e) => `${str}\r\n${e}`);
}
export function on_get_printer_str_order_bing_goods_waybill(_order: OrderInfo<Product_Dryclean>, blue_device: Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice) {
  _order = JSON.parse(JSON.stringify(_order, coo___JSON_str_code));
  const T_0 = utils_str_includes(["快递100"], blue_device.name) ? "TEXT 0" : "TEXT 1";
  const L_H = 3;
  const X0 = 5;
  let Y_ = 0;
  const P_w = ((76 - 5) * 8);
  const P_h = (130 - 5) * 8;


  const ___rec = _order.userAddress; // 用户地址
  const recName = `${___rec?.name} ${coo___privacy_phone(___rec?.mobile)}`.slice(0, 20);
  const recAddr = utils_addressInfoToString(___rec);
  const ___regiment = _order.regimentAddress; // 团长地址
  const ___merchant = _order.__product?.merchantAddress; // 商家地址
  const merchantName = `${___merchant?.name} ${___merchant?.mobile}`.slice(0, 20);
  const merchantAddr = utils_addressInfoToString(___merchant);

  const arr_content = [
    `PW ${P_w}`,
    `CONTRAST 3`,

    `LEFT`,
    `${T_0} 0 ${X0} ${Y_ = 60} ${format(coo___ios_date(_order?.lastPrintTime ?? coo___ios_date().getTime()), "yyyy-MM-dd HH:mm:ss")}`,
    `LINE ${X0} ${Y_ += 26} ${P_w} ${Y_} ${L_H}`, // -----------

    `BARCODE 128 1 1 80 ${X0 + 30} ${Y_ += 10} ${_order.__product?.waybillId?.toUpperCase()}`,
    `${T_0} 0 ${X0 + 30} ${Y_ += 80 + 10} ${_order.__product?.waybillId?.toUpperCase()}`,
    `LINE ${X0} ${Y_ += 30} ${P_w} ${Y_} ${L_H}`, // -----------
    `SETMAG 2 2`,
    `${T_0} 0 ${X0} ${Y_ += 10} 收`,
    `SETMAG 0 0`,
    `${T_0} 0 ${X0 + 60} ${Y_} ${recName}`,
    ...(() => coo___divide_array_to_n_parts(recAddr?.split(""), 20)
      .map(e => e.join(""))
      .map(e => `${T_0} 0 ${X0 + 60} ${Y_ += 30} ${e}`)
    )(),
    `LINE ${X0} ${Y_ += 30} ${P_w} ${Y_} ${L_H}`, // -----------

    `SETMAG 2 2`,
    `${T_0} 0 ${X0} ${Y_ += 10} 寄`,
    `SETMAG 0 0`,
    `${T_0} 0 ${X0 + 60} ${Y_} ${merchantName}`,
    ...(() => coo___divide_array_to_n_parts(merchantAddr?.split(""), 20)
      .map(e => e.join(""))
      .map(e => `${T_0} 0 ${X0 + 60} ${Y_ += 30} ${e}`)
    )(),
    `LINE ${X0} ${Y_ += 30} ${P_w} ${Y_} ${L_H}`, // -----------

    `BARCODE 128 1 1 80 ${X0 + 30} ${Y_ += 10} ${_order.__product?.waybillId?.toUpperCase()}`,
    `${T_0} 0 ${X0 + 30} ${Y_ += 80 + 10} ${_order.__product?.waybillId?.toUpperCase()}`,

    `${T_0} 0 ${X0} ${Y_ += 30} 团长：${___regiment?.name?.slice(0, 10)} ${___regiment?.mobile}`,
    `${T_0} 0 ${X0} ${Y_ += 30} 商品总数量 共${_order.__count}件`,
    ...(() => _order.productList?.filter((e) => e.waybillId === _order.__product?.waybillId)?.map((e, i) => [
      `${T_0} 0 ${X0} ${Y_ += 30} ${i + 1}/${_order.__count}${e.name?.substring(0, 10)}/${e.intro}`.substring(0, 20),
    ]).flat()!
    )(),

    `FORM`,
    `PRINT`,
  ];
  const arr_page = [`! 0 200 200 ${P_h} 1`];
  return [...arr_page, ...arr_content].reduce((str, e) => `${str}\r\n${e}`);
}


export function on_get_printer_str_order_dryclean_out_factory(_order: OrderInfo<Product_Dryclean>, blue_device: Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice) {
  _order = JSON.parse(JSON.stringify(_order, coo___JSON_str_code));
  const T_0 = utils_str_includes(["快递100"], blue_device.name) ? "TEXT 0" : "TEXT 1";
  const L_H = 3;
  const X0 = 5;
  let Y_ = 15;
  const P_w = ((76 - 5) * 8);
  const P_h = (130 - 5) * 8;

  const recAddr = `${_order.userAddress?.address ? _order.userAddress?.address : '---------'}`;
  const recManName = `${_order.userAddress?.name} ${_order.userAddress?.mobile?.slice(0, 3)}****${_order.userAddress?.mobile?.slice(-4)}`.slice(0, 20);

  const sendAddr = `${_order.regimentAddress?.address}`;
  const sendManName = `${_order.regimentAddress?.name}`.slice(0, 20);
  const arr_content = [
    `PW ${P_w}`,
    `CONTRAST 3`,

    `LEFT`,
    `${T_0} 0 ${X0} ${Y_} ${format(coo___ios_date(_order?.lastPrintTime ?? coo___ios_date().getTime()), "yyyy-MM-dd HH:mm:ss")} 码: ${_order.__product?.code}`,
    `LINE ${X0} ${Y_ += 25} ${P_w} ${Y_} ${L_H}`, // -----------

    `SETMAG 2 2`,
    `${T_0} 0 ${X0} ${Y_ += 5} 码`,
    `SETMAG 0 0`,

    `LEFT`,
    `BARCODE 128 2 2 60 ${X0 + 60} ${Y_} ${_order.__product?.code}`,
    `LINE ${X0} ${Y_ += 60 + 5} ${P_w} ${Y_} ${L_H}`, // -----------
    `LEFT`,
    `SETMAG 2 2`,
    `${T_0} 0 ${X0} ${Y_ += 5} 收`,
    `SETMAG 0 0`,
    `${T_0} 0 ${X0 + 60} ${Y_} ${recManName}`,
    ...(() => coo___divide_array_to_n_parts(recAddr.split(""), 20)
      .map(e => e.join(""))
      .map(e => `${T_0} 0 ${X0 + 60} ${Y_ += 30} ${e}`)
    )(),
    `LINE ${X0} ${Y_ += 25} ${P_w} ${Y_} ${L_H}`, // -----------

    `SETMAG 2 2`,
    `${T_0} 0 ${X0} ${Y_ += 5} 团`,
    `SETMAG 0 0`,
    ...(() => coo___divide_array_to_n_parts(`${sendManName} ${sendAddr}`.split(""), 20)
      .map(e => e.join(""))
      .map((e, i) => `${T_0} 0 ${X0 + 60} ${Y_ += (i === 0 ? 0 : 30)} ${e}`)
    )(),
    `LINE ${X0} ${Y_ += 25} ${P_w} ${Y_} ${L_H}`, // -----------
    `LEFT ${P_w}`,
    `${T_0} 0 ${X0} ${Y_ += 5} 备注：${"无"}`,
    `FORM`,
    `PRINT`,
  ];
  const arr_page = [`! 0 200 200 ${P_h} 1`];
  return [...arr_page, ...arr_content].reduce((str, e) => `${str}\r\n${e}`);
}



export function on_get_printer_str_order_dryclean_pre_barcodes(_order: PreBarCodeDryclean, blue_device: Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice) {
  if (utils_str_includes(["Printer_"], blue_device.name)) {
    const is_DEV = getMyEnv().envVersion === "develop";
    let Y_ = 150; // +左 -右
    const regimentAddress = `${_order.name}`;
    const add = 60; // +上 -下
    const rotation = "90"; // 旋转角度

    const __arr_new = [
      is_DEV ? `DENSITY 9` : `DENSITY 1`,
      `SET CUTTER OFF`, // 在 PRINT 命令结束后切纸
      `CLS`, // 清除缓冲区数据
      `TEXT ${Y_},${add},"TSS24.BF2",${rotation},${2},${2},"${_order.code.toUpperCase()}"`,
      `TEXT ${Y_},${330 + add},"TSS24.BF2",${rotation},${2},${2},"团:${regimentAddress}"`,
      `BARCODE ${Y_ += 105},${add},"128",100,0,${rotation},${4},${4},"${_order.code.toUpperCase()}"`,
      `PRINT 1,1`,
    ];
    // [
    //   `SIZE 30 mm, 150 mm`
    //   `DENSITY 1`,
    //   `SET CUTTER OFF`, // 在 PRINT 命令结束后切纸
    //   // `SET CUTTER BATCH`, // 在 PRINT 命令结束后切纸
    //   `CLS`, // 清除缓冲区数据
    //   `TEXT ${Y_ += 0},${30 + add},"TSS24.BF2",${rotation},${1},${1},"${_order.code.toUpperCase()}"`,
    //   `TEXT ${Y_ += 0},${270 + add},"TSS24.BF2",${rotation},${1},${1},"团:${regimentAddress}"`,
    //   `BARCODE ${Y_ += 90},${30 + add},"128",83,0,${rotation},${2},${2},"${_order.code.toUpperCase()}"`,
    //   `PRINT 1,1`,
    // ]
    const arr = [`SIZE 30 mm, 150 mm`, ...__arr_new,];
    return arr!.reduce((str, e) => `${str}\r\n${e}`);
  } else {
    throw new Error("不支持该打印机5");
  }
}