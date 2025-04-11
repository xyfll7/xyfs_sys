// :: pages/test/ctest_index
import { Text, View } from '@tarojs/components';
import { Api_common_productList_ctn } from '@xyfs/taro_uii/api/api__shop';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComImage } from '@xyfs/taro_uii/components/ComImage';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComPrice } from '@xyfs/taro_uii/components/ComPrice';
import { ComScrollView } from '@xyfs/taro_uii/components/ComScrollView';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { FC, useEffect, useState } from 'react';

definePageConfig({
  navigationStyle: "custom", disableScroll: true,
  // "styleIsolation": "shared",
  // "componentFramework": "glass-easel",
  // "renderer": "skyline",
  "navigationBarTitleText": "测试页面",
  usingComponents: {
    'store-product-item': '../../components/store-product-item/store-product-item',
  }
});

export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };



const Index: FC<{}> = ({ }) => {


  return <MMMAAPage>
    <ComNav>
      <ComNavBarA className='mb10 pl10'>
        <ComButton ll className='bcctrans cccplh ml10' >小工具</ComButton>
      </ComNavBarA>
    </ComNav>
    <ComScrollView className='dll ww'>
      <IIIBringGoods></IIIBringGoods>
    </ComScrollView>
  </MMMAAPage>;
};



const IIIBringGoods = () => {
  const [productList, setProductList] = useState<any[]>();
  useEffect(() => {
    Api_common_productList_ctn({ orderId: "123" }).then((res) => {
      console.log(res);
      setProductList(res);
    });
  }, []);
  return <>
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
  </>;
};