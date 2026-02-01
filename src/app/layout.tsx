import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Horta Fácil",
	description: "Calcule os custos e planeje sua mini horta urbana",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<body>{children}</body>
		</html>
	);
}
