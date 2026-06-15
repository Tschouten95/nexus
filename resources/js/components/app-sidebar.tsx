import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import { index as notesIndex } from '@/routes/notes';
import Brand from './brand';


const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { sidebarCounts } = usePage().props;

    const workspaceNavItems: NavItem[] = [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        { title: 'Notes',     href: notesIndex(), dot: 'bg-note', count: sidebarCounts?.notes },
        { title: 'Tasks',     href: '/tasks',     dot: 'bg-task', count: sidebarCounts?.tasks },
        { title: 'Bookmarks', href: '/bookmarks', dot: 'bg-mark', count: sidebarCounts?.bookmarks },
    ];

    return (
    <Sidebar collapsible="icon" variant="sidebar">
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{
                background:
                'radial-gradient(500px 150px at 0% 0%, rgba(37,99,235,0.30), transparent 65%)',
            }}
        />
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch className="flex items-center">
                                <Brand />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup title="Main">
                    <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                    <NavMain items={workspaceNavItems} />
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
