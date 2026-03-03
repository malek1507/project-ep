import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) return NextResponse.json([]);

    try {
        const [rows]: any = await db.query(`
            SELECT 
                debates.id, 
                debates.title, 
                debates.category
            FROM follows
            INNER JOIN debates ON follows.following_debate_id = debates.id
            WHERE follows.follower_id = ?
        `, [userId]);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("GET Follows Error:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { user_id, debate_id } = await request.json();

        await db.query(
            `INSERT IGNORE INTO follows (follower_id, following_debate_id) VALUES (?, ?)`,
            [user_id, debate_id]
        );
        return NextResponse.json({ message: "Followed successfully" });
    } catch (error) {
        console.error("POST Follow Error:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user_id');
        const debateId = searchParams.get('debate_id');

        const [result]: any = await db.query(
            `DELETE FROM follows WHERE follower_id = ? AND following_debate_id = ?`,
            [userId, debateId]
        );

        return NextResponse.json({ message: "Unfollowed successfully" });
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}