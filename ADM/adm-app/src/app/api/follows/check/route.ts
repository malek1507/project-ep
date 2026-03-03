import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const debateId = searchParams.get('debate_id');

    if (!userId || !debateId) {
        return NextResponse.json({ isFollowing: false });
    }

    try {
        // Updated to use your specific column: following_debate_id
        const [rows]: any = await db.query(
            `SELECT 1 FROM follows WHERE follower_id = ? AND following_debate_id = ?`,
            [userId, debateId]
        );

        return NextResponse.json({ isFollowing: rows.length > 0 });

    } catch (error) {
        return NextResponse.json({ isFollowing: false });
    }
}
export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Use destructuring to be safe
        const { user_id, debate_id } = body;

        console.log("Attempting follow for:", { user_id, debate_id });

        // IMPORTANT: Ensure your DB columns are exactly follower_id and following_debate_id
        await db.query(
            `INSERT IGNORE INTO follows (follower_id, following_debate_id) VALUES (?, ?)`,
            [user_id, debate_id]
        );

        return NextResponse.json({ success: true, message: "Followed successfully" });
    } catch (error: any) {
        console.error("POST Follow Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}