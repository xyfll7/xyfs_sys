import { Button, ButtonProps, Label, View, ViewProps } from "@tarojs/components";
import React from "react";
import { try_Taro_navigateTo } from "../utils/try_catch";
import { utils_str_includes } from "../utils/util";


export type MyButtonProps = {
  url?: string;
  id?: string;
  rr?: boolean;
  ll?: boolean;
  sharePath?: string;
  shareTitle?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  onClickO?: () => void;
  routeType?: "wx://cupertino-modal" | "wx://bottom-sheet";
};


export function ComButton({
  url,
  rr = false,
  ll = false,
  onClick,
  onClickO,
  routeType,
  style,
  children,
  ...props
}: Omit<ViewProps, "style" | "onTouchStart"> & MyButtonProps & { children?: React.ReactNode; }) {
  const back = utils_str_includes(["bcc", "bborder"], props.className) ? "" : "bccwhite";

  return <View {...props} id={props.id}
    className={`${props.className} ${back} ${rr ? "" : "pr10"} ${ll ? "" : "pl10"} ${props.disabled ? "disabled bccwhite" : ""} transall ioo dy`}
    hoverClass={(() => {
      if (props.disabled) {
        return "none";
      } else if (utils_str_includes(["bccyellow", "bccgreen"], props.className)) {
        return "bccwhite cccplh";
      } else {
        return props.hoverClass ?? "bccbacktab";
      }
    })()}
    style={{
      minHeight: "calc(2 * var(--rem_base)) !important",
      ...style,
    }} onClick={async (e) => {
      onClickO?.();
      !props.disabled && onClick?.(e);
      !props.disabled && url && await try_Taro_navigateTo({ url, routeType: routeType });
    }} >
    {children}
  </View>;
}

export function ComButtonOpen({
  rr = false,
  ll = false,
  sharePath,
  shareTitle,
  onClick,
  ...props }: ButtonProps & MyButtonProps) {
  const _className = ["ww"].filter((item) => props.className?.includes(item)).join(" ");
  return <Label className={_className} style={{ display: "flex" }} onClick={(e) => { e.stopPropagation(); }}>
    <ComButton rr={rr} ll={ll} {...(props as ViewProps & MyButtonProps)}>{props.children}</ComButton>
    <Button {...props} style={{ display: "none !important" }} data-title={shareTitle} data-path={sharePath} onClick={(e) => { onClick?.(e); }}></Button>
  </Label>;
}