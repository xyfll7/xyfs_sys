import { View } from "@tarojs/components";
import { FC, useEffect, useState } from "react";
import { OrderInfo, ProductBase } from "../../types/type_product";
import { Api_logistic_query_ctn } from "../api/api__logistics";
import { Api_order_query_ctn } from "../api/api__orders";
import { ComButton } from "../components/ComButton";
import { ComCardOrderBringGoods, ComCardOrderDryclean, ComCardOrderExpress } from "../components/ComCardOrder";
import { ComLoading } from "../components/ComLoading";
import { ComNav } from "../components/ComNav";
import { ComNavBarA } from "../components/ComNavBarA";
import { ComScrollView } from "../components/ComScrollView";
import { ComSquare } from "../components/ComSquare";
import { MMMAAPage } from "../components/MMMAAPage";
import { Product_category_ST } from "../config";
import { useHook_getCurrentInstance } from "../utils/useHooks";



const CPExpressPath: FC = () => {
  const { options } = useHook_getCurrentInstance<{ express_share_id?: string; }>();
  const [order, setOrder] = useState<OrderInfo<ProductBase> | null>(null);
  const [path, setPath] = useState<{ waybillId: string; path: { description: string, time: string; }[]; }[] | null>(null);

  useEffect(() => {
    (async () => {
      if (options?.express_share_id) {
        const _order = await Api_order_query_ctn({ orderId: options?.express_share_id?.trim() });
        setOrder(_order);
        const res = await Api_logistic_query_ctn({ orderId: _order.id!, });
        setPath([...res]);
      }
    })();
  }, [options?.express_share_id]);
  return <MMMAAPage>
    <ComNav>
      <ComNavBarA className='mb10 pl10'>
        <ComButton ll className='bcctrans cccplh ml10' hoverClass="none">运单详情</ComButton>
      </ComNavBarA>
    </ComNav>
    <ComScrollView>
      {order && order.orderType === Product_category_ST.快递 && <View className='bccwhite mb10 ww IOO'>
        <ComCardOrderExpress className='mb10' order={order!} isHidePath />
      </View>
      }
      {order && order.orderType === Product_category_ST.干洗 && <ComCardOrderDryclean className='mb10' order={order!} />}
      {order && order.orderType === Product_category_ST.团购 && <ComCardOrderBringGoods className='mb10 pb10' order={order} ></ComCardOrderBringGoods>}
      {path === null && <ComLoading className='mb10' />}
      {path?.length === 0 &&
        <ComLoading className='mb10' isEmpty>待揽件</ComLoading>
      }
      {Boolean(path?.length) &&
        <>
          {path?.map((e) => {
            return <View key={e.waybillId} className='ww dll'>
              <ComButton className='mb10 cccplh bccback' hoverClass='none'>运单号:{e.waybillId}</ComButton>
              {e.path && e.path?.length === 0 && <ComLoading className='mb10' isEmpty>待揽件</ComLoading>}
              {e.path && e.path?.length !== 0 &&
                <View className='pt10 mb10 dll ww'>
                  {e.path.map(ee => {
                    return <View key={ee.time} className='ds prl10 ww'>
                      <ComSquare className='mr10 dxy' style={{ height: "calc(1.4 * var(--rem_base))" }}>
                        <ComSquare className='oo bccgreen' style={{ width: "calc(0.5625 * var(--rem_base))" }} />
                      </ComSquare>
                      <ComButton ll className='mb10 ww  bccback' hoverClass="none">
                        <View>
                          <View className="cccplh">{ee.description.replace(/【/g, "[").replace(/】/g, "] ")}</View>
                          <View className='cccplh fs08'>{ee.time}</View>
                        </View>
                      </ComButton>
                    </View>;
                  })}
                </View>
              }
            </View>;
          })}
          {/* <MMMAdBanner className='mb10' /> */}
        </>
      }
    </ComScrollView>
  </MMMAAPage >;
};
export { CPExpressPath };


