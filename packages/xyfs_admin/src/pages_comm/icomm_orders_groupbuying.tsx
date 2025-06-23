// :: pages_comm/icomm_orders_groupbuying
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { OrderInfo, Pagination, Product_Dryclean } from "@xyfs/taro_uii";
import { Api_logistic_createWaybill_ctn } from "@xyfs/taro_uii/api/api__logistics";
import { Api_order_cancel_ctn, Api_order_incrPrintTimes_ctn, Api_order_list_ctn, Api_order_remove_ctn, Api_order_shipments_ctn } from '@xyfs/taro_uii/api/api__orders';
import { ComButton } from "@xyfs/taro_uii/components/ComButton";
import { ComCardOrderBringGoods } from '@xyfs/taro_uii/components/ComCardOrder';
import { ComListTypeSelectorNew } from "@xyfs/taro_uii/components/ComListTypeSelectorNew";
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSearcher } from '@xyfs/taro_uii/components/ComSearcher';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { Order_deliveryStatus_ST, Order_ST, Product_category_ST } from "@xyfs/taro_uii/src/config";
import { roo___has_role, roo___role_getRoleInfo } from "@xyfs/taro_uii/src/roles";
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { on_get_printer_str_order_bing_goods, on_get_printer_str_order_bing_goods_waybill, on_start_print } from "@xyfs/taro_uii/utils/bluetooth/useHooks_Blue";
import { try_Taro_hideLoading, try_Taro_showActionSheet, try_Taro_showModal } from '@xyfs/taro_uii/utils/try_catch';
import { useHook_getCurrentInstance, useHook_pageListNew, useHook_Reducer } from '@xyfs/taro_uii/utils/useHooks';
import { utils_arr_includes } from "@xyfs/taro_uii/utils/util";
import { coo___unique_arr } from "@xyfs/utils/util";
import { FC, useCallback, useState } from "react";

definePageConfig({ navigationStyle: "custom", enableShareAppMessage: true, disableScroll: true, });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC<{}> = ({ }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const { options } = useHook_getCurrentInstance<{ order_ST?: Order_ST; }>();

  const [orderType, setOrderType] = useState<Order_ST>(options.order_ST ?? Order_ST.待付款);
  const [searchValue, setSearchValue] = useHook_Reducer("");
  const ___page_getter = useCallback(async (p: Pagination<unknown>) =>
    await Api_order_list_ctn({
      ...p,
      orderType: 4,
      orderStatus: orderType,
      keyword: searchValue,
      roleId: roo___role_getRoleInfo(useSTSelf.getState().selfInfo!, "商家")?.id
    }), [orderType, searchValue]);
  const { page, page_loading, page_list_get, page_list_update, page_init } = useHook_pageListNew(___page_getter);
  return <MMMAAPage>
    <ComNav className='prl10'>
      <ComNavBarA className='mb10'>
        <ComButton ll className='bcctrans cccplh ml10' >
          {roo___has_role(selfInfo_S, ['SUPPLIER']) && '团购订单/供应商'}
          {roo___has_role(selfInfo_S, ['REGIMENT']) && '团购订单/团长'}
          {roo___has_role(selfInfo_S, ['GROUPLEADER']) && '团购订单/团主'}
        </ComButton>
      </ComNavBarA>
      <ComListTypeSelectorNew className='' disabled={page_loading} enumData={Order_ST} typeList={[Order_ST.已付款, Order_ST.已退款]} tabType={orderType} setTab={(e) => { page_init(); setOrderType(e); }}></ComListTypeSelectorNew>
      <ComSearcher className='mb10' isShowSearcher onSetSearchValue={(e) => { page_init(); setSearchValue(e); }} ></ComSearcher>
    </ComNav>
    <ComScrollView onScrollToLower={async () => { await page_list_get(page); }}>
      {page.list?.map((order) => {
        if (order.orderType === Product_category_ST.团购) {
          return <IIIOrderCard order={order} key={order.id}
            onDeleteOrderItem={(eee) => { page_list_update(p => ({ ...p, list: p.list.filter(ee => ee.id !== eee.id) })); }}
            onUpdateOrderItem={(eee) => { page_list_update(p => ({ ...p, list: p.list.map(ee => ee.id == eee.id ? eee : ee) })); }} />;
        } else {
          return null;
        }
      })}
      <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)} />
    </ComScrollView>
  </MMMAAPage >;
};



const IIIOrderCard = ({ order, onDeleteOrderItem, onUpdateOrderItem }: { order: OrderInfo<any>; onUpdateOrderItem: (e: OrderInfo<Product_Dryclean>) => void, onDeleteOrderItem: (e: OrderInfo<Product_Dryclean>) => void; }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);

  const IS_PURE_PRINT = roo___has_role(selfInfo_S, ["GROUPLEADER"]);
  const model = (() => {
    if (true && IS_PURE_PRINT) {
      return "print";
    } else {
      return Boolean(order.productList?.filter(e => !e.waybillId)?.length) ? "waybill" : "print";
    }
  })();

  const [products, setProducts] = useState({
    "waybill": () => order.productList?.filter(e => !e.waybillId)!,
    "print": () => IS_PURE_PRINT ? order.productList! : coo___unique_arr(order.productList!, "waybillId")
  }[model]);

  return <View className='dll ww mb10 bccwhite ioo' key={order.id}>
    <ComCardOrderBringGoods isPurePrint={IS_PURE_PRINT} className='ww mb10' model={model} isShowSelector={roo___has_role(selfInfo_S, ['MERCHANT', "GROUPLEADER"])} key={order.id} products={products} order={order}
      onSelectOrder={(e) => {
        if (roo___has_role(selfInfo_S, ['MERCHANT'])) {
          if (model === "waybill" && utils_arr_includes([e.id!], products.map(ee => ee.id!))) {
            setProducts(products.filter(ee => ee.id !== e.id));
          } else if (model === "print" && utils_arr_includes([e.waybillId!], products.map(ee => ee.waybillId!))) {
            setProducts(products.filter(ee => ee.waybillId !== e.waybillId));
          } else {
            setProducts([...products, e].sort((a, b) => Number(a.id) - Number(b.id)));
          }
        } else if (IS_PURE_PRINT) {
          if (model === "print" && utils_arr_includes([e.id!], products.map(ee => ee.id!))) {
            setProducts(products.filter(ee => ee.id !== e.id));
          } else {
            setProducts([...products, e].sort((a, b) => Number(a.id) - Number(b.id)));
          }
        }

      }} />
    <View className='dr prl10 ww dwp'>
      {order.orderStatus === Order_ST.已付款 && roo___has_role(selfInfo_S, ["GROUPLEADER"]) &&
        <ComButton rr className='cccplh mb10 bborder nw' onClick={async () => {
          const res_modal = await try_Taro_showModal({ title: "提示", content: "您确定要删除该订单吗?", confirmText: "删除" });
          if (res_modal) {
            Taro.showLoading({ mask: true, title: "删除中..." });
            await Api_order_remove_ctn({ orderId: order.id!, });
            onDeleteOrderItem(order);
            Taro.showToast({ icon: "none", title: "删除成功" });
          } else {
            throw new Error("取消");
          }
        }}>删除</ComButton>
      }
      {order.orderStatus === Order_ST.已付款 && roo___has_role(selfInfo_S, ["GROUPLEADER"]) && <ComButton rr className='ml10 cccplh bborder mb10 nw' onClick={async () => {
        if (await try_Taro_showModal({ content: "您确定要退款?", confirmText: "确认退款", })) {
          Taro.showLoading({ mask: true, title: "退款中...", });
          await Api_order_cancel_ctn({ orderId: order.id!, });
          onDeleteOrderItem(order);
          try_Taro_hideLoading();
          try_Taro_showModal({ title: "退款操作成功", content: `订单移入"已退款"`, showCancel: false, });
        } else {
          throw new Error("取消");
        }
      }}>退款</ComButton>
      }
      {model === "waybill" && order.orderStatus === Order_ST.已付款 && roo___has_role(selfInfo_S, ['MERCHANT', "GROUPLEADER"]) && <ComButton className='ml10 mb10 ml10 bborder' onClick={async () => {
        if (!products.length) { Taro.showToast({ icon: "none", title: "至少选择一件商品" }); return; }
        Taro.showLoading({ mask: true, title: "获取中..." });
        const res = await Api_logistic_createWaybill_ctn({
          deliveryId: selfInfo_S.logistics?.[0]?.deliveryId!,
          orderId: order.id!,
          orderProductIds: products.map(e => e.id!),
        });
        const model_new = Boolean(res.productList?.filter(e => !e.waybillId)?.length) ? "waybill" : "print";
        ({
          "waybill": () => { setProducts(res.productList?.filter(e => !e.waybillId)!); },
          "print": () => { setProducts(res.productList!); },
        })[model_new]();
        onUpdateOrderItem(res);
        Taro.showToast({ icon: "none", title: "成功" });
      }}>
        <View className='cccprice'>{products?.map(e => order.productList?.findIndex(ee => ee.id === e.id)! + 1).join(",")}</View>
        <View className='cccgreen'>获取面单</View>
      </ComButton>}
      {model === "print" && order.orderStatus === Order_ST.已付款 && roo___has_role(selfInfo_S, ['MERCHANT', "GROUPLEADER"]) && <ComButton rr className='ml10 bborder mb10 nw' onClick={async () => {
        if (!products.length) { Taro.showToast({ icon: "none", title: "至少选择一件商品" }); return; }
        const [, res_item] = await try_Taro_showActionSheet({
          alertText: "打印方式",
          itemList: ["合单打印", "分单打印"],
        });
        if (res_item === "合单打印") {
          await on_start_print((blue_device) => {
            return {
              cpcl: (() => {
                if (order.productList?.some(e => e.waybillId)) {
                  return [on_get_printer_str_order_bing_goods_waybill({ ...order, productList: products, __product: order.productList?.[0] }, "merge", blue_device)];
                } else {
                  return [on_get_printer_str_order_bing_goods({ ...order, productList: products, __product: order.productList?.[0] }, "merge", blue_device)];
                }
              })()
            };
          }, { orderId: order.id!, selfInfo_S });
        }
        if (res_item === "分单打印") {
          await on_start_print((blue_device) => {
            return {
              cpcl: products!.map((eee, index) => {
                const count = order.productList?.filter(e => e.waybillId === eee.waybillId).length;
                if (eee.waybillId) {
                  return on_get_printer_str_order_bing_goods_waybill({ ...order, __product: eee, __index: index, __count: count }, "divide", blue_device);
                } else {
                  return on_get_printer_str_order_bing_goods({ ...order, __product: eee, __index: index, __count: count }, "divide", blue_device);
                }
              })
            };
          }, { orderId: order.id!, selfInfo_S });
        }

        Taro.showLoading({ mask: true, title: "更新打印次数..." });
        const print_orders = order.productList?.filter(e => products.some(ee => ee.waybillId === e.waybillId))?.map(e => e.id!);
        await Api_order_incrPrintTimes_ctn({ orderId: order.id!, orderProductIds: print_orders }); // 增加打印次数
        // 本地更新打印次数
        onUpdateOrderItem({
          ...order,
          productList: order.productList?.map(ee => print_orders?.some(eee => eee === ee.id) ? ({ ...ee, printTimes: ee.printTimes! += 1 }) : ee)
        });
        // 反选
        setProducts(order.productList?.filter(ee => !print_orders?.some(eee => eee === ee.id))!);
        Taro.showToast({ icon: "none", title: "打印完成", });
      }}>
        {IS_PURE_PRINT && <View className='cccprice'>{products?.map(e => order.productList?.findIndex(ee => ee.id === e.id)! + 1).join(",")}</View>}
        {!IS_PURE_PRINT && <View className='cccprice'>{products?.map(e => order.productList?.findIndex(ee => ee.waybillId === e.waybillId)! + 1).join(",")}</View>}
        <View className='cccgreen'>打印</View>
      </ComButton>
      }
      {order.deliveryStatus === Order_deliveryStatus_ST.待发货 &&
        <ComButton rr className="mb10 bborder ml10" onClick={async () => {
          Taro.showLoading({ mask: true, title: "发货中..." });
          const res = await Api_order_shipments_ctn({ orderId: order.id! });
          try_Taro_hideLoading();
          Taro.showToast({ icon: "none", title: "发货成功" });
          onUpdateOrderItem({ ...order, deliveryStatus: Order_deliveryStatus_ST.待收货 });
        }}>确认发货</ComButton>
      }

    </View>
    <View>{order.transactionId}</View>
  </View>;
}






