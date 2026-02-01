import { Reveal, StaggerReveal } from "./reveal";

const testimonials = [
	{
		quote: "Com a Mini Horta consegui planear a minha varanda toda e já poupei mais de 200€ em alimentos frescos. Recomendo!",
		author: "Maria Silva",
		location: "Lisboa",
		rating: 5,
		avatar: "MS",
	},
	{
		quote: "Finalmente sei quanto vou gastar antes de começar. A calculadora é muito precisa e ajudou-me a fazer escolhas melhores.",
		author: "João Santos",
		location: "Porto",
		rating: 5,
		avatar: "JS",
	},
	{
		quote: "Uso todos os dias para acompanhar as minhas plantas. Adoro ver quanto estou a economizar!",
		author: "Ana Costa",
		location: "Coimbra",
		rating: 5,
		avatar: "AC",
	},
];

export function TestimonialsSection() {
	return (
		<section id="testimonials" className="bg-white py-20 lg:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<Reveal direction="up">
					<div className="text-center">
						<p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary-600">
							O Que Dizem
						</p>
						<h2 className="mb-12 text-4xl font-bold tracking-tight text-gray-900 lg:mb-16 lg:text-5xl">
							Junte-se a Milhares de Horticultores Satisfeitos
						</h2>
					</div>
				</Reveal>

				{/* Testimonials Grid */}
				<div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
					<StaggerReveal staggerDelay={150} direction="up">
						{testimonials.map((testimonial, index) => (
							<div
								key={index}
								className="rounded-xl bg-gray-50 p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
							>
								{/* Stars */}
								<div className="mb-4 flex gap-1">
									{Array.from({
										length: testimonial.rating,
									}).map((_, i) => (
										<svg
											key={i}
											className="h-5 w-5 fill-yellow-400"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
									))}
								</div>

								{/* Quote */}
								<p className="mb-6 italic leading-relaxed text-gray-900">"{testimonial.quote}"</p>

								{/* Author */}
								<div className="flex items-center gap-3">
									{/* Avatar */}
									<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
										{testimonial.avatar}
									</div>
									{/* Info */}
									<div>
										<div className="font-semibold text-gray-900">{testimonial.author}</div>
										<div className="text-sm text-muted-foreground">{testimonial.location}</div>
									</div>
								</div>
							</div>
						))}
					</StaggerReveal>
				</div>
			</div>
		</section>
	);
}
