import { Card } from "@/components/ui/card";

export default function VerifyEmailPage() {
    return (
        <div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
            <Card className="p-6">
                <h1 className="text-xl font-bold">Verifique seu email</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Enviamos um link de verificação para o seu email.
                </p>
            </Card>
        </div>
    );
}
