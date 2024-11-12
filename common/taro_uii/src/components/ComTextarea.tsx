import { Textarea, TextareaProps } from "@tarojs/components";
import { FC } from "react";

export const ComTextarea: FC<TextareaProps & { minHeight?: string, onInputText?: (e: string) => void; }> = ({ cursorSpacing = 50, minHeight = "auto", value, confirmType = "done", onInputText, ...props }) => {
  return <Textarea
    className={` ${props.className}`}
    style={{
      maxHeight: "calc(5 * var(--rem_base))",
      minHeight: minHeight,
    }}
    autoHeight
    placeholderClass='cccplh'
    confirmType={confirmType}
    showConfirmBar={false}
    cursorSpacing={cursorSpacing}
    disableDefaultPadding
    value={value}
    onBlur={() => { onInputText?.(value?.trim() ?? ""); }}
    onInput={(e) => onInputText?.(e.detail.value)}
    {...props} />;
};