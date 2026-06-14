import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NotesTable from "@/components/notes/notes-table";
import CreateNoteModal from '@/components/notes/create-note-modal';
import EditNoteModal from '@/components/notes/edit-note-modal';

interface Note {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

interface Props {
    notes: {
        data: Note[];
    }
}

export default function Notes({ notes }: Props) {
    const [open, setOpen] = useState(false);
    const [editNote, setEditNote] = useState<Note | null>(null);

    const count = notes.data.length;

    return (
        <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
                        Notes
                    </p>
                    <h1 className="mt-1 font-display text-[26px] font-semibold tracking-tight text-ink">
                        Your notes
                    </h1>
                    <p className="mt-1 text-sm text-muted">
                        {count} {count === 1 ? 'note' : 'notes'} in your workspace
                    </p>
                </div>

                <Button
                    onClick={() => setOpen(true)}
                    className="gap-2 bg-primary text-white shadow-sm hover:bg-primary-hover"
                >
                    <Plus className="h-4 w-4" />
                    New note
                </Button>
            </div>

            <NotesTable notes={notes.data} onEdit={setEditNote} />
            <CreateNoteModal open={open} onOpenChange={setOpen} />
            <EditNoteModal note={editNote} onOpenChange={open => !open && setEditNote(null)} />
        </div>
    );
}