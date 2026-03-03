"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 1. Make sure "export default" is right here!
export default function RegisterPage() {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        // Log the raw text to see if it's HTML or JSON
        const text = await res.text();
        console.log("Raw response:", text);

        try {
            const data = JSON.parse(text);
            if (res.ok) {
                alert("Account created!");
                router.push('/login');
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error("The server sent back something that wasn't JSON:", text);
            alert("Server error! Check your terminal.");
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-black mb-6 text-center text-gray-800 tracking-tight">Join ADM</h1>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold uppercase text-gray-400 ml-1">Username</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. DebateKing"
                            className="w-full p-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={e => setForm({ ...form, username: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-gray-400 ml-1">Email</label>
                        <input
                            required
                            type="email"
                            placeholder="name@email.com"
                            className="w-full p-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-gray-400 ml-1">Password</label>
                        <input
                            required
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={e => setForm({ ...form, password: e.target.value })}
                        />
                    </div>
                    <button className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg mt-4">
                        Create Account
                    </button>
                    <p className="text-gray-600 text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 font-bold hover:underline">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </form>
        </main>
    );
}