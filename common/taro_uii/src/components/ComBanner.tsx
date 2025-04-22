
import { RootPortal, View } from '@tarojs/components';
import { ComImage } from './ComImage';



export function ComBanner({
  isHeaderBack,
  maskHightF = "80vw",
  maskHightT = "100%",

  src = 'https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/back_image_6.jpg',
  onClick }: { isHeaderBack: boolean; src?: string; maskHightF?: string; maskHightT?: string; onClick?: () => void; }) {
  return <RootPortal style={{ zIndex: -1 }}>
    <View className='root-portal' style={{ position: "absolute", top: "0vw", right: "0vw", width: "100vw", zIndex: -1 }}>
      <View className='ww'>
        <View className='dxy ww ovh ioo bccbacktab'>
          <ComImage className='ioo z1' style={{ height: "auto", width: "100vw" }} mode='widthFix'
            src={src}
            onClick={onClick} />
        </View>
        <View className='pa ww transall5' style={{
          bottom: "0rem",
          height: isHeaderBack ? maskHightT : maskHightF,
          background: isHeaderBack ? "linear-gradient(0deg, var(--color_back) 95%, rgba(0, 0, 0, 0) 100%);" : "linear-gradient(0deg, var(--color_back) 40%, rgba(0, 0, 0, 0) 100%);",
        }} />
      </View>
    </View>
  </RootPortal>;
}