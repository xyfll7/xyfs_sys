import Taro from "@tarojs/taro";
import { FC } from "react";
import { Api_common_setJumpPath_ctn } from "../api/api__orders";
import { ComButton } from "../components/ComButton";
import { ComNav } from "../components/ComNav";
import { ComNavBarA } from "../components/ComNavBarA";
import { ComScrollView } from "../components/ComScrollView";
import { MMMAAPage } from "../components/MMMAAPage";

const CTestUtils: FC = () => {
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
    </ComScrollView>
  </MMMAAPage>;
};
export { CTestUtils };



