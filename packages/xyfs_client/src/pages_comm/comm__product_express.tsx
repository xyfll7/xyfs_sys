// :: pages_comm/comm__product_express
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { OrderInfo, Product_Express } from "@xyfs/taro_uii";
import { Api_userAddress_add_ctn } from "@xyfs/taro_uii/api/api__address";
import { Api_order_pre_ctn } from "@xyfs/taro_uii/api/api__orders";
import { Api_common_textOCR_ctn } from "@xyfs/taro_uii/api/api__users";
import CPExpress from '@xyfs/taro_uii/compages/CPExpress';
import { ComAddressSwitchor } from "@xyfs/taro_uii/components/ComAddressSwitchor";
import { ComButton } from "@xyfs/taro_uii/components/ComButton";
import { ComMobileLogin } from "@xyfs/taro_uii/components/ComMobileLogin";
import { ComNav } from "@xyfs/taro_uii/components/ComNav";
import { ComNavBarA } from "@xyfs/taro_uii/components/ComNavBarA";
import { ComPaySuccessCard } from "@xyfs/taro_uii/components/ComPaySuccessCard";
import { ComPopupNew } from "@xyfs/taro_uii/components/ComPopupNew";
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComSELFView, MMMAAPage } from "@xyfs/taro_uii/components/MMMAAPage";
import { ComProvinceCityArea, initAddressData, MMMAddress } from "@xyfs/taro_uii/components/MMMAddress";
import { Address_T, ErrorR, Order_ST } from "@xyfs/taro_uii/src/config";
import { roo___has_role, roo___role_regiment } from "@xyfs/taro_uii/src/roles";
import { useSTExpress, useSTSelf } from "@xyfs/taro_uii/store/store";
import { AddressInfo } from "@xyfs/taro_uii/type_user";
import { try_Taro_showModal } from "@xyfs/taro_uii/utils/try_catch";
import { utils_get_page_opener } from "@xyfs/taro_uii/utils/util";
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

  useEffect(() => {
    useSTExpress.getState().sett();
    utils_get_page_opener()?.on("cloneExpress", (e: OrderInfo<Product_Express>) => {
      useSTExpress.getState().sett({ productList: [{ sendMan: e.productList?.[0]?.sendMan, recMan: e.productList?.[0]?.recMan, }] });
    });
  }, []);
  if (!express_S) { return null; }
  return <MMMAAPage>
    <ComNav>
      <ComNavBarA className='mb10 pl10'>
        <ComButton ll className='bcctrans ml10 cccplh' >快递服务</ComButton>
      </ComNavBarA>
    </ComNav>
    <ComScrollView className='IOO'>
      {!selfInfo_S?.realId && roo___has_role(selfInfo_S, ['USER']) &&
        <View className='prl10 pt10  ioo mb10 bccback'>
          <View className='mb10 cccprice'>根据相关法律法规要求，寄件须实名认证。推荐您提前线上实名，一次实名长期有效，寄件更便捷哦～</View>
        </View>
      }
      <CPExpress.ExpressSendMan className='mb10' onCreateNewSender={() => { setInitAddress(initAddressData()); }} />
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
    </ComScrollView>
    <IIIOrderPayUser />
    <ComPaySuccessCard />
    {initAddress && <ComPopupNew onClose={() => { setInitAddress(null); }}>
      <MMMAddress title='寄件人'
        onClearAddress={() => { setInitAddress(initAddressData()); }}
        onSetAddress={(e) => { setInitAddress(e); }}
        initAddress={initAddress}
        onSaveAddress={async () => {
          Taro.showLoading({ mask: true, title: "保存中..." });
          const res = await Api_userAddress_add_ctn({
            ...initAddress,
            type: Address_T.寄件地址,
            realId: selfInfo_S.realId,
            realName: selfInfo_S.realName,
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
        }}></MMMAddress>
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
  </MMMAAPage>;
};


const IIIOrderPayUser: FC<{}> = ({ }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const express_S = useSTExpress(s => s.express);
  return (
    <View className='ww pt10'>
      <ComMobileLogin className='mb10' onGetPhoneNumber={(e) => {
        useSTExpress.getState().sett({ mobile: e });
      }} />
      <View className='mb10 dbtc ww '>
        {/* 团长信息 */}
        <ComAddressSwitchor className='bccback mr10 ww' isShort isIcon address={roo___role_regiment(selfInfo_S)} url='/pages_user/user_regiment_list_map' />
        <ComButton className='bccyellow fwb nw'
          onClick={async () => {
            if (!selfInfo_S?.mobile) { throw new ErrorR("请先“手机号快捷登录”!", true); }
            // 用户下单没有指定具体快递公司,不检查快递可达性
            await utils_validate_express("rec", express_S?.productList?.[0]?.recMan!);
            await utils_validate_express("send", express_S?.productList?.[0]?.sendMan!);
            if (!express_S?.productList?.[0]?.itemType) { throw new ErrorR("请输入品名", true); }
            Taro.showLoading({ mask: true, title: "提交中...", });
            await Api_order_pre_ctn({ ...useSTExpress.getState().express, nowPay: false });
            Taro.hideLoading();

            if (await try_Taro_showModal({ title: "提示", content: "下单成功", confirmText: "查看订单", cancelText: "继续下单", })) {
              Taro.redirectTo({ url: `/pages_user/user_orders?${coo___objToUrl({ order_ST: String(Order_ST.待付款) })}` });
            } else {
              useSTExpress.getState().sett({ ___show: false });
            }
          }}>
          确认·下单
        </ComButton>
      </View>
    </View >
  );
};
