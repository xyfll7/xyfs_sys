import { FC } from "react";
import { ComButton } from "../components/ComButton";
import { ComNav } from "../components/ComNav";
import { ComNavBarA } from "../components/ComNavBarA";
import { ComScrollView } from "../components/ComScrollView";
import { MMMAAPage } from "../components/MMMAAPage";
import { try_Taro_scanCode } from "../utils/try_catch";

const CTestUtils: FC = () => {
  return <MMMAAPage>
    <ComNav>
      <ComNavBarA className='mb10 pl10'>
        <ComButton ll className='bcctrans cccplh ml10' >小工具</ComButton>
      </ComNavBarA>
    </ComNav>
    <ComScrollView >
      <ViewQRCode className='mb10'></ViewQRCode>

    </ComScrollView>
  </MMMAAPage>;
};
export { CTestUtils };

// 查看小程序二维码
const ViewQRCode: FC<{ className?: string; }> = ({ className }) => {
  return <ComButton className={className} onClick={async () => {
    const res = await try_Taro_scanCode();
    console.info("查看小程序二维码：", res);
  }}>查看小程序二维码</ComButton>;
};


