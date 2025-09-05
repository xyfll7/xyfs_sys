import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-16 w-full px-3 py-2 focus:outline-none resize-none",
        className
      )}
      {...props}
    />
  );
}

function TextareaBorder({ className, children, ...props }: React.ComponentProps<"div">) {
  return <div className={cn(
    "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] border-input placeholder:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    className
  )} {...props}>
    {children}
  </div>;
}

export { Textarea, TextareaBorder };



