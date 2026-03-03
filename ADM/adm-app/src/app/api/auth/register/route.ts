import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, email, password } = body;

        if (!username || !email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("Attempting to insert user:", username); 

        const [result]: any = await db.query(
            'INSERT INTO profiles (username, email, password, reputation) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, 0]
        );

        console.log("MySQL Result:", result); 

        return NextResponse.json({ message: "User created!", userId: result.insertId });
    } catch (error: any) {
        console.error("REGISTRATION ERROR:", error);

        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: "Username or Email already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Database error. Check your console." }, { status: 500 });
    }
}