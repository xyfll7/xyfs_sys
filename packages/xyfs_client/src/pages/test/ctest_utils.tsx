// :: pages/test/ctest_utils
import { CTestUtils } from '@xyfs/taro_uii/compages/CTestUtils';
import { ComSELFView } from '@xyfs/taro_uii/components/MMMAAPage';
import { FC } from 'react';


definePageConfig({ navigationStyle: "custom", enableShareAppMessage: true, disableScroll: true });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC<{}> = ({ }) => {

  return <CTestUtils></CTestUtils>;
};



