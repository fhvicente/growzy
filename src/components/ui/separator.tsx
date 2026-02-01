import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
	orientation?: "horizontal" | "vertical";
	decorative?: boolean;
}

const Separator = ({ className, orientation = "horizontal", decorative = true, ...props }: SeparatorProps) => (
	<div
		role={decorative ? "none" : "separator"}
		aria-orientation={orientation}
		className={cn(
			"shrink-0 bg-border",
			orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
			className,
		)}
		{...props}
	/>
);

Separator.displayName = "Separator";

export { Separator };
