import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { coo___objToUrl } from "@xyfs/utils/util";
import { Api_logistic_waybill_ctn } from "../api/api__logistics";
import { Api_order_pay_ctn } from "../api/api__orders";
import { Order_ST } from "../config";
import { useSTExpress, useSTSelf } from "../store/store";
import { on_get_cpcl_str_order_express, on_start_print } from "../utils/bluetooth/useHooks_Blue";
import { try_Taro_requestPayment, try_Taro_setClipboardData } from "../utils/try_catch";
import { ComButton } from "./ComButton";
import { ComNavBarB } from "./ComNavBarB";
import { ComPopupNew } from "./ComPopupNew";
import { ComSquare } from "./ComSquare";
import { MMMShare } from "./MMMShare";



export function ComPaySuccessCard() {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const express_S = useSTExpress(s => s.express);
  return <>
    {Boolean(express_S?.___show) &&
      <ComPopupNew className=' ww'>
        <View className='prl10'>
          <ComNavBarB className='mb10 ww' showClose={false}>
            <ComButton className='fwb bccback'>{{ [`${Order_ST.待付款}`]: `取消支付`, [`${Order_ST.已付款}`]: `支付成功`, [`default`]: `默认标题`, "3": "", "4": "" }[express_S?.orderStatus ?? "default"]}</ComButton>
            <ComButton className='cccgreen' onClick={() => useSTExpress.getState().sett({ ___show: false })}>
              {express_S?.orderStatus === Order_ST.待付款 && "稍后支付→关闭"}
              {express_S?.orderStatus === Order_ST.已付款 && !express_S.printTimes && "稍后打印→关闭"}
              {express_S?.orderStatus === Order_ST.已付款 && Boolean(express_S.printTimes) && "关闭"}
            </ComButton>
          </ComNavBarB>
          <View className='dbtc mb10 ww'>
            <ComButton className='cccplh' >
              {{ [Order_ST.待付款]: `订单移入"待付款"`, [Order_ST.已付款]: `订单移入"已付款"`, default: `默认内容`, "3": "", "4": "" }[express_S?.orderStatus ?? "default"]}
            </ComButton>
            <ComButton className='cccgreen'
              onClick={async () => {

                const url = ((): string => {
                  switch (express_S?.orderStatus) {
                    case Order_ST.待付款: return `/pages_regiment/regiment_orders_express?${coo___objToUrl({ order_ST: String(Order_ST.待付款) })}`;
                    case Order_ST.已付款: return `/pages_regiment/regiment_orders_express?${coo___objToUrl({ order_ST: String(Order_ST.已付款) })}`;
                    default: return `/pages_regiment/regiment_orders_express`;
                  }
                })();
                Taro.redirectTo({ url: url });
              }}>
              查看订单
            </ComButton>
          </View>
          {express_S?.orderStatus === Order_ST.待付款 &&
            <View className='ww dr'>
              <ComButton ll className='bccyellow  mb10'
                onClick={async () => {
                  Taro.showLoading({ mask: true, title: "获取支付参数...", });
                  const res_pay = await Api_order_pay_ctn({ orderId: express_S.id!, });
                  Taro.showLoading({ mask: true, title: "支付中...", });
                  await try_Taro_requestPayment({ ...res_pay, package: res_pay.packageStr });
                  useSTExpress.getState().sett({ ...express_S, orderStatus: Order_ST.已付款 });
                  Taro.hideLoading();
                }}>
                <ComSquare className='icon-wxpay mr4' style={{ width: "calc(1.3 * var(--rem_base))" }} />
                <Text className='nw'>继续支付</Text>

              </ComButton>
            </View>
          }
          {express_S?.orderStatus === Order_ST.已付款 &&
            <>
              <View className='dbtc mb10 ww'>
                <ComButton className='cccplh' onClick={async () => {
                  if (!express_S.productList?.[0]?.waybillId) { return; }
                  await try_Taro_setClipboardData({ data: express_S.productList?.[0]?.waybillId });
                  Taro.showToast({ icon: "none", title: "已复制", });
                }}>
                  <View className='dy'>单号：{express_S.productList?.[0]?.waybillId ?? "暂无"} {express_S.productList?.[0]?.waybillId && <View className='ml10 cccgreen'>复制</View>} </View>
                </ComButton>
                {express_S.productList?.[0]?.waybillId &&
                  <MMMShare id={express_S?.id} orderType='快递' name={selfInfo_S?.name ?? ""} ></MMMShare>
                }
              </View>
              <View className='dr ww mb10'>
                {!express_S.productList?.[0]?.waybillId ?
                  <ComButton className='bccyellow'
                    onClick={async () => {
                      Taro.showLoading({ mask: true, title: "获取面单号...", });
                      const [res_waybill] = await Api_logistic_waybill_ctn({ orderId: express_S.id!, });
                      useSTExpress.getState().sett({
                        productList: [{
                          bigWord: res_waybill.bigWord,
                          packagePlace: res_waybill.packagePlace,
                          waybillId: res_waybill.waybillId
                        }]
                      });
                      Taro.showToast({ icon: "none", title: `获取成功` });

                      const _order = useSTExpress.getState().express!;
                      await on_start_print((blue_device) => {
                        return _order.productList!.map(eee => on_get_cpcl_str_order_express({ ..._order, productList: [eee], }, blue_device));
                      }, { orderId: _order.id, selfInfo_S });
                      useSTExpress.getState().sett({ printTimes: (express_S.printTimes ?? 0) + 1 });
                    }}>获取单号→打印</ComButton> :
                  <ComButton className='bccyellow ' onClick={async () => {
                    const _order = express_S;
                    await on_start_print((blue_device) => {
                      return _order.productList!.map(eee => on_get_cpcl_str_order_express({ ..._order, productList: [eee], }, blue_device));
                    }, { orderId: _order.id, selfInfo_S });
                    useSTExpress.getState().sett({ printTimes: (express_S.printTimes ?? 0) + 1 });
                  }}>打印 {express_S?.printTimes ?? 0} 次
                  </ComButton>
                }
              </View>
            </>
          }
        </View>
      </ComPopupNew>
    }
  </>;
}