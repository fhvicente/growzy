"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ReprocessButton({ id }: { id: number }) {
	const router = useRouter();
	const [busy, setBusy] = useState(false);
	return (
		<Button
			size="sm"
			variant="secondary"
			disabled={busy}
			onClick={async () => {
				if (!confirm("Voltar a aplicar este evento?")) return;
				setBusy(true);
				await fetch(`/api/admin/webhook-logs/${id}`, { method: "POST" });
				setBusy(false);
				router.refresh();
			}}
		>
			Reprocessar
		</Button>
	);
}
