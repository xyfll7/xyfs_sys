// :: pages_comm/icomm_scaner
import { Camera, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { OrderInfo, Pagination, Product_Dryclean } from '@xyfs/taro_uii';
import { Api_logistic_add_ctn, Api_logistic_confirm_ctn, Api_logistic_list_ctn, Api_logistic_refund_ctn, Api_logistic_remove_ctn } from '@xyfs/taro_uii/api/api__logistics';
import { Api_order_incrPrintTimes_ctn } from '@xyfs/taro_uii/api/api__orders';
import { ComAuth } from '@xyfs/taro_uii/components/ComAuth';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComCardOrderDryclean } from '@xyfs/taro_uii/components/ComCardOrder';
import { ComListTypeSelectorNew } from '@xyfs/taro_uii/components/ComListTypeSelectorNew';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComNavBarB } from '@xyfs/taro_uii/components/ComNavBarB';
import { ComPopupNew } from '@xyfs/taro_uii/components/ComPopupNew';
import { ComScrollView } from '@xyfs/taro_uii/components/ComScrollView';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { Order_ST, ROLE_KEY } from '@xyfs/taro_uii/src/config';
import { getMyEnv } from '@xyfs/taro_uii/src/env';
import { roo___has_role } from '@xyfs/taro_uii/src/roles';
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { on_get_cpcl_str_order_dryclean_out_factory, on_start_print } from '@xyfs/taro_uii/utils/bluetooth/useHooks_Blue';
import { Taro_getCurrentInstance, try_Taro_navigateTo, try_Taro_showModal } from '@xyfs/taro_uii/utils/try_catch';
import { useHook_pageListNew } from '@xyfs/taro_uii/utils/useHooks';
import { coo___objToUrl } from '@xyfs/utils/util';
import { FC, useCallback, useRef, useState } from 'react';




definePageConfig({
  enableShareAppMessage: true, navigationStyle: "custom", disableScroll: true,
});
export default function COMSELFWarp() {
  return <ComSELFView>
    <ComAuth
      authKey='scope.camera'
      successMessage='摄像头授权成功'
      errMessage='摄像头授权失败'
      title='开启摄像头...'
      content='该小程序尚未获得手机摄像头的使用权限'
      confirmText='点击授权→摄像头'>
      <Index />
    </ComAuth>
  </ComSELFView>;
};
const Index: FC = () => {
  const role = useSTSelf.getState().selfInfo?.roles?.find(e => (["REGIMENT", "DRIVER", "SCANNER"] as ROLE_KEY[]).includes(e.roleKey));
  const { options } = Taro_getCurrentInstance<{ isShow: string; }>();
  const [show, setShow] = useState(options.isShow ? true : false);
  const ___page_getter = useCallback(async (p: Pagination<unknown>) =>
    await Api_logistic_list_ctn<Pagination<OrderInfo<Product_Dryclean>[]>>({
      ...p,
      keyword: "", status: 0
    }), []);
  const { page, page_loading, page_list_get, page_list_update, page_init } = useHook_pageListNew(___page_getter);
  return <MMMAAPage>
    <View className='ww '>
      <ComNav className='pa z9'>
        <ComNavBarA className='mb10 pl10' />
      </ComNav>
      <ComNav isOnlyTop />
      <IIICameraScaner className='mb10' onScanCode={async (e) => {

        Taro.showLoading({ mask: true, title: "加载中...", });
        await Api_logistic_add_ctn({
          roleId: role!.id!,
          carNo: "",
          location: "",
          outTradeNo: e, // 84VLQ75_SC9VAR
          signer: useSTSelf.getState().selfInfo!.name!,
        });
        page_init();
        Taro.hideLoading();
      }} />
    </View>
    <ComScrollView onScrollToLower={async () => { page_list_get(page); }}>
      {page.list?.map((order) => {
        const _order1 = order as OrderInfo<Product_Dryclean>;
        return <View className='dll ww mb10 bccwhite ioo' key={_order1.id}>
          <ComCardOrderDryclean className='ww' key={_order1.id} order={_order1} />
          <View className='dr dwp prl10 ww'>
            <ComButton rr className='mb10 bborder cccplh ml10' onClick={async () => {
              if (await try_Taro_showModal({ title: '提示', content: "点击确定删除" })) {
                Taro.showLoading({ mask: true, title: "删除中...", });
                await Api_logistic_remove_ctn({ id: order.orderEventId });
                page_list_update((p) => ({ ...p, list: p.list.filter(e => e.productList![0]!.id !== _order1.productList![0]!.id) }));
                Taro.showToast({ icon: "none", title: "删除成功", });
              } else {
                throw new Error("取消");
              }
            }}>删除</ComButton>
            {(_order1.eventType === 3 || (_order1.orderStatus === Order_ST.已退款 && _order1.eventType === 2)) && <ComButton rr className='mb10 bborder cccgreen ml10' onClick={async () => {
              await on_start_print((blue_device) => {
                return _order1.productList!.map(eee => on_get_cpcl_str_order_dryclean_out_factory({ ..._order1, }, blue_device));
              }, { selfInfo_S: useSTSelf.getState().selfInfo });
              Taro.showLoading({ mask: true, title: "订单出厂" });
              await Api_logistic_refund_ctn({ orderProductId: _order1.productList![0]!.id!, orderId: _order1.id! });
              Taro.showLoading({ mask: true, title: "更新打印次数..." });
              await Api_order_incrPrintTimes_ctn({ orderId: _order1.id!, orderProductId: _order1.productList?.[0]?.id });
              page_list_update((p) => ({ ...p, list: p.list.filter(e => e.productList![0]!.id !== _order1.productList![0]!.id) }));
              Taro.showToast({ icon: "none", title: "订单已出厂", });
            }}>打印→出厂</ComButton>}
          </View>
        </View>;
      })}
      <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)} />
    </ComScrollView>
    <View className=' ww prl10 dll pt10'>
      <View className='dy slr'>

        {getMyEnv().isUseInDev &&
          <ComButton rr className='mb10 cccprice nw' onClick={async () => {
            for (const item of ["819711856524"]) {
              Taro.showLoading({ mask: true, title: "加载中...", });
              await Api_logistic_add_ctn({
                roleId: role!.id!,
                carNo: "",
                location: "",
                outTradeNo: item,
                signer: useSTSelf.getState().selfInfo!.name!,
              });
              Taro.hideLoading();
            }
            page_init();
          }}>模拟</ComButton>
        }
        <ComButton rr className='nw mb10 ml10' onClick={() => setShow(e => !e)}>已上传→</ComButton>
        <ComButton className='nw mb10 ml10 cccgreen' onClick={async () => {
          Taro.showLoading({ mask: true, title: "上传中..." });
          await Api_logistic_confirm_ctn();
          page_init();
          Taro.showToast({ icon: "none", title: "上传完成" });
        }}>确认上传</ComButton>
      </View>
    </View>
    {show && <ComPopupNew>
      <IIIUploadedOrder onClose={() => { setShow(e => !e); }}></IIIUploadedOrder>
    </ComPopupNew>
    }
  </MMMAAPage >;
};


const IIIUploadedOrder: FC<{ onClose: () => void; }> = ({ onClose }) => {
  const [tabType, setTabType] = useState<1 | 2 | 3 | 4>(roo___has_role(useSTSelf.getState().selfInfo, ["REGIMENT"]) ? 1 : 2);
  const ___page_getter = useCallback(async (p: Pagination<unknown>) =>
    await Api_logistic_list_ctn<Pagination<OrderInfo<Product_Dryclean>[]>>({
      ...p,
      keyword: "",
      status: 1,
      eventType: tabType
    }), [tabType]);
  const { page, page_loading, page_list_get, page_init, page_list_update } = useHook_pageListNew(___page_getter);
  return <View className='dll prl10 ' style={{ height: "80vh" }} >
    <View className='ww '>
      <ComNavBarB className='mb10' onClose={onClose}>
        <ComButton className='fwb bccback'>已上传</ComButton>
      </ComNavBarB>
      <ComListTypeSelectorNew className=' ww'
        disabled={page_loading}
        data={(() => {
          if (roo___has_role(useSTSelf.getState().selfInfo, ["SCANNER"])) {
            return [{ name: '→厂', id: 2, }, { name: '厂→', id: 3 }];
          } else if (roo___has_role(useSTSelf.getState().selfInfo, ["REGIMENT"])) {
            return [{ name: '→团', id: 1, }, { name: '团→', id: 4 }];
          } else {
            return [];
          }
        })()} label='name' value='id'
        tabType={tabType} setTab={(e) => { page_init(); setTabType(e); }} />
    </View>
    <ComScrollView >
      {page.list?.map((order) => {
        const _order1 = order as OrderInfo<any>;
        return <View className='dll ww mb10 bccwhite ioo' key={_order1.id}>
          <ComCardOrderDryclean className=' ww' key={_order1.id} order={_order1} />
          <View className='dr dwp prl10 ww'>
            <ComButton rr className='slr cccgreen bborder mb10 ml10' onClick={async () => {
              await try_Taro_navigateTo({ url: `/pages_comm/comm__express_path?${coo___objToUrl({ express_share_id: order.id })}` });
            }}>轨迹</ComButton>
            {(_order1.eventType === 3 || (_order1.orderStatus === Order_ST.已退款 && _order1.eventType === 2)) && <ComButton rr className='mb10 bborder cccgreen ml10' onClick={async () => {
              await on_start_print((blue_device) => {
                return _order1.productList!.map(eee => on_get_cpcl_str_order_dryclean_out_factory({ ..._order1, }, blue_device));
              }, { orderId: _order1.id, selfInfo_S: useSTSelf.getState().selfInfo });
              await Api_order_incrPrintTimes_ctn({ orderId: _order1.id!, orderProductId: _order1.productList?.[0]?.id });
              page_list_update(p => ({ ...p, list: p.list.map(ee => ee.id === _order1.id ? { ...ee, productList: [{ ...ee.productList?.[0], printTimes: ee.productList![0]!.printTimes! + 1 }] } : ee) }));
            }}>打印{_order1.productList?.[0]?.printTimes ?? 0}次</ComButton>}
          </View>
        </View>;
      })}
      <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)}></ComLoading>
    </ComScrollView>
  </View>;
};

const IIICameraScaner = (prams: { className?: string, onScanCode: (e: string) => Promise<void>; }) => {
  const isLoading = useRef(false);

  return <View className='dcl ww' style={{ height: '210rpx' }}>
    {getMyEnv().isUseInDev && <View className={`mb10 IOO ovh dxy  ${prams.className}`} style={{ height: '190rpx', width: '98vw', boxShadow: "0px 2rpx 8rpx 0px rgba(0, 0, 0, 0.3)", backgroundColor: "rgb(0 0 0 / 50%)" }}
      onClick={() => {
        prams.onScanCode("926678416066");
      }}>
      模拟扫码
    </View>
    }

    {!getMyEnv().isUseInDev &&
      <Camera mode='scanCode' devicePosition='back' flash='off' className={`mb10 IOO ovh dxy  ${prams.className}`} style={{ height: '190rpx', width: '98vw', boxShadow: "0px 2rpx 8rpx 0px rgba(0, 0, 0, 0.3)", backgroundColor: "rgb(0 0 0 / 50%)" }}
        onError={async (err) => { throw new Error(err.detail.errMsg); }}
        onScanCode={async (e) => {
          if (!isLoading.current) {
            isLoading.current = true;
            console.info("扫码结果：", e);
            const _e = e as unknown as { mpEvent: { detail: { type: 'barcode', result: string; }; }; };
            if (_e.mpEvent.detail.type === 'barcode') {
              try {
                await prams.onScanCode(_e.mpEvent.detail.result);
              } catch (err) {
                isLoading.current = false;
                throw err;
              }
            }
            isLoading.current = false;
          }

        }} />
    }
  </View>;

}

