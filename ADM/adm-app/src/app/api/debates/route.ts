import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT 
        d.*, 
        (SELECT COUNT(*) FROM arguments WHERE debate_id = d.id) AS argument_count,
        (SELECT COUNT(*) FROM follows WHERE following_debate_id = d.id) AS follow_count
      FROM debates d
      ORDER BY d.created_at DESC
    `;

    const [rows] = await db.query(query);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Home API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, context, category, creator_id } = await request.json();

    if (!title || !context) {
      return NextResponse.json({ error: "Title and Context are required" }, { status: 400 });
    }

    const [result]: any = await db.query(
      `INSERT INTO debates (title, context, category, creator_id) VALUES (?, ?, ?, ?)`,
      [title, context, category || "General", creator_id]
    );

    return NextResponse.json({ id: result.insertId, message: "Debate created!" });
  } catch (error: any) {
    console.error("Create Debate API Error:", error.message);
    return NextResponse.json({ error: "Failed to create debate" }, { status: 500 });
  }
}