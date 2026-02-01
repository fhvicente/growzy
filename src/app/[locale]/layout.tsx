import { type ReactNode } from "react";
import { Footer } from "@/components/footer";
import { ConditionalHeader } from "@/components/conditional-header";

interface LocaleLayoutProps {
	children: ReactNode;
	params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
	const { locale } = await params;

	return (
		<div lang={locale}>
			<ConditionalHeader />
			<main className="min-h-[80vh]">{children}</main>
			<Footer />
		</div>
	);
}
