import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Bookmark,
    FileText,
    Search,
    Sparkles,
    SquareCheck,
    Zap,
} from 'lucide-react';
import Brand from '@/components/brand';
import { HeroGraph, heroKeyframes } from '@/components/hero-graph';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Nexus — your workspace, connected">
                <style>{heroKeyframes}</style>
            </Head>

            <div className="relative min-h-screen overflow-hidden bg-[#0b1120] text-slate-100 antialiased">
                {/* Ambient background glows */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div
                        className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-[#2563eb]/20 blur-[120px]"
                        style={{
                            animation: 'nx-drift 18s ease-in-out infinite',
                        }}
                    />
                    <div
                        className="absolute top-1/3 -right-40 h-[460px] w-[460px] rounded-full bg-[#7c3aed]/20 blur-[120px]"
                        style={{
                            animation:
                                'nx-drift 22s ease-in-out infinite reverse',
                        }}
                    />
                    <div
                        className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-[#f59e0b]/10 blur-[120px]"
                        style={{
                            animation: 'nx-drift 26s ease-in-out infinite',
                        }}
                    />
                    <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage:
                                'radial-gradient(#fff 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                        }}
                    />
                </div>

                {/* Nav */}
                <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
                    <div style={{ animation: 'nx-fade-up 0.7s ease-out both' }}>
                        <Brand subtitle="WORKSPACE" />
                    </div>
                    <nav
                        className="flex items-center gap-2 text-sm"
                        style={{
                            animation: 'nx-fade-up 0.7s ease-out 0.1s both',
                        }}
                    >
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-lg bg-white px-4 py-2 font-medium text-[#0b1120] transition hover:bg-slate-200"
                            >
                                Open dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="rounded-lg px-4 py-2 font-medium text-slate-300 transition hover:text-white"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="rounded-lg bg-white px-4 py-2 font-medium text-[#0b1120] transition hover:bg-slate-200"
                                >
                                    Get started
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Hero */}
                <main className="relative z-10 mx-auto max-w-6xl px-6">
                    <div className="grid items-center gap-12 py-12 lg:grid-cols-2 lg:py-20">
                        {/* Copy */}
                        <div>
                            <div
                                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] tracking-[0.12em] text-[#93c5fd] uppercase backdrop-blur"
                                style={{
                                    animation:
                                        'nx-fade-up 0.7s ease-out 0.15s both',
                                }}
                            >
                                <Sparkles className="h-3.5 w-3.5" />
                                Notes · Tasks · Bookmarks
                            </div>

                            <h1
                                className="font-display text-4xl leading-[1.05] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
                                style={{
                                    animation:
                                        'nx-fade-up 0.7s ease-out 0.25s both',
                                }}
                            >
                                Your workspace,
                                <br />
                                <span className="bg-gradient-to-r from-[#60a5fa] via-[#a78bfa] to-[#fbbf24] bg-clip-text text-transparent">
                                    finally connected.
                                </span>
                            </h1>

                            <p
                                className="mt-6 max-w-md text-lg leading-relaxed text-slate-400"
                                style={{
                                    animation:
                                        'nx-fade-up 0.7s ease-out 0.35s both',
                                }}
                            >
                                Nexus is one calm workspace for everything you
                                think, do, and save. Capture a note, a task, or
                                a link — and watch it weave itself into a living
                                graph of your knowledge.
                            </p>

                            <div
                                className="mt-8 flex flex-wrap items-center gap-3"
                                style={{
                                    animation:
                                        'nx-fade-up 0.7s ease-out 0.45s both',
                                }}
                            >
                                <Link
                                    href={auth.user ? dashboard() : register()}
                                    className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] px-6 py-3 font-medium text-white shadow-lg shadow-[#2563eb]/30 transition hover:shadow-xl hover:shadow-[#7c3aed]/40"
                                >
                                    {auth.user
                                        ? 'Back to your nexus'
                                        : 'Start building your nexus'}
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                                {!auth.user && (
                                    <Link
                                        href={login()}
                                        className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-slate-200 backdrop-blur transition hover:bg-white/10"
                                    >
                                        I have an account
                                    </Link>
                                )}
                            </div>

                            <div
                                className="mt-10 flex items-center gap-6 text-sm text-slate-500"
                                style={{
                                    animation:
                                        'nx-fade-up 0.7s ease-out 0.55s both',
                                }}
                            >
                                <span className="inline-flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-[#fbbf24]" />{' '}
                                    Instant quick-capture
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <Search className="h-4 w-4 text-[#60a5fa]" />{' '}
                                    Search everything
                                </span>
                            </div>
                        </div>

                        {/* Animated graph */}
                        <div
                            className="relative"
                            style={{
                                animation: 'nx-fade-up 0.9s ease-out 0.3s both',
                            }}
                        >
                            <HeroGraph />
                        </div>
                    </div>

                    {/* Feature cards */}
                    <section className="grid gap-5 pb-12 sm:grid-cols-3 lg:pb-20">
                        {features.map((f, i) => (
                            <div
                                key={f.title}
                                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
                                style={{
                                    animation: `nx-fade-up 0.7s ease-out ${0.6 + i * 0.1}s both`,
                                }}
                            >
                                <div
                                    className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
                                    style={{
                                        background: `color-mix(in srgb, ${f.color} 18%, transparent)`,
                                        color: f.color,
                                    }}
                                >
                                    <f.icon className="h-5 w-5" />
                                </div>
                                <h3 className="font-display text-lg font-semibold text-white">
                                    {f.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                    {f.body}
                                </p>
                            </div>
                        ))}
                    </section>

                    {/* Connected band */}
                    <section className="relative mb-20 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-8 py-12 text-center backdrop-blur">
                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.04]"
                            style={{
                                backgroundImage:
                                    'radial-gradient(#fff 1px, transparent 1px)',
                                backgroundSize: '32px 32px',
                            }}
                        />
                        <p className="relative font-mono text-[11px] tracking-[0.22em] text-[#93c5fd] uppercase">
                            The nexus
                        </p>
                        <h2 className="relative mx-auto mt-3 max-w-2xl font-display text-2xl font-semibold text-white sm:text-3xl">
                            Every note, task, and bookmark becomes a node in
                            your personal knowledge graph.
                        </h2>
                        <p className="relative mx-auto mt-4 max-w-xl text-slate-400">
                            Stop hunting across a dozen apps. In Nexus, the
                            things you save naturally link to the things you're
                            working on — so your ideas stay one click apart.
                        </p>
                        <Link
                            href={auth.user ? dashboard() : register()}
                            className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-[#0b1120] transition hover:bg-slate-200"
                        >
                            {auth.user
                                ? 'Open your graph'
                                : 'Create your free workspace'}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </section>
                </main>

                <footer className="relative z-10 border-t border-white/5 py-8">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 sm:flex-row">
                        <Brand subtitle="WORKSPACE" />
                        <p className="font-mono text-xs tracking-wide">
                            © {new Date().getFullYear()} Nexus · Think. Do.
                            Save. Connected.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}

const features = [
    {
        icon: FileText,
        color: '#60a5fa',
        title: 'Notes that stick',
        body: 'Write freely and capture ideas the moment they strike. Full-text search means nothing ever gets lost again.',
    },
    {
        icon: SquareCheck,
        color: '#fbbf24',
        title: 'Tasks that move',
        body: 'Track what matters with priorities, due dates, and drag-to-reorder. See exactly what is up next, today.',
    },
    {
        icon: Bookmark,
        color: '#a78bfa',
        title: 'Bookmarks that connect',
        body: 'Save links once and find them in context. Every bookmark joins the graph alongside your notes and tasks.',
    },
];
