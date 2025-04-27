// :: pages/index/index
import { Text, View } from '@tarojs/components';
import { Api_goods_list_ctn } from "@xyfs/taro_uii/api/api__goods";
import { ComAddressSwitchor } from '@xyfs/taro_uii/components/ComAddressSwitchor';
import { ComBanner } from '@xyfs/taro_uii/components/ComBanner';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComImage } from '@xyfs/taro_uii/components/ComImage';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComCartPrice } from '@xyfs/taro_uii/components/ComPrice';
import { ComScrollView } from '@xyfs/taro_uii/components/ComScrollView';
import { ComSquare } from '@xyfs/taro_uii/components/ComSquare';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { MMMFooter } from '@xyfs/taro_uii/components/MMMFooter';
import { roo___my_dept } from '@xyfs/taro_uii/src/roles';
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { Pagination } from '@xyfs/taro_uii/type_index';
import { AddressInfo } from '@xyfs/taro_uii/type_user';
import { try_Taro_chooseAddress } from '@xyfs/taro_uii/utils/try_catch';
import { useHook_pageListNew } from '@xyfs/taro_uii/utils/useHooks';
import { FC, useCallback, useState } from 'react';
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


  const ___page_getter = useCallback(async (p: Pagination<unknown>) =>
    await Api_goods_list_ctn({
      ...p,
      sort: "desc",
      keyword: "",
    }), []);
  const { page, page_loading, page_list_get } = useHook_pageListNew(___page_getter,);

  return <MMMAAPage className={`${isBanner ? "" : new Map([[0, "bccback"], [1, "bccwhite"]]).get(type)}`}>
    <View className='ww'>
      {isBanner &&
        <ComBanner className={`${new Map([[0, "bccback"], [1, "bccwhite"]]).get(type)}`} isHeaderBack={isHeaderBack} maskHightT='70%' maskHightF='10vh' src='https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/farmer_0.webp' />
      }
      <ComNav className='mb10'>
        <ComButton className="cccorange  fs13 fwb bcctrans" hoverClass='none'>鲜果团购</ComButton>
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
      {page.list && page.list.map((item, index) => <IIIItem item={item} key={index} type={type}></IIIItem>)}
      {!page.list && <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)} />}
      <IIIUsers />
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

const IIIItem = ({ item, type }: { item: any; type: number; }) => {
  if (type == 1) {
    return <View className='dll ww bccback IOO prl10 mb10'  >
      <View className='dbtc ww pt4'>
        <View>
          <ComButton ll className='bccback' hoverClass='none'> <Text className='nw1'>{item.name}</Text> </ComButton>
          <View className='cccplh mb10 nw1'>{item.intro ? item.intro : "没有简介"}</View>
        </View>
        <View className='dy'>
          <ComButton className='bccback'>-</ComButton>
          <ComButton rr className='bccwhite nw ml10 cccgreen' >+ 加</ComButton>
        </View>
      </View>
    </View>;
  } else {
    return <View className='dll ww bccwhite pt10 IOO prl10 mb10' >
      <ComButton ll hoverClass='none'><Text className='nw1'>{item.name}发生的发生的发生地方发生的发生的发生地方</Text> </ComButton>
      <View className='cccplh mb10'><Text className='nw2'>{item.intro ? item.intro : "没有简介"}发生的发生的发生地方发生的发生的发生地方发生的发生的发生地方发生的发生的发生地方发生的发生的发生地方发生的发生的发生地方</Text> </View>
      <View className='ww dbl'>
        <View className='dy mb10 ww '>
          {item.attachUrl?.split(",").map((e, i) => {
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
};


const IIIUsers = () => {
  return <View className='ww prl10'>
    <ComButton ll className='bcctrans mb10 cccplh' hoverClass='none'>今日跟团用户</ComButton>
    {["", "", "", "",].map((e, i) => {
      return <View className='dy mb10 ww' key={i}>
        <ComImage className='mr10 oo ovh' src={[...AVATARS].sort(() => Math.random() - 0.5)[0]}></ComImage>
        <ComButton ll className='bcctrans'>用户</ComButton>
      </View>;
    })}
  </View>;
};