import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface ForgotPasswordPageProps {
	params: Promise<{ locale: string }>;
}

export default async function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
	const { locale } = await params;

	return (
		<div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold">Recuperar palavra-passe</CardTitle>
					<CardDescription>Introduza o seu email para receber um link de recuperação</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" placeholder="seu@email.com" required />
						</div>
						<Button type="submit" className="w-full">
							Enviar link de recuperação
						</Button>
					</form>
					<div className="mt-4 text-center text-sm text-muted-foreground">
						Lembrou-se da palavra-passe?{" "}
						<Link href={`/${locale}/login`} className="text-primary-600 hover:underline">
							Entrar
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
