import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-2 border-slate-900 px-2.5 py-0.5 text-xs font-bold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-white shadow-[2px_2px_0px_#0f172a]",
        secondary:
          "bg-slate-100 text-slate-900 shadow-[2px_2px_0px_#0f172a]",
        outline:
          "bg-white text-slate-900 shadow-[2px_2px_0px_#0f172a]",
        yellow:
          "bg-[#fde047] text-slate-950 font-black shadow-[2px_2px_0px_#0f172a]",
        cyan:
          "bg-[#cffafe] text-[#0e7490] font-black shadow-[2px_2px_0px_#0f172a]",
        pink:
          "bg-[#fce7f3] text-[#be185d] font-black shadow-[2px_2px_0px_#0f172a]",
        lime:
          "bg-[#d9f99d] text-[#365314] font-black shadow-[2px_2px_0px_#0f172a]",
        purple:
          "bg-[#ede9fe] text-[#6d28d9] font-black shadow-[2px_2px_0px_#0f172a]",
        high:
          "bg-[#ffe4e6] text-[#be123c] font-black shadow-[2px_2px_0px_#0f172a]",
        medium:
          "bg-[#fef3c7] text-[#b45309] font-black shadow-[2px_2px_0px_#0f172a]",
        low:
          "bg-[#e0f2fe] text-[#0369a1] font-black shadow-[2px_2px_0px_#0f172a]",
        verified:
          "bg-[#dcfce7] text-[#15803d] font-black shadow-[2px_2px_0px_#0f172a]",
        outdated:
          "bg-[#ffedd5] text-[#c2410c] font-black shadow-[2px_2px_0px_#0f172a]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
