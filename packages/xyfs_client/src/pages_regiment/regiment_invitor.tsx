// :: pages_regiment/regiment_invitor
import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { DeptInfo, OrderInfo, ProductBase } from '@xyfs/taro_uii';
import { Api_order_query_ctn } from '@xyfs/taro_uii/api/api__orders';
import { ComButton, ComButtonOpen } from '@xyfs/taro_uii/components/ComButton';
import { ComCardOrderDryclean } from '@xyfs/taro_uii/components/ComCardOrder';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from '@xyfs/taro_uii/components/ComScrollView';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { roo___has_role } from '@xyfs/taro_uii/src/roles';
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { Taro_getCurrentInstance, try_Taro_navigateBack } from '@xyfs/taro_uii/utils/try_catch';
import { coo___objToUrl, coo___urlToObj } from '@xyfs/utils/util';
import { FC, useEffect, useState } from 'react';

definePageConfig({ enableShareAppMessage: true, navigationStyle: "custom", disableScroll: true, });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC = () => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const managerUser = selfInfo_S.managerUser;
  return <MMMAAPage
    isNeedRegiment={false}
    isPageAccess={roo___has_role(managerUser, ["REGIMENT", "GUIDE"])}>
    <ComNav>
      <ComNavBarA backText='首页' onClickBack={async () => { await try_Taro_navigateBack(); }} className='mb10 pl10'>
        <ComButton ll className='bcctrans cccplh ml10' >分享邀请</ComButton>
      </ComNavBarA>
    </ComNav>
    <ComScrollView>
      {managerUser &&
        <View className='dll ww'>
          <View className='dy'>
            <ComButton className='mb10 mr10 nw' onClick={() => { Taro.navigateBackMiniProgram({}); }}>返回→管理端</ComButton>
            <ComButton ll className='mb10 cccplh nw1'> <Text className='wm7rem nw1'>{managerUser?.name}</Text> <Text className='nw'>(团长) 您好 👋</Text>  </ComButton>
          </View>
          {roo___has_role(managerUser, ["REGIMENT"]) && <IIIExpress deptInfo={managerUser}></IIIExpress>}
          {roo___has_role(managerUser, ["REGIMENT"]) && <IIIDryclean deptInfo={managerUser}></IIIDryclean>}


          {roo___has_role(managerUser, ["REGIMENT", "GUIDE"]) && <IIIBringGoods deptInfo={managerUser}></IIIBringGoods>}

        </View>
      }
    </ComScrollView>
  </MMMAAPage>;
};


const IIIExpress: FC<{ deptInfo: DeptInfo; }> = ({ deptInfo }) => {
  return <View className='mb10 dy bccwhite ww ioo pt10 prl10'>
    <ComButton ll className='nw bccwhite mr10 bccwhite mb10' hoverClass='none'>快递</ComButton>
    <ComButtonOpen rr className='cccgreen bccbacktab  mb10 slr' id='send_express'
      shareTitle={`${deptInfo?.name} 团长 邀您6元起寄快递`}
      openType='share'
      sharePath={`/pages_comm/comm__product_express?${coo___objToUrl({ scene: encodeURIComponent(coo___objToUrl({ R_D: Number(deptInfo.mobile).toString(36) })) })}`}>
      邀请下单(快递)
    </ComButtonOpen>
  </View>;
};

const IIIDryclean: FC<{ deptInfo: DeptInfo; }> = ({ deptInfo }) => {
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
        <ComButton ll className='nw bccwhite mr10 bccwhite mb10' hoverClass='none'>干洗</ComButton>
        <ComButtonOpen rr className='cccgreen bccbacktab mb10 slr' id='send_dryclean'
          shareTitle={`${deptInfo?.name} 团长 邀您支付快递订单`}
          openType='share'
          sharePath={`/pages_user/user_orders?${coo___objToUrl({ scene: `${encodeURIComponent(coo___objToUrl({ R_D: Number(deptInfo.mobile).toString(36), S_D: S_D }))}` })}`}>
          邀请下单(干洗)
        </ComButtonOpen>
      </View>
      <ComCardOrderDryclean order={order as any} />
    </View>
  }</>;
};
const IIIBringGoods: FC<{ deptInfo: DeptInfo; }> = ({ deptInfo }) => {
  return <View className='mb10 dy bccwhite ww ioo pt10 prl10'>
    <ComButton ll className='nw bccwhite mr10 bccwhite mb10' hoverClass='none'>带货</ComButton>
    <ComButtonOpen rr className='cccgreen bccbacktab  mb10 slr' id='send_express'
      shareTitle={`${deptInfo?.name} 团长 邀您买东西啦`}
      openType='share'
      sharePath={`/pages/index/index?${coo___objToUrl({ scene: encodeURIComponent(coo___objToUrl({ R_D: Number(deptInfo.mobile).toString(36) })) })}`}>
      邀请下单(带货)
    </ComButtonOpen>
  </View>;
};