"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (res.ok) {
            // SUCCESS: Save user info to localStorage so the app remembers us
            localStorage.setItem('user', JSON.stringify(data.user));
            alert(`Welcome back, ${data.user.username}!`);
            router.push('/'); // Redirect to home page
        } else {
            alert(data.error);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <h1 className="text-3xl font-black mb-2 text-center text-blue-600">ADM</h1>
                <p className="text-center text-gray-500 mb-8 text-sm">Sign in to join the debate</p>

                <div className="space-y-4">
                    <input
                        type="email" placeholder="Email Address"
                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                    <input
                        type="password" placeholder="Password"
                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={e => setForm({ ...form, password: e.target.value })}
                    />
                    <button className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition">
                        Log In
                    </button>
                </div>
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-blue-600 font-bold hover:underline">
                            Create one here
                        </Link>
                    </p>
                </div>
            </form>
        </main>
    );
}