import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear the session cookie
  response.cookies.set({
    name: 'wisetech_session',
    value: '',
    path: '/',
    expires: new Date(0) // Expire immediately
  });

  return response;
}
