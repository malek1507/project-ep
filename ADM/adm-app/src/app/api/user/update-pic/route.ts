import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { userId, image } = await request.json();

        await db.query(
            `UPDATE users SET avatar_url = ? WHERE id = ?`,
            [image, userId]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update photo" }, { status: 500 });
    }
}