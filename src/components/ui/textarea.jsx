import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3A7BFF]/30 focus-visible:border-[#3A7BFF] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
