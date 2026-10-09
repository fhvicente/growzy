import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { isAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const session = await auth.api.getSession({ headers: await headers() });
	// 404 em vez de 403: não se anuncia que a área existe.
	if (!isAdmin(session?.user.email)) notFound();

	const links = [
		["Visão geral", ""],
		["Utilizadores", "users"],
		["Webhooks", "webhook-logs"],
		["Auditoria", "audit"],
	];
	return (
		<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
			<nav className="mb-6 flex gap-4 border-b border-line pb-3 text-sm font-semibold">
				<span className="text-ink-soft">Admin</span>
				{links.map(([label, href]) => (
					<Link key={href} href={`/${locale}/admin/${href}`} className="hover:underline">
						{label}
					</Link>
				))}
			</nav>
			{children}
		</div>
	);
}
