import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        redirect("/login");
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
                <Card className="p-6">Total de cálculos</Card>
                <Card className="p-6">Plantas favoritas</Card>
                <Card className="p-6">Economia estimada</Card>
            </div>
            <Card className="mt-6 p-6">Lista de cálculos recentes</Card>
        </div>
    );
}
