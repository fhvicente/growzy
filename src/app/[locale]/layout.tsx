import { type ReactNode } from "react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { ConditionalHeader } from "@/components/conditional-header";
import { locales, type Locale } from "./i18n";

interface LocaleLayoutProps {
	children: ReactNode;
	params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
	const { locale } = await params;
	// Sem isto, /favicon.ico (e qualquer /xyz) renderiza como locale e devolve 200 HTML.
	if (!locales.includes(locale as Locale)) notFound();

	return (
		<div lang={locale}>
			<ConditionalHeader />
			<main className="min-h-[80vh]">{children}</main>
			<Footer />
		</div>
	);
}
