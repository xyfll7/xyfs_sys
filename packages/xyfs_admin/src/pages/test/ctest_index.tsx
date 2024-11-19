// :: pages/test/ctest_index
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Api_common_jtsd } from "@xyfs/taro_uii/api/api__users";
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
  return <View>
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
  </View>;
};




