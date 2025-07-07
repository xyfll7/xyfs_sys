import { Text, View, ViewProps } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { coo___ios_date, coo___objToUrl } from "@xyfs/utils/util";
import React, { FC, PropsWithChildren, ReactElement, ReactNode, useEffect, useState } from "react";
import { DrycleanNotesType, Product_Dryclean } from "../../types/type_product";
import { Api_userAddress_add_ctn } from "../api/api__address";
import { Api_product_list_ctn, Api_productCategory_list_ctn } from "../api/api__product";
import { Api_cart_add_ctn, Api_option_list_ctn } from "../api/api__shop";
import { Api_user_edit_ctn } from "../api/api__users";
import { ComAddressSwitchor } from "../components/ComAddressSwitchor";
import { ComButton, MyButtonProps } from "../components/ComButton";
import { ComImage } from "../components/ComImage";
import { ComImageUploader } from "../components/ComImageUploader";
import { ComInput } from "../components/ComInput";
import { ComLoading } from "../components/ComLoading";
import { ComNavBarB } from "../components/ComNavBarB";
import { ComCartPrice } from "../components/ComPrice";
import { ComQRCode } from "../components/ComQRCode";
import { ComScrollView } from "../components/ComScrollView";
import { ComSquare } from "../components/ComSquare";
import { get_dev_value, getMyEnv } from "../env";
import { roo___my_dept } from "../roles";
import { useSTSelf } from "../store/store";
import { try_Taro_chooseAddress, try_Taro_cloud_uploadFile, try_Taro_hideLoading, try_Taro_navigateToMiniProgram } from "../utils/try_catch";


function cartMerge(cart: Product_Dryclean[]) {
  return cart.reduce<Product_Dryclean[]>((arr, item) => {
    const index = arr.findIndex(eee => eee.productId === item.productId);
    if (index === -1) {
      return [...arr, item];
    } else {
      arr[index]!.quantity = arr[index]!.quantity! + 1;
      return [...arr];
    }
  }, []);
}


const ShopCart: FC<PropsWithChildren & { onCartEdit: (e: Product_Dryclean) => void; cart: Product_Dryclean[], onToggle: () => void; onCartDel: (e: Product_Dryclean) => void; }> = ({ cart, onCartEdit, onToggle, onCartDel, ...props }) => {
  let _children_ShopCartTabBarUser: ReactElement | null = null;
  let _children_ShopCartTabBarRegiment: ReactElement | null = null;
  let _children_RecManInfo: ReactElement | null = null;




  const _childrens: ReactNode[] = [];
  React.Children.forEach(props.children as ReactElement, (e: ReactElement) => {
    if (typeof e.type === "string") {
      _childrens.push(e);
    } else if (typeof e.type === "function" && e.key === "IIIShopCartTabBarUser") {
      _children_ShopCartTabBarUser = e;
    } else if (typeof e.type === "function" && e.key === "RecManInfo") {
      _children_RecManInfo = e;
    } else if (typeof e.type === "function" && e.key === "ShopCartTabBarRegiment") {
      _children_ShopCartTabBarRegiment = e;
    }
  });



  const productCategory = cartMerge([...cart])?.reduce<Record<string, Product_Dryclean[]>>((group, product) => {
    const { name } = product;
    group![name!] = group?.[name!] ?? [];
    group![name!]!.push(product);
    return group;
  }, {}) ?? null;

  return <View className='dll  prl10 ww' style={{ height: "80vh" }}>
    <ComNavBarB className='mb10' onClose={onToggle}><ComButton className='fwb bccback'>购物车</ComButton></ComNavBarB>
    <ComScrollView>
      <View className='dll ww'>

        <ProductCategoryCard className='ww' cart={cart} productCategory={productCategory}
          onCartEdit={(ee) => { onCartEdit?.(ee); }} onCartDel={(ee) => { onCartDel(ee); }} />
        <View className='dbtc ww'>
          <ComLoading className='mb10' isEmpty icon='🛍️'>{cart?.length === 0 ? "购物车是空的～" : "坏了包退 晚到必赔 极速退款"} </ComLoading>
          {cart?.length === 0 && <ComButton className='mb10' onClick={onToggle}>去选购</ComButton>}
        </View>
      </View>
    </ComScrollView>
    {cart?.length !== 0 && <View className='ww pt10'>
      {_children_RecManInfo && _children_RecManInfo}
      {_children_ShopCartTabBarUser && _children_ShopCartTabBarUser}
      {_children_ShopCartTabBarRegiment && _children_ShopCartTabBarRegiment}
    </View>
    }
    {_childrens}
  </View>;

};






function useDrycleanNotesType() {
  const [data, setData] = useState<DrycleanNotesType[] | null>(null);
  useEffect(() => {
    (async () => {
      const res = await Api_option_list_ctn();
      setData(res);
    })();
  }, []);
  return [data];
}




const CartItemEditor: FC<{ cartItem: Product_Dryclean; onSetCart: (e: Product_Dryclean[]) => void; onToggle: () => void; }> = ({ cartItem, onSetCart, onToggle }) => {

  const [tabType, setTabType] = useState(0);
  const [form, setForm] = useState<{
    serve: DrycleanNotesType[],
    color: DrycleanNotesType[],
    defec: DrycleanNotesType[],
    affix: DrycleanNotesType[],
    price: DrycleanNotesType[],
  }>({
    serve: cartItem.serveOptions ?? [],
    color: cartItem.colorOptions ?? [],
    defec: cartItem.defectOptions ?? [], // 瑕疵
    affix: cartItem.affixOptions ?? [],
    price: [
      ...(cartItem.colorOptions ?? []),
      ...(cartItem.serveOptions ?? []),
      ...(cartItem.defectOptions ?? []),
      ...(cartItem.affixOptions ?? []),
    ].filter((e) => Boolean(e.price)),
  });

  const [pictureUrl, setPictureUrl] = useState<string>(cartItem.img ?? "");
  const [remark, setRemark] = useState("");
  const [quantity, setQuantity] = useState(cartItem.quantity ? cartItem.quantity : 1);

  const [drycleanNotesType] = useDrycleanNotesType();

  const form_list = [
    { title: "服务", value: form.serve, key: "serve" as keyof typeof form, list: drycleanNotesType?.filter(e => e.type === "serve") },
    { title: "颜色", value: form.color, key: "color" as keyof typeof form, list: drycleanNotesType?.filter(e => e.type === "color") },
    { title: "瑕疵", value: form.defec, key: "defec" as keyof typeof form, list: drycleanNotesType?.filter(e => e.type === "defec") },
    { title: "附件", value: form.affix, key: "affix" as keyof typeof form, list: drycleanNotesType?.filter(e => e.type === "affix") },
  ];

  return <View className='dll prl10' style={{ height: "75vh" }}>
    <View className='ww '>
      <View className='dbtc'>
        <ComNavBarB className='mb10'>
          <View className='dy'>
            <ComButton rr className='fwb bccback'>
              <Text className='wm8rem nw1'>{cartItem.name}/{cartItem.intro}</Text>
            </ComButton>
            <View className='nw ml4 dbase'>
              <Text className='cccprice mr2'>¥</Text>
              {cartItem.price && <Text className='cccprice nw1'>{cartItem.price * quantity}</Text>}
              {Boolean(form.price.length) && <>
                <Text className='cccprice'>+</Text>
                <Text className='cccprice nw1'>{form.price.reduce((num, ee) => num + Number(ee.price), 0)}</Text>
                <Text className='cccprice'>={form.price.reduce((num, ee) => num + Number(ee.price), 0) + cartItem.price!}</Text>
              </>}
            </View>
          </View>

          <ComButton className='bccyellow nw' onClick={async () => {
            if (pictureUrl.split(",").length <= get_dev_value(3, 0)!) { throw new Error("请至少上传4张图片"); }
            onToggle();
            Taro.showLoading({ mask: true, title: "添加..." });
            const res = await Api_cart_add_ctn({
              serveIds: form.serve.map(ee => ee.id),
              colorIds: form.color.map(ee => ee.id),
              defectIds: form.defec.map(ee => ee.id),
              affixIds: form.affix.map(ee => ee.id),

              remark: remark,
              quantity: quantity,
              img: pictureUrl,
              ...(cartItem.productId ?
                ({ id: cartItem.id, }) :
                ({ productId: cartItem.id }))
            });
            console.log(res);
            onSetCart(res);
            Taro.showToast({ icon: "none", title: "添加成功" });

          }}>{cartItem.productId ? "修改" : "添加"} </ComButton>
        </ComNavBarB>
      </View>
      <ComImageUploader size='calc(4 * var(--rem_base))' addTitle='图片' sourceType={["camera"]}
        images={pictureUrl} onSetImages={(e) => { setPictureUrl(e.join(",")); }} upLoader={async (e) => {
          const res_cloud_files = await Promise.all(e.map(async (ee, ii) => ({
            ...await try_Taro_cloud_uploadFile(ee, `order_image/${useSTSelf.getState().selfInfo?.OPENID}/_${coo___ios_date().getTime()}_${ii}`)
          })));
          return [...res_cloud_files.map(ee => ee.fileID)];
        }} />
      <View className='ww'>
        {cartItem.unit && <View className="dy ww">
          <ComButton className='mb10 mr10 bccback nw' hoverClass='none'>
            数量:  <Text className='nw w2rem dxy'>{quantity} </Text>  {cartItem.unit}
          </ComButton>
          <ComButton className='mb10 bccbacktab ww dxy mr10' hoverClass='none' onClick={() => {
            if (quantity === 1) { Taro.showToast({ icon: "none", title: "数量最少为1" }); return; }
            setQuantity(ee => ee - 1);
          }}>
            <Text className='mr6 cccplh nw'>-减</Text>
          </ComButton>
          <ComButton className='mb10 bccbacktab ww dxy' hoverClass='none' onClick={() => setQuantity(ee => ee + 1)}>
            <Text className='mr6 cccplh nw'>+加</Text>
          </ComButton>
        </View>
        }


        <ComButton className='mb10 bccbacktab' hoverClass='none'>
          <Text className='mr6 cccplh nw'>备注:</Text>
          <ComInput placeholder='请输入备注内容' value={remark} onInput={(eee) => setRemark(eee.detail.value)}></ComInput>
        </ComButton>
        {form_list.map((e, i) => {
          return <View className='dy' key={e.key}>
            <ComButton className='bccbacktab mb10 ww' hoverClass='none' onClick={() => { tabType !== i && setTabType(i); }}>
              <Text className={`${tabType === i ? "" : "cccplh"} mr6`}>{e.title}:</Text>
              {e.value.length ?
                <Text>{e.value.map(ee => ee.label).join("/")}</Text> :
                <Text className='cccplh'>请选择{e.title}</Text>
              }
            </ComButton>
            {e.key === "serve" && <ComButton className='mb10 ml10 bccback' hoverClass='none'>
              <Text className='mr2 cccprice'>¥</Text><Text className='cccprice'>{form.price.reduce((num, ee) => num + Number(ee.price), 0)}</Text>
            </ComButton>}
          </View>;
        })}
      </View>
    </View>
    <ComScrollView >
      {drycleanNotesType === null && <ComLoading className='mb10' />}
      <View className='ww ds dwp prl10'>
        {form_list[tabType]?.list?.map((e, i) => {
          return <ComButton ll className={`mb10 mr10 ${form_list[tabType]?.value.find((ee) => ee.id === e.id) ? "cccgreen" : ""}`} key={i} onClick={() => {
            setForm(ee => {
              return ({
                ...ee,
                ...{ [form_list[tabType]!.key!]: ee[form_list[tabType]!.key].find((eee) => eee.id === e.id) ? ee[form_list[tabType]!.key].filter(eee => eee.id !== e.id) : [...ee[form_list[tabType]!.key], e] },
                price: ee["price"].find(eee => eee.id === e.id) ? ee["price"].filter(eee => eee.id !== e.id) : e.price ? [...ee["price"], e] : [...ee["price"]]
              });
            });
          }}>
            <View className='dbase'>
              <Text >{e.label}</Text>
              {e.price && <Text className=''>{e.price}</Text>}
            </View>
          </ComButton>;
        })}
      </View>
    </ComScrollView>
  </View>;
};





const ProductCategoryCard: FC<{ productCategory: Record<string, Product_Dryclean[]>; cart?: Product_Dryclean[], onCartEdit?: (e: Product_Dryclean) => void; onCartDel?: (e: Product_Dryclean) => void; } & ViewProps> = ({ productCategory, cart, onCartEdit, onCartDel, }) => {

  return Object.keys(productCategory).map(e => {
    return <View className='bccwhite IOO prl10 pt10 mb10 ww ovh dll' key={e}>
      <ComButton ll className='bccwhite cccplh mb10'>{e}</ComButton>
      <View className='ww dll  ioo ovh'>
        {productCategory?.[e]?.map((ee, ii) => {
          const cartItems = cart?.filter(eee => eee.productId == (ee.productId ?? ee.id));
          return <View className={`flx1  ioo ww  dll ${ii % 2 === 0 ? "mr10" : ""}`} style={{ minWidth: "30vw" }} key={ee.id}>
            <View className='ww dtl bccback ioo ovh mb10'>
              <ComImage style={{ width: "20vw" }} className='ovh ol6 bccbacktab' src={ee.pictureUrl?.split(",")[0]} />
              <View className='ww hh  dbtl'>
                <ComButton className='nw bccback'>{ee.intro ? ee.intro : e}</ComButton>
                <View className='dbtc ww'>
                  <ComButton className='cccprice bccback'><Text className='mr2'>¥</Text>{ee.price}</ComButton>
                  {getMyEnv().appId === process.env.TARO_APP_ADMIN &&
                    <ComButton rr className='bccwhite' onClick={() => onCartEdit?.(ee)}><Text className='cccgreen'>+</Text><Text >加</Text></ComButton>
                  }
                </View>
              </View>
            </View>

            {cartItems && Boolean(cartItems.length) && <View className='ww  '>
              {cartItems?.map(eee => {
                const str = [...eee.serveOptions ?? [], ...eee.affixOptions ?? [], ...eee.colorOptions ?? [], ...eee.defectOptions ?? []].map(eeee => eeee.label).join("/");
                return <View className='ww dbtc mb10' key={eee.id}>
                  <ComButton ll className=''>
                    <View className="dbase">
                      {str ? <Text className='wm13rem nw1'>{str}</Text> : <Text className='cccplh'>无备注</Text>} <Text className="cccplh fs08">/{eee.quantity}</Text>
                    </View>
                  </ComButton>
                  <ComButton rr className='slr cccplh  mr10' onClick={() => onCartDel?.(eee)}>删除</ComButton>
                  <ComButton rr className='cccgreen  bborder' onClick={() => onCartEdit?.(eee)}>备注</ComButton>
                </View>;
              })}
            </View>}
          </View>;
        })}
      </View>
    </View>;
  });
};




const RecManInfo: FC = () => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const dept = selfInfo_S.deptInfo;
  return <View className='prl10 pt10'>
    <ComButton className='mb10 ww bccback' >
      <View className='dll'>
        <View className='nw'>团长:<Text className='wm4rem mr6 nw1'>{dept?.deptName}</Text>{dept?.mobile}</View>
        <View className='nw1 wm19rem cccplh fs08'>{dept?.address}</View>
      </View>
    </ComButton>
    {selfInfo_S.defaultRecManAddress ?
      <ComButton className=' ww bccback' onClick={async () => {
        const res = await try_Taro_chooseAddress();
        Taro.showLoading({ mask: true, title: "更新中..." });
        const res_address = await Api_userAddress_add_ctn({ ...res, type: 2 });
        const res_userInfo = await Api_user_edit_ctn({ defaultRecManAddressId: res_address.id });
        useSTSelf.getState().sett(res_userInfo);
        try_Taro_hideLoading();
      }}>
        <View className='dll'>
          <View className='nw'><Text>收货人:</Text><Text className='mr6'>{selfInfo_S.defaultRecManAddress.name}</Text><Text>{selfInfo_S.defaultRecManAddress.mobile}</Text> </View>
          <View className='nw1 wm19rem cccplh fs08'>{selfInfo_S.defaultRecManAddress.address}</View>
        </View>
      </ComButton> :
      <ComButton className=' ww bccback' onClick={async () => {
        const res = await try_Taro_chooseAddress();
        Taro.showLoading({ mask: true, title: "更新中..." });
        const res_address = await Api_userAddress_add_ctn({ ...res, type: 2 });
        const res_userInfo = await Api_user_edit_ctn({ defaultRecManAddressId: res_address.id });
        useSTSelf.getState().sett(res_userInfo);
        try_Taro_hideLoading();
      }}>添加收货人信息</ComButton>
    }
  </View>;
};



function ___get_cart_total_price(cart: Product_Dryclean[]) {
  return String(cart.reduce((num, ee) => {
    let _count = 0;
    if (ee.serveOptions) {
      const arr = [...(ee.serveOptions ?? []), ...(ee.colorOptions ?? []), ...(ee.defectOptions ?? []), ...(ee.affixOptions ?? [])];
      _count = arr.reduce((_num, _ee) => _num + Number(_ee.price) * 100, 0) / 100;
    }
    return num + Number(ee.totalPrice) * 100 + _count * 100;
  }, 0) / 100);
}



const ShopCartTabBarRegiment: FC<PropsWithChildren & { children?: ReactElement | ReactElement[], cart: Product_Dryclean[], onToggle: () => void; onPay?: () => void; isPay?: boolean; }> = ({ cart, isPay, onPay, onToggle, ...props }) => {

  let _children_ComTabBarLine: ReactElement | null = null;
  let _children_Sharer: ReactElement | null = null;

  const _childrens: ReactNode[] = [];
  props.children && React.Children.forEach(props.children, (e: ReactElement) => {
    if (typeof e.type === "string") {
      _childrens.push(e);
    } else if (typeof e.type === "function" && e.key === "Sharer") {
      _children_Sharer = e;
    } else if (typeof e.type === "function" && e.key === "ComTabBarLine") {
      _children_ComTabBarLine = e;
    }
  });

  return <View className='ww dll'>
    {_children_ComTabBarLine}
    {_childrens}
    {_children_Sharer}
    <View className='dbtc ww'>
      <ComAddressSwitchor className='mb10 bccback ww mr10' isShort title='团:' address={roo___my_dept(useSTSelf.getState().selfInfo!)} />

      <View className='ioo dy  mb10 '>
        <ComCartPrice totalPrice={___get_cart_total_price(cart)} num={String(cart.length)} onClick={onToggle} />
        <ComButton className='nw bccyellow ml10' disabled={isPay} onClickO={() => onPay?.()}>
          <ComSquare style={{ width: "calc(1.3 * var(--rem_base))" }} className='icon-wxpay mr4' />
          <Text className='fwb'>付</Text>
        </ComButton>
      </View>
    </View>
  </View>;
};


export async function dryclean_sharer(orderCode: string) {
  const url = `/pages_regiment/regiment_invitor?${coo___objToUrl({ scene: encodeURIComponent(coo___objToUrl({ O_D: String(orderCode) })) })}`;
  try_Taro_navigateToMiniProgram({
    appId: process.env.TARO_APP_CLIENT,
    path: url,
    noRelaunchIfPathUnchanged: false,
  });
}

export const Sharer: FC<MyButtonProps & ViewProps & { onGetOrderCode: () => Promise<string>, isShare: boolean, onClearCart?: () => void; isBborder?: boolean; }> = ({ isShare, onGetOrderCode, onClearCart, isBborder = false, ...props }) => {
  return <ComQRCode rr={props.rr} className={`${isBborder ? 'bborder' : ''}  ${isShare ? "" : "cccplh"} ${props.className}`}
    onPreTap={async () => {
      const res_orderCode = await onGetOrderCode();
      if (!isShare) { throw new Error('购物车是空的～'); }
      return {
        appid: process.env.TARO_APP_CLIENT,
        page: "pages_user/user_orders",
        scene: coo___objToUrl({ R_D: Number(useSTSelf.getState().selfInfo!.mobile).toString(36), O_D: String(res_orderCode), }),
      };
    }}
    onClick={async () => { onClearCart?.(); }}
    params={{
      title: "团长专属",
      desc: ["干洗下单快捷小程序码"],
    }} ><Text className={isShare ? 'cccgreen' : 'cccplh'}>⤻</Text>小码</ComQRCode>;

};



function useProducts(tabIndex: number) {
  const [products, setProducts] = useState<any[] | null>(null);
  useEffect(() => {
    (async () => {
      setProducts(null);
      const res = await Api_product_list_ctn({ categoryId: tabIndex });
      setProducts(res);
    })();
  }, [tabIndex]);


  const groupByCategory = products?.reduce((group, product) => {
    const { name } = product;
    group[name] = group[name] ?? [];
    group[name].push(product);
    return group;
  }, {}) ?? null;

  return [groupByCategory];
}
function useTabItems() {
  const [tabItems, setTabItems] = useState<any[] | null>(null);
  useEffect(() => {
    (async () => {
      const res = await Api_productCategory_list_ctn();
      setTabItems(res);
    })();
  }, []);
  return [tabItems];
}



const CPDryclean = {
  useProducts,
  useTabItems,
  RecManInfo,
  Sharer,
  ShopCart,
  ProductCategoryCard,
  CartItemEditor,
  ShopCartTabBarRegiment,
};
export default CPDryclean;
