"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

interface LandingNavProps {
	locale: string;
}

const navLinks = [
	{ name: "Funcionalidades", href: "#features" },
	{ name: "Como funciona", href: "#how-it-works" },
	{ name: "Preços", href: "#pricing" },
	{ name: "FAQ", href: "#faq" },
];

export function LandingNav({ locale }: LandingNavProps) {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 40);
		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
		e.preventDefault();
		const element = document.querySelector(href);
		if (!element) return;
		const top = element.getBoundingClientRect().top + window.scrollY - 80;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
		setIsMobileMenuOpen(false);
	};

	const solid = isScrolled || isMobileMenuOpen;

	return (
		<header
			className={`fixed top-0 z-50 w-full transition-[background-color,color,box-shadow] duration-300 ${
				solid
					? "bg-paper/92 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur-md"
					: "bg-transparent text-paper"
			}`}
		>
			<div className="mx-auto flex h-20 max-w-[88rem] items-center justify-between px-4 sm:px-8">
				<Link
					href={`/${locale}`}
					aria-label="Growzy, início"
					style={solid ? undefined : ({ "--leaf": "var(--color-sprout)" } as React.CSSProperties)}
				>
					<Logo />
				</Link>

				<nav className="hidden items-center gap-9 md:flex">
					{navLinks.map((link) => (
						<a
							key={link.href}
							href={link.href}
							onClick={(e) => scrollToSection(e, link.href)}
							className="text-[0.9375rem] font-medium opacity-80 transition-opacity hover:opacity-100"
						>
							{link.name}
						</a>
					))}
				</nav>

				<div className="hidden items-center gap-2 md:flex">
					<Link
						href={`/${locale}/login`}
						className="px-4 text-[0.9375rem] font-semibold opacity-80 transition-opacity hover:opacity-100"
					>
						Entrar
					</Link>
					<Link href={`/${locale}/calculator`}>
						<Button variant="tomato" size="sm" className="h-10 px-5">
							Começar grátis
						</Button>
					</Link>
				</div>

				<button
					type="button"
					className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
					aria-expanded={isMobileMenuOpen}
				>
					{isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
				</button>
			</div>

			{isMobileMenuOpen && (
				<nav className="border-t border-line bg-paper px-4 pb-8 pt-4 md:hidden">
					{navLinks.map((link) => (
						<a
							key={link.href}
							href={link.href}
							onClick={(e) => scrollToSection(e, link.href)}
							className="block border-b border-line py-4 font-display text-2xl font-bold tracking-tight"
						>
							{link.name}
						</a>
					))}
					<div className="mt-6 flex flex-col gap-3">
						<Link href={`/${locale}/calculator`}>
							<Button variant="tomato" size="lg" className="w-full">
								Começar grátis
							</Button>
						</Link>
						<Link href={`/${locale}/login`}>
							<Button variant="outline" size="lg" className="w-full">
								Entrar
							</Button>
						</Link>
					</div>
				</nav>
			)}
		</header>
	);
}
