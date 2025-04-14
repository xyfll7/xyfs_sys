// :: pages_regiment/regiment_bind_cloudPrinter
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Api_user_print_captcha_ctn, Api_user_savePrinter_ctn } from '@xyfs/taro_uii/api/api__users';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { ErrorR } from "@xyfs/taro_uii/src/config";
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { try_Taro_scanCode, try_Taro_setClipboardData } from '@xyfs/taro_uii/utils/try_catch';
import { coo___urlToObj } from "@xyfs/utils/util";
import { FC, useState } from "react";

definePageConfig({ navigationStyle: "custom", disableScroll: true });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC<{}> = ({ }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const [printerIdDYY, setPrinterIdDYY] = useState("");
  const [printerType, setPrinterType] = useState<"快递100" | "打印猿">();


  async function add_kuai_di_100() {
    const res_code = await try_Taro_scanCode<string>({ type: "QR_CODE" });
    const { siid } = coo___urlToObj<{ siid: string; }>(res_code);
    if (!siid) { throw new ErrorR("没有识别到siid", true); }
    if (selfInfo_S?.printers?.find((e) => e.siid === siid)) {
      Taro.showToast({ icon: "none", title: "您已经添加过该打印机,请勿重复添加", });
      return;
    }
    Taro.showLoading({ mask: true, title: "更新中..." });
    await Api_user_savePrinter_ctn(
      { siid: siid, direction: "1", }
    );
    useSTSelf.getState().sett();
    Taro.showToast({ icon: "none", title: "打印机配置成功", });
  }

  async function add_da_yin_yuan() {
    const res_code = await try_Taro_scanCode<string>({ type: "CODE_128" });
    Taro.showLoading({ mask: true, title: "打印验证码..." });
    await Api_user_print_captcha_ctn({ printerId: res_code, });
    setPrinterIdDYY(res_code);
    Taro.showToast({ icon: "none", title: "打印成功", });
  }

  return <MMMAAPage>
    <ComNav>
      <View className='ww prl10'>
        <ComNavBarA className='mb10 '>
          <ComButton ll className='bcctrans cccplh ml10' >绑定视频号</ComButton>
        </ComNavBarA>
        <View className='dll ww'>
          <ComButton className='cccplh bccback nw mb10' hoverClass="none" onClick={async () => { }}>
            微信小店带货助手 绑定
          </ComButton>
          <View className="prl10 cccplh">
            <View>复制并打开该网址，微信扫码登陆</View>
            <View onClick={async () => {
              await try_Taro_setClipboardData({ data: "https://channels.weixin.qq.com/login.html", });
              Taro.showToast({ icon: "none", title: "已复制", });
            }}>https://channels.weixin.qq.com/login.html</View>
            <View>带货助手 {'>'} 微信小店带货助手 {'>'} </View>
          </View>
        </View>
      </View>
    </ComNav>
    <ComScrollView>
      <IIIBindAccountList />
    </ComScrollView>
  </MMMAAPage>;
};

const IIIBindAccountList: FC<{}> = ({ }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  return <>

  </>;

};
