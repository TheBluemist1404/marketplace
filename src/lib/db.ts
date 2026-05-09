import "server-only";

import mysql, { type Pool, type PoolConnection, type QueryOptions } from "mysql2/promise";

let pool: Pool | null = null;

function readNumberEnv(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${name} must be a valid number.`);
  }

  return parsed;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: requiredEnv("DB_HOST"),
      port: readNumberEnv("DB_PORT", 3306),
      user: requiredEnv("DB_USER"),
      password: requiredEnv("DB_PASSWORD"),
      database: requiredEnv("DB_NAME"),
      waitForConnections: true,
      connectionLimit: readNumberEnv("DB_CONNECTION_LIMIT", 8),
      timezone: "Z",
      decimalNumbers: true,
    });
  }

  return pool;
}

export async function withConnection<T>(
  callback: (connection: PoolConnection) => Promise<T>,
): Promise<T> {
  const connection = await getPool().getConnection();

  try {
    return await callback(connection);
  } finally {
    connection.release();
  }
}

export async function query<T>(sql: string, values: QueryOptions["values"] = []) {
  const [rows] = await getPool().query(sql, values);
  return rows as T;
}
