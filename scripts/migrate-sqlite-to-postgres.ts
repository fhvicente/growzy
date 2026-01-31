import Database from "better-sqlite3";
import { Client } from "pg";

const sqlitePath = process.env.SQLITE_PATH;
const databaseUrl = process.env.DATABASE_URL;

if (!sqlitePath) {
    throw new Error("SQLITE_PATH is required (path to legacy database.sqlite)");
}

if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for PostgreSQL");
}

const sqlite = new Database(sqlitePath, { readonly: true });
const pg = new Client({ connectionString: databaseUrl });

const tables = [
    {
        name: "users",
        columns: [
            "id",
            "name",
            "email",
            "email_verified_at",
            "password",
            "stripe_id",
            "remember_token",
            "created_at",
            "updated_at",
        ],
    },
    {
        name: "plants",
        columns: [
            "id",
            "name",
            "scientific_name",
            "description",
            "image_url",
            "pot_size_required",
            "soil_amount_required",
            "seeds_per_plant",
            "price",
            "created_at",
            "updated_at",
        ],
    },
    {
        name: "products",
        columns: [
            "id",
            "name",
            "type",
            "description",
            "image_url",
            "price",
            "store_name",
            "store_url",
            "size",
            "created_at",
            "updated_at",
        ],
    },
    {
        name: "calculations",
        columns: [
            "id",
            "user_id",
            "plants_data",
            "products_data",
            "total_cost",
            "plants_count",
            "estimated_savings",
            "is_public",
            "created_at",
            "updated_at",
        ],
    },
    {
        name: "subscriptions",
        columns: [
            "id",
            "user_id",
            "stripe_id",
            "stripe_status",
            "stripe_price",
            "quantity",
            "trial_ends_at",
            "ends_at",
            "created_at",
            "updated_at",
        ],
    },
    {
        name: "webhook_logs",
        columns: [
            "id",
            "event_id",
            "event_type",
            "payload",
            "status",
            "error_message",
            "created_at",
            "updated_at",
        ],
    },
];

function buildInsert(table: string, columns: string[]) {
    const cols = columns.map((c) => `"${c}"`).join(", ");
    const values = columns.map((_, i) => `$${i + 1}`).join(", ");
    return `INSERT INTO "${table}" (${cols}) VALUES (${values})`;
}

function normalizeValue(table: string, column: string, value: any) {
    if (value === null || value === undefined) {
        return value;
    }

    if (table === "users" && column === "id") {
        return String(value);
    }

    if (
        (table === "calculations" || table === "subscriptions") &&
        column === "user_id"
    ) {
        return String(value);
    }

    return value;
}

async function run() {
    await pg.connect();

    const tableNames = tables.map((t) => `"${t.name}"`).join(", ");
    await pg.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE`);

    for (const table of tables) {
        const rows = sqlite
            .prepare(`SELECT ${table.columns.join(", ")} FROM ${table.name}`)
            .all();
        if (!rows.length) {
            continue;
        }

        const insertSql = buildInsert(table.name, table.columns);

        for (const row of rows) {
            const values = table.columns.map((col) =>
                normalizeValue(table.name, col, row[col]),
            );
            await pg.query(insertSql, values);
        }
    }

    await pg.end();
    sqlite.close();
    console.log("SQLite data imported into PostgreSQL successfully.");
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
