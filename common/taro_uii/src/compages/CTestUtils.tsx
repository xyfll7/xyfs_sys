import Taro from "@tarojs/taro";
import { FC, useState } from "react";
import { Api_common_setJumpPath_ctn } from "../api/api__orders";
import { ComButton } from "../components/ComButton";
import { ComImage } from "../components/ComImage";
import { ComNav } from "../components/ComNav";
import { ComNavBarA } from "../components/ComNavBarA";
import { ComScrollView } from "../components/ComScrollView";
import { MMMAAPage } from "../components/MMMAAPage";
import { try_Taro_saveImageToPhotosAlbum } from "../utils/try_catch";
import { utils_get_qrcode } from "../utils/util";

const CTestUtils: FC = () => {
  const [qrcode, setQrcode] = useState<string>("");
  return <MMMAAPage>
    <ComNav>
      <ComNavBarA className='mb10 pl10'>
        <ComButton ll className='bcctrans cccplh ml10' >小工具</ComButton>
      </ComNavBarA>
    </ComNav>
    <ComScrollView >
      <ComButton className='mb10' onClick={async () => {
        Taro.showLoading({ mask: true, title: "处理中...", });
        const res = await Api_common_setJumpPath_ctn({ path: "pages_comm/comm__product_express" });
        console.log(res);
        Taro.showToast({ icon: "none", title: "已设置消息跳转路径", });
      }}>订单消息跳转路径设置</ComButton>
      <ComButton className='mb10' onClick={async () => {
        Taro.showLoading({ mask: true, title: "生成中..." });
        const _src = await utils_get_qrcode({
          appid: process.env.TARO_APP_CLIENT,
          page: "pages_user/user_orders",
          scene: "",
        });
        Taro.showToast({ icon: "none", title: "二维码已生成" });
        setQrcode(_src);
      }}>生成二维码</ComButton>
      <ComImage style={{ width: "10rem" }} src={qrcode} onClick={async () => {
        if (qrcode) {
          await try_Taro_saveImageToPhotosAlbum({ filePath: qrcode, });
        }
      }}></ComImage>
    </ComScrollView>
  </MMMAAPage>;
};
export { CTestUtils };



