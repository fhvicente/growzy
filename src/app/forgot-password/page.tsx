import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
    return (
        <div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
            <Card className="p-6">
                <h1 className="text-xl font-bold">Recuperar senha</h1>
                <div className="mt-4 space-y-4">
                    <Input type="email" placeholder="Email" />
                    <Button>Enviar link</Button>
                </div>
            </Card>
        </div>
    );
}
