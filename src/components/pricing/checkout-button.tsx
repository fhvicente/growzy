"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

interface CheckoutButtonProps {
	plan: "standard" | "premium";
	label?: string;
}

export function CheckoutButton({ plan, label }: CheckoutButtonProps) {
	const params = useParams();
	const locale = (params?.locale as string) || "pt";
	const [loading, setLoading] = useState(false);

	const handleCheckout = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/subscription/checkout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-locale": locale,
				},
				body: JSON.stringify({ plan }),
			});

			const data = await response.json();

			if (data.ok && data.url) {
				window.location.href = data.url;
			} else {
				console.error("Checkout failed:", data.error);
				alert("Erro ao iniciar checkout. Por favor, tente novamente.");
				setLoading(false);
			}
		} catch (error) {
			console.error("Checkout error:", error);
			alert("Erro ao iniciar checkout. Por favor, tente novamente.");
			setLoading(false);
		}
	};

	const buttonLabel = label || (plan === "premium" ? "Começar Premium" : "Começar Teste Grátis");

	return (
		<Button onClick={handleCheckout} disabled={loading} size="lg" className="group w-full gap-2">
			{loading ? "A processar..." : buttonLabel}
			<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
		</Button>
	);
}
