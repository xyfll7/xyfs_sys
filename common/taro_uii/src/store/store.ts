import Taro from "@tarojs/taro";
import { coo___JSON_str_code, coo___deep } from "@xyfs/utils/util";
import throttle from 'just-throttle';
import { create } from 'zustand';
import { Delivery_Account, PriceScheme_Type, ProductCategory_DICT } from "../../types/type_index";
import { OrderInfo, Product_Express } from "../../types/type_product";
import { AddressInfo, DeptInfo } from "../../types/type_user";
import { Api_common_list, Api_login_rqs } from '../api/api__users';
import { Order_ST, PickUp_ST, Product_category_ST, ROLE_ST } from "../config";
import { getMyEnv } from "../env";
import { roo___has_role, roo___my_dept } from "../roles";
import { Taro_getStorageSync } from "../utils/try_catch";
import { utils_order_merge_servicer_info } from '../utils/util';

interface State_Dicts {
  dicts_roles: ROLE_ST[] | null;
  dicts_delivery: Delivery_Account[] | null;
  dicts_logisticPricescheme: PriceScheme_Type[] | null,
  dicts_product_category: ProductCategory_DICT[] | null;
  fetch: () => void;
}
export const useSTDicts = create<State_Dicts>((set) => ({
  dicts_roles: null,
  dicts_delivery: null,
  dicts_logisticPricescheme: null,
  dicts_product_category: null,
  fetch: async () => {
    const [dicts_roles, dicts_delivery, dicts_logisticPricescheme, dicts_product_category] = await Promise.all([
      Api_common_list<ROLE_ST[]>('dicts_roles'),
      Api_common_list<Delivery_Account[]>('dicts_delivery'),
      Api_common_list<PriceScheme_Type[]>('dicts_logisticPricescheme'),
      Api_common_list<ProductCategory_DICT[]>('dicts_product_category'),
    ]);
    set(() => ({
      dicts_roles,
      dicts_delivery,
      dicts_logisticPricescheme,
      dicts_product_category
    }));
  },
}));

interface State_SelfInfo {
  selfInfo: DeptInfo | null;
  sett: (selfInfo?: DeptInfo) => Promise<DeptInfo>;
  setSelfInfoTheme: (theme: keyof Taro.onThemeChange.ITheme) => void;
}
const ___Api_login_rqs = throttle(Api_login_rqs, 3000, { leading: true });
export const useSTSelf = create<State_SelfInfo>((set, get) => ({
  selfInfo: null,
  sett: async (selfInfo) => {
    const res = Taro.getAppBaseInfo();
    const theme = res.theme ?? "light";
    if (selfInfo) {
      Taro.setStorageSync("OPENID", selfInfo.OPENID);
      Taro.setStorageSync("DEPTID", selfInfo.deptId);
      set((s) => ({ selfInfo: { theme, ...s.selfInfo, ...selfInfo, } }));
      return { theme, ...get().selfInfo, ...selfInfo, };
    }
    const res_selfInfo = await ___Api_login_rqs();
    if (res_selfInfo) { // 这里不能删，因为throttle截流 被拦截了的调用会返回 undefined
      Taro.setStorageSync("OPENID", res_selfInfo.OPENID);
      Taro.setStorageSync("DEPTID", res_selfInfo.deptId);
      if (JSON.stringify(get().selfInfo) !== JSON.stringify(res_selfInfo)) { // 如果获取的数据和本地数据一样则不刷新
        set((s) => ({ selfInfo: { theme, ...s.selfInfo, ...res_selfInfo, } }));
      }
      return { theme, ...get().selfInfo, ...res_selfInfo };
    }
    return get().selfInfo!;
  },
  setSelfInfoTheme: (theme) => {
    set(({ selfInfo }) => ({ selfInfo: { ...selfInfo!, theme: theme } }));
  }
}));

interface State_Express {
  express: OrderInfo<Product_Express> & { ___show?: boolean, };
  sett: (express?: OrderInfo<Product_Express> & { ___show?: boolean, }) => void;
}


export const useSTExpress = create<State_Express>((set, _, state) => ({
  express: {
    productList: [{
      deliveryId: null,
      bizId: "",
      deliveryName: "",
      expressType: "",
      recMan: null,
      sendMan: null,
      itemType: "",
      itemNotes: "",
      weight: "",
      describe: "快递",
      price: "",
      pickUpPrice: "",
      totalPrice: "",
      logisticPriceSchemeId: 0
    }],
    pickUpType: PickUp_ST.到店寄件,
    totalPrice: "",
    orderStatus: Order_ST.待付款,
    productCategory: Product_category_ST.快递,
    ___show: false,
  },
  sett: (express) => set((s) => {
    const selfInfo_S = useSTSelf.getState().selfInfo;
    if (selfInfo_S) {
      s.express = {
        ...utils_order_merge_servicer_info(selfInfo_S!) as OrderInfo<Product_Express>,
        ...s.express,
        productList: [{
          ...s.express?.productList?.[0],
          logisticPriceSchemeId: roo___my_dept(selfInfo_S)?.logisticPriceSchemeId
        }],
      };
      // 如果只有一个快递公司默认选择
      if (selfInfo_S.logistics?.length === 1) {
        s.express.productList![0]!.deliveryId = selfInfo_S.logistics[0]!.deliveryId;
        s.express.productList![0]!.bizId = selfInfo_S.logistics[0]!.bizId;
        s.express.productList![0]!.deliveryName = selfInfo_S.logistics[0]!.deliveryName;
      }
      // 用户进来自动填写默认地址
      if (roo___has_role(selfInfo_S, ["USER"], "only") && !s.express.productList![0]!.sendMan) {
        s.express.productList![0]!.sendMan = selfInfo_S.defaultSendManAddress;
        s.express.pickUpType = PickUp_ST.上门取件;
      }
    }
    if (express?.___show === false) {
      const _express = coo___deep(state.getInitialState().express);
      _express.productList![0]!.sendMan = s.express.productList?.[0]?.sendMan;
      return { express: JSON.parse(JSON.stringify(_express, coo___JSON_str_code)) };
    }

    if (express) {
      s.express = {
        ...s.express,
        ...express,
        productList: [{
          ...s.express?.productList?.[0],
          ...express?.productList?.[0],
          recMan: {
            ...s.express!.productList![0]!.recMan!,
            ...express?.productList?.[0]!.recMan,
            ...(express?.productList?.[0]!.recMan?.mobile ? { mobile: express?.productList?.[0]!.recMan?.mobile?.replace(/[^0-9|-]/g, "") } : null)
          } satisfies AddressInfo,
          sendMan: {
            ...s.express!.productList![0]!.sendMan!,
            ...express?.productList?.[0]!.sendMan,
            ...(express?.productList?.[0]!.sendMan?.mobile ? { mobile: express?.productList?.[0]!.sendMan?.mobile?.replace(/[^0-9|-]/g, "") } : null)
          } satisfies AddressInfo,
        }],
      };
      return { express: JSON.parse(JSON.stringify(s.express, coo___JSON_str_code)) };
    } else {
      return { express: coo___deep(state.getInitialState().express) };
    }
  }),
}));


const ___MY_BLUE_DEVICES___ = "___MY_BLUE_DEVICES___";
interface State_Blue {
  blueDevices: Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice[],
  sett: (devices: Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice[]) => void,
}

export const useSTBlueDevices = create<State_Blue>((set) => ({
  blueDevices: Taro_getStorageSync<Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice[]>(___MY_BLUE_DEVICES___, getMyEnv()) ?? [],
  sett: (devices) => set(() => {
    Taro.setStorageSync(___MY_BLUE_DEVICES___, devices);
    return { blueDevices: devices };
  }),
}));


