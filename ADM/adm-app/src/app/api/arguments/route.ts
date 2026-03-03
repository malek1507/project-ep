import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { debate_id, user_id, content, side } = await req.json();
        if (!user_id) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

        const [result]: any = await db.query(
            'INSERT INTO arguments (debate_id, user_id, content, side) VALUES (?, ?, ?, ?)',
            [debate_id, user_id, content, side]
        );
        return NextResponse.json({ message: "Argument created!", id: result.insertId });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const debate_id = searchParams.get('debate_id');
        const user_id = searchParams.get('user_id');
        const sort = searchParams.get('sort') || 'top';

        if (!debate_id) return NextResponse.json({ error: "Required fields missing" }, { status: 400 });

        const orderBy = sort === 'top'
            ? 'vote_count DESC, a.created_at DESC'
            : 'a.created_at DESC';

        const query = `
            SELECT 
                a.*, 
                p.username,
                (SELECT COALESCE(SUM(CASE WHEN v.vote_type = 'like' THEN 1 WHEN v.vote_type = 'dislike' THEN -1 ELSE 0 END), 0)
                 FROM votes v WHERE v.argument_id = a.id) AS vote_count,
                (SELECT v.vote_type FROM votes v WHERE v.argument_id = a.id AND v.user_id = ?) AS user_vote
            FROM arguments a
            LEFT JOIN profiles p ON a.user_id = p.id
            WHERE a.debate_id = ?
            ORDER BY ${orderBy}
        `;

        const [rows]: any = await db.query(query, [user_id || 0, debate_id]);
        return NextResponse.json(rows || []);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}