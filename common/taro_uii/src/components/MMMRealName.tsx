


import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";

import { coo___ios_date } from "@xyfs/utils/util";
import { FC, useState } from "react";
import { AddressInfo, DeptInfo } from "../../types/type_user";
import { Api_common_idCardOCR_ctn, Api_user_realNameAuth_ctn } from "../api/api__users";
import { roo___has_role } from "../roles";
import { useSTExpress, useSTSelf } from "../store/store";
import { try_Taro_chooseMedia, try_Taro_cloud_uploadFile } from "../utils/try_catch";
import { utils_validate_realName } from "../utils/validator";
import { ComButton } from "./ComButton";
import { ComInput } from "./ComInput";

export const MMMRealName: FC<{ onClose?: () => void; address?: AddressInfo | null; }> = ({ onClose, address }) => {

  const ___selfInfo = useSTSelf.getState().selfInfo;

  const [form, setForm] = useState<Partial<DeptInfo>>({
    realName: (___selfInfo?.realName && roo___has_role(___selfInfo, ["USER"])) ? ___selfInfo?.realName ?? "" : "",
    realId: (___selfInfo?.realId && roo___has_role(___selfInfo, ["USER"])) ? ___selfInfo?.realId ?? "" : "",
    mobile: address?.mobile ?? "" // 如果有mobile 就是团长给用户实名
  });

  return <View>
    <>
      <View className='prl10 pt10 mb10 bccwhite ioo  ww dll'>
        <View className='dy mb10 ww'>
          <View className='w5rem'>姓名</View>
          <ComButton className='ww dy bccback ' hoverClass='none'>
            <ComInput placeholder='请输入姓名' value={form.realName} onInput={(e) => setForm({ ...form, realName: e.detail.value })} />
          </ComButton>
        </View>
        <View className='dy mb10 ww'>
          <View className='w5rem'>证件号</View>
          <ComButton className='ww dy bccback' hoverClass='none'>
            <ComInput type='idcard' placeholder='请输入证件号码' value={form.realId} onInput={(e) => setForm({ ...form, realId: e.detail.value })} />
          </ComButton>
          <ComButton rr className='ml10 cccgreen bborder nw'
            onClick={async () => {
              const [res_file] = await try_Taro_chooseMedia({ count: 1, sourceType: ["album", "camera"] });
              Taro.showLoading({ mask: true, title: "上传中..." });
              const res = await try_Taro_cloud_uploadFile(res_file?.tempFilePath ?? "", `id_cards/${___selfInfo?.OPENID}_${coo___ios_date().getTime()}_idcard`);
              Taro.showLoading({ mask: true, title: "识别中..." });
              const res_realInfo = await Api_common_idCardOCR_ctn({ imgUrl: res.fileID });
              Taro.showLoading({ mask: true, title: "实名中..." });
              await Api_user_realNameAuth_ctn({ type: 2, idcard: res_realInfo.id, name: res_realInfo.name, mobile: form.mobile!, idCardUrl: res.fileID });
              setForm({ realName: res_realInfo.name, realId: res_realInfo.id });

              if (!___selfInfo?.realId && roo___has_role(___selfInfo, ["USER"])) {
                await Api_user_realNameAuth_ctn({ type: 1, idcard: res_realInfo.id, name: res_realInfo.name, idCardUrl: res.fileID });
              }


              if (address) {
                useSTExpress.getState().sett({ productList: [{ sendMan: { realId: res_realInfo.id, realName: res_realInfo.name } }] });
                onClose?.();
              }
              Taro.showToast({ icon: "none", title: "实名成功" });
            }} >拍照</ComButton>
        </View>
      </View>
      <View className='prl10 cccprice'>当前仅支持中国内地居民身份证线上实名认证</View>
      <View className='prl10 cccprice mb10'>请确认身份证信息无误后再提交认证</View>
      <View className='dr ww'>
        <ComButton className='mb10 bccyellow' onClick={async () => {
          Taro.showLoading({ mask: true, title: "实名提交中..." });
          const _form = await utils_validate_realName(form);
          await Api_user_realNameAuth_ctn({ type: 2, idcard: _form.realId!, name: _form.realName!, mobile: _form.mobile! });
          await useSTSelf.getState().sett();
          if (address) {
            useSTExpress.getState().sett({ productList: [{ sendMan: { realId: _form.realId, realName: _form.realName } }] });
            onClose?.();
          }
          Taro.showToast({ icon: "none", title: "实名成功", });
        }}>提交</ComButton>
      </View>
    </>
    <View className='prl10 pbt6 mb10 ioo cccplh'>
      <View>亲爱的用户:</View>
      <View style='text-indent: 2em;'>根据国家邮政局《寄件渠道“三个100%”》的要求，请您配合完成实名登记。若不登记，也可在我司业务员上门揽件时，配合出示身份证，谢谢您的配合！</View>
      <View style='text-indent: 2em;'>根据国家法律规定，您已知晓我们收集您的个人身份证信息。</View>
    </View>
  </View>;
};


