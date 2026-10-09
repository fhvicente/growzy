"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export function Header() {
	const params = useParams();
	const locale = (params?.locale as string) || "pt";
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const barRef = useRef<HTMLElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const { data: session, isPending } = authClient.useSession();
	const isLoggedIn = !!session;
	// null = ainda não se sabe; só esconde/mostra o menu, quem decide é o servidor.
	const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
	const userId = session?.user.id;
	// No topo da landing a barra está sobre o hero verde-escuro: texto claro até descer.
	const onDark = /^\/[a-z]{2}$/.test(pathname) && !scrolled && !open;

	useEffect(() => setOpen(false), [pathname]);

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

	// Pílula sólida depois de descer; some ao descer, volta ao subir.
	useGSAP(() => {
		const st = ScrollTrigger.create({
			start: 0,
			end: "max",
			onUpdate: (self) => {
				setScrolled(self.scroll() > 24);
				if (!window.matchMedia(MOTION_OK).matches) return;
				gsap.to(barRef.current, {
					yPercent: self.direction === 1 && self.scroll() > 400 ? -140 : 0,
					duration: 0.6,
					ease: "expo.out",
					overwrite: "auto",
				});
			},
		});
		return () => st.kill();
	});

	useGSAP(
		() => {
			if (!open || !window.matchMedia(MOTION_OK).matches) return;
			gsap.from(".menu-item", { yPercent: 110, stagger: 0.06, duration: 0.9, ease: "expo.out" });
		},
		{ dependencies: [open], scope: menuRef },
	);

	const links =
		isPending || (isLoggedIn && isAdmin === null)
			? [] // evita piscar o menu errado enquanto se descobre quem é
			: isAdmin
				? [
						{ href: `/${locale}/admin`, label: "Admin" },
						{ href: `/${locale}/profile`, label: "Perfil" },
					]
				: isLoggedIn
					? [
							{ href: `/${locale}/calculator`, label: "Calculadora" },
							{ href: `/${locale}/dashboard`, label: "Dashboard" },
							{ href: `/${locale}/pricing`, label: "Planos" },
							{ href: `/${locale}/profile`, label: "Perfil" },
						]
					: [
							{ href: `/${locale}#features`, label: "Funcionalidades" },
							{ href: `/${locale}#how-it-works`, label: "Como funciona" },
							{ href: `/${locale}#pricing`, label: "Preços" },
							{ href: `/${locale}#faq`, label: "FAQ" },
							{ href: `/${locale}/login`, label: "Entrar" },
						];

	// recarga completa: as páginas server-side voltam a ler a sessão
	const handleSignOut = async () => {
		const { error } = await authClient.signOut();
		if (error) {
			console.error("Sign-out failed:", error);
			alert("Não foi possível terminar a sessão. Tenta novamente.");
			return;
		}
		window.location.href = `/${locale}`;
	};

	return (
		<>
			<header ref={barRef} className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">
				{/* Mesmo contentor da landing; a pílula sai para fora do padding para o logo e o botão alinharem com o conteúdo. */}
				<div className="mx-auto max-w-[88rem] px-3 sm:px-8">
					<nav
						className={cn(
							"flex items-center justify-between rounded-full py-2 pl-4 pr-2 transition-[background-color,border-color] duration-500 sm:-ml-4 sm:-mr-2",
							scrolled || open ? "border border-ink/10 bg-paper" : "border border-transparent",
						)}
					>
						<Link
							href={`/${locale}`}
							aria-label="Growzy, início"
							className={cn("transition-colors duration-500", onDark ? "text-paper" : "text-ink")}
							style={onDark ? ({ "--leaf": "var(--color-sprout)" } as React.CSSProperties) : undefined}
						>
							<Logo />
						</Link>

						<div className="hidden items-center gap-1 md:flex">
							{links.map((l) => (
								<Link
									key={l.href}
									href={l.href}
									aria-current={pathname === l.href ? "page" : undefined}
									className={cn(
										"rounded-full px-4 py-2 text-sm font-medium transition-colors aria-[current=page]:bg-ink aria-[current=page]:text-paper",
										onDark ? "text-paper hover:bg-paper/10" : "text-ink hover:bg-ink/[0.07]",
									)}
								>
									{l.label}
								</Link>
							))}
							{isPending ? null : isLoggedIn ? (
								<Button
									variant="outline"
									size="sm"
									onClick={handleSignOut}
									className={cn(
										"ml-2",
										onDark && "border-paper/80 text-paper hover:bg-paper hover:text-ink",
									)}
								>
									Terminar sessão
								</Button>
							) : (
								<Link href={`/${locale}/register`} className="ml-2">
									<Button variant={onDark ? "tomato" : "primary"}>Começar grátis</Button>
								</Link>
							)}
						</div>

						<button
							type="button"
							onClick={() => setOpen((o) => !o)}
							aria-expanded={open}
							aria-controls="mobile-menu"
							aria-label={open ? "Fechar menu" : "Abrir menu"}
							className={cn(
								"relative grid size-11 place-items-center rounded-full md:hidden",
								onDark ? "bg-paper text-ink" : "bg-ink text-paper",
							)}
						>
							<span
								className={cn(
									"absolute h-[2px] w-5 bg-current transition-transform duration-500 ease-out-expo",
									open ? "rotate-45" : "-translate-y-[4px]",
								)}
							/>
							<span
								className={cn(
									"absolute h-[2px] w-5 bg-current transition-transform duration-500 ease-out-expo",
									open ? "-rotate-45" : "translate-y-[4px]",
								)}
							/>
						</button>
					</nav>
				</div>
			</header>

			{open && (
				<div
					id="mobile-menu"
					ref={menuRef}
					className="fixed inset-0 z-40 flex flex-col justify-end bg-ink px-5 pb-10 pt-28 text-paper md:hidden"
				>
					<ul className="space-y-1">
						{links.map((l) => (
							<li key={l.href} className="overflow-hidden">
								<Link
									href={l.href}
									onClick={() => setOpen(false)}
									className="menu-item display block py-1 text-[clamp(2.75rem,13vw,4.5rem)] hover:text-sprout"
								>
									{l.label}
								</Link>
							</li>
						))}
					</ul>
					<div className="mt-10">
						{isLoggedIn ? (
							<Button
								size="lg"
								onClick={handleSignOut}
								className="w-full bg-sprout text-ink hover:bg-sprout/85"
							>
								Terminar sessão
							</Button>
						) : (
							<Link href={`/${locale}/register`} onClick={() => setOpen(false)} className="block">
								<Button size="lg" className="w-full bg-sprout text-ink hover:bg-sprout/85">
									Começar grátis
								</Button>
							</Link>
						)}
					</div>
				</div>
			)}
		</>
	);
}
