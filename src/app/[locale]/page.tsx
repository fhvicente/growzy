import { LandingNav } from "@/components/landing/landing-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";

interface LocalePageProps {
	params: Promise<{ locale: string }>;
}

export default async function LocalePage({ params }: LocalePageProps) {
	const { locale } = await params;

	return (
		<>
			<LandingNav locale={locale} />
			<div className="flex flex-col">
				<HeroSection locale={locale} />
				<ProblemSection />
				<FeaturesSection />
				<HowItWorksSection />
				<TestimonialsSection />
				<PricingSection locale={locale} />
				<FAQSection />
				<CTASection locale={locale} />
			</div>
		</>
	);
}
