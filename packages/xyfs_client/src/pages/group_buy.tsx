// :: pages/index/index
import { Text, View } from '@tarojs/components';
import { ComAddressSwitchor } from '@xyfs/taro_uii/components/ComAddressSwitchor';
import { ComBanner } from '@xyfs/taro_uii/components/ComBanner';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComImage } from '@xyfs/taro_uii/components/ComImage';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComCartPrice } from '@xyfs/taro_uii/components/ComPrice';
import { ComScrollView } from '@xyfs/taro_uii/components/ComScrollView';
import { ComSquare } from '@xyfs/taro_uii/components/ComSquare';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { MMMFooter } from '@xyfs/taro_uii/components/MMMFooter';
import { roo___my_dept } from '@xyfs/taro_uii/src/roles';
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { AddressInfo } from '@xyfs/taro_uii/type_user';
import { try_Taro_chooseAddress } from '@xyfs/taro_uii/utils/try_catch';
import { FC, useState } from 'react';
import { AVATARS } from '../avatars';

definePageConfig({
  enableShareAppMessage: true, navigationStyle: "custom", disableScroll: true,
  // "styleIsolation": "apply-shared",
  // "componentFramework": "glass-easel",
  // "renderer": "skyline",
});

export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC = () => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const [isHeaderBack, setIsHeaderBack] = useState(false);
  const [type, setType] = useState(1);
  const isBanner = true;
  const [address, setAddress] = useState<AddressInfo | undefined>(selfInfo_S.defaultRecManAddress);
  return <MMMAAPage className={`${isBanner ? "" : new Map([[0, "bccback"], [1, "bccwhite"]]).get(type)}`}>
    <View className='ww'>
      {isBanner &&
        <ComBanner className={`${new Map([[0, "bccback"], [1, "bccwhite"]]).get(type)}`} isHeaderBack={isHeaderBack} maskHightT='70%' maskHightF='10vh' src='https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/farmer_0.webp' />
      }
      <ComNav className='mb10'>
        <ComButton className="cccorange  fs13 fwb bcctrans" hoverClass='none'>今日鲜果</ComButton>
      </ComNav>
    </View>
    <ComScrollView className='IOO' upperThreshold={200}
      onScroll={(e, top) => { if (e.detail.scrollTop > top) { setIsHeaderBack(true); } }}
      onScrollToUpper={() => { setIsHeaderBack(false); }}>
      <View className='ww dll prl10'>
        <ComButton ll className={`mb10 cccplh bcctrans nw1 `} hoverClass='none'>今日下单明日送达 🚗 🛵 🎁</ComButton>
        <View className='ww dr'>
          <ComButton rr className={`mb10  cccgreen nw ${isBanner ? "bcctrans03-dark" : ""}`} onClick={() => {
            setType(type == 0 ? 1 : 0);
          }}>{new Map([[0, "图文版"], [1, "简洁版"]]).get(type)} </ComButton>
        </View>
      </View>
      <IIIAbc type={type} />
      <IIIUser />
      <MMMFooter className='mb10' />
    </ComScrollView>
    <View className='ww dll pt10'>
      <View className='ww dr mb10'>
        <ComAddressSwitchor className="ww bcctrans" isShort isIcon addressPlaceholder='请填写收货地址' title='收货人:' address={address} onClick={async (e) => {
          const res_address = await try_Taro_chooseAddress();
          setAddress(res_address);
        }} />
        <ComButton className='cccgreen bborder ml10 nw'>到付</ComButton>
      </View>
      <View className='ww dr mb10'>
        <ComAddressSwitchor className="ww mr10 bcctrans" isShort title='团:' address={roo___my_dept(selfInfo_S)} />
        <ComCartPrice totalPrice={"10"} num={"1"} onClick={() => {

        }} />

        <ComButton className='bccyellow ml10 nw'>
          <ComSquare style={{ width: "calc(1.3 * var(--rem_base))" }} className='icon-wxpay mr4' />
          <Text>现付</Text>
        </ComButton>
      </View>
    </View>
  </MMMAAPage>;
};


const IIIAbc = ({ type }: { type: number; }) => {
  return <View className='ww'>
    <View className={`ww ${new Map([[1, " ioo"]]).get(type)}`}>
      {[
        { title: '🥒 幸福小黄瓜', desc: "黄瓜很好，鸡蛋好吃", images: "https://cdn.agroworld.my/jQFku15773.jpeg,https://cdn.agroworld.my/DzNb415772.jpeg,https://cdn.agroworld.my/il6z315774.jpeg" },
        { title: '🌶️ 绝杀大辣条', desc: "辣条不错，鸡蛋好吃", images: "https://www.huadu.gov.cn/img/1/1189/1189348/9646406.jpg,https://www.huadu.gov.cn/img/1/1189/1189349/9646406.jpg,https://www.huadu.gov.cn/img/1/1189/1189346/9646406.jpg" },
        { title: '🥚 白色小鸡蛋', desc: "鸡蛋好吃，鸡蛋好吃鸡蛋好吃", images: "https://img.mp.sohu.com/upload/20170323/66a6076b064c496b9a565a55497a82d2_th.jpg,https://img.mp.sohu.com/upload/20170323/2c9d7c3273bc4900b3b43924a65a3620_th.jpg,https://img.mp.sohu.com/upload/20170323/4382f90dad08417c91439c43aa8c3029_th.jpg" },
        { title: '🌶️ 绝杀大辣条', desc: "辣条不错，鸡蛋好吃", images: "https://www.huadu.gov.cn/img/1/1189/1189348/9646406.jpg,https://www.huadu.gov.cn/img/1/1189/1189349/9646406.jpg,https://www.huadu.gov.cn/img/1/1189/1189346/9646406.jpg" },
        { title: '🥒 幸福小黄瓜', desc: "黄瓜很好，鸡蛋好吃", images: "https://cdn.agroworld.my/jQFku15773.jpeg,https://cdn.agroworld.my/DzNb415772.jpeg,https://cdn.agroworld.my/il6z315774.jpeg" },
      ].map((item, index) => {
        if (type == 1) {
          return <View className='dll ww bccback IOO prl10 mb10' key={index} >
            <View className='dbtc ww'>
              <View>
                <ComButton ll className=' bccback' hoverClass='none'>{item.title}</ComButton>
                <View className='cccplh mb10'>{item.desc}</View>
              </View>
              <View className='dy'>
                <ComButton className='bccback' >-</ComButton>
                <ComButton rr className='bccwhite ml10 cccgreen' >+ 加</ComButton>
              </View>
            </View>
          </View>;
        } else {
          return <View className='dll ww bccwhite pt10 IOO prl10 mb10' key={index} >
            <ComButton ll className='mb10' hoverClass='none'>{item.title}</ComButton>
            <View className='cccplh mb10'>{item.desc}</View>
            <View className='ww dbl '>
              <View className='dy mb10 ww '>
                {item.images?.split(",").map((e, i) => {
                  return <ComImage className='mr10' style={{ width: '4rem' }} src={e} key={i}></ComImage>;
                })}
              </View>
              <View className='dbl dr ww mb10' >
                <ComButton className=' bborder' hoverClass='none'>-</ComButton>
                <ComButton rr className='ml10 bccyellow h2rem nw' hoverClass='none' >+ 加购</ComButton>
              </View>
            </View>
          </View>;
        }
      })}
    </View>
  </View>;
};

const IIIUser = () => {
  return <View className='ww prl10'>
    <ComButton ll className='bcctrans mb10 cccplh' hoverClass='none'>今日跟团用户</ComButton>
    {["", "", "", "",].map((e, i) => {
      return <View className='dy mb10 ww' key={i}>
        <ComImage className='mr10 oo ovh' src={AVATARS.sort(() => Math.random() - 0.5)[0]}></ComImage>
        <ComButton ll className='bcctrans'>用户</ComButton>
      </View>;
    })}
  </View>;
};