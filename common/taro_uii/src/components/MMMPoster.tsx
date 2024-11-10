import { Image, Text, View } from '@tarojs/components';
import { FC, PropsWithChildren, useState } from 'react';
import { useSTSelf } from '../store/store';
import { try_Taro_chooseMedia } from '../utils/try_catch';
import { ComPopupNew } from './ComPopupNew';

export const MMMPoster: FC<PropsWithChildren & { onClose?: () => void; background: string; }> = ({ onClose, children, background }) => {
  return <ComPopupNew className='bccyellow prl10' style={{ background: background }}>
    <View key='Mask' className='ww' style={{ height: "24vh" }} onClick={() => { onClose?.(); }}>
      <View className='pr'>
        <Image className='ww pa' mode='widthFix' src='https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/poster_bg_00.png'></Image>
      </View>
      <View className='ww dxy' style={{ height: "24vh" }}>
        <View className='w5rem h5rem dxy oo' style={{ backgroundColor: "#00000050" }}>
          <Text className='icon-logo-color w4rem h4rem'></Text>
        </View>
      </View>
    </View>
    <View className='prl10' style={{ height: "76vh" }}>
      {children}
      <View className='dxy cccplh fs08 fwl'>小象心选·团购真的省</View>
    </View>
  </ComPopupNew>;
};


export const MMMPosterExpress = ({ src, height = "50vh", }: { src: string; height?: string; }) => {
  const { selfInfo } = useSTSelf.getState();

  const [imgUrl, setImgUrl] = useState("https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/poster_bg_2.png");
  return <>
    <View className='prl10 mb10'>
      <View className='fs15 fwb mb4'>小象心选</View>
      <View className='fwb mb4'>{selfInfo?.name} 团长邀您寄快递啦</View>
      <View className='cccplh '>{selfInfo?.address}</View>
    </View>
    <View className='ioo ovh pr mb10' style={{ height: height }} onClick={async () => {
      const [res_file] = await try_Taro_chooseMedia({ count: 1, sourceType: ["album", "camera"] });
      if (res_file) {
        setImgUrl(res_file.tempFilePath);
      }
    }}>
      <Image className='pa ww' style={{ height: height }} mode='aspectFill' src={imgUrl} ></Image>
      <View className='hh dll ww' style={{ height: height }}>
        <View className='dbr  hh dy ww'>
          <View className='drc'>
            <View className='fs13  mr10 fwb nw  p10 dy prl15 dbase' style={{ color: "white", backgroundColor: "#00000070" }}>
              <View>扫码 <Text className=''>6</Text> 元起</View>
              <View>寄快递 ☛</View>
            </View>
            <View className='oo dxy mr10 mb10' style={{ width: "calc(6.15 * var(--rem_base))", height: "calc(6.15 * var(--rem_base))", backgroundColor: "#00000070" }}>
              <View className='oo ovh' style={{ backgroundColor: "white", padding: "calc(0.15 * var(--rem_base))" }}>
                <Image className='h5rem w5rem' style={{}} src={src}></Image>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  </>;
};
export const MMMPosterDryclean = ({ src, height = "50vh", }: { src: string; height?: string; }) => {
  const { selfInfo } = useSTSelf.getState();
  const [imgUrl, setImgUrl] = useState("https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/poster_bg_2.png");
  return <>
    <View className='prl10 mb10'>
      <View className='fs15 fwb mb4'>小象心选</View>
      <View className='fwb mb4'>{selfInfo?.name} 团长邀您洗衣服啦</View>
      <View className='cccplh '>{selfInfo?.address}</View>
    </View>
    <View className='ioo ovh pr mb10' style={{ height: height }} onClick={async () => {
      const [res_file] = await try_Taro_chooseMedia({ count: 1, sourceType: ["album", "camera"] });
      if (res_file) {
        setImgUrl(res_file.tempFilePath);
      }
    }}>
      <Image className='pa ww' style={{ height: height }} mode='aspectFill' src={imgUrl} />
      <View className='hh dll ww' style={{ height: height }}>
        <View className='dbr  hh dy ww'>
          <View className='drc'>
            <View className='fs13  mr10 fwb nw  p10 dy prl15 dbase' style={{ color: "white", backgroundColor: "#00000070" }}>
              <View>扫码 <Text className=''>8.8</Text> 元起</View>
              <View>洗衣服 ☛</View>
            </View>
            <View className='oo dxy mr10 mb10' style={{ width: "6.15rem", height: "6.15rem", backgroundColor: "#00000070" }}>
              <View className='oo ovh' style={{ backgroundColor: "white", padding: "0.15rem" }}>
                <Image className='h5rem w5rem' style={{}} src={src}></Image>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  </>;
}


