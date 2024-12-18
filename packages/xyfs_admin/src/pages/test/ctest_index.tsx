// :: pages/test/ctest_index
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Api_common_jtsd, Api_user_print_ctn } from "@xyfs/taro_uii/api/api__users";
import { ComButton } from "@xyfs/taro_uii/components/ComButton";
import GBK from "@xyfs/utils/gbk";
import { FC } from "react";

definePageConfig({
  navigationStyle: "custom", enableShareAppMessage: true, disableScroll: true,
  // "styleIsolation": "apply-shared",
  // "componentFramework": "glass-easel",
  // "renderer": "skyline",
  usingComponents: {
    "image-cropper": "plugin://xyfsPlugin/image-cropper"
  }
});



export default function COMSELFWarp() { return <Index></Index>; };
const Index: FC<{}> = ({ }) => {
  return <View className='dcl'>
    <View className='h20rem dxy'>
      <ComButton onClick={async () => {
        Taro.showLoading({ title: "切换中..." });
        const res = await Api_common_jtsd({ expressType: 1 });
        Taro.showToast({ icon: "none", title: "切换成功" });
      }}>
        极兔-标准快递
      </ComButton>
      <ComButton onClick={async () => {
        Taro.showLoading({ title: "切换中..." });
        const res = await Api_common_jtsd({ expressType: 2 });
        Taro.showToast({ icon: "none", title: "切换成功" });
      }}>
        极兔-兔优达
      </ComButton>
    </View>
    <ComButton className='' onClick={async () => {
      await Api_user_print_ctn({
        id: "863130068480947", waybillPrinterData:
          GBK.encode(`SIZE 72 mm, 127 mm
CODEPAGE 437
DENSITY 8
CLS
CODEPAGE 936
DIRECTION  0
TEXT 206,12,"0",0,1,1,"验证码 {&captcha}"
PRINT 1,1`).toString()
      });
    }}>测试</ComButton>
  </View>;
};




