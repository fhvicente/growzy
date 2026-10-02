import { cn } from "@/lib/utils";

/** Seed + two-leaf sprout. Inherits currentColor; leaf uses --color-primary-500 unless overridden. */
export function LogoMark({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 32 32" aria-hidden="true" className={cn("h-7 w-7", className)}>
			<circle cx="16" cy="24" r="6.5" fill="currentColor" />
			<path d="M16 18V9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
			<path d="M16 12C16 7 12.5 4 7 4c0 5 3.5 8 9 8Z" fill="var(--leaf, var(--color-primary-500))" />
			<path d="M16 10c0-4.4 3-7 7.5-7 0 4.4-3 7-7.5 7Z" fill="var(--leaf, var(--color-primary-500))" />
		</svg>
	);
}

export function Logo({ className }: { className?: string }) {
	return (
		<span className={cn("inline-flex items-center gap-1.5", className)}>
			<LogoMark />
			<span className="font-display text-[1.6rem] font-extrabold leading-none tracking-[-0.05em]">growzy</span>
		</span>
	);
}
