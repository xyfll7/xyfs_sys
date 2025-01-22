// :: pages_user/user_my
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Pagination } from "@xyfs/taro_uii";
import { Api_assist_list_ctn } from "@xyfs/taro_uii/api/api__assist";
import { Api_getNumber_ctn, Api_user_edit_ctn } from "@xyfs/taro_uii/api/api__users";
import CPRegimentAssist from "@xyfs/taro_uii/compages/CPRegimentAssist";
import { ComButton, ComButtonOpen } from "@xyfs/taro_uii/components/ComButton";
import { ComImage } from "@xyfs/taro_uii/components/ComImage";
import { ComInput } from "@xyfs/taro_uii/components/ComInput";
import { ComLoading } from "@xyfs/taro_uii/components/ComLoading";
import { ComNav } from "@xyfs/taro_uii/components/ComNav";
import { ComNavBarA } from "@xyfs/taro_uii/components/ComNavBarA";
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from "@xyfs/taro_uii/components/MMMAAPage";
import { useSTSelf } from "@xyfs/taro_uii/store/store";
import { try_Taro_cloud_uploadFile } from "@xyfs/taro_uii/utils/try_catch";
import { useHook_pageListNew } from "@xyfs/taro_uii/utils/useHooks";
import { FC, useCallback } from "react";

definePageConfig({ enableShareAppMessage: true, navigationStyle: "custom", disableScroll: true, });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC<{}> = ({ }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  return <MMMAAPage>
    <ComNav isRight>
      <View className='dy mb10'>
        <ComNavBarA className='pl10' />
        {selfInfo_S?.avatar &&
          <ComImage className='ml10 ' src={selfInfo_S?.avatar} />}
        <ComButton ll className='ml10 dbtc bcctrans' url={selfInfo_S.parentDeptId ? '/pages_user/sub_user_register' : undefined}>
          <View className='nw1 ww wm5rem cccplh'>{selfInfo_S.name}</View>
          <View className='cccgreen ml10 nw'>修改1</View>
        </ComButton>
      </View>
    </ComNav>
    <ComScrollView>
      {/* <IIISelfInfo /> */}
      <IIIMainNavigator className='mb10' />
      <View><ComButton className='mb10 bccwhite' url='/pages_comm/comm__realName'>实名登记</ComButton></View>
      <IIIMyAssistList />
    </ComScrollView>
  </MMMAAPage>;

};



const IIISelfInfo: FC<{ className?: string; }> = ({ className = '' }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  return <View className={`${className} ww ds`}>
    {selfInfo_S?.mobile ?
      <>
        <ComButton className='cccplh mb10'>
          {selfInfo_S.mobile}
        </ComButton>
      </> :
      <View className='dy'>
        <ComButtonOpen ll rr className='cccplh mb10' openType='chooseAvatar' onChooseAvatar={async (e) => {
          Taro.showLoading({ mask: true, title: "上传中..." });
          const res1 = await try_Taro_cloud_uploadFile(e.detail.avatarUrl, `comm_avatar/${selfInfo_S?.OPENID}_regiment_avatar`);
          const res_userInfo = await Api_user_edit_ctn({ avatar: res1.fileID });
          useSTSelf.getState().sett(res_userInfo);
          Taro.showToast({ icon: "none", title: "上传成功", });
        }}>
          <ComImage src={selfInfo_S?.avatar ?? ""} />
        </ComButtonOpen>
        <View className='mrl10 mb10'>→</View>
        <ComButton className='mb10' onClick={async () => {
          if (!selfInfo_S?.avatar) { throw new Error("请先上传头像"); }
        }}>
          <ComInput className='wm7rem' type='nickname' disabled={!selfInfo_S?.avatar} onBlur={(e) => {
            if (!e.detail.value) { return; }
            Taro.showLoading({ mask: true, title: "更新昵称..." });
            (async (name: string) => {
              const res_userInfo = await Api_user_edit_ctn({ name: name });
              useSTSelf.getState().sett(res_userInfo);
              Taro.hideLoading();
            })(e.detail.value);
          }} placeholder={selfInfo_S?.name ? selfInfo_S?.name : '请填写昵称'} />
        </ComButton>
        <View className='mrl10 mb10'>→</View>

        <ComButtonOpen className='mb10' id='getPhoneNumber' openType={selfInfo_S?.name ? 'getPhoneNumber' : undefined} onClick={async () => {
          if (!selfInfo_S?.name) { throw new Error("请先填写昵称"); }
        }} onGetPhoneNumber={async (e) => {
          Taro.showLoading({ mask: true, title: "获取手机号..." });
          const { code, iv, encryptedData, errMsg } = e.detail;
          if (code && errMsg === "getPhoneNumber:ok") {
            const res0 = await Api_getNumber_ctn({ code, iv, encryptedData, });
            const res_userInfo = await Api_user_edit_ctn({ mobile: res0, });
            useSTSelf.getState().sett(res_userInfo);
          } else if (errMsg === "getPhoneNumber:fail user deny") {
            Taro.showToast({ icon: "none", title: "授权失败，请重试", });
          }
          Taro.hideLoading();
        }}>授权手机号</ComButtonOpen>
      </View>
    }
  </View>;
};

const IIIMainNavigator: FC<{ className?: string, }> = ({ className }) => {
  return <View className={`${className} ds `}>
    {[

      { label: '我的订单', url: "/pages_user/user_orders", show: true }].filter(e => e.show).map(e => {
        return <ComButton key={e.label}
          className='mr10 bccwhite fwb'
          url={e.url}>
          {e.label}
        </ComButton>;
      })}
  </View>;
};

const IIIMyAssistList: FC = () => {

  const ___page_getter = useCallback(async (p: Pagination<unknown>) =>
    await Api_assist_list_ctn({
      ...p,
      keyword: "",
    }), []);
  const { page, page_loading, page_list_get, } = useHook_pageListNew(___page_getter,);
  return (
    <View className='dll ww'>
      {page.list?.map((e) => {
        return <View className='mb10 dll ovh ioo bccwhite pt10 ww prl10' key={e.id}>
          <CPRegimentAssist.PublishCard className='' data={e} />
        </View>;
      })}
      <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)}></ComLoading>
    </View>
  );
};
