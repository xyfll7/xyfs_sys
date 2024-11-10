// :: pages_regiment/regiment_invitor
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { BaseUserInfo, OrderInfo, ProductBase } from '@xyfs/taro_uii';
import { Api_order_query_ctn } from '@xyfs/taro_uii/api/api__orders';
import { ComButton, ComButtonOpen } from '@xyfs/taro_uii/components/ComButton';
import { ComCardOrderDryclean } from '@xyfs/taro_uii/components/ComCardOrder';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from '@xyfs/taro_uii/components/ComScrollView';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { roo___has_role } from '@xyfs/taro_uii/src/roles';
import { Taro_getCurrentInstance, try_Taro_navigateBack } from '@xyfs/taro_uii/utils/try_catch';
import { useHook_userInfo } from '@xyfs/taro_uii/utils/useHooks';
import { coo___objToUrl, coo___urlToObj } from '@xyfs/utils/util';
import { FC, useEffect, useState } from 'react';

definePageConfig({ enableShareAppMessage: true, navigationStyle: "custom", disableScroll: true, });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC = () => {
  const { options } = Taro_getCurrentInstance<{ regimentId: string, }>();
  const regimentInfo = useHook_userInfo(options.regimentId);
  return <MMMAAPage
    isNeedRegiment={false}
    isLoading={!options.regimentId ? Boolean(options.regimentId) : !regimentInfo}
    isPageAccess={roo___has_role(regimentInfo, ["REGIMENT"])}>
    <ComNav>
      <ComNavBarA backText='首页' onClickBack={async () => { await try_Taro_navigateBack(); }} className='mb10 pl10'>
        <ComButton ll className='bcctrans cccplh ml10' >分享邀请</ComButton>
      </ComNavBarA>
    </ComNav>
    <ComScrollView>
      {regimentInfo &&

        <View className='dll ww'>
          <View className='dy'>
            <ComButton className='mb10 mr10' onClick={() => { Taro.navigateBackMiniProgram({}); }}>返回→管理端</ComButton>
            <ComButton ll className='mb10 cccplh'> <View className='wm7rem'>{regimentInfo?.name}</View> (团长) 您好 👋 </ComButton>
          </View>
          <IIIExpress regimentInfo={regimentInfo}></IIIExpress>
          <IIIDryclean regimentInfo={regimentInfo}></IIIDryclean>
        </View>
      }
    </ComScrollView>
  </MMMAAPage>;
};


const IIIExpress: FC<{ regimentInfo: BaseUserInfo; }> = ({ regimentInfo }) => {
  return <View className='mb10 dy bccwhite ww ioo pt10 prl10'>
    <ComButton ll className='nw bccwhite mr10 bccwhite mb10'>快递</ComButton>
    {/* <ComQRCode rr className='cccgreen mb10 slr' params={{
      buttonText: "小程序码",
      title: "团长专属",
      desc: ["快递下单快捷小程序码"],
      page: "pages_comm/comm__product_express",
      scene: coo___objToUrl({ R_D: Number(regimentInfo.mobile).toString(36) }),
    }} /> */}
    <ComButtonOpen rr className='cccgreen bccwhite bborder mb10 slr' id='send_express'
      shareTitle={`${regimentInfo?.name} 团长 邀您6元起寄快递`}
      openType='share'
      sharePath={`/pages_comm/comm__product_express?${coo___objToUrl({ scene: encodeURIComponent(coo___objToUrl({ R_D: Number(regimentInfo.mobile).toString(36) })) })}`}>
      邀请下单(快递)
    </ComButtonOpen>
  </View>;
};

const IIIDryclean: FC<{ regimentInfo: BaseUserInfo; }> = ({ regimentInfo }) => {
  const [order, setOrder] = useState<OrderInfo<ProductBase> | null>(null);
  const { options } = Taro_getCurrentInstance<{ scene?: string; }>();
  const { S_D } = coo___urlToObj<{ S_D?: string; }>(options.scene);
  useEffect(() => {
    (async () => {
      if (S_D) {
        const res_order = await Api_order_query_ctn({ orderId: S_D });
        setOrder(res_order);
      }
    })();
  }, [S_D]);
  return <> {
    order && <View className='ww bccwhite ioo pt10 mb10'>
      <View className='dy ww prl10'>
        <ComButton ll className='nw bccwhite mr10 bccwhite mb10'>干洗</ComButton>
        <ComButtonOpen rr className='cccgreen bborder mb10 slr' id='send_dryclean'
          shareTitle={`${regimentInfo?.name} 团长 邀您支付快递订单`}
          openType='share'
          sharePath={`/pages_user/user_orders?${coo___objToUrl({ scene: `${encodeURIComponent(coo___objToUrl({ R_D: Number(regimentInfo.mobile).toString(36), S_D: S_D }))}` })}`}>
          邀请下单(干洗)
        </ComButtonOpen>
      </View>
      <ComCardOrderDryclean order={order as any} />
    </View>
  }</>;
};