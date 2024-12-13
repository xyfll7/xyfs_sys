import { View } from "@tarojs/components";
import { FC, useEffect, useState } from "react";
import { OrderInfo, ProductBase } from "../../types/type_product";
import { Api_logistic_query_ctn } from "../api/api__logistics";
import { Api_order_query_ctn } from "../api/api__orders";
import { ComButton } from "../components/ComButton";
import { ComCardOrderDryclean, ComCardOrderExpress } from "../components/ComCardOrder";
import { ComLoading } from "../components/ComLoading";
import { ComNav } from "../components/ComNav";
import { ComNavBarA } from "../components/ComNavBarA";
import { ComScrollView } from "../components/ComScrollView";
import { ComSquare } from "../components/ComSquare";
import { MMMAAPage } from "../components/MMMAAPage";
import { MMMAdBanner } from "../components/MMMAdBanner";
import { Product_category_ST } from "../config";
import { Taro_getCurrentInstance } from "../utils/try_catch";


const CPExpressPath: FC = () => {
  const { options } = Taro_getCurrentInstance<{ express_share_id?: string; }>();
  const [order, setOrder] = useState<OrderInfo<ProductBase> | null>(null);
  const [path, setPath] = useState<{ description: string, time: string; }[] | null>(null);

  useEffect(() => {
    (async () => {
      if (options?.express_share_id) {
        const _order = await Api_order_query_ctn({ orderId: options?.express_share_id?.trim() });
        setOrder(_order);
        const res = await Api_logistic_query_ctn({ orderId: _order.id!, });
        setPath(res);
      }
    })();
  }, [options.express_share_id]);
  console.log("ooooder:", order);
  return <MMMAAPage>
    <ComNav>
      <ComNavBarA className='mb10 pl10'>
        <ComButton ll className='bcctrans cccplh ml10' >运单详情</ComButton>
      </ComNavBarA>
    </ComNav>
    <ComScrollView>
      {order && order.orderType === Product_category_ST.快递 && <View className='bccwhite mb10 ww IOO'>
        <ComCardOrderExpress className='mb10' order={order!} isHidePath />
      </View>
      }
      {order && order.orderType === Product_category_ST.干洗 && <ComCardOrderDryclean className='mb10' order={order!} />}
      {order && order.orderType === Product_category_ST.团购 && <View >fasdfsadf</View>}
      {path === null && <ComLoading className='mb10' />}
      {path?.length === 0 &&
        <ComLoading className='mb10' isEmpty>待揽件</ComLoading>
      }
      {Boolean(path?.length) &&
        <>
          <View className='bccwhite IOO pt10 mb10 dll ww'>
            <View>
              {path?.map((e) => {
                return (
                  <View key={e.time} className='ds prl10 '>
                    <ComSquare className='mr10 dxy bcctrans' style={{ height: "calc(1.4 * var(--rem_base))" }}>
                      <ComSquare className='oo bccgreen' style={{ width: "calc(0.5625 * var(--rem_base))" }} />
                    </ComSquare>
                    <ComButton ll className='mb10 ww'>
                      <View>
                        <View>{e.description.replace(/【/g, "[").replace(/】/g, "] ")}</View>
                        <View className='cccplh fs08'>{e.time}</View>
                      </View>
                    </ComButton>
                  </View>
                );
              })}
            </View>
          </View>
          <MMMAdBanner className='mb10' />
        </>
      }
    </ComScrollView>
  </MMMAAPage >;
};
export { CPExpressPath };


