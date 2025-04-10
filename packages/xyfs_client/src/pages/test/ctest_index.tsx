// :: pages/test/ctest_index
import { Text, View } from '@tarojs/components';
import { Api_common_productList_ctn } from '@xyfs/taro_uii/api/api__shop';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComImage } from '@xyfs/taro_uii/components/ComImage';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
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

export default function COMSELFWarp() { return <Index></Index>; };



const Index: FC<{}> = ({ }) => {

  const [productList, setProductList] = useState<any[]>();

  useEffect(() => {
    Api_common_productList_ctn({ orderId: "123" }).then((res) => {
      console.log(res);
      setProductList(res);
    });
  }, []);

  return <View className='ww dll'>
    <ComNav className='prl10'>
      <ComNavBarA>测试页面</ComNavBarA>
    </ComNav>
    <View className='dll prl10 pt10 ww'>
      {!productList && <ComLoading></ComLoading>}
      {productList?.length === 0 && <ComLoading isEmpty></ComLoading>}
      {productList?.map((item, index) => {
        const product = item.product[0];
        return <View className='ww dll' key={index}>
          {/*@ts-ignore*/}
          <store-product-item class="ww mb10" appid={product.appid} productId={product.out_product_id} productPromotionLink={product.product_promotion_link}>
            <View className='dtl mb10   bccwhite ioo  ww'>
              <ComImage className='mr10' src={product.img_url} style={{ width: "5rem" }}></ComImage>
              <View className='pt10 dll'>
                <ComButton ll className=''>
                  <Text className="nw1"> {product.title}</Text>
                </ComButton>
                <View className=''>
                  <Text className="nw1"> {product.selling_price / 100}元/斤</Text>
                </View>
              </View>
            </View>
            {/*@ts-ignore*/}
          </store-product-item>
        </View>;
      })

      }

    </View>
  </View >;
};




