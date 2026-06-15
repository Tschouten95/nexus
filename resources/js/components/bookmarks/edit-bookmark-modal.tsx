import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Bookmark {
    id: number;
    title: string;
    url: string;
    description: string | null;
}

interface Props {
    bookmark: Bookmark | null;
    onOpenChange: (open: boolean) => void;
}

export default function EditBookmarkModal({ bookmark, onOpenChange }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        title: '',
        url: '',
        description: '',
    });

    useEffect(() => {
        if (bookmark) {
            setData({
                title: bookmark.title,
                url: bookmark.url,
                description: bookmark.description ?? '',
            });
        }
    }, [bookmark]);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!bookmark) return;
        put(`/bookmarks/${bookmark.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    }

    return (
        <Dialog open={!!bookmark} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Bookmark</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="edit-title">Title</Label>
                        <Input
                            id="edit-title"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            placeholder="Bookmark title"
                        />
                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="edit-url">URL</Label>
                        <Input
                            id="edit-url"
                            type="url"
                            value={data.url}
                            onChange={e => setData('url', e.target.value)}
                            placeholder="https://example.com"
                        />
                        {errors.url && <p className="text-sm text-destructive">{errors.url}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="edit-description">Description <span className="text-muted-foreground">(optional)</span></Label>
                        <Textarea
                            id="edit-description"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            placeholder="What's this link about?"
                            rows={3}
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
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
