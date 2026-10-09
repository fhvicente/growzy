"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";

export function ConditionalHeader() {
	// Na landing o header fica por cima do hero; nas outras páginas o espaçador guarda o lugar dele (é fixed).
	const isLandingPage = /^\/[a-z]{2}$/.test(usePathname());

	return (
		<>
			<Header />
			{!isLandingPage && <div aria-hidden className="h-[66px] sm:h-[70px]" />}
		</>
	);
}
