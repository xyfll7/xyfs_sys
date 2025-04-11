// :: pages/index/index
import { Text, View, ViewProps } from '@tarojs/components';
import { Pagination } from '@xyfs/taro_uii';
import { Api_assist_explore_ctn } from '@xyfs/taro_uii/api/api__assist';
import { Api_common_productList_ctn } from '@xyfs/taro_uii/api/api__shop';
import CPRegimentAssist from '@xyfs/taro_uii/compages/CPRegimentAssist';
import { ComAddressSwitchor } from '@xyfs/taro_uii/components/ComAddressSwitchor';
import { ComBanner } from '@xyfs/taro_uii/components/ComBanner';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComImage } from '@xyfs/taro_uii/components/ComImage';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComPrice } from '@xyfs/taro_uii/components/ComPrice';
import { ComScrollView } from '@xyfs/taro_uii/components/ComScrollView';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { MMMFooter } from '@xyfs/taro_uii/components/MMMFooter';
import { MMMLogo } from '@xyfs/taro_uii/components/MMMLogo';
import { getMyEnv } from '@xyfs/taro_uii/src/env';
import { roo___has_role, roo___my_dept } from '@xyfs/taro_uii/src/roles';
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { try_Taro_navigateTo } from '@xyfs/taro_uii/utils/try_catch';
import { useHook_pageListNew } from '@xyfs/taro_uii/utils/useHooks';
import { utils_get_capsule } from '@xyfs/taro_uii/utils/util';
import { FC, useCallback, useEffect, useState } from 'react';

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
  const { capRight } = utils_get_capsule();
  return <MMMAAPage>
    <View className='ww'>
      <ComBanner isHeaderBack={isHeaderBack} src='https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/back_image_25.jpg' />
      <ComNav>
        <View className='ww'>

          <View className='z2 transall mb10' style={{ paddingRight: true ? `${capRight}px` : "0px", }}>
            <View className='dbtc pl10'>
              <MMMLogo />
              <View className='pr slr mr10' onClick={async () => { await try_Taro_navigateTo({ url: '/pages_user/user_my' }); }}>
                <ComImage className='' src={useSTSelf.getState().selfInfo?.avatar ?? ""} />
                <View className='pa dxy' style={{ bottom: "calc(-0.3 * var(--rem_base))", right: "calc(-0.3 * var(--rem_base))" }}>
                  <View className=' ioo dxy fs08  bcctrans05' style={{ width: "calc(1.2 * var(--rem_base))", height: "calc(1.2 * var(--rem_base))" }}>我</View>
                </View>
              </View>
              <ComButton className='flx1  ioo dbtc cccplh bcctrans01-dark' hoverClass='none' >
                <Text>~</Text><Text> 搜 </Text>
              </ComButton>
            </View>
          </View>

          {roo___has_role(selfInfo_S!.deptInfo!, ["REGIMENT"]) &&
            <View className='mb10 dbtc prl10 transall' style={{ paddingRight: false ? `${capRight}px` : "0px", opacity: false ? "0" : "1", height: false ? "0rem" : "calc(2 * var(--rem_base)) !important", }}>
              <ComAddressSwitchor className='bcctrans01-dark mr10' title='团长:' isShort isIcon address={roo___my_dept(selfInfo_S)} url='/pages_user/user_regiment_list_map' />
              <View className='dy'>
                <ComButton className='bcctrans01-dark mr10 nw cccplh' url='/pages_user/user_orders'>订单</ComButton>
                {getMyEnv().isDeveloping && <ComButton className='bccyellow nw fwb' url='/pages_comm/comm__publisher'>
                  <Text className='cccgreen'>+</Text>发布
                </ComButton>
                }
              </View>
            </View>
          }
          {roo___has_role(selfInfo_S!.deptInfo!, ["GUIDE"]) &&
            <View className='mb10 dbtc prl10 transall' style={{ paddingRight: false ? `${capRight}px` : "0px", opacity: false ? "0" : "1", height: false ? "0rem" : "calc(2 * var(--rem_base)) !important", }}>
              <ComAddressSwitchor className='bcctrans01-dark mr10 ww' title='导游:' isShort isIcon address={roo___my_dept(selfInfo_S)} />
              <View className='dy'>
                <ComButton className='bcctrans01-dark nw cccplh' url='/pages_user/user_orders'>订单</ComButton>
              </View>
            </View>
          }

        </View>
      </ComNav>
    </View>
    <ComScrollView className='IOO' upperThreshold={200}
      onScroll={(e, top) => { if (e.detail.scrollTop > top) { setIsHeaderBack(true); } }}
      onScrollToUpper={() => { setIsHeaderBack(false); }}>

      {roo___has_role(selfInfo_S!.deptInfo!, ["REGIMENT"]) && <IIIMainNavigator className='mb10  ' />}

      {/* {getMyEnv().isDeveloping && <IIIBanner className='mb10' />} */}

      <IIIBringGoods className='mb10' />
      {/* <IIIRegimentAssistList /> */}
      {getMyEnv().platform === "devtools" &&
        <View className='dll'>
          <ComButton className='bccwhite cccprice fwb mb10' url='/pages/test/ctest_display' >测试display</ComButton>
          <ComButton className='bccwhite cccprice fwb mb10' url='/pages/test/ctest_index' routeType='wx://cupertino-modal'>测试</ComButton>
          <ComButton className='bccwhite cccprice fwb mb10' url='/pages/test/ctest_utils' >工具</ComButton>
        </View>
      }
      <MMMFooter className='mb10' />
    </ComScrollView>
  </MMMAAPage>;
};

const IIIBanner = ({ ...props }: ViewProps) => {
  return <View className={`ww ${props.className}`} onClick={async () => { await try_Taro_navigateTo({ url: "/pages_user/user_bring_goods" }); }}>
    <View className=' ww ovh IOO' style={{ height: "100vw", }}>
      <View style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <ComImage src='https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/client_index_banner.png' style={{ width: "100vw", }} mode='widthFix' />
      </View>
    </View>

    <View className='pa ww hh  dbtl z1 pt10 pl10 pr10' style={{ top: "0" }}>
      <ComButton className='bccwhite pbt6' hoverClass='none'>
        <View className='dll'>
          <View className='fwb fs14  mr6'>今日优选</View>
          <View className=''>
            延安苹果
          </View>
          <View className=' dbase'>
            <Text className='fs08 cccprice '>￥</Text>
            <Text className='cccprice '>9.9元/4枚</Text>
          </View>
        </View>
      </ComButton>
      <View className='dr ww'>
        <ComButton className='bccyellow mb10'> <View className='dbase'><Text className='cccgreen'>+</Text> <Text className='fwb'>买</Text> </View> </ComButton>
      </View>
    </View>
  </View>;
};

const IIIBringGoods = ({ className }: { className?: string; }) => {
  const [productList, setProductList] = useState<any[]>();
  useEffect(() => {
    Api_common_productList_ctn({ orderId: "123" }).then((res) => {
      console.log(res);
      setProductList(res);
    });
  }, []);
  return <View className={className}>
    {!productList && <ComLoading></ComLoading>}
    {productList?.length === 0 && <ComLoading isEmpty></ComLoading>}
    {productList?.map((item, index) => {
      const product = item.product[0];
      return <View className='ww ovh dll' key={index}>
        {/*@ts-ignore*/}
        <store-product-item class="ww hh  mb10" customContent appid={product.appid} productId={product.out_product_id} productPromotionLink={product.product_promotion_link}>
          <View className='ds mb10 hh ovh bccwhite ioo h7rem ww'>
            <ComImage className='mr10' src={product.img_url} style={{ width: "7rem" }}></ComImage>
            <View className='pt10 hh ww dbtl h7rem ovh'>
              <View>
                <ComButton ll className='' hoverClass='none'>
                  <Text className="nw1"> {product.title}</Text>
                </ComButton>
                <View className=''>
                  <ComPrice className='cccprice' price={product.selling_price / 100}></ComPrice>
                </View>
              </View>

              <View className='h2rem mb10 ovh ww dr'>
                {/*@ts-ignore*/}
                <store-product-item class="mr10 ds" customContent openPage="buy" appid={product.appid} productId={product.out_product_id} productPromotionLink={product.product_promotion_link}>
                  <View className='dr ww'>
                    <ComButton className='bccgreen cccwhite'>购买</ComButton>
                  </View>
                  {/*@ts-ignore*/}
                </store-product-item>
              </View>
            </View>
          </View>
          {/*@ts-ignore*/}
        </store-product-item>
      </View>;
    })
    }
  </View>;
};

const IIIBringGoodsArea = () => {
  return <View className='bccwhite mb10 ioo ww pt10 dll prl10 ' onClick={async () => {
    await try_Taro_navigateTo({ url: `/pages_user/user_bring_goods` });
  }}>
    <View className='dbtc ww'>
      <ComButton ll className='mb10 cccplh'>团长带货专区</ComButton>
      <ComButton rr className='cccplh mb10'>去看看</ComButton>
    </View>
    <View className='dy ww'>
      {[
        { title: "肉类" },
        { title: "蔬菜" },
        { title: "水果" },
        { title: "海鲜" },
        { title: "蛋奶" },
        { title: "烧卤" },
      ].map((e, i) => {
        return <ComButton ll className='mb10 bccback mr10' key={i}>{e.title}</ComButton>;
      })}
    </View>
  </View>;
};

const IIIMainNavigator: FC<{ className?: string; style?: string | React.CSSProperties; }> = ({ className = '', style }) => {
  return <View className={`${className} dy pl10 pt10`} style={style}>
    <ComButton className='mb10 oo pbt8 mr10 fwb shadow' url='/pages_comm/comm__product_express' >
      团寄快递
    </ComButton>
    <ComButton className='mb10 oo pbt8 mr10 fwb shadow' url='/pages_comm/comm__product_dryclean' >
      团购干洗
    </ComButton>
  </View>;
};

const IIIRegimentAssistList: FC<{}> = ({ }) => {

  const ___page_getter = useCallback(async (p: Pagination<unknown>) =>
    await Api_assist_explore_ctn({
      ...p,
      keyword: "",
      type: "1"
    }), []);
  const { page, page_loading, page_list_get, } = useHook_pageListNew(___page_getter,);

  return (
    <View className='dll ww'>
      {page.list?.map((e) => {
        return <View className='mb10 dll ovh IOO bccwhite pt10 ww prl10' key={e.id} onClick={async () => {
          await try_Taro_navigateTo({ url: `/pages_user/user_assist_detail?assist_item_id=${e.id}` });
        }}>
          <View className='dll ww' onClick={async (ee) => {
            ee.stopPropagation();
            await try_Taro_navigateTo({ url: `/pages_user/user_assist_home?user_id=${e.userId}` });
          }}>
            <View className='dbtc ww'>
              <View className='dy ww'>
                <ComImage className='mb10 mr10' src={e.userAvatar} />
                <ComButton ll className='mb10'>{e.userName}</ComButton>
              </View>
              <ComButton rr className='cccplh mb10 nw'>更多</ComButton>
            </View>
            <View className='bccback ww mb10' style={{ height: "1rpx" }} />
          </View>

          <CPRegimentAssist.PublishCard data={e} />
        </View>;
      })}
      <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)}></ComLoading>
    </View>
  );
};