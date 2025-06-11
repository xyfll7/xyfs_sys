// :: pages/test/ctest_index
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from '@xyfs/taro_uii/components/ComScrollView';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { try_Taro_hideLoading } from '@xyfs/taro_uii/utils/try_catch';
import { FC } from 'react';

definePageConfig({
  enableShareAppMessage: true, navigationStyle: "custom", disableScroll: true,
  // "styleIsolation": "apply-shared",
  // "componentFramework": "glass-easel",
  // "renderer": "skyline",
});
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC = () => {


  return <MMMAAPage >
    <ComNav>
      <ComNavBarA className='mb10 pl10'>
        <ComButton ll className='bcctrans cccplh ml10' >test page</ComButton>
      </ComNavBarA>
    </ComNav>
    <ComScrollView >
      <ComButton className='mb10' onClick={async () => {
        try_Taro_hideLoading();
      }}>测试hideLoading报错</ComButton>
    </ComScrollView>
  </MMMAAPage >;
};

