import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "outline" | "link";
};

export function Button({ className, variant = "primary", ...props }: Props) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition",
                variant === "primary" &&
                    "bg-primary text-white hover:bg-primary-dark",
                variant === "secondary" &&
                    "bg-gray-200 text-gray-800 hover:bg-gray-300",
                variant === "outline" &&
                    "border border-gray-300 text-gray-700 hover:bg-gray-50",
                variant === "link" &&
                    "h-auto px-0 py-0 text-primary hover:underline",
                className,
            )}
            {...props}
        />
    );
}
