// :: pages_regiment/regiment_invitor
import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { DeptInfo, OrderInfo, ProductBase } from '@xyfs/taro_uii';
import { Api_order_query_ctn } from '@xyfs/taro_uii/api/api__orders';
import { Api_dept_groupLeader_ctn } from '@xyfs/taro_uii/api/api__users';
import { ComButton, ComButtonOpen } from '@xyfs/taro_uii/components/ComButton';
import { ComCardOrderDryclean } from '@xyfs/taro_uii/components/ComCardOrder';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from '@xyfs/taro_uii/components/ComScrollView';
import { ComSquare } from '@xyfs/taro_uii/components/ComSquare';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { roo___has_role } from '@xyfs/taro_uii/src/roles';
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { try_Taro_navigateBack, try_Taro_navigateTo } from '@xyfs/taro_uii/utils/try_catch';
import { useHook_getCurrentInstance } from '@xyfs/taro_uii/utils/useHooks';
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
          {roo___has_role(managerUser, ["REGIMENT"]) && <IIIExpress managerUser={managerUser}></IIIExpress>}
          {roo___has_role(managerUser, ["REGIMENT"]) && <IIIDryclean managerUser={managerUser}></IIIDryclean>}

          {roo___has_role(managerUser, ["REGIMENT", "GUIDE"]) && <IIIBringGoods managerUser={managerUser}></IIIBringGoods>}
          <IIIGroupLeaders deptInfo={managerUser} />
        </View>
      }
    </ComScrollView>
  </MMMAAPage>;
};


const IIIExpress: FC<{ managerUser: DeptInfo; }> = ({ managerUser }) => {
  return <View className='mb10 dy bccwhite ww ioo pt10 prl10'>
    <ComButton ll className='nw bccwhite mr10 bccwhite mb10' hoverClass='none'>快递</ComButton>
    <ComButtonOpen rr className='cccgreen bccbacktab  mb10 slr' id='send_express'
      shareTitle={`${managerUser?.name} 团长 邀您6元起寄快递`}
      openType='share'
      sharePath={`/pages_comm/comm__product_express?${coo___objToUrl({ scene: encodeURIComponent(coo___objToUrl({ R_D: Number(managerUser.mobile).toString(36) })) })}`}>
      邀请下单(快递)
    </ComButtonOpen>
  </View>;
};

const IIIDryclean: FC<{ managerUser: DeptInfo; }> = ({ managerUser }) => {
  const [order, setOrder] = useState<OrderInfo<ProductBase> | null>(null);
  const { options } = useHook_getCurrentInstance<{ scene?: string; }>();
  const { O_D } = coo___urlToObj<{ O_D?: string; }>(options.scene);
  useEffect(() => {
    (async () => {
      if (O_D) {
        const res_order = await Api_order_query_ctn({ orderId: O_D });
        setOrder(res_order);
      }
    })();
  }, [O_D]);
  return <> {
    order && <View className='ww bccwhite ioo pt10 mb10'>
      <View className='dy ww prl10'>
        <ComButton ll className='nw bccwhite mr10 bccwhite mb10' hoverClass='none'>干洗</ComButton>
        <ComButtonOpen rr className='cccgreen bccbacktab mb10 slr' id='send_dryclean'
          shareTitle={`${managerUser?.name} 团长 邀您支付快递订单`}
          openType='share'
          sharePath={`/pages_user/user_orders?${coo___objToUrl({ scene: `${encodeURIComponent(coo___objToUrl({ R_D: Number(managerUser.mobile).toString(36), O_D: O_D }))}` })}`}>
          邀请下单(干洗)
        </ComButtonOpen>
      </View>
      <ComCardOrderDryclean order={order as any} />
    </View>
  }</>;
};
const IIIBringGoods: FC<{ managerUser: DeptInfo; }> = ({ managerUser }) => {
  return <View className='mb10 dy bccwhite ww ioo pt10 prl10'>
    <ComButton ll className='nw bccwhite mr10 bccwhite mb10' hoverClass='none'>带货</ComButton>
    <ComButtonOpen rr className='cccgreen bccbacktab  mb10 slr' id='send_express'
      shareTitle={`${managerUser?.name} 团长 邀您买东西啦`}
      openType='share'
      sharePath={`/pages/index/index?${coo___objToUrl({ scene: encodeURIComponent(coo___objToUrl({ R_D: Number(managerUser.mobile).toString(36) })) })}`}>
      邀请下单(带货)
    </ComButtonOpen>
  </View>;
};


const IIIGroupLeaders: FC<{ deptInfo: DeptInfo; }> = ({ deptInfo }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const [groupLeaders, setGroupLeaders] = useState<DeptInfo[] | null>(null);
  useEffect(() => {
    Api_dept_groupLeader_ctn({}).then(res => {
      setGroupLeaders(res);
    });
  }, []);

  return <>
    {!groupLeaders && <ComLoading />}
    {groupLeaders?.map(e => {
      return <View key={e.deptId} className='mb10 dbtc bccwhite ww ioo pt10 prl10' onClick={() => {
        try_Taro_navigateTo({ url: `/pages/group_buy?${coo___objToUrl({ scene: encodeURIComponent(coo___objToUrl({ G_D: e.deptId, })) })}` });
      }}>
        <ComButton ll className='mb10' hoverClass='none'>
          {e.deptName}
        </ComButton>
        <ComButtonOpen rr className='cccgreen bborder mb10 ml10' id='send_express'
          shareTitle={`${selfInfo_S.managerUser?.name} 团长 邀您买东西啦`}
          openType='share'
          sharePath={`/pages/group_buy?${coo___objToUrl({ scene: encodeURIComponent(coo___objToUrl({ G_D: e.deptId, })), R_D: Number(selfInfo_S.managerUser?.mobile).toString(36) })}`}>
          <View className='dbase'>
            {selfInfo_S.managerUser && <Text className='fs07 mr4 cccorange' >¥</Text>}
            <Text className='cccplh mr4'>分享</Text>
          </View>
          <ComSquare className='icon-share' style={{ width: "calc(1 * var(--rem_base))" }} />
        </ComButtonOpen>
      </View>;
    })}
  </>;
};