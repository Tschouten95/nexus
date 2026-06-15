import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: string | null;
}

interface Props {
    task: Task | null;
    onOpenChange: (open: boolean) => void;
}

const STATUS_LABELS: Record<string, string> = {
    todo: 'To do',
    in_progress: 'In progress',
    done: 'Done',
};

const PRIORITY_STYLES: Record<string, string> = {
    high:   'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
    medium: 'bg-task-soft text-task',
    low:    'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
};

export default function ViewTaskModal({ task, onOpenChange }: Props) {
    return (
        <Dialog open={!!task} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl gap-0 overflow-hidden p-0">
                <div className="relative border-b border-line px-6 py-5">
                    <span className="absolute inset-y-0 left-0 w-1 rounded-tl-lg bg-task" />
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-task">
                        Task
                    </p>
                    <DialogTitle className="pr-6 font-display text-[22px] font-semibold tracking-tight text-ink">
                        {task?.title}
                    </DialogTitle>
                </div>

                <div className="px-6 pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                        {task?.status && (
                            <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                                {STATUS_LABELS[task.status] ?? task.status}
                            </span>
                        )}
                        {task?.priority && (
                            <span className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-medium capitalize ${PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.low}`}>
                                {task.priority}
                            </span>
                        )}
                        {task?.due_date && (
                            <span className="font-mono text-[11px] text-faint">
                                Due {new Date(task.due_date).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="min-h-[100px] px-6 py-4">
                    {task?.description ? (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                            {task.description}
                        </p>
                    ) : (
                        <p className="text-sm text-faint">No description.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
