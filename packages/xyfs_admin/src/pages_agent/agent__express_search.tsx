// :: pages_agent/agent__express_search
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Api_order_aggregateQuery_ctn, Api_order_incrPrintTimes_ctn } from '@xyfs/taro_uii/api/api__orders';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComCardOrderBringGoods, ComCardOrderDryclean, ComCardOrderExpress } from '@xyfs/taro_uii/components/ComCardOrder';
import { ComInput } from "@xyfs/taro_uii/components/ComInput";
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComPaySuccessCard } from '@xyfs/taro_uii/components/ComPaySuccessCard';
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { Order_ST, Product_category_ST } from "@xyfs/taro_uii/src/config";
import { getMyEnv } from "@xyfs/taro_uii/src/env";
import { roo___role_getRoleInfo } from "@xyfs/taro_uii/src/roles";
import { useSTSelf } from "@xyfs/taro_uii/store/store";
import { Pagination } from "@xyfs/taro_uii/type_index";
import { OrderInfo, Product_Dryclean, Product_Express } from "@xyfs/taro_uii/type_product";
import { on_get_printer_str_order_express, on_start_print } from "@xyfs/taro_uii/utils/bluetooth/useHooks_Blue";
import { try_Taro_navigateTo } from "@xyfs/taro_uii/utils/try_catch";
import { useHook_pageListNew, useHook_Reducer } from '@xyfs/taro_uii/utils/useHooks';
import { coo___isNumber, coo___objToUrl } from "@xyfs/utils/util";
import { FC, useCallback } from "react";



const arr = [
  "JT0014825160061",
  "JT0014826785051",
  "JT0014829970992",
  "JT0014827982757",
  "JT0014829909518",
  "JT0014833080819",
  "JT0014831895773",
  "JT3104578014395",
  "JT0014837229340",
  "JT0014840531346",
  "JT0014837762141",
  "JT0014821723480",
  "JT0014846043051",
  "JT0014840260182",
  "JT0014846943085",
  "JT5340892147838",
  "JT0014840612853",
  "JT0014845702323",
  "JT0014840418693",
  "JT0014848684658",
  "JT0014850797388",
  "JT0014846420342",
  "JT0014844826414",
  "JT0014849935315",
  "JT0014853601536",
  "JT0014853626533",
  "JT0014854759810",
  "JT0014856081813",
  "JT5340242637733",
  "JT5340270975792",
  "JT0014857744297",
  "JT0014855172198",
  "JT0014859031407",
  "JT0014860650243",
  "JT0014858990649",
  "JT0014860572755",
  "JT0014860845589",
  "JT0014862282032",
  "JT0014849372196",
  "JT0014864769533",
  "JT0014866095176",
  "JT0014866110083",
  "JT0014868188498",
  "JT0014853052558",
  "JT0014868690569",
  "JT0014856021589",
  "JT0014871690336",
  "JT3104891046353",
  "JT0014874785789",
  "JT0014872494451",
  "JT5341448192900",
  "JT0014876458203",
  "JT0014879399129",
  "JT0014876617364",
  "JT0014879875471",
  "JT0014878679646",
  "JT0014881958058",
  "JT0014882963559",
  "JT0014882146996",
  "JT0014876194193",
  "JT0014884086752",
  "JT0014868399424",
  "JT3104993910339",
  "JT3104993038767",
  "JT3104993380871",
  "JT0014881508179",
  "JT0014878804770",
  "JT0014882378245",
  "JT0014886145381",
  "JT0014887877179",
  "JT0014883528021",
  "JT0014879815147",
  "JT0014886539354",
  "JT0014887460263",
  "JT0014889079231",
  "JT5341085454670",
  "JT0014888288586",
  "JT0014886766958",
  "JT3105012394417",
  "JT0014889304719",
  "JT0014886797422",
  "JT0014888133726",
];

definePageConfig({ navigationStyle: "custom", enableShareAppMessage: true, disableScroll: true, });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC = () => {
  const [form, setForm] = useHook_Reducer({
    orderType: 0 as 0 | 1 | 2 | 3 | 4,
    barCode: "",
    outTradeNo: "",
    phoneNumber: "",
    waybillId: "",
  });
  const [searchValue, setSearchValue] = useHook_Reducer<{
    orderType: 0 | 1 | 2 | 3 | 4;
    barCode: string;
    outTradeNo: string;
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
        <ComNavBarA className='mb10'>
          <ComButton ll className='bcctrans cccplh ml10' >订单综合查询</ComButton>
        </ComNavBarA>
        <ComButton className='flx1 bccbackdeep mb10' hoverClass='none'>
          <ComInput className='' value={form.outTradeNo} placeholder='订单单号' disabled={page_loading} onInput={(e) => { setForm({ orderType: 0, outTradeNo: e.detail.value }); }} />
        </ComButton>
        <ComButton className='flx1 bccbackdeep mb10' hoverClass='none'>
          <ComInput className='' value={form.waybillId} placeholder='快递单号' disabled={page_loading} onInput={(e) => { setForm({ orderType: 0, waybillId: e.detail.value }); }} />
        </ComButton>
        <ComButton className='flx1 bccbackdeep mb10' hoverClass='none'>
          <ComInput className='' value={form.barCode} placeholder='干洗条码' disabled={page_loading} onInput={(e) => { setForm({ orderType: 0, barCode: e.detail.value }); }} />
        </ComButton>
        <View className='dy'>
          <ComButton className='flx1 bccbackdeep mb10' hoverClass='none'>
            <ComInput placeholder='手机号' value={form.phoneNumber} disabled={page_loading} onInput={(e) => { setForm({ orderType: 0, phoneNumber: e.detail.value }); }} />
          </ComButton>
        </View>
        <View className='dr mb10'>
          <ComButton ll className='ml10 nw' onClick={() => { setForm(null); setSearchValue(null); page_init({ isStop: true }); }}>清空</ComButton>
          <ComButton ll className={`ml10 nw  ${form.orderType == 1 ? "bccgreen cccwhite" : "cccgreen"}`} onClick={() => {
            if (page_loading) { throw new Error("正在加载中，请稍后再试"); }
            setForm({ orderType: 1 });
            page_init();
            setSearchValue({ ...form, orderType: 1 });
          }}>搜快递</ComButton>
          <ComButton ll className={`ml10 nw  ${form.orderType == 2 ? "bccgreen cccwhite" : "cccgreen"}`} onClick={() => {
            if (page_loading) { throw new Error("正在加载中，请稍后再试"); }
            setForm({ orderType: 2 });
            page_init();
            setSearchValue({ ...form, orderType: 2 });
          }}>搜干洗</ComButton>
          <ComButton ll className={`ml10 nw  ${form.orderType == 3 ? "bccgreen cccwhite" : "cccgreen"}`} onClick={() => {
            if (page_loading) { throw new Error("正在加载中，请稍后再试"); }
            setForm({ orderType: 4 });
            page_init();
            setSearchValue({ ...form, orderType: 4 });
          }}>搜团购</ComButton>
        </View>
        {getMyEnv().platform === "devtools" &&
          <View className='dr'>
            <ComButton className=' mb10' onClick={async () => {
              const arrr: any[] = [];
              for (let i = 0; i < arr.length; i++) {
                const res = await Api_order_aggregateQuery_ctn({
                  barCode: "",
                  orderType: 1,
                  pageNum: 1,
                  pageSize: 5,
                  phoneNumber: "",
                  roleId: 1,
                  waybillId: arr[i]!,
                });
                arrr.push(res);
              }
              console.log(JSON.stringify(arrr));
            }} >
              批量查询
            </ComButton>
          </View>
        }

      </View>
    </ComNav>
    <ComScrollView onScrollToLower={async () => { page_list_get(page); }}>
      {page.list?.map((e) => {
        switch (e.orderType) {
          case Product_category_ST.快递:
            const order0 = e as OrderInfo<Product_Express>;
            return <View className='bccwhite IOO mb10 ww' key={e.id}>
              <ComCardOrderExpress className='mb10' order={order0} />
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
              <ComCardOrderDryclean className='mb10' order={order1} />
              <View className='dr dwp prl10 ww'>
                {Boolean(order1.productList?.length) && order1.orderStatus !== Order_ST.待付款 && <ComButton rr className='slr cccgreen bborder mb10 ml10' onClick={async () => {
                  await try_Taro_navigateTo({ url: `/pages_comm/comm__express_path?${coo___objToUrl({ express_share_id: order1.id })}` });
                }}>轨迹</ComButton>}
              </View>
            </View>;
          case Product_category_ST.团购:
            const _order2 = e as OrderInfo<any>;

            return <View className='dll ww  mb10 bccwhite ioo' key={e.id}>
              <ComCardOrderBringGoods className='ww mb10' key={_order2.id} order={_order2} />

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



