"use client"
import * as React from "react"
import * as RadixTooltip from "@radix-ui/react-tooltip"

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <RadixTooltip.Provider>{children}</RadixTooltip.Provider>
}

export const Tooltip = RadixTooltip.Root
export const TooltipTrigger = RadixTooltip.Trigger

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof RadixTooltip.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <RadixTooltip.Content
    ref={ref}
    sideOffset={sideOffset}
    className={
      "z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white shadow-md animate-in fade-in-0 data-[state=delayed-open]:fade-in-100" +
      (className ? ` ${className}` : "")
    }
    {...props}
  />
))
TooltipContent.displayName = "TooltipContent" 