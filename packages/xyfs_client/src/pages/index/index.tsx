// :: pages/index/index
import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { DeptInfo, Pagination, Product_Publish } from '@xyfs/taro_uii';
import { Api_assist_explore_ctn } from '@xyfs/taro_uii/api/api__assist';
import { Api_common_productList_ctn } from '@xyfs/taro_uii/api/api__shop';
import { Api_dept_groupLeader_ctn, Api_user_edit_ctn } from '@xyfs/taro_uii/api/api__users';
import CPRegimentAssist from '@xyfs/taro_uii/compages/CPRegimentAssist';
import { ComAddressSwitchor } from '@xyfs/taro_uii/components/ComAddressSwitchor';
import { ComBanner } from '@xyfs/taro_uii/components/ComBanner';
import { ComButton, ComButtonOpen } from '@xyfs/taro_uii/components/ComButton';
import { ComImage, ComImageStack } from '@xyfs/taro_uii/components/ComImage';
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
import { try_Taro_hideLoading, try_Taro_navigateBack, try_Taro_navigateTo } from '@xyfs/taro_uii/utils/try_catch';
import { useHook_pageListNew } from '@xyfs/taro_uii/utils/useHooks';
import { utils_get_capsule } from '@xyfs/taro_uii/utils/util';
import { coo___objToUrl } from '@xyfs/utils/util';
import React, { FC, forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { AVATARS } from '../../avatars';

definePageConfig({
  enableShareAppMessage: true, navigationStyle: "custom", disableScroll: true,
  // "styleIsolation": "apply-shared",
  // "componentFramework": "glass-easel",
  // "renderer": "skyline",
  usingComponents: {
    'store-product-item': '../../components/store-product-item/store-product-item',
  }
});
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC = () => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const ref_banner = React.useRef<{ setIsHeaderBack: (e: boolean) => void; }>(null);
  const ref_groupLeaders = React.useRef<{ refresh: () => Promise<void>; }>(null);
  const ref_bringGoods = React.useRef<{ refresh: () => Promise<void>; }>(null);
  const { capRight } = utils_get_capsule();


  return <MMMAAPage share={roo___has_role(selfInfo_S!.managerUser!, ["REGIMENT"]) ? { page: `/pages/index/index?${coo___objToUrl({ scene: encodeURIComponent(coo___objToUrl({ R_D: Number(selfInfo_S.managerUser?.mobile).toString(36) })) })}`, } : undefined}>
    <View className='ww'>
      <ComBanner ref={ref_banner} maskHightT='70%' maskHightF='10vh' imageWidth='135vw' />
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
              <ComButton className='flx1  ioo dbtc cccwhite bcctrans01-dark' hoverClass='none' >
                <Text>~</Text><Text> 搜 </Text>
              </ComButton>
            </View>
          </View>

          {roo___has_role(selfInfo_S!.deptInfo!, ["REGIMENT"]) &&
            <View className='mb10 dbtc prl10 transall' style={{ paddingRight: false ? `${capRight}px` : "0px", opacity: false ? "0" : "1", height: false ? "0rem" : "calc(2 * var(--rem_base)) !important", }}>
              <ComAddressSwitchor className='bcctrans01-dark mr10 ww cccwhite' title='团长:' isShort isIcon address={roo___my_dept(selfInfo_S)} url='/pages_user/user_regiment_list_map' />
              <View className='dy'>
                <ComButton className='bcctrans01-dark  nw cccwhite' url='/pages_user/user_orders'>订单</ComButton>
                {getMyEnv().isDeveloping && <ComButton className='bccyellow nw fwb ml10' url='/pages_comm/comm__publisher'>
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
      onRefresherRefresh={async () => { ref_bringGoods.current?.refresh(); await ref_groupLeaders.current?.refresh(); }}
      onScroll={(e, top) => { if (e.detail.scrollTop > top) { ref_banner.current?.setIsHeaderBack(true); } }}
      onScrollToUpper={() => { ref_banner.current?.setIsHeaderBack(false); }}>

      <IIIMainNavigator className='mb10' />

      {/* <View className='prl10 ww'>
        <View className='dxy bccgreen fs07 IOO prl10 pbt10 cccwhite ww mb20'>
          欢迎访问小象心选管，我们是一个专注于为您提供优质商品和服务的平台。我们致力于为您带来更好的购物体验。
        </View>
      </View> */}



      <IIIGroupLeaders ref={ref_groupLeaders} />
      {selfInfo_S.channelId && <IIIBringGoods ref={ref_bringGoods} channelId={selfInfo_S.channelId} />}


      {getMyEnv().platform === "devtools" &&
        <View className='dll'>
          <ComButton className='bcctrans cccprice fwb mb10' url='/pages/test/ctest_display' >测试display</ComButton>
          <ComButton className='bcctrans cccprice fwb mb10' url='/pages/test/ctest_index' routeType='wx://cupertino-modal'>测试</ComButton>
          <ComButton className='bcctrans cccprice fwb mb10' url='/pages/test/ctest_utils' >工具</ComButton>
        </View>
      }
      <MMMFooter className='mb10' />
    </ComScrollView>
  </MMMAAPage>;
};




const IIIBringGoods = forwardRef(({ className, channelId, }: { className?: string; channelId?: string; }, ref) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const [productList, setProductList] = useState<any[]>();


  const _get_data = useCallback(async () => {
    setProductList(undefined);
    if (channelId) {
      const res = await Api_common_productList_ctn();
      setProductList(res);
    }
  }, [channelId]);

  useEffect(() => {
    _get_data();
  }, [_get_data]);

  useImperativeHandle(ref, () => ({
    refresh: async () => {
      await _get_data();
    }
  }));

  const customContent = true;
  return <View className={`${className} ww dll`}>
    {/* {!productList && <ComLoading className='mb10'></ComLoading>}
    {productList?.length === 0 && <ComLoading className='mb10' isEmpty></ComLoading>} */}
    {productList && [...productList].map((item, index) => {
      const product = item.product[0];
      return <View className='ww  dll' key={index}>
        {/*@ts-ignore*/}
        <View className='dll IOO mb10 ww' style={{
          background: [
            "linear-gradient(170deg,#fcfefc, #f4faee, #e6f2d7, #cfebc0);",
            "linear-gradient(170deg,#fff9f6, #fff0e7, #ffe1cc, #ffcfb3);",
            "linear-gradient(170deg,#fffef8, #fef8d9, #fdefb0, #fde68a);",
            "linear-gradient(170deg,#fbfcfd, #f0f3fa, #dee7f1, #cfdced);",
          ][index % 4]
        }}>
          <View className='prl10 pt10 dy mb10 ww '>
            <ComImage className='mr10' mode='heightFix' style={{ width: 'auto', height: "1.2rem", borderRadius: "0rem !important" }} src='https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/yanan_logo.webp'></ComImage>
            <View className=' fs11 ' style={{ color: ["#6CAB3E", "#EF753E", "#E5A100", "#6A83B3"][index % 4] }}>
              <Text className="nw1"> {String(product.title)}</Text>
            </View>
          </View>
          <View className='prl10 mb10 ww'>
            {/*@ts-ignore*/}
            <store-product-item class="ww hh" openPage="product-detail" customContent={customContent} appid={product.appid} productId={product.out_product_id} productPromotionLink={product.product_promotion_link}>
              <View className='ds bccwhite IOO hh ovh ww'>
                <ComImage className='mr10' src={product.img_url} style={{ width: "7rem" }}></ComImage>
                <View className='pt10 hh ww dbtl ovh'>
                  <View>
                    <ComButton ll className='bcctrans' hoverClass='none'>
                      <Text className="nw1"> {String(product.title)}</Text>
                    </ComButton>
                    <View className=''>
                      <ComPrice className='cccprice' price={product.selling_price / 100}></ComPrice>
                    </View>
                  </View>

                  <View className='h2rem mb10 ovh ww dr'>
                    {/*@ts-ignore*/}
                    <store-product-item class="mr10 ds" customContent={customContent} openPage="buy" appid={product.appid} productId={product.out_product_id} productPromotionLink={product.product_promotion_link}>
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
          </View>
          <View className='prl10 dbtc ww mb10' onClick={async (e) => { e.stopPropagation(); }}>
            <ComImageStack className='mr6' length={6} avatars={AVATARS.sort(() => Math.random() - 0.5).slice(0, 3)}>
            </ComImageStack>

            <ComButtonOpen className='cccgreen bcctrans slr' id='send_express'
              shareTitle={`${selfInfo_S.managerUser?.name} 团长 邀您买东西啦`}
              openType='share'
              sharePath={`/pages/index/index?${coo___objToUrl({ scene: encodeURIComponent(coo___objToUrl({ R_D: Number(selfInfo_S.managerUser?.mobile).toString(36) })) })}`}>
              <View className='dbase'>
                {selfInfo_S.managerUser && <Text className='fs07 mr4 cccorange' >¥</Text>}
                <Text className='cccplh'>分享</Text>
              </View>
            </ComButtonOpen>
          </View>
        </View>
      </View>;
    })
    }
  </View>;
});



const IIIMainNavigator: FC<{ className?: string; style?: string | React.CSSProperties; }> = ({ className = '', style }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  return <View className='dll ww'>
    <View className={`${className} dy dwp pl10 pt10`} style={style}>
      {roo___has_role(selfInfo_S!.deptInfo!, ["REGIMENT"]) &&
        <ComButton className='mb10 oo pbt8 mr10 fwb shadow nw' url='/pages_comm/comm__product_express' >
          团寄快递
        </ComButton>
      }
      {roo___has_role(selfInfo_S!.deptInfo!, ["REGIMENT"]) &&
        <ComButton className='mb10 oo pbt8 mr10 fwb shadow nw' url='/pages_comm/comm__product_dryclean' >
          团购干洗
        </ComButton>
      }
      {roo___has_role(selfInfo_S.managerUser!, ["REGIMENT", "GUIDE"]) && <>
        <ComButton className='mb10 oo pbt8 mr10 fwb shadow nw' url='/pages_regiment/regiment_invitor' >
          管理页
        </ComButton>
        <ComButton className='mb10 oo pbt8 mr10 fwb shadow nw' onClick={async () => {
          Taro.showLoading({ mask: true, title: "更新中...", });
          const res_userInfo = await Api_user_edit_ctn({ deptId: selfInfo_S.managerUser?.deptId });
          useSTSelf.getState().sett(res_userInfo);
          try_Taro_hideLoading();
          try_Taro_navigateBack();
        }} >
          关注自己
        </ComButton>
      </>
      }
    </View>

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


const IIIGroupLeaders = forwardRef(({ }, ref) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);

  const ___page_getter = useCallback(async (p: Pagination<unknown>) =>
    await Api_dept_groupLeader_ctn({
      ...p,
      keyword: ""
    }), []);
  const { page, page_loading, page_list_get, page_list_update, page_init } = useHook_pageListNew(___page_getter,);

  useImperativeHandle(ref, () => ({
    refresh: async () => { await page_init({ isRefresh: true }); }
  }));

  return <>
    {page.list?.map(e => {
      return (<IIICard1 dept_products={e} />);
    })}
    <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)} />
  </>;
});


const IIICard0 = ({ dept_products }: { dept_products: DeptInfo & { products: Product_Publish[]; }; }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  return (
    <View className='ww dll mb10  bccwhite ww IOO pt10 prl10' key={dept_products.deptId}
      onClick={() => {
        try_Taro_navigateTo({ url: `/pages/group_buy?${coo___objToUrl({ scene: encodeURIComponent(coo___objToUrl({ G_D: dept_products.deptId, })) })}` });
      }}>
      <View className='dbtc ww' >
        <ComButton ll className='mb10' hoverClass='none'>
          {dept_products.deptName}
        </ComButton>
        {selfInfo_S.managerUser &&
          <ComButtonOpen rr className='cccgreen bcctrans mb10 ml10' id='send_express'
            shareTitle={`${selfInfo_S.managerUser?.name} 团长 邀您买东西啦`}
            openType='share'
            sharePath={`/pages/group_buy?${coo___objToUrl({ scene: encodeURIComponent(coo___objToUrl({ G_D: dept_products.deptId, })), R_D: Number(selfInfo_S.managerUser?.mobile).toString(36) })}`}>
            <View className='dbase'>
              <Text className='fs07 mr4 cccorange' >¥</Text>
              <Text className='cccplh'>分享</Text>
            </View>
          </ComButtonOpen>}
      </View>
      <View className='dll ww' >
        {dept_products.products.map((p, i) => <View className='dy mb10 ww' key={i}>
          <ComImage className='mr10' src={p.attachUrl?.split(",")[0]} style={{ width: "2.5rem", height: "2.5rem" }} />
          <ComButton rr ll className='ww  dbtc' hoverClass='none'>
            <Text className='nw1 mr10'>{p.name}</Text>
            <ComPrice className='cccprice' price={Number(p.price)}></ComPrice>
          </ComButton>
        </View>)}
      </View>
    </View>);
};
const IIICard1 = ({ dept_products }: { dept_products: DeptInfo & { products: Product_Publish[]; }; }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  return (
    <View className='ww dll mb10  bccwhite ww IOO pt10 prl10' key={dept_products.deptId}
      onClick={() => {
        try_Taro_navigateTo({ url: `/pages/group_buy?${coo___objToUrl({ scene: encodeURIComponent(coo___objToUrl({ G_D: dept_products.deptId, })) })}` });
      }}>
      <View className='dbtc ww mb10' >
        <View className='dy ww'>
          <ComImage className='mr10' src={dept_products.avatar} />
          <ComButton ll hoverClass='none'>
            <View className='dll'>
              <View >{dept_products.deptName}</View>
              <View className='h1rem dy'>
                <View className='lh100 fs07 cccorange'>万人跟团</View>
              </View>
            </View>
          </ComButton>
        </View>
        {selfInfo_S.managerUser &&
          <ComButtonOpen rr className='cccgreen bcctrans  ml10' id='send_express'
            shareTitle={`${selfInfo_S.managerUser?.name} 团长 邀您买东西啦`}
            openType='share'
            sharePath={`/pages/group_buy?${coo___objToUrl({ scene: encodeURIComponent(coo___objToUrl({ G_D: dept_products.deptId, })), R_D: Number(selfInfo_S.managerUser?.mobile).toString(36) })}`}>
            <View className='dbase'>
              <Text className='fs07 mr4 cccorange' >¥</Text>
              <Text className='cccplh nw'>分享</Text>
            </View>
          </ComButtonOpen>}
      </View>
      <View>
        {dept_products.shopAnnouncement &&
          <ComButton rr ll className='mb10 ' hoverClass='none'>
            <View className='nw3' style={{ textAlign: 'left' }}>
              {dept_products.shopAnnouncement}
            </View>
          </ComButton>
        }
      </View>
      <View className='ww' style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "calc(6 * var(--change_base))", }}>
        {dept_products.products.map((p, i) => <View className='dll mb10 ww' key={i}>
          <ComImage src={p.attachUrl?.split(",")[0]} style={{ width: "100%", aspectRatio: "1/1" }} />
        </View>)}
      </View>
      <View className='ww' style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "calc(6 * var(--change_base))", }}>
        {dept_products.products.map((p, i) => <View className='dll mb10 ww' key={i}>
          <ComButton rr ll className='ww  dbtc ' hoverClass='none'>
            <Text className='nw1 mr10'>{p.name}</Text>
          </ComButton>
          <ComButton rr ll className='ww  dbtc ' hoverClass='none'>
            <ComPrice className='cccprice' price={Number(p.price)}></ComPrice>
          </ComButton>
        </View>)}
      </View>
    </View>);
};