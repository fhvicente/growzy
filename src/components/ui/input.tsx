import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			className={cn(
				"h-11 w-full rounded-md border border-line bg-card px-3.5 text-[0.9375rem] text-ink transition-colors placeholder:text-ink-soft/70 focus:border-moss focus:outline-none focus:ring-2 focus:ring-moss/15",
				className,
			)}
			{...props}
		/>
	);
}
