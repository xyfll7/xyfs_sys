import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { coo___ios_date, coo___objToUrl } from "@xyfs/utils/util";
import { format } from "date-fns";
import React, { FC } from "react";
import { OrderInfo, Product_Dryclean, Product_Express } from "../../types/type_product";
import { Order_ST, PickUp_ST, Product_category_ST } from "../config";
import { try_Taro_navigateTo, try_Taro_setClipboardData } from "../utils/try_catch";
import { utils_arr_includes } from "../utils/util";
import { ComAddressSwitchor } from "./ComAddressSwitchor";
import { ComButton } from "./ComButton";
import { ComImage } from "./ComImage";
import { ComPrice } from "./ComPrice";
import { MMMOrderUser } from "./MMMOrderUser";
import { MMMShare } from "./MMMShare";

export const ComCardOrderExpress: FC<{
  className?: string;
  order: OrderInfo<Product_Express>;
  children?: React.ReactNode;
  isHidePath?: boolean;
}> = ({ className = "", order, children, isHidePath }) => {
  return (
    <View className={`bccwhite prl10 IOO pt10 dll ww ${className}`}>
      <View className='dbtc ww mb10'>
        <MMMOrderUser order={order} />

        <View className='dy nw'>
          {order.orderStatus == Order_ST.待付款 && order.pickUpType == PickUp_ST.上门取件 && <ComButton rr className='cccplh bccyellow ml10' >{PickUp_ST[order.pickUpType!]}</ComButton>}
          <ComButton rr className='cccgreen'>{Product_category_ST[order.orderType!]}</ComButton>
        </View>

      </View>
      <ComAddressSwitchor ll rr className='mb10 ww' address={order.productList?.[0]?.recMan} title='收:' time={order.orderTimeFormat}
        onClick={() => {
          Taro.showToast({ icon: "none", title: `${order.productList?.[0]?.recMan?.address}` });
        }} />
      <ComAddressSwitchor ll rr className='mb10 ww' address={order.productList?.[0]?.sendMan} title='寄:' time={`印${format(coo___ios_date(order.lastPrintTime), "MM/dd HH:mm")}`}
        onClick={() => {
          Taro.showToast({ icon: "none", title: `${order.productList?.[0]?.sendMan?.address}` });
        }} />
      <View className={`dbtc ww ${order.productList?.[0]?.deliveryId ? "mb10" : ""}`}>
        <ComButton ll className='dy ' onClick={() => {
          Taro.showToast({ icon: "none", title: `${order.productList?.[0]?.itemType}${order.productList?.[0]?.itemNotes ? `/${order.productList?.[0]?.itemNotes}` : ""}` });
        }}>
          {Boolean(order.totalPrice) && <Text>￥{Number(order.totalPrice!) / 100}</Text>}
          {order.productList?.[0]?.weight && <Text className='mr4'>/{order.productList?.[0]?.weight}kg</Text>}
          {order.productList?.[0]?.itemType && <Text className='mr4 nw1 wm6rem' >{`${order.productList?.[0]?.itemType}${order.productList?.[0]?.itemNotes ? `/${order.productList?.[0]?.itemNotes}` : ""}`}</Text>}
          <>
            {!order.productList?.[0]?.weight && <Text className='cccprice'>待计重</Text>}
            {order.orderStatus == Order_ST.待付款 && order.productList?.[0]?.weight && <View className='cccprice'>待付款</View>}
            {order.orderStatus == Order_ST.已付款 && <Text className='cccgreen'>已付款</Text>}
            {order.orderStatus == Order_ST.退款中 && <Text className='cccprice'>退款中</Text>}
            {order.orderStatus == Order_ST.已退款 && <Text className='cccplh'>已退款</Text>}
          </>
        </ComButton>
        <ComButton rr
          className='cccgreen bborder'
          onClick={async () => {
            await try_Taro_navigateTo({
              url: "/pages_comm/comm__product_express",
              success: (e) => { e.eventChannel.emit('cloneExpress', { ...order }); }
            });
          }}>克隆
        </ComButton>
      </View>
      {order.productList?.[0]?.deliveryId &&
        <View className='dbtc  ww'>
          <View className='dy'>
            <ComButton rr ll className='nw'>
              {order.productList?.[0]?.deliveryName?.slice(0, 2)} {order.productList?.[0]?.waybillId}
            </ComButton>
            {order.productList?.[0]?.waybillId &&
              <ComButton ll className='cccgreen bborder'
                onClick={async () => {
                  await try_Taro_setClipboardData({ data: order.productList?.[0]?.waybillId ?? "", });
                  Taro.showToast({ icon: "none", title: `已复制`, });
                }}>复制</ComButton>
            }
          </View>
          {order.productList?.[0]?.waybillId &&
            <View className='dy'>
              {!isHidePath ?
                <ComButton rr className='cccgreen bborder'
                  onClick={async () => {
                    await try_Taro_navigateTo({ url: `/pages_comm/comm__express_path?${coo___objToUrl({ express_share_id: order.id })}` });
                  }}>轨迹</ComButton> : null
              }
              <MMMShare rr orderType='快递' className='bborder' id={order.id!} name={order.deptName!} ></MMMShare>
            </View>
          }
        </View>
      }
      {children}
    </View >
  );
};

export const ComCardOrderDryclean: FC<{
  className?: string;
  order: OrderInfo<Product_Dryclean>;
  onBindCode?: (e: Product_Dryclean) => void;
}> = ({ order, className = "", onBindCode }) => {
  return <View className={`bccwhite prl10 IOO pt10 ww ${className}`}>
    <View className='dbtc ww mb10 '>
      <MMMOrderUser order={order} />
      <View className='dy'>
        {order.orderStatus == Order_ST.待付款 && order.pickUpType == PickUp_ST.上门取件 && <ComButton rr className='cccplh bccyellow ml10' >{PickUp_ST[order.pickUpType!]}</ComButton>}
        {order.orderStatus == Order_ST.已退款 && <ComButton rr className='bccprice ml10 cccwhite' hoverClass='none'>已退款</ComButton>}
        <ComButton rr className='cccgreen ml10'>{Product_category_ST[order.orderType!]}</ComButton>
      </View>
    </View>
    <ComAddressSwitchor ll rr className='mb10 ww' address={order?.userAddress} title='收:' time={`${order.orderTimeFormat}`}
      onClick={() => {
        Taro.showToast({ icon: "none", title: `${order?.userAddress?.address}` });
      }} />
    <ComAddressSwitchor ll rr className='mb10 ww' address={order?.deptAddress} title='团:' time={order.lastPrintTime ? `印${format(coo___ios_date(order.lastPrintTime), "MM/dd HH:mm")}` : ""}
      onClick={() => {
        Taro.showToast({ icon: "none", title: `${order?.deptAddress?.address}` });
      }} />
    <View className='ww'>
      {!Boolean(order.productList?.length) &&
        <View className='dll mb10'>
          <ComButton ll className='' >
            上门时间: {order.pickUpDate ? order.pickUpDate : "今天"} {order.pickUpRange ? order.pickUpRange : "尽快"}
          </ComButton>
          {order.remark &&
            <View className=' cccplh fs08'>
              备注:{order.remark}
            </View>
          }
        </View>
      }

    </View>
    {Boolean(order.productList?.length) &&
      <View className='ww mb10'>
        {order.productList?.map((e) => {
          return <View className='dbtc ww' key={e.id}>
            <ComButton ll><View className='dbase'><Text className='wm10rem nw1'>{e.name}</Text></View></ComButton>
            <View className='dy'>
              <ComButton rr className='nw' onClick={async () => {
                await try_Taro_setClipboardData({ data: e.code! });
                Taro.showToast({ icon: "none", title: `${e.code} 已复制` });
              }}>
                <Text className='cccplh mr6'>{e.code?.toUpperCase()}</Text>
                <ComPrice price={e.totalPrice!} />
              </ComButton>
              <ComButton rr className='cccgreen bborder nw' onClick={async () => { Taro.previewMedia({ current: 0, sources: e.img?.split(",").map(ee => ({ url: ee })) ?? [] }); }}>图片</ComButton>
              {!e.code && order.orderStatus === 2 && onBindCode && <ComButton rr className='cccgreen bborder nw ml10' onClick={async () => onBindCode?.(e)}>绑码</ComButton>}
            </View>
          </View>;
        })}
      </View>
    }
    <View className='dbtc mb10 '>
      <View className='dy'>
        {(order?.latestEventType || order?.index) && <>
          {order?.latestEventType && <ComButton ll className='cccplh'>{['→团', '→厂', '厂→', '团→'][order?.latestEventType - 1]}</ComButton>}
          {order?.index && <ComButton ll className='bccback ml10'><View className='cccprice' >{order.index}</View></ComButton>}
        </>
        }
      </View>
      <ComButton rr onClick={async () => {
        await try_Taro_setClipboardData({ data: order.outTradeNo ?? "" });
        Taro.showToast({ icon: "none", title: `已复制`, });
      }}>
        <Text className=''>{order.productList?.length}件</Text> /
        <ComPrice price={Number(order?.totalPrice) / 100} />
      </ComButton>
    </View>
  </View>;
};





export const ComCardOrderBringGoods: FC<{
  className?: string;
  order: OrderInfo<Product_Dryclean>;
  products?: Product_Dryclean[];
  model?: "waybill" | "print",
  isShowSelector?: boolean;
  onSelectOrder?: (e: Product_Dryclean) => void;
}> = ({ order, className = "", model, products, onSelectOrder, isShowSelector = false }) => {
  return <View className={`bccwhite prl10 ioo pt10 ww ${className}`}>
    <View className='dbtc ww mb10'>
      <MMMOrderUser order={order} />
      <ComButton rr className='cccgreen'>{Product_category_ST[order.orderType!]}</ComButton>
    </View>
    <ComAddressSwitchor ll rr className='ww mb10' title='收:' address={order?.userAddress} time={order.orderTimeFormat} />
    <ComAddressSwitchor ll rr className='ww mb10' title='团:' address={order?.deptAddress} />

    <View className='ww'>
      {order?.productList?.map((e, i) => {
        return <View className='dtl ww bccback mb10 ioo pr' key={i}>
          {model === "waybill" && isShowSelector && order.orderStatus == 2 &&
            <View className='pa z1 ' style={{ top: "0rem", left: '0rem' }} onClick={() => { onSelectOrder?.(e); }} >
              <View className={`${utils_arr_includes([e.id!], (products?.map(ee => ee.id!)!),) ? 'bccred' : 'bccback '} dxy cccwhite o6`} style={{ minWidth: "calc(1.2 * var(--rem_base))", minHeight: "calc(1.2 * var(--rem_base))" }}>
                <View className='fs07'>{i + 1}</View>
              </View>
            </View>
          }
          {model === "print" && isShowSelector && order.orderStatus == 2 &&
            <View className='pa z1 ' style={{ top: "0rem", left: '0rem' }} onClick={() => { onSelectOrder?.(e); }} >
              <View className={`${utils_arr_includes([e.waybillId!], (products?.map(ee => ee.waybillId!)!),) ? ' bccgreen' : 'bccback '} dxy cccwhite o6`} style={{ minWidth: "calc(1.2 * var(--rem_base))", minHeight: "calc(1.2 * var(--rem_base))" }}>
                <View className='fs07'>{order?.productList?.findIndex(ee => ee.waybillId === e.waybillId)! + 1}</View>
              </View>
            </View>
          }
          <ComImage className='mr10' src={e.pictureUrl!} style={{ width: "4rem" }} />
          <View className='ww'>
            <View className='dbtc ww'>
              <ComButton ll className='bccback'>
                <View className='nw1'>{e?.name}</View>
              </ComButton>
              <ComButton rr className='bccback'>
                <ComPrice price={Number(e?.totalPrice)} />
              </ComButton>
            </View>
            {e?.waybillId && <View className='cccplh dbtc ww' >
              <Text className='nw1' onClick={() => try_Taro_setClipboardData({ data: e.waybillId! })}>运单号:{e?.waybillId}</Text>  <Text className='nw'>/{e.printTimes ?? 0}</Text>
              <Text className='cccgreen pl10' onClick={async () => {
                await try_Taro_navigateTo({ url: `/pages_comm/comm__express_path?${coo___objToUrl({ express_share_id: order.id })}` });
              }}>轨迹</Text>
            </View>}
          </View>
        </View>;
      })}
      <View className='dr'>
        <ComButton rr hoverClass='none'>
          <Text className='mr2'>订单总价</Text> <ComPrice price={Number(order?.totalPrice) / 100} />
        </ComButton>
      </View>

    </View>
  </View>;
};



// 杂物
export const ComCardOrderSundries: FC<{
  className?: string;
  order: OrderInfo<Product_Dryclean>;
}> = ({ order, className = "", }) => {
  return <View className={`bccwhite prl10 ioo pt10 ww ${className}`}>
    <View className='dbtc ww mb10'>
      <MMMOrderUser order={order} />
      <ComButton rr className='cccgreen'>{Product_category_ST[order.orderType!]}</ComButton>
    </View>
    <ComAddressSwitchor ll rr className='ww mb10' title='收:' address={order?.userAddress} time={format(coo___ios_date(order.orderTime), "MM/dd HH:mm")} />
    <ComAddressSwitchor ll rr className='ww mb10' title='团:' address={order?.deptAddress} />
  </View>;
};
