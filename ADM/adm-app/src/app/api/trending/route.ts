import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
  
export async function GET() {
    try {
        const query = `
      SELECT d.*, 
        (SELECT COUNT(*) FROM arguments WHERE debate_id = d.id) AS argument_count,
        (SELECT COUNT(*) FROM follows WHERE following_debate_id = d.id) AS follow_count
      FROM debates d
      ORDER BY argument_count DESC
      LIMIT 3
    `;

        const [rows] = await db.query(query);
        return NextResponse.json(rows);
    } catch (error: any) {
        console.error("Trending API Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}