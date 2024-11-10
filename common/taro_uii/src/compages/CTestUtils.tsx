import { Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { FC, useState } from "react";
import { ComButton } from "../components/ComButton";
import { ComNav } from "../components/ComNav";
import { ComNavBarA } from "../components/ComNavBarA";
import { ComScrollView } from "../components/ComScrollView";
import { MMMAAPage } from "../components/MMMAAPage";
import { try_Taro_scanCode } from "../utils/try_catch";
import { utils_get_qrcode } from "../utils/util";

const CTestUtils: FC = () => {
  return <MMMAAPage>
    <ComNav>
      <ComNavBarA className='mb10 pl10'>
        <ComButton ll className='bcctrans cccplh ml10' >小工具</ComButton>
      </ComNavBarA>
    </ComNav>
    <ComScrollView >
      <ViewQRCode className='mb10'></ViewQRCode>
      <GenerateQRCode className='mb10'></GenerateQRCode>
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

// 生成小程序二维码
const GenerateQRCode: FC<{ className?: string; }> = ({ className }) => {
  const [ress, setRess] = useState("");
  return <>
    <ComButton className={className} onClick={async () => {
      Taro.showLoading({ mask: true, title: "生成中..." });
      const res = await utils_get_qrcode({
        appid: process.env.TARO_APP_CLIENT,
        page: "pages_user/user_orders",
        scene: ""
      });
      setRess(res!);
      Taro.hideLoading();
      console.info("生成小程序二维码：", res);
    }}>生成小程序二维码</ComButton>
    {ress && <Image src={ress}></Image>}
  </>;

};

