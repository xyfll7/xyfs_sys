// :: pages/test/ctest_index
import { View } from '@tarojs/components';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { FC } from 'react';

definePageConfig({
  navigationStyle: "custom", disableScroll: true,
  // "styleIsolation": "shared",
  // "componentFramework": "glass-easel",
  // "renderer": "skyline",
  "navigationBarTitleText": "测试页面",
  usingComponents: {
    'store-product-item': '../../components/store-product-item/store-product-item',
  }
});

export default function COMSELFWarp() { return <Index></Index>; };



const Index: FC<{}> = ({ }) => {
  return <View className=' ww dxy' style={{ height: "100vh" }}>
    <View className='dcl'>
      <ComButton className='mb10'>111</ComButton>
      <ComButton className='' onClick={() => {

      }}>222323xxxvvv</ComButton>
      {/*@ts-ignore*/}
      <store-product-item />
    </View>
  </View>;
};




