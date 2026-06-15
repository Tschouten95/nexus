import { useForm } from '@inertiajs/react';
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';

interface Bookmark {
    id: number;
    title: string;
    url: string;
    description: string | null;
    created_at: string;
}

interface Props {
    bookmarks?: Bookmark[];
    onEdit: (bookmark: Bookmark) => void;
    onView: (bookmark: Bookmark) => void;
}

const AVATAR_GRADIENTS = [
    'from-rose-400 to-rose-600',
    'from-violet-400 to-violet-600',
    'from-amber-400 to-amber-600',
    'from-cyan-400 to-cyan-600',
    'from-blue-400 to-blue-600',
    'from-pink-400 to-pink-600',
    'from-emerald-400 to-emerald-600',
    'from-indigo-400 to-indigo-600',
];

function avatarGradient(id: number) {
    return AVATAR_GRADIENTS[id % AVATAR_GRADIENTS.length];
}

function monogram(title: string) {
    const words = title.trim().split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return title.trim().slice(0, 2).toUpperCase();
}

function displayUrl(url: string) {
    try {
        const u = new URL(url);
        const path = u.pathname.replace(/\/$/, '');
        return (u.hostname.replace(/^www\./, '') + path).slice(0, 38);
    } catch {
        return url;
    }
}

export default function BookmarksGrid({ bookmarks = [], onEdit, onView }: Props) {
    const { delete: destroy } = useForm();

    function handleDelete(bookmark: Bookmark) {
        if (confirm(`Are you sure you want to delete "${bookmark.title}"?`)) {
            destroy(`/bookmarks/${bookmark.id}`);
        }
    }

    if (bookmarks.length === 0) {
        return (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
                <p className="font-medium text-foreground">No bookmarks yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                    Save your first link to start building your collection.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map(bookmark => (
                <div
                    key={bookmark.id}
                    onClick={() => onView(bookmark)}
                    className="group relative flex h-full cursor-pointer flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-mark/30 hover:shadow-md"
                >
                    <div className="flex items-start gap-3">
                        <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${avatarGradient(bookmark.id)} font-display text-xs font-semibold text-white shadow-sm`}
                        >
                            {monogram(bookmark.title)}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="truncate font-display text-sm font-semibold text-ink">
                                    {bookmark.title}
                                </h3>
                                <div
                                    className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <a
                                        href={bookmark.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-md p-1 text-muted hover:bg-accent hover:text-mark"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                    <button
                                        onClick={() => onEdit(bookmark)}
                                        className="rounded-md p-1 text-muted hover:bg-accent hover:text-primary"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(bookmark)}
                                        className="rounded-md p-1 text-muted hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>

                            <p className="mt-0.5 truncate font-mono text-[11px] text-mark">
                                {displayUrl(bookmark.url)}
                            </p>
                        </div>
                    </div>

                    {bookmark.description && (
                        <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-muted">
                            {bookmark.description}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
