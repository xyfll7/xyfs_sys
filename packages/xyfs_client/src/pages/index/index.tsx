// :: pages/index/index
import { Text, Video, View, ViewProps } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { Product_Publish } from '@xyfs/taro_uii';
import { Api_goods_fetch_ctn, Api_goods_groupBuyingUserList_ctn, Api_goods_list_ctn, Api_goodsCart_preOrder_ctn } from "@xyfs/taro_uii/api/api__goods";
import { Api_common_getShortLink_ctn, Api_dept_info_ctn, Api_user_edit_ctn } from '@xyfs/taro_uii/api/api__users';
import { ComAddressSwitchor } from '@xyfs/taro_uii/components/ComAddressSwitchor';
import { ComBanner } from '@xyfs/taro_uii/components/ComBanner';
import { ComButton, ComButtonOpen } from '@xyfs/taro_uii/components/ComButton';
import { ComImage } from '@xyfs/taro_uii/components/ComImage';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarB } from '@xyfs/taro_uii/components/ComNavBarB';
import { ComPopupNew } from '@xyfs/taro_uii/components/ComPopupNew';
import { ComCartPrice, ComPrice } from '@xyfs/taro_uii/components/ComPrice';
import { ComScrollView } from '@xyfs/taro_uii/components/ComScrollView';
import { ComSquare } from '@xyfs/taro_uii/components/ComSquare';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { MMMFooter } from '@xyfs/taro_uii/components/MMMFooter';
import { MMMLogo } from '@xyfs/taro_uii/components/MMMLogo';
import { Order_ST } from '@xyfs/taro_uii/src/config';
import { roo___my_dept } from '@xyfs/taro_uii/src/roles';
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { Pagination } from '@xyfs/taro_uii/type_index';
import { AddressInfo, DeptInfo } from '@xyfs/taro_uii/type_user';
import { try_Taro_chooseAddress, try_Taro_hideLoading, try_Taro_navigateTo, try_Taro_requestPayment, try_Taro_setClipboardData, try_Taro_showModal } from '@xyfs/taro_uii/utils/try_catch';
import { useHook_pageListNew } from '@xyfs/taro_uii/utils/useHooks';
import { coo___arr_remove_duplicate_objects, coo___arr_remove_one_duplicate_by_id, coo___objToUrl, coo___privacy_phone, coo___urlToObj } from '@xyfs/utils/util';
import React, { FC, useCallback, useEffect, useState } from 'react';

definePageConfig({
  enableShareAppMessage: true, navigationStyle: "custom", disableScroll: true,
  // "styleIsolation": "apply-shared",
  // "componentFramework": "glass-easel",
  // "renderer": "skyline",
});
const isBanner = false;
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC = () => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  // const { options } = useHook_getCurrentInstance<{ scene?: string; }>();
  // const { G_D } = coo___urlToObj<{ G_D?: string; }>(options?.scene);
  const { G_D } = coo___urlToObj<{ G_D?: string; }>("G_D%3D185");


  const [address, setAddress] = useState<AddressInfo | undefined>(selfInfo_S.defaultRecManAddress);
  const [deptInfo, setDeptInfo] = useState<DeptInfo | null>(null);
  useEffect(() => {
    (async () => {
      if (!G_D) { return; }
      const res = await Api_dept_info_ctn({ deptId: G_D });
      setDeptInfo(res);
    })();
  }, [G_D]);

  const ___page_getter = useCallback(async (p: Pagination<unknown>) => {
    return await Api_goods_list_ctn({
      ...p,
      sort: "desc",
      keyword: "",
      queryDeptId: G_D
    });
  }, [G_D]);
  const { page, page_loading, page_init, page_list_get } = useHook_pageListNew(___page_getter,);
  const [cart, setCart] = useState<any[]>([]);
  const [isShowCart, setIsShowCart] = useState(false);
  const [product, setProduct] = useState<any>();
  const ref_banner = React.useRef<{ setIsHeaderBack: (e: boolean) => void; }>(null);
  if (deptInfo) {
    deptInfo.shopAnnouncement = deptInfo.shopAnnouncement ? deptInfo.shopAnnouncement : "这个人很懒 🍒🐰​#这个人很懒,根本就不想写公告📝";
  }
  const uniqueCart = coo___arr_remove_duplicate_objects(cart, "id");
  return <MMMAAPage className={`${isBanner ? "" : "bccback"}`}>
    <View className='ww'>
      {isBanner &&
        <ComBanner ref={ref_banner} className={`${isBanner ? "" : "bccback"}`} maskHightT='70%' maskHightF='10vh' />
      }
      <ComNav className='mb10 prl10' isRight>
        <View className='ww dbtc ml10'>
          <View className='dy' >
            <MMMLogo />
            {/* <ComImage className='mr10' src={deptInfo?.avatar} /> */}
            <ComButton ll className="fs11 fwb bcctrans" hoverClass='none'><Text className='nw1'> {deptInfo?.deptName ?? "..."}</Text></ComButton>
          </View>
        </View>
      </ComNav>
      <View className='ww dll prl10 bccback ' >
        <View className='ww dr'>
          <ComButton rr className={`mb10 cccplh bccbackdeep `} onClick={async () => {
            if (!Boolean(cart?.length)) { Taro.showToast({ icon: "none", title: "购物车为空" }); return; }
            await try_Taro_showModal({ title: "清空购物车", content: "确定清空购物车吗？", confirmText: "清空", cancelText: "取消" });
            setCart([]);
            Taro.showToast({ icon: "none", title: "已清空" });
          }}>清空</ComButton>
          <ComButton rr className={`cccplh mb10 ml10 bccbackdeep `} onClick={async () => {
            Taro.showLoading({ title: "获取短链中...", mask: true });
            const res = await Api_common_getShortLink_ctn({
              pageUrl: `pages/group_buy?${coo___objToUrl({ scene: encodeURIComponent(coo___objToUrl({ G_D: G_D, R_D: Number(selfInfo_S.managerUser?.mobile).toString(36) })) })}`,
              pageTitle: `${deptInfo?.deptName}`,
              isPermanent: false
            });
            await try_Taro_setClipboardData({ data: res });
            Taro.showToast({ icon: "none", title: "已复制", });
          }}>
            <View className='dbase'>
              {selfInfo_S.managerUser && <Text className='fs07 mr4 cccorange' >¥</Text>}
              <Text className='mr4'>短链</Text>
            </View>
          </ComButton>
          <ComButtonOpen rr className={`cccplh mb10 ml10  bccbackdeep`} id='send_express'
            shareTitle={`${selfInfo_S.managerUser?.name} 团长 邀您买东西啦`}
            openType='share'
            sharePath={`/pages/group_buy?${coo___objToUrl({ scene: encodeURIComponent(coo___objToUrl({ G_D: G_D, R_D: Number(selfInfo_S.managerUser?.mobile).toString(36) })) })}`}>
            <View className='dbase'>
              {selfInfo_S.managerUser && <Text className='fs07 mr4 cccorange' >¥</Text>}
              <Text className='mr4'>分享</Text>
            </View>
          </ComButtonOpen>
          <ComButton className='cccplh mb10 bccbackdeep ml10' url='/pages_user/user_orders'>订单</ComButton>
        </View>
      </View>
    </View>
    <ComScrollView className='IOO ' upperThreshold={200}
      onScroll={(e, top) => { if (e.detail.scrollTop > top) { ref_banner.current?.setIsHeaderBack(true); } }}
      onScrollToUpper={() => { ref_banner.current?.setIsHeaderBack(false); }}>
      <Video className='ww IOO mb10' controls={false} loop autoplay src='https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/temp_file/Weixin%20Videos2025-07-22_143936_700.mp4' />
      {page.pageNum !== 0 && Boolean(page.list.length) &&
        <View className='dll ww IOO'>

          {[...page.list].map((item, index) => <IIIItem0 item={item} key={index}
            count={cart.filter(e => e.id === item.id).length}
            onDetail={() => { setProduct(item); }}
            onAdd={async () => {
              // 添加数量不能超过剩余库存
              setCart((e) => {
                const count = e.filter(ee => ee.id === item.id).length;
                if (count >= item.stock) {
                  Taro.showToast({ icon: "none", title: "库存不足" });
                  return e;
                }
                return [...e, { ...item }];
              });
            }}
            onSub={() => { setCart(coo___arr_remove_one_duplicate_by_id(cart, "id", item.id)); }} />)
          }
        </View>
      }
      {(page.pageNum === 0 || page.list.length === 0) && <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)} />}
      {G_D && Boolean(page.list.length) && <IIIUsers deptId={G_D} />}
      <MMMFooter className='mb10' />
    </ComScrollView>
    <IIICartBar cart={cart} onClick={() => {
      if (!Boolean(cart?.length)) { Taro.showToast({ icon: "none", title: "购物车为空" }); return; }
      setIsShowCart(e => !e);
    }} />
    {isShowCart &&
      <ComPopupNew onClose={() => { setIsShowCart(e => !e); }} >
        <View className='dll prl10' style={{ height: "80vh", }}>
          <ComNavBarB className='mb10 ww' onClose={() => { setIsShowCart(e => !e); }} >
            <View className='ww dy'>
              <ComAddressSwitchor className="ww bcctrans" isShort addressPlaceholder='请填写收货地址' title='收货人:' address={address}
                onClick={async (e) => {
                  const res_address = await try_Taro_chooseAddress(true);
                  setAddress(res_address);
                }} />
              <ComButton rr className="cccplh bccbackdeep nw ml10" hoverClass='none' onClick={async () => {
                if (!Boolean(cart?.length)) { Taro.showToast({ icon: "none", title: "购物车为空" }); return; }
                await try_Taro_showModal({ title: "清空购物车", content: "确定清空购物车吗？", confirmText: "清空", cancelText: "取消" });
                setCart([]);
                Taro.showToast({ icon: "none", title: "已清空" });
              }}>清空</ComButton>
            </View>
          </ComNavBarB>
          <ComScrollView className='IOO'>
            {!Boolean(cart?.length) && <View className='dxy ww'><ComLoading className='mb10' isEmpty>购物车空空如也 ~</ComLoading></View>}
            {uniqueCart.map((item, index) => <IIIItem0 item={item} key={index}
              count={cart.filter(e => e.id === item.id).length}
              onAdd={async () => {
                Taro.showLoading({ mask: true, title: "加载中..." });
                const res_cart_new = await Api_goods_fetch_ctn(uniqueCart.map(e => e.id));
                // 添加数量不能超过剩余库存
                setCart((cart_old) => {
                  const cart_new = cart_old
                    .map(e => ({ ...e, count_old: cart_old.filter(ee => ee.id === e.id).length }))
                    .map(item_old => {
                      const item_new = res_cart_new.find(e => e.id === item_old.id);
                      return { ...item_new, need_sub: item_old.count_old - (item_new.stock >= 0 ? item_new.stock : 0) };
                    });
                  console.log("cart_new", cart_new);
                  const cart_new_filter = filterByStock(cart_new);

                  const count = cart_new_filter.filter(ee => ee.id === item.id).length;
                  if (count >= item.stock) {
                    try_Taro_hideLoading();
                    Taro.showToast({ icon: "none", title: "库存不足" });
                    return cart_new_filter;
                  }
                  return [...cart_new_filter, { ...item }];
                });
                try_Taro_hideLoading();
              }}
              onSub={async () => {
                Taro.showLoading({ mask: true, title: "加载中..." });
                const res_newCartItems = await Api_goods_fetch_ctn(uniqueCart.map(e => e.id));
                const __cart = cart.map(e => res_newCartItems.find(ee => ee.id === e.id) || e);
                setCart(coo___arr_remove_one_duplicate_by_id(__cart, "id", item.id));
                try_Taro_hideLoading();
              }} />)
            }
          </ComScrollView>
          <IIICartBar cart={cart} onClick={async () => {
            if (!Boolean(cart?.length)) { throw new Error("购物车为空"); }
            if (!Boolean(address)) { throw new Error("请选择收货地址"); }
            const res_cart_new = await Api_goods_fetch_ctn(uniqueCart.map(e => e.id));
            const cart_new = cart
              .map(e => ({ ...e, count_old: cart.filter(ee => ee.id === e.id).length }))
              .map(item_old => {
                const item_new = res_cart_new.find(e => e.id === item_old.id);
                return { ...item_new, need_sub: item_old.count_old - (item_new.stock >= 0 ? item_new.stock : 0) };
              });
            // 如果有元素的 need_sub 大于 0，则表示有元素的数量超过了库存
            if (cart_new.some(e => e.need_sub > 0)) {
              const cart_new_filter = filterByStock(cart_new);
              setCart(cart_new_filter);
              throw new Error("有商品库存不足，已为您调整购物车商品数量");
            }
            Taro.showLoading({ mask: true, title: "支付中...", });
            const payParam = await Api_goodsCart_preOrder_ctn({
              goodsItems: cart?.map(e => ({ id: e.id }))!,
              recMan: address!,
            });
            try {
              Taro.showLoading({ mask: true, title: "支付..." });
              await try_Taro_requestPayment({ ...payParam, package: payParam.packageStr });
              if (!await try_Taro_showModal({ title: "支付成功", content: `订单移到"已支付"列表`, confirmText: "知道了", cancelText: "查看订单" })) {
                try_Taro_navigateTo({ url: `/pages_user/user_orders?order_ST=${Order_ST.已付款}` });
              }
            } catch (err) {
              if (!await try_Taro_showModal({ title: "取消支付", content: `订单移到"待支付"列表`, confirmText: "知道了", cancelText: "查看订单" })) {
                try_Taro_navigateTo({ url: `/pages_user/user_orders?order_ST=${Order_ST.待付款}` });
              }
            } finally {
              setCart([]);
              page_init();
              setIsShowCart(e => !e);
              try_Taro_hideLoading();
              // 如果个人信息中没有默认的用户收件地址，则更新用户收件地址
              if (!selfInfo_S.defaultRecManAddress) {
                const res = await Api_user_edit_ctn({ defaultRecManAddress: address });
                useSTSelf.getState().sett(res);
              }
            }
          }} />
        </View>
      </ComPopupNew>}
    {product && <ComPopupNew onClose={() => { setProduct(null); }}  >
      <View className='dll prl10' style={{ height: "80vh", }}>
        <ComNavBarB className='mb10 ww' onClose={() => { setProduct(null); }} >
          <View className='ww dbtc'>
            <ComButton className='fwb bccback' hoverClass="none">详情</ComButton>
            <View className='dy' >
              {Boolean(cart.filter(e => e.id === product.id).length) && <ComButton className='bcctrans fs08' hoverClass='none'>{cart.filter(e => e.id === product.id).length}</ComButton>}
              <ComButton rr className='bccbackdeep cccgreen h2rem nw mr10 ' onClick={() => {
                setCart((e) => [...e, { ...product }]);
                Taro.showToast({ icon: "none", title: "已加购" });
              }} >+加</ComButton>
            </View>
          </View>
        </ComNavBarB>
        <ComScrollView className='IOO'>
          <View className='ww'>
            <View className=' dll ww prl10' >
              <ComButton ll className='bccback' hoverClass='none'>
                <View className='dbase'>
                  <Text className='nw1 mr6'>{product.name?.split("#")[0]}</Text>
                  <Text className='nw cccprice'>¥{product.price}</Text>
                </View>
              </ComButton>
              <View className='cccplh mb10 '>{product.name?.split("#")[1] ? product.name?.split("#")[1] : "没有简介"}</View>
            </View>
            {product.attachUrl.split(",").map((e, i) => {
              return <ComImage className='mb10' style={{ width: "100%" }} key={i} compress="300" mode='widthFix' src={e}></ComImage>;
            })}
          </View>
        </ComScrollView>
      </View>
    </ComPopupNew>}
  </MMMAAPage>;
};


const IIICartBar = ({ cart, onClick }: { cart: any[]; onClick: () => void; }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  return <View className='ww  pt10'>
    <View className='ww dr mb10'>
      <ComAddressSwitchor className="ww mr10 bcctrans" hoverClass='none' isShort title='团:' address={roo___my_dept(selfInfo_S)} />
      <ComCartPrice className='bcctrans' totalPrice={String(cart.reduce((sum, item) => sum + (item.price * 100), 0) / 100)} num={String(cart.length)}
        onClick={() => { onClick(); }} />
      <ComButton className='bccyellow ml10 nw' onClickO={() => { onClick(); }}>
        <ComSquare style={{ width: "calc(1.3 * var(--rem_base))" }} className='icon-wxpay mr4' />
        <Text className='fwb'>买</Text>
      </ComButton>
    </View>
  </View>;
};

const IIIUsers = React.memo(({ deptId }: { deptId: string; }) => {
  const [users, setUsers] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const Api_goods_groupBuyingUserList_ctn_callback = useCallback(async () => {
    if (!deptId) { return; }
    setLoading(true);
    const res = await Api_goods_groupBuyingUserList_ctn({ queryDeptId: deptId });
    setLoading(false);
    setUsers(res);
  }, [deptId]);
  useEffect(() => {
    Api_goods_groupBuyingUserList_ctn_callback();
  }, [Api_goods_groupBuyingUserList_ctn_callback]);

  useDidShow(() => {
    Api_goods_groupBuyingUserList_ctn_callback();
  });


  return <View className='ww prl10 dll'>
    <ComButton ll className='ml10 bcctrans mb10 cccplh' hoverClass='none'>今日跟团用户{loading ? '...' : ''}</ComButton>
    {users?.map((e, i) => {
      return <View className='dy mb10 ww' key={i}>
        <ComImage className='mr10 oo ovh' src={e.avatar}></ComImage>
        <ComButton ll className='bcctrans cccplh' hoverClass="none">{e.name ? e.name : coo___privacy_phone(e.mobile, 4, "该用户想匿名")}</ComButton>
      </View>;
    })}
    {users?.length === 0 && <ComLoading className='mb10' isEmpty >今天还没有人跟团哦 ~</ComLoading>}
    {!users && <ComLoading className='mb10' />}
  </View>;
});

const IIIItem0 = ({ item, count, onAdd, onSub, onDetail, }: { count: number, item: Product_Publish; onAdd: () => void, onSub: () => void; onDetail?: () => void; }) => {
  return (<>
    <View className='ww mb10 ioo ovh' style={{ display: "grid", gridTemplateColumns: "37% 63%" }}>
      <ComImage src={item.attachUrl?.split(",")[0]} style={{ width: "100%", aspectRatio: "1/1" }} onClick={onDetail} />
      <View className='dbtl ww pl10 pbt4'>
        <View className='ww hh dll ' onClick={onDetail} >
          <View className='dy mb1'>
            <ComTag className='bccblack cccwhitee'>精选</ComTag>
            <ComTag className='bccprice cccwhitee'>秒杀</ComTag>
          </View>
          <View className='dy mb1'><View className='cccbrown mr2 fwb nw'></View> <View className='fwb nw1'>{item.name?.split("#")[0]}</View> </View>
          <View className='dy mb2'>
            <ComTag className='cccbrown'>品质保证</ComTag>
            <ComTag className='cccplh'>极速退款</ComTag>
          </View>
          <View className='fs08 nw1'>已卖{item.totalSaleStock}份</View>
        </View>
        <View className='ww dbl ioo' >
          <View className='dll ww'>
            <ComPrice className='cccprice ml6' price={5.9} />
            <View className='fs08 cccplh cccprice ml6'>已售{item.totalSaleStock}件</View>
          </View>
          <View className='dy'>
            {Boolean(count) && <ComButton className='bcctrans fs08 nw' hoverClass='none'>{count}</ComButton>}
            {Boolean(count) && <ComButton className='bccbackdeep cccgreen mr10' onClick={onSub}>  - </ComButton>}
            <ComButton className='bccyellow nw' onClick={onAdd}>+加</ComButton>
          </View>
        </View>
      </View>
    </View >
  </>);
};


export const ComTag = ({ children, className = "bccprice cccwhite", style }: { children: string; className?: string; color?: string; style?: React.CSSProperties; } & Omit<ViewProps, "style">) => {
  return <View className={`mr6 fs07  prl4  ${className} border`} style={{ ...style, borderRadius: "calc(4 * var(--change_base)) !important", }}>{children}</View>;
};



function filterByStock(array) {
  const result: any[] = [];
  const idCounts = {}; // 记录每个id已经添加的数量

  for (const item of array) {
    // 如果need_sub <= 0，直接保留
    if (item.need_sub <= 0) {
      result.push(item);
      continue;
    }

    // 如果need_sub > 0，检查是否超过stock限制
    const currentCount = idCounts[item.id] || 0;

    if (currentCount < item.stock) {
      result.push(item);
      idCounts[item.id] = currentCount + 1;
    }
  }

  return result;
}
