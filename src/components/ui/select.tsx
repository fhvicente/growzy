import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

const Select = ({ className, ...props }: SelectProps) => {
	return (
		<select
			className={cn(
				"flex h-11 w-full rounded-md border border-line bg-card px-3.5 text-[0.9375rem]",
				"focus-visible:outline-none focus-visible:border-moss focus-visible:ring-2 focus-visible:ring-moss/15",
				"disabled:cursor-not-allowed disabled:opacity-50",
				"[&>option]:bg-background",
				className,
			)}
			{...props}
		/>
	);
};
Select.displayName = "Select";

export { Select };
