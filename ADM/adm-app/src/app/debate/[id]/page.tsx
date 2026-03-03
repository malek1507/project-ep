"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DebatePage() {
    const params = useParams();
    const [debate, setDebate] = useState<any>(null);
    const [content, setContent] = useState("");
    const [side, setSide] = useState("pro");
    const [loading, setLoading] = useState(false);
    const [argumentsList, setArgumentsList] = useState<any[]>([]);
    const [isFollowing, setIsFollowing] = useState(false);

    const [sortBy, setSortBy] = useState<'top' | 'new'>('top');

    const fetchData = async () => {
        try {
            const debateRes = await fetch(`/api/debates/${params.id}`);
            const debateData = await debateRes.json();
            setDebate(debateData);

            const savedUser = localStorage.getItem('user');
            const currentUser = savedUser ? JSON.parse(savedUser) : null;
            const currentUserId = currentUser ? currentUser.id : 0;

            const argsRes = await fetch(
                `/api/arguments?debate_id=${params.id}&user_id=${currentUserId}&sort=${sortBy}`
            );
            const argsData = await argsRes.json();
            setArgumentsList(argsData);

            if (currentUser) {
                const checkRes = await fetch(`/api/follows/check?user_id=${currentUser.id}&debate_id=${params.id}`);
                const checkData = await checkRes.json();
                setIsFollowing(!!checkData.isFollowing);
            }
        } catch (error) {
            console.error("Initialization error:", error);
        }
    };

    useEffect(() => {
        if (params.id) fetchData();
    }, [params.id, sortBy]);

    const handleVote = async (argId: number, type: 'up' | 'down', authorId: number) => {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) return alert("Please log in to vote!");
        const currentUser = JSON.parse(savedUser);

        if (!authorId) return alert("Error: Could not find the author.");
        if (Number(currentUser.id) === Number(authorId)) {
            return alert("You can't vote on your own argument!");
        }

        try {
            const res = await fetch('/api/votes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.id,
                    argumentId: argId,
                    voteType: type,
                    authorId: authorId
                }),
            });

            if (res.ok) {
                fetchData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleFollow = async () => {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) return alert("Please log in!");
        const currentUser = JSON.parse(savedUser);
        const uID = currentUser.id;
        const dID = params.id;

        try {
            if (isFollowing) {
                await fetch(`/api/follows?user_id=${uID}&debate_id=${dID}`, { method: 'DELETE' });
            } else {
                await fetch(`/api/follows`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: uID, debate_id: dID })
                });
            }
            setIsFollowing(!isFollowing);
        } catch (err) {
            console.error("Follow toggle failed:", err);
        }
    };

    const handleSubmitArgument = async (e: React.FormEvent) => {
        e.preventDefault();
        const savedUser = localStorage.getItem('user');
        if (!savedUser) return alert("Please log in!");
        if (!content.trim()) return;

        const currentUser = JSON.parse(savedUser);
        setLoading(true);

        try {
            const response = await fetch('/api/arguments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    debate_id: params.id,
                    content: content,
                    side: side,
                    user_id: currentUser.id
                }),
            });

            if (response.ok) {
                fetchData();
                setContent("");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!debate) return <div className="p-10 text-center font-bold uppercase tracking-widest animate-pulse">Loading ...</div>;

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-gray-900 text-white pt-16 pb-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <nav className="flex gap-4 mb-10 text-xs font-bold uppercase tracking-widest">
                        <Link href="/" className="text-gray-500 hover:text-white transition">← Home</Link>
                        <span className="text-gray-800">|</span>
                        <Link href="/profile" className="text-gray-500 hover:text-white transition">Profile</Link>
                    </nav>
                    <div className="max-w-4xl">
                        <span className="text-blue-500 font-black uppercase text-xs tracking-[0.3em] bg-blue-500/10 px-3 py-1 rounded">
                            {debate.category || "General"}
                        </span>
                        <h1 className="text-6xl font-black mt-6 mb-4 tracking-tighter uppercase italic leading-none">
                            {debate.title}
                        </h1>
                        <p className="text-gray-400 text-xl leading-relaxed max-w-2xl mb-8">
                            {debate.context || debate.description}
                        </p>
                        <button
                            onClick={handleFollow}
                            className={`px-10 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all ${isFollowing
                                ? "bg-white/10 text-white border border-white/20 hover:bg-red-500/20"
                                : "bg-blue-600 hover:bg-blue-500 text-white"
                                }`}
                        >
                            {isFollowing ? "✓ Following" : "+ Follow Debate"}
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl w-full mx-auto px-6 -mt-16 relative z-10">
                <section className="bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">
                    <form onSubmit={handleSubmitArgument} className="space-y-6">
                        <textarea
                            className="w-full p-5 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-gray-800 bg-gray-50 transition-all text-lg"
                            rows={3}
                            placeholder="What is your stance?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex bg-gray-100 p-1 rounded-2xl w-full md:w-72">
                                <button type="button" onClick={() => setSide('pro')} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition ${side === 'pro' ? 'bg-white shadow-sm text-green-600' : 'text-gray-400'}`}>PRO</button>
                                <button type="button" onClick={() => setSide('neutral')} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition ${side === 'neutral' ? 'bg-white shadow-sm text-gray-600' : 'text-gray-400'}`}>NEUTRAL</button>
                                <button type="button" onClick={() => setSide('con')} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition ${side === 'con' ? 'bg-white shadow-sm text-red-600' : 'text-gray-400'}`}>CON</button>
                            </div>
                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full md:w-auto bg-gray-900 text-white px-12 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? "POSTING..." : "POST ARGUMENT"}
                            </button>
                        </div>
                    </form>
                </section>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 pt-12 flex justify-end">
                <div className="flex bg-gray-200 p-1 rounded-xl gap-1 shadow-inner">
                    <button
                        onClick={() => setSortBy('top')}
                        className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${sortBy === 'top' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        TOP
                    </button>
                    <button
                        onClick={() => setSortBy('new')}
                        className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${sortBy === 'new' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        NEW
                    </button>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 py-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    <Column title="PRO" side="pro" list={argumentsList} color="green" onVote={handleVote} />
                    <Column title="NEUTRAL" side="neutral" list={argumentsList} color="gray" onVote={handleVote} />
                    <Column title="CON" side="con" list={argumentsList} color="red" onVote={handleVote} />
                </div>
            </div>
        </main>
    );
}

function Column({ title, side, list, color, onVote }: any) {
    const filtered = list.filter((a: any) => a.side === side);
    const style = {
        green: { border: "border-green-500", text: "text-green-600" },
        gray: { border: "border-gray-400", text: "text-gray-500" },
        red: { border: "border-red-500", text: "text-red-600" }
    }[color as 'green' | 'gray' | 'red'] || { border: "border-gray-400", text: "text-gray-500" };

    return (
        <div className="flex flex-col gap-8">
            <div className={`border-b-4 ${style.border} pb-4 flex justify-between items-center`}>
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">{title}</h2>
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-xs font-black">{filtered.length}</span>
            </div>
            <div className="space-y-4">
                {filtered.map((arg: any) => (
                    <div key={arg.id} className="p-5 rounded-2xl bg-white shadow-sm border border-gray-100 transition-all duration-300">
                        <div className="flex items-center gap-2 mb-3">
                            <span className={`text-[11px] font-black uppercase tracking-tight ${style.text}`}>@{arg.username || 'Anonymous'}</span>
                            <span className="text-[10px] text-gray-300">•</span>
                            <span className="text-[10px] text-gray-400 font-bold">
                                {arg.created_at ? new Date(arg.created_at).toLocaleDateString() : 'Just now'}
                            </span>
                        </div>

                        <p className="text-gray-700 leading-snug text-sm mb-4">{arg.content}</p>

                        <div className="flex items-center gap-1 bg-gray-100 w-fit px-2 py-1 rounded-xl relative z-30">
                            <button
                                type="button"
                                onClick={() => onVote(arg.id, 'up', arg.user_id)}
                                className="p-1 hover:bg-gray-200 rounded-md transition-all group cursor-pointer active:scale-90"
                            >
                                <svg viewBox="0 0 24 24" className={`w-5 h-5 fill-current transition-colors 
                                    ${arg.user_vote === 'like' ? 'text-[#FF4500]' : 'text-gray-400 group-hover:text-[#FF4500]'}`}>
                                    <path d="M12 4L4 12h5v8h6v-8h5z" />
                                </svg>
                            </button>

                            <span className={`text-[11px] font-black px-1 min-w-[24px] text-center select-none 
                                ${arg.user_vote === 'like' ? 'text-[#FF4500]' : arg.user_vote === 'dislike' ? 'text-[#7193FF]' : 'text-gray-600'}`}>
                                {arg.vote_count || 0}
                            </span>

                            <button
                                type="button"
                                onClick={() => onVote(arg.id, 'down', arg.user_id)}
                                className="p-1 hover:bg-gray-200 rounded-md transition-all group cursor-pointer active:scale-90"
                            >
                                <svg viewBox="0 0 24 24" className={`w-5 h-5 fill-current transition-colors 
                                    ${arg.user_vote === 'dislike' ? 'text-[#7193FF]' : 'text-gray-400 group-hover:text-[#7193FF]'}`}>
                                    <path d="M12 20l8-8h-5V4H9v8H4z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}