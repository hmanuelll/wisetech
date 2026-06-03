import pool from '@/lib/db';
import { NextResponse } from 'next/server';

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

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (brand) {
      query += ' AND brand = ?';
      params.push(brand);
    }

    if (ram) {
      // Using JSON_EXTRACT to search inside the specs column for RAM
      // MySQL 5.7+ supports JSON functions
      query += ` AND specs LIKE ?`;
      params.push(`%${ram}%`); // Simple LIKE search on the JSON string is often enough for simple specs
    }
    
    if (storage) {
      query += ` AND specs LIKE ?`;
      params.push(`%${storage}%`);
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

    const [rows] = await pool.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database query failed:", error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
