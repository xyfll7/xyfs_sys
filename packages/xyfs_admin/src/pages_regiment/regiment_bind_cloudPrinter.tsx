// :: pages_regiment/regiment_bind_cloudPrinter
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Api_user_delPrinter_ctn, Api_user_print_captcha_ctn, Api_user_printer_bind_ctn, Api_user_savePrinter_ctn } from '@xyfs/taro_uii/api/api__users';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { ErrorR } from "@xyfs/taro_uii/src/config";
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { try_Taro_scanCode, try_Taro_showActionSheet, try_Taro_showModal } from '@xyfs/taro_uii/utils/try_catch';
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
          <ComButton ll className='bcctrans cccplh ml10' >云打印机管理</ComButton>
        </ComNavBarA>
        <View className='dll ww'>
          <ComButton className='cccgreen bccwhite nw mb10' onClick={async () => {
            const [, res_item] = await try_Taro_showActionSheet<typeof printerType>({ alertText: "清选择打印机类型", itemList: ["快递100", "打印猿"] });
            setPrinterType(res_item);
            if (res_item === "快递100") {
              await add_kuai_di_100();
            } else if (res_item === "打印猿") {
              await add_da_yin_yuan();
            }
          }}>
            添加云打印机 {printerType && printerIdDYY && <View>：{printerType}</View>}
          </ComButton>
          {printerType === "打印猿" &&
            <>
              <ComButton className='bccback mb10'>
                <Text className='mr6'>打印机编码</Text>
                {printerIdDYY ? <Text>{printerIdDYY}</Text> : <Text className='cccplh'> 暂无ID请先扫打印机码</Text>}
              </ComButton>
              <ComButton className={`mb10  ${printerIdDYY ? 'cccgreen' : 'cccplh'}`} onClick={async () => {
                if (!printerIdDYY) { throw new ErrorR("请先扫打印机码", true); }
                const res_code = await try_Taro_scanCode<string>({ type: "QR_CODE" });
                Taro.showLoading({ mask: true, title: "绑定打印机..." });
                const res = await Api_user_printer_bind_ctn({ printerId: printerIdDYY, captcha: res_code });
                console.log("绑定成功", res);
                useSTSelf.getState().sett();
                setPrinterIdDYY("");
                setPrinterType(undefined);
                Taro.showToast({ icon: "none", title: "绑定成功", });
              }}>
                扫验证码
              </ComButton>
            </>
          }
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
    {(!selfInfo_S.printers || selfInfo_S?.printers?.length == 0) && <ComLoading className='mb10' isEmpty>您没还有添加打印机</ComLoading>}
    {selfInfo_S.printers?.map((printer) => {
      return (
        <View className='prl10 pt10 ioo bccwhite mb10 dll ww' key={printer.siid}>
          <ComButton ll className='cccplh'>打印机ID {printer.name} {printer.siid}</ComButton>
          <View className='dbtc mb10 ww'>
            <ComButton ll className='cccplh'> 打印机类型： {printer.shareCode ? "打印猿" : "快递100"}</ComButton>
            <ComButton rr className='cccplh bborder'
              onClick={async () => {
                if (await try_Taro_showModal({ title: "提示", content: "您确定要删除该打印机?", })) {
                  Taro.showLoading({ mask: true, title: "删除中...", });
                  await Api_user_delPrinter_ctn({ printerId: printer.id! });
                  useSTSelf.getState().sett();
                  Taro.showToast({ icon: "none", title: "删除成功" });
                } else {
                  throw new Error("取消");
                }
              }}>删除</ComButton>
          </View>
        </View>
      );
    })}
  </>;

};
