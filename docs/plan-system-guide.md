# Sistema de Planos e Limitações

Este documento descreve como o sistema de planos e limitações foi implementado para controlar o acesso dos usuários aos recursos baseado em suas assinaturas do Stripe.

## Estrutura Implementada

### 1. Schema do Banco de Dados

Foram adicionadas as seguintes colunas:

**Tabela `users`:**

- `subscription_plan` - Plano atual do usuário (free, standard, premium)
- `subscription_status` - Status da assinatura (active, trialing, past_due, canceled, inactive)

**Tabela `subscriptions`:**

- `plan` - Plano da assinatura (standard, premium)

### 2. Arquivos Criados/Modificados

#### `/src/lib/plans.ts`

Define os tipos de planos e suas características:

- `PLAN_TYPES` - Constantes dos planos disponíveis
- `PLAN_FEATURES` - Recursos e limites de cada plano
- Funções utilitárias para verificar recursos e limites

**Limites por Plano:**

| Recurso                | Grátis | Standard  | Premium   |
| ---------------------- | ------ | --------- | --------- |
| Hortas                 | 3      | Ilimitado | Ilimitado |
| Plantas/horta          | 20     | 50        | 100       |
| Plantas na BD          | 20     | 50        | 100       |
| Calculadora avançada   | ❌     | ✅        | ✅        |
| Acompanhamento         | ❌     | ✅        | ✅        |
| Calendário             | ❌     | ✅        | ✅        |
| Comparação economias   | ❌     | ✅        | ✅        |
| Exportar relatórios    | ❌     | ✅        | ✅        |
| Suporte prioritário    | ❌     | ✅        | ✅        |
| Planeamento IA         | ❌     | ❌        | ✅        |
| Análise solo avançada  | ❌     | ❌        | ✅        |
| Previsões colheita     | ❌     | ❌        | ✅        |
| Alertas personalizados | ❌     | ❌        | ✅        |
| Consultoria virtual    | ❌     | ❌        | ✅        |
| API Access             | ❌     | ❌        | ✅        |
| Suporte 24/7           | ❌     | ❌        | ✅        |

#### `/src/lib/plan-limits.ts`

Middleware e funções para verificar limites:

- `getUserPlan()` - Busca o plano do usuário
- `checkFeatureAccess()` - Verifica acesso a um recurso
- `checkHortaLimit()` - Verifica limite de hortas
- `checkPlantLimit()` - Verifica limite de plantas por horta
- `checkPlantDatabaseLimit()` - Verifica limite de plantas na BD
- `planLimitResponse()` - Retorna resposta de erro formatada

#### `/src/app/api/stripe/webhook/route.ts`

Webhook do Stripe atualizado para:

- Processar `checkout.session.completed` - Criar assinatura e atualizar usuário
- Processar `customer.subscription.updated` - Atualizar plano do usuário
- Processar `customer.subscription.deleted` - Voltar para plano gratuito
- Processar `invoice.payment_failed` - Marcar status como past_due

#### `/src/app/api/subscription/checkout/route.ts`

API de checkout atualizada para:

- Aceitar parâmetro `plan` no body
- Validar plano selecionado
- Criar sessão de checkout com o Price ID correto

#### `/src/components/pricing/checkout-button.tsx`

Botão de checkout atualizado para:

- Aceitar prop `plan` (standard ou premium)
- Enviar plano selecionado para API

## Como Usar

### 1. Configurar Variáveis de Ambiente

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STANDARD_PRICE_ID=price_...  # €4.99/mês
STRIPE_PREMIUM_PRICE_ID=price_...    # €9.99/mês
```

### 2. Executar Migração do Banco de Dados

```bash
# Gerar migração com Drizzle
bun run db:generate

# Aplicar migração
bun run db:migrate

# Ou executar SQL manualmente
psql $DATABASE_URL < drizzle/migrations/add_subscription_plan.sql
```

### 3. Configurar Webhook no Stripe

1. Acesse https://dashboard.stripe.com/webhooks
2. Crie um novo endpoint para: `https://seu-dominio.com/api/stripe/webhook`
3. Selecione os eventos:
    - `checkout.session.completed`
    - `customer.subscription.updated`
    - `customer.subscription.deleted`
    - `invoice.payment_failed`
4. Copie o webhook secret para `.env`

### 4. Criar Price IDs no Stripe

1. Acesse https://dashboard.stripe.com/products
2. Crie dois produtos:
    - **Standard**: €4.99/mês (com teste grátis opcional)
    - **Premium**: €9.99/mês
3. Copie os Price IDs para `.env`

### 5. Usar Verificações de Limite nas APIs

#### Exemplo: Verificar Limite de Plantas

```typescript
import { checkPlantLimit, planLimitResponse } from "@/lib/plan-limits";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const plants = body.plants || [];

    // Verificar se usuário pode adicionar essas plantas
    const limitCheck = await checkPlantLimit(request, plants.length);
    if (!limitCheck.ok) {
        return planLimitResponse(limitCheck);
    }

    // Continuar com a lógica...
}
```

#### Exemplo: Verificar Acesso a Recurso

```typescript
import { checkFeatureAccess, planLimitResponse } from "@/lib/plan-limits";

export async function GET(request: NextRequest) {
    // Verificar se usuário tem acesso a relatórios
    const accessCheck = await checkFeatureAccess(request, "hasReportExport");
    if (!accessCheck.ok) {
        return planLimitResponse(accessCheck);
    }

    // Gerar relatório...
}
```

### 6. Atualizar Página de Preços

```tsx
import { CheckoutButton } from "@/components/pricing/checkout-button";

// Para plano Standard
<CheckoutButton plan="standard" label="Começar Teste Grátis" />

// Para plano Premium
<CheckoutButton plan="premium" label="Começar Teste Grátis" />
```

### 7. Exibir Plano do Usuário

```tsx
import { PlanDisplay } from "@/components/plan-display";

// No componente
const user = await getUser();
<PlanDisplay
    planType={user.subscriptionPlan}
    subscriptionStatus={user.subscriptionStatus}
    showUpgrade={true}
/>;
```

### 8. API de Informações do Plano

```typescript
// GET /api/user/plan-info
const response = await fetch("/api/user/plan-info");
const data = await response.json();

console.log(data.subscription.plan); // "free", "standard", "premium"
console.log(data.limits.hortas.current); // 2
console.log(data.limits.hortas.max); // 3
console.log(data.features.hasAdvancedCalculator); // true/false
```

## Resposta de Erro de Limite

Quando um limite é excedido, a API retorna:

```json
{
    "ok": false,
    "error": "Você atingiu o limite de 20 plantas por horta no plano Grátis",
    "code": "PLAN_LIMIT_EXCEEDED",
    "limit": 20,
    "current": 20,
    "requiredPlan": "standard"
}
```

## Fluxo de Assinatura

1. Usuário clica no botão de checkout com plano selecionado
2. API cria sessão do Stripe Checkout
3. Usuário completa pagamento no Stripe
4. Stripe envia webhook `checkout.session.completed`
5. Sistema cria registro em `subscriptions`
6. Sistema atualiza `users` com plano e status
7. Usuário é redirecionado para página de sucesso

## Fluxo de Cancelamento

1. Usuário cancela assinatura no Stripe
2. Stripe envia webhook `customer.subscription.deleted`
3. Sistema atualiza status da assinatura para "canceled"
4. Sistema volta usuário para plano "free"
5. Limites do plano gratuito são aplicados

## Testes

### Testar Webhook Localmente

```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Encaminhar webhooks para localhost
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Em outro terminal, disparar evento de teste
stripe trigger checkout.session.completed
```

### Testar Limites

```typescript
// Criar cálculo com muitas plantas (deve falhar no plano free)
const response = await fetch("/api/calculator/save", {
    method: "POST",
    body: JSON.stringify({
        plants: Array(25).fill({ name: "Test", quantity: 1 }),
    }),
});

// Deve retornar 403 com erro de limite
```

## Próximos Passos

1. **UI de Upgrade**: Criar modais mostrando benefícios quando usuário atinge limite
2. **Notificações**: Enviar emails quando plano expira ou pagamento falha
3. **Analytics**: Rastrear conversões de plano gratuito para pago
4. **Portal do Cliente**: Integrar Stripe Customer Portal para gerenciar assinatura
5. **Testes**: Adicionar testes unitários para verificações de limite

## Troubleshooting

**Webhook não está funcionando:**

- Verificar se `STRIPE_WEBHOOK_SECRET` está correto
- Verificar logs em `/api/admin/webhook-logs`
- Testar com Stripe CLI

**Plano não atualiza após pagamento:**

- Verificar se eventos estão configurados no webhook
- Verificar se `STRIPE_STANDARD_PRICE_ID` e `STRIPE_PREMIUM_PRICE_ID` estão corretos
- Verificar logs do webhook

**Limites não funcionam:**

- Verificar se migração foi executada
- Verificar se usuário tem `subscription_plan` definido
- Verificar se função `getUserPlan()` está retornando corretamente
