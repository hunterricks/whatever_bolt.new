import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SomeModel from '@/models/SomeModel';

export async function GET() {
  try {
    await dbConnect();
    const items = await SomeModel.find({});
    return NextResponse.json(items);
  } catch (_error) {
    console.error('API route error:', _error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
