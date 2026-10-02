# Growzy: o que falta melhorar e corrigir

Atualizado em 2026-10-02.

## Resumo

A landing e a identidade Growzy estão feitas. Faltam corrigir 4 bugs funcionais e redesenhar as páginas internas, que por agora só receberam as cores e os componentes novos. Ordem sugerida: corrigir os bugs, alinhar a copy e os planos, e só depois redesenhar a calculadora e o dashboard.

Já está feito: tokens de cor e tipografia, logo, botões, inputs, header, footer e a landing completa com GSAP. As páginas internas já têm a marca nova, mas o layout continua o antigo.

## Correções urgentes

Estes bugs afetam os utilizadores ou o deploy hoje.

| Problema | Onde | Correção |
| --- | --- | --- |
| O botão "Terminar sessão" não faz nada (desktop e mobile) | `src/components/header.tsx` | Ligar o `onClick` a `authClient.signOut()` e redirecionar para a landing |
| O link para o resultado não tem locale: `/calculator/result/:id` dá 404 | `src/app/[locale]/(protected)/dashboard/page.tsx:167` | Usar `/${locale}/calculator/result/${calc.id}` |
| Link para `/contact`, uma página que não existe | `src/app/[locale]/pricing/page.tsx:257` | Remover o link ou trocá-lo por um `mailto:` real |
| O avatar mostra sempre a letra "U" | `src/components/header.tsx:82` | Usar a inicial de `session.user.name` |
| O `npm install` no Docker pode falhar por conflito de peer deps (drizzle-orm / react-native) | `Dockerfile` | `RUN npm install --legacy-peer-deps`, ou copiar um `.npmrc` para a imagem |
| 3 erros de tipo: a versão da API Stripe `2026-01-28.clover` já não é a esperada | `src/app/api/stripe/webhook`, `subscription/checkout`, `subscription/success` | Atualizar `apiVersion` para `2026-02-25.clover` ou fixar a versão do pacote `stripe` |
| O README manda copiar um `.env.example` que não existe | `README.md` | Criar `.env.example` com `DATABASE_URL`, as chaves Stripe e as de Better Auth |

## Copy e coerência

A landing trata por "tu", mas as páginas internas tratam por "você" ("Aceda à sua conta", "Planeie a sua horta"). Além disso, os planos prometem funcionalidades que só existem como flags.

- [ ] Passar para "tu" no login, registo, recuperar e repor palavra-passe, verificar email, calculadora, dashboard, pricing e `plan-display.tsx`
- [ ] Decidir o que fazer com as funcionalidades prometidas mas não implementadas: calendário de plantação, comparação de poupança, exportação de relatórios, planeamento com IA, previsões de colheita e alertas. Hoje são só flags em `src/lib/plans.ts`. As opções são implementá-las, marcá-las como "em breve" ou retirá-las da landing e da página de planos
- [ ] Unificar os planos: a página `/pricing` e a secção de preços da landing têm listas diferentes. Gerar as duas a partir de `PLAN_FEATURES`
- [ ] Confirmar se o preço anual (€39 e €79) existe no Stripe; se não existir, retirá-lo
- [ ] Confirmar se os preços das plantas são mesmo revistos com regularidade, como diz a FAQ
- [ ] Rever o selo "O mais escolhido" no plano Standard: só mantê-lo se houver dados que o provem

## Redesign das páginas internas

As páginas internas têm as cores novas mas o layout antigo: cartões brancos, ícones em quadrados e cores fixas (`bg-white`, `text-white`, `green-*`, `red-*`) em 22 sítios. Por ordem de impacto:

| Página | O que mudar |
| --- | --- |
| Calculadora (`calculator-client.tsx`) | Reutilizar o "talão" da landing como resumo fixo ao lado; quantidades com botões − / +; total grande com contagem animada; pesquisa de plantas em vez de `select` |
| Resultado (`calculator/result/[id]`) | Talão completo, pronto a levar ao viveiro, com os botões Recalcular e Partilhar |
| Dashboard | Gráfico de gastos por mês, como na landing; hortas guardadas em linhas, não em cartões; estado vazio com CTA para criar a primeira horta |
| Login, registo e recuperação | Ecrã dividido: formulário sobre papel e painel verde-musgo com foto e uma frase |
| Pricing (`/pricing`) | Reutilizar a secção de preços da landing em vez de manter uma versão própria |
| Perfil e subscrição (sucesso, cancelamento) | Alinhar com o resto; a página de sucesso pode ter um momento animado curto |
| Admin (`webhook-logs`) | Só os tokens; é uma ferramenta interna |

Na app, as animações devem durar 150 a 250 ms e servir para dar feedback, sem coreografias de entrada.

## Melhorias na landing

A landing funciona em desktop e mobile. O que falta é acabamento e conteúdo próprio.

- [ ] Trocar as fotos do Unsplash por fotos próprias de varandas portuguesas e por capturas reais da app
- [ ] Criar a imagem Open Graph, o favicon e o ícone da app com o novo símbolo (o `favicon.ico` ainda é o antigo)
- [ ] Desenhar o logotipo final; o símbolo atual (semente com duas folhas) é provisório
- [ ] Rever o espaço vazio no topo do hero em ecrãs altos (o conteúdo está alinhado em baixo)
- [ ] Em mobile, o talão do hero fica por cima da foto; confirmar como fica a 360 px
- [ ] Criar uma secção de prova social real quando houver utilizadores (números verdadeiros ou testemunhos com autorização)
- [ ] Header da landing para quem tem sessão: hoje usa o `Header` da app, sem o estilo transparente sobre o hero

## Técnico

- [ ] Imagens: passar de `<img>` para `next/image` e configurar `images.remotePatterns` (ou servir as fotos a partir de `public/`). O Biome avisa disto em 3 sítios
- [ ] Biome: corrigir os avisos `useImportType` e as regras de acessibilidade (`lint/a11y`) que já existiam em `src/components/ui`
- [ ] Idioma: existe o locale `en`, mas todo o texto está em português e fixo no código. Decidir se o inglês avança (extrair os textos) ou se se retira o `en`
- [ ] `lang`: o `<html>` tem `pt` fixo e o layout do locale põe o `lang` num `div`. Passar o locale para o `<html>`
- [ ] SEO: `metadata` por página (pricing, login), `sitemap.ts` e `robots.ts`
- [ ] O Tailwind 4 já não usa o `tailwind.config.ts` (o tema está no `globals.css`). Apagá-lo para evitar confusão
- [ ] Escolher um único gestor de pacotes: o projeto tem `bun.lock` e `package-lock.json`
- [ ] O `docs/landing-page-design-brief.md` descreve o design antigo (Mini Horta); arquivá-lo ou atualizá-lo
- [ ] A infraestrutura ainda usa os nomes antigos: base de dados `mini_horta` e containers `mini-horta-*`. Renomear obriga a migrar os dados

## Acessibilidade e performance

O movimento já respeita `prefers-reduced-motion`, mas faltam auditorias com medições.

- [ ] Medir o contraste dos textos com opacidade sobre o verde-musgo (`text-paper/60`, `/50`) e do laranja dos botões sobre o fundo; o alvo é WCAG AA
- [ ] Testar a navegação só com teclado: menu mobile, FAQ e foco visível nos links da landing
- [ ] O menu mobile não fecha com Esc nem prende o foco
- [ ] Correr o Lighthouse em mobile: as fotos do hero têm 1200 px e não têm `srcset`, e o GSAP (com ScrollTrigger e SplitText) só é necessário na landing
