import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

// ponytail: root not-found has no locale (unmatched URLs never reach [locale]), so copy is pt, the default
export default function NotFound() {
	return (
		<div className="flex min-h-dvh flex-col overflow-hidden bg-moss-deep text-paper">
			<header className="mx-auto w-full max-w-[88rem] px-4 py-6 sm:px-8">
				<Link href="/pt" aria-label="Growzy, página inicial" className="[--leaf:var(--color-sprout)]">
					<Logo />
				</Link>
			</header>

			<main className="mx-auto flex w-full max-w-[88rem] flex-1 flex-col justify-center gap-10 px-4 py-12 sm:px-8">
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-sprout">Erro 404</p>
				<h1 className="display max-w-[14ch] text-[clamp(2.75rem,7vw,6rem)]">Esta página ainda não germinou.</h1>
				<p className="max-w-[46ch] text-lg text-paper/70">
					O endereço pode estar errado ou a página foi arrancada. Volta ao canteiro principal e começa por lá.
				</p>
				<div className="flex flex-wrap items-center gap-4">
					<Link href="/pt">
						<Button variant="tomato" size="lg" className="group">
							Voltar ao início
							<ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
						</Button>
					</Link>
					<Link href="/pt/calculator" className="text-sm font-semibold underline-offset-4 hover:underline">
						Calcular a minha horta
					</Link>
				</div>
			</main>

			{/* Oversized 404, cropped by the page edge — same move as the CTA wordmark */}
			<p
				aria-hidden="true"
				className="display pointer-events-none select-none whitespace-nowrap text-center text-[38vw] leading-[0.72] text-moss"
			>
				404
			</p>
		</div>
	);
}
