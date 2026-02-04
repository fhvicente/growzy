FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL
ARG BETTER_AUTH_BASE_URL
ARG STRIPE_SECRET_KEY
ARG STRIPE_STANDARD_PRICE_ID
ARG STRIPE_PREMIUM_PRICE_ID
ARG NEXT_PUBLIC_APP_NAME
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ENV BETTER_AUTH_URL=$BETTER_AUTH_URL
ENV BETTER_AUTH_BASE_URL=$BETTER_AUTH_BASE_URL
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
ENV STRIPE_STANDARD_PRICE_ID=$STRIPE_STANDARD_PRICE_ID
ENV STRIPE_PREMIUM_PRICE_ID=$STRIPE_PREMIUM_PRICE_ID
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "run", "start"]
