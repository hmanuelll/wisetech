import pg from 'pg';

const isProduction = process.env.NODE_ENV === 'production';
const hasDatabaseUrl = !!process.env.DATABASE_URL;

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  host: hasDatabaseUrl ? undefined : (process.env.DB_HOST || 'localhost'),
  user: hasDatabaseUrl ? undefined : (process.env.DB_USER || 'root'),
  password: hasDatabaseUrl ? undefined : (process.env.DB_PASSWORD || ''),
  database: hasDatabaseUrl ? undefined : (process.env.DB_NAME || 'wisetech'),
  port: hasDatabaseUrl ? undefined : parseInt(process.env.DB_PORT || '5432'),
  ssl: hasDatabaseUrl ? { rejectUnauthorized: false } : undefined,
  max: 10,
});

export default pool;
