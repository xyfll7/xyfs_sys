// :: pages_agent/agent__express_search
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Api_order_aggregateQuery_ctn, Api_order_incrPrintTimes_ctn } from '@xyfs/taro_uii/api/api__orders';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComCardOrderExpress } from '@xyfs/taro_uii/components/ComCardOrder';
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
import { OrderInfo, Product_Express } from "@xyfs/taro_uii/type_product";
import { on_get_printer_str_order_express, on_start_print } from "@xyfs/taro_uii/utils/bluetooth/useHooks_Blue";
import { useHook_pageListNew, useHook_Reducer } from '@xyfs/taro_uii/utils/useHooks';
import { coo___isNumber } from "@xyfs/utils/util";
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
          <ComButton className='ml10 nw' onClick={() => { setForm(null); setSearchValue(null); }}>清空</ComButton>
          <ComButton className='ml10 nw prl30 bccgreen cccwhite' onClick={() => {
            setForm({ orderType: 1 });
            page_init();
            setSearchValue({ ...form, orderType: 1 });
          }}>搜快递</ComButton>
          <ComButton className='ml10 nw prl30 bccgreen cccwhite' onClick={() => {
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
            const ee = e as OrderInfo<Product_Express>;
            return <View className='bccwhite IOO mb10 ww' key={e.id}>
              <ComCardOrderExpress className='mb10' order={ee} showUser='regiment' />
              {ee.productList?.[0]?.waybillId &&
                <View className='dr dwp  ww prl10'>
                  <ComButton rr className='cccgreen mb10 bborder'
                    onClick={async () => {
                      const _order = ee;
                      await on_start_print((blue_device) => {
                        return { cpcl: _order.productList!.map(eee => on_get_printer_str_order_express({ ..._order, __product: eee, }, "cpcl", blue_device)) };
                      }, { orderId: _order.id!, selfInfo_S: useSTSelf.getState().selfInfo });
                      page_list_update((p) => ({ ...p, list: p.list!.map(item => item.id === ee.id ? { ...ee, printTimes: coo___isNumber(ee.printTimes) ? ee.printTimes! + 1 : 1 } : item) }));
                      Taro.showLoading({ mask: true, title: "更新打印次数..." });
                      await Api_order_incrPrintTimes_ctn({ orderId: _order.id!, }); // 增加打印次数
                      Taro.showToast({ icon: "none", title: "打印完成", });
                    }}>
                    打印{ee.printTimes ? ee.printTimes : "0"}次
                  </ComButton>
                </View>
              }
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



