import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
	locale: string;
}

export function CTASection({ locale }: CTASectionProps) {
	return (
		<section className="overflow-hidden bg-moss-deep pt-24 text-paper lg:pt-36">
			<div className="mx-auto flex max-w-[88rem] flex-col items-start gap-10 px-4 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
				<h2 data-reveal="lines" className="display max-w-[12ch] text-[clamp(2.75rem,6vw,5.5rem)]">
					A primeira conta é por nossa conta.
				</h2>
				<div data-reveal="up" className="flex flex-col items-start gap-4">
					<Link href={`/${locale}/calculator`}>
						<Button variant="tomato" size="lg" className="group">
							Calcular a minha horta
							<ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
						</Button>
					</Link>
					<p className="text-sm text-paper/60">Grátis até 3 hortas. Sem cartão.</p>
				</div>
			</div>

			{/* Oversized wordmark, cropped by the section edge */}
			<p
				aria-hidden="true"
				data-parallax="-6"
				className="display mt-16 select-none whitespace-nowrap text-center text-[19vw] leading-[0.75] text-moss lg:mt-24"
			>
				grow easy
			</p>
		</section>
	);
}
