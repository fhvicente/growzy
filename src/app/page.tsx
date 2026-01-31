import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
    return (
        <div>
            <section className="bg-gradient-to-br from-green-50 to-green-100 py-16">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">
                            Planeie a sua{" "}
                            <span className="text-primary">Mini Horta</span> com
                            precisão
                        </h1>
                        <p className="mt-4 text-lg text-gray-700">
                            Calcule custos, acompanhe o seu plantio e cultive
                            alimentos saudáveis em casa.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <Link href="/calculator">
                                <Button>Comece a calcular</Button>
                            </Link>
                            <Link href="/pricing">
                                <Button variant="secondary">Ver planos</Button>
                            </Link>
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <div className="h-64 rounded-xl bg-white/70 shadow" />
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold">
                            Planeamento Preciso
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Calcule todos os custos envolvidos na montagem da
                            sua mini horta.
                        </p>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold">Economia</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Evite gastos desnecessários e planeie exatamente o
                            que precisa.
                        </p>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold">
                            Personalização
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Escolha entre diversas plantas e adapte o seu
                            projeto.
                        </p>
                    </Card>
                </div>
            </section>
        </div>
    );
}
