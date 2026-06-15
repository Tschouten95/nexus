import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Bookmark, Check, FileText, Plus, SquareCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NexusGraph, { type GraphLink, type GraphNode } from '@/components/dashboard/nexus-graph';
import StatCard from '@/components/dashboard/stat-card';
import CreateNoteModal from '@/components/notes/create-note-modal';
import { dashboard } from '@/routes';
import { index as notesIndex } from '@/routes/notes';
import { index as tasksIndex } from '@/routes/tasks';
import { index as bookmarksIndex } from '@/routes/bookmarks';
import type { Auth } from '@/types';

interface Stats {
    notes: number;
    notesWeek: number;
    tasksOpen: number;
    tasksDueToday: number;
    tasksWeek: number;
    bookmarks: number;
    bookmarksWeek: number;
}

interface RecentNote {
    id: number;
    title: string;
    updated_at: string;
    word_count: number;
}

interface UpNextTask {
    id: number;
    title: string;
    status: string;
    priority: string;
    due_date: string | null;
}

interface SavedBookmark {
    id: number;
    title: string;
    url: string;
}

interface Props {
    stats: Stats;
    recentNotes: RecentNote[];
    upNext: UpNextTask[];
    savedLately: SavedBookmark[];
    graph: { nodes: GraphNode[]; links: GraphLink[] };
}

function greeting(hour: number) {
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
}

function timeAgo(iso: string) {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (Math.abs(mins) < 60) return rtf.format(-mins, 'minute');
    const hrs = Math.round(mins / 60);
    if (Math.abs(hrs) < 24) return rtf.format(-hrs, 'hour');
    return rtf.format(-Math.round(hrs / 24), 'day');
}

function dueLabel(iso: string | null) {
    if (!iso) return null;
    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const days = Math.round((startOfDay(new Date(iso)) - startOfDay(new Date())) / 86_400_000);
    if (days === 0) return 'today';
    if (days === 1) return 'tomorrow';
    if (days === -1) return 'yesterday';
    if (days < 0) return `${-days}d overdue`;
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function hostname(url: string) {
    try { return new URL(url).hostname.replace(/^www\./, ''); }
    catch { return url; }
}

function Panel({ title, accent, href, children }: { title: string; accent: string; href: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
                    <h2 className="font-display text-sm font-semibold text-ink">{title}</h2>
                </div>
                <Link href={href} className="text-xs font-medium text-mark hover:underline">All</Link>
            </div>
            {children}
        </div>
    );
}

export default function Dashboard({ stats, recentNotes, upNext, savedLately, graph }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [captureOpen, setCaptureOpen] = useState(false);

    const now = new Date();
    const firstName = auth.user.name.split(' ')[0];
    const dateLabel = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase();
    const addedThisWeek = stats.notesWeek + stats.tasksWeek + stats.bookmarksWeek;

    const dueText = stats.tasksDueToday === 0
        ? 'No open tasks are due today'
        : `${stats.tasksDueToday} open ${stats.tasksDueToday === 1 ? 'task is' : 'tasks are'} due today`;

    return (
        <div className="mx-auto max-w-6xl px-6 py-8">
            <Head title="Dashboard" />

            {/* Header */}
            <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mark">{dateLabel}</p>
                    <h1 className="mt-1 font-display text-[28px] font-semibold tracking-tight text-ink">
                        Good {greeting(now.getHours())}, {firstName}.
                    </h1>
                    <p className="mt-1 text-sm text-muted">
                        {dueText} and you've added {addedThisWeek} {addedThisWeek === 1 ? 'thing' : 'things'} to your nexus this week.
                    </p>
                </div>

                <Button
                    onClick={() => setCaptureOpen(true)}
                    variant="outline"
                    className="gap-2 border-border bg-card text-ink shadow-sm hover:bg-accent"
                >
                    <Plus className="h-4 w-4" />
                    Quick capture
                </Button>
            </div>

            {/* Row 1 — graph + stats */}
            <div className="grid gap-5 lg:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
                    <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="font-display text-sm font-semibold text-ink">Your nexus</h2>
                        </div>
                        <Link href={dashboard().url} className="text-xs font-medium text-note hover:underline">
                            Open graph →
                        </Link>
                    </div>
                    <div className="mb-1 flex items-center gap-4">
                        <LegendDot color="var(--note)" label="Notes" />
                        <LegendDot color="var(--task)" label="Tasks" />
                        <LegendDot color="var(--mark)" label="Bookmarks" />
                        <span className="ml-auto font-mono text-[11px] text-faint">hover a node</span>
                    </div>
                    <NexusGraph nodes={graph.nodes} links={graph.links} />
                </div>

                <div className="flex flex-col gap-5">
                    <StatCard icon={FileText} accent="note" value={stats.notes} label="Notes" delta={`+${stats.notesWeek}`} deltaSub="this week" />
                    <StatCard icon={SquareCheck} accent="task" value={stats.tasksOpen} label="Open tasks" delta={`${stats.tasksDueToday} due`} deltaSub="today" />
                    <StatCard icon={Bookmark} accent="mark" value={stats.bookmarks} label="Bookmarks" delta={`+${stats.bookmarksWeek}`} deltaSub="this week" />
                </div>
            </div>

            {/* Row 2 — lists */}
            <div className="mt-5 grid gap-5 md:grid-cols-3">
                <Panel title="Recent notes" accent="var(--note)" href={notesIndex().url}>
                    <ul className="space-y-3.5">
                        {recentNotes.length === 0 && <Empty>No notes yet.</Empty>}
                        {recentNotes.map(note => (
                            <li key={note.id}>
                                <p className="truncate text-sm font-medium text-ink">{note.title}</p>
                                <p className="mt-0.5 font-mono text-[11px] text-faint">
                                    edited {timeAgo(note.updated_at)} · {note.word_count} words
                                </p>
                            </li>
                        ))}
                    </ul>
                </Panel>

                <Panel title="Up next" accent="var(--task)" href={tasksIndex().url}>
                    <ul className="space-y-3.5">
                        {upNext.length === 0 && <Empty>Nothing queued.</Empty>}
                        {upNext.map(task => {
                            const done = task.status === 'done';
                            const due = dueLabel(task.due_date);
                            return (
                                <li key={task.id} className="flex items-start gap-2.5">
                                    <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${done ? 'border-note bg-note text-white' : 'border-line'}`}>
                                        {done && <Check className="h-3 w-3" strokeWidth={3} />}
                                    </span>
                                    <div className="min-w-0">
                                        <p className={`truncate text-sm font-medium ${done ? 'text-faint line-through' : 'text-ink'}`}>{task.title}</p>
                                        <p className="mt-0.5 font-mono text-[11px] text-faint">
                                            {due ? `due ${due}` : 'no due date'} · {task.priority}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </Panel>

                <Panel title="Saved lately" accent="var(--mark)" href={bookmarksIndex().url}>
                    <ul className="space-y-3.5">
                        {savedLately.length === 0 && <Empty>No bookmarks yet.</Empty>}
                        {savedLately.map(bookmark => (
                            <li key={bookmark.id}>
                                <p className="truncate text-sm font-medium text-ink">{bookmark.title}</p>
                                <p className="mt-0.5 font-mono text-[11px] text-faint">{hostname(bookmark.url)}</p>
                            </li>
                        ))}
                    </ul>
                </Panel>
            </div>

            <CreateNoteModal open={captureOpen} onOpenChange={setCaptureOpen} />
        </div>
    );
}

function LegendDot({ color, label }: { color: string; label: string }) {
    return (
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
            <span className="h-2 w-2 rounded-full" style={{ background: color }} />
            {label}
        </span>
    );
}

function Empty({ children }: { children: React.ReactNode }) {
    return <li className="text-sm text-faint">{children}</li>;
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
