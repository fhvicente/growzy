import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface ResetPasswordPageProps {
	params: Promise<{ locale: string }>;
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
	const { locale } = await params;

	return (
		<div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold">Nova palavra-passe</CardTitle>
					<CardDescription>Introduza a sua nova palavra-passe</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="password">Nova palavra-passe</Label>
							<Input id="password" type="password" required />
						</div>
						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirmar palavra-passe</Label>
							<Input id="confirmPassword" type="password" required />
						</div>
						<Button type="submit" className="w-full">
							Redefinir palavra-passe
						</Button>
					</form>
					<div className="mt-4 text-center text-sm text-muted-foreground">
						<Link href={`/${locale}/login`} className="text-primary-600 hover:underline">
							Voltar ao login
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
