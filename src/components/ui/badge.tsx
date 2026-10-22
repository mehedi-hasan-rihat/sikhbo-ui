import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  // Base: pill chip, small label text
  "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full px-2.5 py-0.5 text-[12px] font-normal whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-foreground text-white",
        outline:
          "border border-border text-foreground bg-transparent",
        // Submission status variants
        pending:
          "bg-status-pending-bg text-status-pending",
        approved:
          "bg-status-approved-bg text-status-approved",
        rejected:
          "bg-status-rejected-bg text-status-rejected",
        secondary:
          "bg-surface text-muted border border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
