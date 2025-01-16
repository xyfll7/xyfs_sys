import { Text, View, ViewProps } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { OrderInfo } from "../../types/type_product";
import { getMyEnv } from "../env";
import { ComButton } from "./ComButton";
import { ComImage } from "./ComImage";




export const MMMOrderUser = ({ order, showUser = "user", ...props }: ViewProps & { order: OrderInfo<any>; showUser?: "regiment" | "user"; }) => {
  const isClient = getMyEnv().appId === process.env.TARO_APP_CLIENT;
  const user = (() => {
    if (showUser === "regiment") {
      return {
        avatar: order.regimentAvatar,
        name: order.deptName,
        isRegiment: true,
      };
    } else if (isClient) {
      return {
        avatar: order.regimentAvatar,
        name: order.deptName,
        isRegiment: true,
      };
    } else {
      return {
        avatar: order.userAvatar,
        name: order.userName,
        isRegiment: false,
      };
    }
  })();
  return <View className={`${props.className} dy`}>
    <ComImage className='mr10' src={user.avatar} />
    <ComButton ll className='dy cccplh'>
      {user.isRegiment && <Text>团:</Text>}
      <Text className='wm5rem nw1' onClick={() => {
        Taro.setClipboardData({
          data: user.name ? user.name : "无",
          success: () => { Taro.showToast({ icon: "none", title: user.name ? user.name : "无" }); }
        });
      }}>
        {user.name}
      </Text>
    </ComButton>
  </View>;
};