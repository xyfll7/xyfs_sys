// :: pages_user/sub_user_register
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { DeptInfo } from "@xyfs/taro_uii";
import { Api_getNumber_ctn, Api_user_edit_ctn } from '@xyfs/taro_uii/api/api__users';
import { ComButton, ComButtonOpen } from '@xyfs/taro_uii/components/ComButton';
import { ComInput } from "@xyfs/taro_uii/components/ComInput";
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { useHook_Reducer } from "@xyfs/taro_uii/utils/useHooks";
import { FC } from "react";

definePageConfig({ disableScroll: true, navigationStyle: "custom", });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC = () => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const [userForm, setUserForm] = useHook_Reducer<DeptInfo>(selfInfo_S!);
  return <MMMAAPage isNeedAnyRole={false} isNeedAnyDept={false}>
    <ComNav>
      <ComNavBarA className='mb10 pl10'>
        <ComButton ll className='bcctrans cccplh ml10' >
          {selfInfo_S.deptId ? '我' : '报名团长'}
        </ComButton>
      </ComNavBarA>
    </ComNav>
    {selfInfo_S.deptId &&
      <ComScrollView>
        <>
          <ComButton ll className='bccback mb10 prl10'>我的信息</ComButton>
          <View className='ioo bccwhite pt10 dll mb10 prl10 ww'>
            <View className='ww mb10 dy' >
              <ComButton ll className='w5rem bccwhite'>姓名</ComButton>
              <ComButton ll className='flx1 cccplh bccback'>
                <ComInput type='nickname' value={userForm.name}
                  onInput={(e) => { setUserForm({ name: e.detail.value }); }}
                  onNickNameReview={async (e) => {
                    if (e.detail.pass) {
                      Taro.showLoading({ mask: true, title: "更新姓名..." });
                      const res_userInfo = await Api_user_edit_ctn({ name: userForm.name });
                      setUserForm(res_userInfo);
                      Taro.hideLoading();
                      Taro.showToast({ icon: "none", title: "更新完成", });
                    } else {
                      throw new Error("姓名不合法");
                    }
                  }}
                  placeholder='请输入名称'></ComInput>
              </ComButton>
            </View>

            <View className='dy ww mb10'>
              <ComButton ll className='w5rem bccwhite'>手机号</ComButton>
              <ComButtonOpen ll className='cccplh dy bccback ww ' id='getPhoneNumber' openType='getPhoneNumber' onClick={() => {
                Taro.showLoading({ mask: true, title: "获取手机号..." });
              }} onGetPhoneNumber={async (e) => {
                Taro.showLoading({ mask: true, title: "获取手机号..." });
                const { code, iv, encryptedData, errMsg } = e.detail;
                if (code && errMsg === "getPhoneNumber:ok") {
                  const res = await Api_getNumber_ctn({ code, iv, encryptedData, });
                  Taro.showLoading({ mask: true, title: "更新手机号..." });
                  const res_userInfo = await Api_user_edit_ctn({
                    mobile: res,
                  });
                  setUserForm(res_userInfo);
                  Taro.hideLoading();
                  Taro.showToast({ icon: "none", title: "更新完成", });
                } else if (errMsg === "getPhoneNumber:fail user deny") {
                  Taro.hideLoading();
                  Taro.showToast({ icon: "none", title: "请授权手机号", });
                } else if (errMsg === "privacy permission is not authorized") {
                  Taro.hideLoading();
                  Taro.showToast({ icon: "none", title: "隐私未授权", });
                }
              }}>{userForm.mobile ? userForm.mobile : "请授权手机号"}</ComButtonOpen>
            </View>
          </View>
          {selfInfo_S.deptId && <>
            <ComButton ll className='bccback mb10 prl10'>部门信息</ComButton>
            <View className='ioo bccwhite pt10 dll mb10 prl10 ww'>
              <View className='ww mb10 dy' >
                <ComButton ll className='w5rem bccwhite nw'>当前部门</ComButton>
                <ComButton ll className='flx1 cccplh bccback'>{selfInfo_S.deptName}</ComButton>
              </View>
              <View className='ww mb10 dy' >
                <ComButton ll className='w5rem bccwhite nw'>部门电话</ComButton>
                <ComButton ll className='flx1 cccplh bccback'>{selfInfo_S.deptInfo?.mobile}</ComButton>
              </View>
              <View className='ww mb10 dy' >
                <ComButton ll className='w5rem bccwhite nw'>所属部门</ComButton>
                <ComButton ll className='flx1 cccplh bccback'>{selfInfo_S.deptName}</ComButton>
              </View>
              <View className='ww mb10 dy' >
                <ComButton ll className='w5rem bccwhite nw'>部门权限</ComButton>
                <ComButton ll className='flx1 cccplh bccback'>{selfInfo_S.roles?.map(e => e.roleName).join('/')}</ComButton>
              </View>
              <View className='ww mb10 dy' >
                <ComButton ll className='w5rem bccwhite nw'>价格方案</ComButton>
                <ComButton ll className='flx1 cccplh bccback'>{selfInfo_S.logisticPriceScheme?.name}</ComButton>
              </View>
              <View className='ww mb10 dy' >
                <ComButton ll className='w5rem bccwhite nw'>授权快递</ComButton>
                <ComButton ll className='flx1 cccplh bccback'>{selfInfo_S.logistics?.map(e => e.deliveryName).join('/')}</ComButton>
              </View>
            </View>
          </>
          }
          {selfInfo_S.parentDeptInfo &&
            <>
              <ComButton ll className='bccback mb10 prl10'>上级部门信息</ComButton>
              <View className='ioo bccwhite pt10 dll mb10 prl10 ww'>
                <View className='ww mb10 dy' >
                  <ComButton ll className='w5rem bccwhite nw'>部门名称</ComButton>
                  <ComButton ll className='flx1 cccplh bccback'>{selfInfo_S.parentDeptInfo.deptName}</ComButton>
                </View>
                <View className='ww mb10 dy' >
                  <ComButton ll className='w5rem bccwhite nw'>部门电话</ComButton>
                  <ComButton ll className='flx1 cccplh bccback'>{selfInfo_S.parentDeptInfo.mobile}</ComButton>
                </View>
              </View>
            </>
          }
        </>
      </ComScrollView>
    }
    {!selfInfo_S.deptId &&
      <IIIJoinUs></IIIJoinUs>
    }
  </MMMAAPage>;
};

const IIIJoinUs = () => {
  const [userForm, setUserForm] = useHook_Reducer<DeptInfo>({ name: "", mobile: "" } as DeptInfo);
  return <>
    <ComScrollView>
      <View className='ioo bccwhite pt10 dll mb10 prl10 ww '>
        <View className='ww mb10 dy' >
          <ComButton ll className='w5rem bccwhite'>姓名</ComButton>
          <ComButton ll className='flx1 cccplh bccback'>
            <ComInput type='nickname' value={userForm.name} onInput={(e) => setUserForm({ name: e.detail.value })} placeholder='请输入名称'></ComInput>
          </ComButton>
        </View>
        <View className='dy ww mb10'>
          <ComButton ll className='w5rem bccwhite'>手机号</ComButton>
          <ComButtonOpen ll className='cccplh dy bccback ww ' id='getPhoneNumber' openType='getPhoneNumber' onClick={() => {
            Taro.showLoading({ mask: true, title: "获取手机号..." });
          }} onGetPhoneNumber={async (e) => {
            Taro.showLoading({ mask: true, title: "获取手机号..." });
            const { code, iv, encryptedData, errMsg } = e.detail;
            if (code && errMsg === "getPhoneNumber:ok") {
              const res = await Api_getNumber_ctn({ code, iv, encryptedData, });
              setUserForm({ mobile: res });
              Taro.hideLoading();
            } else if (errMsg === "getPhoneNumber:fail user deny") {
              Taro.hideLoading();
              Taro.showToast({ icon: "none", title: "请授权手机号", });
            } else if (errMsg === "privacy permission is not authorized") {
              Taro.hideLoading();
              Taro.showToast({ icon: "none", title: "隐私未授权", });
            }
          }}>{userForm.mobile ? userForm.mobile : "请授权手机号"}</ComButtonOpen>
        </View>
      </View>
    </ComScrollView>

    <View className='dxy ww prl20'>
      <ComButton className='bccgreen cccwhite mb10 IOO fwb ww dxy' onClick={async () => {
        if (!userForm.name) { Taro.showToast({ icon: "none", title: "请输入姓名", }); return; }
        if (!userForm.mobile) { Taro.showToast({ icon: "none", title: "请授权手机号", }); return; }
        Taro.showLoading({ mask: true, title: "提交中...", });
        const res_userInfo = await Api_user_edit_ctn({
          name: userForm.name,
          mobile: userForm.mobile,
        });
        useSTSelf.getState().sett({ ...res_userInfo });
        Taro.showToast({ icon: "none", title: "提交成功", });
      }}>
        立即报名成为团长
      </ComButton>
    </View>
  </>;
}




