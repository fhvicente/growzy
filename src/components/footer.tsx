"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Logo } from "@/components/logo";

export function Footer() {
	const params = useParams();
	const locale = (params?.locale as string) || "pt";

	// ponytail: only routes that exist; add about/legal links when those pages ship
	const links = [
		{ name: "Calculadora", href: `/${locale}/calculator` },
		{ name: "Dashboard", href: `/${locale}/dashboard` },
		{ name: "Planos", href: `/${locale}/pricing` },
		{ name: "Entrar", href: `/${locale}/login` },
	];

	return (
		<footer className="bg-moss-deep text-paper" style={{ "--leaf": "var(--color-sprout)" } as React.CSSProperties}>
			<div className="mx-auto flex max-w-[88rem] flex-col gap-10 border-t border-paper/10 px-4 py-12 sm:px-8 md:flex-row md:items-center md:justify-between">
				<div>
					<Link href={`/${locale}`} aria-label="Growzy, início">
						<Logo />
					</Link>
					<p className="mt-3 text-sm text-paper/60">Cultivar, sem adivinhar. Feito em Portugal.</p>
				</div>
				<nav className="flex flex-wrap gap-x-8 gap-y-3">
					{links.map((link) => (
						<Link
							key={link.name}
							href={link.href}
							className="text-sm font-medium text-paper/70 transition-colors hover:text-sprout"
						>
							{link.name}
						</Link>
					))}
				</nav>
				<p className="text-sm text-paper/50">© {new Date().getFullYear()} Growzy</p>
			</div>
		</footer>
	);
}
