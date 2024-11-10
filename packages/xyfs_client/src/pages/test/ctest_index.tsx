// :: pages/test/ctest_index
import { View } from '@tarojs/components';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { FC, useState, useTransition } from 'react';

definePageConfig({
  navigationStyle: "custom", disableScroll: true,
  // "styleIsolation": "shared",
  // "componentFramework": "glass-easel",
  // "renderer": "skyline",
  "navigationBarTitleText": "测试页面"
});

export default function COMSELFWarp() { return <Index></Index>; };



const Index: FC<{}> = ({ }) => {
  const [show, setShow] = useState(false);
  const [isPending, startTransition] = useTransition();


  console.log(isPending);

  return <View className=' ww dxy' style={{ height: "100vh" }}>
    <View className='dcl'>
      <ComButton className='mb10'>111</ComButton>
      <ComButton className='' onClick={() => {
        setTimeout(() => {
          startTransition(() => {
            // ✅ 在调用 startTransition 中更新状态
            setShow(true);
          });
        }, 3000);
      }}>222</ComButton>
    </View>
  </View>;
};




