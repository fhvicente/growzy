"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";

export function ConditionalHeader() {
	const pathname = usePathname();

	// Hide header on landing page (root paths like /pt, /en, etc.)
	const isLandingPage = pathname.match(/^\/[a-z]{2}$/);

	if (isLandingPage) {
		return null;
	}

	return <Header />;
}
