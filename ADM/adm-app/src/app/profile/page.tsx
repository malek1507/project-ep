"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [followedDebates, setFollowedDebates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [avatar, setAvatar] = useState<string | null>(null);

    const [bio, setBio] = useState("");
    const [isEditingBio, setIsEditingBio] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const currentUser = JSON.parse(savedUser);
            setUser(currentUser);
            setAvatar(currentUser.avatar_url || null);
            setBio(currentUser.bio || "No bio yet. Click to add one!");

            fetch(`/api/follows?user_id=${currentUser.id}`)
                .then((res) => res.json())
                .then((data) => {
                    setFollowedDebates(Array.isArray(data) ? data : []);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const saveBio = async () => {
        setIsEditingBio(false);
        await fetch('/api/user/update-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, bio: bio }),
        });
        const updatedUser = { ...user, bio: bio };
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base = reader.result as string;
            setAvatar(base);
            await fetch('/api/user/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, image: base }),
            });
            localStorage.setItem('user', JSON.stringify({ ...user, avatar_url: base }));
        };
        reader.readAsDataURL(file);
    };

    if (loading) return <div className="p-10 text-center font-bold uppercase animate-pulse">Loading Profile...</div>;
    if (!user) return <div className="p-20 text-center"><Link href="/login">Please Login</Link></div>;

    return (
        <main className="min-h-screen bg-gray-50">
            <header className="bg-gray-900 text-white pt-20 pb-40 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-10">
                        <Link href="/" className="group flex items-center gap-2 text-gray-500 hover:text-white font-black text-xs uppercase tracking-widest transition-all">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Arena
                        </Link>

                        <Link href="/" className="bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <input type="file" id="avatarInput" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            <label htmlFor="avatarInput" className="cursor-pointer block">
                                <div className="w-32 h-32 bg-blue-600 rounded-full border-4 border-gray-800 overflow-hidden flex items-center justify-center text-4xl font-black group-hover:border-blue-500 transition-all">
                                    {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" /> : user.username[0]?.toUpperCase()}
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-black uppercase">Change</span>
                                </div>
                            </label>
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-6xl font-black uppercase italic tracking-tighter">@{user.username}</h1>

                            <div className="mt-4 max-w-md">
                                {isEditingBio ? (
                                    <div className="flex flex-col gap-2">
                                        <textarea
                                            className="bg-gray-800 text-white p-3 rounded-xl border border-gray-700 outline-none text-sm"
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            autoFocus
                                        />
                                        <button onClick={saveBio} className="bg-blue-600 text-[10px] font-black py-2 rounded-lg uppercase">Save Bio</button>
                                    </div>
                                ) : (
                                    <p onClick={() => setIsEditingBio(true)} className="text-gray-400 font-medium italic cursor-pointer hover:text-white transition-colors">
                                        "{bio}"
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="max-w-4xl mx-auto px-6 -mt-20 pb-20">
                <div className="bg-white rounded-[40px] shadow-2xl p-10 border border-gray-100">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-2xl font-black uppercase italic">My Battles</h2>
                        <span className="bg-gray-100 px-4 py-1 rounded-full text-xs font-black text-gray-500">
                            {followedDebates.length} FOLLOWING
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {followedDebates.length > 0 ? (
                            followedDebates.map((debate, index) => (
                                <Link
                                    key={`${debate.id}-${index}`}
                                    href={`/debate/${debate.id}`}
                                    className="group p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-blue-500/20 hover:bg-white hover:shadow-xl transition-all"
                                >
                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{debate.category || "General"}</span>
                                    <h3 className="text-lg font-bold text-gray-900 mt-1 group-hover:text-blue-600">{debate.title}</h3>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl">
                                <p className="text-gray-400 font-bold uppercase text-xs">The Arena is empty.</p>
                                <Link href="/" className="mt-4 inline-block text-blue-600 font-black uppercase text-[10px] tracking-widest">Explore Battles →</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}