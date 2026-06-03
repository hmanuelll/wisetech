import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    const { action } = data;

    if (action === 'delete') {
      await pool.query('DELETE FROM products WHERE id = $1', [data.id]);
      return NextResponse.json({ success: true });
    }

    if (action === 'create') {
      const { name, brand, price, description, stock } = data.product;
      const specs = JSON.stringify(data.product.specs || {});
      await pool.query(
        'INSERT INTO products (name, brand, price, description, specs, stock) VALUES ($1, $2, $3, $4, $5, $6)',
        [name, brand, price, description, specs, stock]
      );
      return NextResponse.json({ success: true });
    }

    if (action === 'update') {
      const { id, name, brand, price, description, stock } = data.product;
      const specs = JSON.stringify(data.product.specs || {});
      await pool.query(
        'UPDATE products SET name=$1, brand=$2, price=$3, description=$4, specs=$5, stock=$6 WHERE id=$7',
        [name, brand, price, description, specs, stock, id]
      );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    console.error("Admin API Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
