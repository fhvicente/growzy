"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function NameForm({ name, email }: { name: string; email: string }) {
	const router = useRouter();
	const [status, setStatus] = useState("");

	async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		const value = String(new FormData(e.currentTarget).get("name")).trim();
		if (!value) return setStatus("O nome não pode ficar vazio.");
		setStatus("A guardar…");
		const { error } = await authClient.updateUser({ name: value });
		setStatus(error ? "Não foi possível guardar." : "Guardado.");
		if (!error) router.refresh();
	}

	return (
		<form onSubmit={onSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="name">Nome</Label>
				<Input id="name" name="name" defaultValue={name} required />
			</div>
			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input id="email" type="email" value={email} disabled />
				<p className="text-sm text-ink-soft">É o email com que entras na conta.</p>
			</div>
			<div className="flex items-center gap-3">
				<Button type="submit">Guardar alterações</Button>
				<span role="status" className="text-sm text-ink-soft">
					{status}
				</span>
			</div>
		</form>
	);
}

export function PasswordForm() {
	const [status, setStatus] = useState("");

	async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;
		const data = new FormData(form);
		const newPassword = String(data.get("newPassword"));
		if (newPassword !== data.get("confirm")) return setStatus("As palavras-passe novas não coincidem.");
		setStatus("A alterar…");
		const { error } = await authClient.changePassword({
			currentPassword: String(data.get("currentPassword")),
			newPassword,
			revokeOtherSessions: true,
		});
		if (error) return setStatus(error.message ?? "Não foi possível alterar.");
		form.reset();
		setStatus("Palavra-passe alterada. As outras sessões foram terminadas.");
	}

	return (
		<form onSubmit={onSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="currentPassword">Palavra-passe atual</Label>
				<Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
			</div>
			<div className="space-y-2">
				<Label htmlFor="newPassword">Nova palavra-passe</Label>
				<Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" minLength={8} required />
			</div>
			<div className="space-y-2">
				<Label htmlFor="confirm">Repete a nova palavra-passe</Label>
				<Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required />
			</div>
			<div className="flex items-center gap-3">
				<Button type="submit">Alterar palavra-passe</Button>
				<span role="status" className="text-sm text-ink-soft">
					{status}
				</span>
			</div>
		</form>
	);
}
