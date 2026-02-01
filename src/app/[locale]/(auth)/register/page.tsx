import { SignUpForm } from "@/components/auth/sign-up-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface RegisterPageProps {
	params: Promise<{ locale: string }>;
}

export default async function RegisterPage({ params }: RegisterPageProps) {
	const { locale } = await params;

	return (
		<div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
					<CardDescription>Comece a planear a sua horta hoje</CardDescription>
				</CardHeader>
				<CardContent>
					<SignUpForm />
					<div className="mt-4 text-center text-sm text-muted-foreground">
						Já tem conta?{" "}
						<Link href={`/${locale}/login`} className="text-primary-600 hover:underline">
							Entrar
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
