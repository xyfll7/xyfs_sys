import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';


import { FC, } from 'react';
import { try_Taro_chooseMedia } from '../utils/try_catch';
import { utils_str_includes } from '../utils/util';
import { ComImage } from './ComImage';

export const ComImageUploader: FC<{
  className?: string;
  deleteView?: React.ReactNode,
  images: string;
  onSetImages: (images: string[]) => void;
  upLoader?: (e: string[]) => Promise<string[]>;
  size?: string;
  addTitle?: string;
  folder?: string;
  count?: number;
  sourceType?: (keyof Taro.chooseMedia.sourceType)[],
}> = ({ count = 9, deleteView, className, images, sourceType = ["album", "camera"], addTitle = "好物配好图", size = "calc(5.5 * var(--rem_base))", onSetImages, upLoader }) => {
  const _images = images.split(",").filter(e => e !== "");
  const isLoading = _images.find(e => utils_str_includes(["http://", "wxfile://"], e));
  return <View className={`ds dwp ${className}`}>
    {[..._images, ""].slice(0, count).map((e, i) => {
      return <View className='bccbacktab  mb10 mr10 ioo ovh pr' key={i}
        style={{ width: size, height: size, border: "1rpx solid var(--color_back)" }}>
        {e && <ComImage className='ww hh ioo ovh' style={{ width: size }} compress='300' mode='aspectFill' src={e} onClick={() => {
          Taro.previewMedia({ current: i, sources: _images.map(ee => ({ url: ee })) });
        }}></ComImage>}
        {e && !utils_str_includes(["http://", "wxfile://"], e) &&
          <View className='pa z1 ' onClick={() => { onSetImages(_images.filter(eee => eee !== e)); }} style={{ top: '0rem', right: '0rem' }}>
            {deleteView ? deleteView : <View className='bccred dxy cccwhite o6' style={{ minWidth: "calc(1.2 * var(--rem_base))", minHeight: "calc(1.2 * var(--rem_base))" }}>
              <View className='fs07'>删</View>
            </View>
            }
          </View>
        }
        {utils_str_includes(["http://", "wxfile://"], e) && <View className='ww hh pa z1 dxy fs07 cccwhite'
          style={{
            top: "0rem",
            backgroundColor: "#80808061"
          }}>上传中...</View>}
        {!e &&
          <View className='cccplh fs06 ww hh dxyl ' onClick={async () => {
            if (isLoading) { throw new Error("上传中,请稍后..."); }

            const res_files = await try_Taro_chooseMedia({ count: count - _images.length, sourceType });

            function ___get_images(ee: string[]) {
              if (utils_str_includes(["https://"], ee[0]!)) {
                return [..._images.filter(eee => !utils_str_includes(["http://", "wxfile://"], eee)), ...ee];
              } else {
                return [..._images, ...ee];
              }
            }
            onSetImages(___get_images([...res_files.map(ee => ee.tempFilePath)]));
            let res_images: string[] = [];
            if (!upLoader) {

            } else {
              res_images = await upLoader([...res_files.map(ee => ee.tempFilePath)]);
            }

            onSetImages([..._images, ...res_images]);
          }}>
            {isLoading ?
              <View>
                上传中...
              </View> :
              <>
                <View>+ {addTitle}</View>
                <View>~~~</View>
              </>
            }
          </View>
        }
      </View>;
    })}
  </View>;
};