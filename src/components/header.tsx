"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X, Home, Calculator, LayoutDashboard, CreditCard, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

export function Header() {
	const params = useParams();
	const locale = (params?.locale as string) || "pt";
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { data: session } = authClient.useSession();
	const isLoggedIn = !!session;

	const navigation = [
		{ name: "Início", href: `/${locale}`, icon: Home },
		{
			name: "Calculadora",
			href: `/${locale}/calculator`,
			icon: Calculator,
		},
		{
			name: "Dashboard",
			href: `/${locale}/dashboard`,
			icon: LayoutDashboard,
		},
		{ name: "Planos", href: `/${locale}/pricing`, icon: CreditCard },
	];

	return (
		<header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
			<nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2 cursor-pointer">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white">
						<Leaf className="h-6 w-6" />
					</div>
					<span className="text-xl font-bold text-gray-900">Horta Fácil</span>
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden lg:flex lg:gap-x-8">
					{navigation.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className="flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
						>
							<item.icon className="h-4 w-4" />
							{item.name}
						</Link>
					))}
				</div>

				{/* Desktop Auth */}
				<div className="hidden lg:flex lg:items-center lg:gap-4">
					{isLoggedIn ? (
						<div className="flex items-center gap-3">
							<Link href={`/${locale}/profile`}>
								<Button variant="ghost" size="icon">
									<Avatar className="h-8 w-8">
										<AvatarFallback className="bg-primary-100 text-primary-700">U</AvatarFallback>
									</Avatar>
								</Button>
							</Link>
							<Separator orientation="vertical" className="h-6" />
							<Button variant="ghost" size="sm">
								<LogOut className="h-4 w-4" />
								Terminar sessão
							</Button>
						</div>
					) : (
						<>
							<Link href={`/${locale}/login`}>
								<Button variant="ghost">Entrar</Button>
							</Link>
							<Link href={`/${locale}/register`}>
								<Button>Criar conta</Button>
							</Link>
						</>
					)}
				</div>

				{/* Mobile menu button */}
				<button
					type="button"
					className="lg:hidden cursor-pointer"
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
				>
					{mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
				</button>
			</nav>

			{/* Mobile Navigation */}
			{mobileMenuOpen && (
				<div className="lg:hidden">
					<div className="space-y-1 border-t px-4 pb-3 pt-2">
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
								onClick={() => setMobileMenuOpen(false)}
							>
								<item.icon className="h-5 w-5" />
								{item.name}
							</Link>
						))}
						<Separator className="my-2" />
						{isLoggedIn ? (
							<>
								<Link
									href={`/${locale}/profile`}
									className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
									onClick={() => setMobileMenuOpen(false)}
								>
									<User className="h-5 w-5" />
									Perfil
								</Link>
								<button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
									<LogOut className="h-5 w-5" />
									Terminar sessão
								</button>
							</>
						) : (
							<div className="space-y-2 px-3 py-2">
								<Link
									href={`/${locale}/login`}
									className="block cursor-pointer"
									onClick={() => setMobileMenuOpen(false)}
								>
									<Button variant="outline" className="w-full">
										Iniciar sessão
									</Button>
								</Link>
								<Link
									href={`/${locale}/register`}
									className="block cursor-pointer"
									onClick={() => setMobileMenuOpen(false)}
								>
									<Button className="w-full">Criar conta</Button>
								</Link>
							</div>
						)}
					</div>
				</div>
			)}
		</header>
	);
}
