import "./globals.css";
import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export const metadata: Metadata = {
    title: "Horta Fácil",
    description: "Calcule os custos e planeje sua mini horta urbana",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt">
            <body>
                <Header />
                <main className="min-h-[80vh]">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
