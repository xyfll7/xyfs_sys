// :: pages_comm/icomm_orders_groupbuying
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { OrderInfo, Pagination, Product_Dryclean } from "@xyfs/taro_uii";
import { Api_order_cancel_ctn, Api_order_list_ctn, Api_order_remove_ctn } from '@xyfs/taro_uii/api/api__orders';
import { ComButton } from "@xyfs/taro_uii/components/ComButton";
import { ComCardOrderBringGoods } from '@xyfs/taro_uii/components/ComCardOrder';
import { ComListTypeSelectorNew } from "@xyfs/taro_uii/components/ComListTypeSelectorNew";
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSearcher } from '@xyfs/taro_uii/components/ComSearcher';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { Order_ST, Product_category_ST } from "@xyfs/taro_uii/src/config";
import { roo___has_role, roo___role_getRoleInfo } from "@xyfs/taro_uii/src/roles";
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { on_get_cpcl_str_order_bing_goods, on_start_print } from "@xyfs/taro_uii/utils/bluetooth/useHooks_Blue";
import { Taro_getCurrentInstance, try_Taro_showModal } from '@xyfs/taro_uii/utils/try_catch';
import { useHook_pageListNew, useHook_Reducer } from '@xyfs/taro_uii/utils/useHooks';
import { FC, useCallback, useState } from "react";

definePageConfig({ navigationStyle: "custom", enableShareAppMessage: true, disableScroll: true, });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC<{}> = ({ }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const { options } = Taro_getCurrentInstance<{ order_ST?: Order_ST; }>();

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
      <ComNavBarA className='mb10 '>
        <ComButton ll className='bcctrans cccplh ' >
          {roo___has_role(selfInfo_S, ['SUPPLIER']) && '团购订单/供应商'}
          {roo___has_role(selfInfo_S, ['REGIMENT']) && '团购订单/团长'}
        </ComButton>
      </ComNavBarA>
      <ComListTypeSelectorNew className='' disabled={page_loading} enumData={Order_ST} typeList={[Order_ST.已付款, Order_ST.已退款]} tabType={orderType} setTab={(e) => { page_init(); setOrderType(e); }}></ComListTypeSelectorNew>
      <ComSearcher className='mb10' onSetSearchValue={(e) => { page_init(); setSearchValue(e); }} ></ComSearcher>
    </ComNav>
    <ComScrollView>
      {page.list?.map((order) => {
        if (order.orderType === Product_category_ST.团购) {
          const _order1 = order as OrderInfo<Product_Dryclean>;
          return <View className='dll ww mb10 bccwhite ioo' key={order.id}>
            <ComCardOrderBringGoods className='ww mb10' key={_order1.id} order={_order1} />
            <View className='dr prl10 ww dwp'>
              {_order1.orderStatus === 1 &&
                <ComButton rr className='cccplh mb10 bborder nw' onClick={async () => {
                  const res_modal = await try_Taro_showModal({ title: "提示", content: "您确定要删除该订单吗?", confirmText: "删除" });
                  if (res_modal) {
                    Taro.showLoading({ mask: true, title: "删除中..." });
                    await Api_order_remove_ctn({ orderId: order.id!, });
                    page_list_update(p => ({ ...p, list: p.list.filter(ee => ee.id !== order.id) }));
                    Taro.showToast({ icon: "none", title: "删除成功" });
                  } else {
                    throw new Error("取消");
                  }
                }}>删除</ComButton>
              }
              {_order1.orderStatus === 2 && <ComButton rr className='cccplh bborder mb10 nw' onClick={async () => {
                if (await try_Taro_showModal({ content: "您确定要退款?", confirmText: "确认退款", })) {
                  Taro.showLoading({ mask: true, title: "退款中...", });
                  await Api_order_cancel_ctn({ orderId: order.id!, });
                  page_list_update(p => ({ ...p, list: p.list.filter(ee => ee.id !== order.id) }));
                  Taro.hideLoading();
                  try_Taro_showModal({ title: "退款操作成功", content: `订单移入"已退款"`, showCancel: false, });
                } else {
                  throw new Error("取消");
                }
              }}>退款</ComButton>
              }
              {_order1.orderStatus === 2 && <ComButton rr className='cccgreen ml10 bborder mb10 nw' onClick={async () => {
                await on_start_print((blue_device) => {
                  return _order1.productList!.map((eee, index) => on_get_cpcl_str_order_bing_goods({ ..._order1, productList: [eee], __index: index, }, blue_device));
                }, { orderId: _order1.id, selfInfo_S });
              }}>打印</ComButton>
              }
            </View>
          </View>;
        } else {
          return null;
        }
      })}
      <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)} />
    </ComScrollView>
  </MMMAAPage >;
};










