import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';

interface Note {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

interface Props {
    note: Note | null;
    onOpenChange: (open: boolean) => void;
}

export default function ViewNoteModal({ note, onOpenChange }: Props) {
    return (
        <Dialog open={!!note} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl gap-0 overflow-hidden p-0">
                <div className="relative border-b border-line px-6 py-5">
                    <span className="absolute inset-y-0 left-0 w-1 rounded-tl-lg bg-note" />
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-note">
                        Note
                    </p>
                    <DialogTitle className="pr-6 font-display text-[22px] font-semibold tracking-tight text-ink">
                        {note?.title}
                    </DialogTitle>
                </div>

                <div className="min-h-[120px] px-6 py-5">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                        {note?.content}
                    </p>
                </div>

                <div className="border-t border-line-soft px-6 py-3">
                    <span className="font-mono text-[11px] text-faint">{note?.created_at}</span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
