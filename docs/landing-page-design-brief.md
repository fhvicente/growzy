# Growzy Landing Page Design Brief

## Web Landing Page for Garden Planning & Cost Calculator App

---

## CRITICAL: Design System Reference

This landing page MUST follow the design system established in the application. All colors, typography, spacing, and component styles align with the app design to maintain brand consistency.

---

## Project Overview

**Product:** Growzy - Garden planning and cost calculator for home gardeners
**Objective:** Convert visitors into registered users and premium subscribers
**Target Audience:** Home gardeners, urban farmers, sustainability enthusiasts, food self-sufficiency advocates
**Primary CTA:** Start using calculator / Start free trial
**Tone:** Natural, encouraging, practical, sustainable, trustworthy

---

## Design Requirements

### Color Palette (from globals.css)

- **Primary Green:** #16a34a (oklch(52.18% 0.177 155.825))
- **Primary Shades:**
    - 50: #f0fdf4 (Very light green)
    - 100: #dcfce7
    - 200: #bbf7d0
    - 300: #86efac
    - 400: #4ade80
    - 500: #22c55e
    - 600: #16a34a (Main brand color)
    - 700: #15803d
    - 800: #166534
    - 900: #14532d (Dark green)
- **Background:** White (#FFFFFF)
- **Foreground/Text:** oklch(9.84% 0.004 285.885) (Nearly black)
- **Muted Text:** oklch(52.36% 0.016 285.885) (Gray)
- **Border:** oklch(89.84% 0.002 286.375) (Light gray)
- **Success/Savings:** #22c55e (Green)
- **Accent:** Use primary green variations

### Typography

- **Font Family:** Default system font stack (consistent with app)
- **Headings:**
    - Font weight: 600-700
    - Letter spacing: -0.025em
    - H1: 3rem (desktop) / 2.25rem (mobile)
    - H2: 2.25rem (desktop) / 1.875rem (mobile)
    - H3: 1.875rem (desktop) / 1.5rem (mobile)
- **Body:** 16px, line-height 1.6-1.8
- **Maintain:** App's visual hierarchy

### Spacing

- **System:** 8px base unit (all spacing multiples of 8)
- **Section padding:** 80px vertical (desktop), 48px (mobile)
- **Container max-width:** 1200px (xl: 1280px for wide sections)
- **Horizontal padding:** 80px (desktop), 16px (mobile)

### Visual Style

- **Border radius:**
    - Cards: 0.75rem (12px)
    - Buttons: 0.75rem (12px)
    - Small elements: calc(0.75rem - 4px)
- **Shadows:** Soft, layered (2xl for hero, lg for cards)
- **Images:** High-quality gardening photography with 12px radius
- **Overlays:** Light green gradients for text legibility on images
- **Icons:** Lucide icons, 24px standard size

---

## Landing Page Structure

---

## SECTION 1: Hero / Above the Fold

### Layout

- **Full viewport height** (min-height: 100vh)
- **2 columns** on desktop (60/40 split)
- **Stacked** on mobile (content first, image second)
- **Background:** Subtle gradient from primary-50 via white to primary-100

### Column 1: Content (Left)

**Vertical centering, left-aligned text**

#### Navigation Bar (Sticky)

- **Height:** 72px
- **Background:** White with subtle shadow on scroll
- **Container:** Max-width 1280px, horizontal padding 80px (desktop) / 16px (mobile)
- **Layout:** Flex, space-between

**Logo (Left):**

- **Logo + Text:** "Growzy"
- **Font size:** 24px
- **Font weight:** 700
- **Color:** Nearly black
- **Icon:** Leaf icon (optional, 28px, primary-600)

**Navigation Links (Center):**

- **Links:** Funcionalidades, Como Funciona, Preços, FAQ
- **Font size:** 15px
- **Font weight:** 500
- **Color:** Muted text color
- **Hover:** primary-600
- **Gap:** 32px
- **Display:** Desktop only

**CTA Button (Right):**

- **Text:** "Começar Grátis"
- **Background:** primary-600
- **Color:** White
- **Padding:** 12px 24px
- **Border radius:** 12px
- **Font size:** 15px
- **Font weight:** 600
- **Shadow:** 0px 4px 8px rgba(22, 163, 74, 0.25)

**Mobile Menu Icon:**

- **Display:** Mobile only
- **Icon:** Menu (Lucide)
- **Size:** 24px
- **Color:** Foreground

#### Hero Content

**Padding top:** 120px (to clear fixed nav)

**Eyebrow Badge:**

- **Text:** "🌱 Ferramenta Premium para Hortas"
- **Background:** primary-600
- **Color:** White
- **Font size:** 14px
- **Font weight:** 600
- **Padding:** 8px 16px
- **Border radius:** 12px
- **Icon:** Sparkles (Lucide)
- **Margin bottom:** 16px

**Headline (h1):**

- **Text:** "Planeie a sua Growzy com precisão"
- **Font size:** 60px (desktop) / 36px (mobile)
- **Font weight:** 700
- **Line height:** 1.1
- **Letter spacing:** -0.025em
- **Color:** Foreground
- **Gradient accent:** "Growzy" in gradient (primary-600 to primary-800)
- **Max width:** 600px
- **Margin bottom:** 24px

**Alternative Headlines (Portuguese):**

- "Cultive Alimentos Saudáveis em Casa"
- "Transforme o Seu Espaço Num Jardim Produtivo"
- "Calcule, Planeie e Cultive com Confiança"

**Subheadline:**

- **Text:** "Calcule custos com precisão, acompanhe o seu plantio e cultive alimentos saudáveis em casa. A ferramenta completa para horticultores urbanos."
- **Font size:** 18px (desktop) / 16px (mobile)
- **Font weight:** 400
- **Line height:** 1.6
- **Color:** Muted text
- **Max width:** 540px
- **Margin bottom:** 40px

**CTA Button Group:**

- **Layout:** Flex row, gap 16px
- **Wrap:** Mobile

**Primary Button:**

- **Text:** "Começar Agora →" or "Calcular Custos"
- **Background:** primary-600
- **Color:** White
- **Padding:** 16px 32px
- **Border radius:** 12px
- **Font size:** 16px
- **Font weight:** 600
- **Shadow:** 0px 4px 8px rgba(22, 163, 74, 0.25)
- **Icon:** ArrowRight (Lucide)
- **Hover:** primary-700, lift 2px

**Secondary Button:**

- **Text:** "Ver Como Funciona" or "Ver Planos"
- **Background:** #F5F5F5
- **Color:** Foreground
- **Padding:** 16px 32px
- **Border radius:** 12px
- **Font size:** 16px
- **Font weight:** 600
- **Border:** 1px solid border color
- **Hover:** Darken background

**Social Proof (Below buttons):**

- **Margin top:** 32px
- **Layout:** Flex row, gap 24px, center aligned

**Trust Indicators:**

- **Item 1:**
    - Icon: CheckCircle2 (primary-600)
    - Text: "Sem cartão necessário"
    - Font size: 14px

- **Item 2:**
    - Icon: CheckCircle2 (primary-600)
    - Text: "Teste grátis 14 dias"
    - Font size: 14px

### Column 2: Visual (Right)

**Vertical centering**

#### Hero Image/Mockup

**Option 1: Calculator Preview Card**

- **Display:** Elevated card showing calculator interface
- **Content:** Example calculation:
    - 5x Tomates - €12.50
    - 3x Alface - €4.50
    - 2x Manjericão - €3.60
    - **Total:** €20.60
    - Savings badge: "Economia de 45% vs. supermercado"
- **Style:**
    - Border: 2px primary-200
    - Background: white/80 with backdrop blur
    - Shadow: 2xl
    - Border radius: 12px
- **Animation:** Subtle floating (up/down 10px, 3s loop)

**Option 2: Garden Planning Interface**

- **Display:** Screenshot of plant selection interface
- **Show:** Multiple plant cards with images and prices
- **Overlay:** Calculator icon and metrics

**Option 3: Before/After Comparison**

- **Left:** Empty space or traditional paper planning
- **Right:** Growzy app interface showing planned garden

**Decorative Elements:**

- **Icons:** Leaf, Sprout, Sun, Calculator floating around
- **Size:** 40-60px
- **Animation:** Gentle float/rotate
- **Opacity:** 60-80%
- **Colors:** primary-600, primary-400, primary-300

---

## SECTION 2: Problem Statement / Pain Points

### Layout

- **Background:** #F8F9FA (very light gray)
- **Padding:** 80px vertical (desktop) / 48px (mobile)
- **Container:** Max-width 1200px, centered

### Content

**Text align:** Center

#### Section Label

- **Text:** "O Problema"
- **Font size:** 14px
- **Font weight:** 600
- **Color:** primary-600
- **Text transform:** Uppercase
- **Letter spacing:** 0.5px
- **Margin bottom:** 16px

#### Headline (h2)

- **Text:** "Planear Uma Horta Não Devia Ser Complicado"
- **Font size:** 40px (desktop) / 28px (mobile)
- **Font weight:** 700
- **Line height:** 1.2
- **Letter spacing:** -0.025em
- **Color:** Foreground
- **Max width:** 700px
- **Margin:** 0 auto 48px

#### Pain Point Cards

- **Layout:** 3 columns (desktop) / 1 column (mobile)
- **Gap:** 24px
- **Max width:** 1000px
- **Margin:** 0 auto

**Each Card:**

- **Background:** White
- **Border:** 1px solid border color
- **Border radius:** 12px
- **Padding:** 32px 24px
- **Shadow:** 0px 2px 4px rgba(0, 0, 0, 0.05)
- **Hover:** Lift 4px, increase shadow

**Icon (Top):**

- **Type:** Lucide icon or emoji
- **Size:** 48px
- **Color:** #ef4444 (red for problems)
- **Background:** rgba(239, 68, 68, 0.1)
- **Padding:** 16px
- **Border radius:** 12px
- **Margin bottom:** 20px

**Title (h3):**

- **Font size:** 18px
- **Font weight:** 600
- **Color:** Foreground
- **Margin bottom:** 12px

**Description:**

- **Font size:** 15px
- **Font weight:** 400
- **Line height:** 1.6
- **Color:** Muted text

**Pain Point Examples (Portuguese):**

1. **Icon:** 📝 or Calculator
    - **Title:** "Custos Imprevisíveis"
    - **Description:** "Difícil calcular o investimento total antes de começar. Gastos com plantas, terra, fertilizantes e ferramentas podem surpreender."

2. **Icon:** 📅 or Calendar
    - **Title:** "Planeamento Confuso"
    - **Description:** "Quando plantar cada cultura? Quanto espaço preciso? Quantas plantas cabem na minha varanda? Demasiadas dúvidas."

3. **Icon:** 💰 or TrendingDown
    - **Title:** "Sem Controlo de Gastos"
    - **Description:** "Difícil acompanhar despesas ao longo do tempo e comparar com o preço dos alimentos no supermercado."

---

## SECTION 3: Solution / Features

### Layout

- **Background:** White
- **Padding:** 80px vertical (desktop) / 48px (mobile)
- **Container:** Max-width 1200px, centered

### Content

#### Section Label + Headline

- **Label:** "A Solução"
- **Headline:** "Tudo o Que Precisa Para Cultivar com Sucesso"
- **Subheadline:** "Da calculadora ao acompanhamento, gerir a sua horta nunca foi tão simples"
- **Text align:** Center
- **Margin bottom:** 64px

#### Feature Showcase (Alternating Layout)

**Pattern:** Image/Mockup alternates left-right

##### Feature 1: Cost Calculator

- **Layout:** 2 columns (50/50)
- **Image:** Left
- **Content:** Right
- **Vertical align:** Center

**Image/Mockup:**

- **Type:** Calculator interface screenshot
- **Size:** 500px width (desktop)
- **Border radius:** 12px
- **Border:** 2px primary-200
- **Shadow:** Large soft shadow
- **Content:** Show plant selection and cost breakdown

**Content:**

- **Icon Badge:**
    - Background: rgba(22, 163, 74, 0.1)
    - Icon: Calculator (24px, primary-600)
    - Size: 56px
    - Border radius: 12px
    - Margin bottom: 20px

- **Title (h3):**
    - **Text:** "Calculadora de Custos Precisa"
    - **Font size:** 32px (desktop) / 24px (mobile)
    - **Font weight:** 700
    - **Color:** Foreground
    - **Margin bottom:** 16px

- **Description:**
    - **Text:** "Calcule o investimento total da sua horta antes de começar. Adicione plantas, terra, fertilizantes e veja os custos em tempo real."
    - **Font size:** 16px
    - **Line height:** 1.6
    - **Color:** Muted text
    - **Margin bottom:** 24px

- **Feature List:**
    - **Layout:** Vertical list
    - **Gap:** 12px

    **Each Item:**
    - **Icon:** CheckCircle2 (16px, #22c55e)
    - **Text:** Feature bullet
    - **Font size:** 15px
    - **Color:** Foreground
    - **Gap:** 8px

    **Examples (Portuguese):**
    - "Base de dados com 50+ plantas comuns"
    - "Preços atualizados do mercado português"
    - "Cálculo automático de materiais necessários"
    - "Comparação com preços de supermercado"

##### Feature 2: Garden Planning

- **Layout:** 2 columns (50/50)
- **Image:** Right (swap from Feature 1)
- **Content:** Left
- **Same styling as Feature 1**

**Content:**

- **Icon:** Leaf or Layout
- **Title:** "Planeamento Inteligente"
- **Description:** "Organize a sua horta por espaço disponível, época do ano e compatibilidade entre plantas. Receba sugestões personalizadas."
- **Bullets:**
    - "Calendário de plantação por região"
    - "Compatibilidade entre culturas"
    - "Otimização de espaço"
    - "Guias de cuidados para cada planta"

##### Feature 3: Progress Tracking

- **Layout:** 2 columns (50/50)
- **Image:** Left
- **Content:** Right

**Content:**

- **Icon:** TrendingDown or BarChart
- **Title:** "Acompanhamento de Economias"
- **Description:** "Veja quanto está a poupar ao cultivar em casa. Compare custos de produção vs. supermercado e acompanhe o retorno do investimento."
- **Bullets:**
    - "Dashboard com gastos totais"
    - "Cálculo de poupanças realizadas"
    - "Histórico de colheitas"
    - "Métricas de produtividade"

##### Feature 4: Multi-device Access

- **Layout:** 2 columns (50/50)
- **Image:** Right
- **Content:** Left

**Content:**

- **Icon:** Smartphone or Cloud
- **Title:** "Acesso em Qualquer Lugar"
- **Description:** "Sincronize os seus dados entre dispositivos. Planeie no computador, consulte no telemóvel enquanto está na horta ou loja."
- **Bullets:**
    - "Aplicação web responsiva"
    - "Funciona offline"
    - "Dados guardados na cloud"
    - "Exportação de listas de compras"

---

## SECTION 4: How It Works

### Layout

- **Background:** #F8F9FA
- **Padding:** 80px vertical (desktop) / 48px (mobile)
- **Container:** Max-width 1200px, centered

### Content

#### Section Label + Headline

- **Label:** "Como Funciona"
- **Headline:** "Comece em 3 Passos Simples"
- **Text align:** Center
- **Margin bottom:** 64px

#### Steps (3 columns / stacked mobile)

- **Layout:** 3 columns equal width
- **Gap:** 32px
- **Max width:** 1000px
- **Margin:** 0 auto

**Each Step Card:**

- **Background:** White
- **Border radius:** 12px
- **Padding:** 40px 32px
- **Text align:** Center
- **Shadow:** 0px 2px 4px rgba(0, 0, 0, 0.05)
- **Hover:** Lift 4px

**Step Number:**

- **Size:** 64px circle
- **Background:** primary-600
- **Color:** White
- **Font size:** 28px
- **Font weight:** 700
- **Border radius:** Full
- **Margin:** 0 auto 24px
- **Display:** Flex, center aligned

**Title (h3):**

- **Font size:** 20px
- **Font weight:** 600
- **Color:** Foreground
- **Margin bottom:** 12px

**Description:**

- **Font size:** 15px
- **Line height:** 1.6
- **Color:** Muted text

**Step Examples (Portuguese):**

1. **Title:** "Escolha as Suas Plantas"
    - **Description:** "Selecione as plantas que quer cultivar da nossa base de dados. Veja preços e características de cada uma."

2. **Title:** "Calcule os Custos"
    - **Description:** "A calculadora mostra automaticamente o investimento total: plantas, terra, vasos, fertilizantes e ferramentas."

3. **Title:** "Comece a Cultivar"
    - **Description:** "Siga o plano personalizado, acompanhe o progresso e registe as colheitas para ver as suas economias."

**Connector Elements (Desktop only):**

- **Between cards:** Arrow or dashed line
- **Color:** Border color (light gray)
- **Style:** Subtle, decorative

---

## SECTION 5: Screenshots Showcase / Gallery

### Layout

- **Background:** White
- **Padding:** 80px vertical (desktop) / 48px (mobile)
- **Container:** Max-width 1400px, centered

### Content

#### Section Label + Headline

- **Label:** "Interface Intuitiva"
- **Headline:** "Simples de Usar, Poderoso nos Resultados"
- **Text align:** Center
- **Margin bottom:** 48px

#### Screenshot Gallery

**Option 1: Grid**

- **Layout:** 3 columns (desktop) / 1 column (mobile)
- **Gap:** 24px

**Option 2: Carousel**

- **Layout:** Horizontal slider
- **Gap:** 24px
- **Navigation:** Dots below, arrows on sides

**Each Screenshot:**

- **Type:** Browser window or card with screenshot
- **Border radius:** 12px
- **Border:** 2px primary-100
- **Shadow:** 0px 4px 8px rgba(0, 0, 0, 0.08)
- **Aspect ratio:** 16:10 or match interface
- **Hover:** Slight lift + zoom

**Screenshots to Include:**

1. **Dashboard:** Overview with current gardens and summary
2. **Calculator:** Plant selection and cost breakdown
3. **Results:** Detailed calculation with savings comparison
4. **Profile:** User gardens and history
5. **Plant Database:** Search and browse plants
6. **Pricing:** Plans comparison

**Caption (Optional):**

- **Text:** Brief description in Portuguese
- **Font size:** 14px
- **Color:** Muted text
- **Text align:** Center
- **Margin top:** 16px

---

## SECTION 6: Social Proof / Testimonials

### Layout

- **Background:** #F8F9FA
- **Padding:** 80px vertical (desktop) / 48px (mobile)
- **Container:** Max-width 1200px, centered

### Content

#### Section Label + Headline

- **Label:** "O Que Dizem"
- **Headline:** "Junte-se a Milhares de Horticultores Satisfeitos"
- **Text align:** Center
- **Margin bottom:** 48px

#### Testimonial Cards

- **Layout:** 3 columns (desktop) / 1 column (mobile)
- **Gap:** 24px

**Each Card:**

- **Background:** White
- **Border radius:** 12px
- **Padding:** 32px 24px
- **Shadow:** 0px 2px 4px rgba(0, 0, 0, 0.05)

**Stars:**

- **Display:** ⭐⭐⭐⭐⭐
- **Size:** 16px
- **Color:** #fbbf24 (amber)
- **Margin bottom:** 16px

**Quote:**

- **Font size:** 16px
- **Font weight:** 400
- **Line height:** 1.6
- **Color:** Foreground
- **Font style:** Italic
- **Margin bottom:** 20px
- **Text:** Testimonial content in Portuguese

**Author Section:**

- **Layout:** Flex row, gap 12px, center aligned

**Avatar:**

- **Size:** 48px
- **Border radius:** Full
- **Image:** User photo or initial circle
- **Background:** primary-100
- **Color:** primary-700

**Author Info:**

- **Name:**
    - Font size: 15px
    - Font weight: 600
    - Color: Foreground

- **Title/Location:**
    - Font size: 13px
    - Color: Muted text

**Example Testimonials (Portuguese):**

1. "Com a Growzy consegui planear a minha varanda toda e já poupei mais de 200€ em alimentos frescos. Recomendo!" - Maria Silva, Lisboa

2. "Finalmente sei quanto vou gastar antes de começar. A calculadora é muito precisa e ajudou-me a fazer escolhas melhores." - João Santos, Porto

3. "Uso todos os dias para acompanhar as minhas plantas. Adoro ver quanto estou a economizar!" - Ana Costa, Coimbra

---

## SECTION 7: Pricing / Plans

### Layout

- **Background:** White
- **Padding:** 80px vertical (desktop) / 48px (mobile)
- **Container:** Max-width 1200px, centered

### Content

#### Section Label + Headline

- **Label:** "Preços Simples"
- **Headline:** "Comece Grátis, Atualize Quando Quiser"
- **Text align:** Center
- **Margin bottom:** 48px

#### Pricing Cards

- **Layout:** 2-3 columns (desktop) / 1 column (mobile)
- **Gap:** 24px
- **Max width:** 900px
- **Margin:** 0 auto

**Each Card:**

- **Background:** White
- **Border:** 2px solid border color
- **Border radius:** 12px
- **Padding:** 40px 32px
- **Text align:** Left

**Popular Badge (Pro plan):**

- **Position:** Absolute top
- **Background:** primary-600
- **Color:** White
- **Padding:** 6px 16px
- **Border radius:** 20px
- **Font size:** 12px
- **Font weight:** 600
- **Text:** "Mais Popular"

**Plan Name:**

- **Font size:** 20px
- **Font weight:** 600
- **Color:** Foreground
- **Margin bottom:** 8px

**Price:**

- **Font size:** 48px
- **Font weight:** 700
- **Color:** Foreground
- **Letter spacing:** -0.025em
- **Margin bottom:** 4px

**Billing Period:**

- **Font size:** 14px
- **Color:** Muted text
- **Margin bottom:** 24px

**Description:**

- **Font size:** 15px
- **Color:** Muted text
- **Margin bottom:** 24px

**CTA Button:**

- **Width:** Full
- **Padding:** 14px 24px
- **Border radius:** 12px
- **Font size:** 16px
- **Font weight:** 600
- **Margin bottom:** 24px
- **Popular plan:** primary-600 background, white text
- **Other plans:** Border 2px, primary-600 text, transparent bg

**Features List:**

- **Layout:** Vertical list
- **Text align:** Left
- **Gap:** 12px

**Each Feature:**

- **Icon:** CheckCircle2 (16px, #22c55e)
- **Text:** Feature name
- **Font size:** 14px
- **Color:** Foreground
- **Gap:** 8px

**Example Plans (Portuguese):**

**Grátis:**

- Preço: €0
- Período: "Para sempre"
- Funcionalidades:
    - Até 3 hortas
    - Calculadora básica
    - Base de dados de 20 plantas
    - Sem acompanhamento

**Pro (Popular):**

- Preço: €4.99/mês ou €39/ano
- Período: "Faturação mensal" ou "Poupe 34%"
- Funcionalidades:
    - Hortas ilimitadas
    - Calculadora avançada
    - 50+ plantas na base de dados
    - Acompanhamento de progresso
    - Calendário de plantação
    - Comparação de economias
    - Exportação de relatórios
    - Suporte prioritário

**Família (Opcional):**

- Preço: €7.99/mês ou €59/ano
- Funcionalidades:
    - Tudo em Pro
    - Até 5 membros familiares
    - Hortas partilhadas
    - Planeamento colaborativo

---

## SECTION 8: FAQ

### Layout

- **Background:** #F8F9FA
- **Padding:** 80px vertical (desktop) / 48px (mobile)
- **Container:** Max-width 800px, centered

### Content

#### Section Label + Headline

- **Label:** "FAQ"
- **Headline:** "Perguntas Frequentes"
- **Text align:** Center
- **Margin bottom:** 48px

#### FAQ Accordion

- **Layout:** Single column, full width

**Each FAQ Item:**

- **Background:** White
- **Border radius:** 12px
- **Margin bottom:** 16px
- **Border:** 1px solid border color
- **Shadow:** 0px 2px 4px rgba(0, 0, 0, 0.04)
- **Hover:** Lift slightly

**Question (Accordion Header):**

- **Padding:** 20px 24px
- **Cursor:** Pointer
- **Layout:** Flex, space-between, center aligned

**Question Text:**

- **Font size:** 16px
- **Font weight:** 600
- **Color:** Foreground

**Icon:**

- **Type:** ChevronDown (rotates when open)
- **Size:** 20px
- **Color:** Muted text
- **Transition:** Smooth rotate (200ms)

**Answer (Accordion Body):**

- **Padding:** 0 24px 20px
- **Display:** Hidden when collapsed
- **Animation:** Smooth expand/collapse

**Answer Text:**

- **Font size:** 15px
- **Line height:** 1.6
- **Color:** Muted text

**Example FAQs (Portuguese):**

1. **Q:** "A Growzy funciona para hortas em varanda?"
   **A:** "Sim! A calculadora adapta-se a qualquer espaço, desde varandas pequenas a quintais grandes. Pode definir o espaço disponível e receber sugestões adequadas."

2. **Q:** "Os preços das plantas são atualizados?"
   **A:** "Os preços são baseados em médias do mercado português e são atualizados regularmente. Pode também personalizar preços se encontrar valores diferentes."

3. **Q:** "Posso usar sem internet?"
   **A:** "A aplicação funciona offline para consultar os seus dados. Precisa de internet para sincronizar entre dispositivos e aceder à base de dados completa."

4. **Q:** "Como cancelo a subscrição?"
   **A:** "Pode cancelar a qualquer momento nas definições da conta. Não há períodos de fidelização."

5. **Q:** "Há garantia de devolução?"
   **A:** "Sim! Teste grátis durante 14 dias. Se não ficar satisfeito, devolvemos 100% do valor."

6. **Q:** "A base de dados inclui plantas portuguesas?"
   **A:** "Sim! Focamo-nos em plantas comuns em Portugal e adequadas ao clima português."

7. **Q:** "Posso exportar os meus dados?"
   **A:** "Sim! Utilizadores Pro podem exportar relatórios em PDF e Excel."

8. **Q:** "Há aplicação móvel?"
   **A:** "Atualmente é uma aplicação web responsiva que funciona perfeitamente em qualquer dispositivo."

---

## SECTION 9: Final CTA / Download

### Layout

- **Background:** Gradient (linear-gradient(135deg, primary-600 0%, primary-500 100%))
- **Padding:** 80px vertical (desktop) / 48px (mobile)
- **Container:** Max-width 900px, centered
- **Text align:** Center
- **Color:** All white text

### Content

#### Icon/Illustration

- **Type:** Leaf or Sprout icon
- **Size:** 80px
- **Color:** White
- **Opacity:** 90%
- **Margin bottom:** 24px

#### Headline (h2)

- **Text:** "Comece a Cultivar a Sua Horta Hoje"
- **Font size:** 40px (desktop) / 28px (mobile)
- **Font weight:** 700
- **Color:** White
- **Line height:** 1.2
- **Margin bottom:** 16px

#### Subheadline

- **Text:** "Junte-se a milhares de pessoas que já cultivam alimentos saudáveis em casa"
- **Font size:** 18px
- **Color:** rgba(255, 255, 255, 0.9)
- **Margin bottom:** 32px

#### CTA Button

- **Text:** "Começar Gratuitamente"
- **Background:** White
- **Color:** primary-600
- **Padding:** 16px 40px
- **Border radius:** 12px
- **Font size:** 18px
- **Font weight:** 600
- **Icon:** ArrowRight (20px)
- **Gap:** 8px
- **Shadow:** 0px 4px 12px rgba(0, 0, 0, 0.15)
- **Hover:** Lift, increase shadow

#### Trust Indicators (Below button)

- **Margin top:** 24px
- **Font size:** 14px
- **Color:** rgba(255, 255, 255, 0.9)

**Text:**

- "✓ Teste grátis 14 dias"
- "✓ Sem cartão necessário"
- "✓ Cancele quando quiser"

**Layout:** Flex row, gap 24px, center (or vertical stack on mobile)

---

## SECTION 10: Footer

### Layout

- **Background:** #1a1a1a (dark, nearly black)
- **Padding:** 64px vertical, 80px horizontal (desktop) / 40px/16px (mobile)
- **Container:** Max-width 1200px, centered
- **Color:** All white/light text

### Content Structure

#### Top Section

- **Layout:** 4 columns (desktop) / 1 column (mobile)
- **Gap:** 48px (desktop) / 32px (mobile)

**Column 1: Brand**

- **Logo:** Growzy logo
- **Icon:** Leaf icon (32px, white/primary-400)
- **Text:** Growzy
- **Size:** 24px
- **Font weight:** 700
- **Color:** White
- **Margin bottom:** 16px

**Tagline:**

- **Text:** "Cultive com confiança e economia"
- **Font size:** 14px
- **Color:** rgba(255, 255, 255, 0.7)
- **Margin bottom:** 20px

**Social Icons (Optional):**

- **Layout:** Flex row, gap 12px
- **Each Icon:**
    - Size: 40px circle
    - Background: rgba(255, 255, 255, 0.1)
    - Icon size: 20px
    - Color: White
    - Hover: Background rgba(255, 255, 255, 0.2)
    - Icons: Facebook, Instagram, YouTube

**Column 2: Produto**

- **Title:** "Produto"
- **Font size:** 16px
- **Font weight:** 600
- **Color:** White
- **Margin bottom:** 16px

**Links:**

- **Font size:** 14px
- **Color:** rgba(255, 255, 255, 0.7)
- **Line height:** 2
- **Hover:** Color white

**Links List (Portuguese):**

- Funcionalidades
- Calculadora
- Preços
- Como Funciona
- FAQ

**Column 3: Empresa**

- **Title:** "Empresa"
- **Same styling as Column 2**

**Links:**

- Sobre Nós
- Blog
- Contacto
- Imprensa

**Column 4: Apoio**

- **Title:** "Apoio"
- **Same styling as Column 2**

**Links:**

- Centro de Ajuda
- Tutoriais
- Política de Privacidade
- Termos de Serviço
- Cookies

#### Bottom Section

- **Border top:** 1px solid rgba(255, 255, 255, 0.1)
- **Padding top:** 32px
- **Margin top:** 48px
- **Layout:** Flex row, space-between (stack mobile)

**Copyright:**

- **Text:** "© 2026 Growzy. Todos os direitos reservados."
- **Font size:** 14px
- **Color:** rgba(255, 255, 255, 0.5)

**Language Selector (Optional):**

- **Text:** "🇵🇹 Português"
- **Font size:** 14px
- **Color:** rgba(255, 255, 255, 0.7)
- **Dropdown:** On click (PT, EN, ES)

---

## Responsive Behavior

### Breakpoints

- **Mobile:** 0-639px (sm)
- **Tablet:** 640px-1023px (md-lg)
- **Desktop:** 1024px+ (xl)

### Mobile Adaptations

- **Stack all columns** vertically
- **Reduce font sizes:**
    - H1: 36px
    - H2: 28px
    - H3: 24px
    - Body: 16px
- **Reduce padding:** 48px section padding
- **Horizontal padding:** 16px
- **Touch-friendly targets:** Min 44px
- **Hamburger menu** for navigation
- **Simplified animations**
- **Cards:** Full width with 16px margin

### Tablet Adaptations

- **2-column grids** where appropriate
- **Medium font sizes**
- **60px section padding**
- **Full-width cards** in some sections

---

## Animation & Interactions

### Page Load

- **Hero content:** Fade in + slide up (400ms delay)
- **Hero image:** Fade in + slide left (600ms delay)
- **Stagger:** Each section fades in on scroll (intersection observer)

### Hover States

- **Buttons:**
    - Primary: Darken to primary-700, lift 2px
    - Shadow increase
- **Cards:** Lift 4px, shadow increase
- **Images:** Slight zoom (1.02x scale)
- **Links:** Color change (primary-600) + underline

### Scroll Animations

- **Trigger:** When element 20% in viewport
- **Effect:** Fade in + slide up (300ms)
- **Easing:** cubic-bezier(0.4, 0.0, 0.2, 1)
- **Stagger:** 100ms between elements

### Interactive Elements

- **Accordion:** Smooth expand/collapse (250ms)
- **Image carousel:** Smooth slide (350ms)
- **Mobile menu:** Slide from right (300ms)

---

## Performance Optimization

### Images

- **Format:** WebP with JPG fallback
- **Lazy loading:** All images below fold
- **Responsive images:** srcset for different sizes
- **Compression:** Optimize for web (<100KB for hero)
- **CDN:** Use image CDN if available

### Code

- **Minify:** CSS and JavaScript (Next.js handles this)
- **Defer:** Non-critical JavaScript
- **Critical CSS:** Inline above-fold styles
- **Font loading:** font-display: swap
- **Tree shaking:** Remove unused code

### Metrics Targets

- **Lighthouse Score:** 90+ (all categories)
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Cumulative Layout Shift:** < 0.1
- **Largest Contentful Paint:** < 2.5s

---

## SEO Requirements

### Meta Tags (Portuguese)

- **Title:** "Growzy - Calculadora e Planeador de Hortas Caseiras"
- **Description:** "Calcule custos, planeie a sua horta caseira e acompanhe economias. Ferramenta completa para horticultores urbanos em Portugal. Teste grátis 14 dias."
- **Keywords:** calculadora horta, planear horta, horta caseira, agricultura urbana, horta varanda, cultivar em casa, poupar alimentos

### Structured Data

- **Schema.org:** WebApplication, SoftwareApplication, AggregateRating, FAQ
- **Open Graph:** For social sharing (Facebook, LinkedIn)
- **Twitter Cards:** Summary with large image

### Technical SEO

- **Semantic HTML:** Proper heading hierarchy (h1 → h2 → h3)
- **Alt text:** All images descriptive in Portuguese
- **Mobile-friendly:** Responsive design
- **Fast loading:** Core Web Vitals optimized
- **HTTPS:** Secure connection
- **Sitemap:** XML sitemap
- **Robots.txt:** Properly configured
- **Canonical URLs:** Avoid duplicate content

### Multilingual SEO (if applicable)

- **hreflang tags:** For Portuguese, English variants
- **URL structure:** /pt/, /en/
- **Localized content:** Full translations

---

## Accessibility (WCAG 2.1 AA)

### Requirements

- **Color contrast:**
    - 4.5:1 for normal text
    - 3:1 for large text
    - Test primary-600 on white
- **Keyboard navigation:** All interactive elements
- **Focus indicators:** Visible ring (primary-600)
- **ARIA labels:** Proper labeling for screen readers
- **Alt text:** Descriptive for all images
- **Semantic HTML:** Proper landmark regions (header, nav, main, footer)
- **Heading hierarchy:** Logical structure (no skipping levels)
- **Form labels:** Associated with inputs
- **Link text:** Descriptive (avoid "click here")

### Testing

- **Screen reader:** Test with NVDA/JAWS
- **Keyboard only:** Tab through entire page
- **Color blindness:** Test with filters
- **Axe DevTools:** Automated accessibility audit

---

## Conversion Optimization

### Primary Goals

1. Free trial signups (calculator access)
2. Pro plan conversions
3. Email list growth

### CTA Placement

- **Hero section:** Primary "Começar Agora" CTA
- **After problem section:** "Ver Solução" CTA
- **After features:** "Experimentar Grátis" CTA
- **After testimonials:** Social proof CTA
- **Final section:** Strong closing "Começar Hoje" CTA
- **Sticky header:** Always-visible "Começar Grátis" button

### Trust Elements

- **Social proof:** User count (when available)
- **Free trial:** 14 days, no credit card
- **Money-back guarantee:** If applicable
- **Privacy:** "Os seus dados estão seguros"
- **Portuguese:** Local language builds trust

### Tracking & Analytics

- **Google Analytics 4:** Full implementation
- **Events to track:**
    - CTA button clicks (by location)
    - Scroll depth (25%, 50%, 75%, 100%)
    - Section views
    - Time on page
    - Form submissions
    - Pricing plan views
- **Conversion funnels:** Landing → Calculator → Signup → Pro
- **A/B Testing:**
    - Headline variations
    - CTA copy ("Começar" vs "Experimentar" vs "Calcular")
    - Pricing display
    - Hero image variants

---

## Technical Implementation Notes

### Framework & Stack

- **Framework:** Next.js 16+ (already in use)
- **Styling:** Tailwind CSS 4+ (already configured)
- **Icons:** Lucide React (already installed)
- **Animations:** Framer Motion or CSS animations
- **Forms:** React Hook Form (already installed)
- **Validation:** Zod (already installed)

### Components to Create

- `Hero.tsx` - Hero section
- `ProblemSection.tsx` - Pain points
- `FeaturesSection.tsx` - Feature showcase
- `HowItWorksSection.tsx` - Steps
- `ScreenshotsSection.tsx` - Gallery
- `TestimonialsSection.tsx` - Social proof
- `PricingSection.tsx` - Plans (may reuse existing)
- `FAQSection.tsx` - Accordion
- `CTASection.tsx` - Final CTA
- `LandingFooter.tsx` - Footer
- `LandingHeader.tsx` - Navigation

### Route Structure

- **Landing page:** `/` or `/[locale]` (root)
- **Separate from:** `/[locale]/dashboard`, `/[locale]/calculator` (protected)

### Integrations

- **Analytics:** Google Analytics (add to layout)
- **Email:** Newsletter signup (if needed)
- **Authentication:** Better Auth (already integrated)
- **Payments:** Stripe (already integrated)

### Environment Setup

```bash
# No additional dependencies needed
# Already have: next, react, tailwind, lucide-react

# Optional for animations:
npm install framer-motion

# Optional for form handling (already have):
# react-hook-form, zod, @hookform/resolvers
```

---

## Content Guidelines

### Voice & Tone (Portuguese)

- **Amigável** mas profissional
- **Encorajador** e motivador
- **Prático** e direto
- **Acessível** a todos (não técnico)
- **Positivo** sobre sustentabilidade

### Writing Style

- **Voz ativa:** Preferida
- **Frases curtas:** 15-20 palavras em média
- **Bullet points:** Para scanabilidade
- **CTAs orientados à ação:** "Começar", "Calcular", "Experimentar"
- **Benefícios > Funcionalidades:** Foco em resultados

### Headline Formulas (Portuguese)

- **Problema/Solução:** "Cansado de [Problema]? Conheça [Solução]"
- **Como Fazer:** "Como [Alcançar Objetivo] com [Produto]"
- **Benefício Direto:** "[Benefício] para [Público-Alvo]"
- **Pergunta:** "Já tentou [Ação]?"

### Key Messages

- **Economia:** Destaque poupanças vs supermercado
- **Simplicidade:** Fácil de usar, mesmo para iniciantes
- **Precisão:** Cálculos fiáveis e atualizados
- **Sustentabilidade:** Alimentos saudáveis e ecológicos
- **Controlo:** Saber exatamente o que investe

---

## Portuguese-Specific Considerations

### Language

- **Primary:** Português de Portugal
- **Spelling:** PT-PT (não PT-BR)
- **Currency:** Euro (€)
- **Date format:** DD/MM/YYYY

### Cultural Elements

- **Portuguese vegetables:** Focus on common Portuguese plants:
    - Tomate, alface, couve, pimento, pepino
    - Manjericão, salsa, coentros
    - Cebola, alho, cenoura
- **Climate zones:** Reference Portuguese climate
- **Local context:** Urban apartments, balconies (varandas)
- **Measurement units:** Metric system (cm, m, kg, L)

### Pricing Context

- **Market comparison:** Portuguese supermarket prices
- **Affordability:** Accessible to Portuguese market
- **Payment methods:** Multibanco, MB WAY, Card

---

## Brand Assets Needed

- **Logo:** SVG with leaf icon + "Growzy" text
- **Favicon:** 32x32, 16x16 (leaf icon)
- **OG Image:** 1200x630 for social sharing
- **App Screenshots:**
    - Calculator interface
    - Results page
    - Dashboard
    - Plant selection
- **Photography:**
    - Portuguese vegetables and gardens
    - Urban balcony gardens
    - Happy gardeners
    - Fresh produce
- **Icons:** Lucide icons (already available)
- **Illustrations (Optional):** Garden-themed illustrations

---

## Final Deliverables Checklist

- [ ] Fully responsive Next.js pages
- [ ] All 10 sections implemented
- [ ] Portuguese content throughout
- [ ] Animations functional
- [ ] Forms connected (newsletter, signup)
- [ ] Analytics tracking installed
- [ ] SEO meta tags complete (PT)
- [ ] Images optimized (WebP)
- [ ] Accessibility audit passed (WCAG AA)
- [ ] Cross-browser tested (Chrome, Safari, Firefox, Edge)
- [ ] Mobile tested (iOS Safari, Android Chrome)
- [ ] Performance optimized (Lighthouse 90+)
- [ ] Legal pages created (Privacidade, Termos)
- [ ] Cookie consent banner (GDPR)

---

## Launch Strategy

### Pre-Launch

1. **Beta testing:** Friends/family
2. **Content review:** Native Portuguese speaker
3. **Performance audit:** Lighthouse, WebPageTest
4. **SEO audit:** Technical SEO checklist
5. **Analytics setup:** Goals and funnels

### Launch Day

1. **Deploy to production** (Vercel recommended)
2. **Submit to Google Search Console**
3. **Share on social media**
4. **Email announcement** (if list exists)
5. **Monitor analytics** closely

### Post-Launch

1. **A/B testing:** Headlines, CTAs
2. **Heatmaps:** User behavior analysis (Hotjar, Microsoft Clarity)
3. **Feedback collection:** User surveys
4. **Iterate:** Based on data
5. **Content marketing:** Blog posts, SEO

---

## Success Metrics

### KPIs to Track

1. **Traffic:**
    - Unique visitors
    - Page views
    - Traffic sources
    - Bounce rate (<50%)

2. **Engagement:**
    - Average session duration (>2 min)
    - Pages per session (>2)
    - Scroll depth (>75%)

3. **Conversions:**
    - Signup rate (>5%)
    - Trial-to-paid conversion (>10%)
    - Calculator usage
    - CTA click-through rate

4. **Technical:**
    - Page load time (<3s)
    - Core Web Vitals (all green)
    - Uptime (>99.9%)

### Monthly Goals

- **Month 1:** 1000 visitors, 50 signups
- **Month 3:** 5000 visitors, 250 signups, 25 Pro users
- **Month 6:** 10000 visitors, 500 signups, 50 Pro users

---

This landing page design follows the established Growzy design system while optimizing for conversion and user engagement. The layout is clean, nature-inspired, and trust-building, with clear CTAs and social proof throughout. All content is in Portuguese for the Portuguese market.

**Key Differentiators:**

- Focus on cost calculation and savings
- Portuguese plants and context
- Practical, down-to-earth approach
- Urban gardening focus (balconies, small spaces)
- Sustainability and self-sufficiency messaging
