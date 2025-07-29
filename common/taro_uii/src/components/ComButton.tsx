import { Button, ButtonProps, Label, View, ViewProps } from "@tarojs/components";
import React, { useCallback, useState } from "react";
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
  children,
  ...props
}: Omit<ViewProps, "onTouchStart"> & MyButtonProps & { children?: React.ReactNode; }) {
  const back = utils_str_includes(["bcc", "bborder"], props.className) ? "" : "bccwhite";
  const [handleClick, loading] = useHooks_PreventDoubleClick();
  props.disabled = props.disabled || loading;
  return <View {...props} id={props.id}
    className={`${props.className} ${back} ${rr ? "" : "pr10"} ${ll ? "" : "pl10"} ${props.disabled ? "disabled bccwhite" : ""} transall ioo dy`}

    hoverClass={(() => {
      if (props.hoverClass === "none") {
        return "none";
      } else if (props.disabled) {
        return "none";
      } else if (utils_str_includes(["bccyellow", "bccgreen"], props.className)) {
        return "bccwhite cccplh";
      } else {
        return props.hoverClass ?? "button-hover";
      }
    })()}
    style={{
      wordBreak: "break-all",
      wordWrap: "break-word",
      minHeight: "calc(2 * var(--rem_base)) !important",
      ...(props.style as any),
    }} onClick={async (e) => {
      handleClick(async () => {
        await onClickO?.();
        !props.disabled && await onClick?.(e);
        !props.disabled && url && await try_Taro_navigateTo({ url, routeType: routeType });
      });
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

type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;

const useHooks_PreventDoubleClick = <T,>(): [
  (asyncFunction: AsyncFunction<T>) => Promise<T | void>,
  boolean
] => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const preventDoubleClick = useCallback(
    async (asyncFunction: AsyncFunction<T>) => {
      if (isSubmitting) {
        return;
      }
      setIsSubmitting(true);
      try {
        return await asyncFunction();
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting]
  );

  return [preventDoubleClick, isSubmitting];
};
