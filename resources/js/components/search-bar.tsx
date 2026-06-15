import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { Bookmark, FileText, Loader2, Search, SquareCheckBig } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type ResultType = 'note' | 'task' | 'bookmark';

interface SearchResult {
    type: ResultType;
    id: number;
    title: string;
    url: string;
    status?: string;
    subtitle?: string;
}

const TYPE_LABELS: Record<ResultType, string> = {
    note:     'Notes',
    task:     'Tasks',
    bookmark: 'Bookmarks',
};

const TYPE_ICONS: Record<ResultType, React.ReactNode> = {
    note:     <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />,
    task:     <SquareCheckBig className="h-4 w-4 shrink-0 text-muted-foreground" />,
    bookmark: <Bookmark className="h-4 w-4 shrink-0 text-muted-foreground" />,
};

export function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (query.trim().length < 2) {
            setResults([]);
            setOpen(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/search?q=${encodeURIComponent(query.trim())}`, {
                    headers: { Accept: 'application/json' },
                });
                const data: SearchResult[] = await res.json();
                setResults(data);
                setOpen(true);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleSelect(result: SearchResult) {
        setOpen(false);
        setQuery('');
        router.visit(`${result.url}?view=${result.id}`);
    }

    const grouped = results.reduce<Partial<Record<ResultType, SearchResult[]>>>((acc, r) => {
        (acc[r.type] ??= []).push(r);
        return acc;
    }, {});

    return (
        <div ref={containerRef} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            {loading && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
            <Input
                type="search"
                placeholder="Search notes, tasks, bookmarks..."
                className="w-96 pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setOpen(true)}
            />

            {open && results.length > 0 && (
                <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover shadow-md">
                    {(Object.entries(grouped) as [ResultType, SearchResult[]][]).map(([type, items]) => (
                        <div key={type}>
                            <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                                {TYPE_LABELS[type]}
                            </div>
                            {items.map((result) => (
                                <button
                                    key={`${result.type}-${result.id}`}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                    onMouseDown={() => handleSelect(result)}
                                >
                                    {TYPE_ICONS[result.type]}
                                    <span className="truncate">{result.title}</span>
                                    {result.status && (
                                        <span className="ml-auto shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground">
                                            {String(result.status).replace(/_/g, ' ')}
                                        </span>
                                    )}
                                    {result.subtitle && !result.status && (
                                        <span className="ml-auto shrink-0 max-w-[140px] truncate font-mono text-[11px] text-muted-foreground">
                                            {result.subtitle}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {open && query.trim().length >= 2 && results.length === 0 && !loading && (
                <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border border-border bg-popover px-3 py-4 text-center text-sm text-muted-foreground shadow-md">
                    No results for &ldquo;{query}&rdquo;
                </div>
            )}
        </div>
    );
}
