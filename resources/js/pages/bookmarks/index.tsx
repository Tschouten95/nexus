import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookmarksGrid from '@/components/bookmarks/bookmarks-grid';
import CreateBookmarkModal from '@/components/bookmarks/create-bookmark-modal';
import EditBookmarkModal from '@/components/bookmarks/edit-bookmark-modal';
import ViewBookmarkModal from '@/components/bookmarks/view-bookmark-modal';

interface Bookmark {
    id: number;
    title: string;
    url: string;
    description: string | null;
    created_at: string;
}

interface Props {
    bookmarks: Bookmark[];
}

export default function Bookmarks({ bookmarks }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editBookmark, setEditBookmark] = useState<Bookmark | null>(null);
    const [viewBookmark, setViewBookmark] = useState<Bookmark | null>(() => {
        const id = Number(new URLSearchParams(window.location.search).get('view'));
        return id ? (bookmarks.find(b => b.id === id) ?? null) : null;
    });

    function handleViewClose() {
        setViewBookmark(null);
        window.history.replaceState(null, '', window.location.pathname);
    }

    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const addedThisWeek = bookmarks.filter(b => new Date(b.created_at).getTime() >= weekAgo).length;

    const filters = ['All', 'Docs', 'Articles', 'Tools', 'Unread'];
    const [activeFilter, setActiveFilter] = useState('All');

    return (
        <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mark">
                        Bookmarks
                    </p>
                    <h1 className="mt-1 font-display text-[26px] font-semibold tracking-tight text-ink">
                        Bookmarks
                    </h1>
                    <p className="mt-1 text-sm text-muted">
                        {bookmarks.length} saved
                        {addedThisWeek > 0 && (
                            <> · {addedThisWeek} added this week</>
                        )}
                    </p>
                </div>

                <Button
                    onClick={() => setCreateOpen(true)}
                    className="gap-2 bg-primary text-white shadow-sm hover:bg-primary-hover"
                >
                    <Plus className="h-4 w-4" />
                    Add bookmark
                </Button>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
                {filters.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={
                            activeFilter === filter
                                ? 'rounded-lg bg-ink px-3.5 py-1.5 text-xs font-medium text-white'
                                : 'rounded-lg border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted transition hover:border-mark/30 hover:text-ink'
                        }
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <BookmarksGrid bookmarks={bookmarks} onEdit={setEditBookmark} onView={setViewBookmark} />

            <CreateBookmarkModal open={createOpen} onOpenChange={setCreateOpen} />
            <EditBookmarkModal bookmark={editBookmark} onOpenChange={(open) => { if (!open) setEditBookmark(null); }} />
            <ViewBookmarkModal bookmark={viewBookmark} onOpenChange={(open) => { if (!open) handleViewClose(); }} />
        </div>
    );
}
