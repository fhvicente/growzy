"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Leaf, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingNavProps {
	locale: string;
}

const navLinks = [
	{ name: "Início", href: "#hero" },
	{ name: "Funcionalidades", href: "#features" },
	{ name: "Como Funciona", href: "#how-it-works" },
	{ name: "Preços", href: "#pricing" },
	{ name: "FAQ", href: "#faq" },
];

export function LandingNav({ locale }: LandingNavProps) {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
		e.preventDefault();
		const element = document.querySelector(href);
		if (element) {
			const offset = 80; // Height of navbar
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.pageYOffset - offset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
			setIsMobileMenuOpen(false);
		}
	};

	return (
		<header
			className={`fixed top-0 z-50 w-full transition-all duration-300 ${
				isScrolled ? "bg-white/95 shadow-md backdrop-blur-sm" : "bg-transparent"
			}`}
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-20 items-center justify-between">
					{/* Logo */}
					<Link href={`/${locale}`} className="flex items-center gap-2">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
							<Leaf className="h-6 w-6 text-white" />
						</div>
						<span className="text-xl font-bold text-gray-900">Mini Horta</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden items-center gap-8 md:flex">
						{navLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								onClick={(e) => scrollToSection(e, link.href)}
								className="text-sm font-medium text-gray-600 transition-colors hover:text-primary-600"
							>
								{link.name}
							</a>
						))}
					</nav>

					{/* CTA Buttons */}
					<div className="hidden items-center gap-4 md:flex">
						<Link href={`/${locale}/login`}>
							<Button variant="ghost" size="sm">
								Entrar
							</Button>
						</Link>
						<Link href={`/${locale}/calculator`}>
							<Button size="sm" className="shadow-sm">
								Começar Grátis
							</Button>
						</Link>
					</div>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						aria-label="Toggle menu"
					>
						{isMobileMenuOpen ? (
							<X className="h-6 w-6 text-gray-900" />
						) : (
							<Menu className="h-6 w-6 text-gray-900" />
						)}
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="border-t bg-white md:hidden">
					<nav className="flex flex-col space-y-4 px-4 py-6">
						{navLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								onClick={(e) => scrollToSection(e, link.href)}
								className="text-base font-medium text-gray-600 transition-colors hover:text-primary-600"
							>
								{link.name}
							</a>
						))}
						<div className="flex flex-col gap-3 pt-4">
							<Link href={`/${locale}/login`}>
								<Button variant="outline" size="sm" className="w-full">
									Entrar
								</Button>
							</Link>
							<Link href={`/${locale}/calculator`}>
								<Button size="sm" className="w-full">
									Começar Grátis
								</Button>
							</Link>
						</div>
					</nav>
				</div>
			)}
		</header>
	);
}
