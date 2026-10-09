"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Calculator, LayoutDashboard, CreditCard, User, LogOut, Shield } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { Logo } from "@/components/logo";

export function Header() {
	const params = useParams();
	const locale = (params?.locale as string) || "pt";
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { data: session, isPending } = authClient.useSession();
	const isLoggedIn = !!session;
	const pathname = usePathname();
	// null = ainda não se sabe; só esconde/mostra o menu, quem decide é o servidor.
	const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
	const userId = session?.user.id;

	useEffect(() => {
		if (!userId) return setIsAdmin(null);
		let live = true;
		fetch("/api/auth/me")
			.then((r) => (r.ok ? r.json() : { isAdmin: false }))
			.catch(() => ({ isAdmin: false }))
			.then((d) => live && setIsAdmin(d.isAdmin === true));
		return () => {
			live = false;
		};
	}, [userId]);

	const userNav = [
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
	const navigation =
		isPending || (isLoggedIn && isAdmin === null)
			? [] // evita piscar o menu errado enquanto se descobre quem é
			: isAdmin
				? [{ name: "Admin", href: `/${locale}/admin`, icon: Shield }]
				: userNav;

	// recarga completa: as páginas server-side voltam a ler a sessão
	const handleSignOut = async () => {
		await authClient.signOut();
		window.location.href = `/${locale}`;
	};

	const handleNavClick = () => {
		setMobileMenuOpen(false);
		if (typeof window !== "undefined") {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}, [pathname]);

	return (
		<header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
			<nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 lg:px-8">
				{/* Logo */}
				<Link href={`/${locale}`} aria-label="Growzy, início" className="text-ink">
					<Logo />
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden lg:flex lg:gap-x-1">
					{navigation.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							aria-current={pathname === item.href ? "page" : undefined}
							className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink aria-[current=page]:bg-moss aria-[current=page]:text-paper"
							onClick={handleNavClick}
						>
							<item.icon className="h-4 w-4" />
							{item.name}
						</Link>
					))}
				</div>

				{/* Desktop Auth */}
				<div className="hidden lg:flex lg:items-center lg:gap-4">
					{isPending ? null : isLoggedIn ? (
						<div className="flex items-center gap-3">
							<Link href={`/${locale}/profile`}>
								<Button variant="ghost" size="icon">
									<Avatar className="h-8 w-8">
										<AvatarFallback className="bg-sprout font-bold text-ink">U</AvatarFallback>
									</Avatar>
								</Button>
							</Link>
							<Separator orientation="vertical" className="h-6" />
							<Button variant="ghost" size="sm" onClick={handleSignOut}>
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
								onClick={handleNavClick}
							>
								<item.icon className="h-5 w-5" />
								{item.name}
							</Link>
						))}
						<Separator className="my-2" />
						{isPending ? null : isLoggedIn ? (
							<>
								<Link
									href={`/${locale}/profile`}
									className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
									onClick={() => setMobileMenuOpen(false)}
								>
									<User className="h-5 w-5" />
									Perfil
								</Link>
								<button
									type="button"
									onClick={handleSignOut}
									className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
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
