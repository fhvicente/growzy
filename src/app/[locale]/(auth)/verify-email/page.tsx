import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle2, Mail } from "lucide-react";

interface VerifyEmailPageProps {
	params: Promise<{ locale: string }>;
}

export default async function VerifyEmailPage({ params }: VerifyEmailPageProps) {
	const { locale } = await params;

	return (
		<div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1 text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
						<Mail className="h-8 w-8 text-primary-600" />
					</div>
					<CardTitle className="text-2xl font-bold">Verifique o seu email</CardTitle>
					<CardDescription>
						Enviámos um link de verificação para o seu email. Por favor, verifique a sua caixa de entrada.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
						<div className="flex items-start gap-3">
							<CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
							<div>
								<p className="font-medium">Email enviado com sucesso!</p>
								<p className="mt-1 text-green-700">
									Clique no link que enviámos para verificar a sua conta.
								</p>
							</div>
						</div>
					</div>
					<div className="text-center">
						<p className="text-sm text-muted-foreground">Não recebeu o email?</p>
						<Button variant="link" className="text-primary-600">
							Reenviar email de verificação
						</Button>
					</div>
					<div className="text-center">
						<Link href={`/${locale}/login`}>
							<Button variant="outline" className="w-full">
								Voltar ao login
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
