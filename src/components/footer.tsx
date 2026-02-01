"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Leaf, Mail, Github, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
	const params = useParams();
	const locale = (params?.locale as string) || "pt";
	const currentYear = new Date().getFullYear();

	const footerLinks = {
		product: [
			{ name: "Calculadora", href: `/${locale}/calculator` },
			{ name: "Dashboard", href: `/${locale}/dashboard` },
			{ name: "Planos", href: `/${locale}/pricing` },
		],
		company: [
			{ name: "Sobre", href: `/${locale}/about` },
			{ name: "Blog", href: `/${locale}/blog` },
			{ name: "Contacto", href: `/${locale}/contact` },
		],
		legal: [
			{ name: "Privacidade", href: `/${locale}/privacy` },
			{ name: "Termos", href: `/${locale}/terms` },
		],
	};

	return (
		<footer className="border-t bg-gray-50">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					{/* Brand */}
					<div className="space-y-4">
						<Link href="/" className="flex items-center gap-2 cursor-pointer">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white">
								<Leaf className="h-6 w-6" />
							</div>
							<span className="text-xl font-bold text-gray-900">Horta Fácil</span>
						</Link>
						<p className="text-sm text-muted-foreground">
							Planeie e cultive a sua mini horta com precisão e economia.
						</p>
						<div className="flex gap-4">
							<a
								href="https://twitter.com"
								className="text-muted-foreground transition-colors hover:text-primary-600 cursor-pointer"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Twitter className="h-5 w-5" />
							</a>
							<a
								href="https://github.com"
								className="text-muted-foreground transition-colors hover:text-primary-600 cursor-pointer"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Github className="h-5 w-5" />
							</a>
							<a
								href="mailto:contact@hortafacil.com"
								className="text-muted-foreground transition-colors hover:text-primary-600 cursor-pointer"
							>
								<Mail className="h-5 w-5" />
							</a>
						</div>
					</div>

					{/* Product */}
					<div>
						<h3 className="mb-4 text-sm font-semibold text-gray-900">Produto</h3>
						<ul className="space-y-3">
							{footerLinks.product.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground transition-colors hover:text-primary-600 cursor-pointer"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Company */}
					<div>
						<h3 className="mb-4 text-sm font-semibold text-gray-900">Empresa</h3>
						<ul className="space-y-3">
							{footerLinks.company.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground transition-colors hover:text-primary-600 cursor-pointer"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h3 className="mb-4 text-sm font-semibold text-gray-900">Legal</h3>
						<ul className="space-y-3">
							{footerLinks.legal.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground transition-colors hover:text-primary-600 cursor-pointer"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				<Separator className="my-8" />

				<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
					<p className="text-sm text-muted-foreground">
						© {currentYear} Horta Fácil. Todos os direitos reservados.
					</p>
					<p className="text-sm text-muted-foreground">Feito com ❤️ em Portugal</p>
				</div>
			</div>
		</footer>
	);
}
