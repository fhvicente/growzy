import "./globals.css";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";

const bricolage = Bricolage_Grotesque({
	subsets: ["latin"],
	variable: "--font-bricolage",
	axes: ["opsz"],
	display: "swap",
});

const figtree = Figtree({
	subsets: ["latin"],
	variable: "--font-figtree",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Growzy · cultivar sem adivinhar",
	description: "Calcula quanto custa a tua horta antes de comprares o primeiro vaso.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt" className={`${bricolage.variable} ${figtree.variable}`} suppressHydrationWarning>
			<head>
				{/* lets CSS hide GSAP-revealed content only when JS is running */}
				<script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
			</head>
			<body>{children}</body>
		</html>
	);
}
