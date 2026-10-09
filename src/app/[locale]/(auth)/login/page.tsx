import { SignInForm } from "@/components/auth/sign-in-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface LoginPageProps {
	params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
	const { locale } = await params;
	const session = await auth.api.getSession({ headers: await headers() });
	if (session) {
		redirect(`/${locale}/${isAdmin(session.user.email) ? "admin" : "dashboard"}`);
	}

	return (
		<div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold">Entrar</CardTitle>
					<CardDescription>Aceda à sua conta para continuar</CardDescription>
				</CardHeader>
				<CardContent>
					<SignInForm />
					<div className="mt-4 text-center text-sm text-muted-foreground">
						Não tem conta?{" "}
						<Link href={`/${locale}/register`} className="text-primary-600 hover:underline">
							Criar conta
						</Link>
					</div>
					<div className="mt-2 text-center text-sm text-muted-foreground">
						<Link href={`/${locale}/forgot-password`} className="text-primary-600 hover:underline">
							Esqueceu a palavra-passe?
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
