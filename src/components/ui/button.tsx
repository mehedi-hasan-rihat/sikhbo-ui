import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-transparent text-[13px] font-normal whitespace-nowrap transition-colors duration-150 outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-5 focus-visible:outline-focus disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Filled — primary action
        default:
          "bg-foreground text-white hover:bg-[#454545] active:bg-[#333333]",
        // Bordered — secondary action
        outline:
          "border-border bg-transparent text-foreground hover:bg-control active:bg-floating-active",
        // Borderless — tertiary / nav actions
        ghost:
          "text-foreground hover:bg-control active:bg-floating-active",
        // Destructive — reject
        destructive:
          "border-border bg-transparent text-status-rejected hover:bg-status-rejected-bg active:bg-status-rejected-bg",
        // Success — approve
        success:
          "border-border bg-transparent text-status-approved hover:bg-status-approved-bg active:bg-status-approved-bg",
        // Text link
        link: "text-foreground underline underline-offset-2 decoration-1 hover:text-muted",
      },
      size: {
        default:   "h-9 px-5",
        sm:        "h-8 px-4 text-[12px]",
        lg:        "h-10 px-6 text-[15px]",
        icon:      "size-9",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      render={render}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
