"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/**
 * One client boundary for all landing motion. Sections stay server components and opt in with data attributes:
 * - data-reveal="lines"  headline split into masked lines
 * - data-reveal="up"     fade + rise on scroll (children of [data-stagger] cascade)
 * - data-count="20.6"    number counts up when visible
 * - data-parallax="-12"  yPercent drift while scrolling
 * - data-grow            stem grows top-down with scroll (scrubbed scaleY)
 * - data-leaf="origin"   pops open when reached
 */
export function LandingMotion({ children }: { children: ReactNode }) {
	const root = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				const q = gsap.utils.selector(root);

				for (const el of q<HTMLElement>("[data-reveal='lines']")) {
					SplitText.create(el, {
						type: "lines",
						mask: "lines",
						autoSplit: true,
						onSplit: (self) => {
							gsap.set(el, { autoAlpha: 1 });
							return gsap.from(self.lines, {
								yPercent: 110,
								duration: 1.1,
								ease: "expo.out",
								stagger: 0.09,
								delay: Number(el.dataset.delay ?? 0),
								scrollTrigger: el.closest("#hero") ? undefined : { trigger: el, start: "top 85%" },
							});
						},
					});
				}

				for (const el of q<HTMLElement>("[data-reveal='up']")) {
					const inHero = !!el.closest("#hero");
					gsap.fromTo(
						el,
						{ autoAlpha: 0, y: 40 },
						{
							autoAlpha: 1,
							y: 0,
							duration: 1,
							ease: "expo.out",
							delay: Number(el.dataset.delay ?? 0),
							scrollTrigger: inHero ? undefined : { trigger: el, start: "top 88%" },
						},
					);
				}

				for (const group of q<HTMLElement>("[data-stagger]")) {
					gsap.from(group.children, {
						autoAlpha: 0,
						y: 32,
						duration: 0.9,
						ease: "expo.out",
						stagger: 0.08,
						scrollTrigger: { trigger: group, start: "top 85%" },
					});
				}

				for (const el of q<HTMLElement>("[data-count]")) {
					const end = Number(el.dataset.count);
					const decimals = el.dataset.count?.split(".")[1]?.length ?? 0;
					const obj = { v: 0 };
					gsap.to(obj, {
						v: end,
						duration: 1.6,
						ease: "power3.out",
						delay: Number(el.dataset.delay ?? 0),
						scrollTrigger: el.closest("#hero") ? undefined : { trigger: el, start: "top 90%" },
						onUpdate: () => {
							el.textContent = obj.v.toLocaleString("pt-PT", {
								minimumFractionDigits: decimals,
								maximumFractionDigits: decimals,
							});
						},
					});
				}

				for (const el of q<HTMLElement>("[data-parallax]")) {
					gsap.to(el, {
						yPercent: Number(el.dataset.parallax),
						ease: "none",
						scrollTrigger: {
							trigger: el.parentElement,
							start: "top bottom",
							end: "bottom top",
							scrub: true,
						},
					});
				}

				for (const stem of q<HTMLElement>("[data-grow]")) {
					gsap.fromTo(
						stem,
						{ scaleY: 0 },
						{
							scaleY: 1,
							transformOrigin: "50% 0%",
							ease: "none",
							scrollTrigger: {
								trigger: stem.parentElement,
								start: "top 65%",
								end: "bottom 65%",
								scrub: 0.6,
							},
						},
					);
				}

				for (const leaf of q<SVGElement>("[data-leaf]")) {
					gsap.from(leaf, {
						scale: 0,
						rotate: -40,
						transformOrigin: leaf.dataset.leaf || "50% 100%",
						duration: 0.8,
						ease: "expo.out",
						scrollTrigger: { trigger: leaf, start: "top 65%" },
					});
				}
			});

			// Reduced motion or no match: make sure nothing stays hidden.
			mm.add("(prefers-reduced-motion: reduce)", () => {
				gsap.set(gsap.utils.selector(root)("[data-reveal]"), { autoAlpha: 1 });
			});
		},
		{ scope: root },
	);

	return <div ref={root}>{children}</div>;
}
