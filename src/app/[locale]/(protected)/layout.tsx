import { type ReactNode } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface ProtectedLayoutProps {
	children: ReactNode;
	params: Promise<{ locale: string }>;
}

export default async function ProtectedLayout({ children, params }: ProtectedLayoutProps) {
	const { locale } = await params;
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		redirect(`/${locale}/login`);
	}

	return <>{children}</>;
}
