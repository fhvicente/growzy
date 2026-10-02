import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-[background-color,color,transform] duration-200 ease-(--ease-out-expo) active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
	{
		variants: {
			variant: {
				primary: "bg-moss text-paper hover:bg-moss-deep",
				tomato: "bg-tomato text-ink hover:bg-tomato-deep",
				secondary: "bg-paper-2 text-ink hover:bg-line",
				outline: "border-[1.5px] border-ink/80 bg-transparent text-ink hover:bg-ink hover:text-paper",
				ghost: "bg-transparent text-ink hover:bg-paper-2",
				link: "text-primary underline-offset-4 hover:underline",
				destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
			},
			size: {
				default: "h-11 px-5",
				sm: "h-9 px-4",
				lg: "h-14 px-7 text-base",
				icon: "h-11 w-11",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "default",
		},
	},
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
	return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
