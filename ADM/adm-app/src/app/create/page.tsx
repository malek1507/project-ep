"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateDebate() {
    const [title, setTitle] = useState("");
    const [context, setContext] = useState("");
    const [category, setCategory] = useState("Politics");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const savedUser = localStorage.getItem('user');
        if (!savedUser) return alert("Please log in first!");

        const user = JSON.parse(savedUser);
        setLoading(true);

        try {
            const res = await fetch('/api/debates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    context,
                    category,
                    creator_id: user.id
                }),
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/debate/${data.id}`);
            }
        } catch (err) {
            alert("Error creating debate");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white rounded-[40px] shadow-2xl p-12 border border-gray-100">
                <Link href="/" className="text-gray-400 hover:text-black font-black text-xs uppercase tracking-widest mb-8 block transition-colors">
                    ← Cancel
                </Link>

                <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-10 leading-none">
                    Start a <span className="text-blue-600">New Battle</span>
                </h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-gray-100 border-none rounded-2xl p-4 font-bold text-gray-900 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        >
                            <option>Politics</option>
                            <option>Technology</option>
                            <option>Sports</option>
                            <option>Philosophy</option>
                            <option>Gaming</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">The Question / Title</label>
                        <input
                            required
                            placeholder="Is AI better than humans at art?"
                            className="w-full bg-gray-100 border-none rounded-2xl p-5 text-xl font-bold text-gray-900 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-300"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">The Context</label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Provide some background info to set the stage..."
                            className="w-full bg-gray-100 border-none rounded-2xl p-5 text-lg font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-gray-900 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.3em] hover:bg-blue-600 hover:-translate-y-1 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                    >
                        {loading ? "Creating Battleground..." : "Deploy Debate"}
                    </button>
                </form>
            </div>
        </main>
    );
}