// :: pages_comm/comm__product_dryclean
import { Picker, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Api_userAddress_add_ctn } from '@xyfs/taro_uii/api/api__address';
import { Api_cart_preOrder_ctn } from '@xyfs/taro_uii/api/api__shop';
import { Api_user_edit_ctn } from '@xyfs/taro_uii/api/api__users';
import CPDryclean from '@xyfs/taro_uii/compages/CPDryclean';
import { ComAddressSwitchor } from '@xyfs/taro_uii/components/ComAddressSwitchor';
import { ComButton } from '@xyfs/taro_uii/components/ComButton';
import { ComInput } from '@xyfs/taro_uii/components/ComInput';
import { ComListTypeSelectorNew } from '@xyfs/taro_uii/components/ComListTypeSelectorNew';
import { ComLoading } from '@xyfs/taro_uii/components/ComLoading';
import { ComNav } from '@xyfs/taro_uii/components/ComNav';
import { ComNavBarA } from '@xyfs/taro_uii/components/ComNavBarA';
import { ComScrollView } from '@xyfs/taro_uii/components/ComScrollView';
import { ComSELFView, MMMAAPage } from '@xyfs/taro_uii/components/MMMAAPage';
import { roo___role_regiment } from '@xyfs/taro_uii/src/roles';
import { useSTSelf } from '@xyfs/taro_uii/store/store';
import { AddressInfo } from '@xyfs/taro_uii/type_user';
import { try_Taro_chooseAddress } from '@xyfs/taro_uii/utils/try_catch';
import { coo___ios_date } from '@xyfs/utils/util';
import { format, subDays } from 'date-fns';
import { FC, useState } from 'react';

definePageConfig({ navigationStyle: "custom", enableShareAppMessage: true, disableScroll: true });
export default function COMSELFWarp() { return <ComSELFView isRefreshSelfInfo_SEveryTime><Index></Index></ComSELFView >; };






const Index = () => {
  const [tabIndex, setTabIndex] = useState<number>(8);
  const [productCategory] = CPDryclean.useProducts(tabIndex);
  console.log("tabINdex::", tabIndex);
  const [tabItems] = CPDryclean.useTabItems();
  const ___test_boo = true;
  return <MMMAAPage>
    <ComNav className='prl10'>
      <View className='ww'>
        <ComNavBarA className='mb10 '>
          <ComButton ll className='bcctrans ml10 cccplh'>干洗服务</ComButton>
        </ComNavBarA>
        {___test_boo && tabItems && <ComListTypeSelectorNew
          className='ww' disabled={productCategory === null} data={tabItems} label='name' value='id'
          tabType={tabIndex} setTab={(e) => { setTabIndex(e); }} />}
      </View>
    </ComNav>
    <ComScrollView >
      {___test_boo && tabItems && productCategory && <CPDryclean.ProductCategoryCard productCategory={productCategory} />}
      <ComLoading className='mb10' isLastPage={!Boolean(productCategory === null) && true} loading={Boolean(productCategory === null)} />
    </ComScrollView>
    <IIIShopCartTabBarUser key='IIIShopCartTabBarUser' onToggle={() => { }} />
  </MMMAAPage>;
};

const IIIShopCartTabBarUser: FC<{ onToggle: () => void; onPay?: () => void; }> = ({ }) => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const [address, setAddress] = useState<AddressInfo | null>(useSTSelf.getState().selfInfo?.defaultRecManAddress ?? null);
  const [form, setForm] = useState({
    remark: "",
    pickUpDate: "",
    pickUpRange: "",
  });

  const time_range = [
    { value: '08:00~09:00', label: '', },
    { value: '09:00~10:00', label: '', },
    { value: '10:00~11:00', label: '', },
    { value: '11:00~12:00', label: '', },
    { value: '12:00~13:00', label: '', },
    { value: '13:00~14:00', label: '', },
    { value: '14:00~15:00', label: '', },
    { value: '15:00~16:00', label: '', },
    { value: '16:00~17:00', label: '', },
    { value: '17:00~18:00', label: '', },
    { value: '18:00~19:00', label: '☪︎ ', },
    { value: '19:00~20:00', label: '☪︎ ', },
    { value: '20:00~21:00', label: '☪︎ ', },
  ].map(e => ({ ...e, label: `${e.label}${e.value}` }));
  return <View className=''>
    <View className='dll'>
      <ComButton className='mb10 bccback cccplh'>预约上门取衣服(无需添加购物车)</ComButton>
      <ComButton className='bccbacktab mb10 ww' hoverClass='none'>
        <View className='dy ww'>
          <Text className='nw'>备注：</Text> <ComInput cursorSpacing={100} adjustPosition placeholder='给团长捎句话' onInput={e => setForm({ ...form, remark: e.detail.value })}></ComInput>
        </View>
      </ComButton>
      <View className='dy prl10 mb10'>
        <Text className='cccplh'>上门时间：</Text>
        <ComButton rr className={`mr10 ${form.pickUpDate ? "" : "cccgreen"}`} onClick={() => setForm({ ...form, pickUpDate: "", pickUpRange: "" })}>尽快</ComButton>
        <ComButton rr className={`${form.pickUpDate === format(subDays(coo___ios_date(), -1), "yyyy-MM-dd") ? "cccgreen" : ""}`} onClick={() => setForm({ ...form, pickUpDate: format(subDays(coo___ios_date(), -1), "yyyy-MM-dd") })}>明天</ComButton>
        <ComButton rr className={`${form.pickUpDate === format(subDays(coo___ios_date(), -2), "yyyy-MM-dd") ? "cccgreen" : ""}`} onClick={() => setForm({ ...form, pickUpDate: format(subDays(coo___ios_date(), -2), "yyyy-MM-dd") })}>后天</ComButton>
        <Picker mode='selector' headerText='请选择上门时间' rangeKey='label' range={time_range} onChange={(e) => {
          setForm({ ...form, pickUpRange: time_range[e.detail.value]?.value });
        }}>
          <ComButton rr className={`${form.pickUpRange ? "cccgreen" : ""}`}>{form.pickUpRange ? form.pickUpRange : "几点？"} </ComButton>
        </Picker>
      </View>
      <ComAddressSwitchor className='bccback mb10' isShort isIcon title='收货人:' address={address!} onClick={async (e) => {
        const res_address = await try_Taro_chooseAddress();
        setAddress(res_address);
      }} />
    </View>
    <View className='dbtc ww mb10'>
      <ComAddressSwitchor className='bccback mr10' isShort isIcon title='团长:' address={roo___role_regiment(selfInfo_S)} url='/pages_user/user_regiment_list_map' />
      <ComButton className='bccyellow fwb nw' onClick={async () => {
        if (address) {
          Taro.showLoading({ mask: true, title: "下单中..." });
          await Api_cart_preOrder_ctn({
            userMobile: address.mobile,
            recMan: address!,
            remark: form.remark,
            pickUpDate: form.pickUpDate,
            pickUpRange: form.pickUpRange,
          });
          Taro.showToast({ icon: "none", title: "下单成功" });
          const res_address = await Api_userAddress_add_ctn({ ...address, id: undefined, type: 2 });
          const res_userInfo = await Api_user_edit_ctn({ defaultRecManAddressId: res_address.id });
          useSTSelf.getState().sett(res_userInfo);
        } else {
          throw new Error("请先选择您的收货地址");
        }
      }}>
        一键预约
      </ComButton>
    </View>
  </View>;
};




