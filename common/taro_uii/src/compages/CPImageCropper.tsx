import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { FC, useState } from "react";
import { Api_common_textOCR_ctn } from "../api/api__users";
import { ComButton } from "../components/ComButton";
import { ComNav } from "../components/ComNav";
import { ComNavBarA } from "../components/ComNavBarA";
import { MMMAAPage } from "../components/MMMAAPage";
import { try_Taro_cloud_uploadFile } from "../utils/try_catch";
import { utils_get_page_opener } from "../utils/util";
import { useHook_getCurrentInstance } from "../utils/useHooks";

const CPImageCropper: FC = () => {
  const { safeArea } = Taro.getWindowInfo();
  const { options } = useHook_getCurrentInstance<{ imgSrc?: string; }>();
  const cfg = {
    imgSrc: options.imgSrc,
    width: 250, //宽度
    height: 100, //高度
    min_width: 50,
    min_height: 30,
    max_width: safeArea?.width ?? 350,
    max_height: 500
  };
  // const [testUrl, setTestUrl] = useState<string | null>(null);

  const [angle, setAngle] = useState(0);
  const getCropper = () => {
    const { page } = Taro.getCurrentInstance();
    const cropper: any = page && page.selectComponent &&
      page.selectComponent("#image-cropper");
    return cropper;
  };
  return <MMMAAPage>
    <>
      <ComNav className='z9 ww prl10 '>
        <View className='ww '>
          <ComNavBarA className='mb10 '>
            <ComButton ll className='bcctrans cccplh ml10' >图片裁剪</ComButton>
          </ComNavBarA>
          <View className='ww dr '>
            <ComButton className='cccgreen ml10'
              onClick={() => {
                getCropper().setAngle(angle + 90);
                setAngle(angle + 90);
              }}>旋转</ComButton>
            <ComButton className='cccgreen ml10'
              onClick={() => {
                getCropper().getImg(async (img: { url: string; }) => {
                  Taro.showLoading({ mask: true, title: "识别中...", });
                  const res = await try_Taro_cloud_uploadFile(img.url);
                  const res_address = await Api_common_textOCR_ctn({ imgUrl: res.fileID });
                  utils_get_page_opener()?.emit("onOcrRes", { ...res_address, country: "中国", from: "OCR", }, res_address.text);
                  Taro.navigateBack();
                });
              }}>识别</ComButton>
          </View>
        </View>
      </ComNav>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <image-cropper
        id='image-cropper'
        imgSrc={cfg.imgSrc}
        width={cfg.width}
        height={cfg.height}
        min_width={cfg.min_width}
        min_height={cfg.min_height}
        max_width={cfg.max_width}
        max_height={cfg.max_height}
        onTapcut={() => { }}
        onLoad={() => {
          Taro.showLoading({ mask: true, title: "载入图片..." });
        }}
        onImageload={(e: any) => {
          if (e.detail) {
            Taro.showToast({ icon: "none", title: "图片载入成功", duration: 300 });
            getCropper().imgReset();
          }
        }}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
      </image-cropper>
    </>
  </MMMAAPage>;
};
export { CPImageCropper };

