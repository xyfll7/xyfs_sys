// :: pages_user/user_orders
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Pagination } from "@xyfs/taro_uii";
import { Api_logistic_waybill_ctn } from "@xyfs/taro_uii/api/api__logistics";
import { Api_order_list_ctn, Api_order_pay_ctn, Api_order_print_ctn, Api_order_remove_ctn } from "@xyfs/taro_uii/api/api__orders";
import { Api_cart_share_ctn } from "@xyfs/taro_uii/api/api__shop";
import { ComButton } from "@xyfs/taro_uii/components/ComButton";
import { ComCardOrderBringGoods, ComCardOrderDryclean, ComCardOrderExpress, ComCardOrderSundries } from "@xyfs/taro_uii/components/ComCardOrder";
import { ComListTypeSelectorNew } from "@xyfs/taro_uii/components/ComListTypeSelectorNew";
import { ComLoading } from "@xyfs/taro_uii/components/ComLoading";
import { ComNav } from "@xyfs/taro_uii/components/ComNav";
import { ComNavBarA } from "@xyfs/taro_uii/components/ComNavBarA";
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSquare } from "@xyfs/taro_uii/components/ComSquare";
import { ComSELFView, MMMAAPage } from "@xyfs/taro_uii/components/MMMAAPage";
import { Order_deliveryStatus_ST, Order_ST, Product_category_ST } from "@xyfs/taro_uii/src/config";
import { useSTExpress } from "@xyfs/taro_uii/store/store";
import { OrderInfo, Product_Express, ProductBase } from "@xyfs/taro_uii/type_product";
import { try_Taro_hideLoading, try_Taro_openBusinessView, try_Taro_requestPayment, try_Taro_showModal } from "@xyfs/taro_uii/utils/try_catch";
import { useHook_getCurrentInstance, useHook_pageListNew } from "@xyfs/taro_uii/utils/useHooks";
import { coo___urlToObj } from "@xyfs/utils/util";
import { FC, useCallback, useEffect, useState } from "react";

definePageConfig({ navigationStyle: "custom", enableShareAppMessage: true, disableScroll: true });
export default function COMSELFWarp() { return <ComSELFView><Index /> </ComSELFView>; };
const Index: FC = () => {
  const [shareOrder, isShare, isPay] = useProductDryCleanEditor();
  return <>
    {isShare === null && <ComNav className='prl20'><ComLoading /></ComNav>}
    {isShare === false && <ComNav className='prl10'>
      <View className='ww dll'>
        <ComButton className='mb10 ml10'>待支付干洗订单</ComButton>
        <ComCardOrderDryclean className='ww' order={shareOrder} />
      </View>
    </ComNav>}
    {isShare && <IIIOrderList isPay={isPay} />}
  </>;
};




const IIIOrderList = ({ isPay }: { isPay: boolean; }) => {
  const { options } = useHook_getCurrentInstance<{ order_ST: string; }>();
  const [orderType, setOrderType] = useState<Order_ST>((() => {
    if (isPay) {
      return Order_ST.已付款;
    } else {
      return options.order_ST ? (Number(options.order_ST) as Order_ST) : Order_ST.待付款;
    }
  })());


  const deleteOrder = async (order: OrderInfo<ProductBase>) => {
    if ((await try_Taro_showModal({ title: "提示", content: "您确定要删除该订单吗？" }))) {
      Taro.showLoading({ mask: false, title: "删除中...", });
      await Api_order_remove_ctn({ orderId: order.id!, });
      page_list_update((p) => ({ ...p, list: p.list.filter(eee => eee.id !== order.id) }));
      try_Taro_hideLoading();
    }
  };
  const ___page_getter = useCallback(async (p: Pagination<unknown>) =>
    await Api_order_list_ctn({
      ...p,
      orderStatus: orderType,
      keyword: ""
    }), [orderType]);
  const { page, page_loading, page_list_get, page_list_update, page_init } = useHook_pageListNew(___page_getter,);

  return <MMMAAPage>
    <ComNav>
      <View className='ww'>
        <ComNavBarA className='mb10 pl10'>
          <ComButton ll className='bcctrans cccplh ml10' >我的订单</ComButton>
        </ComNavBarA>
        <ComListTypeSelectorNew className='ml10  ww' disabled={page_loading} enumData={Order_ST} typeList={[Order_ST.待付款, Order_ST.已付款, Order_ST.已退款]}
          tabType={orderType} setTab={(e) => { setOrderType(e); page_init(); }} />
      </View>
    </ComNav>
    <ComScrollView onScrollToLower={async () => { page_list_get(page); }}>
      {page.list?.map((order) => {
        if (Number(order.orderType) === Product_category_ST.快递) {
          const _order0 = order as OrderInfo<Product_Express>;
          return <View className='dll ww  mb10 bccwhite ioo' key={order.id}>
            <ComCardOrderExpress className='mb10 ww' key={order.id} order={_order0} />
            <View className='dr dwp  ww prl10'>
              {orderType === Order_ST.待付款 &&
                <ComButton rr
                  className='cccplh bborder mb10 ml10'
                  onClick={() => deleteOrder(order)}>
                  删除
                </ComButton>
              }
              {_order0.orderStatus === Order_ST.待付款 && _order0.productList?.[0]?.weight && (
                <ComButton rr
                  className='bccyellow mb10 ml10'
                  onClick={async () => {
                    Taro.showLoading({ mask: true, title: "获取支付参数...", });
                    const res_pay = await Api_order_pay_ctn({ orderId: _order0.id!, });
                    Taro.showLoading({ mask: true, title: "支付...", });
                    await try_Taro_requestPayment({ ...res_pay, package: res_pay.packageStr });
                    Taro.showToast({ icon: "none", title: "支付成功", });
                    Taro.showLoading({ mask: true, title: "获取面单号...", });
                    const [res_waybill] = await Api_logistic_waybill_ctn({ orderId: _order0.id!, });
                    useSTExpress.getState().sett({
                      productList: [{
                        bigWord: res_waybill.bigWord,
                        packagePlace: res_waybill.packagePlace,
                        waybillId: res_waybill.waybillId
                      }]
                    });
                    try_Taro_hideLoading();
                    page_init();
                    if (_order0.printerId) {
                      Taro.showLoading({ mask: true, title: "打印中...", });
                      await Api_order_print_ctn({ orderId: _order0.id!, printerId: _order0.printerId!, });
                      Taro.showToast({ icon: "none", title: '打印任务提交成功', });
                    } else {
                      Taro.showToast({ icon: "none", title: '支付成功，订单移入已付款', });
                    }
                  }}>
                  <ComSquare className='icon-wxpay mr4' style={{ width: "calc(1.3 * var(--rem_base))" }} />
                  <Text className='nw'>支付</Text>
                </ComButton>
              )}
            </View>
          </View>;
        }
        if (Number(order.orderType) === Product_category_ST.干洗) {
          const _order1 = order as OrderInfo<any>;
          return <View className='dll ww  mb10 bccwhite ioo' key={order.id}>
            <ComCardOrderDryclean className='ww' key={_order1.id} order={_order1} />
            <View className='dr prl10 ww'>
              {_order1.orderStatus === Order_ST.待付款 &&
                <ComButton rr className='cccplh ml10 mb10 bborder' onClick={async () => {
                  const res_modal = await try_Taro_showModal({ title: "提示", content: "您确定要删除该订单吗?", confirmText: "删除" });
                  if (res_modal) {
                    Taro.showLoading({ mask: true, title: "删除中..." });
                    await Api_order_remove_ctn({ orderId: order.id!, });

                    page_list_update((p) => ({ ...p, list: p.list.filter(eee => eee.id !== order.id) }));
                    Taro.showToast({ icon: "none", title: "删除成功" });
                  } else {
                    throw new Error("取消");
                  }
                }}>删除</ComButton>
              }
              {!Boolean(_order1.productList?.length) && orderType === Order_ST.待付款 && <ComButton rr className='ml10 mb10 bborder cccgreen'>
                待上门</ComButton>}
              {Boolean(_order1.productList?.length) && orderType === Order_ST.待付款 && <ComButton rr className='ml10 mb10 slr  bccyellow'
                onClick={async () => {
                  Taro.showLoading({ mask: true, title: "获取支付参数...", });
                  const res_pay = await Api_order_pay_ctn({ orderId: _order1.id!, });
                  Taro.showLoading({ mask: true, title: "支付中...", });
                  await try_Taro_requestPayment({ ...res_pay, package: res_pay.packageStr });
                  try_Taro_hideLoading();
                }}>
                <ComSquare className='icon-wxpay mr4' style={{ width: "calc(1.3 * var(--rem_base))" }} />
                <Text className='nw'>支付</Text>
              </ComButton>}
            </View>


          </View>;
        }
        if (Number(order.orderType) === Product_category_ST.杂物) {
          const _order2 = order as OrderInfo<any>;
          return <View className='dll ww  mb10 bccwhite ioo' key={order.id}>
            {Boolean(_order2.productList?.length) && orderType === Order_ST.待付款 && <ComButton className=' mt10 slr mr10 bccyellow'
              onClick={async () => {
                Taro.showLoading({ mask: true, title: "获取支付参数...", });
                const res_pay = await Api_order_pay_ctn({ orderId: _order2.id!, });
                Taro.showLoading({ mask: true, title: "支付中...", });
                await try_Taro_requestPayment({ ...res_pay, package: res_pay.packageStr });
                try_Taro_hideLoading();
              }}>
              <ComSquare className='icon-wxpay mr4' style={{ width: "calc(1.3 * var(--rem_base))" }} />
              <Text className='nw'>支付</Text>
            </ComButton>}

            <ComCardOrderSundries className='ww'
              key={_order2.id}
              order={_order2}>
            </ComCardOrderSundries>
            {_order2.orderStatus === Order_ST.待付款 &&
              <View className='dy prl10'>
                <ComButton ll className='cccplh mb10 bborder' onClick={async () => {
                  const res_modal = await try_Taro_showModal({ title: "提示", content: "您确定要删除该订单吗?", confirmText: "删除" });
                  if (res_modal) {
                    Taro.showLoading({ mask: true, title: "删除中..." });
                    await Api_order_remove_ctn({ orderId: order.id!, });

                    page_list_update((p) => ({ ...p, list: p.list.filter(eee => eee.id !== order.id) }));
                    Taro.showToast({ icon: "none", title: "删除成功" });
                  } else {
                    throw new Error("取消");
                  }
                }}>删除</ComButton>
              </View>
            }

          </View>;
        }
        if (Number(order.orderType) === Product_category_ST.团购) {
          const _order2 = order as OrderInfo<any>;

          return <View className='dll ww  mb10 bccwhite ioo' key={order.id}>
            <ComCardOrderBringGoods className='ww mb10' key={_order2.id} order={_order2} />
            <View className='dr dwp prl10 ww'>
              {_order2.orderStatus === Order_ST.待付款 &&
                <ComButton rr className='cccplh mb10 bborder ml10' onClick={async () => {
                  const res_modal = await try_Taro_showModal({ title: "提示", content: "您确定要删除该订单吗?", confirmText: "删除" });
                  if (res_modal) {
                    Taro.showLoading({ mask: true, title: "删除中..." });
                    await Api_order_remove_ctn({ orderId: order.id!, });
                    page_list_update((p) => ({ ...p, list: p.list.filter(eee => eee.id !== order.id) }));
                    Taro.showToast({ icon: "none", title: "删除成功" });
                  } else {
                    throw new Error("取消");
                  }
                }}>删除</ComButton>
              }
              {order.deliveryStatus === Order_deliveryStatus_ST.待收货 &&
                <ComButton rr className='ml10 mb10 bccyellow' onClick={async () => {
                  Taro.showLoading({ mask: true, title: "确认中...", });
                  await try_Taro_openBusinessView(_order2.transactionId!);
                  Taro.showToast({ icon: "none", title: "确认收货成功" });
                  page_list_update((p) => ({ ...p, list: p.list.map(eee => eee.id === order.id ? { ...eee, deliveryStatus: Order_deliveryStatus_ST.已签收 } : eee) }));
                }}>确认收货</ComButton>
              }
              {Boolean(_order2.productList?.length) && orderType === Order_ST.待付款 &&
                <ComButton rr className='mb10  bccyellow ml10'
                  onClick={async () => {
                    Taro.showLoading({ mask: true, title: "获取支付参数...", });
                    const res_pay = await Api_order_pay_ctn({ orderId: _order2.id!, });
                    Taro.showLoading({ mask: true, title: "支付中...", });
                    await try_Taro_requestPayment({ ...res_pay, package: res_pay.packageStr });
                    try_Taro_hideLoading();
                  }}>
                  <ComSquare className='icon-wxpay mr4' style={{ width: "calc(1.3 * var(--rem_base))" }} />
                  <Text className='nw'>支付</Text>
                </ComButton>}
            </View>
            <View>{order.transactionId}</View>
          </View>;
        }
        return null;
      })}
      <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)}></ComLoading>

    </ComScrollView>
  </MMMAAPage>;
};




const useProductDryCleanEditor = () => {
  const { options } = useHook_getCurrentInstance<{ scene?: string; }>();
  const { O_D } = coo___urlToObj<{ O_D?: string; }>(options.scene);
  const [isShare, setIsShare] = useState<boolean | null>(null);
  const [order, setOrder] = useState<any | true | null>(null);
  const [isPay, setIsPay] = useState(false);
  useEffect(() => {
    (async () => {
      if (O_D) {
        try {
          const res_order = await Api_cart_share_ctn({ orderId: O_D! });
          setOrder(res_order.order);
          setIsShare(false);
          if (res_order.prePay) {
            try {
              await try_Taro_requestPayment({ ...res_order.prePay, package: res_order.prePay.packageStr });
              Taro.showToast({ icon: "none", title: "支付成功" });
              setIsPay(true);
            } finally {
              setIsShare(true);
            }
          } else {
            setIsPay(true);
            setIsShare(true);
            Taro.showToast({ icon: "none", title: "该订单已经支付过了", duration: 6000 });
          }
        } finally {
          setIsPay(true);
          setIsShare(true);
        }
      } else {
        setIsShare(true);
      }
    })();
  }, [O_D]);
  return [order, isShare, isPay];
};