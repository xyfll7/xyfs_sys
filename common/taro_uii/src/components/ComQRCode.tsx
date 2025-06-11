
import { View, ViewProps } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { FC, useEffect, useState } from "react";
import { try_Taro_hideLoading } from "../utils/try_catch";
import { utils_get_qrcode } from "../utils/util";
import { ComButton, MyButtonProps } from "./ComButton";
import { ComImage } from "./ComImage";
import { ComNavBarB } from "./ComNavBarB";
import { ComPopupNew } from "./ComPopupNew";



export const ComQRCode: FC<ViewProps & MyButtonProps & { onPreTap?: () => Promise<{ appid?: string, scene?: string, page?: string; } | void>, onClose?: () => void, isShow?: boolean; params: { appid?: string, scene?: string, page?: string, buttonText?: string, title: string, desc?: string[], src?: string, }; }> = ({ className, params, isShow = false, onPreTap, onClose, onClick, ...props }) => {
  const [qrcode, setQrcode] = useState<string | null>(null);
  useEffect(() => {
    if (isShow && params.src) {
      setQrcode(params.src!);
    } else {
      setQrcode(null);
    }
  }, [isShow, params.src]);
  return (
    <>
      {Boolean(qrcode) &&
        <ComPopupNew className=' ww' >
          <View className='ww dll prl10'>
            <ComNavBarB className='mb10 ww' onClose={() => { setQrcode(null); onClose?.(); }}><ComButton className='fwb bccback'>{params.title}</ComButton></ComNavBarB>
            {params.desc && <ComButton className='mb10 cccplh dll bccback'  >{params.desc?.map(e => <View key={e}>{e}</View>)}</ComButton>}
            <ComImage className='mb10 scc' style={{ width: 'calc(10 * var(--rem_base))' }} src={qrcode!} />
          </View>
        </ComPopupNew>
      }
      <ComButton
        {...props}
        className={`${className} nw`}
        onClick={async (e) => {
          const res = await onPreTap?.();
          Taro.showLoading({ mask: true, title: "生成中..." });
          const _src = params.src || await utils_get_qrcode({ appid: res?.appid ?? params.appid, page: res?.page ?? params.page!, scene: res?.scene ?? params.scene! });
          setQrcode(_src);
          onClick?.(e);
          try_Taro_hideLoading();
        }}>
        {props.children ?? params.buttonText}
      </ComButton>
    </>
  );
};
export const ComQRCodeNew: FC<ViewProps & MyButtonProps & { onClose?: () => void, src: string, title: string, desc: string[]; }> = ({ className, src, title, desc, onClose, }) => {
  return (
    <>
      <View className={`ww dll prl10 ${className}`}>
        <ComNavBarB className='mb10 ww' onClose={() => { onClose?.(); }}><ComButton className='fwb bccback'>{title}</ComButton></ComNavBarB>
        {desc && <ComButton className='mb10 cccplh dll bccback'  >{desc?.map(e => <View key={e}>{e}</View>)}</ComButton>}
        <ComImage className='mb10 scc' style={{ width: 'calc(10 * var(--rem_base))' }} src={src!} />
      </View>
    </>
  );
};
