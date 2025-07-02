// :: pages/group_buy
import { Text, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
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
import { ComCartPrice } from '@xyfs/taro_uii/components/ComPrice';
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
import { useHook_getCurrentInstance, useHook_pageListNew } from '@xyfs/taro_uii/utils/useHooks';

import { coo___objToUrl, coo___string_privacy, coo___urlToObj } from '@xyfs/utils/util';
import React, { FC, useCallback, useEffect, useState } from 'react';

definePageConfig({
  enableShareAppMessage: true, navigationStyle: "custom", disableScroll: true,
  // "styleIsolation": "apply-shared",
  // "componentFramework": "glass-easel",
  // "renderer": "skyline",
});





export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC = () => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const { options } = useHook_getCurrentInstance<{ scene?: string; }>();
  const { G_D } = coo___urlToObj<{ G_D?: string; }>(options?.scene);


  const [type, setType] = useState<"visualEdition" | "simpleEdition">("simpleEdition");
  const isBanner = true;
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

  const [product, setProduct] = useState<any>(
    // { "id": 6, "name": "延安山地苹果", "sketch": null, "intro": "重量6-7斤/12枚装/果径80-85", "keywords": null, "tags": null, "price": 58, "weight": 1, "marketPrice": null, "stock": 30, "warningStock": null, "limitQuantity": null, "attachUrl": "https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/product_image/oGwbL5PVdCTyoE2sYHAq2bdNA9BY/_1731288105472_0.png", "userId": "oGwbL5PVdCTyoE2sYHAq2bdNA9BY", "status": 1, "sort": 2, "lastUpdateTime": "2024-11-11 09:21:56", "delFlag": "0", "createBy": "oGwbL5PVdCTyoE2sYHAq2bdNA9BY", "createTime": "2024-11-11 09:21:56", "updateBy": null, "updateTime": null, "remark": "", "userName": "王理代", "userMobile": "17319969379", "userAvatar": "https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/comm_avatar/default/狗2@1x.webp", "totalSaleStock": null, "saleStock": null, "orderUser": null }
  );
  const ref_banner = React.useRef<{ setIsHeaderBack: (e: boolean) => void; }>(null);
  return <MMMAAPage className={`${isBanner ? "" : "bccback"}`}>
    <View className='ww'>
      {isBanner &&
        <ComBanner ref={ref_banner} className={`${isBanner ? "" : "bccback"}`} maskHightT='70%' maskHightF='10vh' />
      }
      <ComNav className='mb10 prl10' isRight>
        <ComNavBarA className='mb10 '>
          <View className='ww dbtc ml10'>
            <View className='dy' >
              <ComImage className='mr10' src={deptInfo?.avatar} />
              <ComButton ll className="cccorange  fs13 fwb bcctrans" hoverClass='none'><Text className='nw1'> {deptInfo?.deptName ?? "..."}</Text></ComButton>
            </View>
          </View>
        </ComNavBarA>
      </ComNav>

    </View>
    <ComScrollView className='IOO ' upperThreshold={200}
      onScroll={(e, top) => { if (e.detail.scrollTop > top) { ref_banner.current?.setIsHeaderBack(true); } }}
      onScrollToUpper={() => { ref_banner.current?.setIsHeaderBack(false); }}>
      <View className='ww dll prl10'>
        <ComButton ll className={`mb10 cccplh bcctrans nw1 `} hoverClass='none'>今日下单明日送达 🚗 🛵 🎁</ComButton>
      </View>
      {page.pageNum !== 0 && Boolean(page.list.length) &&
        <View className='dll ww bccwhite pt10 mb10 prl10 IOO'>
          <View className='ww dll prl10'>
            <View className='ww dr'>
              <ComButton rr className={`mb10 cccplh bborder `} onClick={() => { setCart([]); }}>清空</ComButton>
              <ComButton rr className={`mb10 cccplh nw ml10 bborder `} onClick={() => {
                setType(type == "simpleEdition" ? "visualEdition" : "simpleEdition");
              }}>{new Map([["visualEdition", "图文版"], ["simpleEdition", "简洁版"]]).get(type)} </ComButton>
              <ComButton rr className={`cccplh mb10 ml10 bborder `} onClick={async () => {
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
              <ComButtonOpen rr className={`cccplh mb10 ml10 bborder `} id='send_express'
                shareTitle={`${selfInfo_S.managerUser?.name} 团长 邀您买东西啦`}
                openType='share'
                sharePath={`/pages/group_buy?${coo___objToUrl({ scene: encodeURIComponent(coo___objToUrl({ G_D: G_D, R_D: Number(selfInfo_S.managerUser?.mobile).toString(36) })) })}`}>
                <View className='dbase'>
                  {selfInfo_S.managerUser && <Text className='fs07 mr4 cccorange' >¥</Text>}
                  <Text className='mr4'>分享</Text>
                </View>
              </ComButtonOpen>

            </View>
          </View>
          {
            [...page.list].map((item, index) => <IIIItem item={item} key={index} type={type}
              count={cart.filter(e => e.id === item.id).length}
              onDetail={() => { setProduct(item); }}
              onAdd={() => {
                // 添加数量不能超过剩余库存
                setCart((e) => {
                  const count = e.filter(ee => ee.id === item.id).length;
                  if (count >= item.stock) {
                    Taro.showToast({ icon: "none", title: "已达最大库存" });
                    return e;
                  }
                  return [...e, { ...item }];
                });
              }}
              onSub={() => { setCart(cart.filter((_, i) => cart.findIndex(e => e.id === item.id) != i)); }} />)
          }
        </View>
      }
      {(page.pageNum === 0 || page.list.length === 0) && <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)} />}
      {G_D && Boolean(page.list.length) && <IIIUsers deptId={G_D} />}
      <MMMFooter className='mb10' />
    </ComScrollView>
    <View className='ww dll pt10'>
      <View className='ww dr mb10'>
        <ComAddressSwitchor className="ww bcctrans" isShort addressPlaceholder='请填写收货地址' title='收货人:' address={address}
          onClick={async (e) => {
            const res_address = await try_Taro_chooseAddress(true);
            setAddress(res_address);
          }} />
        {/* <ComButton className='cccgreen bborder ml10 nw'>到付</ComButton> */}
      </View>
      <View className='ww dr mb10'>
        <ComAddressSwitchor className="ww mr10 bcctrans" isShort isIcon title='团:' address={roo___my_dept(selfInfo_S)} url='/pages_user/user_regiment_list_map' />
        <ComCartPrice className='bcctrans' totalPrice={String(cart.reduce((sum, item) => sum + (item.price * 100), 0) / 100)} num={String(cart.length)} />
        <ComButton className='bccyellow ml10 nw' onClickO={async () => {
          if (!Boolean(cart?.length)) { throw new ErrorR("购物车为空", true); }
          if (!Boolean(address)) { throw new ErrorR("请选择收货地址", true); }
          Taro.showLoading({ mask: true, title: "支付中...", });
          const res_pay = await Api_goodsCart_preOrder_ctn({
            goodsItems: cart?.map(e => ({ id: e.id }))!,
            recMan: address!,
          });
          try {
            Taro.showLoading({ mask: true, title: "支付..." });
            await try_Taro_requestPayment({ ...res_pay, package: res_pay.packageStr });
            if (!await try_Taro_showModal({ title: "支付成功", content: `订单移到"已支付"列表`, confirmText: "知道了", cancelText: "查看订单" })) {
              try_Taro_navigateTo({ url: `/pages_user/user_orders?order_ST=${Order_ST.已付款}` });
            }
          } catch (err) {
            if (!await try_Taro_showModal({ title: "支付失败", content: `订单移到"待支付"列表`, confirmText: "知道了", cancelText: "查看订单" })) {
              try_Taro_navigateTo({ url: `/pages_user/user_orders?order_ST=${Order_ST.待付款}` });
            }
          } finally {
            setCart([]);
            page_init();
            try_Taro_hideLoading();
            // 如果个人信息中没有默认的用户收件地址，则更新用户收件地址
            if (!selfInfo_S.defaultRecManAddress) {
              const res = await Api_user_edit_ctn({ defaultRecManAddress: address });
              useSTSelf.getState().sett(res);
            }
          }
        }}>
          <ComSquare style={{ width: "calc(1.3 * var(--rem_base))" }} className='icon-wxpay mr4' />
          <Text>买</Text>
        </ComButton>
      </View>
    </View>
    {product && <ComPopupNew onClose={() => { setProduct(null); }}  >
      <View className='dll prl10' style={{ height: "70vh", }}>
        <ComNavBarB className='mb10 ww' onClose={() => { setProduct(null); }} >
          <View className='ww dbtc'>
            <ComButton className='fwb bccback' hoverClass="none">详情</ComButton>
            <ComButton rr className=' bccyellow h2rem nw mr10' onClick={() => {
              setCart((e) => [...e, { ...product }]);
              Taro.showToast({ icon: "none", title: "已加购" });
            }} >+ 加购</ComButton>
          </View>
        </ComNavBarB>
        <ComScrollView className='IOO'>
          <View className='ww'>
            <View className=' dll ww prl10' >
              <ComButton ll className='bccback' hoverClass='none'>
                <View className='dbase'>
                  <Text className='nw1 mr6'>{product.name}</Text>
                  <Text className='nw cccprice'>¥{product.price}</Text>
                </View>
              </ComButton>
              <View className='cccplh mb10 '>{product.intro ? product.intro : "没有简介"}</View>
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

const IIIItem = ({ item, type, onAdd, onSub, onDetail, count }: { count: number, item: any; type: "visualEdition" | "simpleEdition"; onAdd: () => void, onSub: () => void; onDetail: () => void; }) => {
  if (type == "simpleEdition") {
    return <View className='dll ww bccback IOO prl10 mb10'  >
      <View className='dbtc ww'>
        <View className='pt4 dll ww' onClick={onDetail}>
          <ComButton ll className='bccback' hoverClass='none'>
            <View className='dbase'>
              <Text className='nw1 mr6'>{item.name}</Text>
              <Text className='nw cccprice mr6'>¥{item.price}</Text>
              {count > 0 && <View className='bcctrans cccprice nw fs08'> {count}<Text className='cccplh'>/{item.stock}</Text> </View>}
            </View>
          </ComButton>
          <View className='cccplh mb10 nw1'>{item.intro ? item.intro : "没有简介"}</View>
        </View>
        <View className='dy'>
          <View>
            <ComButton className={`bccbacktab cccgreen ${count > 0 ? "" : "vbh"}`} hoverClass='none' onClick={onSub}>-</ComButton>
          </View>
          <ComButton rr className='bccwhite nw ml10 cccgreen' onClick={onAdd}>+ 加</ComButton>
        </View>
      </View>
    </View>;
  } else {
    return <View className='dll ww bccback pt10 IOO prl10 mb10' >
      <View onClick={onDetail} >
        <ComButton ll className='bcctrans' hoverClass='none'>
          <View className='dbase'>
            <Text className='nw1 mr6 '>{item.name}</Text>
            <Text className='nw cccprice'>¥{item.price}</Text>
            {count > 0 && <View className='bcctrans cccprice nw fs08'> /{count}</View>}
          </View>
        </ComButton>
        <View className='cccplh mb10 nw2'>{item.intro ? item.intro : "没有简介"}</View>
      </View>
      <View className='ww dbl'>
        <View className='dy mb10 ww ' onClick={onDetail}>
          {item.attachUrl?.split(",").slice(0, 3).map((e, i) => {
            return <ComImage className='mr10' style={{ width: '4rem' }} src={e} key={i}></ComImage>;
          })}
        </View>
        <View className='dbl dr ww mb10' >
          <View>
            <ComButton className={`bccbacktab cccgreen ${count > 0 ? "" : "vbh"}`} hoverClass='none' onClick={onSub}>-</ComButton>
          </View>
          <ComButton rr className='ml10 bccyellow h2rem nw' onClick={onAdd} >+ 加购</ComButton>
        </View>
      </View>
    </View>;
  }
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