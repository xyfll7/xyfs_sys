// :: pages_comm/comm__product_express
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { OrderInfo, Product_Express } from "@xyfs/taro_uii";
import { Api_userAddress_add_ctn } from "@xyfs/taro_uii/api/api__address";
import { Api_logistic_check_ctn } from "@xyfs/taro_uii/api/api__logistics";
import { Api_order_pre_ctn, Api_order_previewPrice_ctn } from "@xyfs/taro_uii/api/api__orders";
import { Api_common_textOCR_ctn } from "@xyfs/taro_uii/api/api__users";
import CPExpress from '@xyfs/taro_uii/compages/CPExpress';
import { ComAddressSwitchor } from "@xyfs/taro_uii/components/ComAddressSwitchor";
import { ComButton } from "@xyfs/taro_uii/components/ComButton";
import { ComInput } from "@xyfs/taro_uii/components/ComInput";
import { ComNav } from "@xyfs/taro_uii/components/ComNav";
import { ComNavBarA } from "@xyfs/taro_uii/components/ComNavBarA";
import { ComPaySuccessCard } from "@xyfs/taro_uii/components/ComPaySuccessCard";
import { ComPopupNew } from "@xyfs/taro_uii/components/ComPopupNew";
import { ComQRCode } from "@xyfs/taro_uii/components/ComQRCode";
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSquare } from "@xyfs/taro_uii/components/ComSquare";
import { ComWeightPrice } from "@xyfs/taro_uii/components/ComWeightPrice";
import { ComSELFView, MMMAAPage } from "@xyfs/taro_uii/components/MMMAAPage";
import { ComProvinceCityArea, initAddressData, MMMAddress } from "@xyfs/taro_uii/components/MMMAddress";
import { MMMPoster, MMMPosterExpress } from "@xyfs/taro_uii/components/MMMPoster";
import { Address_T, ErrorR, Order_ST, PickUp_ST } from "@xyfs/taro_uii/src/config";
import { get_dev_value } from "@xyfs/taro_uii/src/env";
import { IM_线上_收款码 } from "@xyfs/taro_uii/src/image";
import { roo___has_role, roo___role_regiment } from "@xyfs/taro_uii/src/roles";
import { useSTExpress, useSTSelf } from "@xyfs/taro_uii/store/store";
import { AddressInfo } from "@xyfs/taro_uii/type_user";
import { try_Taro_requestPayment } from "@xyfs/taro_uii/utils/try_catch";
import { utils_get_cloud_printer, utils_get_page_opener, utils_get_qrcode } from "@xyfs/taro_uii/utils/util";
import { utils_validate_express } from "@xyfs/taro_uii/utils/validator";
import { coo___objToUrl } from "@xyfs/utils/util";
import { FC, useEffect, useState } from "react";

definePageConfig({
  navigationStyle: "custom", enableShareAppMessage: true, disableScroll: true,
});
export default function COMSELFWarp() { return <ComSELFView isRefreshSelfInfo_SEveryTime><Index></Index></ComSELFView>; };
export const Index = () => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);

  const express_S = useSTExpress(s => s.express);

  const [initProvinceCityArea, setInitProvinceCityArea] = useState<{ province: string, city: string, area: string; } | null>(null);

  const [initAddress, setInitAddress] = useState<AddressInfo | null>(null);
  const [posterUrl, setPosterUrl] = useState("");
  useEffect(() => {
    useSTExpress.getState().sett();
    utils_get_page_opener()?.on("cloneExpress", (e: OrderInfo<Product_Express>) => {
      if (e.__isEdit) {
        useSTExpress.getState().sett({ ...e, orderId: e.id });
      } else {
        useSTExpress.getState().sett({ productList: [{ sendMan: e.productList?.[0]?.sendMan, recMan: e.productList?.[0]?.recMan }] });
      }
    });
  }, []);

  if (!express_S) { return null; }
  if (!roo___has_role(selfInfo_S, ["REGIMENT"])) {
    return <ComNav>
      <View className='prl10 dll'>
        <ComButton className='cccplh'>抱歉您无权访问该页面</ComButton>
        <ComButton className='cccplh prl10 bccback'>只有团长才可以访问该页面</ComButton>
      </View>
    </ComNav>;
  }
  return <MMMAAPage>
    <ComNav isRight>
      <View className='ww dbtc'>
        <ComNavBarA className='mb10 pl10'>
          <ComButton ll className='bcctrans cccplh ml10'>快递服务</ComButton>
        </ComNavBarA>
        <ComButton rr className='mr10 mb10 cccplh' onClick={async () => {
          Taro.showLoading({ mask: true, title: "生成中..." });
          const res = await utils_get_qrcode({
            appid: process.env.TARO_APP_CLIENT,
            page: "pages_comm/comm__product_express",
            scene: coo___objToUrl({ R_D: Number(useSTSelf.getState().selfInfo!.mobile).toString(36), })
          });
          Taro.hideLoading();
          setPosterUrl(res!);
        }
        }><Text className='cccgreen'>⤻</Text>海报</ComButton>
      </View>
    </ComNav>
    <ComScrollView className='IOO'>
      <View className='dll'>
        <CPExpress.ExpressSendMan className='mb10' onCreateNewSender={() => {
          setInitAddress(initAddressData());
        }} />
        <CPExpress.ExpressRecMan
          onChooseProvinceCityArea={() => {
            setInitProvinceCityArea({
              province: express_S.productList?.[0]?.recMan?.province ? express_S.productList?.[0]?.recMan?.province : "",
              city: express_S.productList?.[0]?.recMan?.city ? express_S.productList?.[0]?.recMan?.city : "",
              area: express_S.productList?.[0]?.recMan?.area ? express_S.productList?.[0]?.recMan?.area : "",
            });
          }}
          onSmartPast={async (text) => {
            Taro.showLoading({ mask: true, title: "识别中..." });
            const res_address = await Api_common_textOCR_ctn({ text: text });
            useSTExpress.getState().sett({ productList: [{ recMan: res_address }] });
            Taro.hideLoading();
          }} />
        <CPExpress.ExpressInfo />
        <ComButton className='mb10 cccplh bccbacktab' hoverClass='none'>首重6元起，上门取件+2元</ComButton>
      </View>
    </ComScrollView>
    <IIIOrderPayRegiment />
    <ComPaySuccessCard />
    {initAddress && <ComPopupNew onClose={() => { setInitAddress(null); }}>
      <MMMAddress title='寄件人'
        onClearAddress={() => { setInitAddress(initAddressData()); }}
        onSetAddress={(e) => {
          setInitAddress(e);
        }}
        initAddress={initAddress}
        onSaveAddress={async () => {
          Taro.showLoading({ mask: true, title: "保存中..." });
          const res = await Api_userAddress_add_ctn({
            ...initAddress,
            type: Address_T.寄件地址,
          });
          useSTExpress.getState().sett({ productList: [{ sendMan: { ...initAddress, realId: res.realId ?? "", realName: res.realName ?? "" } }] });
          Taro.showToast({ icon: "none", title: "保存成功" });
        }}
        onClose={() => { setInitAddress(null); }}
        onSmartPast={async (text) => {
          Taro.showLoading({ mask: true, title: "识别中..." });
          const res_address = await Api_common_textOCR_ctn({ text: text });
          setInitAddress(res_address);
          Taro.hideLoading();
        }}
        onShowProvinceCityArea={() => {
          setInitProvinceCityArea({
            province: "",
            city: "",
            area: "",
          });
        }} />
    </ComPopupNew>
    }
    {initProvinceCityArea && <ComPopupNew>
      <ComProvinceCityArea initAddress={initProvinceCityArea}
        onSetAddress={(e) => {
          setInitProvinceCityArea(null);
          if (initAddress) {
            setInitAddress(ee => ({ ...ee!, ...e }));
          } else {
            useSTExpress.getState().sett({
              productList: [{ recMan: { ...e! } }]
            });
          }
        }}
        onClose={() => setInitProvinceCityArea(null)}></ComProvinceCityArea>
    </ComPopupNew>}
    {posterUrl && <MMMPoster onClose={() => { setPosterUrl(""); }} background='linear-gradient(-170deg,#FFD70A 0%,#FFD70A 40%,#ffffff 80%,#ffffff 100%)'>
      <MMMPosterExpress src={posterUrl} />
    </MMMPoster>}
  </MMMAAPage>;
};

const IIIOrderPayRegiment: FC<{}> = ({ }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const express_S = useSTExpress(s => s.express);
  const [showQRCode, setShowQRCode] = useState<boolean>(false);



  if (!express_S) { return null; }
  const isShunFeng = express_S?.productList?.[0]?.deliveryId === "SF";
  const isJingDong = express_S?.productList?.[0]?.deliveryId === "JD";

  async function ___pre_pay() {
    if (isShunFeng && !express_S.productList?.[0]?.expressType) {
      throw new ErrorR(`顺丰请选择"特快"或"标快"`, true);
    }
    if (isJingDong && !express_S.productList?.[0]?.expressType) {
      throw new ErrorR(`京东请选择"电商"或"标快"`, true);
    }
    await utils_validate_express("send", express_S?.productList![0]?.sendMan!);
    await utils_validate_express("rec", express_S?.productList![0]?.recMan!);

    if (!express_S?.productList![0]?.sendMan?.realName) { throw new ErrorR("请先实名", true); }
    if (!express_S?.productList?.[0]?.itemType) { throw new ErrorR("请输入品名", true); }
    if (!express_S?.productList?.[0]?.weight) { throw new ErrorR("请输入重量", true); }
    if (!express_S?.productList?.[0]?.deliveryId) { throw new ErrorR("请选择快递公司", true); }

    Taro.showLoading({ mask: true, title: "检查地址...", });
    await Api_logistic_check_ctn(useSTExpress.getState().express);
    Taro.showLoading({ mask: true, title: "获取价格...", });

    const res_price = await Api_order_previewPrice_ctn(useSTExpress.getState().express);
    useSTExpress.getState().sett({
      totalPrice: String(res_price.totalPrice) ?? "",
      productList: [{
        price: String(res_price.productList?.[0].price),
        totalPrice: String(res_price.productList?.[0].totalPrice),
        pickUpPrice: String(res_price.productList?.[0].pickUpPrice),
      }]
    });
    Taro.showLoading({ mask: true, title: "支付中...", });
    const res_pay = await Api_order_pre_ctn({ ...useSTExpress.getState().express, nowPay: true, ...get_dev_value({ totalPrice: "1" }) });
    return res_pay;
  }


  return (
    <View className='ww pt10' >
      <View className='dy dwp'>
        {[...(selfInfo_S?.logistics ?? [])].map((e, i) => {
          return <ComButton ll={i !== 0} className={`mb10 bccwhite mr10 ${express_S.productList?.[0]?.deliveryId === e.deliveryId ? 'cccgreen' : ''}`} key={i} onClick={() => {
            useSTExpress.getState().sett({
              totalPrice: "",
              productList: [{
                price: "",
                totalPrice: "",
                pickUpPrice: "",
              }]
            });
            useSTExpress.getState().sett({ productList: [{ deliveryId: e.deliveryId, bizId: e.bizId, deliveryName: e.deliveryName, divisor: e.divisor }] });
          }} >{e.deliveryName?.slice(0, 2)}</ComButton>;
        })}
      </View>
      <View className='dbtc'>
        <IIIPaoZhong divisor={express_S.productList?.[0]?.divisor ?? 8000} onPaoZhong={(e) => { useSTExpress.getState().sett({ productList: [{ weight: e }] }); }} />
        {isShunFeng && <View className='dy'>
          <ComButton rr className={`mb10 ${express_S.productList?.[0]?.expressType === "2" ? "cccgreen" : ""}`} onClick={() => {
            useSTExpress.getState().sett({ productList: [{ expressType: "2" }] });
          }}>标快</ComButton>
          <ComButton className={`mb10 ${express_S.productList?.[0]?.expressType === "1" ? "cccgreen" : ""}`} onClick={() => {
            useSTExpress.getState().sett({ productList: [{ expressType: "1" }] });
          }}>特快</ComButton>
        </View>
        }
        {isJingDong && <View className='dy'>
          <ComButton rr className={`mb10 ${express_S.productList?.[0]?.expressType === "2" ? "cccgreen" : ""}`} onClick={() => {
            useSTExpress.getState().sett({ productList: [{ expressType: "2" }] });
          }}>电商</ComButton>
          <ComButton className={`mb10 ${express_S.productList?.[0]?.expressType === "1" ? "cccgreen" : ""}`} onClick={() => {
            useSTExpress.getState().sett({ productList: [{ expressType: "1" }] });
          }}>标快</ComButton>
        </View>
        }
      </View>
      <View className='dbtc'>
        <ComWeightPrice className='mb10'
          weight={String(express_S.productList?.[0]!.weight)}
          price={String(express_S.totalPrice!)}
          plus={String(express_S.productList?.[0]?.pickUpPrice)}
          onSetWeight={(e) => { useSTExpress.getState().sett({ productList: [{ weight: e, totalPrice: "" }] }); }} />
        {express_S.pickUpType !== PickUp_ST.到店寄件 &&
          <ComButton rr ll className='mb10 cccgreen nw' onClick={async () => {
            if (Number(express_S.productList?.[0]?.totalPrice) === 0) {
              Taro.showToast({ icon: "none", title: "请先获取价格" });
            } else {
              if (Number(express_S.productList?.[0]?.pickUpPrice) <= 100) {
                const _pickUpPrice = Number(express_S.productList?.[0]?.pickUpPrice) + 100;
                useSTExpress.getState().sett({
                  totalPrice: String(Number(express_S.productList?.[0]?.price) + _pickUpPrice),
                  productList: [{
                    pickUpPrice: String(_pickUpPrice),
                    totalPrice: String(Number(express_S.productList?.[0]?.price) + _pickUpPrice)
                  }]
                });
              } else {
                throw new ErrorR("上门费最高收2元", true);
              }
            }
          }}>+上门费</ComButton>}
        <ComButton className='mb10 cccgreen nw' onClick={async () => {
          if (isShunFeng && !express_S.productList?.[0]?.expressType) {
            throw new ErrorR(`顺丰请选择"特快"或"标快"`, true);
          }
          if (isJingDong && !express_S.productList?.[0]?.expressType) {
            throw new ErrorR(`京东请选择"电商"或"标快"`, true);
          }
          await utils_validate_express("send", express_S.productList?.[0]?.sendMan);
          await utils_validate_express("rec", express_S.productList?.[0]?.recMan);
          if (!express_S.productList?.[0]?.deliveryId) { throw new ErrorR("请选择快递公司", true); }
          if (!express_S?.productList?.[0]?.weight) { throw new ErrorR("请输入重量", true); }
          Taro.showLoading({ mask: true, title: "正在获取价格...", });

          const res_price = await Api_order_previewPrice_ctn(express_S);
          useSTExpress.getState().sett({
            totalPrice: String(res_price.totalPrice),
            productList: [{
              price: String(res_price.productList?.[0].price),
              totalPrice: String(res_price.productList?.[0].totalPrice),
              pickUpPrice: String(res_price.productList?.[0].pickUpPrice),
            }]
          });
          Taro.hideLoading();
        }}>获取价格</ComButton>
      </View>
      <View className='ww mb10 dbtc'>
        <ComAddressSwitchor className='bccback mr10' isShort title='团:' address={roo___role_regiment(selfInfo_S)} />

        <ComButton ll rr={Boolean(express_S.__isEdit)}
          className='bccyellow fwb'
          onClick={async () => {
            const res_pay = await ___pre_pay();
            try {
              useSTExpress.getState().sett({ orderStatus: Order_ST.待付款, id: res_pay.orderId, outTradeNo: res_pay.outTradeNo });
              await try_Taro_requestPayment({ ...res_pay, package: res_pay.packageStr });
              useSTExpress.getState().sett({ orderStatus: Order_ST.已付款, });
              Taro.hideLoading();
            } finally {
              useSTExpress.getState().sett({ ___show: true });
              await Api_userAddress_add_ctn({
                ...express_S!.productList![0]!.recMan,
                type: Address_T.收件地址,
                id: undefined
              });
              Taro.showToast({ icon: "none", title: "收件人信息保存成功" });
            }
          }}>

          <ComSquare className='icon-wxpay mr4' style={{ width: "calc(1.3 * var(--rem_base))" }} />
          <Text className='nw'>团长·下单</Text>
        </ComButton>


        {express_S.__isEdit &&
          <ComQRCode className='fwb bccgreen cccwhite' params={{
            buttonText: "仅修改",
            title: "请顾客扫此二维码支付",
            desc: ["可将此二维码保存打印", "顾客扫此二维码打开“待付款”订单列表"],
            src: IM_线上_收款码
          }} isShow={showQRCode}
            onClose={() => { setShowQRCode(!showQRCode); useSTExpress.getState().sett({ ___show: false }); }}
            onClick={() => setShowQRCode(!showQRCode)}
            onPreTap={async () => {
              const res_printer = await utils_get_cloud_printer(selfInfo_S);
              if (res_printer) {
                useSTExpress.getState().sett({ printerId: res_printer.id, });
              }
              await ___pre_pay();
              Api_userAddress_add_ctn({
                ...express_S!.productList![0]!.recMan,
                type: Address_T.收件地址,
                id: undefined
              });
              Taro.hideLoading();
              Taro.showToast({ icon: "none", title: "收件人信息保存成功" });
            }}></ComQRCode>
        }

      </View>
    </View>
  );
};

const IIIPaoZhong = ({ onPaoZhong, divisor = 8000 }: { divisor?: number, onPaoZhong: (e: string) => void; }) => {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  return <View className='dy'>
    <ComButton rr className='bccbacktab mb10' hoverClass='none'>
      <ComInput alwaysEmbed className='w3rem' placeholder='长cm' type='number' style={{}} value={length} onInput={(e) => { setLength(e.detail.value.replace(/[^0-9]/g, "")); }} />
    </ComButton>
    <ComButton rr ll className='bccbacktab mb10' hoverClass='none'>
      <ComInput alwaysEmbed className='w3rem' placeholder='宽cm' type='number' style={{}} value={width} onInput={(e) => { setWidth(e.detail.value.replace(/[^0-9]/g, "")); }} />
    </ComButton>
    <ComButton rr ll className='bccbacktab mb10' hoverClass='none'>
      <ComInput alwaysEmbed className='w3rem' placeholder='高cm' type='number' style={{}} value={height} onInput={(e) => { setHeight(e.detail.value.replace(/[^0-9]/g, "")); }} />
    </ComButton>
    <ComButton rr ll className='mb10 bccback cccplh'>/{divisor}</ComButton>
    <ComButton ll className='mb10' onClick={async () => {
      if (!length) { throw new Error("请输入长"); }
      if (!width) { throw new Error("请输入宽"); }
      if (!height) { throw new Error("请输入高"); }
      onPaoZhong(((Number(length) * Number(width) * Number(height)) / divisor).toFixed(2));
    }}>抛重</ComButton>
  </View>;
};