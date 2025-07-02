// :: pages_comm/icomm_orders_dryclean
import { Text, View, ViewProps } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { OrderInfo, Pagination, Product_Dryclean } from "@xyfs/taro_uii";
import { Api_order_cancel_ctn, Api_order_list_ctn, Api_order_orderProductCode_ctn, Api_order_pay_ctn, Api_order_receiveNotify_ctn, Api_order_shipments_ctn } from '@xyfs/taro_uii/api/api__orders';
import { dryclean_sharer } from "@xyfs/taro_uii/compages/CPDryclean";
import { ComButton, MyButtonProps } from "@xyfs/taro_uii/components/ComButton";
import { ComCardOrderDryclean } from "@xyfs/taro_uii/components/ComCardOrder";
import { ComListTypeSelectorNew } from "@xyfs/taro_uii/components/ComListTypeSelectorNew";
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComNavBarB } from "@xyfs/taro_uii/components/ComNavBarB";
import { ComPopupNew } from "@xyfs/taro_uii/components/ComPopupNew";
import { ComQRCodeNew } from "@xyfs/taro_uii/components/ComQRCode";
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSearcher } from '@xyfs/taro_uii/components/ComSearcher';
import { ComSquare } from "@xyfs/taro_uii/components/ComSquare";
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { MMMShare } from "@xyfs/taro_uii/components/MMMShare";
import { Order_ST, Product_category_ST } from "@xyfs/taro_uii/src/config";
import { getMyEnv } from "@xyfs/taro_uii/src/env";
import { roo___has_role } from "@xyfs/taro_uii/src/roles";
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { try_Taro_hideLoading, try_Taro_navigateTo, try_Taro_requestPayment, try_Taro_scanCode, try_Taro_setClipboardData, try_Taro_showModal } from '@xyfs/taro_uii/utils/try_catch';
import { useHook_getCurrentInstance, useHook_pageListNew, useHook_Reducer } from '@xyfs/taro_uii/utils/useHooks';
import { utils_get_qrcode, utils_show_button } from "@xyfs/taro_uii/utils/util";
import { coo___objToUrl } from "@xyfs/utils/util";

import { FC, useCallback, useEffect, useState } from "react";

definePageConfig({ navigationStyle: "custom", enableShareAppMessage: true, disableScroll: true, });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC<{}> = ({ }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const { options } = useHook_getCurrentInstance<{ order_ST?: Order_ST; }>();

  const [orderType, setOrderType] = useState<Order_ST>(options?.order_ST ?? Order_ST.待付款);
  const [searchValue, setSearchValue] = useHook_Reducer("");
  const [showQR, setShowQR] = useState("");

  const ___page_getter = useCallback(async (p: Pagination<unknown>) =>
    await Api_order_list_ctn({
      ...p,
      orderType: 2,
      orderStatus: orderType,
      keyword: searchValue,
    }), [orderType, searchValue]);
  const { page, page_loading, page_list_get, page_list_update, page_init } = useHook_pageListNew(___page_getter);
  const hasRole = roo___has_role(selfInfo_S, ["REGIMENT"]);

  useDidShow(() => {
    if (!page_loading && orderType === Order_ST.待付款) {
      page_init();
    }
  });
  return <MMMAAPage>
    <ComNav>
      <View className='ww prl10'>
        <ComNavBarA className='mb10 '>
          <ComButton ll className='bcctrans cccplh ml10' >
            {roo___has_role(selfInfo_S, ['SUPPLIER']) && '干洗订单/供应商'}
            {roo___has_role(selfInfo_S, ['REGIMENT']) && '干洗订单/团长'}
            {roo___has_role(selfInfo_S, ['DRIVER']) && '干洗订单/已上传/司机'}
          </ComButton>
        </ComNavBarA>
        <View className='ds'>
          <ComListTypeSelectorNew disabled={page_loading} enumData={Order_ST} typeList={[Order_ST.待付款, Order_ST.已付款, Order_ST.已退款]} tabType={orderType} setTab={(e) => { page_init(); setOrderType(e); }}></ComListTypeSelectorNew>
          {roo___has_role(selfInfo_S, ['DRIVER']) && <IIIButtonReport className='slr mr10 mb10 cccgreen' />}
        </View>
        <ComSearcher className='mb10' isShowSearcher onSetSearchValue={(e) => { page_init(); setSearchValue(e); }} ></ComSearcher>
      </View>
    </ComNav>
    <ComScrollView onScrollToLower={async () => { page_list_get(page); }}
      onRefresherRefresh={async () => { await page_init(); }} >
      {page.list?.map((order) => {
        if (order.orderType === Product_category_ST.干洗) {
          const _order1 = order as OrderInfo<Product_Dryclean>;
          return <View className='dll ww mb10 bccwhite ioo' key={order.id}>
            <ComCardOrderDryclean className='ww' key={_order1.id} order={_order1}
              onBindCode={utils_show_button(roo___has_role(selfInfo_S, ["REGIMENT"]), async (e) => {
                Taro.showLoading({ mask: true, title: "扫码中...", });
                const res_code = getMyEnv().platform === "devtools" ? "1000003" : await try_Taro_scanCode<string>({ type: "CODABAR", scanType: ["barCode"] });
                Taro.showLoading({ mask: true, title: "绑定中...", });
                const res = await Api_order_orderProductCode_ctn({
                  code: res_code,
                  orderId: order.id!,
                  orderProductId: e.id!,
                });
                page_list_update(p => ({ ...p, list: p.list.map(item => item.id === res.id ? res : item) }));
                Taro.showToast({ icon: "none", title: "绑定成功", });
              })} />

            <View className='dr dwp prl10 ww'>
              {getMyEnv().envVersion === "develop" &&
                <ComButton rr className="mb10 bccprice ml10 cccwhite" onClick={async () => {
                  Taro.showLoading({ mask: true, title: "提醒中..." });
                  const res = await Api_order_receiveNotify_ctn({ orderId: order.id! });
                  try_Taro_hideLoading();
                  Taro.showToast({ icon: "none", title: "已提醒" });
                }}>提醒收货</ComButton>
              }
              {getMyEnv().envVersion === "develop" && order.orderStatus === Order_ST.已付款 &&
                <ComButton rr className="mb10 bccprice ml10 cccwhite" onClick={async () => {
                  Taro.showLoading({ mask: true, title: "发货中..." });
                  const res = await Api_order_shipments_ctn({ orderId: order.id! });
                  try_Taro_hideLoading();
                  Taro.showToast({ icon: "none", title: "发货成功" });
                }}>确认发货</ComButton>
              }

              {hasRole && _order1.orderStatus === Order_ST.已付款 && order.latestEventType! < 2 && <ComButton rr className='cccplh mb10 bborder ml10' onClick={async () => {
                if (await try_Taro_showModal({ title: "提示", content: "您确定要退款吗？", confirmText: "确认退款" })) {
                  Taro.showLoading({ mask: true, title: "退款中...", });
                  await Api_order_cancel_ctn({ orderId: order.id!, });
                  page_list_update((p) => ({ ...p, list: p.list.filter(eee => eee.id !== _order1.id) }));
                  try_Taro_hideLoading();
                  Taro.showToast({ icon: 'none', title: "订单移入已退款" });
                } else {
                  throw new Error("取消");
                }
              }}>退款</ComButton>}
              {Boolean(order.productList?.length) && _order1.orderStatus !== Order_ST.待付款 && <ComButton rr className='slr cccgreen bborder mb10 ml10' onClick={async () => {
                await try_Taro_navigateTo({ url: `/pages_comm/comm__express_path?${coo___objToUrl({ express_share_id: order.id })}` });
              }}>轨迹</ComButton>}
              {hasRole && Boolean(order.productList?.length) && order.orderStatus === Order_ST.已付款 && <MMMShare rr orderType='干洗' className='bborder mb10 ml10' id={order.id!} name={order.deptName!} ></MMMShare>}
              {hasRole && _order1.orderStatus === Order_ST.待付款 && <ComButton rr className='cccplh mb10 bborder ml10' onClick={async () => {
                const res_modal = await try_Taro_showModal({ title: "提示", content: "您确定要删除该订单吗?", confirmText: "删除" });
                if (res_modal) {
                  Taro.showLoading({ mask: true, title: "删除中..." });
                  await Api_order_cancel_ctn({ orderId: order.id!, });
                  page_list_update(p => ({ ...p, list: p.list.filter(ee => ee.id !== order.id) }));
                  Taro.showToast({ icon: "none", title: "删除成功" });
                } else {
                  throw new Error("取消");
                }
              }}>删除</ComButton>}
              {hasRole && Boolean(_order1.productList?.length) && _order1.orderStatus === Order_ST.待付款 &&
                <ComButton rr className='mb10 ml10 bborder' onClick={async () => {
                  Taro.showLoading({ mask: true, title: "分享中..." });
                  await dryclean_sharer(_order1.orderCode!);
                  Taro.showToast({ icon: "none", title: "分享中完成" });
                }}>
                  <Text className='cccgreen'>⤻</Text>卡片
                </ComButton>
              }

              {hasRole && _order1.orderStatus === Order_ST.待付款 &&
                <ComButton rr className='mb10 bborder ml10' onClick={async () => {
                  await try_Taro_navigateTo({ url: `/pages_comm/comm__product_dryclean?order_info=${encodeURIComponent(JSON.stringify(_order1))}` });
                }}><Text className='cccgreen'>修改</Text></ComButton>
              }

              {hasRole && Boolean(_order1.productList?.length) && _order1.orderStatus === Order_ST.待付款 &&
                <ComButton rr className='ml10 mb10 bborder'
                  onClick={async () => {
                    Taro.showLoading({ mask: true, title: "生成中..." });
                    const _src = await utils_get_qrcode({ appid: process.env.TARO_APP_CLIENT, page: "pages_user/user_orders", scene: coo___objToUrl({ R_D: Number(useSTSelf.getState().selfInfo!.mobile).toString(36), O_D: String(_order1.orderCode!), }) });
                    setShowQR(_src);
                    try_Taro_hideLoading();
                  }}>
                  <Text className='cccgreen'>⤻</Text>付款码
                </ComButton>
              }
              {hasRole && Boolean(_order1.productList?.length) && _order1.orderStatus === Order_ST.待付款 &&
                <ComButton rr className='ml10 mb10 cccgreen bccyellow' onClick={async () => {
                  Taro.showLoading({ mask: true, title: '支付...' });
                  const res_pay = await Api_order_pay_ctn({ orderId: String(_order1.id) });
                  try {
                    await try_Taro_requestPayment({ ...res_pay, package: res_pay.packageStr });
                    page_list_update(p => ({ ...p, list: p.list.filter(ee => ee.id !== order.id) }));
                    if (!await try_Taro_showModal({
                      title: "支付成功",
                      content: `订单移到"已支付"列表`,
                      confirmText: "知道了",
                      cancelText: "查看订单"
                    })) {
                      page_init();
                      setOrderType(Order_ST.已付款);
                    }
                  } catch (err) {
                    console.error("取消支付——————", err);
                    throw new Error("取消支付");
                  } finally {
                    try_Taro_hideLoading();
                  }
                }}>
                  <ComSquare style={{ width: "calc(1.3 * var(--rem_base))" }} className='icon-wxpay mr4' />付
                </ComButton>
              }


            </View>
            {getMyEnv().envVersion === "develop" &&
              <ComButton className="mb10" onClick={async () => { await try_Taro_setClipboardData({ data: order.transactionId! }); }}>{order.transactionId}</ComButton>
            }
          </View>;
        } else {
          return null;
        }
      })}
      <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)} />
    </ComScrollView>
    <View>
      {Boolean(showQR) && <ComPopupNew className=' ww' >
        <ComQRCodeNew src={showQR} title='干洗下单快捷小程序码' desc={["干洗下单快捷小程序码"]}></ComQRCodeNew>
      </ComPopupNew>}
    </View>
  </MMMAAPage >;
};


const IIIButtonReport: FC<MyButtonProps & ViewProps> = ({ ...props }) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!show) { return; }
    (async () => {
      // const res = await Api_logistic_count_ctn();
    })();
  }, [show]);

  return <>
    <ComButton onClick={() => setShow(e => !e)} {...props}>报表</ComButton>
    {show && <ComPopupNew>
      <View className='dll prl10 ' style={{ height: "80vh" }} >
        <ComNavBarB className=' mb10' onClose={() => setShow(e => !e)}><ComButton className='fwb bccback'>揽货报表</ComButton></ComNavBarB>
        <ComScrollView>
          {new Array(100).fill("xx").map((e, i) => {
            return <View key={i}>
              <ComButton className='mb10' onClick={() => { setData(e); }}>{e}</ComButton>
            </View>;
          })
          }
        </ComScrollView>
        {data && <ComPopupNew>
          <IIIButtonReportItemDetail onClose={() => setData(null)} />
        </ComPopupNew>}
      </View>
    </ComPopupNew>}
  </>;
};


const IIIButtonReportItemDetail: FC<MyButtonProps & ViewProps & { onClose: () => void; }> = ({ onClose }) => {
  return <MMMAAPage >
    <ComNavBarB className='prl10 mb10' onClose={onClose}><ComButton className='fwb bccback'>揽货报表</ComButton></ComNavBarB>
    <ComScrollView>
      {new Array(100).fill("xx").map((e, i) => {
        return <View key={i}>
          <ComButton className='mb10'>{e}</ComButton>
        </View>;
      })
      }
    </ComScrollView>
  </MMMAAPage>;
}









