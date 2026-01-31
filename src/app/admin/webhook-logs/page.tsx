import { Card } from "@/components/ui/card";

export default function WebhookLogsPage() {
    return (
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold">Stripe Webhook Logs</h1>
            <Card className="mt-6 p-6">
                Tabela de eventos será renderizada aqui.
            </Card>
        </div>
    );
}
