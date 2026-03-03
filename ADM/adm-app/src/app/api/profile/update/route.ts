import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { user_id, bio, avatar_url } = await req.json();

        await db.query(
            'UPDATE profiles SET bio = ?, avatar_url = ? WHERE id = ?',
            [bio, avatar_url, user_id]
        );

        return NextResponse.json({ message: "Profile updated successfully" });
    } catch (error: any) {
        console.error("Update Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}