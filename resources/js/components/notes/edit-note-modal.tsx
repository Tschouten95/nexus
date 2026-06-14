import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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

export default function EditNoteModal({ note, onOpenChange }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        title: '',
        content: '',
    });

    useEffect(() => {
        if (note) {
            setData({ title: note.title, content: note.content });
        }
    }, [note]);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!note) return;
        put(`/notes/${note.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    }

    return (
        <Dialog open={!!note} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Note</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            placeholder="Note title"
                        />
                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            value={data.content}
                            onChange={e => setData('content', e.target.value)}
                            placeholder="Write your note..."
                            rows={5}
                        />
                        {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}