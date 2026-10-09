"use client";

import { useState } from "react";
import type { FormEvent, InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function PasswordInput(props: InputHTMLAttributes<HTMLInputElement>) {
	const [visible, setVisible] = useState(false);
	return (
		<div className="relative">
			<Input {...props} type={visible ? "text" : "password"} className="pr-11" />
			<button
				type="button"
				onClick={() => setVisible((v) => !v)}
				aria-label={visible ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
				aria-pressed={visible}
				className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-ink-soft hover:text-ink cursor-pointer"
			>
				{visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
			</button>
		</div>
	);
}

export function SignUpForm() {
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
		const name = String(formData.get("name") || "").trim();
		const email = String(formData.get("email") || "").trim();
		const password = String(formData.get("password") || "");
		const confirmPassword = String(formData.get("confirmPassword") || "");

		if (password !== confirmPassword) {
			setError("As palavras-passe não coincidem.");
			setIsSubmitting(false);
			return;
		}

		const { error: authError } = await authClient.signUp.email({
			name,
			email,
			password,
			callbackURL: `/${locale}/dashboard`,
		});

		setIsSubmitting(false);

		if (authError) {
			setError(authError.message ?? "Falha ao criar conta.");
			return;
		}

		router.push(`/${locale}/dashboard`);
	}

	return (
		<form className="grid gap-4" onSubmit={onSubmit}>
			<div className="grid gap-2">
				<Label htmlFor="name">Nome</Label>
				<Input
					id="name"
					name="name"
					placeholder="Seu nome"
					autoComplete="name"
					required
					minLength={2}
					maxLength={100}
					pattern=".*\S.*\S.*"
					title="Indique o seu nome (mínimo 2 caracteres)."
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					placeholder="seu@email.com"
					autoComplete="email"
					required
					maxLength={254}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="password">Palavra-passe</Label>
				{/* ponytail: 8–128 = defaults do better-auth (minPasswordLength/maxPasswordLength) */}
				<PasswordInput
					id="password"
					name="password"
					autoComplete="new-password"
                    placeholder="●●●●●●●●"
					required
					minLength={8}
					maxLength={128}
				/>
				<p className="text-xs text-muted-foreground">Mínimo 8 caracteres.</p>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="confirmPassword">Confirmar palavra-passe</Label>
				<PasswordInput
					id="confirmPassword"
					name="confirmPassword"
					autoComplete="new-password"
                    placeholder="●●●●●●●●"
					required
					minLength={8}
					maxLength={128}
				/>
			</div>
			{error ? <p className="text-sm text-red-600">{error}</p> : null}
			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Criando..." : "Criar conta"}
			</Button>
		</form>
	);
}
