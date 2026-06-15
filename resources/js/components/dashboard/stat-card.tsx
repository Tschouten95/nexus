import { type LucideIcon } from 'lucide-react';

type Accent = 'note' | 'task' | 'mark';

interface Props {
    icon: LucideIcon;
    accent: Accent;
    value: number;
    label: string;
    delta: string;
    deltaSub: string;
}

const ACCENT: Record<Accent, { icon: string; delta: string }> = {
    note: { icon: 'bg-note-soft text-note', delta: 'text-note' },
    task: { icon: 'bg-task-soft text-task', delta: 'text-task' },
    mark: { icon: 'bg-mark-soft text-mark', delta: 'text-mark' },
};

export default function StatCard({ icon: Icon, accent, value, label, delta, deltaSub }: Props) {
    const styles = ACCENT[accent];

    return (
        <div className="flex items-start justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
            <div>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${styles.icon}`}>
                    <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                </div>
                <p className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink">{value}</p>
                <p className="mt-0.5 text-sm text-muted">{label}</p>
            </div>

            <div className="text-right">
                <p className={`font-mono text-xs font-medium ${styles.delta}`}>{delta}</p>
                <p className="font-mono text-[11px] text-faint">{deltaSub}</p>
            </div>
        </div>
    );
}
