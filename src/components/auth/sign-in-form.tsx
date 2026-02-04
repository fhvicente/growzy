"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm() {
	const router = useRouter();
	const params = useParams();
	const locale = (params?.locale as string) || "pt";
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setIsSubmitting(true);

		const formData = new FormData(event.currentTarget);
		const email = String(formData.get("email") || "").trim();
		const password = String(formData.get("password") || "");

		const { error: authError } = await authClient.signIn.email({
			email,
			password,
			callbackURL: `/${locale}/dashboard`,
		});

		setIsSubmitting(false);

		if (authError) {
			setError(authError.message ?? "Falha ao iniciar sessão.");
			return;
		}

		router.push(`/${locale}/dashboard`);
	}

	return (
		<form className="grid gap-4" onSubmit={onSubmit}>
			<div className="grid gap-2">
				<Label htmlFor="email">Email</Label>
				<Input id="email" name="email" type="email" placeholder="seu@email.com" required />
			</div>
			<div className="grid gap-2">
				<Label htmlFor="password">Palavra-passe</Label>
				<Input id="password" name="password" type="password" required />
			</div>
			{error ? <p className="text-sm text-red-600">{error}</p> : null}
			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? "A iniciar sessão..." : "Iniciar sessão"}
			</Button>
		</form>
	);
}
