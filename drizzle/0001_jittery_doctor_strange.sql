-- Adicionar colunas de plano à tabela de usuários
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(50) DEFAULT 'free' NOT NULL,
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50);

-- Adicionar coluna de plano à tabela de assinaturas
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS plan VARCHAR(50) DEFAULT 'standard' NOT NULL;

-- Atualizar registros existentes de assinaturas ativas para plano standard
UPDATE subscriptions 
SET plan = 'standard' 
WHERE stripe_status IN ('active', 'trialing') AND plan IS NULL;

-- Atualizar usuários com assinaturas ativas
UPDATE users u
SET 
  subscription_plan = COALESCE(s.plan, 'free'),
  subscription_status = s.stripe_status
FROM subscriptions s
WHERE u.id = s.user_id
  AND s.stripe_status IN ('active', 'trialing', 'past_due');

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_subscription_plan ON users(subscription_plan);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON subscriptions(plan);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
