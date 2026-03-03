"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [debates, setDebates] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    fetch('/api/debates')
      .then((res) => res.json())
      .then((data) => setDebates(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  const trending = [...debates]
    .sort((a, b) => (b.argument_count || 0) - (a.argument_count || 0))
    .slice(0, 2);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      <nav className="border-b border-white/5 sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-6 h-6 bg-indigo-500 rounded-sm rotate-45 group-hover:rotate-180 transition-all duration-700" />
            <h1 className="text-xl font-black tracking-widest uppercase italic text-white">ADM</h1>
          </Link>

          <div className="flex items-center gap-10">
            {user ? (
              <>
                <Link href="/profile" className="flex items-center gap-4 hover:opacity-80 transition group">
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Verified User</p>
                    <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">@{user.username}</p>
                  </div>
                  <img src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.username}`} className="w-10 h-10 rounded-full border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]" alt="" />
                </Link>
                <button onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-400 transition">Logout</button>
                <Link href="/create">
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                    New Debate
                  </button>
                </Link>
              </>
            ) : (
              <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-white border-b-2 border-indigo-500 pb-1 hover:text-indigo-400 transition">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-48 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-indigo-600/10 blur-[160px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.5em] mb-6 block animate-pulse">Global Intellectual Exchange</span>
            <h2 className="text-8xl font-black tracking-tighter uppercase italic leading-[0.8] text-white">
              Clash of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Perspectives.</span>
            </h2>
            <p className="text-slate-400 mt-10 text-xl leading-relaxed max-w-xl font-light">
              A high-fidelity platform for rigorous discourse. Engage in structured debate, earn reputation, and refine your logic.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 -mt-24 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trending.map(d => (
            <Link href={`/debate/${d.id}`} key={d.id} className="group bg-slate-900/40 backdrop-blur-sm border border-white/5 p-8 flex items-center justify-between hover:bg-slate-900/80 hover:border-indigo-500/50 transition-all duration-500">
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">Trending Battle</p>
                <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight">{d.title}</h3>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-white italic">/{d.argument_count || 0}</p>
                <p className="text-[9px] uppercase tracking-widest text-slate-500">Insights</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-40">
        <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-6">
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Open Discussions</h3>
          <p className="text-[10px] font-mono text-slate-600">Viewing {debates.length} Active Records</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {debates.map((debate) => (
            <Link href={`/debate/${debate.id}`} key={debate.id} className="group bg-slate-900/20 border border-white/5 p-10 hover:bg-indigo-600/[0.03] hover:border-indigo-500/30 transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-0 bg-indigo-500 group-hover:h-full transition-all duration-500" />

              <div className="flex justify-between items-start mb-16">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400 border border-indigo-500/20 px-2 py-1">
                  {debate.category}
                </span>
                <span className="text-[10px] font-mono text-slate-600 uppercase italic">
                  ID: 00{debate.id}
                </span>
              </div>

              <h4 className="text-3xl font-black tracking-tighter uppercase italic leading-none mb-6 text-white group-hover:text-indigo-400 transition-colors">
                {debate.title}
              </h4>

              <p className="text-slate-500 text-sm leading-relaxed mb-12 font-light line-clamp-2">
                {debate.description || debate.context}
              </p>

              <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <div className="flex flex-col gap-1">
                  <span className="text-white text-lg font-mono">{(debate.argument_count || 0).toString().padStart(2, '0')}</span>
                  <span>Intel</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white text-lg font-mono">{(debate.follow_count || 0).toString().padStart(2, '0')}</span>
                  <span>Observers</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/5 py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <div className="w-10 h-1 border-t-2 border-indigo-500" />
          <p className="text-[10px] font-black uppercase tracking-[1em] text-slate-600">The Final Word</p>
        </div>
      </footer>
    </main>
  );
}