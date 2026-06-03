import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const brand = searchParams.get('brand') || '';
  const ram = searchParams.get('ram') || '';
  const storage = searchParams.get('storage') || '';
  const sort = searchParams.get('sort') || '';

  try {
    let query = 'SELECT * FROM products WHERE 1=1';
    let params = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex + 1})`;
      params.push(`%${search}%`, `%${search}%`);
      paramIndex += 2;
    }

    if (brand) {
      query += ` AND brand = $${paramIndex}`;
      params.push(brand);
      paramIndex++;
    }

    if (ram) {
      query += ` AND specs::text ILIKE $${paramIndex}`;
      params.push(`%${ram}%`);
      paramIndex++;
    }
    
    if (storage) {
      query += ` AND specs::text ILIKE $${paramIndex}`;
      params.push(`%${storage}%`);
      paramIndex++;
    }

    if (sort === 'price_asc') {
      query += ' ORDER BY price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY price DESC';
    } else if (sort === 'newest') {
      query += ' ORDER BY created_at DESC';
    } else {
      query += ' ORDER BY id DESC';
    }

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Database query failed:", error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
