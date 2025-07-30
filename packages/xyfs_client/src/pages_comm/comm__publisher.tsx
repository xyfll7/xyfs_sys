// :: pages_comm/comm__publisher
import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Api_assist_publish_ctn } from '@xyfs/taro_uii/api/api__assist';
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
import { getMyEnv } from '@xyfs/taro_uii/src/env';
import { roo___has_role } from '@xyfs/taro_uii/src/roles';
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { try_Taro_cloud_uploadFile, try_Taro_hideLoading, try_Taro_showModal } from '@xyfs/taro_uii/utils/try_catch';
import { useHook_Reducer } from '@xyfs/taro_uii/utils/useHooks';
import { utils_validate_upload_product } from '@xyfs/taro_uii/utils/validator';
import { coo___get_price, coo___ios_date } from '@xyfs/utils/util';
import { FC, useEffect, useState } from 'react';

definePageConfig({ navigationStyle: "custom", enableShareAppMessage: true, disableScroll: true });

export default function COMSELFWarp() {
  return <ComSELFView>
    {getMyEnv().isDeveloping ? <IIIPublisherClient /> :
      <ComNav className='pl20'>
        <ComLoading isEmpty>页面开发中...</ComLoading>
      </ComNav>
    }
  </ComSELFView>;
};



export const IIIPublisherClient: FC = () => {
  const [form, setForm] = useHook_Reducer({
    str: "",
    price: "0.00",
    pictureUrl: "",
    categoryId: 0,
  });

  return <MMMAAPage>
    <ComNav isRight>
      <ComNavBarA className='mb10 ww pl10'>
        <ComButton className='bccyellow slr mr10 fwb' onClick={async () => {
          await utils_validate_upload_product(form);
          Taro.showLoading({ mask: true, title: "发布中..." });
          await Api_assist_publish_ctn({
            attachUrl: form.pictureUrl,
            price: Number(form.price),
            name: form.str.split("\n")[0] ?? "",
            remark: "",
            intro: form.str.split("\n")[1] ?? ""
          });
          setForm(null);
          try_Taro_hideLoading();
          if (await try_Taro_showModal({ title: "提示", content: "发布成功", cancelText: "返回首页", confirmText: "继续发布" })) {
            Taro.showToast({ icon: "none", title: "发布成功" });
          } else {
            Taro.redirectTo({ url: "/pages/index/index" });
          }
        }}>
          <Text className='cccgreen'>+</Text>发布
        </ComButton>
      </ComNavBarA>
    </ComNav>
    <ComScrollView>
      <ComButton className='bccbackdeep mb10 ww pbt10' hoverClass='none'>
        <View className='ww '>
          <ComTextarea className='ww' minHeight='calc(2 * var(--rem_base))' confirmType='return' value={form.str} placeholder='简单介绍一下吧 ～'
            onInputText={(e) => { setForm({ str: e }); }} />
          <View className='fs08 cccplh'>注:点击换行后，第一行为标题</View>
        </View>
      </ComButton>
      <ComImageUploader images={form.pictureUrl} onSetImages={(e) => { setForm({ pictureUrl: e.join(",") }); }} upLoader={async (e) => {
        const res_cloud_files = await Promise.all(e.map(async (ee, ii) => ({
          ...await try_Taro_cloud_uploadFile(ee, `product_image/${useSTSelf.getState().selfInfo?.OPENID}/_${coo___ios_date().getTime()}_${ii}`)
        })));
        return [...res_cloud_files.map(ee => ee.fileID)];
      }} />
      <ComButton className='bccbackdeep mb10 dy' hoverClass='none'>
        <Text className='nw cccplh'> 价格:</Text>
        <ComInput className='cccprice' type='digit' confirmType='done' value={form.price} placeholder='请输入价格' onBlur={() => { form.price === "" && setForm({ price: "0.00" }); }}
          onFocus={() => { form.price === "0.00" && setForm({ price: "" }); }}
          onInput={(e) => setForm({ price: coo___get_price(e.detail.value, form.price, { isDecimal: true }) })} />
      </ComButton>
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