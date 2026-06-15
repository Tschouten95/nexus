import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { ExternalLink } from 'lucide-react';

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface Bookmark {
    id: number;
    title: string;
    url: string;
    description: string | null;
    created_at: string;
}

interface Props {
    bookmark: Bookmark | null;
    onOpenChange: (open: boolean) => void;
}

export default function ViewBookmarkModal({ bookmark, onOpenChange }: Props) {
    return (
        <Dialog open={!!bookmark} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl gap-0 overflow-hidden p-0">
                <div className="relative border-b border-line px-6 py-5">
                    <span className="absolute inset-y-0 left-0 w-1 rounded-tl-lg bg-mark" />
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-mark">
                        Bookmark
                    </p>
                    <DialogTitle className="pr-6 font-display text-[22px] font-semibold tracking-tight text-ink">
                        {bookmark?.title}
                    </DialogTitle>
                </div>

                <div className="px-6 py-4">
                    <a
                        href={bookmark?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-sm text-mark hover:underline"
                    >
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        <span className="break-all">{bookmark?.url}</span>
                    </a>
                </div>

                {bookmark?.description ? (
                    <div className="min-h-[60px] px-6 pb-4">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                            {bookmark.description}
                        </p>
                    </div>
                ) : (
                    <div className="min-h-[60px] px-6 pb-4">
                        <p className="text-sm text-faint">No description.</p>
                    </div>
                )}

                <div className="border-t border-line-soft px-6 py-3">
                    <span className="font-mono text-[11px] text-faint">{bookmark ? formatDate(bookmark.created_at) : ''}</span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
