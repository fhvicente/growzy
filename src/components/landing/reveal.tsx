"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
	children: React.ReactNode;
	delay?: number;
	direction?: "up" | "down" | "left" | "right" | "fade";
	className?: string;
}

export function Reveal({ children, delay = 0, direction = "up", className = "" }: RevealProps) {
	const [isVisible, setIsVisible] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setTimeout(() => {
						setIsVisible(true);
					}, delay);
				}
			},
			{
				threshold: 0.1,
				rootMargin: "0px 0px -100px 0px",
			},
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => {
			if (ref.current) {
				observer.unobserve(ref.current);
			}
		};
	}, [delay]);

	const getTransform = () => {
		switch (direction) {
			case "up":
				return "translateY(50px)";
			case "down":
				return "translateY(-50px)";
			case "left":
				return "translateX(50px)";
			case "right":
				return "translateX(-50px)";
			case "fade":
			default:
				return "translateY(0)";
		}
	};

	return (
		<div
			ref={ref}
			className={className}
			style={{
				opacity: isVisible ? 1 : 0,
				transform: isVisible ? "none" : getTransform(),
				transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
			}}
		>
			{children}
		</div>
	);
}

interface StaggerRevealProps {
	children: React.ReactNode[];
	delay?: number;
	staggerDelay?: number;
	direction?: "up" | "down" | "left" | "right" | "fade";
	className?: string;
}

export function StaggerReveal({
	children,
	delay = 0,
	staggerDelay = 100,
	direction = "up",
	className = "",
}: StaggerRevealProps) {
	return (
		<>
			{children.map((child, index) => (
				<Reveal key={index} delay={delay + index * staggerDelay} direction={direction} className={className}>
					{child}
				</Reveal>
			))}
		</>
	);
}
