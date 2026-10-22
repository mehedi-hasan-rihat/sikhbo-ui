import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // Surface background, rounded-xl, 1px border
        "h-9 w-full min-w-0 rounded-xl border border-border bg-surface px-4 py-1 text-[15px] text-foreground transition-colors outline-none",
        "placeholder:text-muted placeholder:text-[13px]",
        // Focus: outline on wrapper — handled via parent focus-within if wrapped, else:
        "focus-visible:border-focus focus-visible:ring-2 focus-visible:ring-focus/20",
        // Error state
        "aria-invalid:border-status-rejected aria-invalid:ring-2 aria-invalid:ring-status-rejected/20",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
