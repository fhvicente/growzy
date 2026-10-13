import Link from "next/link";

// TODO(RGPD): preencher com a entidade real antes de lançar, e pedir validação jurídica do texto.
const CONTROLLER = {
	name: "[Nome ou empresa responsável]",
	nif: "[NIF]",
	address: "[Morada]",
	email: "[email para pedidos de privacidade]",
};
const UPDATED = "13 de outubro de 2026";

interface PrivacyPageProps {
	params: Promise<{ locale: string }>;
}

function H2({ children }: { children: React.ReactNode }) {
	return <h2 className="mt-10 font-display text-2xl font-bold text-ink">{children}</h2>;
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
	const { locale } = await params;

	return (
		<div className="mx-auto max-w-3xl px-4 py-16 text-ink-soft sm:px-6 lg:px-8 [&_li]:mt-2 [&_p]:mt-4 [&_strong]:text-ink [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
			<h1 className="display text-4xl text-ink sm:text-5xl">Política de privacidade</h1>
			<p>Última atualização: {UPDATED}.</p>

			<H2>Quem trata os teus dados</H2>
			<p>
				O responsável pelo tratamento é {CONTROLLER.name}, NIF {CONTROLLER.nif}, {CONTROLLER.address}. Para
				qualquer questão sobre os teus dados escreve para{" "}
				<a href={`mailto:${CONTROLLER.email}`} className="underline">
					{CONTROLLER.email}
				</a>
				.
			</p>

			<H2>Que dados guardamos e para quê</H2>
			<ul>
				<li>
					<strong>Conta:</strong> nome, email e palavra-passe (guardada cifrada, nunca em texto). Servem para
					entrares e para te identificarmos. Base legal: execução do contrato (Art. 6(1)(b) RGPD).
				</li>
				<li>
					<strong>Hortas:</strong> nome que dás à horta, zona geral do país (litoral norte, interior ou sul),
					dimensões, luz, rega e culturas. Servem para calcular o plano. Não pedimos morada nem localização.
					Base legal: execução do contrato.
				</li>
				<li>
					<strong>Sessão:</strong> endereço IP e navegador de cada sessão aberta, para segurança da conta.
					Base legal: interesse legítimo em proteger a conta (Art. 6(1)(f)).
				</li>
				<li>
					<strong>Pagamentos:</strong> se subscreveres um plano pago, o Stripe trata os dados de pagamento.
					Nós só guardamos o identificador de cliente e o estado da subscrição; nunca vemos o cartão. Base
					legal: execução do contrato e obrigações fiscais (Art. 6(1)(c)).
				</li>
			</ul>
			<p>
				Não usamos cookies de publicidade nem de análise. O único cookie é o da sessão, necessário para
				entrares.
			</p>

			<H2>Com quem partilhamos</H2>
			<p>Só com os prestadores necessários para o serviço funcionar, que atuam por nossa conta:</p>
			<ul>
				<li>
					<strong>Vercel Inc.</strong> (EUA): alojamento da aplicação.
				</li>
				<li>
					<strong>Neon Inc.</strong>: base de dados, alojada na UE (Frankfurt, Alemanha).
				</li>
				<li>
					<strong>Stripe Payments Europe Ltd.</strong> (Irlanda, com transferências para os EUA): pagamentos.
				</li>
			</ul>
			<p>
				As transferências para os EUA estão cobertas pelo EU-US Data Privacy Framework e/ou por cláusulas
				contratuais-tipo da Comissão Europeia. Não vendemos dados a ninguém.
			</p>

			<H2>Quanto tempo guardamos</H2>
			<ul>
				<li>Conta e hortas: enquanto a conta existir. Ao apagá-la, são apagadas de imediato.</li>
				<li>Sessões: até expirarem (7 dias sem uso), depois são apagadas automaticamente.</li>
				<li>Registos técnicos de pagamentos: 90 dias, sem dados pessoais.</li>
				<li>Faturas no Stripe: pelo prazo legal de conservação de documentos fiscais (10 anos).</li>
			</ul>

			<H2>Os teus direitos</H2>
			<p>Podes, a qualquer momento:</p>
			<ul>
				<li>
					<strong>Ver e descarregar</strong> os teus dados em formato JSON, no{" "}
					<Link href={`/${locale}/profile`} className="underline">
						perfil
					</Link>
					.
				</li>
				<li>
					<strong>Corrigir</strong> o nome no perfil. Para mudar o email, escreve-nos.
				</li>
				<li>
					<strong>Apagar a conta</strong> no perfil. A subscrição é cancelada e tudo é apagado.
				</li>
				<li>
					<strong>Opor-te ou pedir a limitação</strong> do tratamento, escrevendo para {CONTROLLER.email}.
				</li>
			</ul>
			<p>
				Respondemos no prazo de um mês. Se achares que não tratámos bem os teus dados, podes apresentar queixa à
				Comissão Nacional de Proteção de Dados (
				<a href="https://www.cnpd.pt" className="underline">
					cnpd.pt
				</a>
				).
			</p>
		</div>
	);
}
