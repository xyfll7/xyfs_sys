// :: pages/index/index
import { Picker, Text, View, ViewProps } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { DeptInfo } from "@xyfs/taro_uii";
import { Api_order_export_ctn } from "@xyfs/taro_uii/api/api__orders";
import { Api_common_jtsd } from "@xyfs/taro_uii/api/api__users";
import { ComBannerMemo } from "@xyfs/taro_uii/components/ComBanner";
import { ComButton, ComButtonOpen } from '@xyfs/taro_uii/components/ComButton';
import { ComImage } from "@xyfs/taro_uii/components/ComImage";
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarB } from "@xyfs/taro_uii/components/ComNavBarB";
import { ComPopupNew } from "@xyfs/taro_uii/components/ComPopupNew";
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { MMMFooter } from "@xyfs/taro_uii/components/MMMFooter";
import { MMMLogo } from '@xyfs/taro_uii/components/MMMLogo';
import { Order_ST } from "@xyfs/taro_uii/src/config";
import { getMyEnv } from "@xyfs/taro_uii/src/env";
import { roo___has_role } from "@xyfs/taro_uii/src/roles";
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { try_Taro_navigateTo, try_Taro_navigateToMiniProgram, try_Taro_showModal } from '@xyfs/taro_uii/utils/try_catch';
import { utils_get_qrcode, utils_get_start_end_time } from "@xyfs/taro_uii/utils/util";
import { coo___ios_date, coo___objToUrl } from "@xyfs/utils/util";
import format from "date-fns/format";
import { FC, useState } from 'react';



definePageConfig({
  enableShareAppMessage: true, navigationStyle: "custom", disableScroll: true,
  // "styleIsolation": "shared",
  // "componentFramework": "glass-easel",
  // "renderer": "skyline",
});

export default function COMSELFWarp() { return <ComSELFView isRefreshSelfInfo_SEveryTime><Index></Index></ComSELFView>; };

const Index: FC = () => {
  const selfInfo_S = useSTSelf(e => e.selfInfo);
  return <MMMAAPage>
    <ComNav isRight>
      <View className='ds flx1 ww mb10 '>
        <ComBannerMemo isHeaderBack src={[
          "https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/back_image_2025-06-03_001.png",
          "https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/back_image_2025-06-03_002.png",
          "https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/back_image_2025-06-03_003.png",
          "https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/back_image_2025-06-03_004.png",
        ].sort(() => Math.random() - 0.5)[0]} />
        <MMMLogo className='ml10' />
        <ComButton ll className='mr10 cccplh bcctrans' ><Text className='wm6rem nw1'>{selfInfo_S!.name}</Text> </ComButton>
      </View>
    </ComNav>
    <ComScrollView className='IOO'>
      {roo___has_role(selfInfo_S!, ["REGIMENT"]) && <IIImmmREGIMENT />}
      {roo___has_role(selfInfo_S!, ["MERCHANT"]) && <IIImmmMERCHANT className='mb10' />}

      {roo___has_role(selfInfo_S!, ["DRIVER"]) && <IIImmmDRIVER />}
      {roo___has_role(selfInfo_S!, ["SUPPLIER"]) && <IIImmmSUPPLIER />}
      {roo___has_role(selfInfo_S!, ["SCANNER"]) && <IIImmmSCANNER />}
      {roo___has_role(selfInfo_S!, ["GUIDE"]) && <IIImmmGUIDE />}
      {roo___has_role(selfInfo_S!, ["GROUPLEADER"]) && <IIImmmGROUPLEADER />}
      <IIISettings />

      <View className='dll ww'>
        <ComButton className='bccback mb10 cccplh'>我</ComButton>
        <View className='dy'>
          <ComButton className='dbtc mb10 mr10  bccback' url='/pages_user/sub_user_register'>
            <ComImage compress className='mr10 oo ovh' src={selfInfo_S?.avatar} />
            <View className='nw1 wm5rem mr10'>{selfInfo_S!.name}</View>
            {selfInfo_S!.mobile}
            <View className='cccgreen ml10 nw'>设置</View>
          </ComButton>
        </View>
      </View>
      {getMyEnv().platform === "devtools" &&
        <View className='dll'>
          <ComButton className='bcctrans cccprice fwb mb10' url='/pages/test/ctest_display' >测试display</ComButton>
          <ComButton className='bcctrans cccprice fwb mb10' url='/pages/test/ctest_index' >测试</ComButton>
          <ComButton className='bcctrans cccprice fwb mb10' url='/pages/test/ctest_utils' >工具</ComButton>
        </View>
      }
      <MMMFooter className='mb10' />
    </ComScrollView>
  </MMMAAPage>;
};

const IIIShareInviteCard = ({ selfInfo_S, ...props }: { selfInfo_S: DeptInfo; } & ViewProps) => {
  return <>
    {roo___has_role(selfInfo_S!, ["REGIMENT", "GUIDE"]) &&
      <ComButton ll className='mb10 dy bborder' onClick={async () => {
        try_Taro_navigateToMiniProgram({
          appId: process.env.TARO_APP_CLIENT,
          path: `/pages_regiment/regiment_invitor`,
          noRelaunchIfPathUnchanged: false,
        });
      }}>
        <Text className="mr10">分享邀请</Text> <Text className='cccgreen'>小象心选顾客端</Text>
      </ComButton>
    }
  </>;
};

const IIISettings = ({ ...props }: ViewProps) => {
  const selfInfo_S = useSTSelf(e => e.selfInfo);
  return <>
    <ComButton {...props} className='mb10 cccplh mr10 bccback' >设置</ComButton>
    <View className='dy dwp'>

      {roo___has_role(selfInfo_S!, ["REGIMENT", "GUIDE"]) && <>
        <ComButton className='mb10 bccwhite nw mr10' url='/pages_regiment/regiment_bind_channel'>绑定视频号</ComButton>
      </>
      }

      {roo___has_role(selfInfo_S!, ["REGIMENT", "GROUPLEADER"]) && <>
        <ComButton className='bccwhite mb10 mr10' url='/pages_agent/agent__account'>
          面单账号
        </ComButton>
      </>
      }
      {roo___has_role(selfInfo_S!, ["REGIMENT", "MERCHANT", "GROUPLEADER"]) &&
        <ComButton className='mb10 bccwhite nw mr10' url='/pages_regiment/regiment_collection_record'>收款记录</ComButton>
      }
      {roo___has_role(selfInfo_S!, ["REGIMENT", "SCANNER", "MERCHANT", "GROUPLEADER"]) &&
        <ComButton className='mb10 bccwhite nw mr10' url='/pages_comm/icomm_printer'>蓝牙设备</ComButton>
      }
      {roo___has_role(selfInfo_S!, ["REGIMENT"]) &&
        <ComButton className='mb10 bccwhite nw mr10' url='/pages_regiment/regiment_bind_cloudPrinter'>云打印机</ComButton>
      }

      {roo___has_role(selfInfo_S!, ["AGENT", "REGIMENT", "SUPPLIER", "SCANNER"]) &&
        <ComButton className='bccwhite mb10 mr10' url='/pages_agent/agent__express_search'>
          订单综合查询
        </ComButton>
      }
      {roo___has_role(selfInfo_S!, ["AGENT", "SUPPLIER"]) &&
        <ComButtonOpen className='bccwhite mb10 mr10' id='invite'
          shareTitle={`${selfInfo_S!.name} 邀请您注册`}
          openType='share'
          sharePath='/pages_user/sub_user_register'>
          邀请注册
        </ComButtonOpen>
      }

      {roo___has_role(selfInfo_S!, ["AGENT", "SUPPLIER"]) && <ComButton className='bccwhite mb10 mr10' url='/pages_user/dry_cleaning_statement'>
        干洗账单
      </ComButton>}
      {roo___has_role(selfInfo_S!, ["AGENT"]) && <>
        <ComButton className='bccwhite mb10 mr10' url='/pages_agent/agent__account'>
          面单账号
        </ComButton>
        <ComButton className='bccwhite mb10 mr10' url='/pages_agent/agent__check_account'>
          对账
        </ComButton>
      </>}
      {roo___has_role(selfInfo_S!, ["AGENT"]) && <>
        <ComButton className="mb10 mr10" onClick={async () => {
          Taro.showLoading({ title: "切换中..." });
          await Api_common_jtsd({ expressType: 1 });
          Taro.showToast({ icon: "none", title: "切换成功" });
        }}>
          极兔-标准快递
        </ComButton>
        <ComButton className="mb10 mr10" onClick={async () => {
          Taro.showLoading({ title: "切换中..." });
          await Api_common_jtsd({ expressType: 2 });
          Taro.showToast({ icon: "none", title: "切换成功" });
        }}>
          极兔-兔优达
        </ComButton>
      </>}
      {roo___has_role(selfInfo_S!, ["ADMIN", "AGENT"]) && <>
        <ComButton className='bccwhite mb10 mr10' url='/pages_user/sub_user_dept'>
          部门管理
        </ComButton>
      </>
      }
      {roo___has_role(selfInfo_S!, ["ADMIN", "AGENT"]) &&
        <ComButton className='bccwhite mb10 mr10' url='/pages_user/sub_user_list'>
          子用户
        </ComButton>
      }
      {roo___has_role(selfInfo_S!, ["ADMIN", "AGENT", "REGIMENT", "GROUPLEADER", "SUPPLIER"]) &&
        <ComButton className='bccwhite mb10 mr10' url='/pages_comm/icomm_download_list'>下载任务列表</ComButton>
      }
      {roo___has_role(selfInfo_S!, ["GROUPLEADER"]) && <>
        <IIISetTodaysOrder className="mr10"></IIISetTodaysOrder>
      </>
      }
    </View>
  </>;
};
const IIImmmREGIMENT = ({ ...props }: ViewProps) => {
  const selfInfo_S = useSTSelf(e => e.selfInfo);

  if (!Boolean(selfInfo_S?.deptInfo?.mobile)) {
    return <View className='dll'>
      <ComButton className='mb10 cccplh bccback'>
        部门缺失电话、地址信息，请补充
      </ComButton>
      <ComButton className='mb10 bccwhite cccgreen' url='/pages_user/sub_user_register'>去补充</ComButton>
    </View>;
  }
  return <>
    <View className='pr ww mb10 bccwhite IOO ovh'>
      <View className=' hh ww pa drc pr15' style={{ top: "0rem" }}>
        <ComImage compress className='bcctrans' icon style={{ width: "20vw", height: "20vw" }} mode='aspectFit' src='https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/express.png' />
      </View>
      <View className='pt10 prl10  ww  dll ' >
        <ComButton ll className='mb10 cccplh' >团长/快递业务</ComButton>
        <View className='dy dwp'>
          <ComButton ll className='fwb mb10 mr10 bborder' url='/pages_comm/comm__product_express'>快递</ComButton>
        </View>
        <View className='dy dwp'>
          <ComButton ll className=' nw mb10 mr10 bborder' url={`/pages_regiment/regiment_orders_express?order_ST=${Order_ST.待付款}`}>待付款 </ComButton>
          <ComButton ll className=' nw mb10 mr10 bborder' url={`/pages_regiment/regiment_orders_express?order_ST=${Order_ST.已付款}`}>已付款 </ComButton>
          <ComButton ll className=' nw mb10 mr10 bborder' url={`/pages_regiment/regiment_orders_express?order_ST=${Order_ST.已退款}`}>已退款 </ComButton>
        </View>
        <IIIShareInviteCard selfInfo_S={selfInfo_S!} />
      </View>
    </View>

    <View className='pr ww mb10 bccwhite IOO ovh'>
      <View className=' hh ww pa drc' style={{ top: "0rem" }}>
        <ComImage compress className='bcctrans' style={{ width: "25vw", height: "15vw" }} icon mode='aspectFit' src='https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/dryclean.png' />
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
        <ComImage compress className='bcctrans' style={{ width: "30vw", height: "15vw" }} mode='aspectFit' src='https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/shaoping_bag.png' />
      </View>
      <View className='pt10 prl10  ww  dll ' >
        <ComButton ll className='mb10 cccplh '>团长/团购业务/订单</ComButton>
        <View className='dy dwp'>
          <ComButton ll className=' nw mb10 mr10 bborder' url={`/pages_comm/icomm_orders_groupbuying?order_ST=${Order_ST.已付款}`}>已付款 </ComButton>
          <ComButton ll className=' nw mb10 mr10 bborder' url={`/pages_comm/icomm_orders_groupbuying?order_ST=${Order_ST.已退款}`}>已退款 </ComButton>
        </View>
      </View>
    </View>
    {getMyEnv().platform === "devtools" &&
      <View className='pr ww mb10 bccwhite IOO ovh'>
        <View className=' hh ww pa drc pr17' style={{ top: "0rem" }}>
          <ComImage compress className='bcctrans' style={{ width: "20vw", height: "15vw" }} mode='aspectFit' src='https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/helps.png' />
        </View>
        <View className='pt10 prl10 ww dll'>
          <ComButton ll className='mb10 cccplh'>团长/帮忙业务</ComButton>
          <View className='dy dwp'>
            <ComButton ll className='mb10 dy bborder fwb' onClick={async () => {
              await try_Taro_navigateToMiniProgram({
                appId: process.env.TARO_APP_CLIENT,
                path: `/pages_regiment/regiment_assist?${coo___objToUrl({ deptId: selfInfo_S!.OPENID })}`,
                noRelaunchIfPathUnchanged: false,
              });
            }}>
              帮忙
            </ComButton>
          </View>
        </View>
      </View>
    }
  </>;
};
const IIImmmSUPPLIER = ({ ...props }: ViewProps) => {
  return <>
    <ComButton className='mb10 cccplh bccback'>供应商</ComButton>
    <ComButton className='bccwhite nw mb10 mr10' url='/pages_comm/icomm_orders_dryclean'>干洗订单</ComButton>
    <ComButton className='bccwhite  fwb mb10 mr10' url='/pages_comm/comm__product_dryclean'>干洗商品</ComButton>
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
      <ComButton ll className='bborder mb10' url='/pages_comm/icomm_product_list'>商品列表</ComButton>
    </View>
  </>;
};
const IIImmmGUIDE = ({ ...props }: ViewProps) => {
  const selfInfo_S = useSTSelf(e => e.selfInfo);
  const [qrcode, setQrcode] = useState<string | null>(null);
  return <>
    <View className={`bccwhite ww dll mb10 pt10 prl10 IOO ${props.className}`}>
      <ComButton ll className='mb10 cccplh bccwhite mr10'>导游/带货</ComButton>
      <IIIShareInviteCard selfInfo_S={selfInfo_S!} />
      <View className='dy dwp'>
        <ComButton ll className='mb10 bborder nw mr10' onClick={async () => {
          Taro.showLoading({ mask: true, title: "生成中..." });
          const _src = await utils_get_qrcode({
            appid: process.env.TARO_APP_CLIENT,
            page: "pages/index/index",
            scene: coo___objToUrl({ R_D: Number(selfInfo_S!.mobile).toString(36), }),
          });
          Taro.hideLoading();
          setQrcode(_src);
        }}>推广二维码</ComButton>
      </View>

    </View>
    <View>
      {Boolean(qrcode) &&
        <ComPopupNew className=' ww' >
          <View className='ww dll prl10'>
            <ComNavBarB className='mb10 ww' onClose={() => { setQrcode(null); }}><ComButton className='fwb bccback'>二维码</ComButton></ComNavBarB>
            <ComImage className='mb10 scc' style={{ width: "calc(10 * var(--rem_base))" }} src={qrcode!} />
          </View>
        </ComPopupNew>
      }
    </View>
  </>;
};

const IIImmmGROUPLEADER = ({ ...props }: ViewProps) => {
  const selfInfo_S = useSTSelf(e => e.selfInfo);

  if (!Boolean(selfInfo_S?.deptInfo?.mobile)) {
    return <View className='dll'>
      <ComButton className='mb10 cccplh bccback'>
        部门缺失电话、地址信息，请补充
      </ComButton>
      <ComButton className='mb10 bccwhite cccgreen' url='/pages_user/sub_user_register'>去补充</ComButton>
    </View>;
  }
  return <>
    <View className={`bccwhite ww dll mb10 pt10 prl10 IOO ${props.className}`}>
      <ComButton ll className='mb10 cccplh bccwhite mr10'>团主/卖货</ComButton>
      <View className="dy ">
        <ComButton ll className='bborder mb10 mr10' url='/pages_comm/comm__publisher'>
          发布商品
        </ComButton>
        <ComButton ll className='bborder mb10 mr10' url='/pages_comm/icomm_product_list'>
          商品列表
        </ComButton>
      </View>
      <View className='dy dwp'>
        <ComButton ll className=' nw mb10 mr10 bborder' url={`/pages_comm/icomm_orders_groupbuying?order_ST=${Order_ST.已付款}`}>已付款 </ComButton>
        <ComButton ll className=' nw mb10 mr10 bborder' url={`/pages_comm/icomm_orders_groupbuying?order_ST=${Order_ST.已退款}`}>已退款 </ComButton>
      </View>
    </View>
  </>;
};


const IIISetTodaysOrder = ({ ...props }: ViewProps) => {
  const [date, setDate] = useState<string>(format(coo___ios_date(), "yyyy-MM-dd HH:mm:ss"));
  return <Picker
    header-text='请选择账单月份'
    value={date}
    end={format(coo___ios_date(), "yyyy-MM-dd HH:mm:ss")}
    mode='date'
    fields='day'
    onChange={async (e) => {
      Taro.showLoading({ mask: true, title: "下载中...", });
      const _date = `${e.detail.value}`;
      setDate(_date);
      const timeRes = utils_get_start_end_time(_date);
      await Api_order_export_ctn({
        startTime: timeRes.startTimeOfDay,
        endTime: timeRes.endTimeOfDay,
        // orderStatus: Order_ST.已付款,
      });
      Taro.hideLoading();
      if (await try_Taro_showModal({
        title: "提交成功",
        content: "请到下载任务列表查看对账单",
        confirmText: "去查看"
      })) {
        await try_Taro_navigateTo({ url: "/pages_comm/icomm_download_list" });
      }
    }}>
    <ComButton className='mb10'>下载今日订单</ComButton>
  </Picker>;
};