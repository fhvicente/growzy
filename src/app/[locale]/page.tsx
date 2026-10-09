import { LandingMotion } from "@/components/landing/motion";
import { HeroSection } from "@/components/landing/hero-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";
import { Header } from "@/components/header";

interface LocalePageProps {
	params: Promise<{ locale: string }>;
}

export default async function LocalePage({ params }: LocalePageProps) {
	const { locale } = await params;

	return (
		<>
			<Header />
			<LandingMotion>
				<HeroSection locale={locale} />
				<ProblemSection />
				<FeaturesSection />
				<HowItWorksSection />
				<PricingSection locale={locale} />
				<FAQSection />
				<CTASection locale={locale} />
			</LandingMotion>
		</>
	);
}
