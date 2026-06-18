import { Link } from '@inertiajs/react';
import { Bookmark, FileText, SquareCheck } from 'lucide-react';
import Brand from '@/components/brand';
import { HeroGraph, heroKeyframes } from '@/components/hero-graph';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const HIGHLIGHTS = [
    { icon: FileText, color: '#60a5fa', label: 'Notes' },
    { icon: SquareCheck, color: '#fbbf24', label: 'Tasks' },
    { icon: Bookmark, color: '#a78bfa', label: 'Bookmarks' },
];

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <style>{heroKeyframes}</style>

            {/* Brand panel */}
            <div className="relative hidden overflow-hidden bg-[#0b1120] text-slate-100 lg:flex lg:flex-col">
                {/* Ambient glows */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div
                        className="absolute -top-40 -left-40 h-[460px] w-[460px] rounded-full bg-[#2563eb]/20 blur-[120px]"
                        style={{
                            animation: 'nx-drift 18s ease-in-out infinite',
                        }}
                    />
                    <div
                        className="absolute -right-40 bottom-0 h-[440px] w-[440px] rounded-full bg-[#7c3aed]/20 blur-[120px]"
                        style={{
                            animation:
                                'nx-drift 22s ease-in-out infinite reverse',
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

                <div className="relative z-10 flex h-full flex-col p-10">
                    <Link
                        href={home()}
                        style={{ animation: 'nx-fade-up 0.7s ease-out both' }}
                    >
                        <Brand subtitle="WORKSPACE" />
                    </Link>

                    <div className="flex flex-1 flex-col justify-center">
                        <div
                            style={{
                                animation: 'nx-fade-up 0.9s ease-out 0.2s both',
                            }}
                        >
                            <HeroGraph className="mx-auto w-full max-w-md" />
                        </div>

                        <div
                            className="mt-6 text-center"
                            style={{
                                animation: 'nx-fade-up 0.7s ease-out 0.4s both',
                            }}
                        >
                            <h2 className="font-display text-2xl font-semibold text-white">
                                Your second brain, connected.
                            </h2>
                            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
                                One calm workspace for everything you think, do,
                                and save — woven into a living graph of your
                                knowledge.
                            </p>
                        </div>
                    </div>

                    <div
                        className="flex items-center justify-center gap-6"
                        style={{
                            animation: 'nx-fade-up 0.7s ease-out 0.55s both',
                        }}
                    >
                        {HIGHLIGHTS.map((h) => (
                            <span
                                key={h.label}
                                className="inline-flex items-center gap-2 text-sm text-slate-400"
                            >
                                <h.icon
                                    className="h-4 w-4"
                                    style={{ color: h.color }}
                                />
                                {h.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form panel */}
            <div className="flex flex-col items-center justify-center bg-background p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-8">
                        {/* Brand shows on small screens where the panel is hidden */}
                        <Link
                            href={home()}
                            className="flex justify-center lg:hidden"
                        >
                            <span className="rounded-xl bg-[#0b1120] px-4 py-3">
                                <Brand subtitle="WORKSPACE" />
                            </span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
                                {title}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {description}
                            </p>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
