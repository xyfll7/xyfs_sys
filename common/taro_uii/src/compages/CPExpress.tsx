import { Text, View, ViewProps } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { coo___objToUrl } from "@xyfs/utils/util";
import { FC, useRef, useState } from "react";
import { AddressInfo } from "../../types/type_user";
import { Api_common_textOCR_ctn } from "../api/api__users";
import { ComButton } from "../components/ComButton";
import { ComInput } from "../components/ComInput";
import { ComNavBarB } from "../components/ComNavBarB";
import { ComPopupNew } from "../components/ComPopupNew";
import { ComTextarea } from "../components/ComTextarea";
import { ComProvinceCityAreaView } from "../components/MMMAddress";
import { MMMRealName } from "../components/MMMRealName";
import { PickUp_ST } from "../config";
import { roo___has_role } from "../roles";
import { useSTExpress, useSTSelf } from "../store/store";
import { try_Taro_chooseAddress, try_Taro_chooseLocation, try_Taro_chooseMedia, try_Taro_getClipboardData, try_Taro_hideLoading, try_Taro_navigateTo } from "../utils/try_catch";
import { utils_get_str_phone } from "../utils/util";




const ExpressSendMan: FC<ViewProps & { onCreateNewSender: () => void; }> = ({ onCreateNewSender, className }) => {
  const express_S = useSTExpress(s => s.express);
  const [show, setShow] = useState(false);
  if (!express_S) { return null; }


  const ___realNameT = (() => {
    const sendMan = express_S.productList?.[0]?.sendMan;
    if (sendMan?.realName) {
      return 2;  // 已实名
    } else if (sendMan?.mobile) {
      return 1; // 有电话号码/可以去实名
    } else {
      return 0; // 没有寄件人信息/电话号码 无法去实名
    }
  })();

  return <>
    <View className={`IOO bccwhite pt10 prl10 dll ww ${className}`}>
      <View className='dbtc mb10 ww'>
        <ComButton ll className='fwb dy mr10 bccwhite'>寄件人</ComButton>
        <ComButton rr className={`slr  mr10 bborder ${["cccplh", "cccprice", "cccplh"][___realNameT]}`}
          onClick={() => {
            [
              () => Taro.showToast({ icon: "none", title: "请先填写寄件人信息" }),
              () => { setShow(e => !e); },
              () => Taro.showToast({ icon: "none", title: "已实名" })
            ][___realNameT]!();
          }}>{["实名", "去实名", "已实名"][___realNameT]}</ComButton>


        <ComButton rr className='cccgreen bborder' onClick={() => { onCreateNewSender(); }}>
          新建寄件人
        </ComButton>
      </View>
      <View className='dbtc mb10 ww'
        onClick={async () => await try_Taro_navigateTo({
          url: `/pages_comm/comm__address_list?${coo___objToUrl({ manType: "send" })}`,
          events: { onSetAddressEvent: (e: AddressInfo) => { useSTExpress.getState().sett({ productList: [{ sendMan: e }] }); } }
        })}>
        <ComButton ll className='flx1 mr10 bccbackdeep' hoverClass='none' >
          <View>
            <View>{express_S.productList?.[0]?.sendMan?.name} {express_S!.productList?.[0]?.sendMan?.mobile}</View>
            <View className='nw3'>{express_S.productList?.[0]?.sendMan?.province} {express_S!.productList?.[0]?.sendMan?.city} {express_S.productList?.[0]?.sendMan?.area} {express_S.productList?.[0]?.sendMan?.address}</View>
          </View>
        </ComButton>
        <ComButton rr className='cccgreen bborder'>地址薄</ComButton>
      </View>
    </View>
    {show && <ComPopupNew>
      <View className='dll prl10' style={{ height: "70vh" }}>
        <ComNavBarB className='mb10' onClose={() => setShow(e => !e)}>
          <View className='dy'><ComButton className='fwb bccback'>实名认证</ComButton><Text className='wm5rem nw1 cccplh'>{express_S.productList?.[0]?.sendMan?.name}</Text> <Text className='cccplh'>{express_S.productList?.[0]?.sendMan?.mobile}</Text></View>
        </ComNavBarB>
        <MMMRealName onClose={() => setShow(e => !e)} address={express_S.productList![0]?.sendMan}></MMMRealName>
      </View>
    </ComPopupNew>}
  </>;
};

const ExpressRecMan: FC<{ onChooseProvinceCityArea: () => void; onSmartPast: (str: string) => void; }> = ({ onChooseProvinceCityArea, onSmartPast }) => {

  const express_S = useSTExpress(s => s.express);

  const [addStr, setAddStr] = useState("");
  const [inputType, setInputType] = useState<"number" | "text">("number");
  const inputRef = useRef<any | null>(null);
  if (!express_S) { return null; }
  return <View className='bccwhite prl10 IOO pt10 dll bccwhite mb10 ww'>
    <View className='dll ww'>
      <View className='dbtc  ww'>
        <ComButton ll className='fwb dy mr10 bccwhite mb10' >收件人</ComButton>
        <View className='dy'>
          <ComButton rr className='cccgreen mb10 bborder'
            onClick={async () => {
              setAddStr("");
              useSTExpress.getState().sett({ ___show: false });
            }}>
            清空
          </ComButton>
          <ComButton rr ll className='cccgreen mb10 bborder' onClick={async () => {
            setAddStr("");
            const res = await try_Taro_chooseAddress();
            useSTExpress.getState().sett({ productList: [{ recMan: { ...res } }] });
          }}>微信地址</ComButton>
          <ComButton rr ll className='cccgreen mb10 bborder'
            onClick={async () => {
              setAddStr("");
              const [img] = await try_Taro_chooseMedia({
                count: 1,
                mediaType: ["image"],
                sourceType: ["album", "camera"],
                sizeType: ["compressed"],
              });
              if (img) {
                await try_Taro_navigateTo({
                  url: `/pages_comm/comm__image_cropper?${coo___objToUrl({ imgSrc: img.tempFilePath })}`,
                  events: {
                    onOcrRes: (ee: AddressInfo & { text: string; }) => {
                      setAddStr(ee.text); useSTExpress.getState().sett({ productList: [{ recMan: ee }] });
                    },
                  },
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
      </View>
      <View className='dbtc ww'>
        <ComButton ll className='bccbackdeep flx1 mr10 mb10' hoverClass='none'>
          <ComInput placeholder='收件人姓名' value={express_S.productList?.[0]?.recMan?.name ?? ""}
            onInput={(e) => {
              useSTExpress.getState().sett({ productList: [{ recMan: { name: e.detail.value, } }] });
            }}>
          </ComInput>
        </ComButton>
        <ComButton rr className='cccgreen mb10 bborder'
          onClick={async () => {
            setAddStr("");
            await try_Taro_navigateTo({
              url: `/pages_comm/comm__address_list?${coo___objToUrl({ manType: "rec" })}`,
              events: { onSetAddressEvent: (e: AddressInfo) => { useSTExpress.getState().sett({ productList: [{ recMan: e }] }); } }
            });
          }}>
          地址薄
        </ComButton>
      </View>
      <ComButton ll rr className='bccbackdeep flx1 mb10 ww dy' hoverClass='none'>
        <ComInput ref={inputRef} className={`${addStr && (utils_get_str_phone(addStr) !== express_S.productList?.[0]?.recMan?.mobile) ? "cccprice" : ""} `}
          type={inputType} placeholder='联系电话:手机号码/固定电话' value={express_S?.productList?.[0]?.recMan?.mobile ?? ""}
          onInput={(e) => {
            useSTExpress.getState().sett({ productList: [{ recMan: { mobile: e.detail.value, } }] });
          }} />
        <View className=' hh dxy nw ioo cccplh' hoverClass='bccbackdeep'
          onClick={() => {
            setInputType("text");
            useSTExpress.getState().sett({ productList: [{ recMan: { mobile: `${useSTExpress.getState()?.express?.productList?.[0]?.recMan?.mobile ? useSTExpress.getState()?.express?.productList?.[0]?.recMan?.mobile : ""}-`, } }] });
            inputRef.current?.focus?.();
          }}>- 分机号</View>
      </ComButton>
      <View className='dbtc mb10 ww'>
        <ComProvinceCityAreaView className='bccbackdeep mr10 ww cccblack' addStr={addStr} address={express_S.productList?.[0]?.recMan as AddressInfo}
          onClick={() => onChooseProvinceCityArea()} />
        <ComButton rr className='cccgreen bborder' onClick={() => onChooseProvinceCityArea()}>选择</ComButton>
        <ComButton rr className='cccgreen bborder'
          onClick={async () => {
            const res = await try_Taro_chooseLocation();
            Taro.showLoading({ mask: true, title: "地址解析...", });
            const res_address = await Api_common_textOCR_ctn({ text: res?.address?.trim() });
            try_Taro_hideLoading();
            useSTExpress.getState().sett({
              productList: [{
                recMan: {
                  province: res_address.province,
                  city: res_address.city,
                  area: res_address.area,
                  address: res_address.address + " " + res.name,
                } as AddressInfo
              }]
            });
          }}>
          地图
        </ComButton>
      </View>
      <ComButton ll className='bccbackdeep mb10  ww' hoverClass='none' >
        {addStr && express_S.productList?.[0]?.recMan?.town && !addStr?.includes(express_S.productList?.[0]?.recMan?.town) && <Text className='cccprice'>镇</Text>}
        <ComTextarea className='ww' value={express_S.productList?.[0]?.recMan?.address} placeholder='详细地址:街道门牌信息'
          onInputText={(e) => {
            useSTExpress.getState().sett({ productList: [{ recMan: { address: e, } }] });
          }} />
      </ComButton>
    </View>
    <ComButton rr ll className='mb10 ww bccbackdeep bborder' hoverClass='none' >
      <View className='dbtc ww dy'>
        <Text style={{ maxWidth: "76vw" }}><Text className='nw cccplh fwb' userSelect>识别结果:</Text ><Text className='cccplh' userSelect>{addStr}</Text></Text>
        <Text className={`${addStr ? "cccgreen" : "cccplh"}  nw pl10`} onClick={() => setAddStr("")}>清除</Text>
      </View>
    </ComButton>
  </View>;
};

const ExpressInfo: FC = () => {
  const selfInfo_S = useSTSelf(s => s.selfInfo!);
  const express_S = useSTExpress(s => s.express);
  if (!express_S) { return null; }
  return (
    <>
      <View className='dwp bccwhite prl10 pt10 IOO mb10'>
        <View className='dy dwp mb10'>
          <ComButton rr ll className='fwb bccwhite'>寄件方式:</ComButton>
          {([...(roo___has_role(selfInfo_S, ["REGIMENT"]) ? [PickUp_ST.到店寄件] : [PickUp_ST.上门取件, PickUp_ST.到店寄件])] as PickUp_ST[]).map((e) => (
            // {([PickUp_ST.上门取件, PickUp_ST.到店寄件] as PickUp_ST[]).map((e) => (
            <ComButton ll key={e} className={`bborder ${express_S.pickUpType == e ? "cccgreen" : ""}`}
              onClick={() => useSTExpress.getState().sett({ pickUpType: e })}>
              {PickUp_ST[e]}
            </ComButton>
          ))}
        </View>
        <ComButton ll className='bccbackdeep mb10 dy' hoverClass='none'>
          <View className='fwb nw'>品名:</View>
          <ComInput placeholder='请输入品名' value={express_S?.productList?.[0]?.itemType} onInput={(e) => {
            useSTExpress.getState().sett({ productList: [{ itemType: e.detail.value }] });
          }} />
        </ComButton>
        <View className='ds dwp'>
          {["文件", "数码产品", "生活用品", "食品", "服饰", "生鲜类", "易碎品", "液体", "其他"].map((e) => (
            <ComButton ll
              style={e === "数码产品" ? {} : {}}
              key={e}
              className={`bborder mb10  ${e == express_S.productList?.[0]?.itemType ? "cccgreen" : ""}}`}

              onClick={() => { useSTExpress.getState().sett({ productList: [{ itemType: e }] }); }}>
              {e}
            </ComButton>
          ))}
        </View>
        <ComButton ll className='bccbackdeep mb10 dy' hoverClass='none' >
          <View className='fwb nw'>备注:</View>
          <ComInput value={express_S.productList?.[0]?.itemNotes} placeholder='给团长捎句话' onInput={(e) => { useSTExpress.getState().sett({ productList: [{ itemNotes: e.detail.value }] }); }} />
        </ComButton>
        <View className='ds dwp'>
          {["需本人签收", "缺包装袋", "缺文件袋", "退换货", "易碎品", "重要文件"].map((e) => (
            <ComButton ll
              key={e}
              className={`bborder mb10 ${express_S.productList?.[0]?.itemNotes?.includes(e) ? "cccgreen" : ""}`}

              onClick={() => useSTExpress.getState().sett({ productList: [{ itemNotes: express_S.productList?.[0]?.itemNotes?.includes(e) ? express_S.productList?.[0]?.itemNotes?.replace(`${e}/`, "") : `${e}/${express_S.productList?.[0]?.itemNotes}` }] })}>
              {e}
            </ComButton>
          ))}
        </View>
      </View>
    </>
  );
};

const CPExpress = {
  ExpressSendMan,
  ExpressRecMan,
  ExpressInfo
};
export default CPExpress;