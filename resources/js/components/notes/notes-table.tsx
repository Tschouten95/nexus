import { useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';

interface Note { id: number; title: string; content: string; created_at: string; }
interface Props { notes?: Note[]; onEdit: (note: Note) => void; }

export default function NotesTable({ notes = [], onEdit }: Props) {
    const { delete: destroy } = useForm();

    function handleDelete(note: Note) {
        if (confirm(`Are you sure you want to delete "${note.title}"?`)) {
            destroy(`/notes/${note.id}`);
        }
    }

    if (notes.length === 0) {
        return (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
                <p className="font-medium text-foreground">No notes yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                    Create your first note to start building your nexus.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map(note => (
                <div
                    key={note.id}
                    className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                    {/* colored left edge — the "note" accent */}
                    <span className="absolute inset-y-0 left-0 w-1 bg-note" />

                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-semibold text-ink">{note.title}</h3>
                        {/* actions appear on hover */}
                        <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
                            <button
                                onClick={() => onEdit(note)}
                                className="rounded-md p-1.5 text-muted hover:bg-accent hover:text-primary"
                            >
                                <Pencil className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(note)}
                                className="rounded-md p-1.5 text-muted hover:bg-destructive/10 hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                        {note.content}
                    </p>

                    <div className="mt-4 border-t border-line-soft pt-3">
                        <span className="font-mono text-[11px] text-faint">{note.created_at}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}