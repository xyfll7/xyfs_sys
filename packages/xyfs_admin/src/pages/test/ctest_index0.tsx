// :: pages/test/ctest_index0
import { View } from '@tarojs/components';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { FC } from 'react';

definePageConfig({
  navigationStyle: "custom", disableScroll: true,
  // "styleIsolation": "shared",
  // "componentFramework": "glass-easel",
  // "renderer": "skyline",
});

export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC<{}> = ({ }) => {

  return <MMMAAPage>
    <ComNav>
      <View className='ww dll pl10'>

      </View>
    </ComNav>
    <View></View>
    <View>


    </View>
  </MMMAAPage>;
};


