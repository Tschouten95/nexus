import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';

export default function Dashboard() {
    return (
        <>
            <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg">
            New note
            </button>

            <div className="bg-surface border border-line rounded-xl p-5">
            <h3 className="text-ink font-semibold">Inertia shared props</h3>
            <p className="text-muted text-sm">edited 2h ago</p>
            <span className="bg-task-soft text-task px-2 py-0.5 rounded-full text-xs">high</span>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
