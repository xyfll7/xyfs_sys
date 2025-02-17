import { Text, View, ViewProps } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { OrderInfo } from "../../types/type_product";
import { try_Taro_setClipboardData } from "../utils/try_catch";
import { ComButton } from "./ComButton";
import { ComImage } from "./ComImage";




export const MMMOrderUser = ({ order, ...props }: ViewProps & { order: OrderInfo<any>; }) => {
  return <View className={`${props.className} dy`}>
    <ComImage className='mr10' src={order.userAvatar} />
    <ComButton ll className='dy cccplh' onClick={async () => {
      await try_Taro_setClipboardData({ data: order.userName ? `${order.userName}/${order.deptName}` : "无" });
      Taro.showToast({ icon: "none", title: order.userName ? `已复制:${order.userName}/${order.deptName}` : "无" });
    }}>
      <View className="dy">
        <Text className='wm8rem nw1' >{order.userName}</Text>/
        <Text className='wm8rem nw1' >{order.deptName}</Text>
      </View>
    </ComButton>
  </View>;
};