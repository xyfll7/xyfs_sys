// :: pages/index/index
import { Image, Text, View, ViewProps } from "@tarojs/components";
import { ComBanner } from "@xyfs/taro_uii/components/ComBanner";
import { ComButton, ComButtonOpen } from '@xyfs/taro_uii/components/ComButton';
import { ComImage } from "@xyfs/taro_uii/components/ComImage";
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { MMMFooter } from "@xyfs/taro_uii/components/MMMFooter";
import { MMMLogo } from '@xyfs/taro_uii/components/MMMLogo';
import { Order_ST } from "@xyfs/taro_uii/src/config";
import { getMyEnv } from "@xyfs/taro_uii/src/env";
import { roo___has_role } from "@xyfs/taro_uii/src/roles";
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { try_Taro_navigateToMiniProgram } from '@xyfs/taro_uii/utils/try_catch';
import { coo___objToUrl } from "@xyfs/utils/util";
import { FC } from 'react';



definePageConfig({
  enableShareAppMessage: true, navigationStyle: "custom", disableScroll: true,
  // "styleIsolation": "shared",
  // "componentFramework": "glass-easel",
  // "renderer": "skyline",
});

export default function COMSELFWarp() { return <ComSELFView isRefreshSelfInfo_SEveryTime><Index></Index></ComSELFView>; };

const Index: FC = () => {
  return <MMMAAPage
    isNeedRegiment={false}>
    <ComNav isRight>
      <View className='ds flx1 ww mb10 '>
        <ComBanner isHeaderBack />
        <MMMLogo className='ml10' />
        <ComButton ll className='mr10 cccplh bcctrans' ><Text className='wm6rem nw1'>{useSTSelf.getState().selfInfo!.name}</Text> </ComButton>
      </View>
    </ComNav>
    <ComScrollView className='IOO'>
      {roo___has_role(useSTSelf.getState().selfInfo!, ["REGIMENT"]) && <IIImmmREGIMENT />}
      {roo___has_role(useSTSelf.getState().selfInfo!, ["MERCHANT"]) && <IIImmmMERCHANT className='mb10' />}
      {roo___has_role(useSTSelf.getState().selfInfo!, ["AGENT"]) && <IIImmmAGENT />}
      {roo___has_role(useSTSelf.getState().selfInfo!, ["DRIVER"]) && <IIImmmDRIVER />}
      {roo___has_role(useSTSelf.getState().selfInfo!, ["SUPPLIER"]) && <IIImmmSUPPLIER />}
      {roo___has_role(useSTSelf.getState().selfInfo!, ["SCANNER"]) && <IIImmmSCANNER />}
      {roo___has_role(useSTSelf.getState().selfInfo!, ["AGENT", "REGIMENT"]) && <>
        <ComButton className='bccwhite mb10' url='/pages_comm/icomm_download_list' >下载任务列表</ComButton>
      </>}
      {useSTSelf.getState().selfInfo!.parentId && useSTSelf.getState().selfInfo!.mobile &&
        <View className='dll ww'>
          <ComButton className='bccback mb10 cccplh'>我</ComButton>
          <View className='dy'>
            <ComButton className='dbtc mb10 mr10  bccwhite' url={`/pages_user/sub_user_register?parentId=${useSTSelf.getState().selfInfo!.parentId}`}>
              <ComImage className='mr10 oo ovh' src={useSTSelf.getState().selfInfo?.avatar} />
              <View className='nw1 wm5rem mr10'>{useSTSelf.getState().selfInfo!.name}</View>
              {useSTSelf.getState().selfInfo!.mobile}
              <View className='cccgreen ml10'>修改</View>
            </ComButton>
          </View>

        </View>
      }
      {getMyEnv().isUseInDev && <IIImmmTest />}
      <MMMFooter className='mb10' />
    </ComScrollView>
  </MMMAAPage>;
};



const IIImmmAGENT = ({ ...props }: ViewProps) => {
  return <>
    <ComButton className='mb10 cccplh mr10 bccback' >代理</ComButton>
    <View className='dy dwp'>
      <ComButton className='bccwhite mb10 mr10' url='/pages_agent/agent__express_search'>
        快递查询
      </ComButton>
      <ComButton className='bccwhite mb10 mr10' url='/pages_agent/agent__account'>
        面单账号
      </ComButton>
      <ComButton className='bccwhite mb10 mr10' url='/pages_agent/agent__check_account'>
        对账
      </ComButton>
      <ComButton className='bccwhite mb10 mr10' url='/pages_user/sub_user_list'>
        子用户
      </ComButton>
      <ComButtonOpen className='bccwhite mb10 mr10' id='invite'
        shareTitle={`${useSTSelf.getState().selfInfo!.name ?? "代理"} 邀请您注册子用户`}
        openType='share'
        sharePath={`/pages_user/sub_user_register?${coo___objToUrl({ parentId: useSTSelf.getState().selfInfo!.OPENID! })}`}>
        邀请注册
      </ComButtonOpen>
    </View>
  </>;
};
const IIImmmREGIMENT = ({ ...props }: ViewProps) => {
  return <>
    <View className='pr ww mb10 bccwhite IOO ovh'>
      <View className=' hh ww pa drc pr15' style={{ top: "0rem" }}>
        <Image className='' style={{ width: "20vw", height: "20vw" }} mode='heightFix' src='https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/express.png' />
      </View>
      <View className='pt10 prl10  ww  dll ' >
        <ComButton ll className='mb10 cccplh' >团长/快递业务</ComButton>
        <View className='dy dwp'>
          <ComButton ll className='fwb mb10 mr10 bborder' url='/pages_comm/comm__product_express'>快递</ComButton>
          <ComButton ll className='mb10  dy bborder' onClick={async () =>
            try_Taro_navigateToMiniProgram({
              appId: process.env.TARO_APP_CLIENT,
              path: `/pages_regiment/regiment_invitor?${coo___objToUrl({ regimentId: useSTSelf.getState().selfInfo!.OPENID })}`,
              noRelaunchIfPathUnchanged: false,
            })}>
            分享邀请：<Text className='cccgreen'>小象心选顾客端</Text>
          </ComButton>
        </View>
        <View className='dy dwp'>
          <ComButton ll className=' nw mb10 mr10 bborder' url={`/pages_regiment/regiment_orders_express?order_ST=${Order_ST.待付款}`}>待付款 </ComButton>
          <ComButton ll className=' nw mb10 mr10 bborder' url={`/pages_regiment/regiment_orders_express?order_ST=${Order_ST.已付款}`}>已付款 </ComButton>
          <ComButton ll className=' nw mb10 mr10 bborder' url={`/pages_regiment/regiment_orders_express?order_ST=${Order_ST.已退款}`}>已退款 </ComButton>
        </View>

      </View>
    </View>

    <View className='pr ww mb10 bccwhite IOO ovh'>
      <View className=' hh ww pa drc' style={{ top: "0rem" }}>
        <Image className='' style={{ width: "20vw", height: "15vw" }} mode='heightFix' src='https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/dryclean.png' />
      </View>
      <View className='pt10 prl10  ww  dll ' >
        <ComButton ll className='mb10 cccplh '>团长/干洗业务</ComButton>
        <View className='dy dwp'>
          <ComButton ll className='  fwb mb10 mr10 bborder' url='/pages_comm/comm__product_dryclean'>干洗</ComButton>
          <ComButton ll className='mb10  mr10 bborder' url='/pages_comm/icomm_scaner'>扫码揽件</ComButton>
        </View>
        <View className='dy dwp'>
          <ComButton ll className=' nw mb10 mr10 bborder' url={`/pages_comm/icomm_orders_dryclean?order_ST=${Order_ST.待付款}`}>待付款 </ComButton>
          <ComButton ll className=' nw mb10 mr10 bborder' url={`/pages_comm/icomm_orders_dryclean?order_ST=${Order_ST.已付款}`}>已付款 </ComButton>
          <ComButton ll className=' nw mb10 mr10 bborder' url={`/pages_comm/icomm_orders_dryclean?order_ST=${Order_ST.已退款}`}>已退款 </ComButton>
        </View>
      </View>
    </View>
    <View className='pr ww mb10 bccwhite IOO ovh'>
      <View className=' hh ww pa drc' style={{ top: "0rem" }}>
        <Image className='' style={{ width: "20vw", height: "15vw" }} mode='heightFix' src='https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/shaoping_bag.png' />
      </View>
      <View className='pt10 prl10  ww  dll ' >
        <ComButton ll className='mb10 cccplh '>团长/团购业务/订单</ComButton>
        <View className='dy dwp'>
          <ComButton ll className=' nw mb10 mr10 bborder' url={`/pages_comm/icomm_orders_groupbuying?order_ST=${Order_ST.已付款}`}>已付款 </ComButton>
          <ComButton ll className=' nw mb10 mr10 bborder' url={`/pages_comm/icomm_orders_groupbuying?order_ST=${Order_ST.已退款}`}>已退款 </ComButton>
        </View>
      </View>
    </View>
    {getMyEnv().isUseInDev &&
      <View className='pr ww mb10 bccwhite IOO ovh'>
        <View className=' hh ww pa drc pr17' style={{ top: "0rem" }}>
          <Image className='' style={{ width: "20vw", height: "15vw" }} mode='heightFix' src='https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/helps.png' />
        </View>
        <View className='pt10 prl10 ww dll'>
          <ComButton ll className='mb10 cccplh'>团长/帮忙业务</ComButton>
          <View className='dy dwp'>
            <ComButton ll className='mb10 dy bborder fwb' onClick={async () => {
              await try_Taro_navigateToMiniProgram({
                appId: process.env.TARO_APP_CLIENT,
                path: `/pages_regiment/regiment_assist?${coo___objToUrl({ regimentId: useSTSelf.getState().selfInfo!.OPENID })}`,
                noRelaunchIfPathUnchanged: false,
              });
            }}>
              帮忙
            </ComButton>
          </View>
        </View>
      </View>
    }
    <ComButton className='mb10 cccplh bccback'>团长/配置</ComButton>
    <View className='dy dwp'>
      <ComButton className='mb10 bccwhite nw mr10' url='/pages_regiment/regiment_bind_cloudPrinter'>云打印机</ComButton>
      <ComButton className='mb10 bccwhite nw mr10' url='/pages_comm/icomm_printer'>蓝牙设备</ComButton>
      <ComButton className='mb10 bccwhite nw mr10' url='/pages_regiment/regiment_collection_record'>收款记录</ComButton>
    </View>
  </>;
};
const IIImmmSUPPLIER = ({ ...props }: ViewProps) => {
  return <>
    <ComButton className='mb10 cccplh bccback'>供应商</ComButton>
    <View className='dy'>
      <ComButton className='bccwhite nw mb10 mr10' url='/pages_comm/icomm_orders_dryclean'>干洗订单</ComButton>
    </View>
    <View className='dy'>
      <ComButton className='bccwhite  fwb mb10 mr10' url='/pages_comm/comm__product_dryclean'>干洗商品</ComButton>
      <ComButtonOpen ll className='bccwhite mb10 mr10' id='invite'
        shareTitle={`供应商：${useSTSelf.getState().selfInfo!.name} 邀请您注册员工`}
        openType='share'
        sharePath={`/pages_user/sub_user_register?${coo___objToUrl({ parentId: useSTSelf.getState().selfInfo!.OPENID! })}`}>
        邀请注册-员工
      </ComButtonOpen>
      <ComButton ll className='bccwhite mb10 mr10' url='/pages_user/sub_user_list'>子用户</ComButton>
    </View>
  </>;
};
const IIImmmDRIVER = ({ ...props }: ViewProps) => {
  return <View className='dll'>
    <ComButton className='mb10 cccplh bccback'>司机</ComButton>
    <ComButton className='mb10 bccwhite' url='/pages_comm/icomm_scaner'>扫码揽件</ComButton>
    <ComButton className='mb10 ' url='/pages_comm/icomm_scaner?isShow=1'>已上传→</ComButton>
  </View>;
};
const IIImmmSCANNER = ({ ...props }: ViewProps) => {
  return <View className='dll'>
    <ComButton className='mb10 cccplh bccback'>干洗工厂-揽收员</ComButton>
    <ComButton className='mb10 bccwhite' url='/pages_comm/icomm_scaner'>扫码揽件</ComButton>
    <ComButton className='mb10 ' url='/pages_comm/icomm_scaner?isShow=1'>已上传→</ComButton>
    <View className='dy'>
      <ComButton className='mb10 bccwhite nw mr10' url='/pages_comm/icomm_printer'>蓝牙设备</ComButton>
    </View>
  </View>;
};
const IIImmmTest = ({ ...props }: ViewProps) => {
  return <View className={`${props.className} dll`}>
    <ComButton className='bccwhite cccprice fwb mb10' url='/pages/test/ctest_display' >测试display</ComButton>
    <ComButton className='bccwhite cccprice fwb mb10' url='/pages/test/ctest_index' routeType='wx://cupertino-modal'>测试</ComButton>
  </View>;
};
const IIImmmMERCHANT = ({ ...props }: ViewProps) => {
  return <>
    <View className={`bccwhite ww dll pt10 prl10 IOO ${props.className}`}>
      <View className='dbtc ww'>
        <ComButton ll className='mb10 cccplh bccwhite mr10'>商家</ComButton>
        <ComButton rr className='bccyellow mb10 ml10' url='/pages_comm/comm__publisher'>+商品</ComButton>
      </View>
      <View className='dy dwp'>
        <ComButton ll className=' nw mb10 mr10 bborder' url={`/pages_comm/icomm_orders_groupbuying?order_ST=${Order_ST.已付款}`}>已付款 </ComButton>
        <ComButton ll className=' nw mb10 mr10 bborder' url={`/pages_comm/icomm_orders_groupbuying?order_ST=${Order_ST.已退款}`}>已退款 </ComButton>
      </View>
      <ComButton ll className='bborder mb10' url='/pages_merchant/merchant_product_list'>商品列表</ComButton>
    </View>
    <ComButton className='mb10 cccplh bccback'>商家/配置</ComButton>
    <View className='dy dwp'>
      <ComButton className='mb10 bccwhite nw mr10' url='/pages_regiment/regiment_collection_record'>收款记录</ComButton>
    </View>
  </>;

};