import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
	return (
		<div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
			<Card className="p-6">
				<h1 className="text-xl font-bold">Redefinir palavra-passe</h1>
				<div className="mt-4 space-y-4">
					<Input type="password" placeholder="Nova palavra-passe" />
					<Input type="password" placeholder="Confirmar palavra-passe" />
					<Button>Guardar palavra-passe</Button>
				</div>
			</Card>
		</div>
	);
}
