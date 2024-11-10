// :: pages/test/ctest_index
import { View } from "@tarojs/components";
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
      <ComButton onClick={async () => { }}>
        测试
      </ComButton>
    </View>
  </View>;
};




