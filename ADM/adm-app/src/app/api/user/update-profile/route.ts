import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { userId, image, bio } = await request.json();

        await db.query(
            `UPDATE users SET avatar_url = COALESCE(?, avatar_url), bio = COALESCE(?, bio) WHERE id = ?`,
            [image, bio, userId]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}