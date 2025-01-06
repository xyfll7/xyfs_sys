// :: pages_agent/agent__express_search
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Api_order_aggregateQuery_ctn, Api_order_incrPrintTimes_ctn } from '@xyfs/taro_uii/api/api__orders';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComCardOrderDryclean, ComCardOrderExpress } from '@xyfs/taro_uii/components/ComCardOrder';
import { ComInput } from "@xyfs/taro_uii/components/ComInput";
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComPaySuccessCard } from '@xyfs/taro_uii/components/ComPaySuccessCard';
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { Product_category_ST } from "@xyfs/taro_uii/src/config";
import { roo___role_getRoleInfo } from "@xyfs/taro_uii/src/roles";
import { useSTSelf } from "@xyfs/taro_uii/store/store";
import { Pagination } from "@xyfs/taro_uii/type_index";
import { OrderInfo, Product_Dryclean, Product_Express } from "@xyfs/taro_uii/type_product";
import { on_get_printer_str_order_express, on_start_print } from "@xyfs/taro_uii/utils/bluetooth/useHooks_Blue";
import { try_Taro_navigateTo } from "@xyfs/taro_uii/utils/try_catch";
import { useHook_pageListNew, useHook_Reducer } from '@xyfs/taro_uii/utils/useHooks';
import { coo___isNumber, coo___objToUrl } from "@xyfs/utils/util";
import { FC, useCallback } from "react";

definePageConfig({ navigationStyle: "custom", enableShareAppMessage: true, disableScroll: true, });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC = () => {
  const [form, setForm] = useHook_Reducer({
    orderType: 0 as 0 | 1 | 2 | 3,
    barCode: "",
    phoneNumber: "",
    waybillId: "",
  });
  const [searchValue, setSearchValue] = useHook_Reducer<{
    orderType: 0 | 1 | 2 | 3;
    barCode: string;
    phoneNumber: string;
    waybillId: string;
  } | null>(null);
  const ___page_getter = useCallback(async (p: Pagination<unknown>) =>
    await Api_order_aggregateQuery_ctn({
      ...p,
      roleId: roo___role_getRoleInfo(useSTSelf.getState().selfInfo!, "代理")?.id,
      ...searchValue!,
    }), [searchValue]);
  const { page, page_loading, loadTimes, page_list_get, page_list_update, page_init } = useHook_pageListNew(___page_getter, { isLoadFirstRun: false });
  return <MMMAAPage>
    <ComNav>
      <View className='ww prl10'>
        <ComNavBarA className='mb10 '>
          <ComButton ll className='bcctrans cccplh ml10' >订单综合查询</ComButton>
        </ComNavBarA>
        <ComButton className='flx1 bccbacktab mb10' hoverClass='none'>
          <ComInput className='' value={form.waybillId} placeholder='快递单号' disabled={page_loading} onInput={(e) => { setForm({ waybillId: e.detail.value }); }} />
        </ComButton>
        <ComButton className='flx1 bccbacktab mb10' hoverClass='none'>
          <ComInput className='' value={form.barCode} placeholder='干洗条码' disabled={page_loading} onInput={(e) => { setForm({ barCode: e.detail.value }); }} />
        </ComButton>
        <View className='dy'>
          <ComButton className='flx1 bccbacktab mb10' hoverClass='none'>
            <ComInput placeholder='手机号' value={form.phoneNumber} disabled={page_loading} onInput={(e) => { setForm({ phoneNumber: e.detail.value }); }} />
          </ComButton>
        </View>
        <View className='dr mb10'>
          <ComButton className='ml10 nw' onClick={() => { setForm(null); setSearchValue(null); page_init(true); }}>清空</ComButton>
          <ComButton className={`ml10 nw prl30 ${form.orderType == 1 ? "bccgreen cccwhite" : "cccgreen"}`} onClick={() => {
            setForm({ orderType: 1 });
            page_init();
            setSearchValue({ ...form, orderType: 1 });
          }}>搜快递</ComButton>
          <ComButton className={`ml10 nw prl30 ${form.orderType == 2 ? "bccgreen cccwhite" : "cccgreen"}`} onClick={() => {
            setForm({ orderType: 2 });
            page_init();
            setSearchValue({ ...form, orderType: 2 });
          }}>搜干洗</ComButton>
        </View>
      </View>
    </ComNav>
    <ComScrollView onScrollToLower={async () => { page_list_get(page); }}>
      {page.list?.map((e) => {
        switch (e.orderType) {
          case Product_category_ST.快递:
            const order0 = e as OrderInfo<Product_Express>;
            return <View className='bccwhite IOO mb10 ww' key={e.id}>
              <ComCardOrderExpress className='mb10' order={order0} showUser='regiment' />
              {order0.productList?.[0]?.waybillId &&
                <View className='dr dwp  ww prl10'>
                  <ComButton rr className='cccgreen mb10 bborder'
                    onClick={async () => {
                      await on_start_print((blue_device) => {
                        return { cpcl: order0.productList!.map(eee => on_get_printer_str_order_express({ ...order0, __product: eee, }, "cpcl", blue_device)) };
                      }, { orderId: order0.id!, selfInfo_S: useSTSelf.getState().selfInfo });
                      page_list_update((p) => ({ ...p, list: p.list!.map(item => item.id === order0.id ? { ...order0, printTimes: coo___isNumber(order0.printTimes) ? order0.printTimes! + 1 : 1 } : item) }));
                      Taro.showLoading({ mask: true, title: "更新打印次数..." });
                      await Api_order_incrPrintTimes_ctn({ orderId: order0.id!, }); // 增加打印次数
                      Taro.showToast({ icon: "none", title: "打印完成", });
                    }}>
                    打印{order0.printTimes ? order0.printTimes : "0"}次
                  </ComButton>
                </View>
              }
            </View>;
          case Product_category_ST.干洗:
            const order1 = e as OrderInfo<Product_Dryclean>;
            return <View className='bccwhite IOO mb10 ww' key={e.id}>
              <ComCardOrderDryclean className='mb10' order={order1} showUser='regiment' />
              <View className='dr dwp prl10 ww'>
                {Boolean(order1.productList?.length) && order1.orderStatus !== 1 && <ComButton rr className='slr cccgreen bborder mb10 ml10' onClick={async () => {
                  await try_Taro_navigateTo({ url: `/pages_comm/comm__express_path?${coo___objToUrl({ express_share_id: order1.id })}` });
                }}>轨迹</ComButton>}
              </View>
            </View>;
          default:
            return null;
        }
      })}
      {loadTimes.current !== 0 &&
        <ComLoading className='mb10' isLastPage={page.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)} />
      }

    </ComScrollView>
    <ComPaySuccessCard></ComPaySuccessCard>
  </MMMAAPage >;
};



