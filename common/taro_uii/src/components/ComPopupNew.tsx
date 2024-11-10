import { RootPortal, View, ViewProps } from "@tarojs/components";
import React, { CSSProperties, FC, ReactElement, ReactNode } from "react";
import { ComButton } from "./ComButton";
import { ComTabBarLine } from "./ComTabBarLine";

export const ComPopupNew: FC<ViewProps & { children?: ReactElement | ReactElement[]; classNameMask?: string; isShowTopClose?: boolean, alignItems?: "flex-end" | "center", onClose?: () => void; }> = ({ classNameMask = "", isShowTopClose = false, alignItems = "flex-end", onClose, ...props }) => {

  let _children_Mask: ReactElement | null = null;
  let _children_Close: ReactElement | null = null;

  const _childrens: ReactNode[] = [];
  props.children && React.Children.forEach(props.children, (e: ReactElement) => {
    if (e.key === "Mask") {
      _children_Mask = e;
    } else if (e.key === "Close") {
      _children_Close = e;
    } else {
      _childrens.push(e);
    }
  });
  return <RootPortal>
    <View catchMove className='root-portal'
      hoverStopPropagation
      onClick={(e) => {
        e.stopPropagation();
        onClose?.();
      }}
      style={{
        display: "flex",
        alignItems: alignItems,
        justifyContent: "center",
        zIndex: 99,
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%",
        background: "rgba(33,33,33,0.8)",
        opacity: "1",
        overflow: "hidden",
        animation: "popup-in .3s forwards ease-in-out",
      }}>
      <View className={`${classNameMask}  pa`} style={{ top: "0rem", zIndex: "-1", width: "100vw", height: "100vh" }}>
        {_children_Mask}
      </View>

      <View className='ww' style={{
        animation: { "center": "popup-show .3s forwards ease-in-out", "flex-end": "popup-up .3s forwards ease-in-out" }[alignItems],
      }}>
        {isShowTopClose && <View className='dr prl10' onClick={() => onClose?.()}>
          {_children_Close ?? <ComButton className='mb10 cccgreen bcctrans' hoverClass='bcctrans05'>关闭</ComButton>}
        </View>}
        <View className={`${props.className} ${props.className?.includes("bcc") ? "" : "bccback"} z9 ww safe-bottom ovh`}
          onClick={(e) => e.stopPropagation()}
          hoverStopPropagation
          style={{
            ...(props.style as CSSProperties),
            overflow: "hidden",
            borderTopLeftRadius: "calc(2 * var(--rem_base))",
            borderTopRightRadius: "calc(2 * var(--rem_base))",
          }}>
          <ComTabBarLine className='mbt6' isShort />
          {_childrens}
        </View>
      </View>
    </View>
  </RootPortal >;
};


