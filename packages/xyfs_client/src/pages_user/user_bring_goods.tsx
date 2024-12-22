// :: pages_user/user_bring_goods
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Pagination } from "@xyfs/taro_uii";
import { Api_goods_list_ctn, Api_goodsCart_add_ctn, Api_goodsCart_preOrder_ctn, Api_goodsCart_query_ctn } from "@xyfs/taro_uii/api/api__goods";
import { ComAddressSwitchor } from "@xyfs/taro_uii/components/ComAddressSwitchor";
import { ComBanner } from "@xyfs/taro_uii/components/ComBanner";
import { ComButton } from "@xyfs/taro_uii/components/ComButton";
import { ComImage, ComImageStack } from "@xyfs/taro_uii/components/ComImage";
import { ComLoading } from "@xyfs/taro_uii/components/ComLoading";
import { ComMobileLogin } from "@xyfs/taro_uii/components/ComMobileLogin";
import { ComNav } from "@xyfs/taro_uii/components/ComNav";
import { ComNavBarA } from "@xyfs/taro_uii/components/ComNavBarA";
import { ComCartPrice } from "@xyfs/taro_uii/components/ComPrice";
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSquare } from "@xyfs/taro_uii/components/ComSquare";
import { ComSELFView, MMMAAPage } from "@xyfs/taro_uii/components/MMMAAPage";
import { ErrorR, Order_ST } from "@xyfs/taro_uii/src/config";
import { roo___role_getRoleName, roo___role_regiment } from "@xyfs/taro_uii/src/roles";
import { useSTSelf } from "@xyfs/taro_uii/store/store";
import { AddressInfo } from "@xyfs/taro_uii/type_user";
import { try_Taro_chooseAddress, try_Taro_navigateTo, try_Taro_requestPayment, try_Taro_showModal } from "@xyfs/taro_uii/utils/try_catch";
import { useHook_pageListNew } from "@xyfs/taro_uii/utils/useHooks";
import { FC, useCallback, useEffect, useState } from "react";

definePageConfig({ enableShareAppMessage: true, navigationStyle: "custom", disableScroll: true, });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC = () => {
  const [isHeaderBack, setIsHeaderBack] = useState(false);

  const selfInfo_S = useSTSelf(s => s.selfInfo!);

  const [address, setAddress] = useState<AddressInfo | undefined>(selfInfo_S.defaultRecManAddress);
  const [cart, setCart, getCart] = useCart();

  const ___page_getter = useCallback(async (p: Pagination<unknown>) =>
    await Api_goods_list_ctn({
      ...p,
      sort: "desc",
      keyword: "",
    }), []);
  const { page, page_loading, } = useHook_pageListNew(___page_getter,);
  return <MMMAAPage>
    <View className='ww'>
      <ComBanner isHeaderBack={isHeaderBack} src='https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/back_image_35.jpg' />
      {/* <ComBanner isHeaderBack={isHeaderBack} src='https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/myfiles_xyfll7/back_image_11.jpg' /> */}
      <ComNav className='transall' isRight>
        <ComNavBarA className='mb10 pl10 ww' >
          <View className='ww dbtc'>
            <ComButton className={`bcctrans cccplh ${isHeaderBack ? "" : 'vbh'}`}>今日优选</ComButton>
            <ComButton className='nw bcctrans01-dark' url='/pages_user/user_orders'>订单</ComButton>
          </View>
        </ComNavBarA>
      </ComNav>
    </View>
    <ComScrollView
      className='IOO'
      upperThreshold={100}
      onScroll={(e, top) => { if (e.detail.scrollTop > top) { setIsHeaderBack(true); } }}
      onScrollToUpper={() => { setIsHeaderBack(false); }}>
      <View style={{ height: "25vh" }} >
        <View className='sticky-top dll pt20 pb10 pl10'>
          <ComButton className='cccwhite bcctrans03-dark dll' hoverClass='none'>
            <View className='lh100 fs19 fwb'>延安苹果</View>
            <View className='lh100'>绿色种植，天然健康，产地直供，品质保证</View>
          </ComButton>
        </View>
      </View>
      {page?.list?.map((e, i) => {
        return <IIIGoodCard cart={cart} className='mb10' data={e} key={i}
          onAdd={async (ee) => {
            Taro.showLoading({ mask: true, title: "加..." });
            const res = await Api_goodsCart_add_ctn<GoodsCart>({ goodsId: e.id, id: ee?.id ?? "", quantity: 1, });
            setCart(res);
            Taro.hideLoading();
          }}
          onSub={async (ee) => {
            Taro.showLoading({ mask: true, title: "减..." });
            const res = await Api_goodsCart_add_ctn<GoodsCart>({ goodsId: e.id, id: ee?.id ?? "", quantity: -1, });
            setCart(res);
            Taro.hideLoading();
          }} />;
      })}
      <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => { }} />
    </ComScrollView>
    <View className='pt10 dll  ww'>
      <ComMobileLogin className=' mb10' />
      <View className='ww dbtc '>
        <ComAddressSwitchor className='bccback mb10 ww' style={{ minWidth: "50%" }} isShort isIcon title='收货人:' addressLess='请选择收货地址' address={address} onClick={async () => {
          const res_address = await try_Taro_chooseAddress();
          setAddress(res_address);
        }} />
        <ComCartPrice className='mb10' totalPrice={cart?.totalPrice} num={cart?.num} />
      </View>

      <View className='ww dbtc'>
        <ComAddressSwitchor className='bccback mb10 mr10' isShort isIcon title={`${roo___role_getRoleName(selfInfo_S)}:`} address={roo___role_regiment(selfInfo_S)} url='/pages_user/user_regiment_list_map' />
        <ComButton className='bccyellow fwb mb10' disabled={!Boolean(cart?.itemList.length) || !Boolean(address) || !Boolean(selfInfo_S.mobile)} onClickO={async () => {
          if (!selfInfo_S.mobile) { throw new ErrorR("请先“手机号快捷登录”", true); }
          if (!Boolean(cart?.itemList?.length)) { throw new ErrorR("购物车为空", true); }
          if (!Boolean(address)) { throw new ErrorR("请选择收货地址", true); }

          const res_pay = await Api_goodsCart_preOrder_ctn({
            cartItemIds: cart?.itemList?.map(e => e.id)!,
            goodsCartId: cart?.id!,
            recMan: address!,
          });

          try {
            Taro.showLoading({ mask: true, title: "支付...", });
            await try_Taro_requestPayment({ ...res_pay, package: res_pay.packageStr });
            Taro.hideLoading();
            if (await try_Taro_showModal({ title: "支付完成", content: `订单移到"已支付"列表`, confirmText: "查看订单", cancelText: "留在本页" })) {
              try_Taro_navigateTo({ url: `/pages_user/user_orders?order_ST=${Order_ST.已付款}` });
            }
          } catch (err) {
            if (await try_Taro_showModal({ title: "取消支付", content: `订单移到"待支付"列表`, confirmText: "查看订单", cancelText: "留在本页" })) {
              try_Taro_navigateTo({ url: `/pages_user/user_orders?order_ST=${Order_ST.待付款}` });
            }
          } finally {
            await getCart();
          }
        }}>
          <View className='dy'>
            <ComSquare className='icon-wxpay mr4' style={{ width: "calc(1.3 * var(--rem_base))" }} />
            <Text className='nw'>买</Text>
          </View>
        </ComButton>
      </View>
    </View>
  </MMMAAPage>;
};





interface GoodsCart {
  createBy: string;// "oHt125JZ0IV1XI_y8iOt0wTR8P-M";
  createTime: string;//"2024-08-31 14:18:30";
  delFlag: string;//null;
  id: number;// 3;
  itemList: any[];
  lastUpdateTime: string;// "2024-08-31 14:18:30";
  num: string;//0;
  remark: string;// null;
  status: string;//"0";
  totalPrice: string;// 0;
  updateBy: string;// null;
  updateTime: string;// null;
  userId: string;// "oHt125JZ0IV1XI_y8iOt0wTR8P-M";
}


function useCart(): [GoodsCart | undefined, React.Dispatch<React.SetStateAction<GoodsCart | undefined>>, () => Promise<void>] {
  const [cart, setCart] = useState<GoodsCart>();
  async function getCart() {

    const res = await Api_goodsCart_query_ctn();
    setCart(res);

  }
  useEffect(() => { getCart(); }, []);
  return [cart, setCart, getCart];
}


function IIIGoodCard({ className, data, onAdd, onSub, cart }: { cart?: GoodsCart; className?: string; data: any; onAdd: (e?: any) => void, onSub: (e?: any) => void; }) {
  const cartItem = cart?.itemList.find(e => { return e.goodsId === data.id; });
  return <View className={`dll ww bccwhite IOO ${className}`}>
    <View className='ww  IOO mb10 ovh'>
      <View className='dxy ww  bccbacktab' >
        <ComImage compress src={data.attachUrl?.split(",")[0]} style={{ height: "57vw", width: "100%" }} mode='aspectFill' />
      </View>
      <View className='ww z1 dbtl pr10 pt10 pa hh pl10' style={{ top: "0", }}>
        <ComButton className='bcctrans03-dark ioo' hoverClass='none'>
          <View className='dll'>
            <View className='cccwhitee fwb'>{data.name}</View>
            <View className='cccwhitee fwb'>{data.intro}</View>
            <View className='dbase cccprice fwb'>
              <Text className='fs08'>￥</Text>
              <Text>{data.price}元</Text>
            </View>
          </View>
        </ComButton>
        <View className='ww dr'>
          <View className={`ioo  bcctrans03-dark  mb10  transall ovh ${cartItem ? "w6rem" : "w2rem"}`}>
            {cartItem && <View className='dy'>
              <ComButton rr ll className=' w2rem dl' onClick={() => onSub(cartItem)}><Text className='cccgreen'>-</Text>减</ComButton>
              <ComButton className='bcctrans cccwhitee fwb dxy w2rem' hoverClass='none'>{cartItem.quantity}</ComButton>
              <ComButton rr ll className=' w2rem dr' onClick={() => onAdd(cartItem)}><Text className='cccgreen'>+</Text>加</ComButton>
            </View>
            }
            {!cartItem && <ComButton rr ll className=' w2rem dr' onClick={() => onAdd(cartItem)}>
              <View className='dbase'><Text className='cccgreen'>+</Text><Text>买</Text></View>
            </ComButton>
            }
          </View>
        </View>
      </View>
    </View>
    <View className='prl10 dbtc ww mb10'>
      <View className='dy'>
        {Boolean(data?.orderUser.length) && <ComImageStack className='mr6' length={5} avatars={data?.orderUser?.map((e: any) => e.avatar)}
          onClick={() => { }}>
        </ComImageStack>
        }

        <ComButton ll className='bcctrans cccplh'>
          已售{data.totalSaleStock}份
        </ComButton>
      </View>

      <ComButton rr ll className='cccwhitee o6 fs09 ovh' style={{ minHeight: "calc(0 * var(--rem_base)) ", border: "2rpx solid var(--color_price)" }}  >
        <View className='dy'>
          <View className='bccprice prl4'>
            损坏包退
          </View>
          {Boolean(data?.limitQuantity) && <View className='cccprice prl4'>限购{data?.limitQuantity}件</View>}
          {!Boolean(data?.limitQuantity) && <View className='cccprice prl4'>不限购</View>}
        </View>
      </ComButton>
    </View>
  </View>;
}

