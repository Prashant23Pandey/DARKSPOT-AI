"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-white border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-slate-800 hover:shadow-[3px_3px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5",
        yellow:
          "bg-[#fde047] hover:bg-[#facc15] text-slate-950 font-black border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[4px_4px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5",
        lime:
          "bg-[#a3e635] hover:bg-[#84cc16] text-slate-950 font-black border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[4px_4px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5",
        pink:
          "bg-[#f43f5e] hover:bg-[#e11d48] text-white font-black border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[4px_4px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5",
        destructive:
          "bg-[#ffe4e6] text-[#be123c] border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-[#fecdd3]",
        outline:
          "border-2 border-slate-900 bg-white text-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-slate-50 hover:shadow-[3px_3px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5",
        secondary:
          "bg-slate-100 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-slate-200 active:translate-x-0.5 active:translate-y-0.5",
        ghost:
          "text-slate-700 hover:bg-slate-100 hover:text-slate-950 font-semibold",
        cyber:
          "bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300 text-slate-950 font-black border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[4px_4px_0px_#0f172a]",
        glow:
          "border-2 border-slate-900 bg-[#fde047] text-slate-950 font-bold shadow-[3px_3px_0px_#0f172a]",
      },
      size: {
        default: "h-9 px-4 py-2 text-xs",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-6 text-sm font-bold",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const combinedClassName = cn(buttonVariants({ variant, size, className }));

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: cn(combinedClassName, child.props.className),
        ...props,
      });
    }

    return (
      <button
        className={combinedClassName}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
