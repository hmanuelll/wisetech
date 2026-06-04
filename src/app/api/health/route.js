import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await pool.query('SELECT NOW()');
    return NextResponse.json({ 
      status: 'success', 
      message: 'Database connected successfully!',
      time: result.rows[0].now,
      env_check: {
        has_database_url: !!process.env.DATABASE_URL,
        database_url_length: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
        node_env: process.env.NODE_ENV
      }
    });
  } catch (error) {
    console.error('Health Check Error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to connect to the database',
      error: error.message,
      env_check: {
        has_database_url: !!process.env.DATABASE_URL,
        database_url_length: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
        node_env: process.env.NODE_ENV
      }
    }, { status: 500 });
  }
}
