"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(useGSAP);

/**
 * Stagger reveal dos blocos de topo da página (filhos do elemento raiz da página) a cada navegação.
 * Pode estar em layouts encaixados: só o mais interior anima, para o menu do admin ficar parado.
 */
export function PageReveal({ children }: { children: ReactNode }) {
	const root = useRef<HTMLDivElement>(null);
	const pathname = usePathname();

	useGSAP(
		() => {
			const el = root.current;
			if (!el || el.querySelector("[data-page-reveal]")) return;
			const blocks = el.firstElementChild?.children;
			if (!blocks?.length) return;
			gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
				gsap.from(blocks, {
					autoAlpha: 0,
					y: 16,
					duration: 0.6,
					ease: "expo.out",
					stagger: 0.06,
					clearProps: "all",
				});
			});
		},
		{ scope: root, dependencies: [pathname], revertOnUpdate: true },
	);

	return (
		<div ref={root} data-page-reveal>
			{children}
		</div>
	);
}
