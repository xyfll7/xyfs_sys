import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { FC, useCallback, useState } from "react";
import { Pagination } from "../../types";
import { AddressManType } from "../../types/type_product";
import { AddressInfo } from "../../types/type_user";
import { Api_userAddress_add_ctn, Api_userAddress_list_ctn, Api_userAddress_remove_ctn } from "../api/api__address";
import { Api_common_textOCR_ctn, Api_user_edit_ctn } from "../api/api__users";
import { ComButton } from "../components/ComButton";
import { ComListTypeSelectorNew } from "../components/ComListTypeSelectorNew";
import { ComLoading } from "../components/ComLoading";
import { ComNav } from "../components/ComNav";
import { ComNavBarA } from "../components/ComNavBarA";
import { ComPopupNew } from "../components/ComPopupNew";
import { ComScrollView } from "../components/ComScrollView";
import { ComSearcher } from "../components/ComSearcher";
import { MMMAAPage } from "../components/MMMAAPage";
import { ComProvinceCityArea, initAddressData, MMMAddress } from "../components/MMMAddress";
import { Address_T, ErrorR } from "../config";
import { useSTSelf } from "../store/store";
import { Taro_getCurrentInstance, try_Taro_navigateBack, try_Taro_setClipboardData, try_Taro_showModal } from "../utils/try_catch";
import { useHook_pageListNew, useHook_Reducer } from "../utils/useHooks";
import { utils_get_page_opener } from "../utils/util";
import { utils_validate_express } from "../utils/validator";



const CPAddressList: FC = () => {
  const { options } = Taro_getCurrentInstance<{ manType: AddressManType; }>();
  const [addressType, setAddressType] = useState<Address_T>(options.manType === "send" ? Address_T.寄件地址 : Address_T.收件地址);

  const [searchValue, setSearchValue] = useHook_Reducer("");

  const ___page_getter = useCallback(async (p: Pagination<unknown>) =>
    await Api_userAddress_list_ctn({
      ...p,
      type: addressType,
      keyword: searchValue,
    }), [addressType, searchValue]);
  const { page, page_loading, page_list_get, page_list_update, page_init } = useHook_pageListNew(___page_getter);

  const [initProvinceCityArea, setInitProvinceCityArea] = useState<{ province: string, city: string, area: string; } | null>(null);

  const [initAddress, setInitAddress] = useState<AddressInfo | null>(null);
  return <MMMAAPage>
    <ComNav>
      <View className='ww prl10'>
        <ComNavBarA className='mb10 '>
          <ComButton ll className='bcctrans cccplh ml10' >地址薄</ComButton>
        </ComNavBarA>
        <View className='dbtc '>
          <ComListTypeSelectorNew className='ww' disabled={page_loading} enumData={Address_T} typeList={[Address_T.寄件地址, Address_T.收件地址, Address_T.全部]}
            tabType={addressType} setTab={(e) => { setAddressType(e); page_init(); }}>
          </ComListTypeSelectorNew>
          {addressType !== Address_T.全部 && (
            <ComButton
              className='cccgreen bccwhite mb10 nw'
              onClick={() => { setInitAddress(initAddressData()); }}>
              {["", "+寄件人", "+收件人"][addressType]}
            </ComButton>
          )}
        </View>
        <ComSearcher className='mb10' placeholder='输入姓名/电话搜索' isShowSearcher disabled={page_loading}
          onSetSearchValue={(e) => { setSearchValue(e); page_init(); }} ></ComSearcher>
      </View>
    </ComNav>
    <ComScrollView onScrollToLower={async () => { page_list_get(page); }}>
      {page?.list?.map(e => {
        return <IIIAddRessCard addressType={addressType} key={e.mobile} address={e}
          onDelete={() => {
            page_list_update((p) => ({ ...p, list: p.list.filter(eee => eee.id !== e.id) }));
            Taro.showToast({ icon: "none", title: "删除成功" });
          }}
          onRefresh={() => { page_init(); }}
          editAddress={(ee: AddressInfo) => { setInitAddress(ee); }}></IIIAddRessCard>;
      })}
      <ComLoading className='mb10' isLastPage={page?.isLastPage} loading={page_loading} onLoadMore={() => page_list_get(page)} />
      {addressType !== Address_T.全部 && page.isLastPage === true && page?.list?.length === 0 &&
        <View className='dll'>
          <ComButton className='bccback cccplh mb10' hoverClass='none'>
            没搜到该用户试试 搜全部
          </ComButton>
          <ComButton className='bccyellow' onClick={() => { setAddressType(Address_T.全部); page_init(); }}>
            搜全部
          </ComButton>
        </View>

      }

    </ComScrollView>
    {initAddress && <ComPopupNew onClose={() => { setInitAddress(null); }}>
      <MMMAddress title={`${addressType === 1 ? "寄件人" : "收件人"}`}
        initAddress={initAddress}
        onClearAddress={() => { setInitAddress(initAddressData()); }}
        onSetAddress={(e) => { setInitAddress(e); }}
        onSaveAddress={async () => {
          if (initAddress) {
            await utils_validate_express(addressType === Address_T.寄件地址 ? "send" : "rec", initAddress);
            Taro.showLoading({ mask: true, title: "保存中..." });
            await Api_userAddress_add_ctn({
              ...initAddress,
              type: addressType,
              id: undefined
            });
            page_init();
            Taro.showToast({ icon: "none", title: "保存成功" });
          } else { throw new ErrorR(`请检查 ${["", "寄件地址", "收件地址"][addressType]}`, true); }
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
          }
        }}
        onClose={() => setInitProvinceCityArea(null)}></ComProvinceCityArea>
    </ComPopupNew>}
  </MMMAAPage >;
};
export { CPAddressList };










const IIIAddRessCard: FC<{
  addressType: Address_T;
  address: AddressInfo;
  editAddress: (e: AddressInfo) => void;
  onDelete: () => void;
  onRefresh: () => void;
}> = ({ address, addressType, editAddress, onDelete, onRefresh }) => {
  return <View key={address.mobile} className='ioo bccwhite mb10 ww'>
    <View className='prl10 dll pt10'>
      <View className='mr10 dll ww mb10'
        onClick={() => {
          utils_get_page_opener()?.emit("onSetAddressEvent", address);
          try_Taro_navigateBack();
        }}>
        <View className='dbtc ww'>
          <ComButton ll className='bccwhite '>
            <View className='mr6 wm7rem nw1 fwb'>{address.name}</View>
            <View >{address.mobile}</View>

            {address.isDefault === 1 && addressType !== 0 &&
              <View className='cccgreen ml6 fs08'> (默认)</View>}
          </ComButton>
          <ComButton rr className='cccplh slr'>{address.realName}</ComButton>
          {addressType !== 0 && <ComButton rr className={address.type === 1 ? "cccgreen" : "cccprice"}>{address.type === 1 ? "寄" : "收"}</ComButton>}
        </View>
        <View className='cccplh'> {address.province} {address.city} {address.area} {address.address}</View>
      </View>
      <View className='ww dy'>
        {address.isDefault !== 1 &&
          <ComButton ll className='mb10 bborder nw' onClick={async () => {
            const res_modal = await try_Taro_showModal({ title: "提示", content: "您确定要删除该地址？" });
            if (res_modal) {
              Taro.showLoading({ mask: true, title: "删除中...", });
              await Api_userAddress_remove_ctn(address.id!);
              onDelete();
              Taro.hideLoading();
            }
          }}>删除</ComButton>
        }
        <ComButton className='ww  mb10 bccwhite' hoverClass='none' onClick={() => {
          utils_get_page_opener()?.emit("onSetAddressEvent", address);
          try_Taro_navigateBack();
        }} />
        {address.isDefault !== 1 && addressType === Address_T.寄件地址 &&
          <ComButton rr className='cccgreen mb10 bborder nw' onClick={async () => {
            Taro.showLoading({ mask: true, title: "设置中...", });
            const res_userInfo = await Api_user_edit_ctn({ defaultSendManAddressId: address.id });
            useSTSelf.getState().sett(res_userInfo);
            Taro.hideLoading();
            onRefresh();
          }}>设为默认</ComButton>
        }

        {addressType !== Address_T.全部 &&
          <ComButton rr className='cccgreen mb10 bborder nw' onClick={() => { editAddress(address); }}>编辑</ComButton>
        }
        <ComButton rr className='cccgreen mb10 bborder nw' onClick={async () => {
          await try_Taro_setClipboardData({ data: `${address.name} ${address.mobile} ${address.province} ${address.city} ${address.area} ${address.address}`, });
          Taro.showToast({ icon: "none", title: "已复制", });
        }}>复制</ComButton>
      </View>
    </View>
  </View>;
};

