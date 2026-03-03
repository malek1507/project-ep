import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    try {
        // Updated query to include counts for arguments and follows
        const query = `
            SELECT 
                d.*, 
                (SELECT COUNT(*) FROM arguments WHERE debate_id = d.id) AS argument_count,
                (SELECT COUNT(*) FROM follows WHERE following_debate_id = d.id) AS follow_count
            FROM debates d 
            WHERE d.id = ?
        `;

        const [rows]: any = await db.query(query, [id]);

        if (rows.length === 0) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        // Return the first row which now includes argument_count and follow_count
        return NextResponse.json(rows[0]);
    } catch (error: any) {
        console.error("Detail API Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}