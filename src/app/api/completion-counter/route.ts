import { NextResponse } from 'next/server';
let count = 0; // In-memory storage for the example (you can replace it with a database).

// GET Request: to fetch the current count
export async function GET() {
  return NextResponse.json({ count });
}

// POST Request: to increment the count
export async function POST() {
  count += 1;
  return NextResponse.json({ count });
}
