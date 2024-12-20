// :: pages_regiment/regiment_orders_express
import { Picker, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { OrderInfo, Pagination, Product_Express } from "@xyfs/taro_uii";
import { Api_logistic_waybill_ctn } from '@xyfs/taro_uii/api/api__logistics';
import { Api_order_cancel_ctn, Api_order_incrPrintTimes_ctn, Api_order_list_ctn, Api_order_pay_ctn, Api_order_remove_ctn } from '@xyfs/taro_uii/api/api__orders';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComCardOrderExpress } from '@xyfs/taro_uii/components/ComCardOrder';
import { ComListTypeSelectorNew } from "@xyfs/taro_uii/components/ComListTypeSelectorNew";
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComQRCode } from '@xyfs/taro_uii/components/ComQRCode';
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSearcher } from '@xyfs/taro_uii/components/ComSearcher';
import { ComSquare } from '@xyfs/taro_uii/components/ComSquare';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { Order_ST, Refund_ST } from "@xyfs/taro_uii/src/config";
import { IM_线上_收款码 } from "@xyfs/taro_uii/src/image";
import { useSTSelf } from "@xyfs/taro_uii/store/store";
import { on_get_printer_str_order_express, on_start_print } from "@xyfs/taro_uii/utils/bluetooth/useHooks_Blue";
import { Taro_getCurrentInstance, try_Taro_navigateTo, try_Taro_requestPayment, try_Taro_showModal } from '@xyfs/taro_uii/utils/try_catch';
import { useHook_pageListNew, useHook_Reducer } from '@xyfs/taro_uii/utils/useHooks';
import { coo___ios_date, coo___isNumber } from "@xyfs/utils/util";
import { format } from "date-fns";
import { FC, useCallback, useState } from "react";

definePageConfig({
  navigationStyle: "custom", enableShareAppMessage: true, disableScroll: true,
  // "styleIsolation": "shared",
  // "componentFramework": "glass-easel",
  // "renderer": "skyline",
});

export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC<{}> = ({ }) => {
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const { options } = Taro_getCurrentInstance<{ order_ST: string; }>();
  const [date, setDate] = useState<string>("");
  const [tabIndex, setTabIndex] = useState<Order_ST>(Number(options.order_ST ?? Order_ST.待付款));

  const [searchValue, setSearchValue] = useHook_Reducer("");

  const ___page_getter = useCallback(async (p: Pagination<unknown>) =>
    await Api_order_list_ctn({
      ...p,
      orderDate: date,
      orderStatus: tabIndex,
      orderType: 1, // 全部0, 快递1 干洗2 未知3
      keyword: searchValue,
    }), [tabIndex, searchValue, date]);
  const { page, page_loading, page_list_get, page_list_update, page_init } = useHook_pageListNew(___page_getter);

  return <MMMAAPage>
    <ComNav>
      <View className='ww prl10'>
        <ComNavBarA className='mb10 '>
          <ComButton ll className='bcctrans cccplh ml10' >快递订单(团长)</ComButton>
        </ComNavBarA>
        <View className='dbtc '>
          <ComListTypeSelectorNew
            className='ww' disabled={page_loading} enumData={Order_ST} typeList={[Order_ST.待付款, Order_ST.已付款, Order_ST.已退款]}
            tabType={tabIndex} setTab={(e) => { page_init(); setTabIndex(e); }} />
          <ComQRCode className='mb10  bccwhite cccgreen' params={{
            buttonText: "收款码",
            title: "请顾客扫此二维码支付",
            desc: ["可将此二维码保存打印", "顾客扫此二维码打开“待付款”订单列表"],
            src: IM_线上_收款码
          }} isShow={showQRCode} onClose={() => { setShowQRCode(!showQRCode); }} onClick={() => setShowQRCode(!showQRCode)}></ComQRCode>
        </View>
        <ComSearcher className='mb10' date={date} disabled={Boolean(page_loading)} isShowScan={[Order_ST.已付款, Order_ST.已退款].includes(tabIndex)}
          onClear={() => setDate("")}
          onSetSearchValue={(e) => {
            setDate("");
            setSearchValue(e);
            page_init();
          }} >
          <Picker
            className='ml10'
            header-text='按订单日期查询'
            value={date}
            end={format(coo___ios_date(), "yyyy-MM-dd")}
            mode='date'
            fields='day'
            onChange={async (e) => { setDate(e.detail.value); page_init(); }}>
            <ComButton rr ll={Boolean(date)} className='cccgreen'> {date ? date.replaceAll("-", "/").slice(4) : "日期"}</ComButton>
          </Picker>
        </ComSearcher>
      </View>
    </ComNav>
    <ComScrollView onScrollToLower={async () => { page_list_get(page); }}>
      {page.list?.map((e) => {
        const ee1 = e as OrderInfo<Product_Express>;
        return <View className='bccwhite IOO mb10 ww' key={e.id}>
          <ComCardOrderExpress key={e.id} className='mb10' order={ee1} />
          <IIIOrderExpressOperation
            onSetShowQRCode={(ee) => setShowQRCode(ee)}
            orderType={tabIndex}
            order={ee1}
            onPrint={async (ee) => {
              const _order = ee;
              await on_start_print((blue_device) => {
                return {
                  cpcl: _order.productList!.map(eee => on_get_printer_str_order_express({ ..._order, __product: eee, }, blue_device, "cpcl")),
                  tspl: _order.productList!.map(eee => on_get_printer_str_order_express({ ..._order, __product: eee, }, blue_device, "tspl")),
                };
              }, { orderId: _order.id!, selfInfo_S: useSTSelf.getState().selfInfo });
              page_list_update((p) => ({
                ...p,
                list: p.list!.map(item => item.id === ee.id ? { ...ee, printTimes: coo___isNumber(ee.printTimes) ? ee.printTimes! + 1 : 1 } : item)
              }));
              Taro.showLoading({ mask: true, title: "更新打印次数..." });
              await Api_order_incrPrintTimes_ctn({ orderId: _order.id!, }); // 增加打印次数
              Taro.showToast({ icon: "none", title: "打印完成", });
            }}

            onDeleteOrder={() => { page_list_update(p => ({ ...p, list: p.list!.filter(item => item.id !== ee1.id) })); }} />
        </View>;
      })}
      <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)}></ComLoading>
    </ComScrollView>
  </MMMAAPage>;
};





const IIIOrderExpressOperation: FC<{
  onSetShowQRCode: (e: boolean) => void;
  orderType: Order_ST;
  order: OrderInfo<Product_Express>;
  onDeleteOrder: () => void;
  onPrint?: (e: OrderInfo<Product_Express>) => Promise<void>;
}> = ({ onSetShowQRCode, onDeleteOrder, orderType, order, onPrint, }) => {
  return (
    <View className='prl10'>
      {(orderType == Order_ST.待付款) && (
        <View className='dbtc mb10 ww'>
          <ComButton ll className='cccplh bborder'
            onClick={async () => {
              if (await try_Taro_showModal({ content: "您确定要删除该订单吗？" })) {
                Taro.showLoading({ mask: true, title: "删除中...", });
                await Api_order_remove_ctn({ orderId: order.id!, });
                onDeleteOrder();
                Taro.showToast({ icon: "none", title: "删除成功", });
              } else {
                throw new Error("取消");
              }
            }}>
            删除
          </ComButton>
          <ComButton rr className='cccgreen bborder' onClick={async () => {
            await try_Taro_navigateTo({
              url: "/pages_comm/comm__product_express",
              success: (e) => { e.eventChannel.emit('cloneExpress', { ...order, __isEdit: true }); }
            });
          }} >修改订单</ComButton>
        </View>
      )}
      {order.userId === order?.regimentId && (
        <View className='dbtc mb10 ww'>
          <ComButton ll className='cccplh'>下单人：团长自己</ComButton>
          <ComButton rr ll className='bccyellow'
            onClick={async () => {
              Taro.showLoading({ mask: true, title: "获取支付参数...", });
              const res_pay = await Api_order_pay_ctn({ orderId: order.id!, });
              // 吊起微信支付 -> 打开支付成功弹窗
              Taro.showLoading({ mask: true, title: "支付...", });
              await try_Taro_requestPayment({ ...res_pay, package: res_pay.packageStr });
              Taro.showToast({ icon: "none", title: `支付成功,订单移入"已付款"` });
              onDeleteOrder();
            }}>
            <ComSquare className='icon-wxpay mr4' style={{ width: "calc(1.3 * var(--rem_base))" }} />
            <Text className='nw'>支付</Text>
          </ComButton>
        </View>
      )}
      {order.userId !== order?.regimentId && orderType === Order_ST.待付款 && (
        <View className=' dbtc ww mb10'>
          <ComButton ll className='cccplh'>下单人：用户</ComButton>
          {order.productList?.[0]?.weight && <ComButton rr className='bccyellow'
            onClick={() => onSetShowQRCode(true)} >
            收款码
          </ComButton>}
        </View>
      )}
      {orderType == Order_ST.已付款 && (
        <View className='ww dbtc mb10 ww'>
          {(order.refundStatus !== Refund_ST.失败 && order.productList?.[0]?.waybillId) ?
            <ComButton ll className='cccplh bborder'
              onClick={async () => {
                if (await try_Taro_showModal({ title: "您确定要回收该面单号并退款吗？", })) {
                  Taro.showLoading({ mask: true, title: "退款中...", });
                  await Api_order_cancel_ctn({ orderId: order.id!, });
                  onDeleteOrder();
                  Taro.hideLoading();
                  try_Taro_showModal({ title: "退款操作成功", content: `订单移入"已退款"`, showCancel: false, });
                } else {
                  throw new Error("取消");
                }
              }}>
              回收面单→退款
            </ComButton> :
            <ComButton ll className='cccplh bborder'
              onClick={async () => {
                if (await try_Taro_showModal({ content: "您确定要退款?", confirmText: "确认退款", })) {
                  Taro.showLoading({ mask: true, title: "退款中...", });
                  await Api_order_cancel_ctn({ orderId: order.id!, });
                  onDeleteOrder();
                  Taro.hideLoading();
                  try_Taro_showModal({ title: "退款操作成功", content: `订单移入"已退款"`, showCancel: false, });
                } else {
                  throw new Error("取消");
                }
              }}>退款</ComButton>
          }
          {order.refundStatus === Refund_ST.失败 ? <View className='cccprice'>退款失败，请手动重试</View> : (

            (order.productList?.[0]?.waybillId ?
              <ComButton rr className='cccgreen bborder' onClick={() => { onPrint?.(order); }}>
                打印{order.printTimes ?? 0}次
              </ComButton> :
              <ComButton rr className='cccgreen bborder' onClick={async () => {
                Taro.showLoading({ mask: true, title: "获取面单号...", });
                const [res_waybill] = await Api_logistic_waybill_ctn({ orderId: order.id!, });
                Taro.showToast({ icon: "none", title: "获取成功", });
                // 打印
                await onPrint?.({
                  ...order,
                  productList: [{
                    ...order!.productList![0],
                    bigWord: res_waybill.bigWord,
                    packagePlace: res_waybill.packagePlace,
                    waybillId: res_waybill.waybillId
                  }]
                });
              }}>
                获取单号→打印
              </ComButton>
            )
          )}
        </View >
      )}
    </View>
  );
};
