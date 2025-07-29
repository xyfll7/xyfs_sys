// :: pages/index/index
import { Text, Video, View, ViewProps } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { Product_Publish } from '@xyfs/taro_uii';
import { Api_goods_groupBuyingUserList_ctn, Api_goods_list_ctn, Api_goodsCart_preOrder_ctn } from "@xyfs/taro_uii/api/api__goods";
import { Api_common_getShortLink_ctn, Api_dept_info_ctn, Api_user_edit_ctn } from '@xyfs/taro_uii/api/api__users';
import { ComAddressSwitchor } from '@xyfs/taro_uii/components/ComAddressSwitchor';
import { ComBanner } from '@xyfs/taro_uii/components/ComBanner';
import { ComButton, ComButtonOpen } from '@xyfs/taro_uii/components/ComButton';
import { ComImage } from '@xyfs/taro_uii/components/ComImage';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComNavBarB } from '@xyfs/taro_uii/components/ComNavBarB';
import { ComPopupNew } from '@xyfs/taro_uii/components/ComPopupNew';
import { ComCartPrice, ComPrice } from '@xyfs/taro_uii/components/ComPrice';
import { ComScrollView } from '@xyfs/taro_uii/components/ComScrollView';
import { ComSquare } from '@xyfs/taro_uii/components/ComSquare';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { MMMFooter } from '@xyfs/taro_uii/components/MMMFooter';
import { ErrorR, Order_ST } from '@xyfs/taro_uii/src/config';
import { roo___my_dept } from '@xyfs/taro_uii/src/roles';
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { Pagination } from '@xyfs/taro_uii/type_index';
import { AddressInfo, DeptInfo } from '@xyfs/taro_uii/type_user';
import { try_Taro_chooseAddress, try_Taro_hideLoading, try_Taro_navigateTo, try_Taro_requestPayment, try_Taro_setClipboardData, try_Taro_showModal } from '@xyfs/taro_uii/utils/try_catch';
import { useHook_pageListNew } from '@xyfs/taro_uii/utils/useHooks';
import { coo___arr_remove_duplicate_objects, coo___arr_remove_one_duplicate_by_id, coo___objToUrl, coo___string_privacy, coo___urlToObj } from '@xyfs/utils/util';
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
  const { G_D } = coo___urlToObj<{ G_D?: string; }>("G_D%3D201");


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
  const [product, setProduct] = useState<any>(
    // { "id": 6, "name": "延安山地苹果", "sketch": null, "intro": "重量6-7斤/12枚装/果径80-85", "keywords": null, "tags": null, "price": 58, "weight": 1, "marketPrice": null, "stock": 30, "warningStock": null, "limitQuantity": null, "attachUrl": "https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/product_image/oGwbL5PVdCTyoE2sYHAq2bdNA9BY/_1731288105472_0.png", "userId": "oGwbL5PVdCTyoE2sYHAq2bdNA9BY", "status": 1, "sort": 2, "lastUpdateTime": "2024-11-11 09:21:56", "delFlag": "0", "createBy": "oGwbL5PVdCTyoE2sYHAq2bdNA9BY", "createTime": "2024-11-11 09:21:56", "updateBy": null, "updateTime": null, "remark": "", "userName": "王理代", "userMobile": "17319969379", "userAvatar": "https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/comm_avatar/default/狗2@1x.webp", "totalSaleStock": null, "saleStock": null, "orderUser": null }
  );
  const ref_banner = React.useRef<{ setIsHeaderBack: (e: boolean) => void; }>(null);
  if (deptInfo) {
    deptInfo.shopAnnouncement = deptInfo.shopAnnouncement ? deptInfo.shopAnnouncement : "这个人很懒 🍒🐰​#这个人很懒,根本就不想写公告📝";
  }
  return <MMMAAPage className={`${isBanner ? "" : "bccback"}`}>
    <View className='ww'>
      {isBanner &&
        <ComBanner ref={ref_banner} className={`${isBanner ? "" : "bccback"}`} maskHightT='70%' maskHightF='10vh' />
      }
      <ComNav className='mb10 prl10' isRight>
        <ComNavBarA >
          <View className='ww dbtc ml10'>
            <View className='dy' >
              <ComImage className='mr10' src={deptInfo?.avatar} />
              <ComButton ll className="fs13 fwb bcctrans" hoverClass='none'><Text className='nw1'> {deptInfo?.deptName ?? "..."}</Text></ComButton>
            </View>
          </View>
        </ComNavBarA>
      </ComNav>
      <View className='ww dll prl10 bccback ' >
        <View className='ww dr'>
          <ComButton rr className={`mb10 cccplh bccbacktab `} hoverClass='none' onClick={async () => {
            if (!Boolean(cart?.length)) { Taro.showToast({ icon: "none", title: "购物车为空" }); return; }
            await try_Taro_showModal({ title: "清空购物车", content: "确定清空购物车吗？", confirmText: "清空", cancelText: "取消" });
            setCart([]);
            Taro.showToast({ icon: "none", title: "已清空" });
          }}>清空</ComButton>
          <ComButton rr className={`cccplh mb10 ml10 bccbacktab `} hoverClass='none' onClick={async () => {
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
          <ComButtonOpen rr className={`cccplh mb10 ml10  bccbacktab`} hoverClass='none' id='send_express'
            shareTitle={`${selfInfo_S.managerUser?.name} 团长 邀您买东西啦`}
            openType='share'
            sharePath={`/pages/group_buy?${coo___objToUrl({ scene: encodeURIComponent(coo___objToUrl({ G_D: G_D, R_D: Number(selfInfo_S.managerUser?.mobile).toString(36) })) })}`}>
            <View className='dbase'>
              {selfInfo_S.managerUser && <Text className='fs07 mr4 cccorange' >¥</Text>}
              <Text className='mr4'>分享</Text>
            </View>
          </ComButtonOpen>
          <ComButton className='cccplh mb10 bccbacktab ml10' url='/pages_user/user_orders'>订单</ComButton>
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
            onAdd={() => {
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
              <ComButton rr className="cccplh bccbacktab nw ml10" hoverClass='none' onClick={async () => {
                if (!Boolean(cart?.length)) { Taro.showToast({ icon: "none", title: "购物车为空" }); return; }
                await try_Taro_showModal({ title: "清空购物车", content: "确定清空购物车吗？", confirmText: "清空", cancelText: "取消" });
                setCart([]);
                Taro.showToast({ icon: "none", title: "已清空" });
              }}>清空</ComButton>
            </View>
          </ComNavBarB>
          <ComScrollView className='IOO'>
            {!Boolean(cart?.length) && <View className='dxy ww'><ComLoading className='mb10' isEmpty>购物车空空如也 ~</ComLoading></View>}
            {coo___arr_remove_duplicate_objects(cart, "id").map((item, index) => <IIIItem0 item={item} key={index}
              count={cart.filter(e => e.id === item.id).length}
              onAdd={() => {
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
          </ComScrollView>
          <IIICartBar cart={cart} onClick={async () => {
            if (!Boolean(cart?.length)) { throw new ErrorR("购物车为空", true); }
            if (!Boolean(address)) { throw new ErrorR("请选择收货地址", true); }
            Taro.showLoading({ mask: true, title: "支付中...", });
            const { payParam } = await Api_goodsCart_preOrder_ctn({
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
            <View className='pr' onClick={() => {
              setCart((e) => [...e, { ...product }]);
              Taro.showToast({ icon: "none", title: "已加购" });
            }} >
              {Boolean(cart.filter(e => e.id === product.id).length) && <View className='pa z1 cccprice fs08 fwb' style={{ top: "0.1rem", left: "0.2rem" }}>{cart.filter(e => e.id === product.id).length}</View>}
              <ComButton rr className=' bccyellow h2rem nw mr10 fwb' style={{ transform: `skewX(${"-7deg"})` }} >+ 加</ComButton>
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
              return <ComImage className='mb10' style={{ width: "100%" }} compress="300" mode='widthFix' src={e}></ComImage>;
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
      <ComAddressSwitchor className="ww mr10 bcctrans" isShort title='团:' address={roo___my_dept(selfInfo_S)} url='/pages_user/user_regiment_list_map' />
      <ComCartPrice className='bcctrans' totalPrice={String(cart.reduce((sum, item) => sum + (item.price * 100), 0) / 100)} num={String(cart.length)}
        onClick={() => { onClick(); }} />
      <ComButton className='bccyellow ml10 nw' onClickO={() => { onClick(); }}>
        <ComSquare style={{ width: "calc(1.3 * var(--rem_base))" }} className='icon-wxpay mr4' />
        <Text>买</Text>
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
        <ComButton ll className='bcctrans cccplh' hoverClass="none">{e.name ? e.name : coo___string_privacy(e.mobile, { isPhone: true, placeholder: "该用户想匿名" })}</ComButton>
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
          <View className='fs08 cccbrown nw1'>陕北苹果排行版第1名</View>
        </View>
        <View className=' ww dbtc ioo ovh' style={{ background: "#ffff0029", minHeight: '2.5rem', }}>
          <View className='dll '>
            <ComPrice className='cccprice ml6' price={5.9} />
            <View className='fs08 cccplh fs07 cccprice ml6'>已售{item.totalSaleStock}件</View>
          </View>
          <View className='dbr'>
            {Boolean(count) && <ComButton className='bccbacktab cccgreen mr10' hoverClass='none' style={{ transform: `skewX(${"-7deg"})` }} onClick={onSub}>  - </ComButton>}
            <View className='pr' onClick={onAdd}>
              {Boolean(count) && <View className='pa z1 cccprice fs08 fwb' style={{ top: "0.1rem", left: "0.2rem" }}>{count}</View>}
              <ComButton className='bccyellow fwb' style={{ minHeight: '2.5rem', transform: `skewX(${"-7deg"})` }} >+ 加</ComButton>
            </View>
          </View>
        </View>
      </View>
    </View >
  </>);
};


export const ComTag = ({ children, className = "bccprice cccwhite", style }: { children: string; className?: string; color?: string; style?: React.CSSProperties; } & Omit<ViewProps, "style">) => {
  return <View className={`mr6 fs07  prl4  ${className} border`} style={{ ...style, borderRadius: "calc(4 * var(--change_base)) !important", }}>{children}</View>;
};



