// :: pages_user/user_assist_detail
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Api_assist_info_ctn } from "@xyfs/taro_uii/api/api__assist";
import { Api_order_assistOrder_ctn } from "@xyfs/taro_uii/api/api__orders";
import { ComBannerMemo } from "@xyfs/taro_uii/components/ComBanner";
import { ComButton } from "@xyfs/taro_uii/components/ComButton";
import { ComImage } from "@xyfs/taro_uii/components/ComImage";
import { ComLoading } from "@xyfs/taro_uii/components/ComLoading";
import { ComNav } from "@xyfs/taro_uii/components/ComNav";
import { ComNavBarA } from "@xyfs/taro_uii/components/ComNavBarA";
import { ComScrollView } from "@xyfs/taro_uii/components/ComScrollView";
import { ComTextarea } from "@xyfs/taro_uii/components/ComTextarea";
import { ComSELFView, MMMAAPage } from "@xyfs/taro_uii/components/MMMAAPage";
import { useSTSelf } from "@xyfs/taro_uii/store/store";
import { AddressInfo } from "@xyfs/taro_uii/type_user";
import { try_Taro_chooseAddress, try_Taro_hideLoading, try_Taro_requestPayment } from "@xyfs/taro_uii/utils/try_catch";
import { useHook_getCurrentInstance } from "@xyfs/taro_uii/utils/useHooks";
import { utils_addressInfoToString } from "@xyfs/taro_uii/utils/util";
import React, { FC, useEffect, useState } from "react";


const ___avatar = "https://7072-prod-5gx53h8v828f0170-1306790653.tcb.qcloud.la/comm_avatar/default/小羊@1x.webp";
definePageConfig({ enableShareAppMessage: true, navigationStyle: "custom", disableScroll: true, });
export default function COMSELFWarp() { return <ComSELFView><Index></Index></ComSELFView>; };
const Index: FC = () => {
  // deptId=oGwbL5MUeSNxxA4o0oOmb_FUjE7g

  const { options } = useHook_getCurrentInstance<{ assist_item_id: string; deptId: string; }>();

  const [data, setData] = useState<any>(null);
  const [isHeaderBack, setIsHeaderBack] = useState(false);
  useEffect(() => {
    (async () => {
      const res = await Api_assist_info_ctn({ id: options.assist_item_id });
      setData(res);
    })();
  }, [options.assist_item_id]);

  const [address, setAddress] = useState<AddressInfo | null>(useSTSelf?.getState().selfInfo?.defaultRecManAddress ?? null);

  const [response, setResponse] = useState<any>(null);

  if (!data) {
    return <ComNav className='prl10'>
      <ComLoading />
    </ComNav>;
  }
  const [___image0, ___image1, ...___images] = data?.attachUrl?.split(",");

  return <MMMAAPage>
    <View style={{ height: "12vh" }}>
      <ComBannerMemo isHeaderBack={isHeaderBack} src={___image0} />
      <ComNav className='fixed-top z9 transall' isRight>
        <ComNavBarA className='mb10 pl10 ww' >
          <View>
            <ComImage className='ml10 transall' style={{ opacity: isHeaderBack ? "1" : "0", }} src={data.userAvatar} />
          </View>
          <View className='slr dy'>
            <ComButton rr ll className='bcctrans05 mr10'><Text className='cccgreen'>⤻</Text>海报</ComButton>
            <ComButton rr ll className='bcctrans05 mr10'><Text className='cccgreen'>⤻</Text>分享</ComButton>
          </View>
        </ComNavBarA>
      </ComNav>
    </View>
    <ComScrollView scrollIntoView='body' upperThreshold={200}
      onScroll={(e, top) => { if (e.detail.scrollTop > top) { setIsHeaderBack(true); } }}
      onScrollToUpper={() => { setIsHeaderBack(false); }}>
      <View className='ww' style={{ height: "calc(100vw - 12vh - 20vw - 10vw)" }} />
      <View className='ww' style={{ height: "20vw" }} id='body' />
      <View className='bccwhite pt10 IOO mb10 ww' >
        <View className='prl10'>
          <View className='dy ww transall' style={{ opacity: isHeaderBack ? "0" : "1" }}>
            <ComImage className='mb10 mr10' src={data.userAvatar} />
            <ComButton ll className='mb10'>{data.userName}</ComButton>
          </View>
          <View className='ww mb10 bccback' style={{ height: "1rpx" }} />

          <View className='fwb'>{data.name}</View>
          <View className='mb10'>
            <Text className='cccplh'>{data.intro}</Text>
          </View>
          <View className='mb10 dbase'>
            <Text className='cccprice fs08 '>¥</Text>
            <Text className='cccprice fs13 fwb '>{data.price}</Text>
          </View>
          {___image1 && <View className='ww dll'>
            <ComImage className='ovh ioo mb10 bccred' style={{ width: "100%", }} mode='widthFix' src={___image1} onClick={() => {
              Taro.previewMedia({ sources: data?.attachUrl.split(",").map(ee => ({ url: ee })), current: 1 });
            }} />
            <View className='dy dwp'>
              {[...___images].map((e, i) =>
                <ComImage style={{ width: "27vw" }} className='ovh ioo mb10 mr10' key={i} src={e} onClick={() => { Taro.previewMedia({ sources: data?.attachUrl.split(",").map(ee => ({ url: ee })), current: i }); }} />
              )}
            </View>
          </View>

          }

        </View>
      </View>




      {/* 留言 */}
      <IIIMessage onResponse={(e) => { setResponse(e); }} />

    </ComScrollView>
    <View className='dll pt10 ww'>
      <IIIMessageInput response={response} onBlur={() => setResponse(null)} />
      <View className='dbtc ww'>
        <View> {useSTSelf.getState().selfInfo?.OPENID === data.userId ? <View /> : <View className='dy'>
          <ComButton className={`${true ? "" : "bccprice cccwhite"}' mb10'`}>收藏</ComButton>
        </View>
        } </View>
        <View className='dy'>
          {useSTSelf.getState().selfInfo?.OPENID === data.userId ?
            <View className='dy cccplh'>
              <ComButton rr className='ml10'>推广</ComButton>
              <ComButton rr className='ml10'>删除</ComButton>
              <ComButton rr className='ml10'>下架</ComButton>
              <ComButton className='ml10'>编辑</ComButton>
            </View>
            :
            <View className='dy'>
              {address ? <ComButton className='mb10 bccback' >
                <Text className='mr10 nw'>{address.name}</Text>
                <Text className='nw1 cccplh'>... {utils_addressInfoToString(address, true)}</Text>
              </ComButton> : <ComButton rr className='mb10' onClick={async () => {
                const res_address = await try_Taro_chooseAddress();
                setAddress(res_address);
              }}>+地址</ComButton>}

              <ComButton className='mb10 bccyellow ml10' onClick={async () => {
                if (!address) { throw new Error("请先填写收货地址"); }

                Taro.showLoading({ mask: true, title: "生成订单...", });
                const res_pay = await Api_order_assistOrder_ctn({
                  mobile: "17709205217",
                  productList: [{
                    assistId: data.id,
                    recMan: address,
                  }],
                  remark: "备注",
                });

                Taro.showLoading({ mask: true, title: "支付中...", });
                await try_Taro_requestPayment({ ...res_pay, package: res_pay.packageStr });
                try_Taro_hideLoading();

              }}><Text className='fs08 mr6'>!@#$%^& </Text> <Text className='cccgreen'>+</Text> 买</ComButton>
            </View>
          }
        </View>
      </View>
    </View>
  </MMMAAPage>;
};





const IIIMessageInput = React.memo(({ response, onBlur }: { response: any; onBlur: () => void; }) => {
  const [value, setValue] = useState("");
  return <View className='dll ww'>
    <View className='ww dr transall'>
      <View className='dbr ww'>
        <ComButton className='bccbacktab ww mr10 mb10' hoverClass='none'>
          <ComTextarea className='ww' placeholderClass='cccplh'
            placeholder='看对眼就聊两句 ~'
            value={value}
            focus={Boolean(response)}
            onBlur={() => onBlur()}
            cursorSpacing={15}
            confirmType='return'
            onInput={(e) => {
              setValue(e.detail.value);
            }} />
        </ComButton>
        <ComButton rr ll className='mb10 mr10 nw' onClick={async () => {
        }}>+微信</ComButton>
        <ComButton ll className='mb10 nw' onClick={async () => {
        }}>留言 ☛</ComButton>
      </View>
    </View>

  </View>;
});

const IIIMessage = ({ onResponse }: { onResponse: (e: any) => void; }) => {
  return <View className='ww dll bccwhite prl10 ovh ioo mb10 pt10'>
    <ComButton ll className='mb10'>留言</ComButton>
    {[
      { name: "小王", text: "说了一大堆，说了一大堆，说了一大堆，说了一大堆，说了一大堆，说了一大堆，", direction: "0", avatar: ___avatar, },
      { name: "小王", text: "说了点🌹", direction: "1", avatar: ___avatar, },
      { name: "小王", text: "说了点🌹", direction: "0", avatar: ___avatar, },
      { name: "小王", text: "说了点🌹", direction: "1", avatar: ___avatar, }].map((e, i) => {
        return <View className='mb10  ww dll fs09 ioo ' key={i}>
          <View className='ds  ioo ww ' hoverClass='bccbacktab' onClick={() => { onResponse(e); }}>
            <ComImage className='mr10' src={e.avatar} />
            <View className=' ww dll'>
              <View className='cccplh'>{e.name}</View>
              <View>{e.text}</View>
            </View>
          </View>

          <View className='ds ww'>
            <View className='w2rem mr10' />
            <View className='dll ww'>
              {[
                { name: "小王", text: "说了点🌹说了点🌹说了点🌹说了点🌹说了点🌹说了点🌹", direction: "0", avatar: ___avatar, },
                { name: "小王", text: "说了点🌹", direction: "1", avatar: ___avatar, },
                { name: "小王", text: "说了点🌹", direction: "1", avatar: ___avatar, }].map((ee, ii) => {
                  return <View className='ds  ioo ww mt6' hoverClass='bccbacktab' onClick={() => { onResponse(e); }} key={ii}>
                    <ComImage className='mr10' src={ee.avatar} style={{ width: "calc(1.5 * var(--rem_base))" }} />
                    <View className=' ww dll'>
                      <View className='cccplh'>{ee.name}</View>
                      <View>{ee.text}</View>
                    </View>
                  </View>;
                })
              }
            </View>

          </View>
        </View>;
      })

    }
  </View>;
};