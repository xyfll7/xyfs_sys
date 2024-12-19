// :: pages/test/ctest_index
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Api_common_jtsd, Api_user_print_ctn } from "@xyfs/taro_uii/api/api__users";
import { ComButton } from "@xyfs/taro_uii/components/ComButton";
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
        id: "309",
        waybillPrinterData: [
          `SIZE 72 mm, 127 mm`,
          `CODEPAGE 437`, // 该指令用于选择对应的国际代码页  437:UnitedStates
          `DENSITY 8`, // 该指令用于控制打印时的浓度
          `CLS`, // 该指令用于清除图像缓冲区（image buffer)的数据
          `CODEPAGE 936`, // 该指令用于选择对应的国际代码页  936:Chinese
          `DIRECTION  0`, // 该指令用于定义打印时出纸和打印字体的方向
          `TEXT 206,12,"0",0,1,1,"验证码 啊哈哈哈"`,
          `PRINT 1,1` //该指令用于打印出存储于影像缓冲区内的数据
        ].join("\r\n")
      });
    }}>打印猿打印测试</ComButton>
  </View>;
};




