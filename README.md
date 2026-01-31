# Mini Horta (Next.js)

## Quick start

1. Copy env

```
cp .env.example .env
```

2. Start Postgres + Next.js

```
docker compose up --build
```

3. Generate Better Auth schema

```
npm run auth:generate
```

4. Generate & apply Drizzle migrations

```
npm run db:generate
npm run db:migrate
```

5. Import legacy SQLite (optional)

```
SQLITE_PATH=/absolute/path/to/database.sqlite npm run db:import:sqlite
```
