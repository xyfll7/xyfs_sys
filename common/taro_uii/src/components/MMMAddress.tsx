import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { coo___deep, coo___objToUrl } from "@xyfs/utils/util";
import { FC, useEffect, useRef, useState } from "react";
import { AddressManType } from "../../types/type_product";
import { AddressInfo } from "../../types/type_user";
import { Api_common_textOCR_ctn } from "../api/api__users";
import { try_Taro_chooseAddress, try_Taro_chooseLocation, try_Taro_chooseMedia, try_Taro_getClipboardData, try_Taro_navigateTo } from "../utils/try_catch";
import { utils_get_str_phone, utils_string_to_char_code } from "../utils/util";
import { utils_validate_express } from "../utils/validator";
import { ComButton } from "./ComButton";
import { ComInput } from "./ComInput";
import { ComNavBarB } from "./ComNavBarB";
import { ComScrollView } from "./ComScrollView";
import { ComTextarea } from "./ComTextarea";
import address_json from "./pca-code.json";




export const initAddressData = () => {
  return coo___deep({
    name: "",
    mobile: "",
    company: "",
    postCode: "",
    code: "",
    country: "中国",
    province: "",
    city: "",
    area: "",
    address: "",
    from: "CP",
    town: "",
  } satisfies AddressInfo);
};


export const MMMAddress: FC<{
  initAddress: AddressInfo,
  onSetAddress: (e: AddressInfo) => void;
  onSaveAddress?: () => Promise<void>;
  onClose: () => void;
  manType?: AddressManType | null;
  isEdit?: boolean,
  title?: "寄件人" | "收件人";
  onShowProvinceCityArea: () => void;
  onSmartPast: (str: string) => void;
  onClearAddress: () => void;
}> = ({ onClose, onSetAddress, onShowProvinceCityArea, onSmartPast, onSaveAddress, onClearAddress, initAddress, isEdit = false, title = "" }) => {
  const [addStr, setAddStr] = useState("");
  const [inputType, setInputType] = useState<"number" | "text">("number");
  const inputRef = useRef<any | null>(null);
  return (
    <View className='prl10  dll' style={{ minHeight: "80vh" }}>
      <ComNavBarB className='mb10' onClose={onClose}><ComButton className='fwb bccback'>{isEdit ? "编辑地址" : "新建地址"}</ComButton></ComNavBarB>
      <View className='ww dll'>
        <View className='prl10 dll pt10 ioo bccwhite ww mb10'>
          <View className='dy ww'>
            <ComButton ll className='mb10 fwb bccwhite'>{title}</ComButton>
            <ComButton rr className='cccgreen slr mb10 bborder' onClick={() => { setAddStr(""); onClearAddress(); }}>清空</ComButton>
            <ComButton rr ll className='cccgreen mb10 bborder'
              onClick={async () => {
                const res = await try_Taro_chooseAddress();
                onSetAddress({ ...res });
              }}>
              微信地址
            </ComButton>
            <ComButton rr ll className='cccgreen mb10 bborder'
              onClick={async () => {
                const [img] = await try_Taro_chooseMedia({
                  count: 1,
                  mediaType: ["image"],
                  sourceType: ["album", "camera"],
                  sizeType: ["compressed"],
                });
                if (img) {
                  await try_Taro_navigateTo({
                    url: `/pages_comm/comm__image_cropper?${coo___objToUrl({ imgSrc: img.tempFilePath })}`,
                    events: { onOcrRes: (ee: AddressInfo) => onSetAddress(ee) },
                  });
                }
              }}>
              图片识别
            </ComButton>
            <ComButton rr ll className='cccgreen mb10 bborder'
              onClick={async () => {
                const res_text = await try_Taro_getClipboardData();
                setAddStr(res_text);
                if (res_text.trim()) { onSmartPast(res_text.trim()); }
              }}>
              智能粘贴
            </ComButton>
          </View>

          <ComButton ll className='flx1 ww mb10 bccbacktab' hoverClass='none'>
            <ComInput placeholder='联系人:名字'
              value={initAddress.name}
              onInput={(e) => {
                onSetAddress({ ...initAddress, name: e.detail.value });
              }} />

          </ComButton>
          <ComButton ll rr className='flx1 ww mb10 bccbacktab' hoverClass='none'>
            <ComInput
              className={`ww ${addStr && (utils_get_str_phone(addStr) !== initAddress.mobile) ? "cccprice" : ""} `}
              ref={inputRef}
              type={inputType}
              placeholder='联系电话:手机号码/固定电话'
              value={initAddress.mobile}
              onInput={(e) => {
                onSetAddress({ ...initAddress, mobile: e.detail.value.replace(/[^0-9|-]/g, "") });
              }} />
            <View className=' hh dxy nw bccbacktab ioo' hoverClass='none'
              onClick={() => {
                setInputType("text");
                onSetAddress({ ...initAddress, mobile: `${initAddress?.mobile ? initAddress?.mobile : ""}-`, });
                inputRef.current?.focus?.();
              }}>- 分机号</View>
          </ComButton>
          <View className='dbtc ww mb10'>
            <ComProvinceCityAreaView className='mr10 bccbacktab' address={initAddress} addStr={addStr}
              onClick={onShowProvinceCityArea}></ComProvinceCityAreaView>
            <ComButton rr className='cccgreen bborder'
              onClick={onShowProvinceCityArea}>
              选择
            </ComButton>
            <ComButton rr className='cccgreen bborder'
              onClick={async () => {
                const res = await try_Taro_chooseLocation();
                Taro.showLoading({ mask: true, title: "地址解析...", });
                const res_address = await Api_common_textOCR_ctn({ text: res?.address?.trim() });
                onSetAddress({
                  ...initAddress,
                  province: res_address.province,
                  city: res_address.city,
                  area: res_address.area,
                  town: res_address.town ?? "",
                  address: res_address.address + " " + res.name,
                });
                Taro.hideLoading();
              }}>
              地图
            </ComButton>
          </View>
          <ComButton ll className='flx1 ww mb10 bccbacktab' hoverClass='none' >
            {addStr && initAddress?.town && !addStr?.includes(initAddress?.town) && <Text className='cccprice'>镇</Text>}
            <ComTextarea className='ww' value={initAddress.address} placeholder='详细地址:街道门牌信息' onInputText={(e) => { onSetAddress({ ...initAddress, address: e }); }}></ComTextarea>
          </ComButton>
          <ComButton rr ll className='mb10 ww bccbacktab bborder' hoverClass='none'>
            <View className='dbtc ww dy'>
              <Text style={{ maxWidth: "76vw" }}><Text className='nw cccplh fwb'>识别结果:</Text><Text className='cccplh' userSelect>{addStr}</Text></Text>
              <Text className={`${addStr ? "cccgreen" : "cccplh"}  nw pl10`} onClick={() => setAddStr("")}>清除</Text>
            </View>
          </ComButton>
        </View>

        {addStr && <View className='dy ww'> <ComButton className='cccprice slr mb10' >若有红色文字，请核对后使用</ComButton>   </View>}

        <View className='dy ww'>
          <ComButton className='bccyellow mb10 slr'
            onClick={async () => {
              await utils_validate_express("send", initAddress);
              await onSaveAddress?.(); onClose();
            }}>确认</ComButton>
        </View>
      </View>
    </View>
  );
};









export const ComProvinceCityArea: FC<{
  initAddress: { province: string, city: string, area: string; } | null;
  onSetAddress: (e: { province: string, city: string, area: string; }) => void;
  onClose: () => void;
}> = ({ initAddress, onSetAddress, onClose }) => {
  interface Address_json { code: string; name: string; children: Address_json[]; }
  const provinceList = address_json as Address_json[];
  const [cityList, setCityList] = useState<Address_json[]>([]);
  const [areaList, setAreaList] = useState<Address_json[]>([]);
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [level, setLevel] = useState<"0" | "1" | "2">("0");
  const [scrollInto, setScrollInto] = useState("");

  useEffect(() => {
    if (!initAddress) { return; }
    if (initAddress.province.trim()) {
      setProvince(initAddress.province);
      setCity(initAddress.city.trim());
      const _cityList = provinceList.find((e) => e.name.includes(initAddress.province.slice(0, 2)))?.children;
      setLevel("1");
      setCityList(_cityList ?? []);
      if (initAddress.city.trim()) {
        setArea(initAddress.area.trim());
        setAreaList(_cityList?.find((e) => e.name.includes(initAddress.city.slice(0, 2)))?.children ?? []);
        setLevel("2");
      }
    }
  }, [initAddress, provinceList]);
  return (
    <View className='prl10  dll' style={{ height: "70vh" }}>
      <ComNavBarB className='mb10' onClose={onClose}><ComButton className='fwb bccback'>选择地区</ComButton></ComNavBarB>
      <View className='mb10 dy fwb pl10'>
        <ComButton ll className={` mr10 ${level === "0" ? "bccyellow" : "bccwhite"}`} hoverClass='bccyellowtab'>
          <View
            className={`wm5rem nw1 ${province === "" && "cccplh"}`}
            onClick={() => {
              setLevel("0");
              if (provinceList.length && province) {
                setScrollInto("x");
                setTimeout(() => setScrollInto(provinceList.find((e) => e.name === province)?.name ?? "x"), 0);
              }
            }}>
            {province ? province : "省份/地区"}
          </View>
        </ComButton>
        {province && (
          <ComButton ll className={` mr10 ${level === "1" ? "bccyellow" : "bccwhite"}`} hoverClass='bccyellowtab'>
            <View
              className={`wm5rem nw1 ${city === "" && "cccplh"}`}
              onClick={() => {
                setLevel("1");
                if (cityList.length && city) {
                  setScrollInto("x");
                  setTimeout(() => setScrollInto(cityList.find((e) => e.name === city)?.name ?? "x"), 0);
                }
              }}>
              {city ? city : "城市"}
            </View>
          </ComButton>
        )}
        {city && (
          <ComButton ll className={` mr10 ${level === "2" ? "bccyellow" : "bccwhite"}`} hoverClass='bccyellowtab'>
            <View
              className={`wm5rem nw1 ${area === "" && "cccplh"}`}
              onClick={() => {
                setLevel("2");
                if (areaList.length && area) {
                  setScrollInto("x");
                  setTimeout(() => setScrollInto(areaList.find((e) => e.name === area)?.name ?? "x"), 0);
                }
              }}>
              {area ? area : "区/县"}
            </View>
          </ComButton>
        )}
      </View>
      <ComScrollView scrollIntoView={utils_string_to_char_code(scrollInto)}>
        <View className='ww bccwhite pt10 prl10 mb10 ioo'>
          {level === "0" &&
            provinceList.map((e) => {
              return (
                <View
                  className='dbtc mb10 '
                  id={utils_string_to_char_code(e.name)}
                  key={e.name}
                  onClick={() => {
                    setProvince(e.name);
                    setCityList(e.children);
                    setLevel("1");
                    if (e.name !== province) {
                      setCity("");
                    }
                  }}>
                  <ComButton ll className='bborder'>{e.name}</ComButton>
                  {province === e.name && (
                    <ComButton rr className='bborder' style={{ maxWidth: "25vw" }}>
                      <View className='nw1'>{e.name}</View>
                    </ComButton>
                  )}
                </View>
              );
            })}
          {level === "1" &&
            cityList.map((e) => {
              return (
                <View className='dbtc mb10 '
                  id={utils_string_to_char_code(e.name)}
                  key={e.name}
                  onClick={() => {
                    setCity(e.name);
                    setAreaList(e.children);
                    setLevel("2");
                    if (e.name !== city) {
                      setArea("");
                    }
                  }}>
                  <ComButton ll className='bborder'>{e.name}</ComButton>
                  {city === e.name && (
                    <ComButton rr className='bborder' style={{ maxWidth: "25vw" }}>
                      <View className='nw1'>{e.name}</View>
                    </ComButton>
                  )}
                </View>
              );
            })}
          {level === "2" &&
            areaList.map((e) => {
              return (
                <View
                  className='dbtc mb10'
                  id={utils_string_to_char_code(e.name)}
                  key={e.name}
                  onClick={() => {
                    setArea(e.name);
                    setLevel("2");
                    onSetAddress({ province: province, city: city, area: e.name, });
                  }}>
                  <ComButton ll className='bborder'>{e.name}</ComButton>
                  {area === e.name && (
                    <ComButton rr className='bborder' style={{ maxWidth: "25vw" }}>
                      <View className='nw1'>{e.name}</View>
                    </ComButton>
                  )}
                </View>
              );
            })}
        </View>
      </ComScrollView>
    </View>
  );
};

export const ComProvinceCityAreaView: FC<{ className?: string, address?: AddressInfo; addStr?: string; onClick: () => void; }> = ({ className, address, addStr, onClick }) => {
  return <ComButton ll className={`${className}  flx1 ${Taro.getDeviceInfo().platform === "ios" && "fwb"} ${!address?.province && "cccplh"}`} hoverClass='none'
    onClick={() => onClick()}>
    {address?.province ?
      <Text className='mr10 dy'>
        <Text className={`nw ${(!addStr || addStr.includes(address!.province!)) ? "" : "cccprice"} mr6`}>{address?.province}</Text>
        <Text className={`nw ${(!addStr || addStr.includes(address!.city!)) ? "" : "cccprice"} mr6`}>{address?.city}</Text>
        <Text className={`nw ${(!addStr || addStr.includes(address!.area!)) ? "" : "cccprice"}`}>{address?.area}</Text>
      </Text> :
      <View className='cccplh mr10 inline'>省</View>}
    {!address?.city &&
      <View className={`cccplh mr10 inline ${(address?.province && !address?.city) && "cccprice"}`}>
        市
      </View>}
    {!address?.area &&
      <View className={`cccplh mr10 inline ${(address?.province && !address?.area) && "cccprice"}`}>
        区
      </View>}
  </ComButton>;
};
