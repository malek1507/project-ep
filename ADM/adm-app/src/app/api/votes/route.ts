import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { userId, argumentId, voteType, authorId } = await request.json();

        const dbVoteType = voteType === 'up' ? 'like' : 'dislike';

        const [existing]: any = await db.query(
            'SELECT vote_type FROM votes WHERE user_id = ? AND argument_id = ?',
            [userId, argumentId]
        );

        if (existing.length > 0 && existing[0].vote_type === dbVoteType) {
            await db.query(
                'DELETE FROM votes WHERE user_id = ? AND argument_id = ?',
                [userId, argumentId]
            );

            const repReverse = dbVoteType === 'like' ? -5 : 2;
            await db.query(
                'UPDATE profiles SET reputation = reputation + ? WHERE id = ?',
                [repReverse, authorId]
            );

            return NextResponse.json({ success: true, action: 'unvoted' });
        }

        await db.query(`
            INSERT INTO votes (user_id, argument_id, vote_type) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE vote_type = VALUES(vote_type)
        `, [userId, argumentId, dbVoteType]);

        const repChange = dbVoteType === 'like' ? 5 : -2;
        await db.query(
            `UPDATE profiles SET reputation = reputation + ? WHERE id = ?`,
            [repChange, authorId]
        );

        return NextResponse.json({ success: true, action: 'voted' });
    } catch (error: any) {
        console.error("VOTE ERROR:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}