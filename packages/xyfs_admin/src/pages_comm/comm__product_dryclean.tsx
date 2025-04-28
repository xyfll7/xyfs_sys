// :: pages_comm/comm__product_dryclean
import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Api_cart_clear_ctn, Api_cart_delete_ctn, Api_cart_list_ctn, Api_cart_preOrder_ctn } from '@xyfs/taro_uii/api/api__shop';
import CPDryclean from '@xyfs/taro_uii/compages/CPDryclean';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComInput } from '@xyfs/taro_uii/components/ComInput';
import { ComListTypeSelectorNew } from '@xyfs/taro_uii/components/ComListTypeSelectorNew';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComPopupNew } from '@xyfs/taro_uii/components/ComPopupNew';
import { ComScrollView } from '@xyfs/taro_uii/components/ComScrollView';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { MMMPoster, MMMPosterDryclean } from '@xyfs/taro_uii/components/MMMPoster';
import { Order_ST } from '@xyfs/taro_uii/src/config';
import { roo___has_role } from '@xyfs/taro_uii/src/roles';
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { OrderInfo, Product_Dryclean } from '@xyfs/taro_uii/type_product';
import { Taro_getCurrentInstance, try_Taro_navigateTo, try_Taro_requestPayment, try_Taro_showModal } from '@xyfs/taro_uii/utils/try_catch';
import { utils_get_qrcode } from '@xyfs/taro_uii/utils/util';
import { coo___objToUrl } from '@xyfs/utils/util';
import { FC, PropsWithChildren, useEffect, useState } from 'react';

definePageConfig({ navigationStyle: "custom", enableShareAppMessage: true, disableScroll: true });
export default function COMSELFWarp() { return <ComSELFView isRefreshSelfInfo_SEveryTime><Index></Index></ComSELFView >; };

const Index: FC<{}> = ({ }) => {
  const [show, setShow] = useState(false);

  const { options } = Taro_getCurrentInstance<{ order_info: string; }>();
  const _order: OrderInfo<Product_Dryclean> | undefined = options.order_info && JSON.parse(decodeURIComponent(decodeURIComponent(options.order_info)));
  const [cartItem, setCartItem] = useState<Product_Dryclean | null>(null);

  const [user, setUser] = useState({
    name: _order?.userAddress?.name ?? "",
    mobile: _order?.userAddress?.mobile ?? "",
  });
  const [cart, setCart] = useState<Product_Dryclean[]>([]);
  useEffect(() => {
    (async () => {
      if (options.order_info) {
        await Api_cart_clear_ctn();
        setCart([]);
      } else {
        const res = await Api_cart_list_ctn();
        setCart(res);
      }
    })();
  }, [options.order_info]);


  const __isShare = Boolean(cart.length) && /^(1)\d{10}$/.test(user.mobile);

  return <IIIMain cart={cart}
    onCartEdit={(e) => { setCartItem(e); }}
    onCartDelItem={async (e) => {
      Taro.showLoading({ mask: true, title: "处理中..." });
      const res = await Api_cart_delete_ctn({ id: String(e.id!) });
      setCart(res);
      Taro.hideLoading();
    }}>
    {roo___has_role(useSTSelf.getState().selfInfo!, ["REGIMENT"]) &&
      <View>
        <View className='pt10'>
          <CPDryclean.ShopCartTabBarRegiment key='ShopCartTabBarRegiment' isPay={!__isShare} cart={cart} onToggle={async () => {
            if (!(cart!.length! > 0)) { throw new Error('购物车是空的～'); }
            setShow(e => !e);
          }} onPay={async () => {
            if (!Boolean(cart.length)) { throw new Error("购物车是空的，先去选购吧～"); }
            if (!user.mobile) { throw new Error("请输入顾客手机号"); }
            if (!/^(1)\d{10}$/.test(user.mobile)) { throw new Error("请输入正确的手机号"); }
            Taro.showLoading({ mask: true, title: '支付...' });
            const res_pay = await Api_cart_preOrder_ctn({
              ...(_order ? { orderId: _order.id, } : null),
              ids: cart.map(e => String(e.id)),
              userMobile: user.mobile,
              userName: user.name,
              nowPay: true,
            });
            try {
              await try_Taro_requestPayment({ ...res_pay, package: res_pay.packageStr });
              if (await try_Taro_showModal({
                title: "支付成功",
                content: `订单移到"已支付"列表`,
                confirmText: "查看订单",
                cancelText: "留在本页"
              })) {
                await try_Taro_navigateTo({ url: `/pages_comm/icomm_orders_dryclean?order_ST=${Order_ST.已付款}` });
              }
            } catch (err) {
              if (await try_Taro_showModal({
                title: "取消支付",
                content: `订单移到"待支付"列表`,
                confirmText: "查看订单",
                cancelText: "留在本页"
              })) {
                await try_Taro_navigateTo({ url: `/pages_comm/icomm_orders_dryclean?order_ST=${Order_ST.待付款}` });
              }
            } finally {
              setCart([]);
              setUser(() => ({ name: "", mobile: "" }));
              Taro.hideLoading();
            }
          }}>
            <View className='dy'>
              <ComButton className='mb10 bccbacktab ww mr10' hoverClass='none'>
                <ComInput cursorSpacing={100} placeholder='顾客姓名/可选' value={user.name} onInput={(e) => setUser(ee => ({ ...ee, name: e.detail.value }))} />
              </ComButton>
              <ComButton ll className='mb10 bccbacktab ww mr10' hoverClass='none'>
                <ComInput cursorSpacing={100} placeholder='顾客电话/必填' value={user.mobile} onInput={(e) => setUser(ee => ({ ...ee, mobile: e.detail.value }))} type='number' />
              </ComButton>
              <CPDryclean.Sharer ll key='Sharer' className='mb10 ' isShare={__isShare}
                onGetOrderCode={async () => {
                  if (!Boolean(cart.length)) { throw new Error("购物车是空的，先去选购吧～"); }
                  if (!user.mobile) { throw new Error("请输入顾客手机号"); }
                  if (!/^(1)\d{10}$/.test(user.mobile)) { throw new Error("请输入正确的手机号"); }
                  Taro.showLoading({ mask: true, title: "生成中..." });
                  const res_shareOrder = await Api_cart_preOrder_ctn({
                    ...(_order ? { orderId: _order.id, } : null),
                    ids: cart.map(e => String(e.id)),
                    userMobile: user.mobile,
                    userName: user.name,
                  });
                  return res_shareOrder.orderCode;

                }} onClearCart={async () => { setCart([]); setUser(() => ({ name: "", mobile: "" })); }} />
            </View>
          </CPDryclean.ShopCartTabBarRegiment>
        </View>
        {show && <ComPopupNew className='ww' onClose={() => setShow(e => !e)}>
          <CPDryclean.ShopCart

            onCartEdit={(e) => { setCartItem(e); }}
            onCartDel={async (e) => {
              Taro.showLoading({ mask: true, title: "处理中..." });
              const res = await Api_cart_delete_ctn({ id: String(e.id!) });
              setCart(res);
              Taro.hideLoading();
            }}
            cart={cart} onToggle={() => setShow(e => !e)}>
            <CPDryclean.ShopCartTabBarRegiment key='ShopCartTabBarRegiment' isPay={!__isShare} cart={cart} onToggle={() => setShow(e => !e)} />
          </CPDryclean.ShopCart>
        </ComPopupNew>
        }
        {cartItem && <ComPopupNew isShowTopClose onClose={() => setCartItem(null)}>
          <CPDryclean.CartItemEditor onSetCart={(e) => { setCart(e); }} cartItem={cartItem} onToggle={() => { setCartItem(null); }} />
        </ComPopupNew>
        }
      </View>
    }
  </IIIMain>;
};






function IIIMain({ cart, onCartDelItem, onCartEdit, ...props }: PropsWithChildren & { cart?: Product_Dryclean[], onCartEdit: (e: Product_Dryclean) => void; onCartDelItem: (e: Product_Dryclean) => void; }) {
  const [tabIndex, setTabIndex] = useState<number>(8);
  const [tabItems] = CPDryclean.useTabItems();
  const [productCategory] = CPDryclean.useProducts(tabIndex);
  const [posterUrl, setPosterUrl] = useState("");



  const ___test_boo = true;

  return <MMMAAPage>
    <View className='prl10'>
      <ComNav isRight className='ww '>
        <View className='ww dbtc '>
          <ComNavBarA className='mb10 '>
            <ComButton ll className='bcctrans cccplh ml10'>干洗服务</ComButton>
          </ComNavBarA>
          <ComButton rr className='mb10 cccplh' onClick={async () => {
            Taro.showLoading({ mask: true, title: "生成中..." });
            const res = await utils_get_qrcode({
              appid: process.env.TARO_APP_CLIENT,
              page: "pages_comm/comm__product_dryclean",
              scene: coo___objToUrl({ R_D: Number(useSTSelf.getState().selfInfo!.mobile).toString(36), })
            });
            Taro.hideLoading();
            setPosterUrl(res!);
          }
          }><Text className='cccgreen'>⤻</Text>海报</ComButton>
        </View>
      </ComNav>
      {___test_boo && tabItems && <ComListTypeSelectorNew className='ww' disabled={productCategory === null} data={tabItems} label='name' value='id'
        tabType={tabIndex} setTab={(e) => { setTabIndex(e); }} />}
    </View>

    <ComScrollView>
      {___test_boo && tabItems && productCategory && <CPDryclean.ProductCategoryCard cart={cart} productCategory={productCategory} onCartEdit={(ee) => { onCartEdit?.(ee); }} onCartDel={(ee) => onCartDelItem?.(ee)} />}
      <ComLoading className='mb10' isLastPage={!Boolean(productCategory === null) && true} loading={Boolean(productCategory === null)} />
    </ComScrollView>
    {props.children}
    {posterUrl &&
      <MMMPoster onClose={() => { setPosterUrl(""); }} background='linear-gradient(-170deg,#67BADF 0%,#9DD0E8 40%,#ffffff 80%,#ffffff 100%)'>
        <MMMPosterDryclean src={posterUrl} />
      </MMMPoster>}
  </MMMAAPage>;
}