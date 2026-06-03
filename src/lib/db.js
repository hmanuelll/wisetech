import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  host: process.env.DATABASE_URL ? undefined : (process.env.DB_HOST || 'localhost'),
  user: process.env.DATABASE_URL ? undefined : (process.env.DB_USER || 'root'),
  password: process.env.DATABASE_URL ? undefined : (process.env.DB_PASSWORD || ''),
  database: process.env.DATABASE_URL ? undefined : (process.env.DB_NAME || 'wisetech'),
  port: process.env.DATABASE_URL ? undefined : parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  max: 10,
});

export default pool;
