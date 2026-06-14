import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
    useDroppable,
    type DragStartEvent,
    type DragEndEvent,
    type DragOverEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    position: number;
    due_date: string | null;
}

const COLUMNS = [
    { key: 'todo',  label: 'To do' },
    { key: 'in_progress', label: 'In progress' },
    { key: 'done',  label: 'Done' },
] as const;

const PRIORITY_STYLES: Record<string, string> = {
    high:   'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
    medium: 'bg-task-soft text-task',
    low:    'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
};

export default function Tasks({ tasks: initialTasks = [] }: { tasks: Task[] }) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [activeId, setActiveId] = useState<number | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
    );

    const activeTask = tasks.find(t => t.id === activeId) ?? null;
    const open = tasks.filter(t => t.status !== 'done').length;

    const columnOf = (id: number | string): string => {
        if (COLUMNS.some(c => c.key === id)) return id as string;
        return tasks.find(t => t.id === id)?.status ?? 'todo';
    };

    function handleDragStart(e: DragStartEvent) {
        setActiveId(Number(e.active.id));
    }

    function handleDragOver(e: DragOverEvent) {
        const { active, over } = e;
        if (!over) return;

        const activeCol = columnOf(active.id as number);
        const overCol = columnOf(over.id as number | string);
        if (activeCol === overCol) return;

        setTasks(prev =>
            prev.map(t =>
                t.id === Number(active.id) ? { ...t, status: overCol } : t
            )
        );
    }

    function handleDragEnd(e: DragEndEvent) {
        const { active, over } = e;
        setActiveId(null);
        if (!over) return;

        const draggedId = Number(active.id);
        const col = columnOf(over.id);
        const colItems = tasks.filter(t => t.status === col);

        const oldIndex = colItems.findIndex(t => t.id === draggedId);
        const newIndex = colItems.findIndex(t => t.id === over.id);

        // reorder within the column (if dropped on another card);
        // if dropped on the empty column area, keep current order
        const reordered =
            oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex
                ? arrayMove(colItems, oldIndex, newIndex)
                : colItems;

        const others = tasks.filter(t => t.status !== col);
        const updated = [
            ...others,
            ...reordered.map((t, i) => ({ ...t, status: col, position: i })),
        ];
        setTasks(updated);

        // persist the affected column to the backend
        const payload = reordered.map((t, i) => ({
            id: t.id,
            status: col,
            position: i,
        }));

        router.patch(
            '/tasks/reorder',
            { tasks: payload },
            { preserveScroll: true, preserveState: true }
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-task">
                        Tasks
                    </p>
                    <h1 className="mt-1 font-display text-[26px] font-semibold tracking-tight text-ink">
                        Your tasks
                    </h1>
                    <p className="mt-1 text-sm text-muted">
                        {open} open · {tasks.length} total
                    </p>
                </div>
                <Button className="gap-2 bg-primary text-white shadow-sm hover:bg-primary-hover">
                    <Plus className="h-4 w-4" />
                    New task
                </Button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {COLUMNS.map(col => {
                        const items = tasks
                            .filter(t => t.status === col.key)
                            .sort((a, b) => a.position - b.position);
                        return (
                            <Column key={col.key} id={col.key} label={col.label} items={items} />
                        );
                    })}
                </div>

                <DragOverlay>
                    {activeTask ? <TaskCard task={activeTask} overlay /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

function Column({ id, label, items }: { id: string; label: string; items: Task[] }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div className="flex flex-col">
            <div className="mb-3 flex items-center gap-2 px-1">
                <h2 className="font-display text-sm font-semibold text-ink">{label}</h2>
                <span className="rounded-full bg-bg-subtle px-2 py-0.5 font-mono text-[11px] text-muted">
                    {items.length}
                </span>
            </div>

            <SortableContext items={items.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div
                    ref={setNodeRef}
                    className={`flex min-h-32 flex-col gap-3 rounded-xl border p-3 transition ${
                        isOver ? 'border-task/50 bg-task-soft/40' : 'border-line bg-bg-subtle/40'
                    }`}
                >
                    {items.length === 0 ? (
                        <p className="px-1 py-6 text-center text-xs text-faint">Nothing here yet</p>
                    ) : (
                        items.map(task => <SortableTaskCard key={task.id} task={task} />)
                    )}
                </div>
            </SortableContext>
        </div>
    );
}

function SortableTaskCard({ task }: { task: Task }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: task.id });

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className={isDragging ? 'opacity-40' : ''}
            {...attributes}
            {...listeners}
        >
            <TaskCard task={task} />
        </div>
    );
}

function TaskCard({ task, overlay = false }: { task: Task; overlay?: boolean }) {
    return (
        <div
            className={`group relative cursor-grab overflow-hidden rounded-lg border border-line bg-surface p-4 shadow-sm transition active:cursor-grabbing ${
                overlay ? 'shadow-lg ring-1 ring-task/30 rotate-1' : 'hover:shadow-md'
            }`}
        >
            <span className="absolute inset-y-0 left-0 w-1 bg-task" />
            <h3 className="text-sm font-medium leading-snug text-ink">{task.title}</h3>
            {task.description && (
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
                    {task.description}
                </p>
            )}
            <div className="mt-3 flex items-center gap-2">
                <span
                    className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-medium ${
                        PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.low
                    }`}
                >
                    {task.priority}
                </span>
                {task.due_date && (
                    <span className="font-mono text-[10px] text-faint">
                        {new Date(task.due_date).toLocaleDateString()}
                    </span>
                )}
            </div>
        </div>
    );
}