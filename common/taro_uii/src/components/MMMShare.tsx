import { ButtonProps } from "@tarojs/components";
import { coo___objToUrl } from "@xyfs/utils/util";
import { FC } from "react";
import { getMyEnv } from "../env";
import { try_Taro_navigateToMiniProgram } from "../utils/try_catch";
import { ComButton, ComButtonOpen } from "./ComButton";



export const MMMShare: FC<ButtonProps & { name: string; rr?: boolean, ll?: boolean; orderType: "干洗" | "快递"; }> = ({ rr, ll, orderType, id, name, ...props }) => {
  return <>
    {getMyEnv().appId === process.env.TARO_APP_ADMIN ?
      <ComButton rr={rr} ll={ll} className={`cccgreen ${props.className}`} onClick={async () =>
        try_Taro_navigateToMiniProgram({
          appId: process.env.TARO_APP_CLIENT,
          path: `/pages_comm/comm__express_path?${coo___objToUrl({ express_share_id: id })}`,
          noRelaunchIfPathUnchanged: false,
        })}>
        分享
      </ComButton> :
      <ComButtonOpen rr={rr} ll={ll} className={`cccgreen ${props.className}`} id={id}
        shareTitle={`${name}(团长)分享给您的${orderType}订单`}
        openType='share'
        sharePath={`/pages_comm/comm__express_path?${coo___objToUrl({ express_share_id: id })}`}>分享</ComButtonOpen>
    }
  </>;
};