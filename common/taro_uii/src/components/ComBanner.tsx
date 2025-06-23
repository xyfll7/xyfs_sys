
import { RootPortal, View } from '@tarojs/components';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { utils_str_includes } from '../utils/util';
import { ComImage } from './ComImage';

const _default_image = [
  "https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/back_image_2025-06-03_001.png",
  "https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/back_image_2025-06-03_002.png",
  "https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/back_image_2025-06-03_003.png",
  "https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/back_image_2025-06-03_004.png",
].sort(() => Math.random() - 0.5)[0];

export const ComBanner = forwardRef(({
  isHeaderBack = false,
  maskHightF = "80vw",
  maskHightT = "100%",
  className = "",
  src = _default_image,
  onClick }: { className?: string; isHeaderBack?: boolean; src?: string; maskHightF?: string; maskHightT?: string; onClick?: () => void; }, ref) => {

  const str0___ = utils_str_includes(["bccwhite"], className) ? "linear-gradient(0deg, var(--color_white) 40%, rgba(0, 0, 0, 0) 100%);" : "linear-gradient(0deg, var(--color_back) 40%, rgba(0, 0, 0, 0) 100%);";
  const str1___ = utils_str_includes(["bccwhite"], className) ? "linear-gradient(0deg, var(--color_white) 95%, rgba(0, 0, 0, 0) 100%);" : "linear-gradient(0deg, var(--color_back) 55%, rgba(0, 0, 0, 0) 100%);";
  const [isHeaderBack_, setIsHeaderBack_] = useState(isHeaderBack);
  useImperativeHandle(ref, () => ({
    setIsHeaderBack: (e: boolean) => {
      setIsHeaderBack_(e);
    }
  }));


  return <RootPortal style={{ zIndex: -1 }}>
    <View className={`root-portal ${className}`} style={{ position: "absolute", top: "0vw", right: "0vw", width: "100vw", zIndex: -1 }}>
      <View className='ww'>
        <View className='dxy ww ovh ioo' style={{ paddingBottom: "0.1rem" }}>
          <ComImage className='ioo z1' style={{ height: "auto", width: "100vw" }} mode='widthFix'
            src={src}
            onClick={onClick} />
        </View>
        <View className='pa ww transall5' style={{
          bottom: "0rem",
          height: isHeaderBack_ ? maskHightT : maskHightF,
          background: isHeaderBack_ ? str1___ : str0___,
        }} />
      </View>
    </View>
  </RootPortal>;
})

