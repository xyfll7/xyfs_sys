// :: pages_user/sub_user_register
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { BaseUserInfo } from "@xyfs/taro_uii";
import { Api_getNumber_ctn, Api_user_edit_ctn } from '@xyfs/taro_uii/api/api__users';
import { ComButton, ComButtonOpen } from '@xyfs/taro_uii/components/ComButton';
import { ComImage } from '@xyfs/taro_uii/components/ComImage';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { roo___has_role } from "@xyfs/taro_uii/src/roles";
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { Taro_getCurrentInstance, try_Taro_chooseAddress, try_Taro_chooseLocation, try_Taro_cloud_uploadFile } from '@xyfs/taro_uii/utils/try_catch';
import { useHook_userInfo } from '@xyfs/taro_uii/utils/useHooks';
import { utils_addressInfoToString } from "@xyfs/taro_uii/utils/util";
import { utils_validate_register } from '@xyfs/taro_uii/utils/validator';
import { FC, useState } from "react";

definePageConfig({ disableScroll: true, navigationStyle: "custom", });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC = () => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const { options } = Taro_getCurrentInstance<{ parentDeptId?: string; }>();
  const parentInfo = useHook_userInfo(selfInfo_S?.parentDeptId ?? options.parentDeptId ?? "");
  return <MMMAAPage isNeedAnyRole={false} isNeedAnyDept={false}>
    <ComNav>
      <ComNavBarA className='mb10 pl10'>
        <ComButton ll className='bcctrans cccplh ml10' >
          {roo___has_role(selfInfo_S, ["REGIMENT"]) ? '用户信息' : '注册用户'}
        </ComButton>
      </ComNavBarA>
    </ComNav>
    <ComScrollView>
      {parentInfo && selfInfo_S &&
        <IIIRegister></IIIRegister>
      }
      {parentInfo && selfInfo_S?.registStatus === 1 &&
        <ComButton className='mb10 cccplh bccback cccprice' hoverClass='none'> <View>您的注册申请已经提交，请耐心等待管理员审核，有任何问题请联系管理员</View> </ComButton>
      }
      {parentInfo === null && <ComLoading className='mb10'></ComLoading>}
      {parentInfo && <View className='mb10 pl10 cccplh bccback' >
        <View>
          <View>上级姓名：{parentInfo.name}</View>
          <View className='dy'>联系电话：<View className='cccgreen' onClick={() => {
            parentInfo.mobile && Taro.makePhoneCall({ phoneNumber: parentInfo.mobile! });
          }}>{parentInfo.mobile}</View> </View>
          <View>联系地址：{utils_addressInfoToString(parentInfo)}</View>
        </View>
      </View>
      }
    </ComScrollView>
  </MMMAAPage>;
};

const IIIRegister: FC<{}> = ({ }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const [userForm, setUserForm] = useState<BaseUserInfo>({
    ...selfInfo_S!,
  });
  console.log("userForm", userForm);
  return (
    <>

      <View className='ioo bccwhite pt10 dll mb10 prl10 ww'>
        <View className='ww mb10 dy'>
          <View className='w4rem'><ComImage src={userForm?.avatar ?? ""} /></View>
          <ComButtonOpen ll className='cccplh bccback' openType='chooseAvatar' onChooseAvatar={async (e) => {
            Taro.showLoading({ mask: true, title: "上传中..." });
            const res1 = await try_Taro_cloud_uploadFile(e.detail.avatarUrl, `comm_avatar/${selfInfo_S?.OPENID}_regiment_avatar`);
            const res_userInfo = await Api_user_edit_ctn({ avatar: res1.fileID });
            setUserForm(res_userInfo);
            Taro.showToast({ icon: "none", title: "上传成功", });
          }}>更换头像</ComButtonOpen>
        </View>
        <View className='ww mb10 dy' >
          <ComButton ll className='w4rem bccwhite'>名称</ComButton>
          <ComButton ll className='flx1 cccplh bccback' onClick={async () => {
            const res_address = await try_Taro_chooseAddress();
            setUserForm({
              ...userForm,
              ...res_address,
              // mobile: undefined,
              mobile: "",
            });
          }} >{userForm.name ?? '请输入名称'}</ComButton>
        </View>
        <View className='ww mb10 dy' >
          <ComButton ll className='w4rem bccwhite'>地址</ComButton>
          <ComButton className='ww cccplh bccback' ll >
            {userForm.address ? utils_addressInfoToString(userForm) : "请填写详细地址信息"}
          </ComButton>
        </View>
        <View className='ww mb10 dy'>
          <ComButton ll className='w4rem bccwhite'>坐标</ComButton>
          <ComButton className='cccgreen bccback ww' ll onClick={async () => {
            const res = await try_Taro_chooseLocation();
            setUserForm((ee): BaseUserInfo => ({
              ...ee,
              locationName: `${res.address}-${res.name}`,
              longitude: res.longitude,
              latitude: res.latitude,
            }));
          }}>
            <View className='flx1 dll'>
              <View className='cccplh dll ww'>{userForm.longitude ? `${userForm.longitude.toFixed(3)},${userForm.latitude.toFixed(3)}` : '请选择坐标位置'}</View>
              <View className='fs08 cccplh  nw2 '>{userForm.locationName}</View>
            </View>
          </ComButton>
        </View>
        <View className='dy ww mb10'>
          <ComButton ll className='w4rem bccwhite'>手机号</ComButton>
          <ComButtonOpen ll className='cccplh dy bccback ww' id='getPhoneNumber' openType='getPhoneNumber' onClick={() => {
            Taro.showLoading({ mask: true, title: "获取手机号..." });
          }} onGetPhoneNumber={async (e) => {
            console.log("获取手机号：", e);
            Taro.showLoading({ mask: true, title: "获取手机号..." });
            const { code, iv, encryptedData, errMsg } = e.detail;
            if (code && errMsg === "getPhoneNumber:ok") {
              const res = await Api_getNumber_ctn({ code, iv, encryptedData, });
              setUserForm((ee): BaseUserInfo => ({ ...ee, mobile: res }));
              Taro.hideLoading();
            } else if (errMsg === "getPhoneNumber:fail user deny") {
              Taro.hideLoading();
              Taro.showToast({ icon: "none", title: "请授权手机号", });
            } else if (errMsg === "privacy permission is not authorized") {
              Taro.hideLoading();
              Taro.showToast({ icon: "none", title: "隐私未授权", });
            }
          }}> {userForm.mobile ? userForm.mobile : "请授权手机号"}</ComButtonOpen>
        </View>
        <View className='dy mb10'>
          <ComButton ll className='nw w4rem bccwhite'>角色</ComButton>
          <View className='ds'>
            {selfInfo_S?.roles?.map((e, i) => `${e.roleName}`).join("/")}
          </View>
        </View>
      </View>
      <View className='dr ww'>
        <ComButton className='bccgreen cccwhite mb10'
          onClick={async () => {
            await utils_validate_register(userForm);
            Taro.showLoading({ mask: true, title: "提交中...", });
            const { options } = Taro_getCurrentInstance<{ parentDeptId?: string; }>();
            const res_userInfo = await Api_user_edit_ctn({
              ...userForm,
              registStatus: !selfInfo_S?.registStatus ? 1 : selfInfo_S?.registStatus,
              parentDeptId: selfInfo_S?.parentDeptId ? selfInfo_S?.parentDeptId : options.parentDeptId,
            });
            useSTSelf.getState().sett(res_userInfo);
            Taro.showToast({ icon: "none", title: "提交成功", });
          }}>
          {!selfInfo_S?.registStatus ? '提交申请' : '确认修改'}
        </ComButton>
      </View>
    </>
  );
};



