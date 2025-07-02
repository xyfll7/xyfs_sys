// :: pages_comm/comm__publisher
import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Product_Publish } from '@xyfs/taro_uii';
import { Api_goods_publish_ctn } from '@xyfs/taro_uii/api/api__goods';
import { Api_productCategory_list_ctn } from '@xyfs/taro_uii/api/api__product';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComImageUploader } from '@xyfs/taro_uii/components/ComImageUploader';
import { ComInput } from '@xyfs/taro_uii/components/ComInput';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from '@xyfs/taro_uii/components/ComScrollView';
import { ComTextarea } from '@xyfs/taro_uii/components/ComTextarea';
import { ComSELFView, MMMAAPage, } from '@xyfs/taro_uii/components/MMMAAPage';
import { roo___has_role } from '@xyfs/taro_uii/src/roles';
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { try_Taro_cloud_uploadFile, try_Taro_hideLoading, try_Taro_showModal } from '@xyfs/taro_uii/utils/try_catch';
import { useHook_getCurrentInstance, useHook_Reducer } from '@xyfs/taro_uii/utils/useHooks';
import { utils_validate_upload_product } from '@xyfs/taro_uii/utils/validator';
import { coo___get_price, coo___ios_date } from '@xyfs/utils/util';
import { FC, useEffect, useState } from 'react';

definePageConfig({ navigationStyle: "custom", enableShareAppMessage: true, disableScroll: true });

export default function COMSELFWarp() { return <ComSELFView><IIIPublisherAdmin /></ComSELFView>; };

export const IIIPublisherAdmin: FC = () => {
  const { options: product, clearRef } = useHook_getCurrentInstance<Product_Publish>(true);
  const [form, setForm] = useHook_Reducer({
    str: product ? `${product?.name}${product?.intro}` : "",
    price: product ? product.price! : "0.00",
    attachUrl: product?.attachUrl ? product.attachUrl : "",
    categoryId: product ? 0 : 0,
    stock: product ? String(product.stock ?? "0") : "0"
  });

  return <MMMAAPage>
    <ComNav isRight>
      <ComNavBarA className='mb10 ww pl10'>
        <ComButton className='bccyellow slr mr10 fwb' onClick={async () => {
          console.log("form:", form);
          await utils_validate_upload_product(form);
          Taro.showLoading({ mask: true, title: "发布中..." });
          await Api_goods_publish_ctn({
            id: product?.id ?? undefined,
            attachUrl: form.attachUrl,
            price: Number(form.price),
            name: form.str.split("\n")[0] ?? "",
            remark: "",
            intro: form.str.split("\n")[1] ?? "",
            stock: form.stock === "" ? 0 : Number(form.stock),
            weight: 1,
          });
          try_Taro_hideLoading();
          if (await try_Taro_showModal({ title: "提示", content: product ? "修改成功" : "发布成功", cancelText: "返回", confirmText: "继续发布" })) {
            clearRef();
            setForm(null);
          } else {
            Taro.navigateBack({ delta: 1 });
          }
        }}>
          <View className='dbase'>
            <Text className='cccgreen fs08 mr2'>{product ? "#" : "+"}</Text>
            <Text>{product ? "修改" : "发布"}</Text>
          </View>

        </ComButton>
      </ComNavBarA>
    </ComNav>
    <ComScrollView>
      <ComButton className='bccbacktab mb10 ww pbt10 IOO' hoverClass='none'>
        <View className='ww '>
          <ComTextarea className='ww ' minHeight='calc(2 * var(--rem_base))' confirmType='return' value={form.str} placeholder='请录入商品名称/简介 ~'
            onInputText={(e) => { setForm({ str: e }); }} />
          <View className='fs08 cccplh'>注: 点击换行后, 第一行为标题</View>
        </View>
      </ComButton>
      <ComImageUploader images={form.attachUrl} onSetImages={(e) => { setForm({ attachUrl: e.join(",") }); }} upLoader={async (e) => {
        const res_cloud_files = await Promise.all(e.map(async (ee, ii) => ({
          ...await try_Taro_cloud_uploadFile(ee, `product_image/${useSTSelf.getState().selfInfo?.OPENID}/_${coo___ios_date().getTime()}_${ii}`)
        })));
        return [...res_cloud_files.map(ee => ee.fileID)];
      }} />
      <ComButton className='bccbacktab mb10 dy' hoverClass='none'>
        <Text className='nw cccplh mr6'>价格</Text>
        <ComInput className='cccprice' type='digit' confirmType='done' value={form.price} placeholder='请输入价格' onBlur={() => { form.price === "" && setForm({ price: "0.00" }); }}
          onFocus={() => { form.price === "0.00" && setForm({ price: "" }); }}
          onInput={(e) => setForm({ price: coo___get_price(e.detail.value, form.price) })} />
      </ComButton>
      <ComButton className='bccbacktab mb10 dy' hoverClass='none'>
        <Text className='nw cccplh mr6'> {product ? "改后库存" : "库存"}</Text>
        <ComInput className='cccprice' type='digit' confirmType='done' value={form.stock} placeholder='请输入库存数量'
          onBlur={() => { form.stock === "" && setForm({ stock: "0" }); }}
          onFocus={() => { form.stock === "0" && setForm({ stock: "" }); }}
          onInput={(e) => setForm({ stock: coo___get_price(e.detail.value, form.stock, { isDecimal: false, integerLength: 4 }) })} />
      </ComButton>
      {product &&
        <ComButton className='cccplh bccback' hoverClass="none">
          <Text>当前库存 {product.stock}</Text>
          <Text className="w1rem dxy">{Number(form.stock) - Number(product.stock) < 0 ? "-" : "+"}</Text>
          <Text>{Math.abs(Number(form.stock) - Number(product.stock))}</Text>
        </ComButton>
      }
      {roo___has_role(useSTSelf.getState().selfInfo, ["SUPPLIER"]) &&
        <IIIProductCategories categoryId={form.categoryId} onSetForm={(e) => {
          setForm({ categoryId: e });
        }}></IIIProductCategories>
      }
    </ComScrollView>
  </MMMAAPage>;
};






function useProductCategories() {
  const [productCategories, setProductCategory] = useState<any[] | null>(null);
  useEffect(() => {
    (async () => {
      const res = await Api_productCategory_list_ctn();
      setProductCategory(res);
    })();
  }, []);
  return productCategories;
}


const IIIProductCategories: FC<{ categoryId: number, onSetForm: (categoryId: number) => void; }> = ({ categoryId, onSetForm }) => {
  const productCategories = useProductCategories();
  return <>
    {productCategories === null ? <ComLoading className='mb10' /> : <View className='dll prl10'>
      <View className=' dy dwp ww'>
        <ComButton ll className='mb10 bccback'>分类</ComButton>
        {productCategories.filter(e => e.id !== 0).map((e) => {
          return <ComButton ll className={`mb10 mr10 bborder ${categoryId === e.id ? "cccgreen" : ""}`} key={e.id} onClick={() => { onSetForm(e.id); }}>{e.name}</ComButton>;
        })}
      </View>
    </View>}
  </>;
};


