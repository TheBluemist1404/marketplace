import "server-only";

import mysql, { type Pool, type PoolConnection, type QueryOptions } from "mysql2/promise";

let pool: Pool | null = null;

const SESSION_SQL_MODE = "STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION";

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

async function prepareConnection(connection: PoolConnection): Promise<void> {
  await connection.query(`SET SESSION sql_mode = '${SESSION_SQL_MODE}'`);
}

export async function withConnection<T>(
  callback: (connection: PoolConnection) => Promise<T>,
): Promise<T> {
  const connection = await getPool().getConnection();

  try {
    await prepareConnection(connection);
    return await callback(connection);
  } finally {
    connection.release();
  }
}

export async function query<T>(sql: string, values: QueryOptions["values"] = []) {
  return withConnection(async (connection) => {
    const [rows] = await connection.query(sql, values);
    return rows as T;
  });
}
